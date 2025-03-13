/**
 * Module defining the router for configuration endpoints
 * 
 * @module routes/configRouter
 */

const express = require('express');
const router = express.Router();

// For development - hardcoded API key when environment variable isn't available
// In production, this should ONLY come from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

/**
 * ENDPOINT: GET /api/config/chatbot
 * HANDLER: Return chatbot configuration
 * UTILITY: Provides necessary configuration for the frontend chatbot
 */
router.get('/chatbot', (_, res) => {
    res.json({
        apiKey: GROQ_API_KEY,
        model: 'llama-3.1-8b-instant'
    });
});

module.exports = router;
