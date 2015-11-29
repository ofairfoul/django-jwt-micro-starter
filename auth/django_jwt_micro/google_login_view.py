from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.serializers import SocialLoginSerializer
from .login_view import LoginView

class GoogleLoginView(LoginView):
    adapter_class = GoogleOAuth2Adapter
    serializer_class = SocialLoginSerializer
