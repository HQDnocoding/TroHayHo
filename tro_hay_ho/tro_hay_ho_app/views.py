from datetime import timedelta
import secrets
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.timezone import now
from firebase_admin import auth
from google.auth.transport import requests
from google.oauth2 import id_token
from oauth2_provider.models import Application, AccessToken
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView ,DestroyAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.viewsets import ModelViewSet
# from rest_framework_simplejwt.tokens import RefreshToken

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
    
    
    
    
class GoogleLoginView(APIView):
    def post(self, request):
        try:
            # Lấy token từ request
            google_token = request.data.get("token")
            if not google_token:
                return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
            print(google_token)
            # Xác minh token với Google
            idinfo = id_token.verify_oauth2_token(
                google_token,
                requests.Request()
            )
            print(1)
            # Lấy thông tin từ Google
            email = idinfo.get("email")
            name = idinfo.get("name")
            if not email:
                return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Tìm hoặc tạo người dùng
            user, created = User.objects.get_or_create(username=email, defaults={"first_name": name})

            # Tạo OAuth2 Token
            application = Application.objects.get(client_id="0R6hMr4Zhgl9LeXoWrxDNSTkLgpZymmtLJeINUFN")  # Ứng dụng của bạn
            access_token = AccessToken.objects.create(
                user=user,
                application=application,
                token=secrets.token_urlsafe(),
                expires=now() + timedelta(seconds=3600),
                scope='read write'
            )
            # refresh_token = RefreshToken.objects.create(
            #     user=user,
            #     application=application,
            #     token=secrets.token_urlsafe(),
            #     access_token=access_token
            # )

            return Response({
                "access_token": access_token.token,
                "expires_in": 3600,
                "user": {
                    "id": user.id,
                    "email": user.username,
                    "name": user.first_name,
                }
            }, status=status.HTTP_200_OK)
        
        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        
        

class VerifyTokenView(APIView):
    def post(self, request):
        id_token = request.data.get("token")

        if not id_token:
            raise AuthenticationFailed("Missing idToken")

        try:
            # Xác minh idToken với Firebase
            print(id_token)
            decoded_token = auth.verify_id_token(id_token)
        
            uid = decoded_token.get("uid")
        except Exception as e:
            raise AuthenticationFailed("Invalid idToken")

        user, created = User.objects.get_or_create(username=uid, defaults={
            'email': decoded_token.get("email", ""),
        })



        access_token = AccessToken.objects.create(
            user=user,
            token=str(user.id),  # Token có thể được tùy chỉnh
            expires=now() + timedelta(days=1)
        )

        return Response({
            "access_token": str(access_token.token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        })
        
class ProvinceViewSet(ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer

    @action(detail=True, methods=['get'], url_path='districts/(?P<district_code>[^/.]+)/wards')
    def list_wards(self, request, pk=None, district_code=None):
        try:
            province = self.get_object()
            district = province.districts.get(code=district_code)
            wards = district.wards.all()
            serializer = WardSerializer(wards, many=True)
            return Response(serializer.data)
        except District.DoesNotExist:
            return Response({"detail": "District not found."}, status=404)
        
    @action(detail=True, methods=['get'], url_path='districts')
    def list_districts(self,request,pk=None):
        try:
            
            province=self.get_object()
            districts=province.districts.all()
            serializer=DistrictSerializer(districts,many=True)
            return Response(serializer.data)
            
        except Exception as e:
            raise 

class DistrictViewSet(ModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    
    @action(detail=True, methods=['get'], url_path='wards')
    def list_wards(self, request, pk=None):
        
        district = self.get_object()
        
        wards = district.wards.all()
        
        serializer = WardSerializer(wards, many=True)
        return Response(serializer.data)
    

class WardViewSet(ModelViewSet):
    queryset = Ward.objects.all()
    serializer_class = WardSerializer
    