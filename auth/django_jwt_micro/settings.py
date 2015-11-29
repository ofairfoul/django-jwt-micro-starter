from django.conf import settings

SECRET_KEY = getattr(settings, 'JWT_SECRET_KEY', None) or getattr(settings, 'SECRET_KEY')
