"""
Django settings for tro_hay_ho project.

Generated by 'django-admin startproject' using Django 5.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""
import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("firebase/serviceAccountKey.json")  # Thay bằng đường dẫn file JSON của Firebase
firebase_admin.initialize_app(cred)

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-n_43$u^ws23_-lzo!&l(h13y3oqgb02f(s%q05(&_u4u33!1p'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["https://hqd2004.pythonanywhere.com/",  "192.168.1.196","192.168.129.238", "192.168.1.11", "192.168.1.10", "192.168.1.253", "10.100.60.24","127.0.0.1","192.168.103.238"]
# 192.168.129.238
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'tro_hay_ho_app.apps.TroHayHoAppConfig',
    'rest_framework',
    'oauth2_provider',
    'ckeditor',
    'ckeditor_uploader',
    'cloudinary_storage',
    'corsheaders',
]


# PHONE_VERIFICATION = {
#     'BACKEND': 'phone_verify.backends.twilio.TwilioBackend',
#     'TWILIO_SANDBOX_TOKEN':'123456',
#     'OPTIONS': {
#         'SID': 'fake',
#         'SECRET': 'fake',
#         'FROM': '+14755292729'
#     },
#     'TOKEN_LENGTH': 6,
#     'MESSAGE': 'Welcome to {app}! Please use security code {otp} to proceed.',
#     'APP_NAME': 'Phone Verify',
#     'OTP_EXPIRATION_TIME': 3600  # In seconds only
# }

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

CKEDITOR_UPLOAD_PATH = "images/ckeditor/"

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
    ),
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ]

}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'tro_hay_ho.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tro_hay_ho.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'timtrodb',
        'USER': 'root',
        'PASSWORD': 'Admin@123',
        'HOST': ''  # mặc định localhost
    }
}

AUTH_USER_MODEL = 'tro_hay_ho_app.User'

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_ROOT = '%s/tro_hay_ho_app/static/' % BASE_DIR

import cloudinary.uploader

# Configuration
cloudinary.config(
    cloud_name="dmbvjjg5a",
    api_key="463513198463353",
    api_secret="HsIK1yhx7av6BeoVqVjKKVceikY",  # Click 'View API Keys' above to copy your API secret
    secure=True
)

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

client_id = '0R6hMr4Zhgl9LeXoWrxDNSTkLgpZymmtLJeINUFN'
client_secret = 'AG1n41T3umckBclAVuc97nNwW0YJTqxpDUanvjS2yju0kxLpwSp88FtuOZesCxm2jmPhwREN2wpHHq8xdztMEsBDUYGWaMnDPDS6vLG7o851KmYvrESeBeI8sGvYzsgw'


OAUTH2_PROVIDER = { 'OAUTH2_BACKEND_CLASS': 'oauth2_provider.oauth2_backends.JSONOAuthLibCore' }



def verify_firebase_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # Trả về thông tin người dùng nếu token hợp lệ
    except Exception:
        return None  # Token không hợp lệ
    




CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

