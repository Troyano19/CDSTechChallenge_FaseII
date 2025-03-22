import * as access_api from "./modules/rest-api/access-rest-api.mjs"

// Client-side validation for username (no @ symbol)
function validateUsername(username) {
    if (username.includes('@')) {
        return "El nombre de usuario no puede contener @";
    }
    return null;
}

// Client-side validation for email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Por favor introduce un email válido";
    }
    return null;
}

// Client-side validation for password
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        return "La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 1 minúscula y un número";
    }
    return null;
}

// Show error message with window.alert
function showError(formId, message) {
    console.log("Showing error:", message); // Debug log
    window.alert(message);
}

// Clear error message (not needed for alerts, but keeping for compatibility)
function clearError(formId) {
    // No need to clear when using alerts
}

const loginHandler = async (event) => {
    console.log("Login handler triggered"); // Debug log
    // Always prevent default form submission
    event.preventDefault();
    
    // Get form data
    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!identifier || !password) {
        showError('loginForm', "Por favor completa todos los campos");
        return false; // Prevent further execution
    }
    
    try {
        // Create form data
        const formData = new FormData();
        formData.append('identifier', identifier);
        formData.append('password', password);
        
        // Send login request
        const response = await access_api.loginUser(formData);
        const data = await response.json();
        
        if (response.status !== 200) {
            showError('loginForm', data.message || "Error al iniciar sesión");
            return false; // Prevent further execution
        }
        
        // Redirect on successful login
        window.location.href = '/';
    } catch (err) {
        console.error("Error en login:", err);
        showError('loginForm', "Ha habido un problema al iniciar sesión");
    }
    return false; // Always prevent default form action
};

const registerHandler = async (event) => {
    console.log("Register handler triggered"); // Debug log
    // Always prevent default form submission
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const surnames = document.getElementById('surnames').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Client-side validation
    if (!name || !surnames || !username || !email || !password || !confirmPassword) {
        showError('registerForm', "Por favor completa todos los campos");
        return false; // Prevent further execution
    }
    
    // Validate username - explicitly check and show alert
    if (username.includes('@')) {
        showError('registerForm', "El nombre de usuario no puede contener @");
        return false;
    }
    
    // Other validations
    const emailError = validateEmail(email);
    if (emailError) {
        showError('registerForm', emailError);
        return false;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
        showError('registerForm', passwordError);
        return false;
    }
    
    if (password !== confirmPassword) {
        showError('registerForm', "Las contraseñas no coinciden");
        return false;
    }
    
    try {
        // Create form data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('surnames', surnames);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        
        // Send register request
        const response = await access_api.registerUser(formData);
        const data = await response.json();
        
        if (response.status !== 200) {
            showError('registerForm', data.message || "Error al registrar usuario");
            return false;
        }
        
        // Redirect on successful registration
        window.location.href = '/';
    } catch (err) {
        console.error("Error en registro:", err);
        showError('registerForm', "Ha ocurrido un error al registrarte");
    }
    
    return false;
};

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, setting up event listeners"); // Debug log
    
    // Login form listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log("Login form found, attaching event listener");
        loginForm.addEventListener('submit', (e) => {
            console.log("Login form submitted");
            e.preventDefault();
            loginHandler(e);
            return false;
        });
        loginForm.onsubmit = function() { return false; };
    }
    
    // Register form listener
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log("Register form found, attaching event listener");
        registerForm.addEventListener('submit', (e) => {
            console.log("Register form submitted");
            e.preventDefault();
            registerHandler(e);
            return false;
        });
        registerForm.onsubmit = function() { return false; };
    }
});