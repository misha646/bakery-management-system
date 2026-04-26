from django.contrib import admin
from django.urls import path, include
from django.conf import settings             # <--- Add this
from django.conf.urls.static import static   # <--- Add this

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# <--- Add this block to serve images from the /media/ folder
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)