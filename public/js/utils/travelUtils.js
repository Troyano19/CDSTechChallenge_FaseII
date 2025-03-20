/**
 * Utility functions for the travel page
 */

// Initialize country autocomplete functionality for travel form
function initCountryAutocomplete() {
    const originInput = document.getElementById('origin');
    const countryDropdown = document.getElementById('countryDropdown');
    
    if (!originInput || !countryDropdown) return;
    
    // Function to display matching countries in dropdown
    function showMatchingCountries(input) {
        // Clear previous results
        countryDropdown.innerHTML = '';
        
        if (!input) {
            countryDropdown.style.display = 'none';
            return;
        }
        
        // Get current language for results
        const currentLang = window.currentLanguage || 'es';
        
        // Use the improved search function to find matches in both languages
        let matchingCountries;
        
        if (window.CountryUtils && window.CountryUtils.searchCountries) {
            // Use the enhanced search if available
            matchingCountries = window.CountryUtils.searchCountries(input, currentLang);
        } else {
            // Fallback to old method if CountryUtils is not available
            matchingCountries = countries.filter(country => 
                country.toLowerCase().includes(input.toLowerCase())
            );
        }
        
        // Limit to 10 results for performance
        matchingCountries = matchingCountries.slice(0, 10);
        
        if (matchingCountries.length === 0) {
            countryDropdown.style.display = 'none';
            return;
        }
        
        matchingCountries.forEach(country => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = country;
            item.addEventListener('click', () => {
                originInput.value = country;
                countryDropdown.style.display = 'none';
            });
            countryDropdown.appendChild(item);
        });
        
        countryDropdown.style.display = 'block';
    }
    
    // Event listeners for input interactions
    originInput.addEventListener('input', () => {
        showMatchingCountries(originInput.value);
    });
    
    originInput.addEventListener('focus', () => {
        if (originInput.value) {
            showMatchingCountries(originInput.value);
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== originInput && e.target !== countryDropdown) {
            countryDropdown.style.display = 'none';
        }
    });
}

/**
 * Initialize date fields for travel forms
 * Sets minimum dates and ensures return date is not before departure date
 */
function initTravelFormDates() {
    // Set minimum date for datepickers to today
    const today = new Date().toISOString().split('T')[0];
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    
    if (departureDateInput) {
        departureDateInput.min = today;
        departureDateInput.addEventListener('change', () => {
            if (returnDateInput) {
                returnDateInput.min = departureDateInput.value;
                
                // If return is before departure, update return
                if (returnDateInput.value && returnDateInput.value < departureDateInput.value) {
                    returnDateInput.value = departureDateInput.value;
                }
            }
        });
    }
    
    if (returnDateInput) {
        returnDateInput.min = today;
    }
}

// Initialize functionality on page load
document.addEventListener('DOMContentLoaded', () => {
    initCountryAutocomplete();
    initTravelFormDates();
});

// Export utilities through window object
window.TravelUtils = {
    initCountryAutocomplete,
    initTravelFormDates
};
