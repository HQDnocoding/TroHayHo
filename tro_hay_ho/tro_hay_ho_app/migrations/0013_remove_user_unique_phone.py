# Generated by Django 5.1.2 on 2025-02-05 04:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tro_hay_ho_app', '0012_alter_user_email'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='user',
            name='unique_phone',
        ),
    ]
