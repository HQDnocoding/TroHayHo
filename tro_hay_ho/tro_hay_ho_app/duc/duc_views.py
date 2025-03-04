from django.http import HttpResponse
from django.shortcuts import render,get_object_or_404
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.status import  HTTP_201_CREATED, HTTP_400_BAD_REQUEST,HTTP_200_OK,HTTP_404_NOT_FOUND,HTTP_500_INTERNAL_SERVER_ERROR
from rest_framework.viewsets import ViewSet
from rest_framework.viewsets import ModelViewSet,GenericViewSet,ReadOnlyModelViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin,CreateModelMixin,DestroyModelMixin
from ..paginator import ItemPaginator, ItemSmallPaginator
from ..models import User, Role
from ..serializers import *
from .duc_serializers import *
from django.db.models import Q
from django.db.models.functions import Lower
from django.db.models.functions import TruncMonth, TruncYear, TruncQuarter,ExtractQuarter
from django.db.models import Count
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from .dpermissions import *
import json
class ConversationViewSet(ReadOnlyModelViewSet):
    serializer_class = ConsersationSerializer
    pagination_class = ItemSmallPaginator

    def get_queryset(self):
        return Conversation.objects.filter(active=True) \
            .select_related('user1','user2')


class MessageViewSet(ReadOnlyModelViewSet):
    serializer_class = MessageSerializer
    pagination_class = ItemSmallPaginator

    def get_queryset(self):
        return Message.objects.filter(active=True) \
            .select_related('user')


class UserConversationViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    pagination_class = ItemSmallPaginator
    serializer_class = ConsersationSerializer
    queryset = Conversation.objects.filter(active=True)
    @action(detail=False, methods=['get'], url_path=r'user/(?P<user_id>\d+)')
    def get_user_conversations(self, request, user_id=None):
        conversations = Conversation.objects.filter(
        Q(user1_id=user_id) |  Q(user2_id=user_id),

        active=True,
        ).select_related('user1', 'user2').prefetch_related('messages').order_by('-updated_date')

        # serializer = self.get_serializer(conversations, many=True)
        # phan trang
        page = self.paginate_queryset(conversations)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(conversations, many=True)
        return Response(serializer.data)

class ConversationMessageViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    pagination_class = ItemSmallPaginator
    serializer_class = MessageSerializer
    queryset = Message.objects.filter(active=True)
    @action(detail=False, methods=['get'], url_path=r'conversation/(?P<conversation_id>\d+)')
    def get_user_conversations(self, request, conversation_id=None):
        messages = Message.objects.filter(
            conversation_id=conversation_id,
        active=True,
        ).order_by('-updated_date')

        # phan trang
        page = self.paginate_queryset(messages)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

class UserPostWantViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    pagination_class = ItemSmallPaginator
    serializer_class = PostWantSerializer
    queryset = PostWant.objects.filter( active=True)
    @action(detail=False,methods=['get'],url_path=r'show/user/(?P<user_id>\d+)')
    def get_user_post_want(self,request,user_id=None):
        post_want= PostWant.objects.filter(
             Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),
            active=True,
                                          user_id=user_id
                                          ).order_by('-updated_date')
        page= self.paginate_queryset(post_want)
        if page is not None:
            serializers=self.get_serializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=self.get_serializer(post_want,many=True)
        return Response(serializers.data)
    @action(detail=False,methods=['get'],url_path=r'hide/user/(?P<user_id>\d+)')
    def get_user_hide_post_want(self,request,user_id=None):
        post_for_rent= PostWant.objects.filter(
                                           is_show=False,

                                            active=True,
                                          user_id=user_id,
                                          ).order_by('-updated_date')
        page= self.paginate_queryset(post_for_rent)
        if page is not None:
            serializers=self.get_serializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=self.get_serializer(post_for_rent,many=True)
        return Response(serializers.data)


class UserPostForRentViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    pagination_class = ItemSmallPaginator
    serializer_class = PostForRentSerializer
    queryset = PostForRent.objects.filter( active=True)
    @action(detail=False,methods=['get'],url_path=r'show/user/(?P<user_id>\d+)')
    def get_user_post_for_rent(self,request,user_id=None):
        post_for_rent= PostForRent.objects.filter(
                                           Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),

                                            active=True,
                                          user_id=user_id,
                                          ).order_by('-updated_date')
        page= self.paginate_queryset(post_for_rent)
        if page is not None:
            serializers=self.get_serializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=self.get_serializer(post_for_rent,many=True)
        return Response(serializers.data)
    @action(detail=False,methods=['get'],url_path=r'hide/user/(?P<user_id>\d+)')
    def get_user_hide_post_for_rent(self,request,user_id=None):
        post_for_rent= PostForRent.objects.filter(
                                           is_show=False,

                                            active=True,
                                          user_id=user_id,
                                          ).order_by('-updated_date')
        page= self.paginate_queryset(post_for_rent)
        if page is not None:
            serializers=self.get_serializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=self.get_serializer(post_for_rent,many=True)
        return Response(serializers.data)

class BasicUserInfoViewSet(ModelViewSet):
    pagination_class = ItemSmallPaginator
    serializer_class = BasicUserInfoSerializer
    queryset = User.objects.filter(is_active=True)
    # required_scopes = ['read', 'write', 'groups']

    # def get_permissions(self):
    #     if self.action in ['update_me_following_you', 'get_detail_notification',
    #                        'update_me_favotite_post',
    #                       'me_favorite_post',]:
    #         return [IsInRenterOrOwnerGroup(), TokenHasScope()]
    #     return [permissions.AllowAny()]
    
    @action(detail=True,methods=['get'],url_path='detail-notification')
    def get_detail_notification(self,request,pk=None):
    
        detail_notification=DetailNotification.objects.filter(receiver_id=pk)\
            .select_related('notification')\
                .order_by('-created_date')
        page= self.paginate_queryset(detail_notification)
        if page is not None:
            serializers=DetailNotificationSerializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=self.get_serializer(detail_notification,many=True)
        return Response(serializers.data)
    @action(detail=True,methods=['patch'],url_path=r'detail-notification/(?P<d_noti_id>\d+)')
   
    def update_id_read_detail_notification(self,request,pk=None,d_noti_id=None):
        try:
            is_read_status = request.data.get('is_read')
            if is_read_status is None:
                return Response({'error': 'Is read status is required.'}, status=HTTP_400_BAD_REQUEST)
            
            detail_notification=DetailNotification.objects.filter(id=d_noti_id).first()
            if not detail_notification:
                return Response({'error':' can noit update read because detail-notification not found'},status=HTTP_400_BAD_REQUEST)
            detail_notification.is_read=is_read_status
            detail_notification.save()
            
            return Response({
                'message': 'is read updated successfully.',
                'receiver': pk,
                'detail_notification': d_noti_id,
                'is_read': detail_notification.is_read
            }, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error a': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    # lay nhung ai minh dang theo doi va tao theo doi moi
    @action(detail=True,methods=['get','post'],url_path='following')
    def manager_following(self,request,pk=None):
        if request.method == 'GET':
            following = Following.objects.filter(follower_id=pk,active=True).order_by('-created_date')
            page= self.paginate_queryset(following)
            if page is not None:
                serializers=BasicFollowSerializer(page,many=True)
                return self.get_paginated_response(serializers.data)
            serializers=BasicFollowSerializer(following,many=True)
            return Response(serializers.data)
        elif request.method == 'POST':
            followed_id = request.data.get('followed')
            if not User.objects.filter(id=followed_id,is_active=True).exists():
                return Response({'error':'User not found'},status=HTTP_400_BAD_REQUEST)
            if Following.objects.filter(follower_id=pk,followed_id=followed_id,active=True).exists():
                return Response({'error':'relation already exists'},status=HTTP_400_BAD_REQUEST)
            Following.objects.create(follower_id=pk,followed_id=followed_id)
            return Response({"message": "Following relationship created successfully."}, status=HTTP_201_CREATED)
    
    @action(detail=True,methods=['get'],url_path='who-following-me')
    def who_following_me(self,request,pk=None):
        following = Following.objects.filter(followed_id=pk,active=True).order_by('-created_date')
        page= self.paginate_queryset(following)
        if page is not None:
            serializers=BasicFollowSerializer(page,many=True)
            return self.get_paginated_response(serializers.data)
        serializers=BasicFollowSerializer(following,many=True)
        return Response(serializers.data)
    
    @action(detail=True,methods=['get'],url_path=r'check-me-following-you/(?P<user_id>\d+)')
    def check_me_following_you(self,request,pk,user_id=None):
        exists = Following.objects.filter(follower_id=pk, followed_id=user_id, active=True).exists()
        if exists:
            return Response({"following": True}, status=HTTP_200_OK)
        return Response({"following": False}, status=HTTP_200_OK)
    @action(detail=True, methods=['patch'], url_path=r'update-me-following-you/(?P<user_id>\d+)')
    def update_me_following_you(self, request, pk, user_id=None):
        try:
          
            active_status = request.data.get('active')
            if active_status is None:
                return Response({'error': 'Active status is required.'}, status=HTTP_400_BAD_REQUEST)

            following = Following.objects.filter(follower_id=pk, followed_id=user_id).first()

            if not following:


                if bool(active_status) == True:
                    new_following = Following.objects.create(follower_id=pk, followed_id=user_id)
                    new_following.active = active_status
                    new_following.save()

                return Response({
                'message': 'Following relationship updated successfully.',
                'follower_id': pk,
                'followed_id': user_id,
                'active': active_status
            }, status=HTTP_200_OK)


            if bool(active_status) == True:
                following.active = active_status
                following.save()
            elif bool(active_status) == False :
                following.delete()

            return Response({
                'message': 'Following relationship updated successfully.',
                'follower_id': pk,
                'followed_id': user_id,
                'active': active_status
            }, status=HTTP_200_OK)

        except Exception as e:
            return Response({'error a': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    @action(detail=True,methods=['get'],url_path='me-favorite-post')
    def me_favorite_post(self,request,pk=None):
        favoritePost = FavoritePost.objects.filter(active=True,user_id=pk).order_by('-updated_date')
        page= self.paginate_queryset(favoritePost)
        serializers=FavouritePostSerializer(favoritePost,many=True)
        return Response(serializers.data)
    @action(detail=True, methods=['patch'], url_path=r'update-me-favotite-post/(?P<post_id>\d+)')
    def update_me_favotite_post(self, request, pk, post_id=None):
        try:
          
            active_status = request.data.get('active')
            if active_status is None:
                return Response({'error': 'Active status is required.'}, status=HTTP_400_BAD_REQUEST)

            favorite_post = FavoritePost.objects.filter(user_id=pk, post_id=post_id).first()

            if not favorite_post:
                new_favorite_post=FavoritePost.objects.create(user_id=pk, post_id=post_id)
                new_favorite_post.active=active_status
                new_favorite_post.save()
                return Response({
                'message': 'Favorite post updated successfully.',
                'user': pk,
                'post': post_id,
                'active': new_favorite_post.active
            }, status=HTTP_200_OK)

            favorite_post.active = active_status
            favorite_post.save()

            return Response({
                'message': 'Favorite post updated successfully.',
                'user': pk,
                'post': post_id,
                'active': favorite_post.active
            }, status=HTTP_200_OK)

        except Exception as e:
            return Response({'error a': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=True, methods=['get'], url_path=r'post-want-following')
    def post_want_following(self, request, pk=None):
        try:
            following_users = Following.objects.filter(follower_id=pk, active=True).values_list('followed_id', flat=True)
            
            post_wants = PostWant.objects.filter(Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),user_id__in=following_users, active=True).order_by('-updated_date')
            
            page = self.paginate_queryset(post_wants)
            if page is not None:
                serializer = PostWantSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = PostWantSerializer(post_wants, many=True)
            return Response(serializer.data, status=HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    @action(detail=True, methods=['get'], url_path=r'post-for-rent-following')
    def post_for_rent_following(self, request, pk=None):
        try:
            following_users = Following.objects.filter(follower_id=pk, active=True).values_list('followed_id', flat=True)
            
            post_for_rents = PostForRent.objects.filter(Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),user_id__in=following_users, active=True).order_by('-updated_date')
            
            page = self.paginate_queryset(post_for_rents)
            if page is not None:
                serializer = PostForRentSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = PostForRentSerializer(post_for_rents, many=True)
            return Response(serializer.data, status=HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    @action(detail=True,methods=['patch'],url_path=r'update-post-manager/(?P<post_id>\d+)')
    def update_post_manager(self,request,pk=None,post_id=None):
        try:
            is_show_status = request.data.get('is_show')
            if is_show_status is None:
                return Response({'error': 'Is show status is required.'}, status=HTTP_400_BAD_REQUEST)
            
            post=Post.objects.filter(id=post_id).first()
            if not post:
                return Response({'error':' can noit update is show because post not found'},status=HTTP_400_BAD_REQUEST)
            post.is_show=is_show_status
            post.save()
            
            return Response({
                'message': 'is show updated successfully.',
                'user': pk,
                'post_id': post_id,
                'is_read': post.is_show
            }, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error a': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    @action(detail=True,methods=['delete'],url_path=r'delete-post-manager/(?P<post_id>\d+)')
    def delete_post_manager(self,request,pk=None,post_id=None):
        try:
            post=Post.objects.filter(id=post_id).first()
            if not post:
                return Response({'error':' can noit delete because post not found'},status=HTTP_400_BAD_REQUEST)
            post.active=False
            post.save()   
            return Response({
                'message': 'delete soft post successfully.',
                'receiver': pk,
                'post_id': post_id,
                'active': post.active
            }, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error a': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class PostParentViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    queryset = Post.objects.filter(Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),active=True).order_by('-created_date')
    serializer_class=PostParentSerializer
    pagination_class=ItemSmallPaginator
    def get_queryset(self):
        queryset = Post.objects.filter(
            Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),
            active=True
        ).order_by('-created_date')

        # Get filter parameters from request
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        min_acreage = self.request.query_params.get('min_acreage')
        max_acreage = self.request.query_params.get('max_acreage')
        post_type = self.request.query_params.get('type')
        province_code = self.request.query_params.get('province_code')
        district_code = self.request.query_params.get('district_code')
        ward_code = self.request.query_params.get('ward_code')
        kw_title = self.request.query_params.get('kw_title')
        is_newest = self.request.query_params.get('is_newest')
        number_people = self.request.query_params.get('number_people')

        # sap xep lai thu tu
        if is_newest is not None:
            is_newest = int(is_newest)
        if is_newest==1:
            queryset = queryset.order_by('-created_date')
        elif is_newest==0:
            queryset = queryset.order_by('created_date')
        else:
            queryset = queryset.order_by('-created_date')
            
        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))
        
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))

        if post_type:
            if post_type.lower() == 'postwant':
                queryset = queryset.filter(postwant__isnull=False)
            elif post_type.lower() == 'postforrent':
                queryset = queryset.filter(postforrent__isnull=False)
                
                if min_acreage:
                    queryset = queryset.filter(postforrent__acreage__gte=float(min_acreage))
                if max_acreage:
                    queryset = queryset.filter(postforrent__acreage__lte=float(max_acreage))
                    
                if number_people:
                    queryset = queryset.filter(postforrent__max_number_of_people__lte=int(number_people))
                

        if province_code:
            queryset = queryset.filter(address__province=province_code)
        if district_code:
            queryset = queryset.filter(address__district=district_code)
        if ward_code:
            queryset = queryset.filter(address__ward=ward_code)

        if kw_title:
            queryset = queryset.annotate(lower_title=Lower('title')).filter(
                lower_title__icontains=kw_title.lower()
            )

        return queryset
    def get_object(self):
        pk = self.kwargs.get('pk')
        
        try:
            return PostWant.objects.get(id=pk)
        except PostWant.DoesNotExist:
            pass
            
        try:
            return PostForRent.objects.get(id=pk)
        except PostForRent.DoesNotExist:
            pass
            
        return super().get_object()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            obj = self.get_object()
            if isinstance(obj, PostWant):
                return BasicPostWantSerializer
            elif isinstance(obj, PostForRent):
                return BasicPostForRentSerializer
                
        return super().get_serializer_class()
    
class DetailNotificationViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    queryset = DetailNotification.objects.filter(active=True).order_by('-created_date')
    serializer_class=DetailNotificationSerializer
    pagination_class=ItemSmallPaginator
    
    
class BasicPostForRentShowViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    serializer_class = PostForRentSerializer
    pagination_class = ItemPaginator
    queryset = PostForRent.objects.filter(Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),active=True)

    def get_queryset(self):
        return PostForRent.objects.filter(Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),active=True) \
            .select_related('user', 'address') \
            .prefetch_related('images')
            
            
class BasicPostWantShowViewSet(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    queryset = PostWant.objects.filter(Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),active=True)
    serializer_class = PostWantSerializer
    pagination_class = ItemPaginator

    def get_queryset(self):
        return PostWant.objects.filter(Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),active=True) \
            .select_related('user', 'address') 
           
class TestViewSet(ModelViewSet):
    queryset = PostWant.objects.filter(Q(is_show=True) | Q(is_show=None) | Q(is_show__isnull=True),active=True)
    serializer_class = PostWantSerializer
    @action(detail=False,methods=['get'],url_path=r'test')
    def test(self,request,pk=None):
        e=User.objects.all().annotate(month=TruncMonth('date_joined'))\
            .values('month')\
        .annotate(
        total=Count('id'),
        active=Count('id', filter=Q(is_active=True))
    )\
    .order_Sby('month')
        return Response({'error a': str(e)}, status=HTTP_200_OK)
# class FollowViewSet(ViewSet, CreateAPIView):
#     serializer_class = FollowSerializer
  

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=HTTP_201_CREATED)
#         return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
