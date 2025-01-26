from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.status import  HTTP_201_CREATED, HTTP_400_BAD_REQUEST,HTTP_200_OK,HTTP_404_NOT_FOUND,HTTP_500_INTERNAL_SERVER_ERROR
from rest_framework.viewsets import ViewSet
from rest_framework.viewsets import ModelViewSet
from ..paginator import ItemPaginator, ItemSmallPaginator
from ..models import User, Role
from ..serializers import *
from .duc_serializers import *
from django.db.models import Q


class ConversationViewSet(ModelViewSet):
    serializer_class = ConsersationSerializer
    pagination_class = ItemSmallPaginator

    def get_queryset(self):
        return Conversation.objects.filter(active=True) \
            .select_related('user1','user2')


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    pagination_class = ItemSmallPaginator

    def get_queryset(self):
        return Message.objects.filter(active=True) \
            .select_related('user')


class UserConversationViewSet(ModelViewSet):
    pagination_class = ItemSmallPaginator
    serializer_class = ConsersationSerializer
    queryset = Conversation.objects.filter(active=True)
    @action(detail=False, methods=['get'], url_path=r'user/(?P<user_id>\d+)')
    def get_user_conversations(self, request, user_id=None):
        conversations = Conversation.objects.filter(
        Q(user1_id=user_id) |  Q(user2_id=user_id),

        active=True,
        ).select_related('user1', 'user2').prefetch_related('messages').order_by('-updated_date')

        # serializer = self.get_serializer(conversations, many=True)
        # phan trang
        page = self.paginate_queryset(conversations)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(conversations, many=True)
        return Response(serializer.data)

class ConversationMessageViewSet(ModelViewSet):
    pagination_class = ItemSmallPaginator
    serializer_class = MessageSerializer
    queryset = Message.objects.filter(active=True)
    @action(detail=False, methods=['get'], url_path=r'conversation/(?P<conversation_id>\d+)')
    def get_user_conversations(self, request, conversation_id=None):
        messages = Message.objects.filter(
            conversation_id=conversation_id,
        active=True,
        ).order_by('-updated_date')

        # phan trang
        page = self.paginate_queryset(messages)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

class UserPostWantViewSet(ModelViewSet):
    pagination_class = ItemSmallPaginator
    serializer_class = PostWantSerializer
    queryset = PostWant.objects.filter(active=True)
    @action(detail=False,methods=['get'],url_path=r'user/(?P<user_id>\d+)')
    def get_user_post_want(self,request,user_id=None):
        post_want= PostWant.objects.filter(active=True,
                                          user_id=user_id
                                          ).order_by('-updated_date')
        page= self.paginate_queryset(post_want)
        if page is not None:
            serializers=self.get_serializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=self.get_serializer(post_want,many=True)
        return Response(serializers.data)


class UserPostForRentViewSet(ModelViewSet):
    pagination_class = ItemSmallPaginator
    serializer_class = PostForRentSerializer
    queryset = PostForRent.objects.filter(active=True)
    @action(detail=False,methods=['get'],url_path=r'user/(?P<user_id>\d+)')
    def get_user_post_for_rent(self,request,user_id=None):
        post_for_rent= PostForRent.objects.filter(active=True,
                                          user_id=user_id
                                          ).order_by('-updated_date')
        page= self.paginate_queryset(post_for_rent)
        if page is not None:
            serializers=self.get_serializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=self.get_serializer(post_for_rent,many=True)
        return Response(serializers.data)

class BasicUserInfoViewSet(ModelViewSet):
    pagination_class = ItemSmallPaginator
    serializer_class = BasicUserInfoSerializer
    queryset = User.objects.filter(is_active=True)
    @action(detail=True,methods=['get'],url_path='detail-notification')
    def get_detail_notification(self,request,pk=None):
    
        detail_notification=DetailNotification.objects.filter(receiver_id=pk)\
            .select_related('notification')\
                .order_by('-created_date')
        page= self.paginate_queryset(detail_notification)
        if page is not None:
            serializers=DetailNotificationSerializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=self.get_serializer(detail_notification,many=True)
        return Response(serializers.data)
    # lay nhung ai minh dang theo doi va tao theo doi moi
    @action(detail=True,methods=['get','post'],url_path='following')
    def manager_following(self,request,pk=None):
        if request.method == 'GET':
            following = Following.objects.filter(follower_id=pk,active=True).order_by('-created_date')
            page= self.paginate_queryset(following)
            if page is not None:
                serializers=BasicFollowSerializer(page,many=True)
                return self.get_paginated_response(serializers.data)
            serializers=BasicFollowSerializer(following,many=True)
            return Response(serializers.data)
        elif request.method == 'POST':
            followed_id = request.data.get('followed')
            if not User.objects.filter(id=followed_id,is_active=True).exists():
                return Response({'error':'User not found'},status=HTTP_400_BAD_REQUEST)
            if Following.objects.filter(follower_id=pk,followed_id=followed_id,active=True).exists():
                return Response({'error':'relation already exists'},status=HTTP_400_BAD_REQUEST)
            Following.objects.create(follower_id=pk,followed_id=followed_id)
            return Response({"message": "Following relationship created successfully."}, status=HTTP_201_CREATED)
    
    @action(detail=True,methods=['get'],url_path='who-following-me')
    def who_following_me(self,request,pk=None):
        following = Following.objects.filter(followed_id=pk,active=True).order_by('-created_date')
        page= self.paginate_queryset(following)
        if page is not None:
            serializers=BasicFollowSerializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=BasicFollowSerializer(following,many=True)
        return Response(serializers.data)
    
    @action(detail=True,methods=['get'],url_path=r'check-me-following-you/(?P<user_id>\d+)')
    def check_me_following_you(self,request,pk,user_id=None):
        exists = Following.objects.filter(follower_id=pk, followed_id=user_id, active=True).exists()
        if exists:
            return Response({"following": True}, status=HTTP_200_OK)
        return Response({"following": False}, status=HTTP_200_OK)
    @action(detail=True, methods=['patch'], url_path=r'update-me-following-you/(?P<user_id>\d+)')
    def update_me_following_you(self, request, pk, user_id=None):
        try:
          
            active_status = request.data.get('active')
            if active_status is None:
                return Response({'error': 'Active status is required.'}, status=HTTP_400_BAD_REQUEST)

            following = Following.objects.filter(follower_id=pk, followed_id=user_id).first()

            if not following:
                new_following=Following.objects.create(follower_id=pk,followed_id=user_id)
                new_following.active=active_status
                new_following.save()
                return Response({
                'message': 'Following relationship updated successfully.',
                'follower_id': pk,
                'followed_id': user_id,
                'active': new_following.active
            }, status=HTTP_200_OK)

            following.active = active_status
            following.save()

            return Response({
                'message': 'Following relationship updated successfully.',
                'follower_id': pk,
                'followed_id': user_id,
                'active': following.active
            }, status=HTTP_200_OK)

        except Exception as e:
            return Response({'error a': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    

# class FollowViewSet(ViewSet, CreateAPIView):
#     serializer_class = FollowSerializer
  

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=HTTP_201_CREATED)
#         return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
