/**
 * Carousel functionality for GreenLake Portal
 * This file contains functions for initializing various carousel components
 */

/**
 * Initialize the header image carousel
 * @param {string} containerSelector - CSS selector for the carousel container
 */
function initImageCarousel(containerSelector = '.carousel-container') {
    const carouselContainer = document.querySelector(containerSelector);
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        
        // Function to show the next slide
        function nextSlide() {
            // Hide current slide
            slides[currentSlide].classList.remove('active');
            
            // Move to next slide
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
 * Initialize a carousel with infinite scrolling
 * @param {string} carouselSelector - CSS selector for the carousel element
 * @param {string} prevBtnSelector - CSS selector for the previous button
 * @param {string} nextBtnSelector - CSS selector for the next button
 * @param {string} cardSelector - CSS selector for the individual card elements
 */
function initGenericCarousel(
    carouselSelector,
    prevBtnSelector,
    nextBtnSelector,
    cardSelector
) {
    const carousel = document.querySelector(carouselSelector);
    const prevButton = document.querySelector(prevBtnSelector);
    const nextButton = document.querySelector(nextBtnSelector);
    
    if (!carousel || !prevButton || !nextButton) return;
    
    const originalCards = carousel.querySelectorAll(cardSelector);
    
    // Only enable carousel if we have more than 3 cards
    if (originalCards.length <= 3) {
        prevButton.classList.add('hidden');
        nextButton.classList.add('hidden');
        return;
    }
    
    // Clone cards for infinite scrolling
    setupInfiniteCards();
    
    // Get all cards including clones
    const cards = carousel.querySelectorAll(cardSelector);
    
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
        const carouselWrapper = carousel.closest('.carousel-wrapper');
        const wrapperWidth = carouselWrapper ? carouselWrapper.offsetWidth : carousel.parentElement.offsetWidth;
        
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
 * Initialize the places of interest carousel with infinite scrolling
 * This is a wrapper around initGenericCarousel for backwards compatibility
 */
function initInterestsCarousel(
    carouselSelector = '.interests-carousel',
    prevBtnSelector = '.carousel-prev',
    nextBtnSelector = '.carousel-next'
) {
    initGenericCarousel(
        carouselSelector,
        prevBtnSelector,
        nextBtnSelector,
        '.interest-card'
    );
}

/**
 * Initialize a business carousel (for activities, establishments, trails)
 */
function initBusinessCarousel(
    carouselSelector = '.business-carousel',
    prevBtnSelector = '.carousel-prev',
    nextBtnSelector = '.carousel-next'
) {
    // Comprobar si el carrusel y los botones existen
    const carousel = document.querySelector(carouselSelector);
    const prevButton = document.querySelector(prevBtnSelector);
    const nextButton = document.querySelector(nextBtnSelector);
    
    if (!carousel || !prevButton || !nextButton) {
        console.warn(`No se encontró el carrusel o botones para: ${carouselSelector}`);
        return;
    }
    
    // Usar una inicialización genérica para el carrusel
    initGenericCarousel(
        carouselSelector,
        prevBtnSelector,
        nextBtnSelector,
        '.business-item'
    );
    
    // Asegurarse que todos los elementos sean clickeables
    carousel.querySelectorAll('.business-item').forEach(item => {
        item.style.pointerEvents = 'auto';
    });
}

// Export carousel functions
window.Carousel = {
    initImageCarousel,
    initInterestsCarousel,
    initBusinessCarousel,
    initGenericCarousel
};
