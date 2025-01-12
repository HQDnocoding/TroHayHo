# Generated by Django 5.1.2 on 2025-01-12 04:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tro_hay_ho_app', '0005_alter_district_province_alter_ward_district'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='postforrent',
            options={},
        ),
        migrations.AlterModelOptions(
            name='postwant',
            options={},
        ),
        migrations.AlterModelOptions(
            name='user',
            options={},
        ),
        migrations.AlterField(
            model_name='postforrent',
            name='post_ptr',
            field=models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tro_hay_ho_app.post'),
        ),
        migrations.AlterField(
            model_name='postwant',
            name='post_ptr',
            field=models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='tro_hay_ho_app.post'),
        ),
        migrations.AlterModelTable(
            name='address',
            table='address',
        ),
        migrations.AlterModelTable(
            name='comment',
            table='comment',
        ),
        migrations.AlterModelTable(
            name='conversation',
            table='conversation',
        ),
        migrations.AlterModelTable(
            name='following',
            table='fllowing',
        ),
        migrations.AlterModelTable(
            name='location',
            table='location',
        ),
        migrations.AlterModelTable(
            name='message',
            table='message',
        ),
        migrations.AlterModelTable(
            name='notification',
            table='notification',
        ),
        migrations.AlterModelTable(
            name='postforrent',
            table='post_for_rent',
        ),
        migrations.AlterModelTable(
            name='postimage',
            table='post_image',
        ),
        migrations.AlterModelTable(
            name='postwant',
            table='post_want',
        ),
        migrations.AlterModelTable(
            name='role',
            table='role',
        ),
        migrations.AlterModelTable(
            name='typelocation',
            table='type_loacation',
        ),
        migrations.AlterModelTable(
            name='user',
            table='user',
        ),
    ]
