from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
#from django_jwt_micro.jwt_authentication import JwtAuthentication
from rest_framework.permissions import IsAuthenticated

class HelloView(APIView):

    #authentication_classes = (JwtAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({'username': request.user.username}, status=status.HTTP_200_OK)
