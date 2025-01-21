from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView ,DestroyAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.viewsets import ModelViewSet
from .paginator import ItemPaginator
from .models import User,Role,Comment
from .paginator import ItemPaginator,ItemSmallPaginator
from .models import User, Role
from .serializers import *
from .paginator import *


class UserViewSet(ViewSet,CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]
    pagination_class = ItemPaginator
    
    def get_permissions(self):
        if self.action in ['get_current_user','get_favorites']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        return Response(UserSerializer(request.user).data)
    
    @action(methods=['get'], url_path='favorites', detail=False)
    def get_favorites(self, request):

        user = request.user  
        favorite_posts = user.saved_posts.all() 
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(favorite_posts, self.request)
            
        if page is not None:
            return paginator.get_paginated_response(FavouritePostSerializer(page, many=True).data )
        serializer = FavouritePostSerializer(favorite_posts, many=True) 
        return Response(serializer.data)

    

    
    

class RoleViewSet(ViewSet, RetrieveAPIView, ):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    
    

    def list(self, request):

        name = self.request.query_params.get('roleName', None)
        id = self.request.query_params.get('pk', None)
        query = self.queryset

        if name:
            query = query.filter(role_name=name).first()

        if id:
            query = query.filter(id=id)

        print(Response(self.serializer_class(query).data).data['id'])

        return Response(self.serializer_class(query).data)

class PostWantViewSet(ModelViewSet):
    queryset = PostWant.objects.filter(active=True)
    serializer_class = PostWantSerializer
    pagination_class = ItemPaginator
    
    @action(methods=['get','post'],url_path='comments',detail=True)
    def get_comments(self,request,pk):
        if request.method.__eq__('POST'):
            content=request.data.get('content')
            c=Comment.objects.create(content=content,user=request.user,post=self.get_object())

            return Response(CommentSerializer(c).data)

        else:
            comments=self.get_object().comments.select_related('user').filter(active=True,replied_comment=None)
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(comments, self.request)
            
            if page is not None:
                return paginator.get_paginated_response(CommentSerializer(page, many=True).data)
            
            return Response(CommentSerializer(comments,many=True).data)


class PostForRentViewSet(ModelViewSet):

    serializer_class = PostForRentSerializer
    pagination_class = ItemPaginator

    def get_queryset(self):
        return PostForRent.objects.filter(active=True) \
            .select_related('user', 'address') \
            .prefetch_related('images')
            
            
            
    @action(methods=['get','post'],url_path='comments',detail=True)
    def get_comments(self,request,pk):
        if request.method.__eq__('POST'):
            content=request.data.get('content')
            rpl=request.data.get('replied_comment')
            if rpl:
                try:
                    rpl=Comment.objects.get(id=rpl)
                except Comment.DoesNotExist:
                    rpl=None
            else: rpl=None
            c=Comment.objects.create(content=content,user=request.user,post=self.get_object(),replied_comment=rpl)

            return Response(CommentSerializer(c).data)

        else:
            comments=self.get_object().comments.select_related('user').filter(active=True,replied_comment=None)
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(comments, self.request)
            
            if page is not None:
                return paginator.get_paginated_response(CommentSerializer(page, many=True).data)
            
            return Response(CommentSerializer(comments,many=True).data)

            
class AddressViewSet(ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    


class CommentViewSet(ModelViewSet):
    queryset=Comment.objects.filter(active=True)
    serializer_class=CommentSerializer
    pagination_class = ItemSmallPaginator


class NotificationViewSet(ModelViewSet):
    serializer_class = NotificationSerializer
    pagination_class = ItemSmallPaginator

    def get_queryset(self):
        return Notification.objects.filter(active=True) \
            .select_related('sender')




class FavouritePostViewSet(ModelViewSet):
    queryset=FavoritePost.objects.filter(active=True)
    serializer_class=FavouritePostSerializer
    pagination_class=ItemSmallPaginator
    
    
    
    