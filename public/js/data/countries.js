/**
 * Countries data and translations
 */

// Spanish country names (primary language)
const countries = [
    "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita", "Argelia", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", 
    "Baréin", "Bélgica", "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", 
    "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", 
    "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", 
    "Colombia", "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", 
    "Cuba", "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", 
    "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia", "Etiopía", "Filipinas", 
    "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", 
    "Guatemala", "Guinea", "Guinea-Bisáu", "Guinea Ecuatorial", "Guyana", "Haití", "Honduras", "Hungría", 
    "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", 
    "Israel", "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", 
    "Kiribati", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", 
    "Lituania", "Luxemburgo", "Madagascar", "Malasia", "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", 
    "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", 
    "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega", "Nueva Zelanda", 
    "Omán", "Países Bajos", "Pakistán", "Palaos", "Palestina", "Panamá", "Papúa Nueva Guinea", "Paraguay", 
    "Perú", "Polonia", "Portugal", "Reino Unido", "República Centroafricana", "República Checa", 
    "República del Congo", "República Democrática del Congo", "República Dominicana", "Ruanda", "Rumanía", 
    "Rusia", "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", 
    "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona", 
    "Singapur", "Siria", "Somalia", "Sri Lanka", "Suazilandia", "Sudáfrica", "Sudán", "Sudán del Sur", 
    "Suecia", "Suiza", "Surinam", "Tailandia", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", 
    "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", "Uganda", 
    "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"
];

// Map of English translations for Spanish countries
const countryTranslations = {
    "Afghanistan": "Afganistán",
    "Albania": "Albania",
    "Germany": "Alemania",
    "Andorra": "Andorra",
    "Angola": "Angola",
    "Antigua and Barbuda": "Antigua y Barbuda",
    "Saudi Arabia": "Arabia Saudita",
    "Algeria": "Argelia",
    "Argentina": "Argentina",
    "Armenia": "Armenia",
    "Australia": "Australia",
    "Austria": "Austria",
    "Azerbaijan": "Azerbaiyán",
    "Bahamas": "Bahamas",
    "Bangladesh": "Bangladés",
    "Barbados": "Barbados",
    "Bahrain": "Baréin",
    "Belgium": "Bélgica",
    "Belize": "Belice",
    "Benin": "Benín",
    "Belarus": "Bielorrusia",
    "Myanmar": "Birmania",
    "Bolivia": "Bolivia",
    "Bosnia and Herzegovina": "Bosnia y Herzegovina",
    "Botswana": "Botsuana",
    "Brazil": "Brasil",
    "Brunei": "Brunéi",
    "Bulgaria": "Bulgaria",
    "Burkina Faso": "Burkina Faso",
    "Burundi": "Burundi",
    "Bhutan": "Bután",
    "Cape Verde": "Cabo Verde",
    "Cambodia": "Camboya",
    "Cameroon": "Camerún",
    "Canada": "Canadá",
    "Qatar": "Catar",
    "Chad": "Chad",
    "Chile": "Chile",
    "China": "China",
    "Cyprus": "Chipre",
    "Vatican City": "Ciudad del Vaticano",
    "Colombia": "Colombia",
    "Comoros": "Comoras",
    "North Korea": "Corea del Norte",
    "South Korea": "Corea del Sur",
    "Ivory Coast": "Costa de Marfil",
    "Costa Rica": "Costa Rica",
    "Croatia": "Croacia",
    "Cuba": "Cuba",
    "Denmark": "Dinamarca",
    "Dominica": "Dominica",
    "Ecuador": "Ecuador",
    "Egypt": "Egipto",
    "El Salvador": "El Salvador",
    "United Arab Emirates": "Emiratos Árabes Unidos",
    "Eritrea": "Eritrea",
    "Slovakia": "Eslovaquia",
    "Slovenia": "Eslovenia",
    "Spain": "España",
    "United States": "Estados Unidos",
    "Estonia": "Estonia",
    "Ethiopia": "Etiopía",
    "Philippines": "Filipinas",
    "Finland": "Finlandia",
    "Fiji": "Fiyi",
    "France": "Francia",
    "Gabon": "Gabón",
    "Gambia": "Gambia",
    "Georgia": "Georgia",
    "Ghana": "Ghana",
    "Grenada": "Granada",
    "Greece": "Grecia",
    "Guatemala": "Guatemala",
    "Guinea": "Guinea",
    "Guinea-Bissau": "Guinea-Bisáu",
    "Equatorial Guinea": "Guinea Ecuatorial",
    "Guyana": "Guyana",
    "Haiti": "Haití",
    "Honduras": "Honduras",
    "Hungary": "Hungría",
    "India": "India",
    "Indonesia": "Indonesia",
    "Iraq": "Irak",
    "Iran": "Irán",
    "Ireland": "Irlanda",
    "Iceland": "Islandia",
    "Marshall Islands": "Islas Marshall",
    "Solomon Islands": "Islas Salomón",
    "Israel": "Israel",
    "Italy": "Italia",
    "Jamaica": "Jamaica",
    "Japan": "Japón",
    "Jordan": "Jordania",
    "Kazakhstan": "Kazajistán",
    "Kenya": "Kenia",
    "Kyrgyzstan": "Kirguistán",
    "Kiribati": "Kiribati",
    "Kuwait": "Kuwait",
    "Laos": "Laos",
    "Lesotho": "Lesoto",
    "Latvia": "Letonia",
    "Lebanon": "Líbano",
    "Liberia": "Liberia",
    "Libya": "Libia",
    "Liechtenstein": "Liechtenstein",
    "Lithuania": "Lituania",
    "Luxembourg": "Luxemburgo",
    "Madagascar": "Madagascar",
    "Malaysia": "Malasia",
    "Malawi": "Malaui",
    "Maldives": "Maldivas",
    "Mali": "Malí",
    "Malta": "Malta",
    "Morocco": "Marruecos",
    "Mauritius": "Mauricio",
    "Mauritania": "Mauritania",
    "Mexico": "México",
    "Micronesia": "Micronesia",
    "Moldova": "Moldavia",
    "Monaco": "Mónaco",
    "Mongolia": "Mongolia",
    "Montenegro": "Montenegro",
    "Mozambique": "Mozambique",
    "Namibia": "Namibia",
    "Nauru": "Nauru",
    "Nepal": "Nepal",
    "Nicaragua": "Nicaragua",
    "Niger": "Níger",
    "Nigeria": "Nigeria",
    "Norway": "Noruega",
    "New Zealand": "Nueva Zelanda",
    "Oman": "Omán",
    "Netherlands": "Países Bajos",
    "Pakistan": "Pakistán",
    "Palau": "Palaos",
    "Palestine": "Palestina",
    "Panama": "Panamá",
    "Papua New Guinea": "Papúa Nueva Guinea",
    "Paraguay": "Paraguay",
    "Peru": "Perú",
    "Poland": "Polonia",
    "Portugal": "Portugal",
    "United Kingdom": "Reino Unido",
    "Central African Republic": "República Centroafricana",
    "Czech Republic": "República Checa",
    "Republic of the Congo": "República del Congo",
    "Democratic Republic of the Congo": "República Democrática del Congo",
    "Dominican Republic": "República Dominicana",
    "Rwanda": "Ruanda",
    "Romania": "Rumanía",
    "Russia": "Rusia",
    "Samoa": "Samoa",
    "Saint Kitts and Nevis": "San Cristóbal y Nieves",
    "San Marino": "San Marino",
    "Saint Vincent and the Grenadines": "San Vicente y las Granadinas",
    "Saint Lucia": "Santa Lucía",
    "Sao Tome and Principe": "Santo Tomé y Príncipe",
    "Senegal": "Senegal",
    "Serbia": "Serbia",
    "Seychelles": "Seychelles",
    "Sierra Leone": "Sierra Leona",
    "Singapore": "Singapur",
    "Syria": "Siria",
    "Somalia": "Somalia",
    "Sri Lanka": "Sri Lanka",
    "Swaziland": "Suazilandia",
    "South Africa": "Sudáfrica",
    "Sudan": "Sudán",
    "South Sudan": "Sudán del Sur",
    "Sweden": "Suecia",
    "Switzerland": "Suiza",
    "Suriname": "Surinam",
    "Thailand": "Tailandia",
    "Tanzania": "Tanzania",
    "Tajikistan": "Tayikistán",
    "East Timor": "Timor Oriental",
    "Togo": "Togo",
    "Tonga": "Tonga",
    "Trinidad and Tobago": "Trinidad y Tobago",
    "Tunisia": "Túnez",
    "Turkmenistan": "Turkmenistán",
    "Turkey": "Turquía",
    "Tuvalu": "Tuvalu",
    "Ukraine": "Ucrania",
    "Uganda": "Uganda",
    "Uruguay": "Uruguay",
    "Uzbekistan": "Uzbekistán",
    "Vanuatu": "Vanuatu",
    "Venezuela": "Venezuela",
    "Vietnam": "Vietnam",
    "Yemen": "Yemen",
    "Djibouti": "Yibuti",
    "Zambia": "Zambia",
    "Zimbabwe": "Zimbabue"
};

// Create reverse mapping (Spanish to English) for easier lookups
const reverseCountryTranslations = {};
for (const [english, spanish] of Object.entries(countryTranslations)) {
    reverseCountryTranslations[spanish] = english;
}

/**
 * Get country name in target language
 * @param {string} countryName - Country name in any supported language
 * @param {string} targetLang - Target language code ('es' or 'en')
 * @returns {string} - Country name in target language
 */
function getCountryInLanguage(countryName, targetLang) {
    if (!countryName) return '';
    
    // If target language is Spanish, find the Spanish name
    if (targetLang === 'es') {
        // If already Spanish, return as is
        if (countries.includes(countryName)) {
            return countryName;
        }
        // Try to translate from English to Spanish
        return countryTranslations[countryName] || countryName;
    } 
    // If target language is English, find the English name
    else if (targetLang === 'en') {
        // If already English, return as is (check if it exists as key in countryTranslations)
        if (Object.keys(countryTranslations).includes(countryName)) {
            return countryName;
        }
        // Try to translate from Spanish to English
        return reverseCountryTranslations[countryName] || countryName;
    }
    
    // Default return the original name
    return countryName;
}

/**
 * Get list of countries in target language
 * @param {string} targetLang - Target language code ('es' or 'en')
 * @returns {Array} - List of country names in target language
 */
function getCountriesInLanguage(targetLang) {
    if (targetLang === 'es') {
        return [...countries];
    } else if (targetLang === 'en') {
        return Object.keys(countryTranslations);
    }
    return [...countries];
}

/**
 * Search countries in all languages
 * @param {string} query - Search query
 * @param {string} targetLang - Target language for results
 * @returns {Array} - Matching country names in target language
 */
function searchCountries(query, targetLang) {
    if (!query) return [];
    
    query = query.toLowerCase();
    const results = new Set();
    
    // Search in Spanish names
    countries.forEach(country => {
        if (country.toLowerCase().includes(query)) {
            results.add(getCountryInLanguage(country, targetLang));
        }
    });
    
    // Search in English names
    Object.keys(countryTranslations).forEach(english => {
        if (english.toLowerCase().includes(query)) {
            const translated = getCountryInLanguage(english, targetLang);
            results.add(translated);
        }
    });
    
    return Array.from(results);
}

// Export utilities through window
window.CountryUtils = {
    getCountryInLanguage,
    getCountriesInLanguage,
    searchCountries
};