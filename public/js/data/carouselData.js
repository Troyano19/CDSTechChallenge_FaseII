/**
 * Carousel data for all carousel components
 * This file contains sample data for use in carousels throughout the site
 */

// Example data for interest carousel
const interestItems = [
    {
        id: "interest1",
        image: "../../images/temp/temp1.jpeg",
        title: "Lugar de interés 1",
        description: "Descubre este increíble lugar en GreenLake Village"
    },
    {
        id: "interest2",
        image: "../../images/temp/temp2.jpeg",
        title: "Lugar de interés 2",
        description: "Descubre este increíble lugar en GreenLake Village"
    },
    {
        id: "interest3",
        image: "../../images/temp/temp3.jpeg",
        title: "Lugar de interés 3",
        description: "Descubre este increíble lugar en GreenLake Village"
    },
    {
        id: "interest4",
        image: "../../images/temp/temp4.jpeg",
        title: "Lugar de interés 4",
        description: "Descubre este increíble lugar en GreenLake Village"
    },
    {
        id: "interest5",
        image: "../../images/temp/temp1.jpeg",
        title: "Lugar de interés 5",
        description: "Descubre este increíble lugar en GreenLake Village"
    },
    {
        id: "interest6",
        image: "../../images/temp/temp2.jpeg",
        title: "Lugar de interés 6",
        description: "Descubre este increíble lugar en GreenLake Village"
    },
    {
        id: "interest7",
        image: "../../images/temp/temp3.jpeg",
        title: "Lugar de interés 7",
        description: "Descubre este increíble lugar en GreenLake Village"
    }
];

// Example data for activities carousels
const nearbyActivities = [
    {
        id: "1",
        image: "../../images/temp/temp1.jpeg",
        name: "Senderismo Guiado"
    },
    {
        id: "2",
        image: "../../images/temp/temp2.jpeg",
        name: "Paseo en Canoa"
    },
    {
        id: "3",
        image: "../../images/temp/temp3.jpeg",
        name: "Tour en Bicicleta"
    },
    {
        id: "4",
        image: "../../images/temp/temp4.jpeg",
        name: "Observación de Aves"
    }
];

const recommendedActivities = [
    {
        id: "5",
        image: "../../images/temp/temp3.jpeg",
        name: "Escalada en Roca"
    },
    {
        id: "6",
        image: "../../images/temp/temp1.jpeg",
        name: "Camping Estelar"
    },
    {
        id: "7",
        image: "../../images/temp/temp4.jpeg",
        name: "Paseos a Caballo"
    },
    {
        id: "8",
        image: "../../images/temp/temp2.jpeg",
        name: "Clases de Yoga al Aire Libre"
    }
];

// Example data for establishments carousels
const nearbyEstablishments = [
    {
        id: "1",
        image: "../../images/temp/temp1.jpeg",
        name: "Restaurante El Lago"
    },
    {
        id: "2",
        image: "../../images/temp/temp2.jpeg",
        name: "Hotel Vista Verde"
    },
    {
        id: "3",
        image: "../../images/temp/temp3.jpeg",
        name: "Tienda Local Artesanía"
    },
    {
        id: "4",
        image: "../../images/temp/temp4.jpeg",
        name: "Cafetería Montaña"
    }
];

const recommendedEstablishments = [
    {
        id: "5",
        image: "../../images/temp/temp3.jpeg",
        name: "Restaurante Tradicional"
    },
    {
        id: "6",
        image: "../../images/temp/temp1.jpeg",
        name: "Albergue Rural"
    },
    {
        id: "7",
        image: "../../images/temp/temp4.jpeg",
        name: "Tienda de Productos Locales"
    },
    {
        id: "8",
        image: "../../images/temp/temp2.jpeg",
        name: "Casa Rural"
    }
];

// Example data for trails carousels
const nearbyTrails = [
    {
        id: "1",
        image: "../../images/temp/temp1.jpeg",
        name: "Sendero del Lago"
    },
    {
        id: "2",
        image: "../../images/temp/temp2.jpeg",
        name: "Ruta de las Cascadas"
    },
    {
        id: "3",
        image: "../../images/temp/temp3.jpeg",
        name: "Camino del Mirador"
    },
    {
        id: "4",
        image: "../../images/temp/temp4.jpeg",
        name: "Ruta de Montaña"
    }
];

const recommendedTrails = [
    {
        id: "5",
        image: "../../images/temp/temp3.jpeg",
        name: "Sendero del Bosque"
    },
    {
        id: "6",
        image: "../../images/temp/temp1.jpeg",
        name: "Ruta Panorámica"
    },
    {
        id: "7",
        image: "../../images/temp/temp4.jpeg",
        name: "Camino de las Aves"
    },
    {
        id: "8",
        image: "../../images/temp/temp2.jpeg",
        name: "Ruta del Valle"
    }
];

// Export data through window object
window.CarouselData = {
    interests: interestItems,
    activities: {
        nearby: nearbyActivities,
        recommended: recommendedActivities
    },
    establishments: {
        nearby: nearbyEstablishments,
        recommended: recommendedEstablishments
    },
    trails: {
        nearby: nearbyTrails,
        recommended: recommendedTrails
    }
};
