/**
 * Utility functions for travel form functionality
 * Shared between home page and travel page
 */

/**
 * Initialize country autocomplete for the origin field
 */
function initCountryAutocomplete() {
    const originInput = document.getElementById('origin');
    const dropdown = document.getElementById('countryDropdown');
    
    if (!originInput || !dropdown || typeof countries === 'undefined') return;
    
    let currentFocus = -1;
    
    // Get current language
    const getCurrentLanguage = () => window.LanguageSwitcher ? 
        window.LanguageSwitcher.currentLanguage : 'es';
    
    // Get country name in the current language (or default)
    const getLocalizedCountryName = (countryName) => {
        const lang = getCurrentLanguage();
        
        // If we're looking at Spanish names (default) and we have countryTranslations for English
        if (lang === 'es' && typeof countryTranslations !== 'undefined') {
            // Return the Spanish name as is
            return countryName;
        }
        
        // For English, we need to find the English name from the countryTranslations
        if (lang === 'en' && typeof countryTranslations !== 'undefined') {
            // Try to find the English equivalent by checking all Spanish-to-English translations
            for (const [englishName, spanishName] of Object.entries(countryTranslations)) {
                if (spanishName === countryName) {
                    return englishName;
                }
            }
        }
        
        // If no translation is found, return the original name
        return countryName;
    };
    
    // Get all countries in the current language
    const getLocalizedCountries = () => {
        if (!countries) return [];
        
        const lang = getCurrentLanguage();
        
        // If Spanish, return original list
        if (lang === 'es') {
            return [...countries];
        }
        
        // If English and we have translations, translate all countries
        if (lang === 'en' && typeof countryTranslations !== 'undefined') {
            // Create a map of Spanish to English country names
            const spanishToEnglish = {};
            for (const [englishName, spanishName] of Object.entries(countryTranslations)) {
                spanishToEnglish[spanishName] = englishName;
            }
            
            // Translate all countries to English
            return countries.map(country => 
                spanishToEnglish[country] || country
            ).sort();
        }
        
        // Default case, return original list
        return [...countries];
    };
    
    // Show dropdown when input receives focus
    originInput.addEventListener('focus', function() {
        if (this.value.length === 0) {
            // Show all countries initially
            showDropdown(getLocalizedCountries());
        } else {
            // Filter based on current input
            filterCountries(this.value);
        }
    });
    
    // Handle input changes
    originInput.addEventListener('input', function() {
        filterCountries(this.value);
    });
    
    // Handle keyboard navigation
    originInput.addEventListener('keydown', function(e) {
        if (!dropdown.classList.contains('show')) return;
        
        const items = dropdown.getElementsByClassName('dropdown-item');
        if (!items.length) return;
        
        // Down arrow - move down in the list
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentFocus++;
            addActive(items);
        }
        // Up arrow - move up in the list
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentFocus--;
            addActive(items);
        }
        // Enter - select the currently focused item
        else if (e.key === 'Enter' && currentFocus > -1) {
            e.preventDefault();
            if (items[currentFocus]) {
                selectCountry(items[currentFocus].textContent);
            }
        }
        // Escape - close the dropdown
        else if (e.key === 'Escape') {
            hideDropdown();
        }
    });
    
    // Handle language change events
    document.addEventListener('languageChanged', function() {
        // If dropdown is visible, update it with the new language
        if (dropdown.classList.contains('show')) {
            if (originInput.value.length === 0) {
                showDropdown(getLocalizedCountries());
            } else {
                filterCountries(originInput.value);
            }
        }
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== originInput && e.target !== dropdown) {
            hideDropdown();
        }
    });
    
    // Filter and show matching countries
    function filterCountries(query) {
        query = query.toLowerCase().trim();
        const lang = getCurrentLanguage();
        
        if (!query) {
            showDropdown(getLocalizedCountries());
            return;
        }
        
        let filtered = [];
        
        if (lang === 'es') {
            // Filter Spanish country names
            filtered = countries.filter(country => {
                return country.toLowerCase().includes(query);
            });
            
            // Also check English names if translations available
            if (typeof countryTranslations !== 'undefined') {
                // Find Spanish countries that match by their English name
                const englishMatches = Object.entries(countryTranslations)
                    .filter(([engName]) => engName.toLowerCase().includes(query))
                    .map(([, spanishName]) => spanishName);
                
                // Add English matches that weren't already found
                englishMatches.forEach(country => {
                    if (!filtered.includes(country)) {
                        filtered.push(country);
                    }
                });
            }
        } else if (lang === 'en' && typeof countryTranslations !== 'undefined') {
            // Create English country list
            const englishCountries = getLocalizedCountries();
            
            // Filter English country names
            filtered = englishCountries.filter(country => {
                return country.toLowerCase().includes(query);
            });
        }
        
        // Sort results alphabetically
        filtered.sort();
        showDropdown(filtered);
    }
    
    // Display countries in the dropdown
    function showDropdown(countryList) {
        dropdown.innerHTML = '';
        currentFocus = -1;
        
        if (countryList.length === 0) {
            const item = document.createElement('div');
            item.classList.add('dropdown-item', 'no-results');
            
            // Show "No countries found" in the current language
            const lang = getCurrentLanguage();
            item.textContent = lang === 'en' ? 'No countries found' : 'No se encontraron países';
            
            dropdown.appendChild(item);
        } else {
            countryList.forEach(country => {
                const item = document.createElement('div');
                item.classList.add('dropdown-item');
                item.textContent = country;
                
                // Handle item click
                item.addEventListener('click', function() {
                    selectCountry(country);
                });
                
                // Handle item hover
                item.addEventListener('mouseover', function() {
                    removeActive();
                    this.classList.add('highlighted');
                });
                
                item.addEventListener('mouseout', function() {
                    this.classList.remove('highlighted');
                });
                
                dropdown.appendChild(item);
            });
        }
        
        dropdown.classList.add('show');
    }
    
    // Hide the dropdown
    function hideDropdown() {
        dropdown.classList.remove('show');
        currentFocus = -1;
    }
    
    // Select a country from the dropdown
    function selectCountry(country) {
        originInput.value = country;
        hideDropdown();
    }
    
    // Add active class to the current focus item
    function addActive(items) {
        if (!items) return;
        
        removeActive();
        
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        
        items[currentFocus].classList.add('highlighted');
        items[currentFocus].scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
    
    // Remove active class from all items
    function removeActive() {
        const items = dropdown.getElementsByClassName('dropdown-item');
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('highlighted');
        }
    }
}

/**
 * Initialize travel form date validation
 * Sets the minimum date for departure date to today
 * Ensures return date cannot be before departure date
 */
function initTravelFormDates() {
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    
    if (!departureDateInput || !returnDateInput) return;
    
    // Format today's date as YYYY-MM-DD for input[type="date"]
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${year}-${month}-${day}`;
    
    // Set minimum date for departure to today
    departureDateInput.min = formattedToday;
    
    // Update return date's minimum whenever departure date changes
    departureDateInput.addEventListener('change', function() {
        returnDateInput.min = this.value;
        
        // If return date is now invalid (before departure), reset it
        if (returnDateInput.value && returnDateInput.value < this.value) {
            returnDateInput.value = this.value;
        }
    });
    
    // Initial setting of return date minimum (if departure date already has a value)
    if (departureDateInput.value) {
        returnDateInput.min = departureDateInput.value;
    } else {
        returnDateInput.min = formattedToday;
    }
}

/**
 * Initialize form fields from URL query parameters if they exist
 */
function initFormFromQueryParams() {
    // Get URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set origin from URL parameter if it exists
    const origin = urlParams.get('origin');
    if (origin) {
        const originInput = document.getElementById('origin');
        if (originInput) {
            originInput.value = decodeURIComponent(origin);
        }
    }
    
    // Set departure date from URL parameter if it exists
    const departure = urlParams.get('departure');
    if (departure) {
        const departureDateInput = document.getElementById('departureDate');
        if (departureDateInput) {
            departureDateInput.value = decodeURIComponent(departure);
        }
    }
    
    // Set return date from URL parameter if it exists
    const returnDate = urlParams.get('return');
    if (returnDate) {
        const returnDateInput = document.getElementById('returnDate');
        if (returnDateInput) {
            returnDateInput.value = decodeURIComponent(returnDate);
        }
    }
}

// Export the utility functions
window.TravelUtils = {
    initCountryAutocomplete,
    initTravelFormDates,
    initFormFromQueryParams
};
