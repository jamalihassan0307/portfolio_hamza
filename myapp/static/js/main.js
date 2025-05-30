// Show toast notification
function showToast(message, type = 'success') {
    const options = {
        text: message,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: type === 'success' ? '#48bb78' : '#f56565',
    };
    Toastify(options).showToast();
}

// Confirm delete
function confirmDelete(message) {
    return confirm(message || 'Are you sure you want to delete this item?');
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (form.dataset.confirm) {
                if (!confirmDelete(form.dataset.confirm)) {
                    e.preventDefault();
                }
            }
        });
    });
}); 