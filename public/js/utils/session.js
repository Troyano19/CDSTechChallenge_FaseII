/**
 * Session-related functionality (login/logout/account management)
 */

/**
 * Log out the current user
 * @returns {Promise} Promise that resolves when logout is complete
 */
export async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });
        
        if (response.ok || response.status === 204) {
            // Redirect to home page after successful logout
            window.location.href = '/';
            return true;
        } else {
            console.error('Logout failed');
            return false;
        }
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
}

/**
 * Delete the current user account
 * @param {string} password - User's password for confirmation
 * @returns {Promise} Promise that resolves when account deletion is complete
 */
export async function deleteAccount(password) {
    try {
        const response = await fetch('/api/user/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password }),
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error al eliminar la cuenta');
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}

// Initialize logout buttons when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Find all logout buttons in the document
    const logoutButtons = document.querySelectorAll('#logoutButton');
    
    // Add click event listener to each logout button
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
    });
});
