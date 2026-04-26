from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, UserViewSet, CategoryViewSet, ProductViewSet, 
    BranchViewSet, InventoryViewSet, ProductionViewSet, 
    CustomerViewSet, SupplierViewSet, IssueViewSet,
    ActivationView, ResetPasswordView, 
    DashboardStatsView, OrderViewSet,
    ProductionPlanViewSet, ReportDataView, RawMaterialViewSet,
    RawMaterialRecipeViewSet   # added
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'inventory', InventoryViewSet, basename='inventory')
router.register(r'production', ProductionViewSet, basename='production')
router.register(r'production-plan', ProductionPlanViewSet, basename='production-plan')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'raw-materials', RawMaterialViewSet, basename='rawmaterial')
router.register(r'raw-material-recipes', RawMaterialRecipeViewSet, basename='rawmaterialrecipe')

urlpatterns = [
    path('login/', LoginView.as_view(), name='api_login'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('reports-data/', ReportDataView.as_view(), name='reports_data'),
    path('activate/', ActivationView.as_view(), name='api_activate'), 
    path('reset-password/', ResetPasswordView.as_view(), name='api_reset'),
    path('', include(router.urls)),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)