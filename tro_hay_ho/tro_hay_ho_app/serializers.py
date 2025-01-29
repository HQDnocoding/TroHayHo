from zoneinfo import available_timezones

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *



class RoleSerializer(ModelSerializer):
    class Meta:
        model= Role
        fields='__all__'
        

class UserSerializer(ModelSerializer):
    avatar = serializers.ImageField(required=False)
    phone=serializers.CharField(required=False)
    # role=RoleSerializer()
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




class WardSerializer(ModelSerializer):
    class Meta:
        model = Ward
        fields=['code','name','full_name']
        
        
class DistrictSerializer(ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'


class ProvinceSerializer(ModelSerializer):
    class Meta:
        model = Province
        fields = ['code', 'name', 'full_name']
        
    

class AddressSerializer(ModelSerializer):
    
    class Meta:
        model = Address
        fields = '__all__'
        
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
    post_image=PostImageSerializer(many=True, source='images',required=False)
    type = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = PostForRent
        fields='__all__'
     
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
    user=UserSerializer(read_only=True)
    address=AddressSerializer(read_only=True)
    type = serializers.SerializerMethodField()
    class Meta:
        model = PostWant
        fields='__all__'
    def get_type(self, obj):
        return 'PostWant'
        
class PostSerializer(ModelSerializer):
    user=UserSerializer(read_only=True)
    post_image=PostImageSerializer(many=True, source='images', read_only=True)

    class Meta:
        model = PostWant
        fields='__all__'     


class NotificationSerializer(ModelSerializer):
    sender=UserSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields='__all__'


class CommentSerializer(ModelSerializer):
    user=UserSerializer(read_only=True)
    replies=serializers.SerializerMethodField()
    
    class Meta:
        model=Comment
        fields='__all__'
    
    
    def get_replies(self,obj):
        replies=obj.comments.all()
        return CommentSerializer(replies,many=True).data



class FavouritePostSerializer(serializers.ModelSerializer):

    post = PostSerializer(read_only=True)

    class Meta:
        model = FavoritePost
        fields = ['id', 'created_date', 'updated_date', 'active', 'user', 'post']


class PostImageSerializer(serializers.ModelSerializer):
    image=serializers.ImageField()
    post = serializers.PrimaryKeyRelatedField(  queryset=Post.objects.all(), required=False)
    class Meta:
        model=PostImage
        fields='__all__'
