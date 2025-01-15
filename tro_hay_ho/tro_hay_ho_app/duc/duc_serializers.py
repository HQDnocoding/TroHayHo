from zoneinfo import available_timezones

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from ..models import *
from ..serializers import *




class ConsersationSerializer(ModelSerializer):
    user1=UserSerializer
    class Meta:
        model = Conversation
        fields='__all__'

class MessageSerializer(ModelSerializer):
    conversation=ConsersationSerializer
    class Meta:
        model = Message
        fields='__all__'


