// Global state
let userData = null;

// Initialize edit profile page
function initializeEditProfile() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    userData = currentUser;
    populateForm();
    renderSkills();
}

// Populate form with user data
function populateForm() {
    document.getElementById('edit-name').value = userData.name;
    document.getElementById('edit-title').value = userData.title;
    document.getElementById('edit-email').value = userData.email;
    document.getElementById('edit-phone').value = userData.phone;
    document.getElementById('edit-image').value = userData.image;
    document.getElementById('edit-bio').value = userData.bio;
}

// Render skills section
function renderSkills() {
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = userData.languages.map((skill, index) => `
        <div class="flex items-center gap-4">
            <div class="flex-1">
                <input type="text"
                       value="${skill.name}"
                       onchange="updateSkill(${index}, 'name', this.value)"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                       placeholder="Skill name"
                       required>
            </div>
            <div class="flex-1">
                <input type="number"
                       min="0"
                       max="100"
                       value="${skill.level}"
                       onchange="updateSkill(${index}, 'level', this.value)"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                       required>
            </div>
            <button type="button"
                    onclick="removeSkill(${index})"
                    class="p-2 text-red-600 hover:text-red-800">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Add new skill
function addSkill() {
    userData.languages.push({ name: '', level: 50 });
    renderSkills();
}

// Update skill
function updateSkill(index, field, value) {
    userData.languages[index][field] = field === 'level' ? parseInt(value) : value;
}

// Remove skill
function removeSkill(index) {
    userData.languages.splice(index, 1);
    renderSkills();
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();

    const updatedData = {
        ...userData,
        name: document.getElementById('edit-name').value,
        title: document.getElementById('edit-title').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        image: document.getElementById('edit-image').value,
        bio: document.getElementById('edit-bio').value,
    };

    try {
        const response = await fetch(`https://6788c4622c874e66b7d635aa.mockapi.io/user/${userData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('currentUser', JSON.stringify(result));
            currentUser = result;
            showToast('Profile updated successfully!', 'success');
            window.location.href = 'profile.html';
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Failed to update profile', 'error');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeEditProfile();
    document.getElementById('edit-profile-form').addEventListener('submit', handleSubmit);
}); 