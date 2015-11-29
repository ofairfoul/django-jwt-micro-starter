import jwt
from datetime import (datetime, timedelta)
from .settings import settings


def jwt_encoder(user):

    payload = {
        'sub': user.username,
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(days=7),
        'permissions': list(user.get_all_permissions()),
        'iat': datetime.utcnow()
    }

    return jwt.encode(payload, settings.SECRET_KEY, 'HS256').decode('utf-8');
