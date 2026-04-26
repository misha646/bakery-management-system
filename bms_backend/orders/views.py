from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import transaction
from api.models import OrderMst, OrderDetail, InventoryMst
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = OrderMst.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        # We use a transaction to ensure that if the stock update fails, 
        # the order is NOT saved (Atomic Transaction).
        try:
            with transaction.atomic():
                # 1. Save the main Order Header (OrderMst)
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                order = serializer.save()

                # 2. Extract items from the request
                items_data = request.data.get('items', [])
                
                if not items_data:
                    raise ValueError("No items provided in the order.")

                for item in items_data:
                    product_id = item.get('fk_product')
                    qty_ordered = int(item.get('quantity'))
                    unit_price = item.get('unit_price')
                    subtotal = item.get('subtotal')

                    # 3. Create the OrderDetail record in MySQL
                    OrderDetail.objects.create(
                        fk_order=order,
                        fk_product_id=product_id,
                        quantity=qty_ordered,
                        unit_price=unit_price,
                        subtotal=subtotal
                    )

                    # 4. Deduct from Inventory for this specific Branch
                    # We use .select_for_update() to prevent race conditions 
                    # (two people buying the last item at the exact same millisecond)
                    inv_record = InventoryMst.objects.select_for_update().filter(
                        fk_branch_id=order.fk_branch_id,
                        fk_product_id=product_id
                    ).first()

                    if not inv_record:
                        raise ValueError(f"Product {product_id} not found in branch inventory.")

                    if inv_record.quantity < qty_ordered:
                        raise ValueError(f"Insufficient stock for product ID {product_id}. Available: {inv_record.quantity}")

                    # Update stock
                    inv_record.quantity -= qty_ordered
                    inv_record.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Internal Server Error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)