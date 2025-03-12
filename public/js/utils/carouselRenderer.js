/**
 * Carousel rendering functions
 * This file contains functions for rendering items into carousels
 */

/**
 * Render interest cards into a container
 * @param {string} containerSelector - CSS selector for the container
 * @param {Array} items - Array of interest items to render
 */
function renderInterestCards(containerSelector, items) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add each card to the container
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'interest-card';
        card.dataset.id = item.id;
        
        card.innerHTML = `
            <div class="interest-image" style="background-image: url('${item.image}')"></div>
            <div class="interest-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        container.appendChild(card);
    });
}

/**
 * Render business items into a carousel
 * @param {string} containerSelector - CSS selector for the container
 * @param {Array} items - Array of items to render
 * @param {string} type - Type of business (activity, establishment, trail)
 */
function renderBusinessItems(containerSelector, items, type) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add each item to the container
    items.forEach(item => {
        const businessItem = document.createElement('div');
        businessItem.className = 'business-item';
        businessItem.setAttribute('onclick', `navigateToDetail('${type}', '${item.id}')`);
        
        businessItem.innerHTML = `
            <div class="business-image" style="background-image: url('${item.image}')">
                <div class="business-name">${item.name}</div>
            </div>
        `;
        
        container.appendChild(businessItem);
    });
}

// Export rendering functions
window.CarouselRenderer = {
    renderInterestCards,
    renderBusinessItems
};
