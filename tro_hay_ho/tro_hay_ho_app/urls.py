from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *
from .duc import duc_views

r = DefaultRouter()

r.register('users', UserViewSet, basename='user')
r.register('chu-tro', ChuTroViewSet, basename='chu-tro')
r.register('roles', AvailableGroupsView, basename='role')

r.register('addresses', AddressViewSet, basename='address')
r.register('post-wants', PostWantViewSet, basename='post_wants')
r.register('post-for-rents', PostForRentViewSet, basename='post_for_rents')
r.register('provinces', ProvinceViewSet, basename='province')
r.register('districts', DistrictViewSet, basename='district')
r.register('wards', WardViewSet, basename='ward')
r.register('images', PostImageView, basename='image')
r.register('follows',FollowingView,basename='follow')
r.register('notifications',NotificationViewSet,basename='notification')

# ================== duc========================
r.register('user-conversations', duc_views.UserConversationViewSet, basename='user-conversations')
r.register('conversation-messages', duc_views.ConversationMessageViewSet, basename='conversation-messages')
r.register('user-post-wants', duc_views.UserPostWantViewSet, basename='user-post-wants')
r.register('user-post-for-rents', duc_views.UserPostForRentViewSet, basename='user-post-for-rents')
r.register('basic-user-info', duc_views.BasicUserInfoViewSet, basename='basic-user-info')
r.register('post-parent', duc_views.PostParentViewSet, basename='post-parent')
r.register('post-wants-show', duc_views.BasicPostWantShowViewSet, basename='post-wants-show')
r.register('post-for-rents-show', duc_views.BasicPostForRentShowViewSet, basename='post-for-rents-show')
r.register('detail-notification', duc_views.DetailNotificationViewSet, basename='detail-notification')

# =============================================
r.register('notifications', NotificationViewSet, basename='notifications')

r.register('comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(r.urls)),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
]
