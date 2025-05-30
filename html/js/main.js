// Global state
let personalInfo = null;
let projectCount = 0;

// Fetch user data
async function fetchUserData() {
    try {
        if (currentUser) {
            personalInfo = currentUser;
            renderHome();
            return;
        }

        const response = await fetch('https://6788c4622c874e66b7d635aa.mockapi.io/user/1');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        personalInfo = await response.json();
        renderHome();
    } catch (error) {
        console.error('Error fetching user data:', error);
        showToast('Failed to load profile data', 'error');
    }
}

// Fetch project count
async function fetchProjectCount() {
    try {
        const response = await fetch('https://6788c4622c874e66b7d635aa.mockapi.io/Projects');
        const data = await response.json();
        projectCount = data.length;
        updateProjectCount();
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Update project count in the UI
function updateProjectCount() {
    const projectCountElement = document.getElementById('project-count');
    if (projectCountElement) {
        projectCountElement.textContent = `${projectCount}+`;
    }
}

// Render home page content
function renderHome() {
    if (!personalInfo) return;

    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container mx-auto px-4 py-16">
            <div class="flex flex-col md:flex-row items-center gap-12">
                <div class="w-64 h-64 md:w-80 md:h-80 relative">
                    <div class="absolute inset-0 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
                    <div class="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img src="${personalInfo.image}"
                             alt="${personalInfo.name}"
                             class="w-full h-full object-cover">
                        ${currentUser ? `
                            <button onclick="showEditProfileModal()"
                                    class="absolute bottom-4 right-4 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700">
                                <i class="fas fa-edit text-xl"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div class="text-center md:text-left max-w-xl">
                    <h2 class="text-gray-600 text-xl mb-2">${personalInfo.title}</h2>
                    <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                        ${personalInfo.name}
                    </h1>
                    <p class="text-gray-600 text-lg mb-6 leading-relaxed">
                        ${personalInfo.bio}
                    </p>

                    <div class="flex flex-col md:flex-row gap-4 justify-center md:justify-start mb-8">
                        <div class="flex items-center gap-2 text-gray-600">
                            <i class="fas fa-envelope"></i>
                            <span>${personalInfo.email}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-600">
                            <i class="fas fa-phone"></i>
                            <span>${personalInfo.phone}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 py-16">
            <h2 class="text-3xl font-bold text-center mb-12">Technical Expertise</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                ${personalInfo.languages.map(skill => `
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="flex justify-between mb-2">
                            <span class="font-semibold text-gray-700">${skill.name}</span>
                            <span class="text-blue-600">${skill.level}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                                 style="width: ${skill.level}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="container mx-auto px-4 py-16">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <h3 id="project-count" class="text-4xl font-bold text-blue-600 mb-2">
                            ${projectCount}+
                        </h3>
                        <p class="text-gray-600">Projects Completed</p>
                    </div>
                    <div class="text-center">
                        <h3 class="text-4xl font-bold text-blue-600 mb-2">5+</h3>
                        <p class="text-gray-600">Years Experience</p>
                    </div>
                    <div class="text-center">
                        <h3 class="text-4xl font-bold text-blue-600 mb-2">100%</h3>
                        <p class="text-gray-600">Client Satisfaction</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show edit profile modal
function showEditProfileModal() {
    if (!currentUser) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.id = 'edit-profile-modal';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4">Edit Profile</h2>
            <form id="edit-profile-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="edit-name" value="${currentUser.name}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" id="edit-title" value="${currentUser.title}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea id="edit-bio"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              rows="3">${currentUser.bio}</textarea>
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="closeEditProfileModal()"
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Add form submit handler
    document.getElementById('edit-profile-form').addEventListener('submit', handleProfileUpdate);
}

// Close edit profile modal
function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.remove();
    }
}

// Handle profile update
async function handleProfileUpdate(event) {
    event.preventDefault();

    const updatedData = {
        ...currentUser,
        name: document.getElementById('edit-name').value,
        title: document.getElementById('edit-title').value,
        bio: document.getElementById('edit-bio').value,
    };

    try {
        const response = await fetch(`https://6788c4622c874e66b7d635aa.mockapi.io/user/${currentUser.id}`, {
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
            personalInfo = result;
            renderHome();
            closeEditProfileModal();
            showToast('Profile updated successfully!', 'success');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Failed to update profile', 'error');
    }
}

// Initialize page
async function initializePage() {
    await fetchUserData();
    await fetchProjectCount();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 