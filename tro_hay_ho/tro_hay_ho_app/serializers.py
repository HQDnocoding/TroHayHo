from zoneinfo import available_timezones

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import User,Role,PostWant,PostForRent,Address,Ward,District,Province,PostImage, Comment,Notification


class UserSerializer(ModelSerializer):
    avatar = serializers.ImageField(required=False)
    phone=serializers.CharField(required=False)
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)

        user.save()
        return user


    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'password','role','phone','date_joined']

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class RoleSerializer(ModelSerializer):
    class Meta:
        model= Role
        fields='__all__'


class WardSerializer(ModelSerializer):
    class Meta:
        model = Ward
        fields=['code','name','full_name']
class DistrictSerializer(ModelSerializer):
    class Meta:
        model = District
        fields = ['code', 'name', 'full_name']

class ProvinceSerializer(ModelSerializer):
    class Meta:
        model = Province
        fields = ['code', 'name', 'full_name']
class AddressSerializer(ModelSerializer):
    province=ProvinceSerializer()
    district=DistrictSerializer()
    ward=WardSerializer()
    class Meta:
        model = Address
        fields='__all__'
class PostImageSerializer(ModelSerializer):


    class Meta:
        model = PostImage
        fields = ['id', 'image', 'post']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['image'] = instance.image.url if instance.image else None
        return representation

class PostForRentSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    address = AddressSerializer(read_only=True)
    post_image=PostImageSerializer(many=True, source='images', read_only=True)
    class Meta:
        model = PostForRent
        fields='__all__'

class PostWantSerializer(ModelSerializer):
    user=UserSerializer(read_only=True)
    address=AddressSerializer(read_only=True)
    class Meta:
        model = PostWant
        fields='__all__'

class NotificationSerializer(ModelSerializer):
    sender=UserSerializer(read_only=True)
    class Meta:
        model = Notification
        fields='__all__'


class CommentSerializer(ModelSerializer):
    
    class Meta:
        model=Comment
        fields='__all__'