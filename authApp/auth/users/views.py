# from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from .models import User
import jwt, datetime
from django.conf import settings
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

from rest_framework import status 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from dotenv import load_dotenv
import os

load_dotenv()
SECRET_JWT = os.environ.get('SECRET_JWT')

# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)

#         # Add custom claims
#         token['username'] = user.name
#         # ...

#         return token


# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer

# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        
        payload = {
            'id': user.id,
            'user': user.name,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, SECRET_JWT, algorithm='HS256')

        response = Response()

        response.set_cookie(key='jwt', value=token,
                            httponly=True, samesite='Lax')
        response["Access-Control-Allow-Credentials"] = "true"
        response.data = {
            'jwt': token
        }

        return response
        # # response = super().post(request, *args, **kwargs)
        # # access_token = response.data["access"]
        # response.set_cookie(
        #     key=settings.SIMPLE_JWT["AUTH_COOKIE"],
        #     value=token,
        #     domain=settings.SIMPLE_JWT["AUTH_COOKIE_DOMAIN"],
        #     path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
        #     expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
        #     secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
        #     httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
        #     samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        # )
        # response.data = {
        #     'jwt': token
        # }

        # return response

    
# class UserView(APIView):
    

#     def get(self, request):
#         try:

#         except AuthenticationFailed as e:
#             print(f"Authentication Failed: {str(e)}")
#             return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

#         token = request.COOKIES.get("jwt")
#         print(request)

#         if not token:
#             raise AuthenticationFailed('Unauthenticated!')
        
#         try: 
#             payload = jwt.decode(token, 'secret', algorithms=['HS256'])
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('Unauthenticated2!')

#         user = User.objects.filter(id=payload['id']).first()
#         serializer = UserSerializer(user)

#         return Response(serializer.data)
    

class UserView(APIView):
    def get(self, request):
        try:
            token = request.COOKIES.get('jwt')
            print("Received Token: ", token)

            if not token:
                raise AuthenticationFailed('Unauthenticated! No token.')

            try:
                payload = jwt.decode(token, SECRET_JWT, algorithms=['HS256'])
            except jwt.ExpiredSignatureError:
                raise AuthenticationFailed('Unauthenticated! Token expired.')

            user = User.objects.filter(id=payload['id']).first()
            print("User: ", user)

            serializer = UserSerializer(user)
            return Response(serializer.data)

        except AuthenticationFailed as e:
            print(f"Authentication Failed: {str(e)}")
            return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        


    
class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        # Allow credentials in cross-origin requests
        response["Access-Control-Allow-Credentials"] = "true"
        response.data = {
            'message': 'Success logout'
        }

        return response
    
@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"isAuthenticated": True})

def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"username":request.user.username})