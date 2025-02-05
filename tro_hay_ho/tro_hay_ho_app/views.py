import base64
import json
import random
import re
import smtplib
from datetime import timedelta
import secrets
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from django.contrib.auth.models import Group
from django.core.cache import cache
from django.core.mail import send_mail
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.timezone import now
from firebase_admin import auth
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google.auth.transport import requests
from google.oauth2 import id_token
from oauth2_provider.models import Application, AccessToken
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed, APIException
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.viewsets import ModelViewSet
from twilio.rest import Client

from .paginator import ItemPaginator
from .models import User, Role, Comment
from .paginator import ItemPaginator, ItemSmallPaginator
from .models import User, Role
from .serializers import *
from .paginator import *
from tro_hay_ho.settings import TWILIO_SERVICE_SID, TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_PHONE_NUMBER, \
    EMAIL_HOST_USER, REFRESH_TOKEN, CLIENT_ID, SECRET_ID, EMAIL_HOST, EMAIL_PORT

from tro_hay_ho.settings import verify_firebase_token


# from tro_hay_ho.settings import verify_firebase_token


def is_valid_password(password):
    if len(password) < 6:
        return "Mật khẩu phải có ít nhất 6 ký tự."

    if " " in password:
        return "Mật khẩu không được chứa khoảng trắng."

    if not re.search(r"[A-Z]", password):
        return "Mật khẩu phải có ít nhất một chữ in hoa."

    if not re.search(r"[0-9]", password):
        return "Mật khẩu phải có ít nhất một chữ số."

    return "Mật khẩu hợp lệ!"


class UserViewSet(ViewSet, CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser, ]
    pagination_class = ItemSmallPaginator

    def get_permissions(self):
        if self.action in ['get_current_user', 'get_favorites', 'get_follow_me',
                           'get_following', 'get_favorites', 'change_password']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'post'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        return Response(UserSerializer(request.user).data)

    @action(methods=['get', 'post'], url_path='follow-me', detail=False)
    def get_follow_me(self, request):
        user = request.user
        following = user.follower_relations.all()

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(following, request)

        if page is not None:
            return paginator.get_paginated_response(FollowerSerializer(page, many=True).data)
        serializer = FollowerSerializer(following, many=True)
        return Response(serializer.data)

    @action(methods=['get', 'post'], url_path='following', detail=False)
    def get_following(self, request):
        user = request.user
        follower = user.following_relations.all()

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(follower, request)

        if page is not None:
            return paginator.get_paginated_response(FollowingSerializer(page, many=True).data)
        serializer = FollowingSerializer(follower, many=True)
        return Response(serializer.data)

    @action(methods=['get', 'post'], url_path='favourites', detail=False)
    def get_favorites(self, request):

        user = request.user
        favorite_posts = user.saved_posts.all()
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(favorite_posts, self.request)

        if page is not None:
            return paginator.get_paginated_response(FavouritePostSerializer(page, many=True).data)
        serializer = FavouritePostSerializer(favorite_posts, many=True)
        return Response(serializer.data)

    @action(methods=['post'], url_path='change-password', detail=False)
    def change_password(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not old_password or not new_password or not confirm_password:
            return Response({"error": "Vui lòng nhập đầy đủ thông tin."}, status=status.HTTP_400_BAD_REQUEST)

        check = is_valid_password(new_password)
        if (check != "Mật khẩu hợp lệ!"):
            return Response({"error": check}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"error": "Mật khẩu cũ không đúng"}, status=status.HTTP_400_BAD_REQUEST)

        if not new_password == confirm_password:
            return Response({"error": "Không khớp mật khẩu mới"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Đổi mật khẩu thành công"}, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='send-otp', detail=False)
    def send_otp(self, request):
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        phone_number = request.data.get("phone_number")
        print(phone_number)
        if not phone_number:
            return Response({"error": "Số điện thoại không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo OTP 6 số ngẫu nhiên
        otp = str(random.randint(100000, 999999))
        cache.set(phone_number, otp, timeout=300)

        # Gửi OTP qua Twilio
        try:
            client.messages.create(
                body=f"Mã OTP của bạn là: {otp}",
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )
            return Response({"message": "OTP đã được gửi thành công"})
        except Exception as e:
            return Response({"error": f"Gửi OTP thất bại: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['post'], url_path='verify-otp', detail=False)
    def verify_otp(self, request):
        phone_number = request.data.get("phone_number")
        otp = request.data.get("otp_code")

        if not phone_number or not otp:
            return Response({"error": "Số điện thoại hoặc OTP không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra OTP từ cache
        cached_otp = cache.get(phone_number)
        if cached_otp is None:
            return Response({"error": "OTP đã hết hạn hoặc không tồn tại"}, status=status.HTTP_400_BAD_REQUEST)

        if cached_otp == otp:
            user = request.user
            user.phone = phone_number
            user.save()
            cache.delete(phone_number)  # Xóa OTP sau khi xác thực thành công
            return Response({"message": "Xác thực thành công"})
        else:
            return Response({"error": "OTP không chính xác"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='check-email', detail=False)
    def check_email(self, request):
        email_data = request.data.get('email')

        users = User.objects.filter(email=email_data)

        if users:
            return Response({"error": "Email đã tồn tại"}, status=status.HTTP_400_BAD_REQUEST)

        otp = str(random.randint(100000, 999999))
        cache.set(email_data, otp, timeout=300)

        access_token = get_access_token()
        auth_string = f"user={EMAIL_HOST_USER}\x01auth=Bearer {access_token}\x01\x01"
        auth_bytes = base64.b64encode(auth_string.encode()).decode()

        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.ehlo()
        server.starttls()
        server.docmd("AUTH", "XOAUTH2 " + auth_bytes)

        msg = MIMEMultipart()
        msg["From"] = EMAIL_HOST_USER
        msg["To"] = email_data
        msg["Subject"] = "Ứng dụng TroHayHo gởi bạn mã OTP"
        msg.attach(MIMEText(f"Mã xác thực của bạn là: {otp}", "plain"))
        server.sendmail(EMAIL_HOST_USER, email_data, msg.as_string())

        server.quit()
        return Response({"message": "Đã gởi mã OTP"})

    @action(methods=['post'], url_path='verify-otp-email', detail=False)
    def verify_otp_email(self, request):
        otp = request.data.get('otp')
        email = request.data.get('email')

        cached_otp = cache.get(email)
        if cached_otp is None:
            return Response({"error": "OTP đã hết hạn hoặc không tồn tại"}, status=status.HTTP_400_BAD_REQUEST)
        if cached_otp == otp:
            user = request.user
            user.email = email
            user.save()
            cache.delete(email)
            return Response({"message": "Xác thực thành công"})
        else:
            return Response({"error": "OTP không chính xác"}, status=status.HTTP_400_BAD_REQUEST)


class TroImageViewSet(ViewSet,CreateAPIView):
    serializer_class=TroImageSerializer
    parser_classes=[MultiPartParser]
    


class ChuTroViewSet(UserViewSet ):
    serializer_class=ChuTroSerializer
    parser_classes = [MultiPartParser, JSONParser]

    
    def create(self, request, *args, **kwargs):
        print(request.data)
        try:
            address_data=request.data.pop('address')
            username = request.data.get("username")
            phone = request.data.get("phone")

            if ChuTro.objects.filter(username=username).exists():
                return Response({"error": "Username đã tồn tại."}, status=status.HTTP_400_BAD_REQUEST)
          
            if ChuTro.objects.filter(phone=phone).exists():
                return Response({"error": "Số điện thoại đã tồn tại."}, status=status.HTTP_400_BAD_REQUEST)
                
            address_dict = json.loads(address_data[0])
            serializer=AddressSerializer(data=address_dict)
            if serializer.is_valid():
                address = serializer.save()
                chu_tro_data = request.data.copy()
                chu_tro_data['address']=serializer.validated_data
                chu_tro_serializer = ChuTroSerializer(data=chu_tro_data)
                if chu_tro_serializer.is_valid():
                    chu_tro_serializer.validated_data['is_active']=False
                    chu_tro=chu_tro_serializer.save(address=address)
                    
                    return Response(ChuTroSerializer(chu_tro).data, status=status.HTTP_201_CREATED)
                else: 
                    print(chu_tro_serializer.errors)  
                    return Response(chu_tro_serializer.errors, status=status.HTTP_400_BAD_REQUEST)                
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        except Exception as e:
            raise APIException(f"An error occurred while processing the request: {str(e)}")    





class PostWantViewSet(ModelViewSet):
    queryset = PostWant.objects.filter(active=True)
    serializer_class = PostWantSerializer
    pagination_class = ItemPaginator
    parser_classes = [MultiPartParser, JSONParser]


    def get_permissions(self):
        if self.action in ['upadate', 'partial_update', 'destroy','create']:
            return [permissions.IsAuthenticated(),IsOwnerPostWantOrHasPermission()]

        return[permissions.AllowAny()]


    @action(methods=['get', 'post'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        if request.method=='POST':
            content = request.data.get('content')
            c = Comment.objects.create(content=content, user=self.request.user, post=self.get_object())
            print(c)
            return Response(CommentSerializer(c).data)

        else:
            comments = self.get_object().comments.select_related('user').filter(active=True, replied_comment=None)
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(comments, self.request)

            if page is not None:
                return paginator.get_paginated_response(CommentSerializer(page, many=True).data)

            return Response(CommentSerializer(comments, many=True).data)


class IsOwnerPostForRentOrHasPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method in ['POST']:
            return ALLOWED_GROUPS[0] in request.user.groups


        return obj.user == request.user

class IsOwnerPostWantOrHasPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method in ['POST']:
            return ALLOWED_GROUPS[1] in request.user.groups

        return obj.user == request.user





class PostForRentViewSet(ModelViewSet):
    queryset = PostForRent.objects.filter(active=True)
    serializer_class = PostForRentSerializer
    pagination_class = ItemPaginator
    parser_classes = [MultiPartParser, JSONParser]

    def get_permissions(self):
        if self.action in ['upadate', 'partial_update', 'destroy','create']:
            return [permissions.IsAuthenticated(),IsOwnerPostForRentOrHasPermission()]

        return[permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return PostForRent.objects.filter(active=True) \
            .select_related('user', 'address') \
            .prefetch_related('images')

    @action(methods=['get', 'post'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        if request.method.__eq__('POST'):
            content = request.data.get('content')
            rpl = request.data.get('replied_comment')
            if rpl:
                try:
                    rpl = Comment.objects.get(id=rpl)
                except Comment.DoesNotExist:
                    rpl = None
            else:
                rpl = None
            c = Comment.objects.create(content=content, user=request.user, post=self.get_object(), replied_comment=rpl)

            return Response(CommentSerializer(c).data)

        else:
            comments = self.get_object().comments.select_related('user').filter(active=True, replied_comment=None)
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(comments, self.request)

            if page is not None:
                return paginator.get_paginated_response(CommentSerializer(page, many=True).data)

            return Response(CommentSerializer(comments, many=True).data)


class AddressViewSet(ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    parser_classes = [MultiPartParser]



    @action(detail=False, methods=['post'], url_path='create-address')
    def create_address(self, request):
        print("Dữ liệu nhận được:", request.data)

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            address = serializer.save()
            return Response({"message": "Address created successfully!", "data": AddressSerializer(address).data},
                            status=status.HTTP_201_CREATED)
        else:
            print("Errors:", serializer.errors)
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# class CommentViewSet(ModelViewSet):
#     queryset = Comment.objects.filter(active=True)
#     serializer_class = CommentSerializer
#     pagination_class = ItemSmallPaginator


def get_access_token():
    creds = Credentials(
        None,
        refresh_token=REFRESH_TOKEN,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=SECRET_ID
    )
    creds.refresh(Request())
    return creds.token


class NotificationViewSet(ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ItemSmallPaginator
    parser_classes = [MultiPartParser, JSONParser]

    def get_queryset(self):
        return Notification.objects.filter(active=True, sender=self.request.user) \
            .select_related('sender')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    def create(self, request, *args, **kwargs):
        current_user = request.user

        access_token = get_access_token()
        auth_string = f"user={EMAIL_HOST_USER}\x01auth=Bearer {access_token}\x01\x01"
        auth_bytes = base64.b64encode(auth_string.encode()).decode()

        # Thiết lập kết nối SMTP
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.ehlo()
        server.starttls()
        server.docmd("AUTH", "XOAUTH2 " + auth_bytes)

        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            notification = serializer.save(sender=current_user)

            # Lưu chi tiết cho từng follower
            followers = request.user.follower_relations.all()
            for follower in followers:
                DetailNotification.objects.create(receiver=follower.follower, notification=notification)
                if follower.follower.email:
                    # Khởi tạo msg mới trong mỗi lần lặp
                    msg = MIMEMultipart()
                    msg["From"] = EMAIL_HOST_USER
                    msg["To"] = follower.follower.email
                    msg["Subject"] = request.data.get('title')
                    msg.attach(MIMEText(request.data.get('content'), "plain"))

                    try:
                        server.sendmail(EMAIL_HOST_USER, follower.follower.email, msg.as_string())
                        print(f"Email đã gửi thành công đến {follower.follower.email}")
                    except smtplib.SMTPException as e:
                        print(f"Lỗi khi gửi email đến {follower.follower.email}: {e}")
                        continue
            # Đóng kết nối SMTP sau khi gửi xong tất cả email
            server.quit()

            return Response({"message": "Notification created successfully!"})

        # Đóng kết nối SMTP nếu serializer không hợp lệ
        server.quit()
        return Response(serializer.errors, status=400)


class FavouritePostViewSet(ModelViewSet):
    queryset = FavoritePost.objects.filter(active=True)
    serializer_class = FavouritePostSerializer
    pagination_class = ItemSmallPaginator
    permission_classes = [IsOwnerPostForRentOrHasPermission,IsOwnerPostForRentOrHasPermission]
    
    # def get_queryset(self):
    #     return FavoritePost.objects.filter(active=True, user=self.request.user)

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
            print(idinfo)
            # Lấy thông tin từ Google
            email = idinfo.get("email")
            fname = idinfo.get("given_name")
            lname = idinfo.get("family_name")
            avatar = idinfo.get('picture')
            if not email:
                return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

            # Tìm hoặc tạo người dùng
            user, created = User.objects.get_or_create(email=email,
                                                       defaults=
                                                       {"first_name": fname,
                                                        "last_name": lname,
                                                        "avatar": avatar})

            group = Group.objects.get(name="Người thuê trọ")
            if not user.groups.filter(id=group.id).exists():
                user.groups.add(group)
            # Tạo OAuth2 Token
            application = Application.objects.get(
                client_id="0R6hMr4Zhgl9LeXoWrxDNSTkLgpZymmtLJeINUFN")  # Ứng dụng của bạn
            access_token = AccessToken.objects.create(
                user=user,
                application=application,
                token=secrets.token_urlsafe(),
                expires=now() + timedelta(seconds=3600),
                scope='read write'
            )

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
    def list_districts(self, request, pk=None):
        try:

            province = self.get_object()
            districts = province.districts.all()
            serializer = DistrictSerializer(districts, many=True)
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
    parser_classes = (MultiPartParser, FormParser, JSONParser)

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


ALLOWED_GROUPS = ["Chủ trọ", "Người thuê trọ"]


class AccessGroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "GET":
            return True
        return request.user.is_staff    

class AvailableGroupsView(ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Group.objects.filter(name__in=ALLOWED_GROUPS)
    serializer_class = GroupSerializer

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


    