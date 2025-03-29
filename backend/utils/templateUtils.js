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

    // Replace path placeholders in all content parts
    const processedBeforeBody = replacePaths(beforeBody);
    const processedHeaderContent = replacePaths(headerContent);
    const processedBodyContent = replacePaths(bodyContent);
    const processedFooterContent = replacePaths(footerContent);
    let processedChatBotContent = replacePaths(chatBotContent);

    // Also replace secure tokens in the chatbot content
    processedChatBotContent = replaceSecureTokens(processedChatBotContent);

    const processedAfterBody = replacePaths(afterBody);

    // Combine all parts with header, footer, and chatbot
    const finalHtml =
      processedBeforeBody +
      processedHeaderContent +
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

// Verificar si el usuario está logueado
const isLoggedIn = (req) => {
  // Verificar si la cookie de inicio de sesión existe
  return req.cookies && req.cookies.loginCookie;
};

module.exports = {
  renderWithHeaderFooter,
  isLoggedIn
};
