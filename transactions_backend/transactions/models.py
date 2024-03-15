from django.db import models

# Create your models here.
class Transactions(models.Model):
    transactionId =models.CharField(max_length=255, primary_key=True)
    sellerId = models.CharField(max_length=255)
    buyerId = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    listingId = models.CharField(max_length=255)
    dateTime = models.DateTimeField(auto_now=True)

    class Meta:
        # specify the custom table name
        db_table = 'transactions'