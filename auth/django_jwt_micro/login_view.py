from rest_framework import status
#from rest_framework.views import APIViev
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .jwt_encoder import jwt_encoder
from rest_auth.serializers import LoginSerializer
#from .jwt_token_serializer import JwtTokenSerializer

class LoginView(GenericAPIView):

    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    #token_model = Token
    #response_serializer = JwtTokenSerializer

    def login(self):
        self.user = self.serializer.validated_data['user']
        self.token = jwt_encoder(user=self.user)
#        if getattr(settings, 'REST_SESSION_LOGIN',
#            login(self.request, self.user)

    def get_response(self):
        return Response({ 'id_token': self.token, 'token_type': 'Bearer' }, status=status.HTTP_200_OK)

    def get_error_response(self):
        return Response(
            self.serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

    def post(self, request, *args, **kwargs):
        self.serializer = self.get_serializer(data=self.request.data)
        if not self.serializer.is_valid():
            return self.get_error_response()
        self.login()
        return self.get_response()
