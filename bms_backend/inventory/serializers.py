from rest_framework import serializers
from .models import InventoryMst, RawMaterialMst

class InventorySerializer(serializers.ModelSerializer):
    # Mapping database fields to the names used in inventory.js
    inventory_id = serializers.IntegerField(source='id', read_only=True)
    
    # Pulling details from RawMaterialMst via the fk_item relationship
    item_name = serializers.CharField(source='fk_item.raw_material_name', read_only=True)
    cost_price = serializers.DecimalField(source='fk_item.cost_price', max_digits=7, decimal_places=2, read_only=True)
    
    # Mapping 'quantity' to 'stock_quantity' for the JS frontend
    stock_quantity = serializers.DecimalField(source='quantity', max_digits=7, decimal_places=2)
    
    class Meta:
        model = InventoryMst
        # fields must include both the ID for writing and names for reading
        fields = [
            'inventory_id', 
            'fk_branch', 
            'fk_item', 
            'item_name', 
            'cost_price', 
            'stock_quantity', 
            'updated_at'
        ]

class ProductRecipeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='recipe_id', read_only=True)
    
    class Meta:
        model = ProductRecipe
        fields = ['id', 'fk_product', 'fk_inventory_item', 'quantity_required']