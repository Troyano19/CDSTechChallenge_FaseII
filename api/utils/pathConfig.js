/**
 * Configuration file for all file paths used in the application
 * 
 * @module utils/pathConfig
 */

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
const activityInfoPage = path.join(infoDir, 'activitie.html');
const myTripsPage = path.join(infoDir, 'myTrips.html');

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

const headerCSS = path.join(cssUtilsDir, 'header.css');
const footerCSS = path.join(cssUtilsDir, 'footer.css');
const chatBotCSS = path.join(cssUtilsDir, 'chatBot.css');

const LegalDirCSS = path.join(cssPagesDir, 'legal');
const cookiesCSS = path.join(LegalDirCSS, 'cookies.css');
const privacyCSS = path.join(LegalDirCSS, 'privacy.css');
const termsCSS = path.join(LegalDirCSS, 'terms.css');

const infoDirCSS = path.join(cssPagesDir, 'info');
const myTripsCSS = path.join(cssPagesDir, 'myTrips.css');

// JS files
const homeJs = path.join(jsPagesDir, 'home.js');
const travelJs = path.join(jsPagesDir, 'travel.js');
const businessPagesJs = path.join(jsPagesDir, 'business-pages.js');
const countriesJs = path.join(jsDataDir, 'countries.js');
const carouselDataJs = path.join(jsDataDir, 'carouselData.js');
const translationsJs = path.join(jsDataDir, 'translations.js');
const headerJs = path.join(jsUtilsDir, 'header.js');
const carouselJs = path.join(jsUtilsDir, 'carousel.js');
const travelUtilsJs = path.join(jsUtilsDir, 'travelUtils.js');
const carouselRendererJs = path.join(jsUtilsDir, 'carouselRenderer.js');
const pageLoaderJs = path.join(jsUtilsDir, 'pageLoader.js');
const languageSwitcherJs = path.join(jsUtilsDir, 'languageSwitcher.js');
const city3DJs = path.join(jsCity3DDIR, 'main.js');
const chatBotJs = path.join(jsUtilsDir, 'chatBot.js');
const accessJs = path.join(jsDir, 'access.js');
const logoutJs = path.join(jsUtilsDir, 'logout.js');

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
                myTrips: myTripsPage
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
            legal: {
                cookies: cookiesCSS,
                privacy: privacyCSS,
                terms: termsCSS
            },
            info: {
                myTrips: myTripsCSS
            }
        },
        js: {
            home: homeJs,
            header: headerJs,
            countries: countriesJs,
            carousel: carouselJs,
            travel: travelJs,
            travelUtils: travelUtilsJs,
            businessPages: businessPagesJs,
            carouselData: carouselDataJs,
            carouselRenderer: carouselRendererJs,
            access: accessJs,
            pageLoader: pageLoaderJs,
            translations: translationsJs,
            languageSwitcher: languageSwitcherJs,
            city3D: city3DJs,
            chatBot: chatBotJs,
            logout: logoutJs
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
