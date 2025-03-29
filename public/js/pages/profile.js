/**
 * Profile page functionality
 */
import * as sessionUtils from '../utils/session.js';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils.js';

document.addEventListener('DOMContentLoaded', async function() {
    
    // Fetch user data from the server
    let userData;
    try {
        const response = await fetch('/api/auth/user-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                throw new Error(data.message || 'Error fetching user data');
            } else {
                throw new Error('Error fetching user data: Server returned ' + response.status);
            }
        }

        userData = await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        showError('Error al cargar los datos del usuario. Por favor, recarga la página o vuelve a intentarlo más tarde.');
        showErrorToast('Error al cargar los datos del usuario');
        return;
    }

    populateUserProfile(userData);
    
    // Set up form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Set up delete account button
    const deleteAccountBtn = document.getElementById('delete-account');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', showDeleteAccountModal);
    }
    
    // Set up delete account modal events
    setupDeleteAccountModal();
    
    // Set up profile image upload
    const profileImageUpload = document.getElementById('profile-image-upload');
    if (profileImageUpload) {
        profileImageUpload.addEventListener('change', handleProfileImageUpload);
    }
    
    // Set up logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async function() {
            try {
                await sessionUtils.logout();
                // Redirect is handled by the logout function
                showSuccessToast('Sesión cerrada correctamente');
            } catch (error) {
                showError(error.message || 'Error al cerrar sesión');
                showErrorToast('Error al cerrar sesión');
            }
        });
    }
});

/**
 * Populate the profile form with user data
 */
function populateUserProfile(userData) {
    // Display name and email in header
    const userDisplayName = document.getElementById('user-display-name');
    const userEmail = document.getElementById('user-email');
    const registrationMethod = document.getElementById('registration-method');
    
    if (userDisplayName) userDisplayName.textContent = userData.username || 'Usuario';
    if (userEmail) userEmail.textContent = userData.email || '';
    
    // Display registration method
    if (registrationMethod) {
        let methodText = '';
        switch(userData.registrationmethod) {
            case 'GOOGLE':
                methodText = 'Cuenta vinculada con Google';
                break;
            case 'DISCORD':
                methodText = 'Cuenta vinculada con Discord';
                break;
            default:
                methodText = 'Cuenta estándar';
        }
        registrationMethod.textContent = methodText;
    }
    
    // Set profile image if available
    const profileImage = document.getElementById('profile-image');
    if (profileImage && userData.pfp) {
        profileImage.src = userData.pfp;
    }
    
    // Populate form fields
    const nameInput = document.getElementById('name');
    const surnamesInput = document.getElementById('surnames');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    
    if (nameInput) nameInput.value = userData.name || '';
    if (surnamesInput) surnamesInput.value = userData.surnames || '';
    if (usernameInput) usernameInput.value = userData.username || '';
    if (emailInput) emailInput.value = userData.email || '';
    
    // Disable name and surnames fields for regular accounts that have already set them
    if (userData.registrationmethod === 'DEFAULT') {
        if (nameInput) {
            nameInput.disabled = true;
            nameInput.title = 'No se puede cambiar el nombre en cuentas estándar';
        }
        if (surnamesInput) {
            surnamesInput.disabled = true;
            surnamesInput.title = 'No se pueden cambiar los apellidos en cuentas estándar';
        }
    } else if (userData.hasEditedProfile) {
        // If social account has already edited their profile, disable name and surnames
        if (nameInput) {
            nameInput.disabled = true;
            nameInput.title = 'Ya has editado tu nombre una vez';
        }
        if (surnamesInput) {
            surnamesInput.disabled = true;
            surnamesInput.title = 'Ya has editado tus apellidos una vez';
        }
    }
}

/**
 * Handle profile form submission
 */
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const errorElement = document.getElementById('profile-error');
    const successElement = document.getElementById('profile-success');
    
    // Hide any previous messages
    if (errorElement) errorElement.style.display = 'none';
    if (successElement) successElement.style.display = 'none';
    
    // Get form data
    const formData = new FormData(event.target);
    
    // Validate password fields if they're provided
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // If any password field is filled, all must be filled
    if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showError('Para cambiar la contraseña, todos los campos de contraseña deben estar completos');
            showErrorToast('Todos los campos de contraseña son requeridos');
            return;
        }
        
        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            showError('Las nuevas contraseñas no coinciden');
            showErrorToast('Las nuevas contraseñas no coinciden');
            return;
        }
        
        // Check password strength
        if (!isPasswordValid(newPassword)) {
            showError('La nueva contraseña no cumple con los requisitos mínimos');
            showErrorToast('La contraseña no cumple los requisitos');
            return;
        }
    }
    
    // Validate other fields
    const username = formData.get('username');
    const email = formData.get('email');
    const name = formData.get('name');
    const surnames = formData.get('surnames');
    
    // Check username
    if (!isUsernameValid(username)) {
        showError('El nombre de usuario debe tener entre 4 y 20 caracteres y solo letras y números');
        showErrorToast('Nombre de usuario inválido');
        return;
    }
    
    // Check email
    if (!isEmailValid(email)) {
        showError('Por favor introduce un email válido');
        showErrorToast('Email inválido');
        return;
    }
    
    // Check name and surnames
    if (!isNameValid(name) || !isNameValid(surnames)) {
        showError('El nombre y los apellidos solo pueden contener letras');
        showErrorToast('Nombre o apellidos inválidos');
        return;
    }
    
    try {
        // Send update request to the server
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                name,
                surnames,
                currentPassword: currentPassword || undefined,
                newPassword: newPassword || undefined
            }),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error actualizando el perfil');
        }
        
        // Show success message
        showSuccess('Perfil actualizado correctamente');
        showSuccessToast('Perfil actualizado correctamente');
        
        // Clear password fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    } catch (error) {
        showError(error.message || 'Error actualizando el perfil');
        showErrorToast(error.message || 'Error actualizando el perfil');
    }
}

/**
 * Handle showing the delete account modal
 */
function showDeleteAccountModal() {
    const modal = document.getElementById('delete-account-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * Handle hiding the delete account modal
 */
function hideDeleteAccountModal() {
    const modal = document.getElementById('delete-account-modal');
    if (modal) {
        modal.classList.remove('show');
        // Reset the form
        document.getElementById('delete-account-password').value = '';
        document.getElementById('confirm-deletion').checked = false;
        document.getElementById('delete-account-error').style.display = 'none';
    }
}

/**
 * Set up event listeners for the delete account modal
 */
function setupDeleteAccountModal() {
    // Close modal when clicking close button
    const closeBtn = document.querySelector('#delete-account-modal .modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideDeleteAccountModal);
    }
    
    // Close modal when clicking cancel button
    const cancelBtn = document.getElementById('cancel-delete');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideDeleteAccountModal);
    }
    
    // Handle confirm delete button
    const confirmBtn = document.getElementById('confirm-delete');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleConfirmDelete);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('delete-account-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                hideDeleteAccountModal();
            }
        });
    }
}

/**
 * Handle account deletion confirmation from the modal
 */
async function handleConfirmDelete() {
    const password = document.getElementById('delete-account-password').value;
    const confirmCheckbox = document.getElementById('confirm-deletion').checked;
    const errorElement = document.getElementById('delete-account-error');
    
    // Reset error message
    errorElement.style.display = 'none';
    
    // Validate inputs
    if (!password) {
        errorElement.textContent = 'Por favor, introduce tu contraseña';
        errorElement.style.display = 'block';
        return;
    }
    
    if (!confirmCheckbox) {
        errorElement.textContent = 'Debes confirmar que entiendes las consecuencias';
        errorElement.style.display = 'block';
        return;
    }
    
    try {
        // Call the deleteAccount function with the password
        await sessionUtils.deleteAccount(password);
        
        // Show success toast before redirect
        showSuccessToast('Cuenta eliminada correctamente');
        
        // Hide the modal
        hideDeleteAccountModal();
        
        // Redirect to home page after successful deletion
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    } catch (error) {
        errorElement.textContent = error.message || 'Error al eliminar la cuenta';
        errorElement.style.display = 'block';
        showErrorToast(error.message || 'Error al eliminar la cuenta');
    }
}

/**
 * Handle account deletion
 * @deprecated Use handleConfirmDelete instead
 */
async function handleDeleteAccount() {
    // Now handled by the modal
    showDeleteAccountModal();
}

/**
 * Handle profile image upload
 */
async function handleProfileImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
        showError('Solo se permiten archivos de imagen');
        showErrorToast('Solo se permiten archivos de imagen');
        return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showError('El tamaño máximo de la imagen es 2MB');
        showErrorToast('El tamaño máximo de la imagen es 2MB');
        return;
    }
    
    const formData = new FormData();
    formData.append('profileImage', file);
    
    try {
        const response = await fetch('/api/user/profile/image', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error subiendo la imagen');
        }
        
        const data = await response.json();
        
        // Update profile image
        const profileImage = document.getElementById('profile-image');
        if (profileImage && data.imageUrl) {
            profileImage.src = data.imageUrl + '?t=' + new Date().getTime(); // Add timestamp to prevent caching
        }
        
        showSuccess('Imagen de perfil actualizada');
        showSuccessToast('Imagen de perfil actualizada');
    } catch (error) {
        showError(error.message || 'Error subiendo la imagen');
        showErrorToast(error.message || 'Error subiendo la imagen');
    }
}

/**
 * Show error message
 */
function showError(message) {
    const errorElement = document.getElementById('profile-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Scroll to error message
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Show success message
 */
function showSuccess(message) {
    const successElement = document.getElementById('profile-success');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        
        // Scroll to success message
        successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Validate username format
 */
function isUsernameValid(username) {
    const regex = /^[a-zA-Z0-9]{4,20}$/;
    return regex.test(username);
}

/**
 * Validate email format
 */
function isEmailValid(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate name format (only letters, including accented characters and Spanish special characters)
 */
function isNameValid(name) {
    const regex = /^[a-zA-ZÑñçÇáéíóúÁÉÍÓÚ\s]+$/;
    return regex.test(name);
}

/**
 * Validate password strength
 */
function isPasswordValid(password) {
    // At least one uppercase, one lowercase, one number, one special char, and min 8 chars
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_*?&])[A-Za-z\d@$!_*?&]{8,}$/;
    return regex.test(password);
}
