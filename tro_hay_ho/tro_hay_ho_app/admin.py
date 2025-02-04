from django.contrib import admin
from django.utils.html import mark_safe
from .models import User,PostWant,PostForRent,District,Province,Ward,Role,Address,PostImage,Notification\
    ,Conversation,Message,DetailNotification,Comment,Following,FavoritePost,ChuTro, TroImage
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    search_fields = ['username','phone']
    list_display = ['username','first_name','last_name','phone','is_active']

    readonly_fields = ['avatar']

    def avatar(self, obj):
        if obj:
            return mark_safe(
                '<img src="/static/{url}" width="120" />' \
                    .format(url=obj.image.name)
            )

class TroImageInline(admin.TabularInline):  
    model = TroImage
    extra = 1  # Số dòng trống để nhập ảnh mới

class ChuTroAdmin(admin.ModelAdmin):
    inlines = [TroImageInline] 
    verbose_name = "Chủ trọ"
    verbose_name_plural = "Danh sách Chủ trọ"
    list_display = ['id', 'username', 'phone']
    
    list_display = ['id', 'username', 'phone', 'is_active', 'date_joined']
    list_filter = ['is_active'] 
    ordering = ['-date_joined']  
    
    def avatar_display(self, obj):
        if obj.avatar:
            return mark_safe('<img src="{}" width="50" height="50" />'.format(obj.avatar.url))
        return "No avatar"
    avatar_display.short_description = 'Avatar'
    
admin.site.register(User,UserAdmin)
admin.site.register(ChuTro,ChuTroAdmin)
admin.site.register(PostForRent)
admin.site.register(PostWant)
admin.site.register(Role)
admin.site.register(Province)
admin.site.register(District)
admin.site.register(Ward)
admin.site.register(Address)
admin.site.register(PostImage)
admin.site.register(Notification)
admin.site.register(Conversation)
admin.site.register(Message)
admin.site.register(DetailNotification)
admin.site.register(Comment)
admin.site.register(Following)
admin.site.register(FavoritePost)



