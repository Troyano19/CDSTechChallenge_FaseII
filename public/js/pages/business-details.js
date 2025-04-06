/**
 * Business Details Page
 * 
 * This script handles the functionality for business detail pages including:
 * - Loading business data based on ID
 * - Image carousel
 * - Reviews display
 * - Map integration
 */

// Initialize page loader before DOM content is loaded
if (window.PageLoader) {
    window.PageLoader.initPageLoader();
}

// Global variables
let businessId;
let businessType;
let businessData;
let currentSlide = 0;
let map;

document.addEventListener('DOMContentLoaded', function() {
    // Get business type and ID from URL
    const urlPath = window.location.pathname;
    parseUrlForBusinessInfo(urlPath);
    
    // If we have valid business info, load the data
    if (businessId && businessType) {
        loadBusinessData();
    } else {
        showErrorMessage('Invalid business information in URL');
    }
});

/**
 * Parse the URL to extract business type and ID
 * @param {string} url - The current URL path
 */
function parseUrlForBusinessInfo(url) {
    // Extract business type and ID from URL patterns like:
    // /establishments/establishment/1
    // /activitys/activity/2
    // /trails/trail/3
    const pathSegments = url.split('/').filter(segment => segment);
    
    if (pathSegments.length >= 3) {
        if (pathSegments[0] === 'establishments' && pathSegments[1] === 'establishment') {
            businessType = 'establishment';
            businessId = pathSegments[2];
        } else if (pathSegments[0] === 'activitys' && pathSegments[1] === 'activity') {
            businessType = 'activity';
            businessId = pathSegments[2];
        } else if (pathSegments[0] === 'trails' && pathSegments[1] === 'trail') {
            businessType = 'trail';
            businessId = pathSegments[2];
        }
    }
}

/**
 * Load business data from the server or mock data
 */
function loadBusinessData() {
    // For this implementation, we'll use mock data
    // In a real implementation, this would be an API call to fetch the data
    
    // Different mock data based on business type
    switch(businessType) {
        case 'establishment':
            fetchEstablishmentData();
            break;
        case 'activity':
            fetchActivityData();
            break;
        case 'trail':
            fetchTrailData();
            break;
        default:
            showErrorMessage('Unknown business type');
    }
}

/**
 * Fetch establishment data
 * In a real implementation, this would be an API call
 */
function fetchEstablishmentData() {
    // Mock data for demo purposes
    setTimeout(() => {
        const data = {
            id: businessId,
            name: "Hotel Ecológico 'GreenLake Platinum Heritage'",
            type: "Hotel",
            description: "Un hotel de diseño moderno y sostenible, construido con materiales de bajo impacto ambiental y rodeado de jardines nativos. Cuenta con paneles solares en el techo, grandes ventanales que maximizan la luz natural y cargadores para vehículos eléctricos. El ambiente transmite tranquilidad y conexión con la naturaleza.",
            images: [
                "../../images/temp/establishment-temp2.jpeg",
                "../../images/temp/establishment-temp1.jpeg",
                "../../images/temp/establishment-temp3.jpeg",
                "../../images/temp/establishment-temp4.jpeg"
            ],
            hours: {
                monday: [{ open: "08:00", close: "20:00" }],
                tuesday: [{ open: "08:00", close: "20:00" }],
                wednesday: [{ open: "08:00", close: "20:00" }],
                thursday: [{ open: "08:00", close: "20:00" }],
                friday: [{ open: "08:00", close: "22:00" }],
                saturday: [{ open: "09:00", close: "22:00" }],
                sunday: [{ open: "09:00", close: "18:00" }]
            },
            location: [40.416775, -3.703790], // Madrid coordinates for demo
            reviews: [
                {
                    user: {
                        name: "María García",
                        image: "../../images/temp/profile-1.jpg"
                    },
                    rating: 4.5,
                    content: "Excelente establecimiento con una filosofía sostenible muy marcada. Las habitaciones son amplias y el personal muy atento."
                },
                {
                    user: {
                        name: "Carlos López",
                        image: "../../images/temp/profile-2.jpg"
                    },
                    rating: 5,
                    content: "Sin duda el mejor hotel ecológico que he visitado. La comida del restaurante es exquisita y todo orgánico."
                },
                {
                    user: {
                        name: "Laura Martínez",
                        image: "../../images/temp/profile-3.jpg"
                    },
                    rating: 4,
                    content: "Muy buena experiencia, aunque el precio es algo elevado. El jardín es precioso y las habitaciones muy confortables."
                }
            ]
        };
        
        businessData = data;
        renderBusinessData();
    }, 500);
}

/**
 * Fetch activity data
 * In a real implementation, this would be an API call
 */
function fetchActivityData() {
    // Mock data for demo purposes
    setTimeout(() => {
        const data = {
            id: businessId,
            name: "Centro de Actividades Acuáticas Sostenibles",
            type: "Aire libre",
            description: "Un centro ubicado a orillas del lago que ofrece alquiler de kayaks, paddleboards y pequeñas embarcaciones eléctricas. El edificio está integrado con el entorno natural y promueve el disfrute responsable del lago. Todos nuestros equipos están fabricados con materiales sostenibles y ofrecemos guías especializados.",
            images: [
                "../../images/temp/activity-temp2.jpeg",
                "../../images/temp/activity-temp1.jpeg",
                "../../images/temp/activity-temp3.jpeg",
                "../../images/temp/activity-temp4.jpeg"
            ],
            schedule: {
                monday: [{ open: "10:00", close: "18:00" }],
                tuesday: [{ open: "10:00", close: "18:00" }],
                wednesday: [{ open: "10:00", close: "18:00" }],
                thursday: [{ open: "10:00", close: "18:00" }],
                friday: [{ open: "10:00", close: "19:00" }],
                saturday: [{ open: "09:00", close: "20:00" }],
                sunday: [{ open: "09:00", close: "19:00" }]
            },
            location: [40.446775, -3.723790], // Near Madrid for demo
            reviews: [
                {
                    user: {
                        name: "Pablo Sánchez",
                        image: "../../images/temp/profile-4.jpg"
                    },
                    rating: 5,
                    content: "Pasamos un día increíble en kayak. El personal es muy profesional y el equipo está en perfectas condiciones."
                },
                {
                    user: {
                        name: "Ana Rodríguez",
                        image: "../../images/temp/profile-5.jpg"
                    },
                    rating: 4.5,
                    content: "Alquilamos paddleboards y la experiencia fue genial. El lago es precioso y el agua cristalina."
                },
                {
                    user: {
                        name: "Miguel Torres",
                        image: "../../images/temp/profile-6.jpg"
                    },
                    rating: 4,
                    content: "Buena actividad familiar. Los precios son razonables y ofrecen descuentos para grupos."
                }
            ]
        };
        
        businessData = data;
        renderBusinessData();
    }, 500);
}

/**
 * Fetch trail data
 * In a real implementation, this would be an API call
 */
function fetchTrailData() {
    // Mock data for demo purposes
    setTimeout(() => {
        const data = {
            id: businessId,
            name: "Ruta de Senderismo 'Ezmeral Valley'",
            difficulty: "Medium",
            tags: ["Mountain", "Forest", "walk"],
            description: "Un pintoresco sendero bien mantenido que serpentea a través de un bosque exuberante cerca de la ciudad. Cuenta con señales informativas sobre la flora y fauna local, bancos hechos con materiales reciclados para descansar y ofrece vistas panorámicas del lago y la ciudad.",
            images: [
                "../../images/temp/trails-temp1.jpeg",
                "../../images/temp/trails-temp2.jpeg",
                "../../images/temp/trails-temp3.jpeg",
                "../../images/temp/trails-temp4.jpeg"
            ],
            trailInfo: {
                distance: "8.5 km",
                duration: "3 horas",
                elevation: "350 metros"
            },
            location: {
                start: [40.416775, -3.703790], // Start in Madrid for demo
                end: [40.426775, -3.713790]    // End near Madrid for demo
            },
            reviews: [
                {
                    user: {
                        name: "David Ferrer",
                        image: "../../images/temp/profile-7.jpg"
                    },
                    rating: 4.5,
                    content: "Ruta preciosa con paisajes impresionantes. Moderadamente exigente pero vale la pena por las vistas."
                },
                {
                    user: {
                        name: "Elena Castro",
                        image: "../../images/temp/profile-8.jpg"
                    },
                    rating: 5,
                    content: "Mi ruta favorita en la zona. Muy bien señalizada y con zonas de descanso estratégicamente ubicadas."
                },
                {
                    user: {
                        name: "Javier Ruiz",
                        image: "../../images/temp/profile-9.jpg"
                    },
                    rating: 4,
                    content: "Buena ruta para hacer en familia. La hice con niños de 10 años y pudieron completarla sin problemas."
                }
            ]
        };
        
        businessData = data;
        renderBusinessData();
    }, 500);
}

/**
 * Render business data in the page
 */
function renderBusinessData() {
    if (!businessData) return;
    
    // Update page title
    document.title = `GreenLake Village - ${businessData.name}`;
    
    // Basic info
    document.getElementById('businessName').textContent = businessData.name;
    document.getElementById('businessDescription').textContent = businessData.description;
    
    // Type or difficulty based on business type
    if (businessType === 'trail') {
        document.getElementById('businessDifficulty').textContent = businessData.difficulty;
        
        // Render trail tags
        const tagsContainer = document.getElementById('businessTags');
        tagsContainer.innerHTML = '';
        businessData.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'business-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        // Trail specific info
        document.getElementById('trailDistance').textContent = businessData.trailInfo.distance;
        document.getElementById('trailDuration').textContent = businessData.trailInfo.duration;
        document.getElementById('trailElevation').textContent = businessData.trailInfo.elevation;
    } else {
        const typeDisplay = businessType === 'activity' ? businessData.type : businessData.type;
        document.getElementById('businessType').textContent = typeDisplay;
        
        // Render business hours
        const hoursContainer = document.getElementById('businessHours');
        hoursContainer.innerHTML = '';
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayTranslations = {
            'monday': 'Lunes',
            'tuesday': 'Martes',
            'wednesday': 'Miércoles',
            'thursday': 'Jueves',
            'friday': 'Viernes',
            'saturday': 'Sábado',
            'sunday': 'Domingo'
        };
        
        days.forEach(day => {
            const dayHours = businessType === 'activity' ? businessData.schedule[day] : businessData.hours[day];
            if (dayHours && dayHours.length > 0) {
                const timeRanges = dayHours.map(hours => `${hours.open} - ${hours.close}`).join(', ');
                
                const dayElement = document.createElement('div');
                dayElement.className = 'day-hours';
                dayElement.innerHTML = `
                    <span class="day-name">${dayTranslations[day]}</span>
                    <span class="day-time">${timeRanges}</span>
                `;
                hoursContainer.appendChild(dayElement);
            }
        });
    }
    
    // Render reviews
    renderReviews();
    
    // Render image carousel
    renderImageCarousel();
    
    // Initialize map
    initMap();
}

/**
 * Render the image carousel
 */
function renderImageCarousel() {
    const carouselContainer = document.getElementById('businessImagesCarousel');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    // Clear existing content
    carouselContainer.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    // Add each image to carousel
    businessData.images.forEach((image, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url('${image}')`;
        carouselContainer.appendChild(slide);
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.setAttribute('data-index', index);
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    // Set up carousel controls
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

/**
 * Navigate to previous slide
 */
function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

/**
 * Navigate to next slide
 */
function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

/**
 * Go to a specific slide
 * @param {number} index - The slide index to go to
 */
function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

/**
 * Render business reviews
 */
function renderReviews() {
    const reviewsContainer = document.getElementById('reviewsList');
    reviewsContainer.innerHTML = '';
    
    // Calculate overall rating
    const totalReviews = businessData.reviews.length;
    
    if (totalReviews > 0) {
        const overallRating = businessData.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        
        // Update overall rating display
        document.getElementById('overallRatingNumber').textContent = `(${overallRating.toFixed(1)})`;
        
        const reviewsText = window.Translations?.[window.currentLanguage]?.business?.details?.reviews || 'reviews';
        document.getElementById('totalReviews').textContent = `${totalReviews} ${reviewsText}`;
        document.getElementById('overallRatingStars').innerHTML = generateStars(overallRating);
        
        // Add each review
        businessData.reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <img src="${review.user.image}" alt="${review.user.name}" class="review-user-img">
                    <span class="review-user-name">${review.user.name}</span>
                    <div class="review-rating">
                        <div class="review-rating-stars">${generateStars(review.rating)}</div>
                        <span class="review-rating-number">${review.rating.toFixed(1)}</span>
                    </div>
                </div>
                <div class="review-content">${review.content}</div>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    } else {
        // No reviews case
        const noReviewsText = window.Translations?.[window.currentLanguage]?.business?.details?.noReviews || 'No reviews available';
        reviewsContainer.innerHTML = `<div class="no-reviews">${noReviewsText}</div>`;
        document.getElementById('overallRatingNumber').textContent = '(0.0)';
        document.getElementById('totalReviews').textContent = '0 reviews';
        document.getElementById('overallRatingStars').innerHTML = generateStars(0);
    }
}

/**
 * Generate HTML for star rating
 * @param {number} rating - The rating (out of 5)
 * @returns {string} HTML for stars
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full" aria-hidden="true"></span>';
    }
    
    // Half star
    if (halfStar) {
        starsHTML += '<span class="star half" aria-hidden="true"></span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty" aria-hidden="true"></span>';
    }
    
    return starsHTML;
}

/**
 * Initialize Google Maps
 */
function initMap() {
    // Check if Google Maps API is loaded and we have business data
    if (window.google && businessData) {
        let mapOptions;
        
        if (businessType === 'trail') {
            // For trails, we create a polyline between start and end points
            const startLocation = { lat: businessData.location.start[0], lng: businessData.location.start[1] };
            
            mapOptions = {
                center: startLocation,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };
            
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            
            // Create path between start and end points
            const trailPath = [
                startLocation,
                { lat: businessData.location.end[0], lng: businessData.location.end[1] }
            ];
            
            const trailLine = new google.maps.Polyline({
                path: trailPath,
                strokeColor: '#4CAF50',
                strokeOpacity: 1.0,
                strokeWeight: 4
            });
            
            trailLine.setMap(map);
            
            // Add markers for start and end points
            new google.maps.Marker({
                position: trailPath[0],
                map: map,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    labelOrigin: new google.maps.Point(15, -10)
                },
                label: { text: 'Inicio', color: '#4CAF50' }
            });
            
            new google.maps.Marker({
                position: trailPath[1],
                map: map,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    labelOrigin: new google.maps.Point(15, -10)
                },
                label: { text: 'Fin', color: '#F44336' }
            });
            
        } else {
            // For establishments and activities, we just place a marker
            const location = { lat: businessData.location[0], lng: businessData.location[1] };
            
            mapOptions = {
                center: location,
                zoom: 15
            };
            
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            
            // Add marker for the business
            new google.maps.Marker({
                position: location,
                map: map,
                title: businessData.name
            });
        }
    }
}

/**
 * Show error message
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
    const container = document.querySelector('.container');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    container.innerHTML = '';
    container.appendChild(errorElement);
    
    console.error(message);
}

/**
 * Script for business detail pages
 * Responsible for loading and displaying business information
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initBusinessDetail();
});

/**
 * Initialize the business detail page
 */
function initBusinessDetail() {
    // Get the business type and ID from the URL
    const urlPath = window.location.pathname;
    const pathParts = urlPath.split('/').filter(part => part !== '');
    
    if (pathParts.length < 3) return;
    
    const businessType = pathParts[0]; // 'activities', 'trails', 'establishments'
    const subType = pathParts[1];      // 'activity', 'trail', 'establishment'
    const businessId = pathParts[2];   // The ID or slug
    
    // For now, we'll simulate loading data from an API
    loadBusinessData(businessType, businessId);
}

/**
 * Load business data from API (simulated for now)
 * @param {string} businessType - The business category
 * @param {string} businessId - The business ID
 */
function loadBusinessData(businessType, businessId) {
    // Find the business in our CarouselData
    let businessData = null;
    
    // Find in nearby array
    if (window.CarouselData && window.CarouselData[businessType]) {
        const nearbyItems = window.CarouselData[businessType].nearby;
        const recommendedItems = window.CarouselData[businessType].recommended;
        
        businessData = nearbyItems.find(item => item.id === businessId) || 
                       recommendedItems.find(item => item.id === businessId);
    }
    
    // If we found the business data, display it
    if (businessData) {
        displayBusinessData(businessData, businessType);
    } else {
        // If not found, display a generic message
        displayGenericData(businessId, businessType);
    }
}

/**
 * Display business data on the page
 * @param {Object} data - The business data
 * @param {string} businessType - The business category
 */
function displayBusinessData(data, businessType) {
    // Display basic business information
    document.getElementById('businessName').textContent = data.name;
    
    // For trails, we'll add difficulty
    if (businessType === 'trails') {
        const difficultyElem = document.getElementById('businessDifficulty');
        if (difficultyElem) {
            difficultyElem.textContent = 'Dificultad: Media'; // Placeholder
        }
        
        // Add trail info
        document.getElementById('trailDistance').textContent = '5 km';
        document.getElementById('trailDuration').textContent = '2 horas';
        document.getElementById('trailElevation').textContent = '150 m';
    }
    
    // For establishments and activities, display type
    if (businessType === 'establishments' || businessType === 'activities') {
        const typeElem = document.getElementById('businessType');
        if (typeElem) {
            if (businessType === 'establishments') {
                typeElem.textContent = data.name.includes('Hotel') ? 'Hotel' : 
                                      data.name.includes('Tienda') ? 'Tienda' :
                                      data.name.includes('Cafetería') ? 'Restaurante/Bar' : 'Cultura';
            } else {
                typeElem.textContent = data.name.includes('Yoga') ? 'Relax' : 
                                      data.name.includes('Jardín') ? 'Aire libre' : 'Cultura';
            }
        }
    }
    
    // Add description
    document.getElementById('businessDescription').textContent = 
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis euismod, " +
        "aliquam nunc id, lacinia nisi. Fusce auctor, nisi eget ultricies ullamcorper, " +
        "mauris nunc consectetur leo, vitae lacinia nunc nisi eget magna.";
    
    // Load business hours for establishments and activities
    if (businessType === 'establishments' || businessType === 'activities') {
        const hoursContainer = document.getElementById('businessHours');
        if (hoursContainer) {
            const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const dayNames = {
                monday: 'Lunes',
                tuesday: 'Martes',
                wednesday: 'Miércoles',
                thursday: 'Jueves',
                friday: 'Viernes',
                saturday: 'Sábado',
                sunday: 'Domingo'
            };
            
            daysOfWeek.forEach(day => {
                const dayHours = document.createElement('div');
                dayHours.className = 'day-hours';
                dayHours.innerHTML = `
                    <span class="day-name">${dayNames[day]}</span>
                    <span class="day-time">${day === 'sunday' ? 'Cerrado' : '9:00 - 18:00'}</span>
                `;
                hoursContainer.appendChild(dayHours);
            });
        }
    }
    
    // Add ratings and reviews
    const overallRatingStars = document.getElementById('overallRatingStars');
    const overallRatingNumber = document.getElementById('overallRatingNumber');
    const totalReviews = document.getElementById('totalReviews');
    const reviewsList = document.getElementById('reviewsList');
    
    if (overallRatingStars && overallRatingNumber && totalReviews && reviewsList) {
        const rating = 4.2;
        overallRatingStars.innerHTML = generateStars(rating);
        overallRatingNumber.textContent = rating.toFixed(1);
        
        const numReviews = 24;
        const translationKey = window.currentLanguage === 'es' ? 'business.details.reviews' : 'business.details.reviews';
        const reviewsText = window.Translations[window.currentLanguage]?.business?.details?.reviews || 'reviews';
        totalReviews.textContent = `(${numReviews} ${reviewsText})`;
        
        // Add sample reviews
        const reviews = [
            { name: 'Isabel R.', rating: 5, comment: 'Excelente lugar, muy recomendable.' },
            { name: 'Carlos M.', rating: 4, comment: 'Muy bueno, aunque los precios son un poco altos.' },
            { name: 'Elena G.', rating: 4.5, comment: 'Me encantó la experiencia, volveré pronto.' }
        ];
        
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-header">
                    <div class="review-user-name">${review.name}</div>
                    <div class="review-rating">
                        <div class="review-rating-stars">${generateStars(review.rating)}</div>
                        <span class="review-rating-number">${review.rating.toFixed(1)}</span>
                    </div>
                </div>
                <div class="review-content">${review.comment}</div>
            `;
            reviewsList.appendChild(reviewItem);
        });
    }
    
    // Add image(s) to carousel
    const carouselSlides = document.getElementById('businessImagesCarousel');
    if (carouselSlides) {
        // Create a single slide with the image
        const slide = document.createElement('div');
        slide.className = 'carousel-slide active';
        slide.style.backgroundImage = `url('${data.image}')`;
        carouselSlides.appendChild(slide);
        
        // Add an indicator
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        if (indicatorsContainer) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator active';
            indicator.dataset.index = 0;
            indicatorsContainer.appendChild(indicator);
        }
    }
}

/**
 * Display generic data when specific business data is not found
 * @param {string} businessId - The business ID
 * @param {string} businessType - The business category
 */
function displayGenericData(businessId, businessType) {
    document.getElementById('businessName').textContent = 
        businessId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // ...rest of the function remains the same...
}

/**
 * Generate HTML for star rating
 * @param {number} rating - The rating (out of 5)
 * @returns {string} HTML for stars
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full" aria-hidden="true"></span>';
    }
    
    // Half star
    if (halfStar) {
        starsHTML += '<span class="star half" aria-hidden="true"></span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty" aria-hidden="true"></span>';
    }
    
    return starsHTML;
}
