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
r.register('provinces',ProvinceViewSet,basename='province')
r.register('districts',DistrictViewSet,basename='district')
r.register('wards',WardViewSet,basename='ward')


#================== duc========================
r.register('user-conversations', duc_views.UserConversationViewSet, basename='user-conversations')
r.register('conversation-messages',duc_views.ConversationMessageViewSet,basename='conversation-messages')
r.register('user-post-wants',duc_views.UserPostWantViewSet,basename='user-post-wants')
r.register('user-post-for-rents',duc_views.UserPostForRentViewSet,basename='user-post-for-rents')
r.register('basic-user-info',duc_views.BasicUserInfoViewSet,basename='basic-user-info')
# =============================================
r.register('notifications',NotificationViewSet,basename='notifications')


# r.register('users/current-user/favourite-posts/',FavouritePostViewSet,basename='favourite_post')
r.register('comments',CommentViewSet,basename='comment')

urlpatterns = [
    path('',include(r.urls)),
     path('google-login/', GoogleLoginView.as_view(), name='google-login'),
]
