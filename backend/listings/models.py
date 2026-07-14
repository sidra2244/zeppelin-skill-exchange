from django.db import models
from django.conf import settings

# Create your models here.

class Listing(models.Model):
    TYPE_CHOICES = [
        ('offer', 'Offer'),
        ('request', 'Request')
    ]
    STATUS_CHOICES = {
        ('active', 'Active'),
        ('closed', 'Closed')
    }
    CATEGORY_CHOICES = [
        ('technology', 'Technology'),
        ('language', 'Language'),
        ('music', 'Music'),
        ('cooking', 'Cooking'),
        ('sports', 'Sports'),
        ('art', 'Art'),
        ('academic', 'Academic'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    city = models.CharField(max_length=100)
    radius_km = models.IntegerField(default=10)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.category}" 
    