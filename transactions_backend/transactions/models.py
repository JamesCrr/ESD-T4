from django.db import models

# Create your models here.
class Transactions(models.Model):
    transactionId = models.IntegerField(primary_key=True)
    sellerId = models.IntegerField()
    buyerId = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    listingId = models.IntegerField()
    dateTime = models.DateTimeField(auto_now=True)

    class Meta:
        # specify the custom table name
        db_table = 'transactions'