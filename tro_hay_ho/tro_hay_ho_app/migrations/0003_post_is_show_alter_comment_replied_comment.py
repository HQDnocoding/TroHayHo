# Generated by Django 5.1.2 on 2025-01-28 04:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tro_hay_ho_app', '0002_remove_notification_is_read_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='is_show',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='replied_comment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='comments', related_query_name='comment', to='tro_hay_ho_app.comment'),
        ),
    ]
