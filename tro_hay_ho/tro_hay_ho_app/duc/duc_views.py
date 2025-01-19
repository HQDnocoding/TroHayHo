from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
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



