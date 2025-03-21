/**
 * Módulo encargado de realizar las consultas a la API REST
 * desde las paginas de acceso y salida de la web
 */

import { base } from "../../../../api/models/usersModel";

//URL base de la API REST

const baseURL = "api/auth"

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

const logoutUser = () => {
    return fetch(`${baseURL}/logout`, {
        methor: "GET",
        credentials: "include"
    });
}

const registerUser = (data) => {
    const datos = Object.fromEntries(data);
    return fetch(`${baseURL}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(datos),
        credentials: "include",
    });
};

export {loginUser, logoutUser, registerUser};