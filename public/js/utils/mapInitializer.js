/**
 * Initialize the Google Maps for business detail pages
 */
function initMap() {
    // Default center location for GreenLake Village
    const defaultCenter = { lat: 40.416775, lng: -3.703790 }; // Default location (Madrid)
    
    // Get the map container element
    const mapElement = document.getElementById('map');
    
    // If no map container on this page, exit the function
    if (!mapElement) return;
    
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
}

// If the page loads after the Google Maps API, initialize the map immediately
if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
    initMap();
}
