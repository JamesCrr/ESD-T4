# from django.shortcuts import render
# Create your views here.
# from django.http import HttpResponse
from .models import Transactions
from .serializers import TransactionSerializer
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class YourAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Description of your API endpoint",
        responses={200: openapi.Response("Response Description")},
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "key": openapi.Schema(type=openapi.TYPE_STRING),
            }
        ),
    )
    def post(self, request):
        # Your view logic here
        return Response("Response data")

class TransactionsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    
    queryset = Transactions.objects.all()
    serializer_class = TransactionSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        print('i respect it')
        return Response(serializer.data)
    

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print('damn its created')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

