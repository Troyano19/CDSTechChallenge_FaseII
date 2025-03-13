/**
 * GreenLake Assistant Chatbot
 * Powered by GROQ API
 */

class ChatBot {
    constructor() {
        this.container = null;
        this.toggleButton = null;
        this.chatWindow = null;
        this.messageArea = null;
        this.form = null;
        this.input = null;
        this.closeButton = null;
        this.isOpen = false;
        this.isWaitingForResponse = false;
        
        // Add conversation history array
        this.conversationHistory = [];
        
        // GROQ API settings - will be populated from config
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.apiKey = null;
        this.model =  "llama-3.1-8b-instant";
        
        // The auth header will be securely retrieved from DOM data attribute
        this.headerKey = null;
    }
    
    /**
     * Initialize the chatbot
     */
    async init() {
        this.container = document.getElementById('chatbot-container');
        this.toggleButton = document.getElementById('chatbot-toggle');
        this.chatWindow = document.getElementById('chatbot-window');
        this.messageArea = document.getElementById('chatbot-messages');
        this.form = document.getElementById('chatbot-form');
        this.input = document.getElementById('chatbot-input');
        this.closeButton = document.getElementById('chatbot-close');
        
        if (!this.container) return;
        
        try {
            // Get auth token from data attribute (securely injected by server)
            this.headerKey = this.container.dataset.authToken || '';
            
            // Load API key and configuration from backend
            await this.loadConfig();
            
            // Add event listeners
            this.toggleButton.addEventListener('click', () => this.toggleChat());
            this.closeButton.addEventListener('click', () => this.closeChat());
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Add welcome message
            setTimeout(() => {
                const welcomeMessage = "¡Hola! Soy el asistente de GreenLake. ¿En qué puedo ayudarte hoy?";
                this.addBotMessage(welcomeMessage);
            }, 500);
        } catch (error) {
            console.error('Failed to initialize chatbot:', error);
        }
    }
    
    /**
     * Load API configuration from backend
     */
    async loadConfig() {
        try {
            const response = await fetch('/api/config/chatbot', {
                headers: {
                    'Authorization': this.headerKey
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            const config = await response.json();
            
            // Update configuration if we have valid values
            if (config.apiKey && config.apiKey !== 'null') {
                this.apiKey = config.apiKey;
            } else {
                console.warn('No valid API key received from server');
            }

        } catch (error) {
            console.error('Error loading chatbot configuration:', error);
        }
    }
    
    /**
     * Toggle chatbot window
     */
    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWindow.classList.toggle('hidden', !this.isOpen);
        
        if (this.isOpen) {
            this.input.focus();
        }
    }
    
    /**
     * Close chatbot window
     */
    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.add('hidden');
    }
    
    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        const message = this.input.value.trim();
        if (!message || this.isWaitingForResponse) return;
        
        // Add user message to chat
        this.addUserMessage(message);
        
        // Clear input
        this.input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get response from GROQ API
        await this.getAIResponse(message);
    }
    
    /**
     * Add user message to chat
     */
    addUserMessage(text) {
        // Add to UI
        const message = document.createElement('div');
        message.className = 'message user-message';
        message.textContent = text;
        this.messageArea.appendChild(message);
        
        // Add to conversation history
        this.conversationHistory.push({ role: 'user', content: text });
        
        this.scrollToBottom();
    }
    
    /**
     * Add bot message to chat
     */
    addBotMessage(text) {
        // Add to UI
        const message = document.createElement('div');
        message.className = 'message bot-message';
        message.textContent = text;
        this.messageArea.appendChild(message);
        
        // Add to conversation history
        this.conversationHistory.push({ role: 'assistant', content: text });
        
        this.scrollToBottom();
    }
    
    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        this.isWaitingForResponse = true;
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        indicator.id = 'typing-indicator';
        this.messageArea.appendChild(indicator);
        this.scrollToBottom();
    }
    
    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        this.isWaitingForResponse = false;
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }
    
    /**
     * Get response from GROQ API
     */
    async getAIResponse(userMessage) {
        try {
            // Create a simplified system message with minimal context
            const pageTitle = document.title;
            const pagePath = window.location.pathname;
            const pageContent = this.getPageContent();
            
            // Prepare system message with limited context
            const systemMessage = `You are GreenLake Assistant, a helpful AI assistant for the GreenLake Village sustainable tourism website. 
            The user is currently on the page "${pageTitle}" at path "${pagePath}".

            Here is the content of the page: "${pageContent}".

            Respond in the same language the user writes in. Be concise, friendly and helpful.
            Keep answers relevant to sustainable tourism, activities, and services at GreenLake Village.
            No talking about personal information, code of the page, variables or unrelated topics.
            Think two times before sending a message, and always be respectful.`;
            
            // For development purposes, provide a fallback response if API key is not set
            if (!this.apiKey || this.apiKey === 'null') {
                console.warn('No API key available for GROQ API call');
                this.hideTypingIndicator();
                
                // Generate a simple response based on user query keywords
                let response = "Lo siento, actualmente estoy en modo de desarrollo y no puedo procesar tu consulta. ";
                
                if (userMessage.toLowerCase().includes('hotel') || userMessage.toLowerCase().includes('alojamiento')) {
                    response += "Para información sobre alojamiento, te recomiendo visitar nuestra página de establecimientos o contactar con recepción.";
                } else if (userMessage.toLowerCase().includes('actividad') || userMessage.toLowerCase().includes('hacer')) {
                    response += "Tenemos muchas actividades disponibles en GreenLake Village. Puedes explorarlas en la sección de Actividades.";
                } else if (userMessage.toLowerCase().includes('restaurante') || userMessage.toLowerCase().includes('comer')) {
                    response += "Hay varios restaurantes en GreenLake Village que ofrecen cocina local e internacional.";
                } else {
                    response += "Para más información sobre GreenLake Village, te invito a explorar nuestro sitio web o contactar con nuestro servicio al cliente.";
                }
                
                this.addBotMessage(response);
                return;
            }

            // Prepare messages array with system message and conversation history
            const messages = [
                { role: 'system', content: systemMessage },
                // Include previous conversation history (up to a reasonable limit)
                ...this.conversationHistory.slice(-10) // Limit to last 10 messages to avoid token limits
            ];

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: 512,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot message to chat
            this.addBotMessage(botResponse);
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            
            // More specific error message based on error type
            if (error.message.includes('413')) {
                this.addBotMessage("Lo siento, la consulta es demasiado larga para procesarla. Por favor, intenta con una pregunta más corta.");
            } else {
                this.addBotMessage("Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo más tarde.");
            }
        }
    }
    
    /**
     * Get relevant content from current page - simplified to reduce payload size
     */
    getPageContent() {
        // Extract just the page title as context to reduce payload size
        const pageTitle = document.title;
        return `Page: ${pageTitle}`;
    }
    
    /**
     * Scroll messages area to bottom
     */
    scrollToBottom() {
        this.messageArea.scrollTop = this.messageArea.scrollHeight;
    }
}

// Initialize the chatbot when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new ChatBot();
    chatbot.init();
});
