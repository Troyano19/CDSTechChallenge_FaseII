export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.createSky();
        this.setupLights();
    }

    createSky() {
        // Cargar la textura del cielo con nubes
        const skyTexture = new THREE.TextureLoader().load('images/textures/sky.jpg');
        skyTexture.wrapS = THREE.RepeatWrapping;
        skyTexture.wrapT = THREE.RepeatWrapping;
        skyTexture.repeat.set(1, 1);
        
        // Crear una geometría esférica grande para el cielo
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        
        // Crear material para el cielo - El lado trasero se renderiza para ver el cielo desde dentro
        const skyMaterial = new THREE.MeshBasicMaterial({ 
            map: skyTexture, 
            side: THREE.BackSide, // Importante: renderizar el lado interno
            color: 0xffffff 
        });
        
        // Crear el mesh del cielo y añadirlo a la escena
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        this.scene.add(directionalLight);
    }
}
