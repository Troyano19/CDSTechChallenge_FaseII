/**
 * Language switching functionality
 */

// Check if the language switcher module is already defined
if (typeof window.LanguageSwitcher === 'undefined') {
    // Store available languages
    const availableLanguages = ['es', 'en'];
    const languageNames = {
        'es': 'Español',
        'en': 'English'
    };

    // Flag paths for each language
    const languageFlags = {
        'es': '/images/flags/es.svg',
        'en': '/images/flags/en.svg'
    };

    // Detect browser language on first visit
    function detectBrowserLanguage() {
        // Check if language is already set in localStorage
        if (localStorage.getItem('selectedLanguage')) {
            return localStorage.getItem('selectedLanguage');
        }
        
        // Get browser language (e.g. 'en-US', 'es-ES', etc.)
        let browserLang = navigator.language || navigator.userLanguage;
        
        // Extract base language code (e.g. 'en', 'es')
        browserLang = browserLang.split('-')[0];
        
        // Check if it's a supported language
        if (availableLanguages.includes(browserLang)) {
            return browserLang;
        }
        
        // Default to English if not supported
        return 'en';
    }

    // Initialize language from browser or localStorage
    let currentLanguage = detectBrowserLanguage();

    /**
     * Switch the page language
     * @param {string} lang - Language code to switch to
     */
    function switchLanguage(lang) {
        if (!availableLanguages.includes(lang)) {
            console.error(`Language "${lang}" is not supported.`);
            return;
        }
        
        // Store selected language
        localStorage.setItem('selectedLanguage', lang);
        currentLanguage = lang;
        
        // Refresh the page to apply changes across all components
        window.location.reload();
        
        // The code below will run only if the page refresh fails for some reason
        
        // Update UI
        updateLanguageUI();
        
        // Translate page content
        translatePage();
        
        // Dispatch event for components that need to react to language change
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        
        // Close dropdown after selection
        closeLanguageDropdown();
    }

    /**
     * Update language UI elements
     */
    function updateLanguageUI() {
        // Update current flag
        const currentFlag = document.getElementById('currentFlag');
        if (currentFlag) {
            currentFlag.src = languageFlags[currentLanguage];
            currentFlag.alt = languageNames[currentLanguage];
        }
        
        // Update active state in dropdown
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            const langCode = option.getAttribute('data-language');
            if (langCode === currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    /**
     * Toggle the language dropdown
     */
    function toggleLanguageDropdown() {
        const dropdown = document.querySelector('.language-dropdown-content');
        const currentButton = document.querySelector('.language-current');
        
        if (dropdown) {
            dropdown.classList.toggle('show');
            currentButton.classList.toggle('open');
            currentButton.setAttribute('aria-expanded', dropdown.classList.contains('show'));
            
            // Close dropdown when clicking outside
            if (dropdown.classList.contains('show')) {
                document.addEventListener('click', closeDropdownOnOutsideClick);
            } else {
                document.removeEventListener('click', closeDropdownOnOutsideClick);
            }
        }
    }

    /**
     * Close dropdown when clicking outside
     */
    function closeDropdownOnOutsideClick(event) {
        const dropdown = document.querySelector('.language-dropdown');
        if (dropdown && !dropdown.contains(event.target)) {
            closeLanguageDropdown();
        }
    }

    /**
     * Close the language dropdown
     */
    function closeLanguageDropdown() {
        const dropdown = document.querySelector('.language-dropdown-content');
        const currentButton = document.querySelector('.language-current');
        
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            currentButton.classList.remove('open');
            currentButton.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', closeDropdownOnOutsideClick);
        }
    }

    /**
     * Create language options in the dropdown
     */
    function createLanguageOptions() {
        const dropdownContent = document.querySelector('.language-dropdown-content');
        if (!dropdownContent) return;
        
        // Clear existing options
        dropdownContent.innerHTML = '';
        
        // Add each available language
        availableLanguages.forEach(langCode => {
            const option = document.createElement('a');
            option.href = '#';
            option.className = 'language-option';
            option.setAttribute('data-language', langCode);
            option.setAttribute('role', 'menuitem');
            
            if (langCode === currentLanguage) {
                option.classList.add('active');
            }
            
            option.innerHTML = `
                <img src="${languageFlags[langCode]}" alt="${languageNames[langCode]}" width="20" height="15">
                ${languageNames[langCode]}
            `;
            
            option.addEventListener('click', function(e) {
                e.preventDefault();
                switchLanguage(langCode);
            });
            
            dropdownContent.appendChild(option);
        });
    }

    /**
     * Translate page content based on data-translate attributes
     */
    function translatePage() {
        if (!window.Translations || !window.Translations[currentLanguage]) {
            console.error(`Translations for "${currentLanguage}" not found.`);
            return;
        }
        
        // Select all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const translationKey = element.getAttribute('data-translate');
            if (!translationKey) return;
            
            // Split the key by dots to navigate through the translations object
            const keyParts = translationKey.split('.');
            let translation = window.Translations[currentLanguage];
            
            // Traverse the translation object
            for (const part of keyParts) {
                if (!translation[part]) {
                    console.warn(`Translation key "${translationKey}" not found for language "${currentLanguage}"`);
                    return;
                }
                translation = translation[part];
            }
            
            // Apply the translation based on element type
            if (element.tagName === 'INPUT' && element.getAttribute('type') === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Handle placeholder translations separately
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const translationKey = element.getAttribute('data-translate-placeholder');
            if (!translationKey) return;
            
            // Navigate through the translations object
            const keyParts = translationKey.split('.');
            let translation = window.Translations[currentLanguage];
            
            for (const part of keyParts) {
                if (!translation[part]) {
                    console.warn(`Translation key "${translationKey}" not found for language "${currentLanguage}"`);
                    return;
                }
                translation = translation[part];
            }
            
            element.placeholder = translation;
        });
    }

    /**
     * Initialize language switcher
     */
    function initLanguageSwitcher() {
        // Create language options in dropdown
        createLanguageOptions();
        
        // Set up dropdown toggle
        const currentLanguageButton = document.getElementById('currentLanguage');
        if (currentLanguageButton) {
            currentLanguageButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleLanguageDropdown();
            });
        }
        
        // Update UI to match current language
        updateLanguageUI();
        
        // Translate page on load
        translatePage();
        
        // Add a listener for page content changes (like loading new sections)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // New content was added to the page
                    translatePage();
                }
            });
        });
        
        // Start observing the document body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Export utils through window object
    window.LanguageSwitcher = {
        switchLanguage,
        currentLanguage,
        availableLanguages,
        languageNames,
        translatePage,
        initLanguageSwitcher,
        detectBrowserLanguage
    };

    // Initialize on DOM content loaded - only attach once
    if (!window.languageSwitcherInitialized) {
        document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
        window.languageSwitcherInitialized = true;
    }
}
