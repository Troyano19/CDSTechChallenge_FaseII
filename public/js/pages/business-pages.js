/**
 * Handle business list pages (activities, establishments, trails)
 */
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar el customEvent y renderizar caruseles cuando los datos estén listos
    window.addEventListener('CarouselDataReady', (event) => {
        renderBusinessCarousels();
        if (window.Carousel) {
            window.Carousel.initBusinessCarousel('.nearby-carousel', '.nearby-prev', '.nearby-next');
            window.Carousel.initBusinessCarousel('.recommendations-carousel', '.recommendations-prev', '.recommendations-next');
        }
        setupEventListeners();
    });
});

/**
 * Render all business carousels with data from CarouselData
 */
function renderBusinessCarousels() {
    const pageType = getPageType();
    if (!pageType || !window.CarouselData) return;
    
    // Get the appropriate data based on page type
    const carouselData = window.CarouselData[pageType];
    if (!carouselData) return;
    
    // Render the nearby section if it exists
    const nearbyCarousel = document.querySelector('.nearby-carousel');
    if (nearbyCarousel && carouselData.nearby && carouselData.nearby.length > 0) {
        renderBusinessItems(nearbyCarousel, carouselData.nearby);
    }
    
    // Render the recommended section if it exists
    const recommendedCarousel = document.querySelector('.recommendations-carousel');
    if (recommendedCarousel && carouselData.recommended && carouselData.recommended.length > 0) {
        renderBusinessItems(recommendedCarousel, carouselData.recommended);
    }
}

/**
 * Render business items in a carousel
 * @param {HTMLElement} container - The container element
 * @param {Array} items - The items data
 */
function renderBusinessItems(container, items) {
    container.innerHTML = ''; // Clear existing items
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('business-item');
        itemElement.dataset.id = item.id;
        itemElement.setAttribute('aria-label', item.name);
        
        // Use the image directly (no longer an array)
        const imageUrl = item.image || 'images/placeholder.jpg';
        
        itemElement.innerHTML = `
            <div class="business-image" style="background-image: url('${imageUrl}')">
                <div class="business-name">${item.name}</div>
            </div>
        `;
        
        container.appendChild(itemElement);
    });
}

/**
 * Set up carousel navigation and item click event listeners
 */
function setupEventListeners() {
    // Add click events to carousel items
    document.querySelectorAll('.business-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = this.dataset.id;
            const type = getPageType(); // 'activities', 'establishments', or 'trails'
            navigateToDetail(type.slice(0, -1), id); // Remove 's' from type (e.g., 'activities' -> 'activity')
        });
    });
    
    // Set up carousel navigation buttons
    const carouselNavs = [
        { prevBtn: '.nearby-prev', nextBtn: '.nearby-next', carousel: '.nearby-carousel' },
        { prevBtn: '.recommendations-prev', nextBtn: '.recommendations-next', carousel: '.recommendations-carousel' }
    ];
    
    carouselNavs.forEach(nav => {
        const prevBtn = document.querySelector(nav.prevBtn);
        const nextBtn = document.querySelector(nav.nextBtn);
        const carousel = document.querySelector(nav.carousel);
        
        if (prevBtn && nextBtn && carousel) {
            prevBtn.addEventListener('click', () => navigateCarousel(carousel, 'prev'));
            nextBtn.addEventListener('click', () => navigateCarousel(carousel, 'next'));
            
            // Initialize scroll positions
            updateCarouselNavButtons(carousel, prevBtn, nextBtn);
            
            // Update buttons on carousel scroll
            carousel.addEventListener('scroll', () => {
                updateCarouselNavButtons(carousel, prevBtn, nextBtn);
            });
        }
    });
}

/**
 * Navigate the carousel in a specified direction
 * @param {HTMLElement} carousel - The carousel element
 * @param {string} direction - The direction to navigate ('prev' or 'next')
 */
function navigateCarousel(carousel, direction) {
    const scrollAmount = carousel.clientWidth * 0.8; // 80% of visible width
    const scrollPosition = direction === 'prev'
        ? carousel.scrollLeft - scrollAmount
        : carousel.scrollLeft + scrollAmount;
    
    carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
}

/**
 * Update carousel navigation buttons based on scroll position
 * @param {HTMLElement} carousel - The carousel element
 * @param {HTMLElement} prevBtn - The previous button
 * @param {HTMLElement} nextBtn - The next button
 */
function updateCarouselNavButtons(carousel, prevBtn, nextBtn) {
    // Enable/disable previous button based on scroll position
    if (carousel.scrollLeft <= 0) {
        prevBtn.classList.add('disabled');
        prevBtn.setAttribute('disabled', 'disabled');
    } else {
        prevBtn.classList.remove('disabled');
        prevBtn.removeAttribute('disabled');
    }
    
    // Enable/disable next button
    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5) {
        nextBtn.classList.add('disabled');
        nextBtn.setAttribute('disabled', 'disabled');
    } else {
        nextBtn.classList.remove('disabled');
        nextBtn.removeAttribute('disabled');
    }
}

/**
 * Get the current page type based on URL
 * @returns {string|null} The page type ('activities', 'establishments', 'trails') or null
 */
function getPageType() {
    const path = window.location.pathname;
    if (path.includes('/activities')) return 'activities';
    if (path.includes('/establishments')) return 'establishments';
    if (path.includes('/trails')) return 'trails';
    return null;
}

/**
 * Navigate to the detail page when clicking on a business item
 * @param {string} type - The type of business (activity, establishment, trail)
 * @param {string} id - The ID of the specific business
 */
function navigateToDetail(type, id) {
    // Fix for activities navigation - 'activity' instead of 'activitie'
    let urlPrefix = type;
    // Use consistent URL structure
    window.location.href = `/${type === 'activity' ? 'activities' : type + 's'}/${urlPrefix}/${id}`;
}
