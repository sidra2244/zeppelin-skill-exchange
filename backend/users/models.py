from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='user_photos/', blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    latitue = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
    

    
