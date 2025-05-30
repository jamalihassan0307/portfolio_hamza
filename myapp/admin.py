from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Language, Technology, Project

class LanguageInline(admin.TabularInline):
    model = Language
    extra = 1

class ProjectInline(admin.TabularInline):
    model = Project
    extra = 1

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'title', 'total_projects', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'title')
    ordering = ('username',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'title', 'image', 'qualifications', 'bio', 'phone')}),
        ('Role', {'fields': ('role',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )
    
    inlines = [LanguageInline, ProjectInline]

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'level')
    list_filter = ('user',)
    search_fields = ('name', 'user__username')
    ordering = ('user', 'name')

@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at', 'updated_at')
    list_filter = ('user', 'technologies')
    search_fields = ('name', 'description', 'user__username')
    filter_horizontal = ('technologies',)
    ordering = ('-created_at',)
