/**
 * Utility functions for the travel page
 */

// Initialize city and country autocomplete functionality for travel form
function initCityCountryAutocomplete() {
    const originInput = document.getElementById('origin');
    const countryDropdown = document.getElementById('countryDropdown');
    
    if (!originInput || !countryDropdown) return;
    
    // Get the GeoName utilities
    const geoNameUtils = window.GeoNameUtils;
    if (!geoNameUtils) {
        console.error('GeoName utilities not loaded');
        // Fall back to country-only search if GeoName not available
        initCountryAutocomplete();
        return;
    }
    
    // Function to display matching cities and countries in dropdown
    async function showMatchingCitiesAndCountries(input) {
        // Clear previous results
        countryDropdown.innerHTML = '';
        
        if (!input || input.length < 2) {
            countryDropdown.classList.remove('show');
            return;
        }
        
        // Get current language for results
        const currentLang = window.currentLanguage || 'es';
        
        // Show loading indicator
        const loading = document.createElement('div');
        loading.className = 'dropdown-item loading';
        loading.textContent = currentLang === 'es' ? 'Buscando...' : 'Searching...';
        countryDropdown.appendChild(loading);
        countryDropdown.classList.add('show');
        
        try {
            // Check if input is in city, country format
            const cityCountryParts = geoNameUtils.parseCityCountryFormat(input);
            
            // Fetch matching cities and countries
            const results = await geoNameUtils.searchCitiesAndCountries(input, currentLang);
            
            // Clear previous results including loading indicator
            countryDropdown.innerHTML = '';
            
            if (results.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'dropdown-item no-results';
                noResults.textContent = currentLang === 'es' ? 'No se encontraron resultados' : 'No results found';
                countryDropdown.appendChild(noResults);
                return;
            }
            
            // If we found an exact match for "city, country" format, 
            // we can select it immediately or highlight it prominently
            if (results.length === 1 && results[0].isExactMatch && cityCountryParts) {
                const exactMatch = results[0];
                
                // Option 1: Select it automatically
                selectPlace(exactMatch);
                countryDropdown.classList.remove('show');
                return;
                
                // Option 2 (alternative): Show it but highlight it prominently
                // addExactCityCountryMatch(exactMatch);
            }
            
            // Group results for better visual organization
            let hasCountries = false;
            let hasCities = false;
            let isCountrySearch = false;
            
            // Check if this is a country-specific search (first result is a country)
            if (results.length > 0 && results[0].isCountry) {
                isCountrySearch = true;
                
                // Add the country as the first result
                const country = results[0];
                addCountryToDropdown(country);
                
                // Add heading for cities in this country
                const citiesHeading = document.createElement('div');
                citiesHeading.className = 'dropdown-heading';
                citiesHeading.textContent = currentLang === 'es' ? 
                    `Ciudades en ${country.name}` : 
                    `Cities in ${country.name}`;
                countryDropdown.appendChild(citiesHeading);
                
                // Add cities (skip the first result which is the country)
                for (let i = 1; i < results.length; i++) {
                    addPlaceToDropdown(results[i], input);
                }
            } else {
                // Standard search - first add countries (if any)
                results.forEach(place => {
                    if (place.featureCode === 'PCLI') {
                        if (!hasCountries) {
                            hasCountries = true;
                            // Add countries heading
                            const countriesHeading = document.createElement('div');
                            countriesHeading.className = 'dropdown-heading';
                            countriesHeading.textContent = currentLang === 'es' ? 'Países' : 'Countries';
                            countryDropdown.appendChild(countriesHeading);
                        }
                        addCountryToDropdown(place);
                    }
                });
                
                // Then add cities
                let addedCitiesHeading = false;
                results.forEach(place => {
                    if (place.featureCode !== 'PCLI') {
                        if (!addedCitiesHeading) {
                            addedCitiesHeading = true;
                            hasCities = true;
                            // Add cities heading if there are countries too
                            if (hasCountries) {
                                const citiesHeading = document.createElement('div');
                                citiesHeading.className = 'dropdown-heading';
                                citiesHeading.textContent = currentLang === 'es' ? 'Ciudades' : 'Cities';
                                countryDropdown.appendChild(citiesHeading);
                            }
                        }
                        addPlaceToDropdown(place, input);
                    }
                });
            }
            
        } catch (error) {
            console.error('Error searching cities:', error);
            
            // Show error message
            countryDropdown.innerHTML = '';
            const errorItem = document.createElement('div');
            errorItem.className = 'dropdown-item error';
            errorItem.textContent = currentLang === 'es' ? 'Error al buscar ciudades' : 'Error searching cities';
            countryDropdown.appendChild(errorItem);
        }
    }
    
    // Function to select a place and update the input
    function selectPlace(place) {
        // Create a formatted display for "city, country"
        const formattedName = place.isCountry ? place.name : `${place.name}, ${place.country}`;
        
        originInput.value = formattedName;
        
        if (place.isCountry) {
            originInput.dataset.countryName = place.name;
            originInput.dataset.countryCode = place.countryCode;
        } else {
            originInput.dataset.cityName = place.name;
            originInput.dataset.countryName = place.country;
            originInput.dataset.countryCode = place.countryCode;
        }
    }
    
    // Helper function to add a country to the dropdown
    function addCountryToDropdown(country) {
        const item = document.createElement('div');
        item.className = 'dropdown-item country-item';
        
        const nameEl = document.createElement('div');
        nameEl.className = 'country-name-primary';
        nameEl.textContent = country.name;
        
        const codeEl = document.createElement('div');
        codeEl.className = 'country-code';
        codeEl.textContent = `[${country.countryCode}]`;
        
        item.appendChild(nameEl);
        item.appendChild(codeEl);
        
        // Set formatted display
        const formattedName = country.name;
        
        // Use selectPlace function instead of duplicating logic
        item.addEventListener('click', () => {
            selectPlace(country);
            countryDropdown.classList.remove('show');
        });
        
        countryDropdown.appendChild(item);
    }
    
    // Helper function to add a place (city) to the dropdown
    function addPlaceToDropdown(place, searchInput) {
        const item = document.createElement('div');
        item.className = 'dropdown-item city-country-item';
        
        // Determine match type for styling
        const isExactMatch = place.name.toLowerCase() === searchInput.toLowerCase();
        const startsWithQuery = geoNameUtils.startsWithIgnoreAccents(place.name, searchInput) && !isExactMatch;
        const isNormalizedMatch = !isExactMatch && !startsWithQuery && 
            geoNameUtils.normalizeText(place.name) === geoNameUtils.normalizeText(searchInput);
        
        // Create visual elements for the place
        const cityName = document.createElement('div');
        cityName.className = 'city-name';
        cityName.textContent = place.name;
        
        if (isExactMatch) {
            cityName.classList.add('exact-match');
        } else if (startsWithQuery) {
            cityName.classList.add('starts-with-match');
        } else if (isNormalizedMatch) {
            cityName.classList.add('normalized-match');
        }
        
        // For cities, show city name, country name, and country code
        const countryName = document.createElement('div');
        countryName.className = 'country-name';
        countryName.textContent = place.country;
        
        const countryCode = document.createElement('div');
        countryCode.className = 'country-code';
        countryCode.textContent = `[${place.countryCode}]`;
        
        item.appendChild(cityName);
        item.appendChild(countryName);
        item.appendChild(countryCode);
        
        // Create a formatted display for "city, country"
        const formattedName = `${place.name}, ${place.country}`;
        
        // Use selectPlace function instead of duplicating logic
        item.addEventListener('click', () => {
            selectPlace(place);
            countryDropdown.classList.remove('show');
        });
        
        countryDropdown.appendChild(item);
    }
    
    // Helper function to add an exact city-country match (optional enhancement)
    function addExactCityCountryMatch(place) {
        const item = document.createElement('div');
        item.className = 'dropdown-item city-country-item exact-city-country-match';
        
        const matchLabel = document.createElement('div');
        matchLabel.className = 'exact-match-label';
        matchLabel.textContent = currentLang === 'es' ? 'Coincidencia exacta' : 'Exact match';
        
        const cityName = document.createElement('div');
        cityName.className = 'city-name exact-match';
        cityName.textContent = place.name;
        
        const countryName = document.createElement('div');
        countryName.className = 'country-name';
        countryName.textContent = place.country;
        
        const countryCode = document.createElement('div');
        countryCode.className = 'country-code';
        countryCode.textContent = `[${place.countryCode}]`;
        
        item.appendChild(matchLabel);
        item.appendChild(cityName);
        item.appendChild(countryName);
        item.appendChild(countryCode);
        
        item.addEventListener('click', () => {
            selectPlace(place);
            countryDropdown.classList.remove('show');
        });
        
        countryDropdown.appendChild(item);
    }
    
    // Create a debounced version of the search function
    const debouncedSearch = geoNameUtils.debounce((query) => {
        showMatchingCitiesAndCountries(query);
    }, 300); // 300ms debounce time
    
    // Event listeners for input interactions
    originInput.addEventListener('input', () => {
        if (originInput.value.length < 2) {
            countryDropdown.classList.remove('show');
            return;
        }
        
        debouncedSearch(originInput.value);
    });
    
    originInput.addEventListener('focus', () => {
        if (originInput.value && originInput.value.length >= 2) {
            debouncedSearch(originInput.value);
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== originInput && !countryDropdown.contains(e.target)) {
            countryDropdown.classList.remove('show');
        }
    });
}

// Maintain the original country autocomplete as a fallback
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
        

        matchingCountries = matchingCountries.slice(0, 4);
        
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

/**
 * Initialize form with data from URL query parameters
 */
function initFormFromQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const origin = urlParams.get('origin');
    const departureDate = urlParams.get('departureDate');
    const returnDate = urlParams.get('returnDate');
    
    const originInput = document.getElementById('origin');
    const departureDateInput = document.getElementById('departureDate');
    const returnDateInput = document.getElementById('returnDate');
    
    if (origin && originInput) {
        originInput.value = origin;
    }
    
    if (departureDate && departureDateInput) {
        departureDateInput.value = departureDate;
    }
    
    if (returnDate && returnDateInput) {
        returnDateInput.value = returnDate;
    }
}

// Initialize functionality on page load
document.addEventListener('DOMContentLoaded', () => {
    initCityCountryAutocomplete();
    initTravelFormDates();
    initFormFromQueryParams();
});

// Export utilities through window object
window.TravelUtils = {
    initCityCountryAutocomplete,
    initCountryAutocomplete,
    initTravelFormDates,
    initFormFromQueryParams
};
