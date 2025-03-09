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
const jsDir = path.join(publicDir, 'js');

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
            }
        }
    };
};

/**
 * Get a specific path by key.
 * 
 * This function retrieves a specific file path by using a key.
 * The key can be a top-level path, such as 'root', or a nested path using dot notation.
 * For example, to obtain the homepage path, use 'pages.home', which returns the full
 * path to the 'home.html' file located within the public directory.
 *
 * @param {string} key - The path key to retrieve (supports dot notation for nested paths, e.g., 'pages.home').
 * @returns {string|null} The requested path or null if not found.
 */
const getPath = (key) => {
    const paths = getPaths();
    
    if (key.includes('.')) {
        const [category, item] = key.split('.');
        return paths[category] && paths[category][item] ? paths[category][item] : null;
    }
    
    return paths[key] || null;
};

module.exports = {
    getPath
};
