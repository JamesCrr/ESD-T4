# Generated by Django 5.0.2 on 2024-02-25 14:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0002_rename_transaction_transactions'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='transactions',
            table='transactions',
        ),
    ]
