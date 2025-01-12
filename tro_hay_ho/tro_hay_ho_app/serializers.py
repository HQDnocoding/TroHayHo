from zoneinfo import available_timezones

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import User,Role


class UserSerializer(ModelSerializer):
    avatar = serializers.ImageField(required=False)
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)

        user.save()
        return user


    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'password','role']

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class RoleSerializer(ModelSerializer):
    class Meta:
        model= Role
        fields='__all__'