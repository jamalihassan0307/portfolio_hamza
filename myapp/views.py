from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from .models import User, Project, Technology, Language
from .forms import UserRegistrationForm, ProjectForm, ProfileForm

def home(request):
    return HttpResponse('<h1>Welcome to your Django project!</h1>')
