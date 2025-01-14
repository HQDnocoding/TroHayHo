from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.viewsets import ModelViewSet
from .paginator import ItemPaginator
from .models import User,Role
from .serializers import *


class UserViewSet(ViewSet,CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        return Response(UserSerializer(request.user).data)
    

class RoleViewSet(ViewSet,RetrieveAPIView,):
    queryset=Role.objects.all()
    serializer_class=RoleSerializer    
        
    def list(self,request):
        
        name=self.request.query_params.get('roleName',None)
        id=self.request.query_params.get('pk',None)
        query=self.queryset

        if name:
            query=query.filter(role_name=name).first()
            
        if id:
            query=query.filter(id=id)
        
        print(Response(self.serializer_class(query).data).data['id'])

        return Response(self.serializer_class(query).data)

class PostWantViewSet(ModelViewSet):
    queryset = PostWant.objects.filter(active=True)
    serializer_class = PostWantSerializer
    pagination_class = ItemPaginator

class PostForRentViewSet(ModelViewSet):

    serializer_class = PostForRentSerializer
    pagination_class = ItemPaginator

    def get_queryset(self):
        return PostForRent.objects.filter(active=True)\
            .select_related('user','address')\
            .prefetch_related('images')
class AddressViewSet(ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    

