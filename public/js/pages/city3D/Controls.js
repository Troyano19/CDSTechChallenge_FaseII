import { KEYS } from './Constants.js';

export class Controls {
    constructor(cameraManager, buildingInteraction) {
        this.cameraManager = cameraManager;
        this.buildingInteraction = buildingInteraction;
        this.keys = { ...KEYS };
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.mouse = new THREE.Vector2();
        this.mouseDownTime = 0; // Añadir variable para registrar el timestamp del clic
        
        this.setupEventListeners();
        this.createMobileControls();
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        
        // Listeners para control de teclado
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
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
        this.setupButtonEventListeners(btnUp, 'KeyW');
        
        const btnDown = document.createElement('button');
        btnDown.id = 'move-down';
        btnDown.innerHTML = '↓';
        this.setupButtonEventListeners(btnDown, 'KeyS');
        
        const btnLeft = document.createElement('button');
        btnLeft.id = 'move-left';
        btnLeft.innerHTML = '←';
        this.setupButtonEventListeners(btnLeft, 'KeyA');
        
        const btnRight = document.createElement('button');
        btnRight.id = 'move-right';
        btnRight.innerHTML = '→';
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
        // Touch events
        button.addEventListener('touchstart', () => { this.keys[keyCode] = true; });
        button.addEventListener('touchend', () => { this.keys[keyCode] = false; });
        button.addEventListener('touchcancel', () => { this.keys[keyCode] = false; });
        
        // Mouse events for desktop testing
        button.addEventListener('mousedown', () => { this.keys[keyCode] = true; });
        button.addEventListener('mouseup', () => { this.keys[keyCode] = false; });
        button.addEventListener('mouseleave', () => { this.keys[keyCode] = false; });
    }
    
    preventDefaultTouchBehavior(element) {
        // Prevenir que los eventos táctiles generen eventos de scroll
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
