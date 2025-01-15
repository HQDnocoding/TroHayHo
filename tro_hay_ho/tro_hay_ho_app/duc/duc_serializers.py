from zoneinfo import available_timezones

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from ..models import *
from ..serializers import *




class ConsersationSerializer(ModelSerializer):
    user1=UserSerializer()
    user2=UserSerializer()
    latest_message=serializers.SerializerMethodField()
    class Meta:
        model = Conversation
        fields='__all__'
    def get_latest_message(self,obj):
        latest_message=obj.messages.filter(active=True).order_by('-updated_date').first()
        if(latest_message):
            # cach 1
            return {
                'content': latest_message.content,
                'date_sending': latest_message.date_sending,
                'user_id': latest_message.user_id
            }
            #cach 2 : return MessageSerializer(latest_message).data
        return None

class MessageSerializer(ModelSerializer):
    conversation=ConsersationSerializer
    class Meta:
        model = Message
        fields='__all__'
# class UserConversationSerializer(ModelSerializer):
#     avatar = serializers.ImageField(required=False)
#     phone = serializers.CharField(required=False)
#     conversation=ConsersationSerializer(many=True, source=['conversation_user2','conversation_user1'], read_only=True)
#
#     def create(self, validated_data):
#         user = User(**validated_data)
#         user.set_password(user.password)
#
#         user.save()
#         return user
#
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'password', 'role', 'phone', 'date_joined']
#
#         extra_kwargs = {
#             'password': {
#                 'write_only': True
#             }
#         }