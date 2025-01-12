from django.apps import AppConfig
from django.db.models.signals import post_migrate


class TroHayHoAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tro_hay_ho_app'
    def ready(self):
        from .models import Role

        default_roles = ['Admin', 'chu_tro', 'nguoi_thue_tro']

        for role_name in default_roles:
            if not Role.objects.filter(role_name=role_name).exists():
                Role.objects.create(role_name=role_name)




    
