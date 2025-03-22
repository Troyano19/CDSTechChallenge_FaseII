/**
 * Módulo encargado de realizar las consultas a la API REST
 * desde las paginas de acceso y salida de la web
 */

//URL base de la API REST
const baseURL = "/api/auth";

/**
 * Inicia sesión en la aplicación
 * 
 * Código de aceptación -> 200
 */
const loginUser = (data) => {
    const datos = Object.fromEntries(data);
    return fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(datos),
        credentials: "include",
    });
}

/**
 * Cierra sesión en la aplicación
 */
const logoutUser = () => {
    return fetch(`${baseURL}/logout`, {
        method: "GET",
        credentials: "include"
    });
}

/**
 * Registra un nuevo usuario
 */
const registerUser = (data) => {
    const datos = Object.fromEntries(data);
    return fetch(`${baseURL}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(datos),
        credentials: "include",
    });
};

/**
 * Verifica si el usuario está autenticado
 */
const checkAuthStatus = () => {
    return fetch(`${baseURL}/status`, {
        method: "GET",
        credentials: "include"
    });
};

export {loginUser, logoutUser, registerUser, checkAuthStatus};