from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=200)
    overview = models.TextField(blank=True)
    release_date = models.DateField(null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    poster_url = models.URLField(blank=True)

    def __str__(self):
        return self.title
