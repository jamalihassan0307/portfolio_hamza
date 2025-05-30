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
            'description': forms.Textarea(attrs={'rows': 4}),
            'technologies': forms.CheckboxSelectMultiple(),
        } 