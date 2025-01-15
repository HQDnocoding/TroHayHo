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
r.register('notifications',NotificationViewSet,basename='notifications')



# duc
r.register('user-conversations', duc_views.UserConversationViewSet, basename='user-conversations')
r.register('conversation-messages',duc_views.ConversationMessageViewSet,basename='conversation-messages')
urlpatterns = [
    path('',include(r.urls))
]
