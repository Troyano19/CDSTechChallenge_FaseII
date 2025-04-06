/**
 * Configuration file for all file paths used in the application
 * 
 * @module utils/pathConfig
 */

const { profile } = require('console');
const path = require('path');

// Base paths
const rootDir = path.join(__dirname, '../..');
const publicDir = path.join(rootDir, 'public');
const srcDir = path.join(rootDir, 'src');

// Public directory paths
const htmlDir = path.join(publicDir, 'html');
const pagesDir = path.join(htmlDir, 'pages');
const utilsDir = path.join(htmlDir, 'utils');

const cssDir = path.join('css');
const cssPagesDir = path.join(cssDir, 'pages');
const cssUtilsDir = path.join(cssDir, 'utils');
const cssComponentsDir = path.join(cssDir, 'components'); // Add components directory

const jsDir = path.join('js');
const jsPagesDir = path.join(jsDir, 'pages');
const jsUtilsDir = path.join(jsDir, 'utils');
const jsDataDir = path.join(jsDir, 'data');
const jsCity3DDIR = path.join(jsPagesDir, 'city3D');

// Template paths
const headerPath = path.join(utilsDir, 'header.html');
const footerPath = path.join(utilsDir, 'footer.html');
const chatBotPath = path.join(utilsDir, 'chatBot.html');

// HTML pages
const homePage = path.join(pagesDir, 'home.html');
const travelPage = path.join(pagesDir, 'travel.html');
const trailsPage = path.join(pagesDir, 'trails.html');
const establishmentsPage = path.join(pagesDir, 'establishments.html');
const activitiesPage = path.join(pagesDir, 'activities.html');
const adminPage = path.join(pagesDir, 'admin.html');
const city3DPage = path.join(pagesDir, 'city3D.html');
const profilePage = path.join(pagesDir, 'profile.html');

// Info pages
const infoDir = path.join(pagesDir, 'info');
const trailInfoPage = path.join(infoDir, 'trail.html');
const establishmentInfoPage = path.join(infoDir, 'establishment.html');
const activityInfoPage = path.join(infoDir, 'activity.html');
const myTripsPage = path.join(infoDir, 'myTrips.html');

// Activities specific pages
const activitiesInfoDir = path.join(infoDir, 'activities');
const espacioPublicoLagoPage = path.join(activitiesInfoDir, 'Espacio-publico-junto-al-lago.html');
const centroActividadesAcuaticasPage = path.join(activitiesInfoDir, 'Centro-de-Actividades-Acuaticas-Sostenibles.html');
const jardinBotanicoPage = path.join(activitiesInfoDir, 'Jardin-Botanico-Comunitario.html');
const claseYogaPage = path.join(activitiesInfoDir, 'Clase-de-Yoga-al-Aire-Libre.html');

// Trails specific pages
const trailsInfoDir = path.join(infoDir, 'trails');
const rutaSenderismoPage = path.join(trailsInfoDir, 'Ruta-de-Senderismo-Ezmeral-Valley.html');
const rutaUrbanaPeatonalPage = path.join(trailsInfoDir, 'Ruta-Urbana-Peatonal-Nimble-Peak.html');
const rutaObservacionAvesPage = path.join(trailsInfoDir, 'Ruta-de-Observacion-de-Aves.html');
const carrilBiciPanoramicoPage = path.join(trailsInfoDir, 'Carril-Bici-Panoramico.html');

// Establishments specific pages
const establishmentsInfoDir = path.join(infoDir, 'establishments');
const mercadoEcologicoPage = path.join(establishmentsInfoDir, 'Mercado-Ecologico-Local.html');
const hotelEcologicoPage = path.join(establishmentsInfoDir, 'Hotel-Ecologico-GreenLake.html');
const tiendaProductosPage = path.join(establishmentsInfoDir, 'Tienda-de-Productos-Sostenibles.html');
const cafeteriaEcologicaPage = path.join(establishmentsInfoDir, 'Cafeteria-Ecologica.html');

// Session pages
const sessionDir = path.join(pagesDir, 'session');
const loginPage = path.join(sessionDir, 'login.html');
const registerPage = path.join(sessionDir, 'register.html');

// Legal pages
const legalDir = path.join(pagesDir, 'legal');
const cookiesPage = path.join(legalDir, 'cookies.html');
const privacyPage = path.join(legalDir, 'privacy.html');
const termsPage = path.join(legalDir, 'terms.html');

// CSS files
const mainCSS = path.join(cssDir, 'main.css');
const homeCSS = path.join(cssPagesDir, 'home.css');
const travelCSS = path.join(cssPagesDir, 'travel.css');
const businessPagesCSS = path.join(cssPagesDir, 'business-pages.css');
const city3DCSS = path.join(cssPagesDir, 'city3D.css');
const sessionCSS = path.join(cssPagesDir, 'session.css');
const profileCSS = path.join(cssPagesDir, 'profile.css');
const adminCSS = path.join(cssPagesDir, 'admin.css');
const autocompleteCSS = path.join(cssComponentsDir, 'autocomplete.css'); // Add autocomplete CSS
const toastCSS = path.join(cssComponentsDir, 'toast.css'); // Add toast CSS

const headerCSS = path.join(cssUtilsDir, 'header.css');
const footerCSS = path.join(cssUtilsDir, 'footer.css');
const chatBotCSS = path.join(cssUtilsDir, 'chatBot.css');

const LegalDirCSS = path.join(cssPagesDir, 'legal');
const cookiesCSS = path.join(LegalDirCSS, 'cookies.css');
const privacyCSS = path.join(LegalDirCSS, 'privacy.css');
const termsCSS = path.join(LegalDirCSS, 'terms.css');

const infoDirCSS = path.join(cssPagesDir, 'info');
const myTripsCSS = path.join(infoDirCSS, "myTrips.css");
const businessDetailsCSS = path.join(infoDirCSS, "business-details.css");

// JS files
const homeJs = path.join(jsPagesDir, 'home.js');
const travelJs = path.join(jsPagesDir, 'travel.js');
const businessPagesJs = path.join(jsPagesDir, 'business-pages.js');
const businessDetailsJs = path.join(jsPagesDir, 'business-details.js');
const profileJs = path.join(jsPagesDir, 'profile.js');
const adminJs = path.join(jsPagesDir, 'admin.js');
const carouselDataJs = path.join(jsDataDir, 'carouselData.js');
const translationsJs = path.join(jsDataDir, 'translations.js');
const city3DJs = path.join(jsCity3DDIR, 'main.js');
const accessJs = path.join(jsDir, 'access.js');

const chatBotJs = path.join(jsUtilsDir, 'chatBot.js');
const logoutJs = path.join(jsUtilsDir, 'logout.js');
const headerJs = path.join(jsUtilsDir, "header.js");
const carouselJs = path.join(jsUtilsDir, "carousel.js");
const travelUtilsJs = path.join(jsUtilsDir, "travelUtils.js");
const geoNameUtilsJs = path.join(jsUtilsDir, "geoNameUtils.js"); // Add geoNameUtils JS
const carouselRendererJs = path.join(jsUtilsDir, "carouselRenderer.js");
const pageLoaderJs = path.join(jsUtilsDir, "pageLoader.js");
const languageSwitcherJs = path.join(jsUtilsDir, "languageSwitcher.js");
const sessionJs = path.join(jsUtilsDir, "session.js");
const toastJS = path.join(jsUtilsDir, 'toastUtils.js'); // Add toast utils

// Image paths
const imagesDir = path.join('images');
const faviconIMG = path.join(imagesDir, 'icon.ico');
const chatIcon = path.join(imagesDir, 'chat-icon.svg');

/**
 * Get path configuration object
 * @returns {Object} All path configurations
 */
const getPaths = () => {
    return {
        root: rootDir,
        public: publicDir,
        src: srcDir,
        html: htmlDir,
        pages: pagesDir,
        utils: utilsDir,
        images: imagesDir,
        css: cssDir,
        js: jsDir,
        header: headerPath,
        footer: footerPath,
        chatBot: chatBotPath,
        pages: {
            home: homePage,
            travel: travelPage,
            trails: trailsPage,
            establishments: establishmentsPage,
            activities: activitiesPage,
            admin: adminPage,
            city3D: city3DPage,
            profile: profilePage,
            info: {
                trail: trailInfoPage,
                establishment: establishmentInfoPage,
                activity: activityInfoPage,
                myTrips: myTripsPage,
                activities: {
                    espacioPublicoLago: espacioPublicoLagoPage,
                    centroActividadesAcuaticas: centroActividadesAcuaticasPage,
                    jardinBotanico: jardinBotanicoPage,
                    claseYoga: claseYogaPage
                },
                trails: {
                    rutaSenderismo: rutaSenderismoPage,
                    rutaUrbanaPeatonal: rutaUrbanaPeatonalPage,
                    rutaObservacionAves: rutaObservacionAvesPage,
                    carrilBiciPanoramico: carrilBiciPanoramicoPage
                },
                establishments: {
                    mercadoEcologico: mercadoEcologicoPage,
                    hotelEcologico: hotelEcologicoPage,
                    tiendaProductos: tiendaProductosPage,
                    cafeteriaEcologica: cafeteriaEcologicaPage
                }
            },
            session: {
                login: loginPage,
                register: registerPage
            },
            legal: {
                cookies: cookiesPage,
                privacy: privacyPage,
                terms: termsPage
            }
        },
        css: {
            main: mainCSS,
            home: homeCSS,
            header: headerCSS,
            footer: footerCSS,
            session: sessionCSS,
            travel: travelCSS,
            businessPages: businessPagesCSS,
            city3D: city3DCSS,
            chatBot: chatBotCSS,
            profile: profileCSS,
            admin: adminCSS,
            autocomplete: autocompleteCSS, // Add autocomplete CSS path
            toast: toastCSS, // Add toast CSS
            legal: {
                cookies: cookiesCSS,
                privacy: privacyCSS,
                terms: termsCSS
            },
            info: {
                myTrips: myTripsCSS,
                businessDetails: businessDetailsCSS
            }
        },
        js: {
            home: homeJs,
            header: headerJs,
            carousel: carouselJs,
            travel: travelJs,
            travelUtils: travelUtilsJs,
            geoNameUtils: geoNameUtilsJs, // Add geoNameUtils JS path
            businessPages: businessPagesJs,
            businessDetails: businessDetailsJs,
            carouselData: carouselDataJs,
            carouselRenderer: carouselRendererJs,
            access: accessJs,
            pageLoader: pageLoaderJs,
            translations: translationsJs,
            languageSwitcher: languageSwitcherJs,
            city3D: city3DJs,
            chatBot: chatBotJs,
            logout: logoutJs,
            profile: profileJs,
            admin: adminJs,
            session: sessionJs,
            toastUtils: toastJS, // Add toast utils
        },
        images: {
            favicon: faviconIMG,
            chatIcon: chatIcon
        }
    };
};

/**
 * Get a specific path by key.
 * 
 * This function retrieves a specific file path by using a key.
 * The key can be a top-level path, such as 'root', or a nested path using dot notation.
 * For example, to obtain the homepage path, use 'pages.home'.
 *
 * @param {string} key - The path key to retrieve (supports dot notation for nested paths).
 * @returns {string|null} The requested path or null if not found.
 */
const getPath = (key) => {
    const paths = getPaths();
    return key.split('.').reduce((acc, cur) => acc && acc[cur] !== undefined ? acc[cur] : null, paths);
};

module.exports = {
    getPath
};
