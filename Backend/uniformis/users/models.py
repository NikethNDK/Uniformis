# from django.contrib.auth.models import AbstractUser
# from django.db import models
# from django.utils import timezone
# import random
# from datetime import datetime, timedelta

# class User(AbstractUser):
#     email = models.EmailField(unique=True)
#     phone = models.CharField(max_length=15, blank=True, null=True)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(default=timezone.now)
#     updated_at = models.DateTimeField(auto_now=True)
#     is_admin = models.BooleanField(default=False)
#     date_of_birth = models.DateTimeField(null=True, blank=True)

#     class Meta:
#         db_table = 'user'

#     groups = models.ManyToManyField(
#         'auth.Group', 
#         related_name='custom_user_groups', 
#         blank=True
#     )
#     user_permissions = models.ManyToManyField(
#         'auth.Permission', 
#         related_name='custom_user_permissions', 
#         blank=True
#     )

# class Address(models.Model):
#     ADDRESS_TYPES = [
#         ('HOME', 'Home'),
#         ('WORK', 'Work'),
#         ('OTHER', 'Other')
#     ]
    
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     city = models.CharField(max_length=255)
#     state = models.CharField(max_length=255)
#     pin_code = models.CharField(max_length=10)
#     address_type = models.CharField(max_length=50, choices=ADDRESS_TYPES)
#     land_mark = models.CharField(max_length=255, blank=True, null=True)
#     mobile_number = models.CharField(max_length=15)
#     alternate_number = models.CharField(max_length=15, blank=True, null=True)
#     created_at = models.DateTimeField(default=timezone.now)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         db_table = 'address'

# class OTPVerification(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     otp = models.CharField(max_length=6)
#     created_at = models.DateTimeField(auto_now_add=True)
#     expires_at = models.DateTimeField()
    
#     def save(self, *args, **kwargs):
#         if not self.otp:
#             self.otp = str(random.randint(100000, 999999))
#         if not self.expires_at:
#             self.expires_at = datetime.now() + timedelta(minutes=10)
#         super().save(*args, **kwargs)
    
#     @property
#     def is_expired(self):
#         return datetime.now() > self.expires_at