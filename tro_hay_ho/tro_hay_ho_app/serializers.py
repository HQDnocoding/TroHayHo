import re
from zoneinfo import available_timezones

from django.contrib.auth.models import Group
from django.core.mail import send_mail
from django.dispatch import receiver
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *
from tro_hay_ho.settings import EMAIL_HOST_USER


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class UserSerializer(ModelSerializer):
    avatar = serializers.ImageField(required=False)
    groups = serializers.SlugRelatedField(
        queryset=Group.objects.all(),
        slug_field='name',
        many=True
    )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print(data['avatar'])
        print(instance.avatar)
        data['avatar'] = instance.avatar.url if instance.avatar else ''
        return data

    def validate_password(self, value):
        """
        Kiểm tra mật khẩu:
        - Ít nhất 8 ký tự
        - Chứa ít nhất một chữ hoa
        - Không chứa khoảng trắng
        """
        if len(value) < 8:
            raise serializers.ValidationError("Mật khẩu phải có ít nhất 8 ký tự.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Mật khẩu phải chứa ít nhất một chữ hoa.")
        if " " in value:
            raise serializers.ValidationError("Mật khẩu không được chứa khoảng trắng.")
        return value

    def validate_username(self, value):
        """
        Kiểm tra username:
        - Ít nhất 8 ký tự
        - Không chứa khoảng trắng
        """
        if len(value) < 8:
            raise serializers.ValidationError("Username phải có ít nhất 8 ký tự.")
        if " " in value:
            raise serializers.ValidationError("Username không được chứa khoảng trắng.")
        return value

    def create(self, validated_data):
        print(validated_data)
        group_name = validated_data.pop('groups')
        print(group_name)
        user = User(**validated_data)
        user.set_password(user.password)
        print(user)
        user.set_password(user.password)
        group = Group.objects.get(name=group_name[0])

        user.save()
        user.groups.add(group)
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name','email',
                  'avatar', 'password', 'phone', 'date_joined', 'groups']

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
        
class AddressSerializer(ModelSerializer):
    coordinates=serializers.CharField(required=False)
    class Meta:
        model = Address
        fields = '__all__'



class WardSerializer(ModelSerializer):
    class Meta:
        model = Ward
        fields = ['code', 'name', 'full_name']


class DistrictSerializer(ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'


class ProvinceSerializer(ModelSerializer):
    class Meta:
        model = Province
        fields = ['code', 'name', 'full_name']

        
class TroImageSerializer(ModelSerializer):
    image_tro=serializers.ImageField(required=False)
    chu_tro = serializers.PrimaryKeyRelatedField(queryset=ChuTro.objects.all())
    class Meta:
        model=TroImage
        fields='__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['image_tro'] = instance.image_tro.url if instance.image_tro else None
        return representation

class ChuTroSerializer(ModelSerializer):
    avatar = serializers.ImageField(required=False)
    groups = serializers.SlugRelatedField(
        queryset=Group.objects.all(),
        slug_field='name',
        many=True
    )
    address=AddressSerializer(required=False,many=False)
    image_tro=TroImageSerializer(many=  True,read_only=True,required=False)
    is_active=serializers.BooleanField(default=False,required=False,read_only=True)
    class Meta:
        model=ChuTro
        fields =  ['id', 'username', 'first_name', 'last_name','email','address','is_active',
                  'avatar', 'password', 'phone', 'date_joined', 'groups','image_tro']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
    def create(self, validated_data):
        group_name = validated_data.pop('groups')
        group = Group.objects.get(name=group_name[0])
        data = validated_data.copy()
        
        u = ChuTro(**data)
        u.set_password(u.password)
        
        u.save()
        u.groups.add(group)
        u.save()

        return u 
    
    def validate_password(self, value):
        """
        Kiểm tra mật khẩu:
        - Ít nhất 8 ký tự
        - Chứa ít nhất một chữ hoa
        - Không chứa khoảng trắng
        """
        if len(value) < 8:
            raise serializers.ValidationError("Mật khẩu phải có ít nhất 8 ký tự.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Mật khẩu phải chứa ít nhất một chữ hoa.")
        if " " in value:
            raise serializers.ValidationError("Mật khẩu không được chứa khoảng trắng.")
        return value
        
    def validate_username(self, value):
        """
        Kiểm tra username:
        - Ít nhất 8 ký tự
        - Không chứa khoảng trắng
        """
        if len(value) < 8:
            raise serializers.ValidationError("Username phải có ít nhất 8 ký tự.")
        if " " in value:
            raise serializers.ValidationError("Username không được chứa khoảng trắng.")
        return value

    def validate_phone(self, value):
        """
        Kiểm tra số điện thoại:
        - Bắt đầu bằng số 0
        - Có đúng 10 chữ số
        - Chỉ chứa số (0-9)
        """
        if not re.fullmatch(r"0\d{9}", value):  # Số bắt đầu bằng 0 và có 10 chữ số
            raise serializers.ValidationError(
                "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (10 chữ số, bắt đầu bằng 0).")
        return value

class FollowerSerializer(ModelSerializer):
    # followed=UserSerializer()
    follower = UserSerializer()

    class Meta:
        model = Following
        fields = ['follower']


class FollowingSerializer(ModelSerializer):
    followed = UserSerializer()

    # follower=UserSerializer()
    class Meta:
        model = Following
        fields = ['followed']




class PostImageSerializer(ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['image']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['image'] = instance.image.url if instance.image else None
        return representation


class PostForRentSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    address = AddressSerializer()
    post_image = PostImageSerializer(many=True, source='images', required=False)
    type = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PostForRent
        fields = '__all__'

    def get_type(self, obj):
        return 'PostForRent'

    def create(self, validated_data):
        request = self.context['request']
        images_data = request.FILES.getlist('images')
        address_data = validated_data.pop('address')

        # Tạo địa chỉ
        address = Address.objects.create(**address_data)

        # Tạo bài đăng
        post_for_rent = PostForRent.objects.create(address=address, **validated_data)

        # Tạo các hình ảnh liên quan
        for image_data in images_data:
            PostImage.objects.create(post=post_for_rent, image=image_data)

        return post_for_rent


class PostWantSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    address = AddressSerializer()
    type = serializers.SerializerMethodField()

    class Meta:
        model = PostWant
        fields = '__all__'

    def get_type(self, obj):
        return 'PostWant'

    def create(self, validated_data):
        address_data = validated_data.pop('address', None)
        if address_data:
            address, created = Address.objects.get_or_create(**address_data)
            validated_data['address'] = address
        return super().create(validated_data)


class PostSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    post_image = PostImageSerializer(many=True, source='images', read_only=True)

    class Meta:
        model = PostWant
        fields = '__all__'


class NotificationSerializer(ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['sender','title', 'content', 'post']




class CommentSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_replies(self, obj):
        replies = obj.comments.all()
        return CommentSerializer(replies, many=True).data


class FavouritePostSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)

    class Meta:
        model = FavoritePost
        fields = ['id', 'created_date', 'updated_date', 'active', 'user', 'post']


class PostImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all(), required=False)

    class Meta:
        model = PostImage
        fields = '__all__'
