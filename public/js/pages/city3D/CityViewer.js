import { Environment } from './Environment.js';
import { CameraManager } from './Camera.js';
import { Controls } from './Controls.js';
import { UI } from './UI.js';
import { BuildingInteraction } from './Buildings.js';

export class CityViewer {
    constructor() {
        this.init();
    }

    init() {
        // Configuración inicial de Three.js
        this.scene = new THREE.Scene();
        
        // Crear y configurar el renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
        
        // Inicializar manejador de cámara
        this.cameraManager = new CameraManager(this.scene);
        this.camera = this.cameraManager.getCamera();
        
        // Configurar el entorno (cielo y luces)
        this.environment = new Environment(this.scene);
        
        // Inicializar la interacción con edificios
        this.buildingInteraction = new BuildingInteraction(this.scene, this.camera);
        
        // Configurar controles
        this.controls = new Controls(this.cameraManager, this.buildingInteraction);
        
        // Configurar UI
        this.ui = new UI(this.cameraManager);
        
        // Cargar modelo
        this.loadCityModel();
    }

    loadCityModel() {
        const loadingManager = new THREE.LoadingManager(
            () => {
                // Corregir la forma de ocultar la pantalla de carga
                const loadingElement = document.getElementById('app-loading');
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                } else {
                    console.warn('No se encontró elemento de carga con ID "app-loading"');
                }
            },
            (itemUrl, itemsLoaded, itemsTotal) => {
                const progress = (itemsLoaded / itemsTotal) * 100;
                const progressElement = document.getElementById('loading-progress');
                if (progressElement) {
                    progressElement.textContent = `${Math.round(progress)}%`;
                }
            }
        );

        // Create materials for the OBJ loader
        const defaultMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.7,
            metalness: 0.2
        });

        // Check if MTLLoader is available
        if (typeof THREE.MTLLoader === 'function') {
            // Use MTLLoader to load materials first
            const mtlLoader = new THREE.MTLLoader(loadingManager);
            mtlLoader.setPath('data/');
            
            mtlLoader.load('city.mtl', 
                (mtlMaterials) => {
                    mtlMaterials.preload();
                    
                    const loader = new THREE.OBJLoader(loadingManager);
                    loader.setMaterials(mtlMaterials);
                    this.loadOBJModel(loader);
                }, 
                undefined, 
                // If MTL fails, just load OBJ with default materials
                (error) => {
                    console.warn('MTL loading failed, using default materials:', error);
                    const loader = new THREE.OBJLoader(loadingManager);
                    this.loadOBJModel(loader);
                }
            );
        } else {
            // MTLLoader not available, proceed with OBJLoader only
            console.warn('MTLLoader not available, using default materials');
            const loader = new THREE.OBJLoader(loadingManager);
            this.loadOBJModel(loader);
        }
    }

    // Helper method to load the OBJ model
    loadOBJModel(loader) {
        loader.load(
            'data/city.obj',
            (object) => {
                this.cityModel = object;
                this.scene.add(this.cityModel);
                
                // Process the model (apply materials, etc.)
                this.processCityModel();
            },
            (xhr) => {
                const progress = (xhr.loaded / xhr.total) * 100;
                document.getElementById('loading-progress').textContent = `${Math.round(progress)}%`;
            },
            (error) => {
                console.error('Error loading the model:', error);
                document.getElementById('loading-progress').textContent = 'Error loading the model';
            }
        );
    }

    processCityModel() {
        // Apply default materials to meshes without materials
        this.cityModel.traverse(child => {
            if (child.isMesh) {
                try {
                    // If no material is present, create one
                    if (!child.material) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0xCCCCCC,
                            roughness: 0.7,
                            metalness: 0.2
                        });
                    }
                    
                    // Identify trees and apply green material - use more specific criteria
                    // to avoid misclassifying buildings as trees
                    const bbox = new THREE.Box3().setFromObject(child);
                    const size = bbox.getSize(new THREE.Vector3());
                    const height = size.y;
                    const width = size.x;
                    const depth = size.z;
                    
                    // Only classify thin, tall, and small objects as trees
                    // Making this condition more strict to avoid misclassifying buildings
                    if (height > 2 && 
                        height < 8 && // Trees shouldn't be too tall
                        height/(Math.max(width, depth)) > 3 && // Very thin aspect ratio
                        Math.max(width, depth) < 2 && // Small footprint 
                        (child.material.name?.includes('Tree_Spruce_tiny_01') || // If material name hints at tree
                         child.material.color?.g > 0.5 && child.material.color?.r < 0.3)) // Or if it's already green
                    {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x2D9B27, // Green for trees
                            roughness: 0.8,
                            metalness: 0.1
                        });
                        child.userData.isTree = true;
                        child.userData.isBuilding = false;
                    }
                } catch (e) {
                    console.warn("Error processing mesh material:", e);
                }
            }
        });
        
        // Add CSS for building info panel
        this.addInfoPanelStyles();
        
        // Configure buildings for interaction
        this.buildingInteraction.setCityModel(this.cityModel);
        
        // Start the animation loop
        this.animate();
    }

    addInfoPanelStyles() {
        // Add CSS styles for the building info panel to match the UI
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            #building-info {
                position: absolute;
                top: 20px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                border: 2px solid #3498db;
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                max-width: 300px;
                z-index: 1000;
                font-family: Arial, sans-serif;
                line-height: 1.4;
                transition: all 0.3s ease;
            }
            
            #building-info h3 {
                margin-top: 0;
                color: #3498db;
                border-bottom: 1px solid rgba(52, 152, 219, 0.5);
                padding-bottom: 8px;
                margin-bottom: 12px;
                font-size: 18px;
            }
            
            #building-info p {
                margin: 8px 0;
                font-size: 14px;
            }
            
            #building-info strong {
                color: #3498db;
            }
            
            #close-info-btn {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
                font-weight: bold;
                width: 100%;
                transition: background-color 0.2s;
            }
            
            #close-info-btn:hover {
                background-color: #2980b9;
            }
        `;
        document.head.appendChild(style);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Actualizar TWEEN si está disponible
        if (typeof TWEEN !== 'undefined') {
            TWEEN.update();
        }
        
        // Actualizar controles para movimiento de cámara
        this.controls.update();
        
        // Actualizar panel de posición
        this.ui.updatePositionPanel(this.camera.position);
        
        // Renderizar la escena
        this.renderer.render(this.scene, this.camera);
    }
}
