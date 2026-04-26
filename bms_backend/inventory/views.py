from rest_framework import viewsets, permissions
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import InventoryMst
from api.serializers import InventorySerializer

@method_decorator(csrf_exempt, name='dispatch')
class InventoryViewSet(viewsets.ModelViewSet):
    queryset = InventoryMst.objects.all().order_by('inventory_id')
    serializer_class = InventorySerializer
    permission_classes = [permissions.AllowAny]