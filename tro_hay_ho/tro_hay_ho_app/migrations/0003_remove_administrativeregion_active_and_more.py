# Generated by Django 5.1.2 on 2025-01-13 03:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tro_hay_ho_app', '0002_address_active_administrativeregion_active_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='administrativeregion',
            name='active',
        ),
        migrations.RemoveField(
            model_name='administrativeregion',
            name='created_date',
        ),
        migrations.RemoveField(
            model_name='administrativeregion',
            name='updated_date',
        ),
        migrations.RemoveField(
            model_name='administrativeunit',
            name='active',
        ),
        migrations.RemoveField(
            model_name='administrativeunit',
            name='created_date',
        ),
        migrations.RemoveField(
            model_name='administrativeunit',
            name='updated_date',
        ),
        migrations.RemoveField(
            model_name='district',
            name='active',
        ),
        migrations.RemoveField(
            model_name='district',
            name='created_date',
        ),
        migrations.RemoveField(
            model_name='district',
            name='updated_date',
        ),
        migrations.RemoveField(
            model_name='province',
            name='active',
        ),
        migrations.RemoveField(
            model_name='province',
            name='created_date',
        ),
        migrations.RemoveField(
            model_name='province',
            name='updated_date',
        ),
        migrations.RemoveField(
            model_name='ward',
            name='active',
        ),
        migrations.RemoveField(
            model_name='ward',
            name='created_date',
        ),
        migrations.RemoveField(
            model_name='ward',
            name='updated_date',
        ),
    ]
