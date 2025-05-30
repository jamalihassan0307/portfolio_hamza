from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Authentication URLs (most specific)
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    
    # Project URLs
    path('projects/', views.projects, name='projects'),
    path('projects/add/', views.add_project, name='add_project'),
    path('projects/<int:project_id>/edit/', views.edit_project, name='edit_project'),
    path('projects/<int:project_id>/delete/', views.delete_project, name='delete_project'),
    
    # User profile URLs
    path('profile/', views.profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    
    # Search URL
    path('search/', views.search_users, name='search_users'),
    
    # Home URL
    path('', views.home, name='home'),
    
    # User profile URL (most generic)
    path('<str:username>/', views.user_profile, name='user_profile'),
    
    # Skill management URLs
    path('add-skill/', views.add_skill, name='add_skill'),
    path('delete-skill/<int:skill_id>/', views.delete_skill, name='delete_skill'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
