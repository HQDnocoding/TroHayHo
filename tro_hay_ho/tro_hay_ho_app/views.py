import random
from datetime import timedelta
import secrets

from django.core.cache import cache
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
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView ,DestroyAPIView,UpdateAPIView
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.viewsets import ModelViewSet
from twilio.rest import Client

from .paginator import ItemPaginator
from .models import User,Role,Comment
from .paginator import ItemPaginator,ItemSmallPaginator
from .models import User, Role
from .serializers import *
from .paginator import *
from tro_hay_ho.settings import TWILIO_SERVICE_SID, TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID,TWILIO_PHONE_NUMBER

from tro_hay_ho.settings import verify_firebase_token



# from tro_hay_ho.settings import verify_firebase_token



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


    @action(methods=['post'], url_path='add-phone-number', detail=False)
    def add_phone_number(self, request):
        id_token = request.data.get("id_token")
        phone_number = request.data.get("phone_number")
        
        user_data = verify_firebase_token(id_token)
        if not user_data:
            return Response({"error": "Token không hợp lệ"}, status=400)
        
        if phone_number != user_data.get("phone_number"):
            return Response({"error": "Số điện thoại không khớp với Firebase"}, status=400)
        
        user = request.user
        print(user)
        user.phone = phone_number
        user.save()
        
        return Response({"message": "Số điện thoại đã xác thực và lưu thành công."})
        pass
    
    @action(methods=['post'],url_path='send-otp',detail=False)
    def send_otp(self, request):
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        phone_number = request.data.get("phone_number")
        if not phone_number:
            return Response({"error": "Số điện thoại không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo OTP 6 số ngẫu nhiên
        otp = str(random.randint(100000, 999999))
        cache.set(phone_number, otp, timeout=300)  # Lưu OTP vào cache (5 phút)

        # Gửi OTP qua Twilio
        try:
            client.messages.create(
                body=f"OTP: {otp}",
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )
            return Response({"message": "OTP đã được gửi thành công"})
        except Exception as e:
            return Response({"error": f"Gửi OTP thất bại: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(methods=['post'],url_path='verify-otp',detail=False)
    def verify_otp(self,request):
        phone_number = request.data.get("phone_number")
        otp = request.data.get("otp_code")

        if not phone_number or not otp:
            return Response({"error": "Số điện thoại hoặc OTP không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra OTP từ cache
        cached_otp = cache.get(phone_number)
        if cached_otp is None:
            return Response({"error": "OTP đã hết hạn hoặc không tồn tại"}, status=status.HTTP_400_BAD_REQUEST)

        if cached_otp == otp:
            user=request.user
            user.phone=phone_number
            user.save()
            cache.delete(phone_number)  # Xóa OTP sau khi xác thực thành công
            return Response({"message": "Xác thực thành công"})
        else:
            return Response({"error": "OTP không chính xác"}, status=status.HTTP_400_BAD_REQUEST)




    
    

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
    parser_classes = [MultiPartParser,JSONParser ]

    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    

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
    
    def create(self, request, *args, **kwargs):
        print("Received Data:", request.data)

    
    
    
    @action(detail=False, methods=['post'], url_path='create-address')
    def create_address(self, request):
        print("Dữ liệu nhận được:", request.data)

        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            address = serializer.save()
            return Response({"message": "Address created successfully!", "data": AddressSerializer(address).data}, status=status.HTTP_201_CREATED)
        else:
            print("Errors:", serializer.errors)
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    


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
    
    
class PostImageView(ModelViewSet):
    queryset = PostImage.objects.all()
    serializer_class = PostImageSerializer
    parser_classes = (MultiPartParser, FormParser,JSONParser)

    def perform_create(self, serializer):
        post_id = self.request.data.get('post')
        image = self.request.FILES.get('image')

        if not post_id or not image:
            return Response({"error": "Missing post_id or image"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = PostForRent.objects.get(id=post_id) 
            serializer.save(post=post, image=image)
        except PostForRent.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
