const fs = require('fs');
const { getPath } = require('./pathConfig');

/**
 * Replaces path placeholders in HTML content with actual paths
 * Placeholder format: {{PATH:key}} where key is the path key in pathConfig
 * @param {string} content - HTML content with placeholders
 * @returns {string} - HTML content with resolved paths
 */
const replacePaths = (content) => {
    // Regular expression to find all path placeholders
    const pathRegex = /\{\{PATH:([^\}]+)\}\}/g;
    
    return content.replace(pathRegex, (match, pathKey) => {
        const resolvedPath = getPath(pathKey);
        if (resolvedPath === null) {
            console.warn(`Path key not found: ${pathKey}`);
            return match; // Keep the placeholder if path not found
        }
        
        // Convert absolute path to relative web path for frontend resources
        if (resolvedPath.includes('\\public\\')) {
            const webPath = resolvedPath.split('\\public\\')[1].replace(/\\/g, '/');
            return `/${webPath}`;
        }
        
        return resolvedPath;
    });
};

/**
 * Renders an HTML file with header and footer
 * @param {string} filePath - Path to the HTML file
 * @param {object} res - Express response object
 */
const renderWithHeaderFooter = (filePath, res) => {
    try {
        // Read the header, footer, and main content using the path config
        const headerPath = getPath('header');
        const footerPath = getPath('footer');
        
        const headerContent = fs.readFileSync(headerPath, 'utf8');
        const footerContent = fs.readFileSync(footerPath, 'utf8');
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Use regex to find the body tag with any attributes
        const bodyStartRegex = /<body[^>]*>/i;
        const bodyEndRegex = /<\/body>/i;
        
        const bodyStartMatch = content.match(bodyStartRegex);
        const bodyEndMatch = content.match(bodyEndRegex);
        
        if (!bodyStartMatch || !bodyEndMatch) {
            return res.status(500).send('Invalid HTML template format: body tags not found');
        }
        
        // Split content at the found positions
        const startIndex = content.indexOf(bodyStartMatch[0]) + bodyStartMatch[0].length;
        const endIndex = content.indexOf(bodyEndMatch[0]);
        
        // Extract parts of the document
        const beforeBody = content.substring(0, startIndex);
        const bodyContent = content.substring(startIndex, endIndex);
        const afterBody = content.substring(endIndex);
        
        // Replace path placeholders in all content parts
        const processedBeforeBody = replacePaths(beforeBody);
        const processedHeaderContent = replacePaths(headerContent);
        const processedBodyContent = replacePaths(bodyContent);
        const processedFooterContent = replacePaths(footerContent);
        const processedAfterBody = replacePaths(afterBody);
        
        // Combine all parts with header and footer
        const finalHtml = processedBeforeBody + 
                        processedHeaderContent + 
                        processedBodyContent + 
                        processedFooterContent + 
                        processedAfterBody;
        
        res.send(finalHtml);
    } catch (error) {
        console.error('Error rendering template:', error);
        res.status(500).send('Error rendering template: ' + error.message);
    }
};

module.exports = {
    renderWithHeaderFooter,
};
