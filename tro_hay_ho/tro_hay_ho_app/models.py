from contextlib import nullcontext

from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['-id']


class Role(BaseModel):
    """Vai trò"""
    role_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'role'

    def __str__(self):
        return self.role_name


class User(AbstractUser):
    """Người dùng"""
    phone = models.CharField(max_length=15, blank=True, null=True)
    avatar = CloudinaryField('avatar', null=True)

    role = models.ForeignKey('Role', on_delete=models.SET_NULL, related_name='users', related_query_name='user',
                             null=True)
    following = models.ManyToManyField('User', symmetrical=False, related_name='followers', through='Following')
    conversation = models.ManyToManyField('self', symmetrical=True, through='Conversation')
    notification = models.ManyToManyField('User', symmetrical=False, related_name='notifications',
                                          through='Notification')

    class Meta:
        db_table = 'user'

    def _str_(self):
        return self.username


class Following(BaseModel):
    """Thông tin follwing"""
    follower = models.ForeignKey('User', on_delete=models.CASCADE, related_name='following_relations')
    followed = models.ForeignKey('User', on_delete=models.CASCADE, related_name='follower_relations')
    followed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'following'

    def __str__(self):
        return self.followed_at


class Conversation(BaseModel):
    """Cuộc trao đổi"""
    user1 = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, related_name='conversation_user1')
    user2 = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, related_name='conversation_user2')
    date_start = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'conversation'

    def __str__(self):
        return f"tro chuyen giua {self.user1} va {self.user2} trong {self.date_start}"


class Message(BaseModel):
    content = models.TextField(null=False)
    date_sending = models.DateTimeField(auto_now_add=True)

    conversation = models.ForeignKey('Conversation', on_delete=models.CASCADE, related_name='messages',
                                     related_query_name='message')
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='messages', related_query_name='message')

    class Meta:
        db_table = 'message'

    def __str__(self):
        return self.content


class Post(BaseModel):
    title = models.TextField(null=False)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField(null=True, blank=True, default=0)

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='posts', related_query_name='post')
    address = models.ForeignKey('Address', on_delete=models.SET_NULL, related_name='posts', related_query_name='post',
                                null=models.SET_NULL)

    def __str__(self):
        return self.title
    
    
class FavoritePost(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_posts')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='saved_by_users')

    class Meta:
        db_table = 'favourite_post'

    def __str__(self):
        return f"{self.user.username} saved {self.post.title} at {self.saved_at}"


class PostWant(Post):
    price_range_min = models.FloatField(null=True, blank=True, default=0)
    price_range_max = models.FloatField(null=True, blank=True, default=0)

    class Meta:
        db_table = 'post_want'


class PostForRent(Post):
    acreage = models.FloatField(null=True, blank=True, default=0)
    max_number_of_people = models.IntegerField(null=True, blank=True, default=0)
    phone_contact = models.CharField(max_length=15, null=False)
    name_agent = models.CharField(max_length=100, null=False)
    verified = models.BooleanField(default=True, null=False)

    class Meta:
        db_table = 'post_for_rent'


class PostImage(BaseModel):
    image = CloudinaryField('image', null=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='images', related_query_name='image')

    class Meta:
        db_table = 'post_image'

    @property
    def get_url(self):
        if self.image:
            return self.image.url
        return None


class Comment(BaseModel):
    content = models.TextField(null=False)
    date_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='comments', related_query_name='comment')
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='comments', related_query_name='comment')
    replied_comment = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='comments',
                                        related_query_name='comment', null=True)

    def __str__(self):
        return self.content

    class Meta:
        db_table = 'comment'


class Address(BaseModel):
    specified_address = models.TextField(null=False, blank=False)
    coordinates = models.TextField(null=False, blank=False)
    province = models.ForeignKey('Province', on_delete=models.SET_NULL, null=True, related_name='provinces')
    district = models.ForeignKey('District', on_delete=models.SET_NULL, null=True, related_name='districts')
    ward = models.ForeignKey('Ward', on_delete=models.SET_NULL, null=True, related_name='wards')

    def __str__(self):
        return self.specified_address

    class Meta:
        db_table = 'address'


class TypeLocation(BaseModel):
    type = models.CharField(max_length=20, null=False)

    def __str__(self):
        return self.type

    class Meta:
        db_table = 'type_loacation'


class Location(BaseModel):
    name = models.TextField(max_length=100, null=False, blank=False)
    type = models.ForeignKey('TypeLocation', on_delete=models.SET_NULL, related_name='addresses',
                             related_query_name='address', null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'location'


class Notification(BaseModel):
    title = models.TextField(null=False)
    content = models.TextField(null=False)
    receiver = models.ForeignKey('User', on_delete=models.CASCADE, related_name='sent_notifications')
    sender = models.ForeignKey('User', on_delete=models.CASCADE, related_name='received_notifications')
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='notifications',
                             related_query_name='notification')
    is_read = models.BooleanField(default=False, null=False)

    def __str__(self):
        return self.content

    class Meta:
        db_table = 'notification'


class AdministrativeRegion(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    code_name_en = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "administrative_regions"

    def __str__(self):
        return self.name


class AdministrativeUnit(models.Model):
    id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    full_name_en = models.CharField(max_length=255, null=True, blank=True)
    short_name = models.CharField(max_length=255, null=True, blank=True)
    short_name_en = models.CharField(max_length=255, null=True, blank=True)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    code_name_en = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "administrative_units"

    def __str__(self):
        return self.full_name or "Unnamed Administrative Unit"


class Province(models.Model):
    code = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    full_name_en = models.CharField(max_length=255)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    administrative_unit = models.ForeignKey(AdministrativeUnit, null=True, blank=True, on_delete=models.SET_NULL,
                                            related_name="provinces")
    administrative_region = models.ForeignKey(AdministrativeRegion, null=True, blank=True, on_delete=models.SET_NULL,
                                              related_name="provinces")

    class Meta:
        db_table = "provinces"

    def __str__(self):
        return self.name


class District(models.Model):
    code = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255, null=True, blank=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    full_name_en = models.CharField(max_length=255, null=True, blank=True)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    province = models.ForeignKey(Province, null=True, blank=True, on_delete=models.SET_NULL, related_name="districts",
                                 db_column='province_code')
    administrative_unit = models.ForeignKey(AdministrativeUnit, null=True, blank=True, on_delete=models.SET_NULL,
                                            related_name="districts")

    class Meta:
        db_table = "districts"

    def __str__(self):
        return self.name


class Ward(models.Model):
    code = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255, null=True, blank=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    full_name_en = models.CharField(max_length=255, null=True, blank=True)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    district = models.ForeignKey(District, null=True, blank=True, on_delete=models.SET_NULL, related_name="wards",
                                 db_column='district_code')
    administrative_unit = models.ForeignKey(AdministrativeUnit, null=True, blank=True, on_delete=models.SET_NULL,
                                            related_name="wards")

    class Meta:
        db_table = "wards"

    def __str__(self):
        return self.name