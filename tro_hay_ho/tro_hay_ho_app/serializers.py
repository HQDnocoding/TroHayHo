from zoneinfo import available_timezones

from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *



class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id','name']

class UserSerializer(ModelSerializer):
    avatar=serializers.ImageField(required=False)
    groups = serializers.SlugRelatedField(
        queryset=Group.objects.all(),
        slug_field='name'  ,
        many=True
    ) 
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        print(data['avatar'])
        print(instance.avatar)
        data['avatar'] = instance.avatar.url if instance.avatar else ''
        return data
    
    def validate_username(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Username phải có ít nhất 6 ký tự.")

        if " " in value:
            raise serializers.ValidationError("Username không được chứa khoảng trắng.")

        return value
    
    def create(self, validated_data):
        print(validated_data)
        group_name = validated_data.pop('groups')
        print(group_name)
        user = User(**validated_data)
        user.set_password(user.password)
        group = Group.objects.get(name=group_name[0])
       
        user.save()
        user.groups.add(group)
        user.save()
        return user


    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'password','phone','date_joined','groups','following_relations','follower_relations']

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class FollowingSerializer(ModelSerializer):
    class Meta:
        model=Following
        fields='__all__'


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
    address=AddressSerializer()
    type = serializers.SerializerMethodField()
    
    
    class Meta:
        model = PostWant
        fields='__all__'
    def get_type(self, obj):
        return 'PostWant'
        
    def create(self, validated_data):
        address_data=validated_data.pop('address',None)
        if address_data:
            address,created=Address.objects.get_or_create(**address_data)
            validated_data['address']=address
        return super().create(validated_data)
    
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

