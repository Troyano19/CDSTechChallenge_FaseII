/**
 * Admin page JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initAdminPage();
});

/**
 * Initialize the admin page
 */
function initAdminPage() {
    // Set up image upload functionality
    initImageUploads();
    
    // Set up business hours management
    initHoursManagement();
    
    // Set up map functionality (will be fully initialized when Google Maps API loads)
    window.initMap = initMap;
    
    // Set up form submission handler
    initFormSubmission();
    
    // Load business data
    loadBusinessData();
}

/**
 * Initialize image upload functionality
 */
function initImageUploads() {
    // Banner image upload
    const bannerUploadBtn = document.getElementById('bannerUploadBtn');
    const bannerUpload = document.getElementById('bannerUpload');
    const currentBanner = document.getElementById('currentBanner');
    
    if (bannerUploadBtn && bannerUpload) {
        bannerUploadBtn.addEventListener('click', function() {
            bannerUpload.click();
        });
        
        bannerUpload.addEventListener('change', function(event) {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    currentBanner.src = e.target.result;
                };
                
                reader.readAsDataURL(event.target.files[0]);
            }
        });
    }
    
    // Gallery image upload
    const addGalleryImage = document.getElementById('addGalleryImage');
    const galleryUpload = document.getElementById('galleryUpload');
    const galleryPreview = document.getElementById('galleryPreview');
    
    if (addGalleryImage && galleryUpload && galleryPreview) {
        addGalleryImage.addEventListener('click', function() {
            galleryUpload.click();
        });
        
        galleryUpload.addEventListener('change', function(event) {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Create new gallery item
                    const newIndex = document.querySelectorAll('.gallery-item:not(.add-image-item)').length;
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = `Gallery Image ${newIndex + 1}`;
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-image';
                    removeBtn.setAttribute('data-index', newIndex);
                    removeBtn.textContent = '×';
                    removeBtn.addEventListener('click', removeGalleryImage);
                    
                    galleryItem.appendChild(img);
                    galleryItem.appendChild(removeBtn);
                    
                    // Insert before the 'add' button
                    const addItem = document.querySelector('.add-image-item');
                    galleryPreview.insertBefore(galleryItem, addItem);
                };
                
                reader.readAsDataURL(event.target.files[0]);
            }
        });
        
        // Set up existing remove buttons
        const removeButtons = document.querySelectorAll('.remove-image');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeGalleryImage);
        });
    }
}

/**
 * Remove a gallery image
 */
function removeGalleryImage(event) {
    const button = event.target;
    const galleryItem = button.closest('.gallery-item');
    
    if (galleryItem) {
        galleryItem.remove();
    }
}

/**
 * Initialize hours management functionality
 */
function initHoursManagement() {
    const addButtons = document.querySelectorAll('.add-time-slot');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            const hoursInputs = this.closest('.day-row').querySelector('.hours-inputs');
            const timeSlots = hoursInputs.querySelectorAll('.time-slot');
            const newIndex = timeSlots.length;
            
            // Create a new time slot
            const newTimeSlot = document.createElement('div');
            newTimeSlot.className = 'time-slot';
            
            const timeInputs = document.createElement('div');
            timeInputs.className = 'time-inputs';
            
            const openInput = document.createElement('input');
            openInput.type = 'time';
            openInput.name = `${day}-open-${newIndex}`;
            openInput.id = `${day}-open-${newIndex}`;
            openInput.className = 'time-input';
            
            const separator = document.createElement('span');
            separator.className = 'time-separator';
            separator.textContent = '-';
            
            const closeInput = document.createElement('input');
            closeInput.type = 'time';
            closeInput.name = `${day}-close-${newIndex}`;
            closeInput.id = `${day}-close-${newIndex}`;
            closeInput.className = 'time-input';
            
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'remove-time-slot';
            removeButton.textContent = '×';
            removeButton.addEventListener('click', function() {
                newTimeSlot.remove();
            });
            
            timeInputs.appendChild(openInput);
            timeInputs.appendChild(separator);
            timeInputs.appendChild(closeInput);
            
            newTimeSlot.appendChild(timeInputs);
            newTimeSlot.appendChild(removeButton);
            
            hoursInputs.appendChild(newTimeSlot);
        });
    });
}

/**
 * Initialize Google Maps
 */
function initMap() {
    // Default location (center of GreenLake Village)
    const defaultLocation = { lat: 40.416775, lng: -3.703790 };
    
    // Create map
    const map = new google.maps.Map(document.getElementById('businessMap'), {
        center: defaultLocation,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });
    
    // Add marker
    let marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
        title: 'Ubicación del negocio'
    });
    
    // Handle marker drag events
    marker.addListener('dragend', function() {
        const position = marker.getPosition();
        updateLocationCoordinates(position.lat(), position.lng());
    });
    
    // Handle map click events
    map.addListener('click', function(event) {
        marker.setPosition(event.latLng);
        updateLocationCoordinates(event.latLng.lat(), event.latLng.lng());
    });
    
    // Update location button
    const updateLocationBtn = document.getElementById('updateLocationBtn');
    if (updateLocationBtn) {
        updateLocationBtn.addEventListener('click', function() {
            // Try to get user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        
                        // Update map and marker
                        map.setCenter(userLocation);
                        marker.setPosition(userLocation);
                        updateLocationCoordinates(userLocation.lat, userLocation.lng);
                    },
                    function() {
                        alert('No se pudo obtener tu ubicación actual.');
                    }
                );
            } else {
                alert('Tu navegador no soporta geolocalización.');
            }
        });
    }
    
    // Store map and marker in global scope for later access
    window.businessMap = map;
    window.businessMarker = marker;
}

/**
 * Update location coordinates (store them in hidden inputs)
 */
function updateLocationCoordinates(lat, lng) {
    // You could store these in hidden form fields or directly in a variable
    window.businessLocation = [lat, lng];
}

/**
 * Initialize form submission handler
 */
function initFormSubmission() {
    const saveBtn = document.getElementById('saveChangesBtn');
    const saveStatus = document.getElementById('saveStatus');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', async function() {
            // Disable button during submission
            saveBtn.disabled = true;
            saveBtn.textContent = 'Guardando...';
            
            try {
                // Collect all the data from various forms
                const businessData = collectBusinessData();
                
                // Send data to server
                const response = await saveBusinessData(businessData);
                
                // Show success message
                saveStatus.textContent = 'Cambios guardados correctamente';
                saveStatus.className = 'save-status success';
                
                // Re-enable button
                saveBtn.disabled = false;
                saveBtn.textContent = 'Guardar cambios';
                
                // Clear success message after a while
                setTimeout(() => {
                    saveStatus.textContent = '';
                    saveStatus.className = 'save-status';
                }, 3000);
            } catch (error) {
                console.error('Error saving business data:', error);
                
                // Show error message
                saveStatus.textContent = 'Error al guardar los cambios: ' + error.message;
                saveStatus.className = 'save-status error';
                
                // Re-enable button
                saveBtn.disabled = false;
                saveBtn.textContent = 'Guardar cambios';
            }
        });
    }
}

/**
 * Collect business data from all forms
 */
function collectBusinessData() {
    // Business info
    const businessName = document.getElementById('businessName').value;
    const businessType = document.getElementById('businessType').value;
    const businessDescription = document.getElementById('businessDescription').value;
    
    // Hours
    const hours = collectBusinessHours();
    
    // Location
    const location = window.businessLocation || [40.416775, -3.703790]; // Default location if none set
    
    // Images (would normally upload these to server and get URLs back)
    // For demo purposes, we'll just use the ones already on the page
    const bannerImage = document.getElementById('currentBanner').src;
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item:not(.add-image-item) img')).map(img => img.src);
    
    return {
        name: businessName,
        type: businessType,
        description: businessDescription,
        open_hours: hours,
        location: location,
        images: {
            banner: bannerImage,
            gallery: galleryImages
        }
    };
}

/**
 * Collect business hours from the form
 */
function collectBusinessHours() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hours = {};
    
    days.forEach(day => {
        hours[day] = [];
        
        // Find all time slots for this day
        const dayRow = document.querySelector(`.day-row:has(.day-name[data-translate="days.${day}"])`);
        if (dayRow) {
            const timeSlots = dayRow.querySelectorAll('.time-slot');
            
            timeSlots.forEach((slot, index) => {
                const openInput = document.getElementById(`${day}-open-${index}`);
                const closeInput = document.getElementById(`${day}-close-${index}`);
                
                if (openInput && closeInput && openInput.value && closeInput.value) {
                    hours[day].push({
                        open: openInput.value,
                        close: closeInput.value
                    });
                }
            });
        }
    });
    
    return hours;
}

/**
 * Save business data to server
 */
async function saveBusinessData(businessData) {
    try {
        const response = await fetch('/api/business', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(businessData),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al guardar los datos del negocio');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving business data:', error);
        throw error;
    }
}

/**
 * Load business data from server
 */
async function loadBusinessData() {
    try {
        const response = await fetch('/api/business', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            // If not found, may be a new business
            if (response.status === 404) {
                console.log('No business data found. Starting fresh.');
                return;
            }
            
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al cargar los datos del negocio');
        }
        
        const businessData = await response.json();
        
        // Populate forms with business data
        populateBusinessData(businessData);
    } catch (error) {
        console.error('Error loading business data:', error);
        // Show error message or handle accordingly
    }
}

/**
 * Populate forms with business data
 */
function populateBusinessData(data) {
    // Business info
    document.getElementById('businessName').value = data.name || '';
    document.getElementById('businessType').value = data.type || 'Hotel';
    document.getElementById('businessDescription').value = data.description || '';
    
    // Update map marker if location exists
    if (data.location && data.location.length === 2 && window.businessMap && window.businessMarker) {
        const location = { lat: data.location[0], lng: data.location[1] };
        window.businessMap.setCenter(location);
        window.businessMarker.setPosition(location);
        window.businessLocation = data.location;
    }
    
    // Update business hours
    if (data.open_hours) {
        populateBusinessHours(data.open_hours);
    }
    
    // Update images
    if (data.images) {
        if (data.images.banner) {
            document.getElementById('currentBanner').src = data.images.banner;
        }
        
        if (data.images.gallery && data.images.gallery.length > 0) {
            populateGalleryImages(data.images.gallery);
        }
    }
}

/**
 * Populate business hours
 */
function populateBusinessHours(hoursData) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const dayHours = hoursData[day];
        if (dayHours && dayHours.length > 0) {
            // First hour slot already exists in the form
            const firstOpenInput = document.getElementById(`${day}-open-0`);
            const firstCloseInput = document.getElementById(`${day}-close-0`);
            
            if (firstOpenInput && firstCloseInput) {
                firstOpenInput.value = dayHours[0].open;
                firstCloseInput.value = dayHours[0].close;
            }
            
            // Add additional hour slots if needed
            if (dayHours.length > 1) {
                const addButton = document.querySelector(`.add-time-slot[data-day="${day}"]`);
                const hoursInputs = addButton.closest('.day-row').querySelector('.hours-inputs');
                
                // Add additional time slots
                for (let i = 1; i < dayHours.length; i++) {
                    // Simulate a click on the add button
                    addButton.click();
                    
                    // Then populate the newly created inputs
                    const openInput = document.getElementById(`${day}-open-${i}`);
                    const closeInput = document.getElementById(`${day}-close-${i}`);
                    
                    if (openInput && closeInput) {
                        openInput.value = dayHours[i].open;
                        closeInput.value = dayHours[i].close;
                    }
                }
            }
        }
    });
}

/**
 * Populate gallery images
 */
function populateGalleryImages(galleryImages) {
    // Remove existing gallery items except the add button
    const galleryPreview = document.getElementById('galleryPreview');
    const existingItems = galleryPreview.querySelectorAll('.gallery-item:not(.add-image-item)');
    existingItems.forEach(item => item.remove());
    
    // Add new gallery items
    const addItem = document.querySelector('.add-image-item');
    
    galleryImages.forEach((imageUrl, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Gallery Image ${index + 1}`;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image';
        removeBtn.setAttribute('data-index', index);
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', removeGalleryImage);
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(removeBtn);
        
        // Insert before the 'add' button
        galleryPreview.insertBefore(galleryItem, addItem);
    });
}