from django.db import models
from listings.models import Listing

# Create your models here.

class Match(models.Model):
    listing1 = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='matches_as_listing1')
    listing2 = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='matches_as_listing2')
    matched_at = models.DateTimeField(auto_now_add=True)    

    def __str__(self):
        return f"Match between {self.listing1.user.username} and {self.listing2.user.username}"