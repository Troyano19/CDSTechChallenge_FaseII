/**
 * Logout functionality for the website
 */
document.addEventListener("DOMContentLoaded", function() {
    // Get the profile button element
    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.querySelector('.profile-dropdown-content');
    const logoutButton = document.getElementById('logoutButton');
    
    // Add click handler for the profile dropdown
    if (profileButton) {
        profileButton.addEventListener('click', function(event) {
            event.preventDefault();
            profileButton.classList.toggle('open');
            profileDropdown.classList.toggle('show');
        });
        
        // Close the dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!profileButton.contains(event.target)) {
                profileButton.classList.remove('open');
                profileDropdown.classList.remove('show');
            }
        });
    }
    
    // Add click handler for the logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Send request to logout endpoint
            fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            })
            .then(response => {
                if (response.ok || response.status === 204) {
                    // Redirect to home page after successful logout
                    window.location.href = '/';
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
        });
    }
});
