from django.contrib.admin import AdminSite
from django.urls import path
from django.shortcuts import render
from django.contrib import admin
from django.utils.html import mark_safe
from django.apps import apps
from django.contrib.admin.sites import AlreadyRegistered
from django.contrib.auth.models import Group
from django.contrib.auth.admin import GroupAdmin
from oauth2_provider.models import AccessToken, Application, Grant, IDToken, RefreshToken
from django.db.models.functions import TruncMonth, TruncYear, TruncQuarter,ExtractQuarter
from django.db.models import Count
from django.db.models import Q
import json
from datetime import datetime, timedelta
import json
from django.http import JsonResponse
from oauth2_provider.admin import AccessTokenAdmin, ApplicationAdmin, GrantAdmin, IDTokenAdmin, RefreshTokenAdmin

from .models import (User, PostWant, PostForRent, District, Province, Ward, Role, Address,
                     PostImage, Notification, Conversation, Message, DetailNotification,
                     Comment, Following, FavoritePost)

class MyAdminSite(AdminSite):
    site_header = "Quản lý hệ thống"
    site_title = "Trang Admin"
    index_title = "Chào mừng bạn đến với Admin"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('statspanel/', self.admin_view(self.stats_view), name='stats_panel'),
from .models import User,PostWant,PostForRent,District,Province,Ward,Role,Address,PostImage,Notification\
    ,Conversation,Message,DetailNotification,Comment,Following,FavoritePost,ChuTro, TroImage
# Register your models here.

        ]
        return custom_urls + urls
    def stats_view(self, request):
        # thoi gian tu request
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        type=request.GET.get('type')

        users_query = User.objects.all()

        if type.__eq__("all") or not type:
            pass
        elif type.__eq__("thuetro"):
            users_query = users_query.filter(groups__name="Người thuê trọ")
        elif type.__eq__("chutro"):
            users_query = users_query.filter(groups__name="Chủ trọ")

        if start_date and end_date:
            users_query = users_query.filter(
                date_joined__range=[start_date, end_date]
            )

        monthly_stats = (
            users_query.annotate(month=TruncMonth('date_joined'))
            .values('month')
            .annotate(total=Count('id'),
                     active=Count('id', filter=Q(is_active=True)))
            .order_by('month')
        )

        quarterly_stats = (
            users_query.annotate(
                year=TruncYear('date_joined'),
                quarter=ExtractQuarter('date_joined')
            )
            .values('year', 'quarter')
            .annotate(total=Count('id'),
                     active=Count('id', filter=Q(is_active=True)))
            .order_by('year', 'quarter')
        )

        yearly_stats = (
            users_query.annotate(year=TruncYear('date_joined'))
            .values('year')
            .annotate(total=Count('id'),
                     active=Count('id', filter=Q(is_active=True)))
            .order_by('year')
        )

        context = {
            'type':type,
            'title': 'Thống kê người dùng',
            'total_users': users_query.count(),
            'active_users': users_query.filter(is_active=True).count(),
            'monthly_stats': json.dumps([{
                'month': item['month'].strftime('%Y-%m'),
                'total': item['total'],
                'active': item['active']
            } for item in monthly_stats]),
            'quarterly_stats': json.dumps([{
                'quarter': f"Quý {item['quarter']} {item['year'].year}",
                'total': item['total'],
                'active': item['active']
            } for item in quarterly_stats]),
            'yearly_stats': json.dumps([{
                'year': item['year'].year,
                'total': item['total'],
                'active': item['active']
            } for item in yearly_stats])
        }

        return render(request, "admin/statistics.html", context)


# Khởi tạo AdminSite tùy chỉnh
custom_admin_site = MyAdminSite(name='custom_admin')

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

    change_list_template = "admin/change_list_with_button.html"

class TroImageInline(admin.TabularInline):
    model = TroImage
    extra = 1  # Số dòng trống để nhập ảnh mới
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context["statistics_url"] = "/admin/statspanel/"
        return super().changelist_view(request, extra_context=extra_context)

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
# Đăng ký model với custom admin
custom_admin_site.register(User, UserAdmin)
custom_admin_site.register(PostForRent)
custom_admin_site.register(PostWant)
custom_admin_site.register(Address)
custom_admin_site.register(PostImage)
custom_admin_site.register(Notification)
custom_admin_site.register(DetailNotification)
custom_admin_site.register(Comment)
custom_admin_site.register(Following)
custom_admin_site.register(FavoritePost)


# Đăng ký Authentication and Authorization
custom_admin_site.register(Group, GroupAdmin)

# Đăng ký Django OAuth Toolkit
custom_admin_site.register(AccessToken, AccessTokenAdmin)
custom_admin_site.register(Application, ApplicationAdmin)
custom_admin_site.register(Grant, GrantAdmin)
custom_admin_site.register(IDToken, IDTokenAdmin)
custom_admin_site.register(RefreshToken, RefreshTokenAdmin)

# custom_admin_site.register(Conversation)
# custom_admin_site.register(Message)
# custom_admin_site.register(Role)
# custom_admin_site.register(Province)
# custom_admin_site.register(District)
# custom_admin_site.register(Ward)