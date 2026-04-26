from django.db import models

class OrderMst(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=255, null=True, blank=True)
    customer_phone = models.CharField(max_length=20, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    # Ensure this matches your branch IDs (1 for Sindhu Bhavan, 2 for CG Road)
    fk_branch_id = models.IntegerField() 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.customer_name}"

class OrderItem(models.Model):
    # This links the item to the main order
    fk_order = models.ForeignKey(OrderMst, related_name='items', on_delete=models.CASCADE)
    fk_product_id = models.IntegerField() 
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)