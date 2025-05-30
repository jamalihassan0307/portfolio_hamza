// Global state
let projects = [];
let editingProject = null;

// Fetch projects from API
async function fetchProjects() {
    try {
        const response = await fetch('https://6788c4622c874e66b7d635aa.mockapi.io/Projects');
        projects = await response.json();
        renderProjects();
    } catch (error) {
        console.error('Error fetching projects:', error);
        showToast('Failed to load projects', 'error');
    }
}

// Render projects grid
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const addProjectButton = document.getElementById('add-project-button');

    // Show/hide add project button based on auth state
    if (currentUser) {
        addProjectButton.classList.remove('hidden');
    } else {
        addProjectButton.classList.add('hidden');
    }

    // Render projects
    projectsGrid.innerHTML = projects.map(project => `
        <div class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="relative h-48">
                <img src="${project.image}"
                     alt="${project.name}"
                     class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button onclick="event.preventDefault(); event.stopPropagation(); showProjectDetails('${project.id}')"
                            class="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <i class="fas fa-eye mr-2"></i>View
                    </button>
                    ${currentUser ? `
                        <button onclick="event.preventDefault(); event.stopPropagation(); editProject('${project.id}')"
                                class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                            <i class="fas fa-edit mr-2"></i>Edit
                        </button>
                        <button onclick="event.preventDefault(); event.stopPropagation(); confirmDelete('${project.id}')"
                                class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                            <i class="fas fa-trash-alt mr-2"></i>Delete
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-xl font-semibold mb-2">${project.name}</h3>
                <p class="text-gray-600 line-clamp-2 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2">
                    ${project.technologies.map(tech => `
                        <span class="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Show project details modal
function showProjectDetails(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('project-details-modal');
    const detailsContent = document.getElementById('project-details-content');
    
    detailsContent.innerHTML = `
        <div class="space-y-6">
            <img src="${project.image}"
                 alt="${project.name}"
                 class="w-full h-64 object-cover rounded-lg">
            
            <div>
                <h2 class="text-2xl font-bold mb-4">${project.name}</h2>
                <p class="text-gray-600">${project.description}</p>
            </div>

            <div>
                <h3 class="text-lg font-semibold mb-2">Technologies Used:</h3>
                <div class="flex flex-wrap gap-2">
                    ${project.technologies.map(tech => `
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

// Show project form modal
function showProjectForm(project = null) {
    editingProject = project;
    const modal = document.getElementById('project-form-modal');
    const titleElement = document.getElementById('modal-title');
    const form = document.getElementById('project-form');
    
    // Update modal title
    titleElement.textContent = project ? 'Edit Project' : 'Add New Project';
    
    // Populate form if editing
    document.getElementById('project-name').value = project ? project.name : '';
    document.getElementById('project-image').value = project ? project.image : '';
    document.getElementById('project-description').value = project ? project.description : '';
    document.getElementById('project-technologies').value = project ? project.technologies.join(', ') : '';

    modal.classList.remove('hidden');
}

// Close project form modal
function closeProjectForm() {
    const modal = document.getElementById('project-form-modal');
    modal.classList.add('hidden');
    editingProject = null;
    document.getElementById('project-form').reset();
}

// Close project details modal
function closeProjectDetails() {
    const modal = document.getElementById('project-details-modal');
    modal.classList.add('hidden');
}

// Confirm delete
function confirmDelete(projectId) {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        deleteProject(projectId);
    }
}

// Edit project
function editProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        showProjectForm(project);
    }
}

// Delete project
async function deleteProject(projectId) {
    try {
        const response = await fetch(`https://6788c4622c874e66b7d635aa.mockapi.io/Projects/${projectId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            projects = projects.filter(p => p.id !== projectId);
            renderProjects();
            showToast('Project deleted successfully!', 'success');
        } else {
            throw new Error('Failed to delete project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        showToast('Failed to delete project', 'error');
    }
}

// Handle project form submission
async function handleProjectSubmit(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('project-name').value.trim(),
        image: document.getElementById('project-image').value.trim(),
        description: document.getElementById('project-description').value.trim(),
        technologies: document.getElementById('project-technologies')
            .value.split(',')
            .map(tech => tech.trim())
            .filter(tech => tech),
    };

    try {
        if (editingProject) {
            // Update existing project
            const response = await fetch(`https://6788c4622c874e66b7d635aa.mockapi.io/Projects/${editingProject.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...editingProject, ...formData }),
            });

            if (response.ok) {
                const updatedProject = await response.json();
                projects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
                showToast('Project updated successfully!', 'success');
            } else {
                throw new Error('Failed to update project');
            }
        } else {
            // Add new project
            const response = await fetch('https://6788c4622c874e66b7d635aa.mockapi.io/Projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newProject = await response.json();
                projects.push(newProject);
                showToast('Project added successfully!', 'success');
            } else {
                throw new Error('Failed to add project');
            }
        }

        closeProjectForm();
        renderProjects();
    } catch (error) {
        console.error('Error saving project:', error);
        showToast('Failed to save project', 'error');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    
    // Add event listeners
    document.getElementById('project-form').addEventListener('submit', handleProjectSubmit);
    
    // Close modals when clicking outside
    document.getElementById('project-details-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeProjectDetails();
        }
    });
    
    document.getElementById('project-form-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeProjectForm();
        }
    });
}); 