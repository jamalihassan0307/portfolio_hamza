// Global state
let userData = null;

// Initialize profile page
function initializeProfile() {
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    userData = currentUser;
    renderProfile();
}

// Render profile content
function renderProfile() {
    if (!userData) return;

    const profileContent = document.getElementById('profile-content');
    profileContent.innerHTML = `
        <div class="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
            <a href="edit-profile.html"
               class="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
                <i class="fas fa-edit text-blue-600 text-xl"></i>
            </a>
        </div>

        <div class="relative px-6 py-10">
            <div class="absolute -top-20 left-1/2 transform -translate-x-1/2">
                <div class="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <img src="${userData.image || 'https://via.placeholder.com/128'}"
                         alt="${userData.name}"
                         class="w-full h-full object-cover">
                </div>
            </div>

            <div class="mt-16 text-center">
                <h2 class="text-3xl font-bold text-gray-900">${userData.name}</h2>
                <p class="text-xl text-gray-600 mt-2">${userData.title}</p>
                <p class="mt-4 text-gray-600 max-w-2xl mx-auto">${userData.bio}</p>

                <div class="mt-6 flex justify-center space-x-6">
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-envelope mr-2"></i>
                        ${userData.email}
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-phone mr-2"></i>
                        ${userData.phone}
                    </div>
                </div>

                <div class="mt-8">
                    <h3 class="text-xl font-semibold mb-4">Technical Skills</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        ${userData.languages.map(skill => `
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <div class="flex justify-between mb-2">
                                    <span class="font-medium">${skill.name}</span>
                                    <span class="text-blue-600">${skill.level}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full"
                                         style="width: ${skill.level}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize page
document.addEventListener('DOMContentLoaded', initializeProfile); 