import * as activitiesApi from "../modules/rest-api/activityRestApi.mjs";
import * as establishmentsApi from "../modules/rest-api/bussinessRestApi.mjs";
import * as trailsApi from "../modules/rest-api/trailRestApi.mjs";

/**
 * Carousel data for all carousel components
 * This file contains sample data for use in carousels throughout the site
 */

// Example data for interest carousel

const allActivities = [];
const allEstablishments = [];
const allTrails = [];

const fetchAllActivities = async () => {
  try {
    const response = await activitiesApi.getAllActivities();
    if (response.status === 200) {
      const data = await response.json();
      allActivities.push(...data);
    } else {
      console.error("Error fetching activities:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};
const fetchAllEstablishments = async () => {
  try {
    const response = await establishmentsApi.getAllBussiness();
    if (response.status === 200) {
      const data = await response.json();
      allEstablishments.push(...data);
    } else {
      console.error("Error fetching establishments:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching establishments:", error);
  }
};
const fetchAllTrails = async () => {
  try {
    const response = await trailsApi.getAllTrails();
    if (response.status === 200) {
      const data = await response.json();
      allTrails.push(...data);
    } else {
      console.error("Error fetching trails:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching trails:", error);
  }
};
const getRandomElements = (arr, count) => {
  const shuffled = arr.slice(); // Copia el array
  let i = arr.length;
  while (i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

const interestItems = [
  {
    id: "interest1",
    image: "/images/temp/trails-temp1.jpeg",
    title: "Ruta de Senderismo 'Ezmeral Valley'",
    description:
      "Un pintoresco sendero bien mantenido que serpentea a través de un bosque exuberante cerca de la ciudad. Se ven señales informativas sobre la flora y fauna local, bancos hechos con materiales reciclados y personas disfrutando de una caminata en la naturaleza. El sendero ofrece vistas panorámicas del lago y la ciudad.",
  },
  {
    id: "interest2",
    image: "/images/temp/establishment-temp1.jpeg",
    title: "Mercado Ecológico Local",
    description:
      "Una plaza animada donde productores locales venden frutas, verduras orgánicas, artesanías y productos sostenibles. Se ven puestos coloridos, toldos hechos con materiales naturales y gente comprando y socializando. El ambiente es festivo y promueve la economía local y la alimentación saludable.",
  },
  {
    id: "interest3",
    image: "/images/temp/activity-temp1.jpeg",
    title: "Espacio público junto al lago",
    description:
      "Un área vibrante cerca del lago con personas disfrutando de actividades al aire libre. Se ven parques con áreas de picnic, senderos para caminar y andar en bicicleta, y quizás algún embarcadero con pequeñas embarcaciones eléctricas. La calidad del agua es prístina y la biodiversidad local está protegida.",
  },
  {
    id: "interest4",
    image: "/images/temp/trails-temp2.jpeg",
    title: "Ruta Urbana Peatonal 'Nimble Peak - GreenLake Shores'",
    description:
      "Una calle peatonal adoquinada y llena de vegetación que conecta parques y plazas importantes de la ciudad. Se ven bancos para descansar, fuentes de agua potable y señalización que indica puntos de interés histórico y cultural. La gente pasea, disfruta de las tiendas locales y se relaja en un ambiente tranquilo.",
  },
  {
    id: "interest5",
    image: "/images/temp/establishment-temp2.jpeg",
    title: "Hotel Ecológico 'GreenLake Platinum Heritage'",
    description:
      "Un hotel de diseño moderno y sostenible, construido con materiales de bajo impacto ambiental y rodeado de jardines nativos. Se observan paneles solares en el techo, grandes ventanales que maximizan la luz natural y quizás una entrada con cargadores para vehículos eléctricos. El ambiente transmite tranquilidad y conexión con la naturaleza.",
  },
  {
    id: "interest6",
    image: "/images/temp/activity-temp2.jpeg",
    title: "Centro de Actividades Acuáticas Sostenibles",
    description:
      "Un centro ubicado a orillas del lago que ofrece alquiler de kayaks, paddleboards y pequeñas embarcaciones eléctricas. El edificio está integrado con el entorno natural y promueve el disfrute responsable del lago. Se ven personas preparándose para salir a remar en aguas cristalinas.",
  },
];

// Example data for activities carousels
const nearbyActivities = [
    {
        id: "Espacio-publico-junto-al-lago",
        image: "/images/temp/activity-temp1.jpeg",
        name: "Espacio público junto al lago"
    },
    {
        id: "Centro-de-Actividades-Acuaticas-Sostenibles",
        image: "/images/temp/activity-temp2.jpeg",
        name: "Centro de Actividades Acuáticas Sostenibles"
    },
    {
        id: "Jardin-Botanico-Comunitario",
        image: "/images/temp/activity-temp3.jpeg",
        name: "Jardín Botánico Comunitario"
    },
    {
        id: "Clase-de-Yoga-al-Aire-Libre",
        image: "/images/temp/activity-temp4.jpeg",
        name: "Clase de Yoga al Aire Libre en un Parque"
    }
];

const recommendedActivities = [
    {
        id: "Clase-de-Yoga-al-Aire-Libre",
        image: "/images/temp/activity-temp4.jpeg",
        name: "Clase de Yoga al Aire Libre en un Parque"
    },
    {
        id: "Jardin-Botanico-Comunitario",
        image: "/images/temp/activity-temp3.jpeg",
        name: "Jardín Botánico Comunitario"
    },
    {
        id: "Centro-de-Actividades-Acuaticas-Sostenibles",
        image: "/images/temp/activity-temp2.jpeg",
        name: "Centro de Actividades Acuáticas Sostenibles"
    },
    {
        id: "Espacio-publico-junto-al-lago",
        image: "/images/temp/activity-temp1.jpeg",
        name: "Espacio público junto al lago"
    }
];
const initializeCarouselData = async () => {
  await Promise.all([
    fetchAllActivities(),
    fetchAllEstablishments(),
    fetchAllTrails()
  ]);

  window.CarouselData = {
    interests: interestItems,
    activities: {
      nearby: getRandomElements(allActivities, 4),
      recommended: getRandomElements(allActivities, 4)
    },
    establishments: {
      nearby: getRandomElements(allEstablishments, 4),
      recommended: getRandomElements(allEstablishments, 4)
    },
    trails: {
      nearby: getRandomElements(allTrails, 4),
      recommended: getRandomElements(allTrails, 4)
    }
  };
  const event = new CustomEvent('CarouselDataReady', { detail: window.CarouselData });
  window.dispatchEvent(event);
};

initializeCarouselData();

