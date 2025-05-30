// Auth state management
let currentUser = null;

// Check if user is logged in from localStorage
function checkAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

// Update UI based on auth state
function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    if (!authButtons) return;

    if (currentUser) {
        authButtons.innerHTML = `
            <div class="flex items-center space-x-4">
                <a href="profile.html" class="flex items-center space-x-2 hover:text-gray-300">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <img src="${currentUser.image || 'https://via.placeholder.com/32'}" 
                             alt="${currentUser.name}"
                             class="w-full h-full object-cover">
                    </div>
                    <span>${currentUser.name}</span>
                </a>
                <button onclick="logout()" 
                        class="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors">
                    Logout
                </button>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <button onclick="showLoginModal()" 
                    class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Login
            </button>
        `;
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.remove('hidden');
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 relative">
            <button onclick="closeLoginModal()" 
                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                ✕
            </button>
            <h2 class="text-2xl font-bold mb-4">Login</h2>
            <form id="login-form" onsubmit="handleLogin(event)">
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Email</label>
                    <input type="email" 
                           id="login-email"
                           class="w-full p-2 border rounded-lg text-gray-900" 
                           required>
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 mb-2">Password</label>
                    <input type="password" 
                           id="login-password"
                           class="w-full p-2 border rounded-lg text-gray-900" 
                           required>
                </div>
                <button type="submit" 
                        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    `;
}

// Close login modal
function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.add('hidden');
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('https://6788c4622c874e66b7d635aa.mockapi.io/user');
        const users = await response.json();
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            currentUser = userWithoutPassword;
            updateAuthUI();
            closeLoginModal();
            showToast('Login successful!', 'success');
            
            // Redirect to home page if not already there
            if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
                window.location.href = 'index.html';
            } else {
                // Reload the page to update content
                window.location.reload();
            }
        } else {
            showToast('Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed', 'error');
    }
}

// Handle logout
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateAuthUI();
    showToast('Logged out successfully!', 'success');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Show toast notification
function showToast(message, type = 'success') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'success' ? "#10B981" : "#EF4444",
    }).showToast();
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', checkAuthState); 