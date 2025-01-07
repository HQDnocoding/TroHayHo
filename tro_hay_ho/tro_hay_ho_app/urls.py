from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import UserViewSet

r=DefaultRouter()

r.register('users', UserViewSet, basename='user')


urlpatterns = [
    path('',include(r.urls))
]
