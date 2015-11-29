import jwt
from rest_framework.authentication import BaseAuthentication;
from rest_framework.exceptions import AuthenticationFailed;
from .settings import settings

class JwtAuthentication(BaseAuthentication):

    def authenticate(self, request):
        header = request.META.get('HTTP_AUTHORIZATION', None)
        if not header:
            return None

        header = header.split()
        if header[0].lower() != 'bearer' or len(header) < 2:
            return None

        token = header[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'], options={ 'verify-exp': True })

            class User(object):

                def is_authenticated(self):
                    return True

            user = User()
            user.username = payload['sub']
            user.permissions = payload['permissions'] or []

            return (user, None)

        except:
            raise AuthenticationFailed('Invalid token')
