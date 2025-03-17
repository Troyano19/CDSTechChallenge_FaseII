import { CAMERA_SETTINGS } from './Constants.js';

export class CameraManager {
    constructor(scene) {
        this.scene = scene;
        this.setupCamera();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            CAMERA_SETTINGS.fov, 
            window.innerWidth / window.innerHeight, 
            CAMERA_SETTINGS.near, 
            CAMERA_SETTINGS.far
        );
        
        // Configurar cámara (vista en ángulo)
        this.camera.position.copy(CAMERA_SETTINGS.initialPosition);
        
        // Establecer el centro de rotación para la cámara
        this.orbitCenter = CAMERA_SETTINGS.lookAt.clone();
        
        // Guardar posiciones iniciales para reset
        this.initialCameraPosition = CAMERA_SETTINGS.initialPosition.clone();
        this.initialOrbitCenter = CAMERA_SETTINGS.lookAt.clone();
        
        this.camera.lookAt(this.orbitCenter);
    }

    resetCamera() {
        // Restaurar la posición inicial de la cámara
        this.camera.position.copy(this.initialCameraPosition);
        
        // Restaurar también el centro de rotación a su posición original
        this.orbitCenter.copy(this.initialOrbitCenter);
        
        this.camera.lookAt(this.orbitCenter);
    }

    handleWheel(event) {
        event.preventDefault();
        
        // Obtener la dirección del zoom (positivo = alejar, negativo = acercar)
        const zoomDirection = Math.sign(event.deltaY);
        
        // Vector desde el centro de rotación hasta la cámara
        const cameraOffset = new THREE.Vector3().subVectors(
            this.camera.position, 
            this.orbitCenter
        );
        
        // Calcular la distancia actual al centro
        const distance = cameraOffset.length();
        
        // Calcular nueva distancia pero aplicar límites
        const newDistance = Math.min(
            CAMERA_SETTINGS.maxZoom, 
            Math.max(CAMERA_SETTINGS.minZoom, 
                distance * (1 + zoomDirection * CAMERA_SETTINGS.zoomSpeed)
            )
        );
        
        // Normalizar y ajustar a la nueva distancia
        cameraOffset.normalize().multiplyScalar(newDistance);
        
        // Crear posición potencial
        const potentialPosition = new THREE.Vector3().copy(this.orbitCenter).add(cameraOffset);
        
        // Limitar cada componente de la posición
        const limit = CAMERA_SETTINGS.positionLimits;
        potentialPosition.x = Math.min(limit, Math.max(-limit, potentialPosition.x));
        potentialPosition.y = Math.min(limit, Math.max(-limit, potentialPosition.y));
        potentialPosition.z = Math.min(limit, Math.max(-limit, potentialPosition.z));
        
        // Actualizar la posición de la cámara
        this.camera.position.copy(potentialPosition);
        
        // Asegurar que la cámara siga mirando al centro
        this.camera.lookAt(this.orbitCenter);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    handleDrag(deltaMove, isDragging, previousMousePosition) {
        if (!isDragging) return false;
        
        // Vector desde la cámara al centro de rotación
        const cameraOffset = new THREE.Vector3().subVectors(
            this.camera.position, 
            this.orbitCenter
        );
        
        // Rotación horizontal (alrededor del eje Y)
        const angleY = -deltaMove.x * CAMERA_SETTINGS.rotationSpeed;
        
        // Rotación vertical (alrededor del eje X)
        const angleX = deltaMove.y * CAMERA_SETTINGS.rotationSpeed;
        
        // Matriz de rotación para el eje Y (horizontal)
        const rotationMatrixY = new THREE.Matrix4().makeRotationY(angleY);
        cameraOffset.applyMatrix4(rotationMatrixY);
        
        // Calculamos el eje derecho para la rotación vertical
        const right = new THREE.Vector3(1, 0, 0);
        right.applyMatrix4(rotationMatrixY);
        
        // Matriz de rotación para el eje X (vertical)
        const rotationMatrixX = new THREE.Matrix4().makeRotationAxis(right, angleX);
        cameraOffset.applyMatrix4(rotationMatrixX);
        
        // Aplicar la nueva posición de la cámara
        this.camera.position.copy(this.orbitCenter).add(cameraOffset);
        
        // Hacer que la cámara mire al centro
        this.camera.lookAt(this.orbitCenter);
        
        return true;
    }

    moveCamera(keys) {
        // Velocidad de movimiento
        const moveSpeed = CAMERA_SETTINGS.movementSpeed;
        
        // Obtener la dirección en la que la cámara está mirando (proyectada en el plano XZ)
        const lookDirection = new THREE.Vector3();
        this.camera.getWorldDirection(lookDirection);
        lookDirection.y = 0;
        lookDirection.normalize();
        
        // Vector derecho (perpendicular a la dirección)
        const rightVector = new THREE.Vector3();
        rightVector.crossVectors(this.camera.up, lookDirection).normalize();
        
        // Calcular el vector de movimiento basado en las teclas presionadas
        const moveVector = new THREE.Vector3(0, 0, 0);
        
        // Movimiento adelante/atrás con W/S o flechas arriba/abajo
        if (keys.KeyW || keys.ArrowUp) {
            moveVector.add(lookDirection.clone().multiplyScalar(moveSpeed));
        }
        if (keys.KeyS || keys.ArrowDown) {
            moveVector.add(lookDirection.clone().multiplyScalar(-moveSpeed));
        }
        
        // Movimiento lateral con A/D o flechas izquierda/derecha
        if (keys.KeyA || keys.ArrowLeft) {
            moveVector.add(rightVector.clone().multiplyScalar(moveSpeed));
        }
        if (keys.KeyD || keys.ArrowRight) {
            moveVector.add(rightVector.clone().multiplyScalar(-moveSpeed));
        }
        
        // Aplicar el movimiento a la cámara
        if (moveVector.length() > 0) {
            this.camera.position.add(moveVector);
            this.orbitCenter.add(moveVector);
            this.camera.lookAt(this.orbitCenter);
        }
    }

    getCamera() {
        return this.camera;
    }

    getOrbitCenter() {
        return this.orbitCenter;
    }
}
