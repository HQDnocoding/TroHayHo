from django.contrib import admin
from django.utils.html import mark_safe
from .models import User,PostWant,PostForRent
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_filter = ['role']
    search_fields = ['username','phone']
    list_display = ['username','first_name','last_name','phone','is_active']

    readonly_fields = ['avatar']

    def avatar(self, obj):
        if obj:
            return mark_safe(
                '<img src="/static/{url}" width="120" />' \
                    .format(url=obj.image.name)
            )


admin.site.register(User,UserAdmin)
admin.site.register(PostForRent)
admin.site.register(PostWant)


