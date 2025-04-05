/**
 * Initialize the Google Maps for business detail pages
 */
function initMap() {
    // Default center location for GreenLake Village
    const defaultCenter = { lat: 40.416775, lng: -3.703790 }; // Default location (Madrid)
    
    // Get the map container element
    const mapElement = document.getElementById('map');
    
    // If no map container on this page, insert iframe as fallback
    if (!mapElement) {
        // Find the business-location container to insert the iframe
        const locationContainer = document.querySelector('.business-location');
        if (locationContainer) {
            // Create a new div to hold the iframe
            const fallbackMapDiv = document.createElement('div');
            fallbackMapDiv.className = 'map-container';
            fallbackMapDiv.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39608.08195875661!2d-3.709559235081017!3d40.42615079567267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422604557d951d%3A0x53599fa83da7b4d8!2sHotel%20Claridge%20Madrid!5e1!3m2!1ses!2ses!4v1743885062583!5m2!1ses!2ses" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
            locationContainer.appendChild(fallbackMapDiv);
        }
        return;
    }
    
    try {
        // Create a new map instance
        const map = new google.maps.Map(mapElement, {
            center: defaultCenter,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            fullscreenControl: true,
            streetViewControl: true,
            zoomControl: true
        });
        
        // Try to get business location from data attributes or API
        // For now using business details API mock or page data
        let businessLocation = defaultCenter;
        
        // Check if we're on a trail page which might have a route
        const isTrailPage = document.querySelector('.business-difficulty-tag') !== null;
        
        if (isTrailPage) {
            // For trails, we might have a path to display
            // This is a simplified version, in a real app you'd fetch this from your API
            const dummyPath = [
                { lat: 40.416775, lng: -3.703790 },
                { lat: 40.417775, lng: -3.702790 },
                { lat: 40.418775, lng: -3.703290 },
                { lat: 40.419775, lng: -3.704790 }
            ];
            
            // Create a polyline for the trail
            const trailPath = new google.maps.Polyline({
                path: dummyPath,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            
            trailPath.setMap(map);
            
            // Center the map on the trail
            const bounds = new google.maps.LatLngBounds();
            dummyPath.forEach(point => bounds.extend(point));
            map.fitBounds(bounds);
            
            // Add markers for start and end points
            new google.maps.Marker({
                position: dummyPath[0],
                map: map,
                title: 'Inicio de la ruta',
                icon: {
                    url: '/images/icons/start-marker.png',
                    scaledSize: new google.maps.Size(30, 30)
                }
            });
            
            new google.maps.Marker({
                position: dummyPath[dummyPath.length - 1],
                map: map,
                title: 'Fin de la ruta',
                icon: {
                    url: '/images/icons/end-marker.png',
                    scaledSize: new google.maps.Size(30, 30)
                }
            });
        } else {
            // For regular establishments and activities, just add a marker
            new google.maps.Marker({
                position: businessLocation,
                map: map,
                title: document.getElementById('businessName')?.textContent || 'Ubicación'
            });
        }
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        
        // Replace the map container with an iframe as fallback
        if (mapElement) {
            mapElement.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39608.08195875661!2d-3.709559235081017!3d40.42615079567267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422604557d951d%3A0x53599fa83da7b4d8!2sHotel%20Claridge%20Madrid!5e1!3m2!1ses!2ses!4v1743885062583!5m2!1ses!2ses" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }
    }
}

// If the page loads after the Google Maps API, initialize the map immediately
if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
    initMap();
}
