/**
 * Utility functions for GeoName API integration
 */

const GEONAME_USERNAME = "Joseleelsuper";

/**
 * Normalize text by removing accents/diacritics
 * @param {string} text - Text to normalize
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

/**
 * Check if a string starts with another, ignoring case and accents
 * @param {string} text - Text to check
 * @param {string} prefix - Prefix to look for
 * @returns {boolean} - True if text starts with prefix ignoring accents
 */
function startsWithIgnoreAccents(text, prefix) {
    return normalizeText(text).startsWith(normalizeText(prefix));
}

/**
 * Parse input to check if it follows the "city, country" format
 * @param {string} input - User input
 * @returns {Object|null} - Parsed city and country, or null if not in expected format
 */
function parseCityCountryFormat(input) {
    if (!input || !input.includes(',')) {
        return null;
    }
    
    // Split by comma and trim whitespace
    const parts = input.split(',').map(part => part.trim());
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return null;
    }
    
    return {
        city: parts[0],
        country: parts[1]
    };
}

/**
 * Search for exact match of city and country
 * @param {string} city - City name
 * @param {string} country - Country name
 * @param {string} lang - Language code
 * @returns {Promise<Object|null>} - Matching city object or null
 */
async function searchExactCityCountryMatch(city, country, lang) {
    try {
        // First, try to get the country code
        const countryInfo = await matchesCountry(country, lang);
        if (!countryInfo) {
            return null; // Country not found
        }
        
        // Search for city in the specific country
        const url = `http://api.geonames.org/searchJSON?name=${encodeURIComponent(city)}&country=${countryInfo.countryCode}&featureClass=P&maxRows=5&username=${GEONAME_USERNAME}&lang=${lang}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error('GeoName API error when searching city in country:', response.statusText);
            return null;
        }
        
        const data = await response.json();
        
        if (!data.geonames || data.geonames.length === 0) {
            return null;
        }
        
        // Look for exact match (case insensitive or accent insensitive)
        const exactMatch = data.geonames.find(item => 
            item.name.toLowerCase() === city.toLowerCase() || 
            normalizeText(item.name) === normalizeText(city)
        );
        
        if (exactMatch) {
            return {
                name: exactMatch.name,
                country: exactMatch.countryName,
                countryCode: exactMatch.countryCode,
                featureClass: exactMatch.fcl,
                featureCode: exactMatch.fcode,
                population: exactMatch.population || 0,
                isExactMatch: true
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error searching exact city-country match:', error);
        return null;
    }
}

/**
 * Check if query matches a country name
 * @param {string} query - The search query
 * @param {string} lang - Language code
 * @returns {Promise<Object|null>} - Country info or null if not a country
 */
async function matchesCountry(query, lang) {
    if (!query || query.length < 2) return null;
    
    try {
        // Search specifically for countries (featureClass=A, featureCode=PCLI)
        const url = `http://api.geonames.org/searchJSON?name=${encodeURIComponent(query)}&featureClass=A&featureCode=PCLI&maxRows=5&username=${GEONAME_USERNAME}&lang=${lang}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error('GeoName API error when checking countries:', response.statusText);
            return null;
        }
        
        const data = await response.json();
        
        if (!data.geonames || data.geonames.length === 0) {
            return null;
        }
        
        // Find an exact match or close match for country name
        const countryMatch = data.geonames.find(country => 
            country.name.toLowerCase() === query.toLowerCase() || 
            normalizeText(country.name) === normalizeText(query)
        );
        
        return countryMatch ? {
            countryCode: countryMatch.countryCode,
            name: countryMatch.name
        } : null;
    } catch (error) {
        console.error('Error checking if query matches country:', error);
        return null;
    }
}

/**
 * Get cities for a specific country, sorted alphabetically
 * @param {string} countryCode - ISO country code
 * @param {string} lang - Language code
 * @returns {Promise<Array>} - Array of cities
 */
async function getCitiesInCountry(countryCode, countryName, lang) {
    try {
        // Get cities for the specified country, sorted by name
        const url = `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=30&orderby=name&username=${GEONAME_USERNAME}&lang=${lang}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error('GeoName API error when getting cities in country:', response.statusText);
            return [];
        }
        
        const data = await response.json();
        
        if (!data.geonames || data.geonames.length === 0) {
            return [];
        }
        
        return data.geonames.map(city => ({
            name: city.name,
            country: countryName,
            countryCode: countryCode,
            featureClass: city.fcl,
            featureCode: city.fcode,
            population: city.population || 0,
            isCountryCitySearch: true // Flag that this is from a country-specific search
        }));
        
    } catch (error) {
        console.error('Error getting cities in country:', error);
        return [];
    }
}

/**
 * Search for cities and countries based on a query string
 * @param {string} query - User search query
 * @param {string} lang - Current language (es/en)
 * @returns {Promise<Array>} - Array of city objects with name, country and countryCode
 */
async function searchCitiesAndCountries(query, lang) {
    if (!query || query.length < 2) return [];
    
    try {
        // First, check if the query is in "city, country" format
        const cityCountryParts = parseCityCountryFormat(query);
        if (cityCountryParts) {
            // Try to find an exact match for the city in specified country
            const exactMatch = await searchExactCityCountryMatch(
                cityCountryParts.city, 
                cityCountryParts.country, 
                lang
            );
            
            if (exactMatch) {
                // Return the exact match as the only result
                return [exactMatch];
            }
        }
        
        // First, check if query matches a country name
        const countryMatch = await matchesCountry(query, lang);
        
        if (countryMatch) {
            // If it's a country, get cities in that country sorted alphabetically
            const citiesInCountry = await getCitiesInCountry(countryMatch.countryCode, countryMatch.name, lang);
            
            // Include the country itself at the top of results
            return [{
                name: countryMatch.name,
                country: countryMatch.name,
                countryCode: countryMatch.countryCode,
                featureClass: "A",
                featureCode: "PCLI",
                isCountry: true
            }, ...citiesInCountry];
        }
        
        // Otherwise, perform regular search for cities and countries
        // Search for cities (featureClass=P) and countries (featureCode=PCLI) separately
        const citiesPromise = searchGeonames(query, lang, "P", "", 15);
        const countriesPromise = searchGeonames(query, lang, "A", "PCLI", 5);
        
        const [cities, countries] = await Promise.all([citiesPromise, countriesPromise]);
        
        // Process and combine results
        const processedResults = processSearchResults(query, [...cities, ...countries]);
        return processedResults;
    } catch (error) {
        console.error('Error fetching geonames data:', error);
        return [];
    }
}

/**
 * Search GeoName API with specific parameters
 * @param {string} query - Search query
 * @param {string} lang - Language code
 * @param {string} featureClass - Feature class (P for cities, A for countries, etc.)
 * @param {string} featureCode - Specific feature code
 * @param {number} maxRows - Maximum results to return
 * @returns {Promise<Array>} - Array of search results
 */
async function searchGeonames(query, lang, featureClass, featureCode, maxRows) {
    try {
        // Build the URL with the appropriate parameters
        let url = `http://api.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(query)}&featureClass=${featureClass}`;
        
        // Add featureCode if specified
        if (featureCode) {
            url += `&featureCode=${featureCode}`;
        }
        
        // Complete the URL with other parameters
        url += `&maxRows=${maxRows}&orderby=relevance&username=${GEONAME_USERNAME}&lang=${lang}`;
        
        let response = await fetch(url);
        
        if (!response.ok) {
            console.error('GeoName API error with username:', response.statusText);
            
            // Fallback to default username
            url = url.replace(GEONAME_USERNAME, "yourusername");
            response = await fetch(url);
            
            if (!response.ok) {
                console.error('GeoName API error with default username:', response.statusText);
                return [];
            }
        }
        
        const data = await response.json();
        
        if (data && data.geonames && data.geonames.length > 0) {
            return data.geonames.map(item => ({
                name: item.name,
                country: item.countryName,
                countryCode: item.countryCode,
                featureClass: item.fcl,
                featureCode: item.fcode,
                population: item.population || 0
            }));
        }
        
        return [];
    } catch (error) {
        console.error('Error in searchGeonames:', error);
        return [];
    }
}

/**
 * Process and sort search results based on relevance
 * @param {string} query - Original search query
 * @param {Array} results - Combined search results
 * @returns {Array} - Processed and sorted results
 */
function processSearchResults(query, results) {
    if (!results || results.length === 0) return [];
    
    // Normalize the search query
    const normalizedQuery = normalizeText(query);
    
    // Sort results by relevance
    return results.sort((a, b) => {
        // Country matches should appear at the top when search term matches a country
        if (a.featureCode === 'PCLI' && b.featureCode !== 'PCLI' && startsWithIgnoreAccents(a.name, query)) {
            return -1;
        }
        if (b.featureCode === 'PCLI' && a.featureCode !== 'PCLI' && startsWithIgnoreAccents(b.name, query)) {
            return 1;
        }
        
        // Category 1: Exact match (case-insensitive)
        const aExactMatch = a.name.toLowerCase() === query.toLowerCase();
        const bExactMatch = b.name.toLowerCase() === query.toLowerCase();
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        // Category 1.5: Starts with query (preserves León de los Aldama)
        const aStartsWithQuery = startsWithIgnoreAccents(a.name, query) && !aExactMatch;
        const bStartsWithQuery = startsWithIgnoreAccents(b.name, query) && !bExactMatch;
        
        if (aStartsWithQuery && !bStartsWithQuery) return -1;
        if (!aStartsWithQuery && bStartsWithQuery) return 1;
        
        // Category 2: Match after removing accents (exact match with normalization)
        const aNormalizedMatch = normalizeText(a.name) === normalizedQuery;
        const bNormalizedMatch = normalizeText(b.name) === normalizedQuery;
        
        if (aNormalizedMatch && !bNormalizedMatch) return -1;
        if (!aNormalizedMatch && bNormalizedMatch) return 1;
        
        // Category 3: Normalized starts with query
        const aNormalizedStartsWith = normalizeText(a.name).startsWith(normalizedQuery);
        const bNormalizedStartsWith = normalizeText(b.name).startsWith(normalizedQuery);
        
        if (aNormalizedStartsWith && !bNormalizedStartsWith) return -1;
        if (!aNormalizedStartsWith && bNormalizedStartsWith) return 1;
        
        // Category 4: Sort by population (highest first)
        return b.population - a.population;
    });
}

/**
 * Debounce function to limit API calls
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export utilities through window object
window.GeoNameUtils = {
    searchCitiesAndCountries,
    debounce,
    normalizeText,
    startsWithIgnoreAccents,
    parseCityCountryFormat
};
