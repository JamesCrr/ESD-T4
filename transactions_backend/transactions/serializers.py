from rest_framework import serializers
from .models import Transactions
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model= Transactions
        fields=['transactionId','sellerId','buyerId','amount','listingId','dateTime']

      