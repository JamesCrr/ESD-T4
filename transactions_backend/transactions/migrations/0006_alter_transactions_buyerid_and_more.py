# Generated by Django 5.0.2 on 2024-03-10 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0005_transactions_datetime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transactions',
            name='buyerId',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='listingId',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='sellerId',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='transactionId',
            field=models.CharField(max_length=255, primary_key=True, serialize=False),
        ),
    ]
