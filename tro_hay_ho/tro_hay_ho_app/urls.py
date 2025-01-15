from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *
from .duc import duc_views
r=DefaultRouter()

r.register('users', UserViewSet, basename='user')
r.register('roles',RoleViewSet,basename='role')

r.register('addresses',AddressViewSet,basename='address')
r.register('post-wants',PostWantViewSet,basename='post_wants')
r.register('post-for-rents',PostForRentViewSet,basename='post_for_rents')

r.register('comments',CommentViewSet,basename='comment')

# duc
r.register('conversations',duc_views.ConversationViewSet,basename='conversation')
r.register('messages',duc_views.MessageViewSet,basename='message')
urlpatterns = [
    path('',include(r.urls))
]
