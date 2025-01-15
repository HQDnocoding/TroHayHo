from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.viewsets import ModelViewSet
from ..paginator import ItemPaginator,ItemSmallPaginator
from ..models import User, Role
from ..serializers import *
from .duc_serializers import *




class ConversationViewSet(ModelViewSet):
    serializer_class = ConsersationSerializer
    pagination_class = ItemSmallPaginator

    def get_queryset(self):
        return Conversation.objects.filter(active=True) \
            .select_related('user1')


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    pagination_class = ItemSmallPaginator

    def get_queryset(self):
        return Message.objects.filter(active=True) \
            .select_related('user')

