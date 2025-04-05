/**
 * GreenLake Assistant Chatbot
 * Powered by GROQ API
 */

// Use a conditional declaration to prevent redefinition
if (typeof window.ChatBotClass === 'undefined') {
  // Define the class in a namespace to avoid global redeclaration
  window.ChatBotClass = class ChatBot {
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
      this.apiUrl = "https://api.groq.com/openai/v1/chat/completions";
      this.apiKey = null;
      this.model = "llama-3.1-8b-instant";

      // The auth header will be securely retrieved from DOM data attribute
      this.headerKey = null;
    }

    /**
     * Initialize the chatbot
     */
    async init() {
      this.container = document.getElementById("chatbot-container");
      this.toggleButton = document.getElementById("chatbot-toggle");
      this.chatWindow = document.getElementById("chatbot-window");
      this.messageArea = document.getElementById("chatbot-messages");
      this.form = document.getElementById("chatbot-form");
      this.input = document.getElementById("chatbot-input");
      this.closeButton = document.getElementById("chatbot-close");

      if (!this.container) return;

      try {
        this.headerKey = this.container.dataset.messageOfTheDay || "";

        // Load API key and configuration from backend
        await this.loadConfig();

        // Add event listeners
        this.toggleButton.addEventListener("click", () => this.toggleChat());
        this.closeButton.addEventListener("click", () => this.closeChat());
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));

        // Add welcome message
        setTimeout(() => {
          const welcomeMessage =
            "¡Hola! Soy el asistente de GreenLake. ¿En qué puedo ayudarte hoy?";
          this.addBotMessage(welcomeMessage);
        }, 500);
      } catch (error) {
        console.error("Failed to initialize chatbot:", error);
      }
    }

    /**
     * Load API configuration from backend
     */
    async loadConfig() {
      try {
        const response = await fetch("/api/config/chatbot", {
          headers: {
            Authorization: this.headerKey,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.status}`);
        }
        const config = await response.json();

        // Update configuration if we have valid values
        if (config.apiKey && config.apiKey !== "null") {
          this.apiKey = config.apiKey;
        } else {
          console.warn("No valid API key received from server");
        }
      } catch (error) {
        console.error("Error loading chatbot configuration:", error);
      }
    }

    /**
     * Toggle chatbot window
     */
    toggleChat() {
      this.isOpen = !this.isOpen;
      this.chatWindow.classList.toggle("hidden", !this.isOpen);

      if (this.isOpen) {
        this.input.focus();
      }
    }

    /**
     * Close chatbot window
     */
    closeChat() {
      this.isOpen = false;
      this.chatWindow.classList.add("hidden");
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
      this.input.value = "";

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
      const message = document.createElement("div");
      message.className = "message user-message";
      message.textContent = text;
      this.messageArea.appendChild(message);

      // Add to conversation history
      this.conversationHistory.push({ role: "user", content: text });

      this.scrollToBottom();
    }

    /**
     * Add bot message to chat
     */
    addBotMessage(text) {
      // Add to UI
      const message = document.createElement("div");
      message.className = "message bot-message";
      
      // Parse markdown and set HTML
      message.innerHTML = this.parseMarkdown(text);
      
      this.messageArea.appendChild(message);

      // Add to conversation history
      this.conversationHistory.push({ role: "assistant", content: text });

      this.scrollToBottom();
    }

    /**
     * Parse simple Markdown to HTML
     */
    parseMarkdown(text) {
      // Sanitize the text first to prevent XSS
      text = this.escapeHTML(text);
      
      // Process lists (both * and - bullet points)
      text = text.replace(/^\s*[\*\-]\s+(.+)$/gm, '<li>$1</li>');
      text = text.replace(/<li>(.+)<\/li>\n<li>/g, '<li>$1</li>\n<li>');
      
      // Wrap consecutive list items in <ul> tags
      let hasLists = text.includes('<li>');
      if (hasLists) {
        text = text.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
        // Fix nested lists
        text = text.replace(/<\/ul>\n<ul>/g, '');
      }
      
      // Bold text
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Italic text
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
      text = text.replace(/_(.*?)_/g, '<em>$1</em>');
      
      // Links
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
      
      // Auto-link URLs
      text = text.replace(/(\s|^)(https?:\/\/[^\s]+)/g, '$1<a href="$2" target="_blank">$2</a>');
      
      // Convert line breaks
      text = text.replace(/\n/g, '<br>');
      
      return text;
    }
    
    /**
     * Escape HTML special characters to prevent XSS
     */
    escapeHTML(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
      this.isWaitingForResponse = true;
      const indicator = document.createElement("div");
      indicator.className = "typing-indicator";
      indicator.innerHTML = "<span></span><span></span><span></span>";
      indicator.id = "typing-indicator";
      this.messageArea.appendChild(indicator);
      this.scrollToBottom();
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
      this.isWaitingForResponse = false;
      const indicator = document.getElementById("typing-indicator");
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

        // Hotel prices data (extracted from precio_hoteles.xlsx)
        const hotelPricesData = `
		hotel_nombre	fecha	tasa_ocupacion	reservas_confirmadas	cancelaciones	precio_promedio_noche(x/100 = €)
		Synergy Golden Grand Hotel	2024-12-31 55	243	41	13134
		InfoSight Boutique Hotel	2024-12-31 32	129	13	11313
		Pointnext Signature Residences & Suites	2024-12-31 57	243	29	17974
		Simplivity Golden Plaza Hotel	2024-12-31 45	187	28	11057
		Ezmeral Grand Hotel	2024-12-31 41	118	19	11504
		Primera Grand	2024-12-31 31	90	16	9217
		Aruba Luxury Lodge	2024-12-31 51	135	16	19232
		ProLiant Place	2024-12-31 46	123	22	9666
		GreenLake Platinum Heritage Inn	2024-12-31 36	101	12	11432
		Nimble Inn	2024-12-31 47	159	27	18255
		Alletra Haven	2024-12-31 52	150	14	13101
		Alletra Diamond Grand Hotel	2024-12-31 31	73	6	10384
		Alletra Resort	2024-12-31 52	137	19	12841
		Apollo Executive Beach Resort	2024-12-31 49	225	41	15186
		Apollo Diamond Suites	2024-12-31 49	180	27	18898
		dHCI Executive Boutique Hotel	2024-12-31 46	131	16	14122
		dHCI Platinum Beach Resort	2024-12-31 36	141	15	13866
		Apollo Resort & Spa	2024-12-31 37	102	20	15912
		Cray Villas	2024-12-31 58	244	38	11097
		ProLiant Towers	2024-12-31 37	164	8	13859
		Alletra Boutique Hotel	2024-12-31 44	120	14	12382
		Apollo Towers	2024-12-31 32	151	23	8762
		Aruba Lodge	2024-12-31 54	239	31	20433
		ProLiant Haven	2024-12-31 56	139	15	14023
		GreenLake Digital Business Suites	2024-12-31 59	147	12	17124`;

        // Tourist routes data (extracted from rutas_turisticas.csv)
        const touristRoutesData = `
		ruta_nombre;tipo_ruta;longitud_km;duracion_hr;popularidad
		Aruba Central - 1.9;Cultural;26.7;1.9;4.7
		Nimble Peak - 3.2;Aventura;31.5;3.2;4.1
		Composable Cloud - 6.1;Aventura;79.5;6.1;3.4
		Nimble Peak - 4.7;Gastronómica;45.2;4.7;4.5
		Nimble Peak - 5.7;Histórica;74.2;5.7;3.2
		Ezmeral Valley - 5.2;Ecológica;47.6;5.2;3.6
		Ezmeral Valley - 6.0;Histórica;81.8;6.0;3.2
		ProLiant Village - 6.9;Cultural;93.0;6.9;3.3
		Apollo Heights - 6.2;Aventura;87.1;6.2;3.3
		Aruba Central - 7.2;Gastronómica;93.0;7.2;3.6
		ProLiant Village - 3.2;Aventura;23.0;3.2;3.1
		ProLiant Village - 1.0;Gastronómica;10.4;1.0;4.0
		ProLiant Village - 16.6;Cultural;96.3;16.6;3.4
		Composable Cloud - 3.0;Aventura;43.4;3.0;4.1
		Composable Cloud - 1.1;Ecológica;12.8;1.1;4.1
		Simplivity Springs - 8.4;Aventura;68.6;8.4;3.5
		GreenLake Shores - 2.8;Histórica;35.0;2.8;3.1
		Apollo Heights - 5.6;Cultural;56.1;5.6;3.3
		Simplivity Springs - 6.1;Aventura;40.1;6.1;4.7
		Alletra City - 6.5;Cultural;68.4;6.5;4.9
		Nimble Peak - 2.6;Gastronómica;16.0;2.6;4.1
		Alletra City - 3.0;Ecológica;25.0;3.0;4.4
		Alletra City - 2.1;Histórica;28.9;2.1;3.1
		HPE Innovation Hub - 0.4;Cultural;5.3;0.4;4.3
		Alletra City - 6.2;Histórica;57.4;6.2;3.0
		Nimble Peak - 1.0;Ecológica;8.4;1.0;4.1
		HPE Innovation Hub - 2.5;Cultural;34.3;2.5;4.6
		Aruba Central - 6.0;Aventura;69.8;6.0;3.7
		ProLiant Village - 5.3;Ecológica;76.2;5.3;3.5
		GreenLake Shores - 0.6;Histórica;7.4;0.6;3.7
		HPE Innovation Hub - 1.7;Gastronómica;20.1;1.7;3.8
		Aruba Central - 1.7;Aventura;24.0;1.7;3.7
		Ezmeral Valley - 7.5;Cultural;67.7;7.5;3.6
		Nimble Peak - 7.3;Gastronómica;65.9;7.3;5.0
		ProLiant Village - 1.1;Cultural;16.0;1.1;3.4
		Alletra City - 7.3;Cultural;61.7;7.3;4.6
		HPE Innovation Hub - 3.9;Cultural;41.6;3.9;3.5
		HPE Innovation Hub - 8.9;Ecológica;92.9;8.9;4.4
		Ezmeral Valley - 1.0;Histórica;11.6;1.0;3.7
		Simplivity Springs - 4.6;Gastronómica;53.2;4.6;3.7
		Alletra City - 2.0;Aventura;23.2;2.0;3.8
		GreenLake Shores - 11.4;Histórica;57.1;11.4;3.6
		HPE Innovation Hub - 4.0;Histórica;47.0;4.0;4.0
		GreenLake Shores - 4.8;Gastronómica;54.0;4.8;3.7
		Ezmeral Valley - 12.6;Aventura;81.6;12.6;3.1
		Apollo Heights - 3.9;Histórica;44.4;3.9;3.4
		HPE Innovation Hub - 2.4;Histórica;28.2;2.4;3.0
		Nimble Peak - 1.5;Aventura;21.7;1.5;4.0
		Aruba Central - 14.8;Aventura;92.2;14.8;3.3
		Apollo Heights - 4.2;Ecológica;61.6;4.2;4.8`;

        // Reviews data (extracted from opiniones_turisticas.csv)
        const reviewsData = `
		fecha,tipo_servicio,nombre_servicio,puntuacion,comentario,idioma
		2022-12-26,Servicio,Industrias Llabrés y asociados S.Com. Parque,4,Experiencia agradable. instalaciones impecables. Recomendable.,es
		2019-01-29,Ruta,Nimble Peak - HPE Innovation Hub,1,Ruta decepcionante. puntos de interés cerrados. No la recomiendo.,es
		2024-07-30,Ruta,HPE Innovation Hub - Apollo Heights,3,"Ruta aceptable. vistas impresionantes, pero puntos de interés cerrados.",es
		2020-03-05,Hotel,ProLiant Place,4,Buena estancia en general. personal amable. Solo el wifi era un poco lento.,es
		2022-04-25,Ruta,GreenLake Shores - Alletra City,4,Mi experiencia en la ruta turística 'GreenLake Shores - Alletra City' fue muy agradable y la calificaría con 4/5 estrellas. El recorrido es seguro con señalización clara y senderos bien mantenidos lo que me permitió disfrutar del paisaje sin preocupaciones. Aunque hubo algunos momentos en los que las áreas más populares estaban un poco concurridas especialmente cerca del lago no fue algo que arruinara la experiencia. De hecho conocí a un compañero de viaje llamado Carlos quien me contó historias fascinantes sobre la región y me recomendó un pequeño mirador escondido que resultó ser el punto más tranquilo y hermoso del recorrido. Mi consejo para otros viajeros es que lleven agua suficiente y lleguen temprano para evitar las multitudes en los puntos más visitados. En general fue una,es
		2024-10-15,Hotel,Apollo Towers,4,Experiencia agradable. instalaciones modernas. Recomendable.,es
		2019-07-22,Servicio,Caballero y Palomar S.L.L. Museo,4,Buen servicio en general. personal atento. Solo un detalle del menú no estaba disponible.,es
		2022-03-24,Servicio,Despacho IJFU S.Coop. Museo,2,Servicio deficiente. falta de opciones. Necesita mejorar mucho.,es
		2020-07-09,Hotel,Simplivity Golden Plaza Hotel,5,Excelente hotel. instalaciones modernas. habitaciones cómodas. ¡Volveré seguro!,es
		2022-10-13,Servicio,Fábrica Navarro S.A. Parque,4,Experiencia agradable. personal atento. Recomendable.,es
		2022-11-18,Ruta,Simplivity Springs - Alletra City,5,¡Ruta espectacular! bien organizada. vistas impresionantes. Imprescindible.,es
		2023-03-19,Hotel,Pointnext Signature Residences & Suites,5,Experiencia increíble. desayuno delicioso. Lo mejor: habitaciones cómodas.,es
		2019-12-14,Hotel,Aruba Lodge,5,Experiencia increíble. desayuno delicioso. Lo mejor: instalaciones modernas.,es
		2023-02-01,Servicio,Guadalupe Molins Salas S.Coop. Atracción,3,"Servicio aceptable. excelente relación calidad-precio, pero falta de opciones.",es
		2024-05-13,Servicio,Manufacturas Bueno & Asociados S.L. Museo,4,Experiencia agradable. excelente relación calidad-precio. Recomendable.,es
		2020-02-14,Hotel,GreenLake Digital Business Suites,4,Experiencia agradable. desayuno delicioso. Recomendable.,es
		2020-10-08,Hotel,Apollo Towers,5,Experiencia increíble. desayuno delicioso. Lo mejor: habitaciones cómodas.,es
		2021-04-24,Servicio,Fábrica Navarro S.A. Parque,2,Servicio deficiente. instalaciones descuidadas. Necesita mejorar mucho.,es
		2023-05-30,Ruta,Alletra City - ProLiant Village,1,¡Qué decepción total la ruta turística 'Alletra City - ProLiant Village'! No puedo creer que alguien la recomiende como una experiencia agradable. Desde el principio todo fue un desastre. La seguridad es prácticamente inexistente: caminos mal iluminados señalización confusa y ni un solo guardia o personal de apoyo en caso de emergencia. ¡Es increíble que no haya habido ningún incidente grave durante mi visita! Además las multitudes eran insoportables. Parecía que todo el mundo decidió ir el mismo día que yo. No podías caminar sin chocar con alguien y el ruido constante era agotador. ¡Ni siquiera pude disfrutar de las supuestas 'vistas espectaculares' porque había gente por todos lados! Para colmo el guía que nos asignaron un tal 'Juan' parecía más interesado en su teléfono que en explicar algo útil. ¡No sabía ni siquiera responder preguntas básicas sobre la historia del lugar! Y no hablemos de los otros viajeros... una señora llamada Marta no paraba de quejarse de todo lo cual solo añadió más estrés a la experiencia. ¡Fue un día perdido y un dinero tirado a la basura! Mi consejo para otros,es
		2022-04-30,Hotel,Apollo Diamond Suites,4,Experiencia agradable. habitaciones cómodas. Recomendable.,es
		2019-10-26,Ruta,HPE Innovation Hub - ProLiant Village,5,¡Ruta espectacular! puntos de interés fascinantes. vistas impresionantes. Imprescindible.,es
		2024-09-07,Servicio,Dávila y Mascaró S.Com. Atracción,5,Experiencia increíble. instalaciones impecables. Lo mejor: gran variedad de opciones.,es
		2020-04-29,Servicio,Despacho IJFU S.Coop. Museo,2,Mi experiencia con el servicio de **Despacho IJFU S.Coop. Museo** fue bastante decepcionante. En cuanto a la **comunicación** sentí que fue muy deficiente. No recibí respuestas claras ni oportunas a mis consultas lo que generó mucha frustración. Parecía que no había un interés real en resolver mis dudas o mantener un diálogo fluido. En relación con la **resolución de problemas** el servicio dejó mucho que desear. Cuando surgió un inconveniente con mi pedido no hubo una solución rápida ni efectiva. Me sentí ignorado y sin opciones claras para resolver el problema lo que alargó innecesariamente el proceso. En cuanto al **valor** considero que el servicio no justifica el costo. Esperaba un trato más profesional y eficiente pero en su lugar me encontré con un servicio lento y poco,es
		2021-11-10,Ruta,Ezmeral Valley - Composable Cloud,4,Buena ruta en general. guía muy informativo. Solo el tiempo de descanso fue corto.,es
		2022-01-16,Ruta,Apollo Heights - Nimble Peak,3,¡Vaya decepción con la ruta 'Apollo Heights - Nimble Peak'! La dificultad está muy mal indicada. ¡Te venden como una caminata 'moderada' y terminas luchando contra pendientes interminables y terrenos resbaladizos! ¡No es para principiantes eso seguro! El paisaje aunque bonito en algunos tramos no compensa el esfuerzo excesivo. Además en mi caso el día estaba nublado y apenas se veía la famosa vista del pico... ¡qué frustración! Eso sí si decides intentarlo lleva calzado con buen agarre y bastones de trekking.,es
		2019-09-01,Hotel,Alletra Diamond Grand Hotel,4,Experiencia agradable. excelente ubicación. Recomendable.,es
		2021-06-10,Servicio,Servicios Internacionales S.C.P Tienda,5,¡Servicio excelente! personal atento. instalaciones impecables. Volveré sin duda.,es
		2019-09-25,Hotel,GreenLake Digital Business Suites,4,¡¡¡QUÉ EXPERIENCIA TAN INCREÍBLE EN GREENLAKE DIGITAL BUSINESS SUITES!!! 😍✨ ¡Me encantó absolutamente TODO! ¡El valor por el precio es INSUPERABLE! 💸💯 Por lo que pagamos ¡NOS SORPRENDIÓ la calidad del servicio y las comodidades! ¡Las habitaciones son ENORMES! �🛏️ ¡Teníamos tanto espacio que podríamos haber hecho yoga sin problema! 😂 ¡Y LA LIMPIEZA DIOS MÍO IMPECABLE! �✨ Todo relucía desde el baño hasta las sábanas ¡parecía que acababan de estrenar la habitación para nosotros! 🛁🧼 ¡Un detalle que nos encantó fue el DESAYUNO INCLUIDO! 🥐☕ ¡Era delicioso,es
		2019-01-26,Servicio,Banco Mendez S.Com. Restaurante,5,¡Qué experiencia increíble en el Banco Méndez S.Com. Restaurante! Sin duda merece un 5/5 estrellas. Desde el momento en que entré me sorprendió la calidad del servicio y la atención al detalle. El valor por el precio es excepcional: los platos son generosos frescos y llenos de sabor pero sin que te dejen la cartera vacía. Pedí el filete de res con salsa de champiñones y ¡vaya que estaba jugoso y perfectamente cocido! Además las instalaciones son impecables: un ambiente acogedor con una decoración moderna pero cálida y todo súper limpio. Me encantó el detalle de las mesas bien iluminadas y el espacio amplio que hace que te sientas cómodo desde el primer momento. El personal también fue muy atento y amable siempre dispuesto a ayudar. Definitivamente volveré y lo recomendaré a todos mis amigos. ¡Un 10/10 en todo! Solo un pequeño detalle: el menú tenía un par de errores de ortografía (como 'ensalada cesar' en lugar de 'César') pero eso no afectó para nada la experiencia. ¡Bravo por Banco Méndez! 👏🍴,es
		2024-07-27,Servicio,Restauración del Sur S.Com. Tour Guiado,5,[Error: Could not generate text due to API failure],unknown
		2020-08-18,Hotel,Alletra Haven,3,"Experiencia promedio. desayuno delicioso, pero desayuno de baja calidad.",es`;

        // Prepare system message with limited context
        const systemMessage = `You are GreenLake Assistant, a helpful AI assistant for the GreenLake Village sustainable tourism website. 
            The user is currently on the page "${pageTitle}" at path "${pagePath}".

            Here is the content of the page: "${pageContent}".

            HOTEL PRICING INFORMATION:
            ${hotelPricesData}
            
            TOURIST ROUTES INFORMATION:
            ${touristRoutesData}
            
            CUSTOMER REVIEWS:
            ${reviewsData}

            Respond in the same language the user writes in. Be concise, friendly and helpful.
            Keep answers relevant to sustainable tourism, activities, and services at GreenLake Village.
            No talking about personal information, code of the page, variables or unrelated topics.
            
            IMPORTANT: Use Markdown formatting in your responses for better readability:
            - Use * or - for bullet point lists
            - Use **text** for bold text
            - Use *text* or _text_ for italic text
            - Use [text](URL) for links
            
            Think two times before sending a message, and always be respectful.`;

        // For development purposes, provide a fallback response if API key is not set
        if (!this.apiKey || this.apiKey === "null") {
          console.warn("No API key available for GROQ API call");
          this.hideTypingIndicator();

          // Generate a simple response based on user query keywords
          let response =
            "Lo siento, actualmente estoy en modo de desarrollo y no puedo procesar tu consulta. ";

          if (
            userMessage.toLowerCase().includes("hotel") ||
            userMessage.toLowerCase().includes("alojamiento")
          ) {
            response +=
              "Para información sobre alojamiento, te recomiendo visitar nuestra página de establecimientos o contactar con recepción.";
          } else if (
            userMessage.toLowerCase().includes("actividad") ||
            userMessage.toLowerCase().includes("hacer")
          ) {
            response +=
              "Tenemos muchas actividades disponibles en GreenLake Village. Puedes explorarlas en la sección de Actividades.";
          } else if (
            userMessage.toLowerCase().includes("restaurante") ||
            userMessage.toLowerCase().includes("comer")
          ) {
            response +=
              "Hay varios restaurantes en GreenLake Village que ofrecen cocina local e internacional.";
          } else {
            response +=
              "Para más información sobre GreenLake Village, te invito a explorar nuestro sitio web o contactar con nuestro servicio al cliente.";
          }

          this.addBotMessage(response);
          return;
        }

        // Prepare messages array with system message and conversation history
        const messages = [
          { role: "system", content: systemMessage },
          // Include previous conversation history (up to a reasonable limit)
          ...this.conversationHistory.slice(-10), // Limit to last 10 messages to avoid token limits
        ];

        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: messages,
            max_tokens: 512,
            temperature: 0.7,
          }),
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
        console.error("Error getting AI response:", error);
        this.hideTypingIndicator();

        // More specific error message based on error type
        if (error.message.includes("413")) {
          this.addBotMessage(
            "Lo siento, la consulta es demasiado larga para procesarla. Por favor, intenta con una pregunta más corta."
          );
        } else {
          this.addBotMessage(
            "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo más tarde."
          );
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

  // Initialize the chatbot only once when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    // Check if chatbot is already initialized
    if (!window.chatbotInstance) {
      window.chatbotInstance = new window.ChatBotClass();
      window.chatbotInstance.init();
    }
  });
}
