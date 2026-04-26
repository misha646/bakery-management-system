import random
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import connection, transaction, models
from django.db.models import Sum, Count, Q
from django.utils.timezone import now
from django.contrib.auth import authenticate, login
from decimal import Decimal
from datetime import date

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.authtoken.models import Token 
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser   # add this import at top

from .models import (
    UserMst, ProductMst, BranchMst, CategoryMst, 
    CustomerMst, SupplierMst, IssueMst, InventoryMst, 
    ProductionMst, RecipeMst, OrderMst, OrderDetail,
    ItemMst, ProductionPlan, RawMaterialMst, RawMaterialRecipe   # added RawMaterialRecipe
)
from .serializers import (
    UserSerializer, ProductSerializer, BranchSerializer, 
    CategorySerializer, CustomerSerializer, SupplierSerializer, 
    IssueSerializer, InventorySerializer, ProductionSerializer,
    OrderSerializer, ProductionPlanSerializer, RawMaterialSerializer,
    RawMaterialRecipeSerializer   # added RawMaterialRecipeSerializer
)

# =====================================================
# 1. AUTHENTICATION & ACCOUNT MANAGEMENT
# =====================================================

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        username = request.data.get('username') or request.data.get('user_name')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if not user.is_active:
                return Response({"error": "Account is inactive"}, status=status.HTTP_403_FORBIDDEN)
            
            login(request, user)
            
            token, _ = Token.objects.get_or_create(user=user)
            
            serializer = UserSerializer(user)
            response_data = serializer.data
            response_data['token'] = token.key
            
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class ActivationView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 

    def post(self, request):
        try:
            user = UserMst.objects.get(user_name=request.data.get('username'))
            user.set_password(request.data.get('password'))
            user.security_key = request.data.get('security_key')
            user.is_first_login = 0
            user.save()
            return Response({"message": "Account activated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            user = UserMst.objects.get(
                user_name=request.data.get('username'), 
                security_key=request.data.get('security_key')
            )
            user.set_password(request.data.get('new_password'))
            user.save()
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid verification data"}, status=status.HTTP_401_UNAUTHORIZED)

# =====================================================
# 2. CORE VIEWSETS (With Multi-Tenant Isolation)
# =====================================================

class BaseBranchViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] 
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        queryset = self.model.objects.all()
        user = self.request.user
        
        if not user or user.is_anonymous:
            return queryset.none()

        role = str(getattr(user, 'designation', '')).lower()
        
        if role == 'admin':
            branch_id = self.request.query_params.get('branch_id')
            if branch_id and branch_id not in ['All', 'undefined', 'null', '']:
                if hasattr(self.model, 'fk_branch_id'):
                    return queryset.filter(fk_branch_id=branch_id)
                elif hasattr(self.model, 'fk_branch'):
                    return queryset.filter(fk_branch=branch_id)
            return queryset

        if hasattr(self.model, 'fk_branch_id'):
            return queryset.filter(fk_branch_id=user.fk_branch_id)
        elif hasattr(self.model, 'fk_branch'):
            return queryset.filter(fk_branch=user.fk_branch)
        return queryset
    
@method_decorator(csrf_exempt, name='dispatch')
class UserViewSet(BaseBranchViewSet):
    model = UserMst
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        otp = str(random.randint(100000, 999999))
        data = request.data.copy()
        if not data.get('fk_city'): 
            data['fk_city'] = 1 

        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                user = serializer.save()
                
                user.set_password(otp)
                user.security_key = otp
                user.is_first_login = 1
                user.save()
                
                response_data = serializer.data
                response_data['generated_otp'] = otp
                return Response(response_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        """Force branch for non-admin users (branch managers)."""
        user = self.request.user
        role = str(getattr(user, 'designation', '')).lower()
        if role != 'admin':
            serializer.save(fk_branch=user.fk_branch)
        else:
            serializer.save()

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        actor = request.user
        data = request.data.copy()
        
        # Prevent non-admin (branch manager) from changing a user's branch
        actor_role = str(getattr(actor, 'designation', '')).lower()
        if actor_role != 'admin' and 'fk_branch' in data:
            data.pop('fk_branch')
        
        is_self_update = (instance.user_id == actor.user_id)
        new_password = data.get('new_password')
        
        sensitive_fields = ['email', 'designation', 'fk_branch', 'role']
        is_sensitive_update = any(field in data for field in sensitive_fields)
        needs_verification = new_password or not is_self_update or is_sensitive_update
        
        if needs_verification:
            old_password = data.get('old_password')
            passkey = data.get('security_key_verify')
            
            if not old_password or not passkey:
                return Response(
                    {"error": "Identity Verification Required: Please enter your current password and security passkey."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if not actor.check_password(str(old_password).strip()):
                return Response(
                    {"error": "Verification Failed: The current password entered does not match our records."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if str(passkey).strip() != str(actor.security_key).strip():
                return Response(
                    {"error": "Verification Failed: Invalid Security Passkey provided."}, 
                    status=status.HTTP_403_FORBIDDEN
                )

        try:
            with transaction.atomic():
                if new_password:
                    instance.set_password(str(new_password))
                    instance.save()
                    return Response({"message": "Password updated successfully."}, status=200)

                update_data = data.copy()
                update_data.pop('old_password', None)
                update_data.pop('security_key_verify', None)

                serializer = self.get_serializer(instance, data=update_data, partial=True)
                serializer.is_valid(raise_exception=True)
                updated_instance = serializer.save()

                if is_self_update:
                    for attr, value in serializer.data.items():
                        if hasattr(actor, attr):
                            setattr(actor, attr, value)

                return Response(serializer.data)
                
        except Exception as e:
            return Response({"error": f"Database Commit Failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class ProductionViewSet(BaseBranchViewSet):
    model = ProductionMst
    serializer_class = ProductionSerializer

    def get_queryset(self):
        return super().get_queryset().order_by('-production_date')

    def create(self, request, *args, **kwargs):
        active_branch = getattr(request.user, 'fk_branch_id', 1)
        data = request.data.copy()
        data['fk_branch'] = active_branch
        data['fk_produced_by'] = request.user.user_id

        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                
                qty_produced = Decimal(str(data.get('produced_quantity', 0)))
                product_id = data.get('fk_product')

                fg_bridge, _ = ItemMst.objects.get_or_create(item_type='product', ref_id=product_id)
                inventory_fg, _ = InventoryMst.objects.select_for_update().get_or_create(
                    fk_branch_id=active_branch,
                    fk_item=fg_bridge,
                    defaults={'quantity': 0}
                )
                inventory_fg.quantity += qty_produced
                inventory_fg.save()

                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class ProductionPlanViewSet(BaseBranchViewSet):
    model = ProductionPlan
    serializer_class = ProductionPlanSerializer

    def get_queryset(self):
        user = self.request.user
        role = str(getattr(user, 'designation', '')).lower()
        queryset = ProductionPlan.objects.all().order_by('-created_at')

        if role == 'admin':
            return queryset

        if 'manager' in role:
            return queryset.filter(fk_branch_id=user.fk_branch_id)

        return queryset.filter(fk_assigned_to=user)

    def perform_create(self, serializer):
        assigned_user = serializer.validated_data.get('fk_assigned_to')
        if assigned_user:
            serializer.save(fk_branch=assigned_user.fk_branch)
        else:
            serializer.save(fk_branch=self.request.user.fk_branch)

    def partial_update(self, request, *args, **kwargs):
        user = self.request.user
        role = str(getattr(user, 'designation', '')).lower()
        instance = self.get_object()

        # Admin can always edit
        if role == 'admin':
            return super().partial_update(request, *args, **kwargs)

        # Branch manager can edit any plan belonging to his branch
        if 'manager' in role:
            if instance.fk_branch_id == user.fk_branch_id:
                # Allow edit, including completion
                new_status = request.data.get('plan_status')
                if new_status == 'Completed':
                    # Use the same completion logic as before
                    actual_qty = Decimal(str(request.data.get('produced_quantity', instance.planned_quantity)))
                    with transaction.atomic():
                        # 1. Consume raw materials (if recipe exists)
                        recipes = RawMaterialRecipe.objects.filter(fk_product_id=instance.fk_product_id)
                        if recipes.exists():
                            for recipe in recipes:
                                required = recipe.required_quantity * actual_qty
                                raw_item, _ = ItemMst.objects.get_or_create(
                                    item_type='raw',
                                    ref_id=recipe.fk_raw_material_id
                                )
                                inv, _ = InventoryMst.objects.select_for_update().get_or_create(
                                    fk_branch=instance.fk_branch,
                                    fk_item=raw_item,
                                    defaults={'quantity': 0}
                                )
                                if inv.quantity < required:
                                    raw_name = recipe.fk_raw_material.raw_material_name
                                    raise Exception(f"Insufficient raw material: {raw_name} (need {required}, available {inv.quantity})")
                                inv.quantity -= required
                                inv.save()

                        # 2. Record history in ProductionMst
                        ProductionMst.objects.create(
                            fk_production_plan=instance,
                            fk_branch=instance.fk_branch,
                            fk_product=instance.fk_product,
                            fk_produced_by=user,
                            produced_quantity=actual_qty,
                            production_date=now().date()
                        )

                        # 3. Add finished goods inventory
                        fg_bridge, _ = ItemMst.objects.get_or_create(item_type='product', ref_id=instance.fk_product_id)
                        inv_fg, _ = InventoryMst.objects.select_for_update().get_or_create(
                            fk_branch=instance.fk_branch,
                            fk_item=fg_bridge,
                            defaults={'quantity': 0}
                        )
                        inv_fg.quantity += actual_qty
                        inv_fg.save()

                        # 4. Mark plan as finalized
                        instance.plan_status = 'Completed'
                        instance.save()

                    return Response({'message': 'Production batch finalized and inventory updated'}, status=200)

                return super().partial_update(request, *args, **kwargs)
            else:
                return Response(
                    {"error": "Unauthorized: You can only edit plans for your own branch."},
                    status=status.HTTP_403_FORBIDDEN
                )

        # Assigned staff can edit their own plan
        if instance.fk_assigned_to == user:
            return super().partial_update(request, *args, **kwargs)

        return Response(
            {"error": "Unauthorized: This batch is not assigned to you or your branch."},
            status=status.HTTP_403_FORBIDDEN
        )


@method_decorator(csrf_exempt, name='dispatch')
class InventoryViewSet(BaseBranchViewSet):
    model = InventoryMst
    serializer_class = InventorySerializer

    def create(self, request, *args, **kwargs):
        item_id = request.data.get('fk_item')
        active_branch_id = request.data.get('fk_branch') or getattr(request.user, 'fk_branch_id', 1)
        
        if not item_id:
            return Response(
                {"error": "Selection required: Please choose a valid product or raw material to register in branch inventory."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Determine if the fk_item is a product or raw material
            from .models import RawMaterialMst, ProductMst
            try:
                product = ProductMst.objects.get(product_id=item_id)
                item_type = 'product'
                ref_id = product.product_id
            except ProductMst.DoesNotExist:
                try:
                    raw = RawMaterialMst.objects.get(raw_material_id=item_id)
                    item_type = 'raw'
                    ref_id = raw.raw_material_id
                except RawMaterialMst.DoesNotExist:
                    return Response(
                        {"error": f"Invalid item ID: {item_id}. No product or raw material found."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            item_bridge, _ = ItemMst.objects.get_or_create(
                item_type=item_type,
                ref_id=ref_id
            )
            
            data = request.data.copy()
            data['fk_item'] = item_bridge.item_id
            data['fk_branch'] = active_branch_id
            
            if 'reorder_level' not in data:
                data['reorder_level'] = 10.00

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Database Link Failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        reorder_status = data.get('reorder_status')
        last_reorder_qty = data.get('last_reorder_qty')

        try:
            with transaction.atomic():
                if reorder_status == 'Fulfilled' and instance.reorder_status == 'Pending':
                    add_qty = Decimal(str(last_reorder_qty or getattr(instance, 'last_reorder_qty', 0)))
                    instance.quantity = Decimal(str(instance.quantity)) + add_qty
                    instance.reorder_status = 'Fulfilled'
                    instance.save()
                
                serializer = self.get_serializer(instance, data=data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                
                return Response(serializer.data)
        except Exception as e:
            return Response({"error": f"Update failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
@method_decorator(csrf_exempt, name='dispatch')
class RawMaterialViewSet(viewsets.ModelViewSet):   # Changed from ReadOnlyModelViewSet
    queryset = RawMaterialMst.objects.all()
    serializer_class = RawMaterialSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    # No explicit parser_classes needed – default includes JSONParser

@method_decorator(csrf_exempt, name='dispatch')
class RawMaterialRecipeViewSet(viewsets.ModelViewSet):
    queryset = RawMaterialRecipe.objects.all()
    serializer_class = RawMaterialRecipeSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

@method_decorator(csrf_exempt, name='dispatch')
class OrderViewSet(BaseBranchViewSet):
    model = OrderMst
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        active_branch_id = getattr(request.user, 'fk_branch_id', 1) 
        
        if not data.get('order_date'):
            data['order_date'] = now().date().isoformat()

        try:
            with transaction.atomic():
                if data.get('fk_customer') == "walkin" or not data.get('fk_customer'):
                    data['fk_customer'] = None

                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                
                order = serializer.save(
                    fk_branch_id=active_branch_id,
                    fk_user=request.user,
                    payment_status=data.get('payment_status', 'paid'),
                    payment_terms=data.get('payment_terms', 'Immediate')
                )

                for item in data.get('items', []):
                    p_id = item.get('fk_product') or item.get('id')
                    qty_sold = Decimal(str(item.get('quantity') or 0))
                    
                    product_bridge = ItemMst.objects.get(item_type='product', ref_id=p_id)
                    inventory_item = InventoryMst.objects.select_for_update().get(
                        fk_branch_id=active_branch_id,
                        fk_item=product_bridge
                    )

                    if inventory_item.quantity < qty_sold:
                        p_obj = ProductMst.objects.get(product_id=p_id)
                        raise Exception(f"Insufficient stock for {p_obj.product_name}")

                    inventory_item.quantity -= qty_sold
                    inventory_item.save()

                    OrderDetail.objects.create(
                        fk_order=order,
                        fk_product_id=p_id,
                        quantity=qty_sold,
                        unit_price=Decimal(str(item.get('unit_price') or item.get('price') or 0)),
                        discount_amount=Decimal(str(item.get('discount_amount', 0)))
                    )

                full_serializer = self.get_serializer(order)
                return Response(full_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        active_branch_id = instance.fk_branch_id

        try:
            with transaction.atomic():
                for detail in instance.details.all():
                    product_bridge = ItemMst.objects.get(item_type='product', ref_id=detail.fk_product_id)
                    inventory_item = InventoryMst.objects.select_for_update().get(
                        fk_branch_id=active_branch_id,
                        fk_item=product_bridge
                    )
                    inventory_item.quantity += detail.quantity
                    inventory_item.save()

                instance.delete()
                return Response({"message": "Order successfully cancelled and inventory restored."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": f"Cancellation failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

@method_decorator(csrf_exempt, name='dispatch')
class CustomerViewSet(BaseBranchViewSet):
    model = CustomerMst
    serializer_class = CustomerSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if 'phone' in data and 'customer_phone' not in data:
            data['customer_phone'] = data['phone']

        active_branch_id = getattr(request.user, 'fk_branch_id', None) or 1
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(fk_branch_id=active_branch_id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class IssueViewSet(BaseBranchViewSet):
    model = IssueMst
    serializer_class = IssueSerializer

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return IssueMst.objects.none()
        
        role = str(getattr(user, 'designation', '')).lower()
        queryset = IssueMst.objects.all().order_by('-created_at')

        if role == 'admin':
            return queryset
        
        if 'manager' in role:
            return queryset.filter(
                Q(fk_reported_by=user) | 
                Q(fk_reported_to=user)
            ).distinct()
        
        return queryset.filter(fk_reported_by=user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = self.request.user
        role = str(getattr(user, 'designation', '')).lower()

        is_recipient = (instance.fk_reported_to == user)
        
        if role != 'admin' and not is_recipient:
            return Response(
                {"error": "Unauthorized: Only the assigned recipient or an Admin can update this issue."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        return super().partial_update(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(
            fk_reported_by=self.request.user, 
            fk_branch=self.request.user.fk_branch,
            issue_status='open'
        )


@method_decorator(csrf_exempt, name='dispatch')
class CategoryViewSet(BaseBranchViewSet):
    model = CategoryMst
    queryset = CategoryMst.objects.all().prefetch_related('branches')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        user = self.request.user
        role = str(getattr(user, 'designation', '')).lower()
        
        if role == 'admin':
            return self.queryset

        branch_id = getattr(user, 'fk_branch_id', None)
        if branch_id:
            return self.queryset.filter(branches__branch_id=branch_id).distinct()
            
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save()


@method_decorator(csrf_exempt, name='dispatch')
class ProductViewSet(viewsets.ModelViewSet):
    queryset = ProductMst.objects.all().prefetch_related('fk_category__branches')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    parser_classes = (MultiPartParser, FormParser, JSONParser)   # ← added JSONParser

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        user = self.request.user
        role = str(getattr(user, 'designation', '')).lower()
        queryset = self.queryset

        if role == 'admin':
            return queryset

        branch_id = getattr(user, 'fk_branch_id', None)
        if branch_id:
            return queryset.filter(
                fk_category__branches__branch_id=branch_id
            ).distinct()
            
        return queryset.none()

    def create(self, request, *args, **kwargs):
        role = str(getattr(request.user, 'designation', '')).lower()
        if role != 'admin' and 'manager' not in role:
            return Response(
                {"error": "Unauthorized: Only Management can register new products."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)    

@method_decorator(csrf_exempt, name='dispatch')
class BranchViewSet(viewsets.ModelViewSet):
    queryset = BranchMst.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]


@method_decorator(csrf_exempt, name='dispatch')
class SupplierViewSet(BaseBranchViewSet):
    model = SupplierMst
    queryset = SupplierMst.objects.all().prefetch_related('branches')
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return self.queryset.none()

        role = str(getattr(user, 'designation', '')).lower()
        if role == 'admin':
            return self.queryset

        branch_id = getattr(user, 'fk_branch_id', None)
        if branch_id:
            from django.db.models import Q
            # ✅ Fixed: use branches__branch_id (not branches__id)
            return self.queryset.filter(
                Q(branches__branch_id=branch_id) | Q(branches__isnull=True)
            ).distinct()
        return self.queryset.filter(branches__isnull=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        print(f"DEBUG: Supplier count = {queryset.count()}")
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save()

# Analytics Views
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get(self, request):
        user = request.user
        role = str(getattr(user, 'designation', '')).lower()
        today = date.today()
        branch_id = user.fk_branch_id if role != 'admin' else request.query_params.get('branch_id')
        
        orders = OrderMst.objects.filter(order_date=today)
        production = ProductionMst.objects.filter(production_date=today)

        if branch_id and branch_id not in ['All', 'undefined', 'null', '']:
            orders = orders.filter(fk_branch_id=branch_id)
            production = production.filter(fk_branch_id=branch_id)

        stats = {
            "total_revenue": orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0,            
            "orders_count": orders.count(),
            "production_total": production.aggregate(Sum('produced_quantity'))['produced_quantity__sum'] or 0,
        }
        return Response(stats)

class ReportDataView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get(self, request):
        user = request.user
        role = str(getattr(user, 'designation', '')).lower()
        rpt_type = request.query_params.get('report_type', 'summary')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        branch_id = user.fk_branch_id if role != 'admin' else request.query_params.get('branch_id')

        if rpt_type == 'summary':
            sales_qs = OrderMst.objects.all()
            prod_qs = ProductionMst.objects.all()

            if branch_id and branch_id not in ['All', 'undefined', 'null', '']:
                sales_qs = sales_qs.filter(fk_branch_id=branch_id)
                prod_qs = prod_qs.filter(fk_branch_id=branch_id)
            
            if start_date and end_date:
                sales_qs = sales_qs.filter(order_date__range=[start_date, end_date])
                prod_qs = prod_qs.filter(production_date__range=[start_date, end_date])
            
            return Response({
                "sales_summary": sales_qs.aggregate(total_revenue=Sum('total_amount'), orders_count=Count('order_id')),
                "production_summary": prod_qs.aggregate(completed_production=Sum('produced_quantity')),
                "payment_modes": list(sales_qs.values('payment_mode').annotate(count=Count('order_id')))
            })

        mapping = {
            'orders': (OrderMst, OrderSerializer, 'order_date'),
            'production': (ProductionMst, ProductionSerializer, 'production_date'),
            'issues': (IssueMst, IssueSerializer, 'created_at'),
            'customers': (CustomerMst, CustomerSerializer, None),
            'products': (ProductMst, ProductSerializer, None),
            'inventory': (InventoryMst, InventorySerializer, None),
            'users': (UserMst, UserSerializer, None),
            'branches': (BranchMst, BranchSerializer, None),                # new
            'suppliers': (SupplierMst, SupplierSerializer, None),          # new
            'production_plans': (ProductionPlan, ProductionPlanSerializer, 'plan_start_date'),  # new
            'categories': (CategoryMst, CategorySerializer, None),   # add this line

        }

        if rpt_type in mapping:
            model, serializer_class, date_field = mapping[rpt_type]
            queryset = model.objects.all()
            
            if branch_id and branch_id not in ['All', 'undefined', 'null', '']:
                if hasattr(model, 'fk_branch_id'):
                    queryset = queryset.filter(fk_branch_id=branch_id)
                elif hasattr(model, 'fk_branch'):
                    queryset = queryset.filter(fk_branch=branch_id)

            if date_field and start_date and end_date:
                queryset = queryset.filter(**{f"{date_field}__range": [start_date, end_date]})
            
            if date_field:
                queryset = queryset.order_by(f'-{date_field}')

            serializer = serializer_class(queryset, many=True)
            return Response(serializer.data)

        return Response({"error": "Invalid report type"}, status=400)