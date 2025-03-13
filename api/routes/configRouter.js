/**
 * Module defining the router for configuration endpoints
 * 
 * @module routes/configRouter
 */
require('dotenv').config();

const express = require('express');
const router = express.Router();
const GROQ_API_KEY = process.env.GROQ_API_KEY || null;
const HEADER_KEY = process.env.HEADER_KEY || null;

/**
 * ENDPOINT: GET /api/config/chatbot
 * HANDLER: Return chatbot configuration
 * UTILITY: Provides necessary configuration for the frontend chatbot
 */
router.get('/chatbot', (req, res) => {
    const authHeader = req.headers['authorization'];
    
    // Check if the header key is set and matches
    if (!HEADER_KEY || authHeader !== HEADER_KEY) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }
    
    res.json({
        apiKey: GROQ_API_KEY
    });
});

module.exports = router;
