from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Project, Language

class UserRegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'role')
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['role'].widget = forms.HiddenInput()
        self.fields['role'].initial = 'portfolio_user'

class ProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('title', 'image', 'qualifications', 'bio', 'phone')
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 4}),
        }

class SkillForm(forms.ModelForm):
    class Meta:
        model = Language
        fields = ('name', 'level')
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                'placeholder': 'Skill Name'
            }),
            'level': forms.NumberInput(attrs={
                'class': 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                'min': 0,
                'max': 100,
                'placeholder': 'Skill Level (0-100)'
            }),
        }

class LanguageForm(forms.ModelForm):
    class Meta:
        model = Language
        fields = ('name', 'level')
        widgets = {
            'level': forms.NumberInput(attrs={'min': 0, 'max': 100}),
        }

LanguageFormSet = forms.inlineformset_factory(
    User, Language,
    form=LanguageForm,
    extra=1,
    can_delete=True
)

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ('name', 'image', 'description', 'technologies')
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                'placeholder': 'Project Name'
            }),
            'description': forms.Textarea(attrs={
                'class': 'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                'rows': 4,
                'placeholder': 'Project Description'
            }),
            'technologies': forms.CheckboxSelectMultiple(attrs={
                'class': 'mt-2 space-y-2'
            }),
        }