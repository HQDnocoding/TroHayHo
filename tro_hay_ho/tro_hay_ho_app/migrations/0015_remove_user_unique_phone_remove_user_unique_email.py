# Generated by Django 5.1.2 on 2025-02-05 05:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tro_hay_ho_app', '0014_user_unique_phone_user_unique_email'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='user',
            name='unique_phone',
        ),

    ]
