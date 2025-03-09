const fs = require('fs');
const { getPath } = require('./pathConfig');

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
        
        // Insert header and footer
        const parts = content.split('<body>');
        if (parts.length < 2) {
            return res.status(500).send('Invalid HTML template format');
        }
        
        const bodyParts = parts[1].split('</body>');
        
        const finalHtml = parts[0] + 
                        '<body>' + 
                        headerContent + 
                        bodyParts[0] + 
                        footerContent + 
                        '</body>' + 
                        bodyParts[1];
        
        res.send(finalHtml);
    } catch (error) {
        console.error('Error rendering template:', error);
        res.status(500).send('Error rendering template');
    }
};

module.exports = {
    renderWithHeaderFooter
};
