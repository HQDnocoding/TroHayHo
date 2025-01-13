from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

r=DefaultRouter()

r.register('users', UserViewSet, basename='user')
r.register('roles',RoleViewSet,basename='role')

r.register('addresses',AddressViewSet,basename='address')
r.register('post_wants',PostWantViewSet,basename='post_wants')
r.register('post_for_rents',PostForRentViewSet,basename='post_for_rents')
urlpatterns = [
    path('',include(r.urls))
]
