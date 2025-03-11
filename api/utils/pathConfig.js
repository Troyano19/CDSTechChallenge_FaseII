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

const imagesDir = path.join(publicDir, 'images');

const cssDir = path.join(publicDir, 'css');
const cssPagesDir = path.join(cssDir, 'pages');
const cssUtilsDir = path.join(cssDir, 'utils');

const jsDir = path.join(publicDir, 'js');
const jsPagesDir = path.join(jsDir, 'pages');
const jsUtilsDir = path.join(jsDir, 'utils');
const jsDataDir = path.join(jsDir, 'data');

// Template paths
const headerPath = path.join(utilsDir, 'header.html');
const footerPath = path.join(utilsDir, 'footer.html');

// HTML pages
const homePage = path.join(pagesDir, 'home.html');
const travelPage = path.join(pagesDir, 'travel.html');
const trailsPage = path.join(pagesDir, 'trails.html');
const establishmentsPage = path.join(pagesDir, 'establishments.html');
const activitiesPage = path.join(pagesDir, 'activities.html');
const adminPage = path.join(pagesDir, 'admin.html');

// Info pages
const infoDir = path.join(pagesDir, 'info');
const trailInfoPage = path.join(infoDir, 'trail.html');
const establishmentInfoPage = path.join(infoDir, 'establishment.html');
const activityInfoPage = path.join(infoDir, 'activitie.html');

// Session pages
const sessionDir = path.join(pagesDir, 'session');
const loginPage = path.join(sessionDir, 'login.html');
const registerPage = path.join(sessionDir, 'register.html');

// CSS files
const mainCSS = path.join(cssDir, 'main.css');
const homeCSS = path.join(cssPagesDir, 'home.css');
const headerCSS = path.join(cssUtilsDir, 'header.css');
const footerCSS = path.join(cssUtilsDir, 'footer.css');
const sessionCSS = path.join(cssPagesDir, 'session.css');
const travelCSS = path.join(cssPagesDir, 'travel.css');

// JS files
const homeJs = path.join(jsPagesDir, 'home.js');
const headerJs = path.join(jsUtilsDir, 'header.js');
const countriesJs = path.join(jsDataDir, 'countries.js');
const carouselJs = path.join(jsUtilsDir, 'carousel.js');
const travelJs = path.join(jsPagesDir, 'travel.js');

// Image paths
const faviconIMG = path.join(imagesDir, 'icon.ico');

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
        pages: {
            home: homePage,
            travel: travelPage,
            trails: trailsPage,
            establishments: establishmentsPage,
            activities: activitiesPage,
            admin: adminPage,
            info: {
                trail: trailInfoPage,
                establishment: establishmentInfoPage,
                activity: activityInfoPage
            },
            session: {
                login: loginPage,
                register: registerPage
            }
        },
        css: {
            main: mainCSS,
            home: homeCSS,
            header: headerCSS,
            footer: footerCSS,
            session: sessionCSS,
            travel: travelCSS
        },
        js: {
            home: homeJs,
            header: headerJs,
            countries: countriesJs,
            carousel: carouselJs,
            travel: travelJs
        },
        images: {
            favicon: faviconIMG
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
