# Generated by Django 5.1.2 on 2025-02-04 05:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tro_hay_ho_app', '0010_alter_chutro_options_alter_chutro_table'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='coordinates',
            field=models.TextField(null=True),
        ),
    ]
