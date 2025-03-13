/**
 * Module defining the router for configuration endpoints
 * 
 * @module routes/configRouter
 */
require('dotenv').config();

const express = require('express');
const router = express.Router();
const GROQ_API_KEY = process.env.GROQ_API_KEY || null;

/**
 * ENDPOINT: GET /api/config/chatbot
 * HANDLER: Return chatbot configuration
 * UTILITY: Provides necessary configuration for the frontend chatbot
 */
router.get('/chatbot', (_, res) => {
    res.json({
        apiKey: GROQ_API_KEY
    });
});

module.exports = router;
