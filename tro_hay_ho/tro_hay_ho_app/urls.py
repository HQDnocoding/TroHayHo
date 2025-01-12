from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import UserViewSet,RoleViewSet

r=DefaultRouter()

r.register('users', UserViewSet, basename='user')
r.register('roles',RoleViewSet,basename='role')

urlpatterns = [
    path('',include(r.urls))
]
