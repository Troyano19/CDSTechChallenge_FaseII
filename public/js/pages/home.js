document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel if present on the page
    initImageCarousel();
    initInterestsCarousel();
    
    // Initialize country autocomplete
    initCountryAutocomplete();
});

/**
 * Initialize the header image carousel
 */
function initImageCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        
        // Function to show the next slide
        function nextSlide() {
            // Hide current slide
            slides[currentSlide].classList.remove('active');
            
            // Move 50% further (advance by 2 slides)
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Show the new current slide
            slides[currentSlide].classList.add('active');
        }
        
        // Show first slide initially
        slides[0].classList.add('active');
        
        // Automatically advance slides every 5 seconds
        setInterval(nextSlide, 5000);
    }
}

/**
 * Initialize the places of interest carousel with infinite scrolling
 */
function initInterestsCarousel() {
    const carousel = document.querySelector('.interests-carousel');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    
    if (!carousel || !prevButton || !nextButton) return;
    
    const originalCards = carousel.querySelectorAll('.interest-card');
    
    // Only enable carousel if we have more than 3 cards
    if (originalCards.length <= 3) {
        prevButton.classList.add('hidden');
        nextButton.classList.add('hidden');
        return;
    }
    
    // Clone cards for infinite scrolling
    setupInfiniteCards();
    
    // Get all cards including clones
    const cards = carousel.querySelectorAll('.interest-card');
    
    let currentPosition = 0;
    let cardWidth = 0;
    let visibleCards = getVisibleCardsCount();
    let isTransitioning = false;
    
    // Initial calculation of card width
    calculateCardWidth();
    
    // Set up the infinite scrolling by cloning cards
    function setupInfiniteCards() {
        // Remove any existing clones before adding new ones
        carousel.querySelectorAll('.clone').forEach(clone => clone.remove());
        
        // For true infinite scrolling, we need to clone enough cards
        // Clone each original card once (full set duplication)
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            carousel.appendChild(clone);
        });
        
        // Also clone all cards and prepend to the beginning
        // This ensures we can scroll backwards infinitely as well
        for (let i = originalCards.length - 1; i >= 0; i--) {
            const clone = originalCards[i].cloneNode(true);
            clone.classList.add('clone', 'prepend');
            carousel.prepend(clone);
        }
        
        // Adjust the starting position to show original cards first
        setTimeout(() => {
            const prependCount = originalCards.length;
            currentPosition = prependCount;
            updateCarouselWithoutAnimation();
        }, 0);
    }
    
    // Calculate card width based on container
    function calculateCardWidth() {
        const carouselWrapper = document.querySelector('.interests-carousel-wrapper');
        const wrapperWidth = carouselWrapper.offsetWidth;
        
        // Calculate gap between cards (from CSS)
        const computedStyle = window.getComputedStyle(carousel);
        const gapValue = computedStyle.getPropertyValue('gap');
        const gap = gapValue ? parseInt(gapValue, 10) : 32; // Default to 2rem (32px) if not found
        
        // Calculate card width based on visible cards count and gap
        visibleCards = getVisibleCardsCount();
        const totalGapWidth = gap * (visibleCards - 1);
        cardWidth = (wrapperWidth - totalGapWidth) / visibleCards;
        
        // Apply width to all cards for consistency
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
            card.style.flex = `0 0 ${cardWidth}px`;
        });
        
        return cardWidth;
    }
    
    // Get number of cards that should be visible based on screen size
    function getVisibleCardsCount() {
        const windowWidth = window.innerWidth;
        if (windowWidth >= 1200) return 3;
        if (windowWidth >= 768) return 2;
        return 1;
    }
    
    // Update carousel transform based on current position, with animation
    function updateCarousel() {
        isTransitioning = true;
        let translateValue = currentPosition * -cardWidth;
        
        // For multiple cards, we need to account for the gap between cards
        const computedStyle = window.getComputedStyle(carousel);
        const gapValue = computedStyle.getPropertyValue('gap');
        const gap = gapValue ? parseInt(gapValue, 10) : 32;
        
        // Adjust the translation to account for gaps between cards
        translateValue -= gap * currentPosition;
        
        carousel.style.transition = 'transform 0.5s ease';
        carousel.style.transform = `translateX(${translateValue}px)`;
    }
    
    // Update carousel position without animation (for resets)
    function updateCarouselWithoutAnimation() {
        let translateValue = currentPosition * -cardWidth;
        
        // For multiple cards, we need to account for the gap between cards
        const computedStyle = window.getComputedStyle(carousel);
        const gapValue = computedStyle.getPropertyValue('gap');
        const gap = gapValue ? parseInt(gapValue, 10) : 32;
        
        // Adjust the translation to account for gaps between cards
        translateValue -= gap * currentPosition;
        
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(${translateValue}px)`;
        // Force reflow
        void carousel.offsetWidth;
        carousel.style.transition = 'transform 0.5s ease';
    }
    
    // Navigate to the previous card
    function goToPrev() {
        if (isTransitioning) return;
        currentPosition--;
        updateCarousel();
    }
    
    // Navigate to the next card
    function goToNext() {
        if (isTransitioning) return;
        currentPosition++;
        updateCarousel();
    }
    
    // Handle the transition end to implement infinite scrolling
    carousel.addEventListener('transitionend', function() {
        isTransitioning = false;
        const totalOriginalCards = originalCards.length;
        
        // Check if we've scrolled past the end of original cards
        if (currentPosition >= totalOriginalCards * 2) {
            // Reset back to the first set of original cards
            currentPosition = totalOriginalCards;
            updateCarouselWithoutAnimation();
        }
        // Check if we've scrolled before the beginning of original cards
        else if (currentPosition < totalOriginalCards) {
            // Reset to the second set of original cards (end position)
            currentPosition = totalOriginalCards * 2 - 1;
            updateCarouselWithoutAnimation();
        }
    });
    
    // Event listeners
    prevButton.addEventListener('click', goToPrev);
    nextButton.addEventListener('click', goToNext);
    
    // Update card width calculation on window resize
    window.addEventListener('resize', function() {
        // Recalculate card width
        calculateCardWidth();
        // Update carousel position without animation
        updateCarouselWithoutAnimation();
    });
}

/**
 * Initialize country autocomplete for the origin field
 */
function initCountryAutocomplete() {
    const originInput = document.getElementById('origin');
    const dropdown = document.getElementById('countryDropdown');
    
    if (!originInput || !dropdown || typeof countries === 'undefined') return;
    
    let currentFocus = -1;
    
    // Show dropdown when input receives focus
    originInput.addEventListener('focus', function() {
        if (this.value.length === 0) {
            // Show all countries initially
            showDropdown(countries);
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
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== originInput && e.target !== dropdown) {
            hideDropdown();
        }
    });
    
    // Filter and show matching countries
    function filterCountries(query) {
        query = query.toLowerCase().trim();
        
        if (!query) {
            showDropdown(countries);
            return;
        }
        
        // Check if the query exactly matches an English country name
        const englishMatch = typeof countryTranslations !== 'undefined' && 
                            countryTranslations[query];
        
        if (englishMatch) {
            // If exact match in English, show only that result
            showDropdown([englishMatch]);
            return;
        }
        
        // Filter by Spanish names
        let filtered = countries.filter(country => {
            return country.toLowerCase().includes(query);
        });
        
        // Also filter by English names if translations are available
        if (typeof countryTranslations !== 'undefined') {
            // Find countries that match by English name
            const englishMatches = Object.keys(countryTranslations)
                .filter(engName => engName.includes(query))
                .map(engName => countryTranslations[engName]);
            
            // Add English matches that weren't already found
            englishMatches.forEach(country => {
                if (!filtered.includes(country)) {
                    filtered.push(country);
                }
            });
            
            // Sort results alphabetically
            filtered.sort();
        }
        
        showDropdown(filtered);
    }
    
    // Display countries in the dropdown
    function showDropdown(countryList) {
        dropdown.innerHTML = '';
        currentFocus = -1;
        
        if (countryList.length === 0) {
            const item = document.createElement('div');
            item.classList.add('dropdown-item', 'no-results');
            item.textContent = 'No se encontraron países';
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
