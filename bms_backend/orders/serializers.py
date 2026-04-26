from rest_framework import serializers
from django.db import transaction
from .models import OrderMst, OrderItem
from inventory.models import InventoryMst, ProductRecipe
from django.core.exceptions import ValidationError

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['fk_product_id', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = OrderMst
        fields = ['order_id', 'customer_name', 'customer_phone', 'total_amount', 'fk_branch_id', 'created_at', 'items']

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        branch_id = validated_data.get('fk_branch_id')
        
        # 1. Save the Main Order Header
        order = OrderMst.objects.create(**validated_data)
        
        # 2. Process each item in the cart
        for item_data in items_data:
            product_id = item_data['fk_product_id']
            qty_sold = item_data['quantity']

            # Save the record of what was sold (OrderItem)
            OrderItem.objects.create(fk_order=order, **item_data)
            
            # 3. TRIANGLE LOGIC: Fetch the Recipe for this product
            recipes = ProductRecipe.objects.filter(fk_product_id=product_id)
            
            for recipe_item in recipes:
                # Calculate how much of the raw material is needed for this total sale
                total_deduction = recipe_item.quantity_required * qty_sold
                
                # 4. TRIANGLE LOGIC: Locate the Inventory at the specific branch
                # We target the item defined in the recipe for THIS specific branch
                stock_record = InventoryMst.objects.select_for_update().filter(
                    fk_item=recipe_item.fk_inventory_item.fk_item,
                    fk_branch_id=branch_id
                ).first()
                
                if stock_record:
                    # CHECK: Do we have enough? 
                    # (Optional: Uncomment next line to block sales if stock is too low)
                    # if stock_record.quantity < total_deduction:
                    #    raise serializers.ValidationError(f"Insufficient stock for {stock_record.fk_item.product_name}")

                    stock_record.quantity -= total_deduction
                    stock_record.save()
                else:
                    # If the branch hasn't even set up this ingredient in their inventory list
                    print(f"CRITICAL: Branch {branch_id} has no inventory record for recipe item.")
            
        return order