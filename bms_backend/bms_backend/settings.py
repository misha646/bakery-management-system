"""
Django settings for bms_backend project.
Updated for Bakery Management System (BMS) with Unified Authentication & RBAC.
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-d%&xzfcrm$4*n54h2z$ht8u^)jdv&*gypif*zwh@gtwg_w)l0$'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*'] 

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third Party Apps
    'rest_framework',           
    'rest_framework.authtoken', # Required for DRF Token persistence in MySQL
    'corsheaders',              
    
    # BMS Local Apps
    'api',                      
]

# =====================================================
# 1. AUTHENTICATION CONFIGURATION
# =====================================================
# Correctly registers the custom UserMst model
AUTH_USER_MODEL = 'api.UserMst'

AUTHENTICATION_BACKENDS = [
    'api.backends.UserMstBackend',
    'django.contrib.auth.backends.ModelBackend',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # MUST be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware', # Enforces security for POST/PATCH
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'bms_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'bms_backend.wsgi.application'

# =====================================================
# 2. DATABASE - MySQL CONNECTION
# =====================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'testbms',
        'USER': 'root',
        'PASSWORD': 'Misha@1888',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# =====================================================
# 3. SECURITY & CROSS-ORIGIN CONFIGURATION
# =====================================================

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated', # Secure all endpoints by default
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # TokenAuthentication is prioritized for frontend API stability
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}

# CORS Configuration - Trust frontend port 5502
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5502",
    "http://localhost:5502",
]

# CSRF Configuration - Required for POST/PATCH from Port 5502
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:5502",
    "http://localhost:5502",
]

# Cookie Settings for local development with different ports
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False  # Allows JS to read CSRF token for headers

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata' 
USE_I18N = True
USE_TZ = True

# Static & Media Files
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Ensure media directory exists
if not os.path.exists(MEDIA_ROOT):
    os.makedirs(MEDIA_ROOT)