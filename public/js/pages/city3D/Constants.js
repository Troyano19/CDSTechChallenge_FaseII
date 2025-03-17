// Variables para el control de la cámara
export const CAMERA_SETTINGS = {
    fov: 75,
    near: 0.1,
    far: 1000,
    initialPosition: new THREE.Vector3(2, 17, 6),
    lookAt: new THREE.Vector3(21.5, 4.7, -6.6),
    zoomSpeed: 0.1,
    minZoom: 5,
    maxZoom: 200,
    positionLimits: 200, // Límite para las coordenadas [-200, 200]
    rotationSpeed: 0.005,
    movementSpeed: 0.8
};

// Variables para el control de teclado
export const KEYS = {
    // WASD
    KeyW: false, 
    KeyA: false,
    KeyS: false,
    KeyD: false,
    // Flechas
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false
};

// Cantidad mínima de movimiento para considerar un arrastre vs clic
export const MIN_DRAG_THRESHOLD = 5;

// Tiempo de espera después de cerrar el panel de info (ms)
export const INFO_PANEL_COOLDOWN = 1000;
