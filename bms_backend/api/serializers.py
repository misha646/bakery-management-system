from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.core.validators import RegexValidator
from rest_framework import serializers
from .models import (
    UserMst, ProductMst, CategoryMst, BranchMst, 
    CustomerMst, InventoryMst, SupplierMst, IssueMst,
    ProductionMst, CityMst, OrderMst, OrderDetail, 
    RecipeMst, ItemMst, RawMaterialMst, UnitMst, ProductionPlan,
    RawMaterialRecipe   # added
)

# --- 1. RELATIONSHIP SERIALIZERS ---

class OrderDetailSerializer(serializers.ModelSerializer):
    # Standardizing primary key as 'id' for the frontend
    id = serializers.IntegerField(source='order_item_id', read_only=True)
    product_name = serializers.CharField(source='fk_product.product_name', read_only=True)
    # Correct mapping for price based on unit_price field
    price = serializers.DecimalField(source='unit_price', max_digits=12, decimal_places=2)

    class Meta:
        model = OrderDetail
        fields = ['id', 'fk_product', 'product_name', 'quantity', 'price', 'discount_amount']

class RecipeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='recipe_id', read_only=True)
    ingredient_name = serializers.ReadOnlyField(source='fk_ingredient.product_name')

    class Meta:
        model = RecipeMst
        fields = ['id', 'recipe_id', 'fk_finished_good', 'fk_ingredient', 'ingredient_name', 'required_quantity']

class RawMaterialRecipeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='recipe_id', read_only=True)
    raw_material_name = serializers.CharField(source='fk_raw_material.raw_material_name', read_only=True)

    class Meta:
        model = RawMaterialRecipe
        fields = ['id', 'fk_product', 'fk_raw_material', 'raw_material_name', 'required_quantity']
        

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='product_id', read_only=True)
    product_id = serializers.IntegerField(read_only=True)
    category_name = serializers.CharField(source='fk_category.category_name', read_only=True)
    image = serializers.ImageField(write_only=True, required=False)
    image_full_url = serializers.SerializerMethodField(read_only=True)
    
    assigned_branches = serializers.SerializerMethodField()
    fk_branch_ids = serializers.SerializerMethodField()

    class Meta:
        model = ProductMst
        fields = [
            'id', 'product_id', 'product_name', 'fk_category', 'category_name', 
            'cost_price', 'base_price', 'product_code', 'is_active',
            'recipe_instructions', 'image_url', 'image_full_url', 'unit', 'image',
            'assigned_branches', 'fk_branch_ids'
        ]
        extra_kwargs = {
            'product_code': {'allow_blank': True, 'required': False},
            'recipe_instructions': {'allow_blank': True, 'required': False},
            'unit': {'allow_blank': True, 'required': False},
        }

    def get_assigned_branches(self, obj):
        branches = obj.fk_category.branches.all()
        if not branches.exists():
            return "Global (All Branches)"
        return ", ".join([b.branch_name for b in branches])

    def get_fk_branch_ids(self, obj):
        return list(obj.fk_category.branches.values_list('branch_id', flat=True))

    def get_image_full_url(self, obj):
        """Return full URL for the image"""
        if obj.image_url:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/media/{obj.image_url}')
            return f'/media/{obj.image_url}'
        return None

    def create(self, validated_data):
        # Convert empty strings to None for optional fields
        for field in ['product_code', 'recipe_instructions', 'unit']:
            if field in validated_data and validated_data[field] == '':
                validated_data[field] = None
        
        image = validated_data.pop('image', None)
        
        instance = super().create(validated_data)
        
        if image:
            import os
            from django.core.files.storage import default_storage
            from django.core.files.base import ContentFile
            
            # Generate unique filename
            filename = f"products/{instance.product_id}_{image.name.replace(' ', '_')}"
            filename = filename.lower()
            
            # Save file
            saved_path = default_storage.save(filename, ContentFile(image.read()))
            instance.image_url = saved_path
            instance.save()
            
        return instance

    def update(self, instance, validated_data):
        # Convert empty strings to None for optional fields
        for field in ['product_code', 'recipe_instructions', 'unit']:
            if field in validated_data and validated_data[field] == '':
                validated_data[field] = None
        
        image = validated_data.pop('image', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if image:
            import os
            from django.core.files.storage import default_storage
            from django.core.files.base import ContentFile
            
            # Delete old image if exists
            if instance.image_url and default_storage.exists(instance.image_url):
                default_storage.delete(instance.image_url)
            
            # Save new image
            filename = f"products/{instance.product_id}_{image.name.replace(' ', '_')}"
            filename = filename.lower()
            
            saved_path = default_storage.save(filename, ContentFile(image.read()))
            instance.image_url = saved_path
            
        instance.save()
        return instance
    
class RawMaterialSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='raw_material_id', read_only=True)
    raw_material_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = RawMaterialMst
        fields = ['id', 'raw_material_id', 'raw_material_name', 'cost_price', 'is_active', 'category', 'fk_unit']

class UserSerializer(serializers.ModelSerializer):
    # 1. Standardizing Identity Reflection for Frontend
    id = serializers.IntegerField(source='user_id', read_only=True)
    user_id = serializers.IntegerField(read_only=True)
    fullName = serializers.CharField(source='user_name', read_only=True)
    username = serializers.CharField(source='user_name', read_only=True)
    branch_name = serializers.CharField(source='fk_branch.branch_name', read_only=True, allow_null=True)
    role = serializers.CharField(source='designation', read_only=True)
    
    # 2. Branch Isolation Support
    fk_branch_id = serializers.ReadOnlyField(source='fk_branch.branch_id')
    fk_branch = serializers.PrimaryKeyRelatedField(
        queryset=BranchMst.objects.all(),
        write_only=True,
        required=False
    )

    # 3. Secure Data Mapping: Links UI keys to MySQL Column Names
    phone = serializers.CharField(source='phone_number', required=False, allow_null=True)
    residential_address = serializers.CharField(source='address', required=False, allow_null=True)

    class Meta:
        model = UserMst
        fields = [
            'id', 'user_id', 'user_name', 'username', 'fullName', 'email', 
            'password', 'role', 'designation', 'is_active', 
            'fk_branch', 'branch_name', 'fk_branch_id',
            'is_first_login', 'phone', 'residential_address',
            'date_of_birth', 'date_of_joining', 'security_key'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'designation': {'required': False, 'allow_null': True},
            'security_key': {'read_only': True} 
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)
    

class BranchSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='branch_id', read_only=True)
    branch_id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source='branch_name', required=False)
    city_name = serializers.CharField(source='fk_city.city_name', read_only=True)  # NEW

    class Meta:
        model = BranchMst
        fields = ['id', 'branch_id', 'name', 'branch_name', 'city_name', 'address', 'phone_number1', 'phone_number2', 'is_active', 'fk_city']


class CategorySerializer(serializers.ModelSerializer):
    # CRITICAL FIX: Explicitly include both id and category_id
    id = serializers.IntegerField(source='category_id', read_only=True)
    category_id = serializers.IntegerField(read_only=True)
    assigned_branches = serializers.SerializerMethodField()
    
    # Fix: write_only=False allows the backend to send IDs back to the UI checkboxes
    fk_branch_ids = serializers.PrimaryKeyRelatedField(
        queryset=BranchMst.objects.all(),
        many=True,
        write_only=False, 
        source='branches', 
        required=False
    )

    class Meta:
        model = CategoryMst
        fields = ['id', 'category_id', 'category_name', 'category_code', 'is_active', 'assigned_branches', 'fk_branch_ids']

    def get_assigned_branches(self, obj):
        # Formats the branch list for the main grid display
        branches = obj.branches.all()
        if not branches.exists():
            return "Global (All Branches)"
        return ", ".join([b.branch_name for b in branches])

    def create(self, validated_data):
        # 1. Pop branches to bypass standard save for 'through' models
        branches = validated_data.pop('branches', [])
        
        # 2. Create the Category record in MySQL
        instance = super().create(validated_data)
        
        # 3. Manually populate the Bridge Table (category_branch_map)
        from .models import CategoryBranchMap
        for branch_obj in branches:
            CategoryBranchMap.objects.create(category=instance, branch=branch_obj)
            
        return instance

    def update(self, instance, validated_data):
        # 1. Extract new branch selection
        new_branches = validated_data.pop('branches', None)
        
        # 2. Update standard fields (Name, Code, Status)
        instance.category_name = validated_data.get('category_name', instance.category_name)
        instance.category_code = validated_data.get('category_code', instance.category_code)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()

        # 3. Manually Sync Bridge Table
        if new_branches is not None:
            from .models import CategoryBranchMap
            # Clear stale mappings and re-insert current selections
            CategoryBranchMap.objects.filter(category=instance).delete()
            for branch_obj in new_branches:
                CategoryBranchMap.objects.create(
                    category=instance, 
                    branch=branch_obj
                )
            # Force reload of the many‑to‑many relation (clear cached manager)
            if hasattr(instance, '_prefetched_objects_cache'):
                instance._prefetched_objects_cache.pop('branches', None)
            # Refresh the instance from database to pick up any other changes
            instance.refresh_from_db()
        
        return instance
        

class InventorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='inventory_id', read_only=True)
    inventory_id = serializers.IntegerField(read_only=True)
    item_name = serializers.SerializerMethodField(read_only=True)
    fk_product = serializers.SerializerMethodField(read_only=True)
    item_category = serializers.SerializerMethodField(read_only=True)
    item_type = serializers.SerializerMethodField(read_only=True)
    unit = serializers.SerializerMethodField(read_only=True)

    fk_branch_id = serializers.ReadOnlyField(source='fk_branch.branch_id')
    fk_item = serializers.PrimaryKeyRelatedField(queryset=ItemMst.objects.all())
    fk_branch = serializers.PrimaryKeyRelatedField(queryset=BranchMst.objects.all())

    class Meta:
        model = InventoryMst
        fields = [
            'id', 'inventory_id', 'fk_branch', 'fk_branch_id', 'fk_item', 'fk_product',
            'item_name', 'item_category', 'item_type', 'unit', 'quantity', 'reorder_level', 'updated_at'
        ]
        validators = [
            UniqueTogetherValidator(
                queryset=InventoryMst.objects.all(),
                fields=['fk_branch', 'fk_item'],
                message="This item is already registered in this branch inventory."
            )
        ]

    def get_item_name(self, obj):
        try:
            ref = obj.fk_item 
            if ref.item_type == 'product':
                return ProductMst.objects.get(product_id=ref.ref_id).product_name
            return RawMaterialMst.objects.get(raw_material_id=ref.ref_id).raw_material_name
        except Exception:
            return "Unknown Item"

    def get_fk_product(self, obj):
        return obj.fk_item.ref_id if obj.fk_item.item_type == 'product' else None

    def get_item_category(self, obj):
        try:
            ref = obj.fk_item
            if ref.item_type == 'product':
                product = ProductMst.objects.get(product_id=ref.ref_id)
                return product.fk_category.category_name
            else:
                raw = RawMaterialMst.objects.get(raw_material_id=ref.ref_id)
                return raw.category or 'uncategorized'
        except Exception:
            return 'unknown'

    def get_item_type(self, obj):
        return obj.fk_item.item_type

    def get_unit(self, obj):
        """Return the unit of measurement for the inventory item."""
        try:
            ref = obj.fk_item
            if ref.item_type == 'product':
                product = ProductMst.objects.get(product_id=ref.ref_id)
                return product.unit or 'pcs'
            else:  # raw material
                raw = RawMaterialMst.objects.get(raw_material_id=ref.ref_id)
                unit_obj = raw.fk_unit
                return unit_obj.unit_name if unit_obj else ''
        except Exception:
            return ''
    
class CustomerSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='customer_id', read_only=True)
    customer_id = serializers.IntegerField(read_only=True)
    customer_phone = serializers.CharField(source='phone_number')
    name = serializers.CharField(source='customer_name', read_only=True)
    fk_branch_id = serializers.ReadOnlyField(source='fk_branch.branch_id')
    branch_name = serializers.CharField(source='fk_branch.branch_name', read_only=True)   # NEW

    class Meta:
        model = CustomerMst
        fields = ['id', 'customer_id', 'name', 'customer_name', 'customer_phone', 'fk_branch', 'fk_branch_id', 'branch_name']

class OrderSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='order_id')
    order_id = serializers.IntegerField(read_only=True) 
    items = OrderDetailSerializer(source='details', many=True, read_only=True)
    order_date = serializers.DateField(required=False)
    
    # Explicit ID for branch isolation
    fk_branch_id = serializers.ReadOnlyField(source='fk_branch.branch_id')
    branch_name = serializers.CharField(source='fk_branch.branch_name', read_only=True)   # NEW
    
    fk_customer = serializers.PrimaryKeyRelatedField(
        queryset=CustomerMst.objects.all(),
        allow_null=True
    )
    customer_name = serializers.CharField(
        source='fk_customer.customer_name', 
        read_only=True, 
        default="Walk-in Customer"
    )

    class Meta:
        model = OrderMst
        fields = [
            'id', 'order_id', 'order_date', 'fk_customer', 'customer_name', 'total_amount', 
            'payment_status', 'payment_mode', 'payment_terms', 'items', 'fk_branch', 'fk_branch_id', 'branch_name'
        ]
        extra_kwargs = {
            'fk_branch': {'required': False},   # make optional; view will inject it
        }
        
class ProductionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='production_id', read_only=True)
    production_id = serializers.IntegerField(read_only=True)
    product_name = serializers.CharField(source='fk_product.product_name', read_only=True)
    branch_name = serializers.CharField(source='fk_branch.branch_name', read_only=True)
    
    # Accountability mapping to track which staff member completed the batch
    produced_by_name = serializers.CharField(source='fk_produced_by.user_name', read_only=True)
    
    # Explicit ID for branch isolation
    fk_branch_id = serializers.ReadOnlyField(source='fk_branch.branch_id')

    class Meta:
        model = ProductionMst
        fields = [
            'id', 'production_id', 'fk_production_plan', 'fk_product', 'product_name', 
            'fk_branch', 'fk_branch_id', 'branch_name', 
            'fk_produced_by', 'produced_by_name',
            'produced_quantity', 'production_date'
        ]


class ProductionPlanSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='production_plan_id', read_only=True)
    production_plan_id = serializers.IntegerField(read_only=True)
    product_name = serializers.CharField(source='fk_product.product_name', read_only=True)
    branch_name = serializers.CharField(source='fk_branch.branch_name', read_only=True)
    
    # Explicitly show the assigned staff member's name
    assigned_user_name = serializers.CharField(source='fk_assigned_to.user_name', read_only=True)
    
    # Explicit ID for frontend filtering
    fk_branch_id = serializers.ReadOnlyField(source='fk_branch.branch_id')

    class Meta:
        model = ProductionPlan
        fields = [
            'id', 'production_plan_id', 'fk_branch', 'fk_branch_id', 'branch_name', 
            'fk_product', 'product_name', 
            'fk_assigned_to', 'assigned_user_name',
            'planned_quantity', 'plan_start_date', 'plan_end_date', 'plan_status'
        ]
        extra_kwargs = {
            'fk_branch': {'required': False}
        }

    def validate(self, data):
        assigned_user = data.get('fk_assigned_to')
        
        if assigned_user:
            data['fk_branch'] = assigned_user.fk_branch
        
        if data.get('plan_start_date') and data.get('plan_end_date'):
            if data['plan_start_date'] >= data['plan_end_date']:
                raise serializers.ValidationError({
                    "plan_end_date": "The completion due date must be after the starting date."
                })
                
        return data

class SupplierSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='supplier_id', read_only=True)
    supplier_id = serializers.IntegerField(read_only=True)
    city_name = serializers.CharField(source='fk_city.city_name', read_only=True)
    
    branch_ids = serializers.PrimaryKeyRelatedField(
        queryset=BranchMst.objects.all(),
        many=True,
        write_only=True,
        required=False
    )
    
    branch_names = serializers.SerializerMethodField(read_only=True)
    fk_city = serializers.PrimaryKeyRelatedField(queryset=CityMst.objects.all(), required=False)

    phone_number = serializers.CharField(
        validators=[RegexValidator(regex=r'^[6-9]\d{9}$', message="Enter a valid 10-digit mobile number.")]
    )
    
    gstin = serializers.CharField(
        required=False, allow_blank=True, allow_null=True
    )

    class Meta:
        model = SupplierMst
        fields = [
            'id', 'supplier_id', 'supplier_name', 'phone_number', 'fk_city', 'city_name',
            'branch_ids', 'branch_names', 'address', 'gstin', 'email', 'is_active'
        ]

    def get_branch_names(self, obj):
        return ", ".join([b.branch_name for b in obj.branches.all()]) or "Global (No Branch)"

    def validate_gstin(self, value):
        if value:
            # Trim spaces and convert to uppercase
            value = value.strip().upper()
            # Validate format
            import re
            pattern = r'^24[A-Z]{5}[0-9]{4}[A-Z][0-9]Z[A-Z0-9]$'
            if not re.match(pattern, value):
                raise serializers.ValidationError(
                    "Invalid GSTIN format. Expected pattern: 24 + 5 letters + 4 digits + 1 letter + 1 digit + Z + 1 alphanumeric (e.g., 24FRHVS1234A1Z5)."
                )
        return value

    def create(self, validated_data):
        branch_ids = validated_data.pop('branch_ids', [])
        instance = super().create(validated_data)
        instance.branches.set(branch_ids)
        return instance

    def update(self, instance, validated_data):
        branch_ids = validated_data.pop('branch_ids', None)
        instance = super().update(instance, validated_data)
        if branch_ids is not None:
            instance.branches.set(branch_ids)
        return instance

class IssueSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='issue_id', read_only=True)
    issue_id = serializers.IntegerField(read_only=True)
    reported_by_name = serializers.CharField(source='fk_reported_by.user_name', read_only=True)
    reported_to_name = serializers.CharField(source='fk_reported_to.user_name', read_only=True, allow_null=True)
    resolved_by_name = serializers.CharField(source='fk_resolved_by.user_name', read_only=True, allow_null=True)
    branch_name = serializers.CharField(source='fk_branch.branch_name', read_only=True)
    
    # Standardizing IDs for Frontend Logic
    fk_branch_id = serializers.ReadOnlyField(source='fk_branch.branch_id')
    fk_reported_by_id = serializers.ReadOnlyField(source='fk_reported_by.user_id')
    fk_reported_to_id = serializers.ReadOnlyField(source='fk_reported_to.user_id')
    fk_resolved_by_id = serializers.ReadOnlyField(source='fk_resolved_by.user_id')

    class Meta:
        model = IssueMst
        fields = [
            'id', 'issue_id', 'issue_type', 'issue_status', 'issue_description', 
            'severity_level', 'fk_reported_by', 'reported_by_name', 
            'fk_reported_to', 'reported_to_name', 'fk_branch', 'branch_name',
            'fk_branch_id', 'fk_reported_by_id', 'fk_reported_to_id', 
            'fk_resolved_by_id', 'resolved_by_name', 'created_at'
        ]
        extra_kwargs = {
            'fk_reported_by': {'required': False},
            'fk_branch': {'required': False}
        }