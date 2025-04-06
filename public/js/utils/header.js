document.addEventListener('DOMContentLoaded', function() {
    // Get the header element
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    // Check user role and show/hide business link
    checkUserRoleForBusinessLink();
    
    // Function to handle header visibility on scroll
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Determine scroll direction
        if (currentScrollY > lastScrollY) {
            // Scrolling down - hide header
            header.classList.add('header-hidden');
        } else {
            // Scrolling up - show header
            header.classList.remove('header-hidden');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Mobile menu functionality
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mainNav = document.getElementById('mainNav');
    
    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', function() {
            // Toggle active class on hamburger menu
            this.classList.toggle('active');
            
            // Toggle mobile-menu-open class on nav
            mainNav.classList.toggle('mobile-menu-open');
        });
        
        // Close menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Only do this on mobile view
                if (window.innerWidth <= 768) {
                    hamburgerMenu.classList.remove('active');
                    mainNav.classList.remove('mobile-menu-open');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            // Check if click is outside nav and hamburger menu
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnHamburger = hamburgerMenu.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && mainNav.classList.contains('mobile-menu-open')) {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('mobile-menu-open');
            }
        });
    }
});

/**
 * Check the user's role and show/hide the business link accordingly
 */
function checkUserRoleForBusinessLink() {
    const businessLink = document.getElementById('businessLink');
    
    if (businessLink) {
        // Fetch the current user data
        fetch('/api/user/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch user data');
        })
        .then(userData => {
            // Show the business link only if user has a non-USER role
            if (userData && userData.role && userData.role !== 'USER') {
                businessLink.style.display = 'flex';
            } else {
                businessLink.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error checking user role:', error);
            businessLink.style.display = 'none';
        });
    }
}
