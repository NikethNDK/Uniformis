from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import UserProfile

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import UserProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.middleware.csrf import get_token
from django.http import JsonResponse
from .utils import generate_otp, send_otp_email
from .models import OTP
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

# class SignupView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)

#         if serializer.is_valid():
#             user = serializer.save()
#             UserProfile.objects.create(user=user)
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'user': UserSerializer(user).data,
#                 'token': str(refresh.access_token),  # Access token
#                 'refresh_token': str(refresh)         # Refresh token
#             }, status=status.HTTP_201_CREATED)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False  # User starts inactive
            user.save()
            
            UserProfile.objects.create(user=user)
            
            # Generate and send OTP
            otp_code = generate_otp()
            expires_at = timezone.now() + timedelta(minutes=2)
            OTP.objects.create(
                user=user,
                otp_code=otp_code,
                expires_at=expires_at
            )
            
            send_otp_email(user, otp_code)
            
            return Response({
                'user_id': user.id,
                'message': 'Please verify your email with the OTP sent.'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        otp_code = request.data.get('otp_code')

        try:
            user = User.objects.get(id=user_id)
            otp = OTP.objects.filter(
                user=user,
                is_verified=False
            ).latest('created_at')

            if otp.is_expired():
                return Response({
                    'error': 'OTP has expired'
                }, status=status.HTTP_400_BAD_REQUEST)

            if otp.otp_code != otp_code:
                return Response({
                    'error': 'Invalid OTP'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Verify user
            user.is_active = True
            user.is_email_verified = True
            user.save()

            otp.is_verified = True
            otp.save()

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token),
                'refresh_token': str(refresh)
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except OTP.DoesNotExist:
            return Response({
                'error': 'No OTP found'
            }, status=status.HTTP_404_NOT_FOUND)

class ResendOTPView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(id=user_id)
            
            # Generate new OTP
            otp_code = generate_otp()
            expires_at = timezone.now() + timedelta(minutes=2)
            OTP.objects.create(
                user=user,
                otp_code=otp_code,
                expires_at=expires_at
            )
            
            send_otp_email(user, otp_code)
            
            return Response({
                'message': 'New OTP sent successfully'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        

class LoginView(APIView):
    def post(self, request):
        
        email = request.data.get('email')
        password = request.data.get('password')

        print("email",email)
        print("Request Data:", request.data)

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.is_active:
            return Response({'error': 'Your account has been blocked.'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
                'email': user.email,
            },
            'token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }, status=status.HTTP_200_OK)

        
#admin
class AdminTokenObtainView(TokenObtainPairView):
    def post(self, request):
        user = authenticate(email=request.data.get('email'), password=request.data.get('password'))
        if user and user.is_superadmin:
            response =  super().post(request)
            response.data['user'] = {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
            response.data['admin_token'] = response.data['access']
            return response
        return Response({"detail": "Only superusers are allowed."}, status=status.HTTP_403_FORBIDDEN)

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        active_users = User.objects.filter(is_superadmin=False)
        
        active_serializer = UserSerializer(active_users, many=True)
        
        return Response({
            "message": "Welcome to the admin dashboard",
            "active_users": active_serializer.data,
        })
    
    def post(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()
            return Response({
                'status': 'success', 
                'user_id': user.id, 
                'is_active': user.is_active
            })
        except User.DoesNotExist:
            return Response({
                'status': 'error', 
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        profile = UserProfile.objects.get(user=request.user)
        return Response({
            'username': request.user.username,
            'profile_picture': request.build_absolute_uri(profile.profile_picture.url) if profile.profile_picture else None,
        })
    
    def put(self, request):
        profile = UserProfile.objects.get(user=request.user)
        if 'username' in request.data:
            request.user.username = request.data['username']
            request.user.save()
        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
            profile.save()
        return Response({'message': 'profile updated successfully'})
    
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({'status': 'success'})
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        UserProfile.objects.create(user=user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def admin_update_user(request, user_id):  
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            print("Request data:", request.data)
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK) 
        
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})