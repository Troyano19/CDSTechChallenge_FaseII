/**
 * Toast notification utilities
 */

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast ('success', 'error', 'info', 'warning')
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 4000) {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Create message element
    const messageElement = document.createElement('span');
    messageElement.className = 'toast-message';
    messageElement.textContent = message;
    toast.appendChild(messageElement);
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });
    toast.appendChild(closeBtn);
    
    // Add toast to container
    container.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

/**
 * Remove a toast from the DOM with animation
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
    // Add event listener for animation end
    toast.addEventListener('animationend', function(e) {
        // Only remove when the toast-out animation ends
        if (e.animationName === 'toast-out') {
            toast.remove();
            
            // Remove container if empty
            const container = document.querySelector('.toast-container');
            if (container && !container.hasChildNodes()) {
                container.remove();
            }
        }
    });
    
    // Trigger the removal animation
    toast.style.animation = 'toast-out 0.3s forwards';
}

/**
 * Show a success toast
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showSuccessToast(message, duration = 4000) {
    showToast(message, 'success', duration);
}

/**
 * Show an error toast
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showErrorToast(message, duration = 4000) {
    showToast(message, 'error', duration);
}

/**
 * Show an info toast
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showInfoToast(message, duration = 4000) {
    showToast(message, 'info', duration);
}

/**
 * Show a warning toast
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showWarningToast(message, duration = 4000) {
    showToast(message, 'warning', duration);
}
