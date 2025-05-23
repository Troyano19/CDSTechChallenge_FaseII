import { KEYS, MIN_DRAG_THRESHOLD, TOUCH_DRAG_THRESHOLD } from './Constants.js';

export class Controls {
    constructor(cameraManager, buildingInteraction) {
        this.cameraManager = cameraManager;
        this.buildingInteraction = buildingInteraction;
        this.keys = { ...KEYS };
        this.isDragging = false;
        this.isTouchDragging = false; // Nueva propiedad para seguimiento de arrastre táctil
        this.previousMousePosition = { x: 0, y: 0 };
        this.mouse = new THREE.Vector2();
        this.mouseDownTime = 0; // Añadir variable para registrar el timestamp del clic
        this.isMobileDevice = this.checkIfMobile();
        this.touchStartPosition = { x: 0, y: 0 }; // Guardar posición inicial del toque
        
        this.setupEventListeners();
        this.createMobileControls();
    }

    checkIfMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        // Pasivo falso para permitir preventDefault en iOS 
        window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        
        // Listeners para control de teclado
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        
        // Eventos táctiles
        if (this.isMobileDevice) {
            window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
            window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
            window.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
        }
        
        // Prevenir rebote 
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    onWindowResize() {
        this.cameraManager.onWindowResize();
    }

    onMouseMove(event) {
        // Calcular posición del mouse en coordenadas normalizadas (-1 a +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Manejar el arrastre para rotación de cámara
        if (this.isDragging) {
            const deltaMove = {
                x: event.clientX - this.previousMousePosition.x,
                y: event.clientY - this.previousMousePosition.y
            };

            const dragHandled = this.cameraManager.handleDrag(
                deltaMove, 
                this.isDragging, 
                this.previousMousePosition
            );
            
            // Actualizar la posición previa del ratón
            this.previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            
            if (dragHandled) {
                // No verificar intersecciones durante el arrastre para mejorar rendimiento
                return;
            }
        }
        
        // Actualizar el raycaster para hover
        this.buildingInteraction.checkIntersection(this.mouse);
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        this.mouseDownTime = Date.now(); // Guardar el timestamp cuando se presiona el botón
        document.body.style.cursor = 'grabbing'; // Cambiar el cursor a "puño cerrado"
    }

    onMouseUp(event) {
        this.isDragging = false;
        const clickDuration = Date.now() - this.mouseDownTime;
        
        // Restaurar el cursor según corresponda
        if (this.buildingInteraction.isHoveringBuilding()) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
        
        // Update mouse coordinates to normalized coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Solo procesar como clic si la duración fue menor a 500ms (0.5 segundos)
        if (clickDuration < 500) {
            // Pass normalized coordinates (this.mouse) instead of screen coordinates
            this.buildingInteraction.handleClick(
                this.mouse,
            );
        }
    }

    onWheel(event) {
        this.cameraManager.handleWheel(event);
    }

    onKeyDown(event) {
        // Registrar tecla presionada
        this.keys[event.code] = true;
    }
    
    onKeyUp(event) {
        // Registrar tecla liberada
        this.keys[event.code] = false;
    }

    // Nuevos métodos para manejar eventos táctiles
    onTouchMove(event) {
        // Siempre prevenir el desplazamiento de página
        event.preventDefault();
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            
            // Convertir evento táctil a formato compatible con eventos de ratón
            this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            // Calcular la distancia desde el inicio del toque
            const moveX = touch.clientX - this.touchStartPosition.x;
            const moveY = touch.clientY - this.touchStartPosition.y;
            const totalMove = Math.sqrt(moveX * moveX + moveY * moveY);
            
            // Solo iniciar arrastre si superamos el umbral de movimiento
            if (totalMove > TOUCH_DRAG_THRESHOLD && !this.isTouchDragging) {
                this.isTouchDragging = true;
                document.body.style.cursor = 'grabbing';
                
                // Actualizar posición previa para calcular movimiento delta
                this.previousMousePosition = {
                    x: touch.clientX,
                    y: touch.clientY
                };
            }
            
            // Si estamos en modo arrastre, manejar la rotación de la cámara
            if (this.isTouchDragging) {
                const deltaMove = {
                    x: touch.clientX - this.previousMousePosition.x,
                    y: touch.clientY - this.previousMousePosition.y
                };
                
                // Llamar al método handleDrag para girar la cámara
                this.cameraManager.handleDrag(deltaMove, true, this.previousMousePosition);
                
                // Actualizar posición para el siguiente movimiento
                this.previousMousePosition = {
                    x: touch.clientX,
                    y: touch.clientY
                };
            } else {
                // Si no estamos arrastrando, check para hover de edificios
                this.buildingInteraction.checkIntersection(this.mouse);
            }
        }
    }

    onTouchStart(event) {
        // Solo prevenir el comportamiento predeterminado si no estamos en un control
        if (!event.target.closest('#mobile-controls')) {
            event.preventDefault();
        }
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            
            // Guardar el punto inicial del toque
            this.touchStartPosition = {
                x: touch.clientX,
                y: touch.clientY
            };
            
            // Inicializar estado del arrastre
            this.isTouchDragging = false;
            this.isDragging = true;
            this.mouseDownTime = Date.now();
            
            // Guardar también como posición previa para cálculos de delta
            this.previousMousePosition = {
                x: touch.clientX,
                y: touch.clientY
            };
        }
    }

    onTouchEnd(event) {
        // No prevenir el comportamiento predeterminado si estamos en un control
        if (!event.target.closest('#mobile-controls')) {
            event.preventDefault();
        }
        
        const clickDuration = Date.now() - this.mouseDownTime;
        
        if (event.changedTouches.length === 1) {
            const touch = event.changedTouches[0];
            
            // Restaurar cursor según corresponda
            document.body.style.cursor = this.buildingInteraction.isHoveringBuilding() 
                ? 'pointer' 
                : 'auto';
            
            // Actualizar coordenadas del mouse para el clic
            this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            // Solo procesar como clic si:
            // 1. No estamos en modo arrastre
            // 2. La duración fue menor a 500ms
            // 3. El movimiento total fue menor que el umbral
            const moveX = touch.clientX - this.touchStartPosition.x;
            const moveY = touch.clientY - this.touchStartPosition.y;
            const totalMove = Math.sqrt(moveX * moveX + moveY * moveY);
            
            if (!this.isTouchDragging && clickDuration < 500 && totalMove < TOUCH_DRAG_THRESHOLD) {
                this.buildingInteraction.handleClick(this.mouse);
            }
            
            // Restablecer estados de arrastre
            this.isDragging = false;
            this.isTouchDragging = false;
        }
    }

    createMobileControls() {
        const mobileControls = document.createElement('div');
        mobileControls.id = 'mobile-controls';
        
        const rowTop = document.createElement('div');
        rowTop.className = 'control-row';
        
        const rowBottom = document.createElement('div');
        rowBottom.className = 'control-row';
        
        const btnUp = document.createElement('button');
        btnUp.id = 'move-up';
        btnUp.innerHTML = '↑';
        btnUp.setAttribute('aria-label', 'Mover adelante');
        this.setupButtonEventListeners(btnUp, 'KeyW');
        
        const btnDown = document.createElement('button');
        btnDown.id = 'move-down';
        btnDown.innerHTML = '↓';
        btnDown.setAttribute('aria-label', 'Mover atrás');
        this.setupButtonEventListeners(btnDown, 'KeyS');
        
        const btnLeft = document.createElement('button');
        btnLeft.id = 'move-left';
        btnLeft.innerHTML = '←';
        btnLeft.setAttribute('aria-label', 'Mover izquierda');
        this.setupButtonEventListeners(btnLeft, 'KeyA');
        
        const btnRight = document.createElement('button');
        btnRight.id = 'move-right';
        btnRight.innerHTML = '→';
        btnRight.setAttribute('aria-label', 'Mover derecha');
        this.setupButtonEventListeners(btnRight, 'KeyD');
        
        rowTop.appendChild(btnUp);
        rowBottom.appendChild(btnLeft);
        rowBottom.appendChild(btnDown);
        rowBottom.appendChild(btnRight);
        
        mobileControls.appendChild(rowTop);
        mobileControls.appendChild(rowBottom);
        
        document.body.appendChild(mobileControls);
        
        this.preventDefaultTouchBehavior(mobileControls);
    }
    
    setupButtonEventListeners(button, keyCode) {
        // Touch events - con manejo específico para iOS
        if (this.isMobileDevice) {
            button.addEventListener('touchstart', (e) => { 
                e.preventDefault(); 
                this.keys[keyCode] = true;
                // Evitar que se active el modo de arrastre cuando se presiona un botón
                this.isTouchDragging = false;
            }, { passive: false });
            
            button.addEventListener('touchend', (e) => { 
                e.preventDefault(); 
                this.keys[keyCode] = false; 
            }, { passive: false });
            
            button.addEventListener('touchcancel', (e) => { 
                e.preventDefault(); 
                this.keys[keyCode] = false; 
            }, { passive: false });
        }
        
        // Mouse events for desktop testing
        button.addEventListener('mousedown', () => { this.keys[keyCode] = true; });
        button.addEventListener('mouseup', () => { this.keys[keyCode] = false; });
        button.addEventListener('mouseleave', () => { this.keys[keyCode] = false; });
    }
    
    preventDefaultTouchBehavior(element) {
        // Prevenir que los eventos táctiles generen eventos de scroll con configuración no pasiva para iOS
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        
        element.addEventListener('touchstart', preventDefaults, { passive: false });
        element.addEventListener('touchmove', preventDefaults, { passive: false });
        element.addEventListener('touchend', preventDefaults, { passive: false });
        element.addEventListener('touchcancel', preventDefaults, { passive: false });
    }

    update() {
        // Actualizar la posición de la cámara basado en las teclas presionadas
        this.cameraManager.moveCamera(this.keys);
    }
}
