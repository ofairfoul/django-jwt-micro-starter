import jwt
import settings
from django.contrib import auth

class JwtAuthMiddleware(object):

    header = "HTTP_AUTHENTICATION"
    secret_key = settings.SECRET_KEY;

    def forbidden():
        response = Http

    def

    def process_request(self, request):

        token = request.META.get(header, None)
        parts = auth.split()

        if not auth:
            auth.logout()
            return

        try:
            payload = jwt.decode()
