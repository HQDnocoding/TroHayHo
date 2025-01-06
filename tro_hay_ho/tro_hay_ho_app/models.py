from django.contrib.auth.models import AbstractUser
from django.db import models


class Base(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-id']


class Role(models.Model):
    """Vai trò"""
    role_name = models.CharField(max_length=100)

    def __str__(self):
        return self.role_name


class User(AbstractUser):
    """Người dùng"""
    phone = models.CharField(max_length=15, blank=True, null=True)
    avatar = models.ImageField(upload_to='tro_hay_ho_app/%Y/%m/',
                               null=True, blank=True)

    role = models.ForeignKey('Role', on_delete=models.SET_NULL, related_name='users', related_query_name='user',null=True)
    following = models.ManyToManyField('User', symmetrical=False, related_name='followers', through='Following')
    conversation = models.ManyToManyField('self', symmetrical=True, through='Conversation')
    notification = models.ManyToManyField('User', symmetrical=False, related_name='notifications',
                                          through='Notification')

    def _str_(self):
        return self.username


class Following(models.Model):
    """Thông tin follwing"""
    follower = models.ForeignKey('User', on_delete=models.CASCADE, related_name='following_relations')
    followed = models.ForeignKey('User', on_delete=models.CASCADE, related_name='follower_relations')
    followed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.followed_at


class Conversation(models.Model):
    """Cuộc trao đổi"""
    user1 = models.ForeignKey('User', on_delete=models.SET_NULL,null=True, related_name='conversation_user1')
    user2 = models.ForeignKey('User', on_delete=models.SET_NULL,null=True, related_name='conversation_user2')
    date_start = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.date_start


class Message(models.Model):
    content = models.TextField(null=False)
    date_sending = models.DateTimeField(auto_now_add=True)

    conversation = models.ForeignKey('Conversation', on_delete=models.CASCADE, related_name='messages',
                                     related_query_name='message')
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='messages', related_query_name='message')

    def __str__(self):
        return self.content


class Post(Base):
    title = models.TextField(null=False)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField(null=True, blank=True, default=0)

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='posts', related_query_name='post')
    address = models.ForeignKey('Address', on_delete=models.SET_NULL, related_name='posts', related_query_name='post',null=models.SET_NULL)

    def __str__(self):
        return self.title


class PostWant(Post):
    post_ptr = models.OneToOneField('Post', on_delete=models.CASCADE, primary_key=True, parent_link=True)
    price_range_min = models.FloatField(null=True, blank=True, default=0)
    price_range_max = models.FloatField(null=True, blank=True, default=0)


class PostForRent(Post):
    post_ptr = models.OneToOneField('Post', on_delete=models.CASCADE, primary_key=True, parent_link=True)
    acreage = models.FloatField(null=True, blank=True, default=0)
    max_number_of_people = models.IntegerField(null=True, blank=True, default=0)
    phone_contact = models.CharField(max_length=15, null=False)
    name_agent = models.CharField(max_length=100, null=False)
    verified = models.BooleanField(default=True, null=False)


class PostImage(models.Model):
    image = models.ImageField(upload_to='tro_hay_ho_app/%Y/%m/',
                              null=True, blank=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='images', related_query_name='image')


class Comment(models.Model):
    content = models.TextField(null=False)
    date_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='comments', related_query_name='comment')
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='comments', related_query_name='comment')
    replied_comment = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='comments',
                                        related_query_name='comment', null=True)

    def __str__(self):
        return self.content


class Address(models.Model):
    specified_address = models.TextField(null=False, blank=False)
    coordinates = models.TextField(null=False, blank=False)
    province = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='provinces')
    district = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='districts')
    ward = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='wards')

    def __str__(self):
        return self.specified_address


class TypeLocation(models.Model):
    type = models.CharField(max_length=20, null=False)

    def __str__(self):
        return self.type


class Location(models.Model):
    name = models.TextField(max_length=100, null=False, blank=False)
    type = models.ForeignKey('TypeLocation', on_delete=models.SET_NULL, related_name='addresses',
                             related_query_name='address',null=True)

    def __str__(self):
        return self.name


class Notification(models.Model):
    title = models.TextField(null=False)
    content = models.TextField(null=False)
    receiver = models.ForeignKey('User', on_delete=models.CASCADE, related_name='sent_notifications')
    sender = models.ForeignKey('User', on_delete=models.CASCADE, related_name='received_notifications')
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='notifications',
                             related_query_name='notification')
    is_read = models.BooleanField(default=False, null=False)

    def __str__(self):
        return self.content
