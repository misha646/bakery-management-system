from django.db import models
from api.models import BranchMst 

class RawMaterialMst(models.Model):
    raw_material_id = models.AutoField(primary_key=True)
    raw_material_name = models.CharField(max_length=50, unique=True)
    fk_unit_id = models.IntegerField() 
    cost_price = models.DecimalField(max_digits=7, decimal_places=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'raw_material_mst'

class InventoryMst(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    
    # Branch relationship
    fk_branch = models.ForeignKey(
        BranchMst, 
        on_delete=models.CASCADE, 
        db_column='fk_branch_id',
        related_name='inventory_by_branch'
    )
    
    # Link to RawMaterialMst instead of ProductMst
    fk_item = models.ForeignKey(
        RawMaterialMst, 
        on_delete=models.CASCADE, 
        db_column='fk_item_id',
        related_name='inventory_by_item'
    )
    
    # Matches your MySQL decimal(7,2)
    quantity = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'inventory_mst'

class ProductRecipe(models.Model):
    recipe_id = models.AutoField(primary_key=True)
    # Using 'api.ProductMst' string reference to avoid circular imports if necessary
    fk_product = models.ForeignKey('api.ProductMst', on_delete=models.CASCADE, db_column='fk_product_id')
    fk_inventory_item = models.ForeignKey(InventoryMst, on_delete=models.CASCADE, db_column='fk_inventory_id')
    quantity_required = models.DecimalField(max_digits=10, decimal_places=3)

    class Meta:
        managed = False
        db_table = 'product_recipes'