from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    ROLE_CHOICES = (
        ('super_admin', 'Super Admin'),
        ('portfolio_user', 'Portfolio User'),
        ('user', 'User'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    title = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    qualifications = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    total_projects = models.IntegerField(default=0)
    phone = models.CharField(max_length=20, blank=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(_('email address'), unique=True)

    def __str__(self):
        return self.username

class Language(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='languages')
    name = models.CharField(max_length=100)
    level = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.name}"

class Technology(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='project_images/')
    description = models.TextField()
    technologies = models.ManyToManyField(Technology, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name 