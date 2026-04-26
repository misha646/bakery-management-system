# api/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password
from .models import UserMst

class UserMstBackend(ModelBackend):
    """
    Custom authentication backend for UserMst.
    Uses Django's check_password for proper hash verification.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            auth_username = username or kwargs.get('user_name')
            if not auth_username:
                return None

            user = UserMst.objects.get(user_name=auth_username)
            
            # Use Django's check_password - works for hashed passwords
            if check_password(password, user.password):
                return user
                
        except UserMst.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return UserMst.objects.get(pk=user_id)
        except UserMst.DoesNotExist:
            return None