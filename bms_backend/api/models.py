from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# =====================================================
# 0. AUTHENTICATION MANAGER
# =====================================================

class UserMstManager(BaseUserManager):
    def get_by_natural_key(self, username):
        return self.get(user_name=username)

    def create_user(self, user_name, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(user_name=user_name, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_name, email, password=None, **extra_fields):
        extra_fields.setdefault('designation', 'admin')
        return self.create_user(user_name, email, password, **extra_fields)

# =====================================================
# 1. LOCATION & BRANCH MASTER DATA
# =====================================================

class StateMst(models.Model):
    state_id = models.AutoField(primary_key=True)
    state_name = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'state_mst'

    def __str__(self):
        return self.state_name

class CityMst(models.Model):
    city_id = models.AutoField(primary_key=True)
    city_name = models.CharField(max_length=50)
    fk_state = models.ForeignKey(StateMst, on_delete=models.CASCADE, db_column='fk_state_id')

    class Meta:
        managed = False
        db_table = 'city_mst'

    def __str__(self):
        return self.city_name

class BranchMst(models.Model):
    branch_id = models.AutoField(primary_key=True)
    branch_name = models.CharField(max_length=100, blank=True, null=True) 
    fk_city = models.ForeignKey(CityMst, on_delete=models.PROTECT, db_column='fk_city_id')
    address = models.CharField(max_length=100, blank=True, null=True)
    phone_number1 = models.CharField(max_length=15)
    phone_number2 = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    manager_user_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        managed = False
        db_table = 'branch_mst'

    def __str__(self):
        return self.branch_name or f"Branch {self.branch_id}"

# =====================================================
# 2. USER & CUSTOMER DATA
# =====================================================

class UserMst(AbstractBaseUser):
    # Explicit Primary Key for DRF Token Handshake stability
    user_id = models.AutoField(primary_key=True)
    user_name = models.CharField(unique=True, max_length=50)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    fk_city = models.ForeignKey(CityMst, on_delete=models.CASCADE, db_column='fk_city_id', default=1)
    designation = models.CharField(max_length=50, blank=True, null=True) 
    fk_branch = models.ForeignKey(BranchMst, on_delete=models.CASCADE, db_column='fk_branch_id')
    is_active = models.BooleanField(default=True)
    date_of_birth = models.DateField(null=True, blank=True)
    date_of_joining = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=100, blank=True, null=True)
    is_first_login = models.IntegerField(default=1) 
    security_key = models.CharField(max_length=10, null=True, blank=True)
    
    last_login = models.DateTimeField(null=True, blank=True)
    objects = UserMstManager()
    
    USERNAME_FIELD = 'user_name'
    REQUIRED_FIELDS = ['email']

    class Meta:
        managed = False
        db_table = 'user_mst'

    def has_perm(self, perm, obj=None): return True
    def has_module_perms(self, app_label): return True

    @property
    def is_staff(self):
        return str(self.designation).lower() == 'admin'

class CustomerMst(models.Model):
    customer_id = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    fk_branch = models.ForeignKey(BranchMst, on_delete=models.CASCADE, db_column='fk_branch_id')

    class Meta:
        managed = False
        db_table = 'customer_mst'

# =====================================================
# 3. INVENTORY & PRODUCT DATA
# =====================================================

class UnitMst(models.Model):
    unit_id = models.AutoField(primary_key=True)
    unit_name = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'unit_mst'

class ProductMst(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(unique=True, max_length=50)
    fk_category = models.ForeignKey(
        'CategoryMst', 
        on_delete=models.CASCADE, 
        db_column='fk_category_id',
        related_name='products'
    )
    cost_price = models.DecimalField(max_digits=12, decimal_places=2)
    base_price = models.DecimalField(max_digits=12, decimal_places=2)
    product_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    recipe_instructions = models.TextField(null=True, blank=True)
    unit = models.CharField(max_length=20, null=True, blank=True) 
    image_url = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'product_mst'

    def __str__(self):
        return self.product_name

class ItemMst(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_type = models.CharField(max_length=10) # 'raw' or 'product'
    ref_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'item_mst'
        unique_together = (('item_type', 'ref_id'),)

class RawMaterialMst(models.Model):
    raw_material_id = models.AutoField(primary_key=True)
    raw_material_name = models.CharField(unique=True, max_length=50)
    fk_unit = models.ForeignKey(UnitMst, on_delete=models.CASCADE, db_column='fk_unit_id')
    cost_price = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)
    category = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'raw_material_mst'

class RawMaterialRecipe(models.Model):
    recipe_id = models.AutoField(primary_key=True)
    fk_product = models.ForeignKey(ProductMst, on_delete=models.CASCADE, db_column='fk_product_id')
    fk_raw_material = models.ForeignKey(RawMaterialMst, on_delete=models.CASCADE, db_column='fk_raw_material_id')
    required_quantity = models.DecimalField(max_digits=12, decimal_places=3)

    class Meta:
        managed = False
        db_table = 'raw_material_recipe'

class CategoryBranchMap(models.Model):
    category = models.ForeignKey('CategoryMst', on_delete=models.CASCADE, db_column='category_id')
    branch = models.ForeignKey('BranchMst', on_delete=models.CASCADE, db_column='branch_id')

    class Meta:
        managed = False
        db_table = 'category_branch_map'

class CategoryMst(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(unique=True, max_length=50)
    category_code = models.CharField(max_length=25, unique=True, null=True, blank=True)
    
    branches = models.ManyToManyField(
        'BranchMst', 
        through=CategoryBranchMap,
        related_name='categories'
    )
    
    is_active = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'category_mst'

class InventoryMst(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    fk_branch = models.ForeignKey(BranchMst, on_delete=models.CASCADE, db_column='fk_branch_id')
    fk_item = models.ForeignKey(ItemMst, on_delete=models.CASCADE, db_column='fk_item_id')
    quantity = models.DecimalField(max_digits=12, decimal_places=2) 
    reorder_level = models.DecimalField(max_digits=12, decimal_places=2, default=10.00)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        managed = False
        db_table = 'inventory_mst'
        unique_together = (('fk_branch', 'fk_item'),)

# =====================================================
# 4. OPERATIONS (RECIPES, PRODUCTION & ORDERS)
# =====================================================

class RecipeMst(models.Model):
    recipe_id = models.AutoField(primary_key=True)
    fk_finished_good = models.ForeignKey(ProductMst, on_delete=models.CASCADE, related_name='recipe_components', db_column='fk_finished_good_id')
    fk_ingredient = models.ForeignKey(ProductMst, on_delete=models.CASCADE, related_name='used_in_recipes', db_column='fk_ingredient_id')
    required_quantity = models.DecimalField(max_digits=12, decimal_places=3)

    class Meta:
        managed = False
        db_table = 'recipe_mst'

class ProductionPlan(models.Model):
    PLAN_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    production_plan_id = models.AutoField(primary_key=True)
    fk_branch = models.ForeignKey(BranchMst, on_delete=models.CASCADE, db_column='fk_branch_id')
    fk_product = models.ForeignKey(ProductMst, on_delete=models.CASCADE, db_column='fk_product_id')
    
    fk_assigned_to = models.ForeignKey(
        'UserMst', 
        on_delete=models.CASCADE, 
        db_column='fk_assigned_to',
        related_name='assigned_plans',
        null=True,
        blank=True
    )
    
    planned_quantity = models.DecimalField(max_digits=12, decimal_places=2)
    plan_start_date = models.DateField()
    plan_end_date = models.DateField()
    plan_status = models.CharField(max_length=20, choices=PLAN_STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'production_plan'

class ProductionMst(models.Model):
    production_id = models.AutoField(primary_key=True)
    fk_production_plan = models.ForeignKey(ProductionPlan, on_delete=models.CASCADE, db_column='fk_production_plan_id')
    fk_branch = models.ForeignKey(BranchMst, on_delete=models.CASCADE, db_column='fk_branch_id')
    fk_product = models.ForeignKey(ProductMst, on_delete=models.CASCADE, db_column='fk_product_id')
    
    fk_produced_by = models.ForeignKey(
        'UserMst',
        on_delete=models.SET_NULL,
        db_column='fk_produced_by',
        null=True,
        blank=True
    )
    
    produced_quantity = models.DecimalField(max_digits=12, decimal_places=2, db_column='produced_quantity')
    production_date = models.DateField(db_column='production_date')

    class Meta:
        managed = False
        db_table = 'production_mst'
        

class OrderMst(models.Model):
    order_id = models.AutoField(primary_key=True)
    order_date = models.DateField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_status = models.CharField(max_length=20, default='paid') 
    payment_mode = models.CharField(max_length=20, default='cash')
    payment_terms = models.CharField(max_length=50, default='Immediate') 
    fk_branch = models.ForeignKey(BranchMst, on_delete=models.CASCADE, db_column='fk_branch_id')
    fk_customer = models.ForeignKey(CustomerMst, on_delete=models.CASCADE, db_column='fk_customer_id', null=True, blank=True)
    fk_user = models.ForeignKey(UserMst, on_delete=models.SET_NULL, null=True, db_column='fk_user_id')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'order_mst'

class OrderDetail(models.Model):
    order_item_id = models.AutoField(primary_key=True) 
    fk_order = models.ForeignKey(OrderMst, related_name='details', on_delete=models.CASCADE, db_column='fk_order_id')
    fk_product = models.ForeignKey(ProductMst, on_delete=models.CASCADE, db_column='fk_product_id')
    quantity = models.DecimalField(max_digits=12, decimal_places=2) 
    unit_price = models.DecimalField(max_digits=12, decimal_places=2) 
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    class Meta:
        managed = False
        db_table = 'order_items'

class IssueMst(models.Model):
    issue_id = models.AutoField(primary_key=True)
    issue_type = models.CharField(max_length=20)
    issue_status = models.CharField(max_length=20, default='open')
    issue_description = models.TextField()
    severity_level = models.CharField(max_length=20)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    fk_reported_by = models.ForeignKey(UserMst, on_delete=models.CASCADE, db_column='fk_reported_by', related_name='reported_issues')
    fk_reported_to = models.ForeignKey(UserMst, on_delete=models.SET_NULL, null=True, db_column='fk_reported_to', related_name='assigned_issues')
    fk_resolved_by = models.ForeignKey(UserMst, on_delete=models.SET_NULL, null=True, db_column='fk_resolved_by', related_name='resolved_issues')
    fk_branch = models.ForeignKey(BranchMst, on_delete=models.CASCADE, db_column='fk_branch_id')

    class Meta:
        managed = False
        db_table = 'issue_mst'

class SupplierMst(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    supplier_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    fk_city = models.ForeignKey(CityMst, on_delete=models.PROTECT, db_column='fk_city_id', default=1)
    
    # Many-to-Many relationship with BranchMst
    branches = models.ManyToManyField(
        'BranchMst',
        through='SupplierBranchMap',
        related_name='suppliers'
    )
    
    address = models.CharField(max_length=100)
    gstin = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'supplier_mst'

class SupplierBranchMap(models.Model):
    supplier = models.ForeignKey(SupplierMst, on_delete=models.CASCADE)
    branch = models.ForeignKey('BranchMst', on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'supplier_branch_map'
        unique_together = (('supplier', 'branch'),)