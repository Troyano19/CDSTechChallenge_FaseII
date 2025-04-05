require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { getPath } = require("./pathConfig");

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
    if (resolvedPath.includes("\\public\\")) {
      const webPath = resolvedPath.split("\\public\\")[1].replace(/\\/g, "/");
      return `/${webPath}`;
    }

    return resolvedPath;
  });
};

/**
 * Replace secure token placeholders with actual values
 * @param {string} content - HTML content with token placeholders
 * @returns {string} - HTML content with injected tokens
 */
const replaceSecureTokens = (content) => {
  // Replace AUTH_TOKEN placeholder with environment variable
  const headerKey = process.env.HEADER_KEY || null;
  return content.replace(/\{\{AUTH_TOKEN\}\}/g, headerKey);
};

/**
 * Renders an HTML file with header and footer
 * @param {string} filePath - Path to the HTML file
 * @param {object} res - Express response object
 */
const renderWithHeaderFooter = (filePath, req, res) => {
  try {
    // Determine which header to use based on login status
    const headerPath = isLoggedIn(req)
      ? path.join(getPath("utils"), "headerLogued.html")
      : getPath("header");

    const footerPath = getPath("footer");
    const chatBotPath = getPath("chatBot");

    let headerContent = fs.readFileSync(headerPath, "utf8");
    let footerContent = fs.readFileSync(footerPath, "utf8");
    const chatBotContent = fs.readFileSync(chatBotPath, "utf8");
    const content = fs.readFileSync(filePath, "utf8");

    

    // Use regex to find the body tag with any attributes
    const bodyStartRegex = /<body[^>]*>/i;
    const bodyEndRegex = /<\/body>/i;

    const bodyStartMatch = content.match(bodyStartRegex);
    const bodyEndMatch = content.match(bodyEndRegex);

    if (!bodyStartMatch || !bodyEndMatch) {
      return res
        .status(500)
        .send("Invalid HTML template format: body tags not found");
    }

    // Split content at the found positions
    const startIndex =
      content.indexOf(bodyStartMatch[0]) + bodyStartMatch[0].length;
    const endIndex = content.indexOf(bodyEndMatch[0]);

    // Extract parts of the document
    const beforeBody = content.substring(0, startIndex);
    const bodyContent = content.substring(startIndex, endIndex);
    const afterBody = content.substring(endIndex);

    const processedHeaderContent = replacePaths(headerContent);
    // Si el usuario está autenticado, sustituye {{USER_PFP}} por el valor de la base de datos
    let finalHeaderContent = processedHeaderContent;
    if (req.isAuthenticated() && req.user && req.user.pfp) {
      finalHeaderContent = processedHeaderContent.replace("{{USER_PFP}}", req.user.pfp);
    } else {
      // Si no está autenticado, puedes reemplazarlo por un valor por defecto
      finalHeaderContent = processedHeaderContent.replace("{{USER_PFP}}", "/images/default-profile.png");
    }

    // Replace path placeholders in all content parts
    const processedBeforeBody = replacePaths(beforeBody);
    const processedBodyContent = replacePaths(bodyContent);
    const processedFooterContent = replacePaths(footerContent);
    let processedChatBotContent = replacePaths(chatBotContent);
    
    // Also replace secure tokens in the chatbot content
    processedChatBotContent = replaceSecureTokens(processedChatBotContent);

    const processedAfterBody = replacePaths(afterBody);

    // Combine all parts with header, footer, and chatbot
    const finalHtml =
      processedBeforeBody +
      finalHeaderContent +
      processedBodyContent +
      processedFooterContent +
      processedChatBotContent +
      processedAfterBody;

    res.send(finalHtml);
  } catch (error) {
    console.error("Error rendering template:", error);
    res.status(500).send("Error rendering template: " + error.message);
  }
};

/**
 * Check if a user is logged in
 * @param {Object} req - Express request object
 * @returns {boolean} True if user is logged in
 */
function isLoggedIn(req) {
  return !!(req.session && req.session.user);
}

/**
 * Replace path placeholders in HTML with real paths
 * @param {string} content - HTML content
 * @returns {string} HTML content with replaced paths
 */
function replacePathPlaceholders(content) {
  // Get all path matches
  const pathMatches = content.match(/{{PATH:[^}]+}}/g) || [];

  // For each match, replace with the actual path
  pathMatches.forEach((match) => {
    const pathKey = match.substring(7, match.length - 2); // Extract the path key
    const realPath = "/" + getPath(pathKey); // Convert to absolute path
    content = content.replace(
      new RegExp(match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      realPath
    );
  });

  return content;
}

/**
 * Enforce absolute URLs in HTML content
 * @param {string} content - HTML content
 * @returns {string} HTML content with absolute URLs
 */
function enforceAbsoluteUrls(content) {
  // Replace relative URLs in href and src attributes with absolute URLs
  content = content.replace(/(href|src)="(?!http|\/|#|mailto:|tel:)([^"]+)"/g, '$1="/$2"');

  return content;
}

module.exports = {
  renderWithHeaderFooter,
  isLoggedIn,
};
