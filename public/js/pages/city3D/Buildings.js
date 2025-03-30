import { MIN_DRAG_THRESHOLD, INFO_PANEL_COOLDOWN } from './Constants.js';
import { dataLoader } from './DataLoader.js';

export class BuildingInteraction {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedBuilding = null;
        this.hoveredBuilding = null;
        this.cityModel = null;
        this.canShowInfoPanel = true;
        
        // Inicializamos con datos vacíos que se cargarán dinámicamente
        this.buildingData = {
            commercial: [],
            residential: [],
            historic: []
        };
        this.customBuildingDefinitions = this.createCustomBuildingDefinitions();
        
        // Cargamos los datos del CSV
        this.loadBuildingDataFromCSV();

        // Añadir mapas de nombres por categoría para generar nombres únicos
        this.buildingNameBases = {
            commercial: [
                "Plaza", "Centro", "Tower", "Office", "Business", "Corporate", 
                "Commerce", "Trade", "Market", "Skyline", "Enterprise", "Global",
                "Diamond", "Crystal", "Horizon", "Pinnacle", "Summit", "Vertex",
                "Zenith", "Empire", "Exchange", "Nova", "Quantum", "Meridian"
            ],
            residential: [
                "Residencial", "Apartments", "Residence", "Living", "Habitat", "Dwellings",
                "Suites", "Lofts", "Condos", "Villas", "Gardens", "Heights", "Terraces",
                "Vista", "Mirador", "Oasis", "Paradise", "Haven", "Retreat", "Sanctuary"
            ],
            historic: [
                "Heritage", "Legacy", "Historic", "Monument", "Landmark", "Memorial",
                "Archive", "Museum", "Gallery", "Relic", "Vintage", "Antique", "Classic",
                "Cultural", "Traditional", "Timeless", "Ancient", "Colonial", "Palace"
            ]
        };
        
        this.buildingAdjectives = [
            "Grand", "Noble", "Elegant", "Premier", "Prime", "Elite", "Supreme",
            "Royal", "Majestic", "Iconic", "Luxurious", "Splendid", "Pristine",
            "Golden", "Silver", "Platinum", "Azure", "Emerald", "Ruby", "Sapphire",
            "Central", "Northern", "Southern", "Eastern", "Western"
        ];
        
        this.buildingNameSuffixes = {
            commercial: ["Complex", "Center", "Hub", "Park", "Square", "Plaza", "Avenue"],
            residential: ["Garden", "Park", "Court", "Place", "Estate", "Terrace", "View"],
            historic: ["Hall", "House", "Court", "Manor", "Palace", "Castle", "Citadel"]
        };
        
        // Conjunto para rastrear nombres ya usados y evitar duplicados
        this.usedBuildingNames = new Set();
    }
    
    // Método para cargar y procesar los datos del CSV
    async loadBuildingDataFromCSV() {
        try {
            // Cargamos los datos usando el DataLoader
            await dataLoader.loadCSV();
            const { servicios, hoteles } = dataLoader.getServiciosYHoteles();
            
            // Convertir hoteles al formato esperado por la aplicación
            const residential = hoteles.map(hotel => ({
                name: hotel.nombre,
                type: hotel.tipo,
                height: "75m", // Altura estimada para hoteles
                description: `Hotel con valoraciones entre ${hotel.peor.puntuacion} y ${hotel.mejor.puntuacion} estrellas`,
                yearBuilt: new Date(Math.max(new Date(hotel.mejor.fecha), new Date(hotel.peor.fecha))).getFullYear(),
                amenities: ["Wifi", "Desayuno", "Piscina"],
                reseñas: [
                    {
                        puntuacion: hotel.mejor.puntuacion,
                        comentario: hotel.mejor.comentario,
                        fecha: hotel.mejor.fecha
                    },
                    {
                        puntuacion: hotel.peor.puntuacion,
                        comentario: hotel.peor.comentario,
                        fecha: hotel.peor.fecha
                    }
                ]
            }));
            
            // Dividir los servicios entre commercial y historic
            const serviciosFormateados = servicios.map(servicio => ({
                name: servicio.nombre,
                type: servicio.tipo,
                height: `${Math.floor(Math.random() * 31) + 20}m`, // Altura aleatoria entre 20m y 50m
                yearBuilt: new Date(Math.max(new Date(servicio.mejor.fecha), new Date(servicio.peor.fecha))).getFullYear(),
                floors: Math.floor(Math.random() * 5) + 1,
                style: "Moderno",
                reseñas: [
                    {
                        puntuacion: servicio.mejor.puntuacion,
                        comentario: servicio.mejor.comentario,
                        fecha: servicio.mejor.fecha
                    },
                    {
                        puntuacion: servicio.peor.puntuacion,
                        comentario: servicio.peor.comentario,
                        fecha: servicio.peor.fecha
                    }
                ]
            }));
            
            // Dividir los servicios entre commercial y historic
            const commercial = [];
            const historic = [];
            
            serviciosFormateados.forEach((servicio, index) => {
                if (index % 2 === 0) {
                    commercial.push(servicio);
                } else {
                    historic.push(servicio);
                }
            });
            
            console.log(`Datos cargados: ${hoteles.length} hoteles y ${servicios.length} servicios`);
            
            // Actualizar los datos
            this.buildingData = {
                commercial: commercial.length > 0 ? commercial : this.getFallbackData().commercial,
                residential: residential.length > 0 ? residential : this.getFallbackData().residential,
                historic: historic.length > 0 ? historic : this.getFallbackData().historic
            };
            
            // Si el modelo ya está cargado, actualizamos los edificios
            if (this.cityModel) {
                this.prepareBuildings();
            }
            
        } catch (error) {
            console.error('Error al cargar datos del CSV:', error);
            // Usar datos de respaldo en caso de error
            this.buildingData = this.getFallbackData();
        }
    }
    
    // Procesar el CSV y convertirlo en un array de objetos
    procesarCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        const datos = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                datos.push(row);
            }
        }
        
        return datos;
    }
    
    // Manejar correctamente líneas CSV con campos entre comillas
    parseCSVLine(line) {
        const values = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                values.push(currentValue);
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        
        values.push(currentValue);
        return values;
    }
    
    // Agrupar datos por nombre de servicio y filtrar por tipo
    agruparPorServicio(datos) {
        const serviciosAgrupados = {};
        
        datos.forEach(row => {
            // Filtrar solo servicios y hoteles y excluir comentarios con errores
            if ((row.tipo_servicio === 'Servicio' || row.tipo_servicio === 'Hotel') && 
                !row.comentario.includes("[Error: Could not generate text due to API failure]")) {
                
                const nombreServicio = row.nombre_servicio;
                if (!serviciosAgrupados[nombreServicio]) {
                    serviciosAgrupados[nombreServicio] = {
                        nombre: nombreServicio,
                        tipo: row.tipo_servicio,
                        reseñas: []
                    };
                }
                
                serviciosAgrupados[nombreServicio].reseñas.push({
                    puntuacion: parseInt(row.puntuacion),
                    comentario: row.comentario,
                    fecha: row.fecha
                });
            }
        });
        
        return serviciosAgrupados;
    }
    
    // Obtener la mejor y peor reseña de cada servicio
    obtenerReseñasMejorYPeor(serviciosAgrupados) {
        const resultado = [];
        
        Object.values(serviciosAgrupados).forEach(servicio => {
            // Ordenar reseñas por puntuación (de mayor a menor)
            servicio.reseñas.sort((a, b) => b.puntuacion - a.puntuacion);
            
            // Obtener la mejor y peor reseña
            const mejor = servicio.reseñas[0];
            const peor = servicio.reseñas.length > 1 ? servicio.reseñas[servicio.reseñas.length - 1] : mejor;
            
            resultado.push({
                nombre: servicio.nombre,
                tipo: servicio.tipo,
                mejor: mejor,
                peor: peor
            });
        });
        
        return resultado;
    }
    
    // Datos de respaldo en caso de error al cargar el CSV
    getFallbackData() {
        return {
            commercial: [
                {
                    name: "Servicios Ejemplo",
                    height: "35m",
                    type: "Servicio",
                    description: "Servicio de ejemplo con datos de respaldo",
                    yearBuilt: 2020,
                    floors: 3,
                    reseñas: [
                        {
                            puntuacion: 5,
                            comentario: "Excelente servicio de respaldo.",
                            fecha: "2023-01-01"
                        },
                        {
                            puntuacion: 3,
                            comentario: "Servicio de respaldo aceptable.",
                            fecha: "2023-02-01"
                        }
                    ]
                }
            ],
            residential: [
                {
                    name: "Hotel Ejemplo",
                    height: "75m",
                    type: "Hotel",
                    description: "Hotel de ejemplo con datos de respaldo",
                    yearBuilt: 2018,
                    amenities: ["Wifi", "Desayuno"],
                    reseñas: [
                        {
                            puntuacion: 5,
                            comentario: "Excelente hotel de respaldo.",
                            fecha: "2023-01-15"
                        },
                        {
                            puntuacion: 3,
                            comentario: "Hotel de respaldo aceptable.",
                            fecha: "2023-03-15"
                        }
                    ]
                }
            ],
            historic: [
                {
                    name: "Servicio Cultural Ejemplo",
                    height: "20m",
                    type: "Servicio",
                    description: "Servicio cultural de ejemplo con datos de respaldo",
                    yearBuilt: 2015,
                    style: "Modernista",
                    reseñas: [
                        {
                            puntuacion: 5,
                            comentario: "Excelente servicio cultural de respaldo.",
                            fecha: "2023-04-01"
                        },
                        {
                            puntuacion: 3,
                            comentario: "Servicio cultural de respaldo aceptable.",
                            fecha: "2023-05-01"
                        }
                    ]
                }
            ]
        };
    }

    createCustomBuildingDefinitions() {
        return [
            {
                name: "Torre Central",
                type: "Comercial",
                description: "El edificio más alto de la ciudad, sede de importantes empresas internacionales",
                height: "220m",
                yearBuilt: 2005,
                architect: "Santiago Calatrava",
                floors: 60,
                // Criterios de identificación - posición aproximada y dimensiones
                matchCriteria: {
                    position: { x: 0, y: 30, z: 0 }, // Posición aproximada
                    dimensions: { width: 15, height: 60, depth: 15 }, // Dimensiones aproximadas
                    tolerance: 15 // Tolerancia para el emparejamiento
                }
            },
            {
                name: "Centro Comercial Metrópolis",
                type: "Comercial",
                description: "El mayor centro comercial de la ciudad con tiendas exclusivas",
                height: "45m",
                yearBuilt: 2010,
                architect: "Grupo Arquitectónico Moderno",
                floors: 5,
                shops: 350,
                matchCriteria: {
                    position: { x: 30, y: 12, z: -20 },
                    dimensions: { width: 40, height: 24, depth: 40 },
                    tolerance: 20
                }
            },
            {
                name: "Residencial Parque Verde",
                type: "Residencial",
                description: "Complejo residencial con amplias zonas verdes y servicios comunitarios",
                height: "85m",
                yearBuilt: 2015,
                apartments: 240,
                amenities: ["Piscina climatizada", "Gimnasio completo", "Parque infantil", "Zona de barbacoa"],
                matchCriteria: {
                    position: { x: -25, y: 25, z: 25 },
                    dimensions: { width: 30, height: 50, depth: 20 },
                    tolerance: 20
                }
            },
            {
                name: "Ayuntamiento",
                type: "Gubernamental",
                description: "Sede del gobierno municipal, un edificio histórico restaurado",
                height: "65m",
                yearBuilt: 1925,
                renovatedIn: 2008,
                style: "Neoclásico",
                historicValue: "Edificio protegido de interés cultural e histórico",
                matchCriteria: {
                    position: { x: 10, y: 20, z: 40 },
                    dimensions: { width: 25, height: 40, depth: 25 },
                    tolerance: 15
                }
            },
            {
                name: "Hospital General",
                type: "Sanitario",
                description: "Principal centro sanitario de la región con tecnología de vanguardia",
                height: "75m",
                yearBuilt: 2012, 
                beds: 800,
                departments: ["Urgencias", "Cirugía", "Pediatría", "Oncología", "Cardiología"],
                matchCriteria: {
                    position: { x: -40, y: 25, z: -30 },
                    dimensions: { width: 60, height: 50, depth: 40 },
                    tolerance: 25
                }
            }
        ];
    }

    setCityModel(model) {
        this.cityModel = model;
        this.prepareBuildings();
    }

    prepareBuildings() {
        if (!this.cityModel) return;
        
        console.log('Preparing buildings for interaction...');
        
        // 1. First pass: identify all meshes and store their properties
        const allMeshes = [];
        
        this.cityModel.traverse((object) => {
            if (object.isMesh) {
                // Ensure the object has a valid material
                if (!object.material) {
                    // Create a default material if none exists
                    object.material = new THREE.MeshStandardMaterial({
                        color: 0xcccccc,
                        roughness: 0.7,
                        metalness: 0.2
                    });
                } else if (Array.isArray(object.material)) {
                    // Handle material arrays (multi-material objects)
                    const materials = [];
                    object.material.forEach(mat => {
                        if (mat && typeof mat.clone === 'function') {
                            materials.push(mat.clone());
                        } else {
                            materials.push(new THREE.MeshStandardMaterial({
                                color: 0xcccccc,
                                roughness: 0.7,
                                metalness: 0.2
                            }));
                        }
                    });
                    object.userData.originalMaterial = materials;
                } else if (typeof object.material.clone !== 'function') {
                    // If material exists but doesn't have clone function, create a new one
                    object.material = new THREE.MeshStandardMaterial({
                        color: 0xcccccc,
                        roughness: 0.7,
                        metalness: 0.2
                    });
                    object.userData.originalMaterial = object.material.clone();
                } else {
                    // Normal case - save original material
                    object.userData.originalMaterial = object.material.clone();
                }
                
                // Get the size and bounding box
                const bbox = new THREE.Box3().setFromObject(object);
                const size = bbox.getSize(new THREE.Vector3());
                
                // Calculate aspect ratio to identify ground/terrain
                const horizontalSize = Math.max(size.x, size.z);
                const verticalAspectRatio = size.y / horizontalSize;
                
                // Filter out objects that are likely to be ground/terrain
                const isGround = verticalAspectRatio < 0.1 && horizontalSize > 10; 
                const isPole = verticalAspectRatio > 10 && horizontalSize < 0.5;
                
                // Only include objects that are likely buildings (not ground or poles/antennas)
                if (!isGround && !isPole && size.y > 1.0) {
                    object.userData.isGround = false;
                    object.userData.isBuilding = false; // Start with false, set to true later if part of a building
                    allMeshes.push({
                        mesh: object,
                        position: object.position.clone(),
                        size: size,
                        bottom: bbox.min.y,
                        bbox: bbox,
                        verticalAspectRatio: verticalAspectRatio
                    });
                } else {
                    // Mark as ground or non-building element
                    object.userData.isGround = isGround;
                    object.userData.isBuilding = false;
                }
            }
        });
        
        console.log(`Found ${allMeshes.length} potential building objects`);
        
        // 2. Second pass: group meshes into buildings
        const buildingGroups = [];
        const processedMeshes = new Set();
        
        for (let i = 0; i < allMeshes.length; i++) {
            if (processedMeshes.has(i)) continue;
            
            // Create a new building group
            const building = {
                meshes: [allMeshes[i].mesh],
                bbox: allMeshes[i].bbox.clone(),
                center: allMeshes[i].position.clone(),
                height: allMeshes[i].size.y
            };
            
            processedMeshes.add(i);
            
            // Find all connected meshes (except below)
            this.findConnectedMeshes(allMeshes, i, building, processedMeshes);
            
            // Calculate the combined bounding box for the entire building
            for (const mesh of building.meshes) {
                const meshBBox = new THREE.Box3().setFromObject(mesh);
                building.bbox.union(meshBBox);
            }
            
            // Calculate updated building center and height
            building.center = new THREE.Vector3(
                (building.bbox.max.x + building.bbox.min.x) / 2,
                (building.bbox.max.y + building.bbox.min.y) / 2,
                (building.bbox.max.z + building.bbox.min.z) / 2
            );
            
            building.height = building.bbox.max.y - building.bbox.min.y;
            
            // Only add structures with reasonable height and size
            if (building.height > 1.5 && building.meshes.length > 0) {
                buildingGroups.push(building);
            }
        }
        
        console.log(`Grouped into ${buildingGroups.length} buildings`);
        
        // 3. Assign information to each building
        this.assignBuildingInfo(buildingGroups);
    }
    
    findConnectedMeshes(allMeshes, currentIndex, building, processedMeshes) {
        const currentMesh = allMeshes[currentIndex];
        const PROXIMITY_THRESHOLD = 0.5; // Umbral para considerar objetos como conectados
        
        for (let i = 0; i < allMeshes.length; i++) {
            if (processedMeshes.has(i) || i === currentIndex) continue;
            
            const otherMesh = allMeshes[i];
            
            // Verificar si las cajas contenedoras se intersecan
            if (currentMesh.bbox.intersectsBox(otherMesh.bbox)) {
                // Verificar que la intersección no sea solo por la parte inferior
                // Si el fondo del otro mesh está cerca de la parte superior del mesh actual,
                // o si el fondo del mesh actual está cerca de la parte superior del otro,
                // significa que no están conectados solo por la parte inferior
                const isNotBottomConnection = 
                    Math.abs(otherMesh.bottom - (currentMesh.position.y + currentMesh.size.y/2)) < PROXIMITY_THRESHOLD ||
                    Math.abs(currentMesh.bottom - (otherMesh.position.y + otherMesh.size.y/2)) < PROXIMITY_THRESHOLD ||
                    Math.abs(otherMesh.position.x - currentMesh.position.x) < PROXIMITY_THRESHOLD ||
                    Math.abs(otherMesh.position.z - currentMesh.position.z) < PROXIMITY_THRESHOLD;
                
                if (isNotBottomConnection) {
                    building.meshes.push(otherMesh.mesh);
                    processedMeshes.add(i);
                    
                    // Buscar recursivamente para encontrar más objetos conectados
                    this.findConnectedMeshes(allMeshes, i, building, processedMeshes);
                }
            }
        }
    }
    
    // Nueva función para comprobar si un edificio coincide con alguna definición personalizada
    findMatchingBuildingDefinition(building) {
        for (const definition of this.customBuildingDefinitions) {
            const criteria = definition.matchCriteria;
            const position = building.center;
            const size = new THREE.Vector3(
                building.bbox.max.x - building.bbox.min.x,
                building.bbox.max.y - building.bbox.min.y,
                building.bbox.max.z - building.bbox.min.z
            );
            
            // Calcular la distancia entre la posición del edificio y la posición de la definición
            const distanceX = Math.abs(position.x - criteria.position.x);
            const distanceY = Math.abs(position.y - criteria.position.y);
            const distanceZ = Math.abs(position.z - criteria.position.z);
            
            // Comprobar si las dimensiones son similares (dentro de la tolerancia)
            const dimensionsMatch = 
                Math.abs(size.x - criteria.dimensions.width) < criteria.tolerance &&
                Math.abs(size.y - criteria.dimensions.height) < criteria.tolerance &&
                Math.abs(size.z - criteria.dimensions.depth) < criteria.tolerance;
            
            // Comprobar si la posición es cercana (dentro de la tolerancia)
            const positionMatch = 
                distanceX < criteria.tolerance &&
                distanceY < criteria.tolerance &&
                distanceZ < criteria.tolerance;
            
            // Si tanto la posición como las dimensiones coinciden, hemos encontrado una coincidencia
            if (positionMatch && dimensionsMatch) {
                console.log(`Edificio identificado como: ${definition.name}`, building);
                return definition;
            }
        }
        
        return null; // No se encontró ninguna coincidencia
    }
    
    // Nuevo método para generar nombres únicos de edificios
    generateUniqueBuildingName(building, category, index) {
        // Seleccionar aleatoriamente un nombre base según la categoría
        const nameBase = this.buildingNameBases[category][
            index % this.buildingNameBases[category].length
        ];
        
        // Usar la posición del edificio para agregar singularidad
        const positionHash = Math.abs(
            Math.round(building.center.x * 1000) + 
            Math.round(building.center.z * 200)
        ) % 1000;
        
        // Usar la altura como característica descriptiva
        let heightDescription = "";
        const height = building.height;
        
        if (height > 30) {
            heightDescription = "Sky";
        } else if (height > 20) {
            heightDescription = "High";
        } else if (height < 5) {
            heightDescription = "Low";
        }
        
        // Seleccionar un adjetivo basado en el índice y posición
        const adjectiveIndex = (index + Math.floor(positionHash / 100)) % this.buildingAdjectives.length;
        const adjective = this.buildingAdjectives[adjectiveIndex];
        
        // Seleccionar un sufijo según la categoría
        const suffixIndex = (index + positionHash) % this.buildingNameSuffixes[category].length;
        const suffix = this.buildingNameSuffixes[category][suffixIndex];
        
        // Generar nombres candidatos en diferentes formatos hasta encontrar uno único
        let attempts = 0;
        let nameOptions = [
            `${adjective} ${nameBase}`,
            `${nameBase} ${suffix}`,
            `${heightDescription}${nameBase}`,
            `${adjective} ${nameBase} ${suffix}`,
            `${nameBase} ${positionHash}`,
            `${nameBase} ${String.fromCharCode(65 + (index % 26))}`,
            `${nameBase} ${adjective} ${String.fromCharCode(65 + (index % 26))}`
        ];
        
        // Filtrar opciones vacías (por si heightDescription está vacío)
        nameOptions = nameOptions.filter(name => !name.includes("undefined") && !name.startsWith(" "));
        
        // Intentar con diferentes combinaciones hasta encontrar un nombre único
        while (attempts < nameOptions.length) {
            const candidateName = nameOptions[attempts];
            if (!this.usedBuildingNames.has(candidateName)) {
                this.usedBuildingNames.add(candidateName);
                return candidateName;
            }
            attempts++;
        }
        
        // Si todas las opciones están usadas, crear un nombre con un número único
        const fallbackName = `${nameBase} #${positionHash}-${index}`;
        this.usedBuildingNames.add(fallbackName);
        return fallbackName;
    }

    assignBuildingInfo(buildingGroups) {
        let buildingIndex = 0;
        
        // Para debugging - mostrar información sobre los edificios
        console.log("Analizando edificios para asignación de información:");
        buildingGroups.forEach((building, index) => {
            console.log(`Edificio ${index}:`, {
                position: building.center,
                dimensions: {
                    width: building.bbox.max.x - building.bbox.min.x,
                    height: building.bbox.max.y - building.bbox.min.y,
                    depth: building.bbox.max.z - building.bbox.min.z
                }
            });
        });
        
        // Mapear grupos a categorías o definiciones personalizadas
        buildingGroups.forEach(building => {
            // Primero intentamos encontrar una definición personalizada que coincida
            const customDefinition = this.findMatchingBuildingDefinition(building);
            
            let buildingInfo;
            
            if (customDefinition) {
                // Si encontramos una definición personalizada, la usamos
                buildingInfo = {
                    ...customDefinition,
                    // Añadimos información adicional si es necesaria
                    matchType: "custom",
                    meshCount: building.meshes.length
                };
            } else {
                // Si no hay coincidencia, usamos el método automático anterior
                let category;
                const x = building.center.x;
                const z = building.center.z;
                
                if (building.height > 10) {
                    category = 'commercial';
                } else if (z < -5) {
                    category = 'residential';
                } else {
                    category = 'historic';
                }
                
                const categoryData = this.buildingData[category];
                const infoTemplate = categoryData[buildingIndex % categoryData.length];
                
                // Generar un nombre único para este edificio
                const uniqueName = this.generateUniqueBuildingName(building, category, buildingIndex);
                
                buildingInfo = {
                    ...infoTemplate,
                    name: uniqueName,
                    height: infoTemplate.height || `${Math.round(building.height * 10)}m`,
                    category: category,
                    matchType: "auto",
                    meshCount: building.meshes.length
                };
            }
            
            // Asignar información a todos los meshes del edificio
            const groupId = `building_${buildingIndex}`;
            for (const mesh of building.meshes) {
                mesh.userData.info = buildingInfo;
                mesh.userData.isBuilding = true;
                mesh.userData.buildingGroup = groupId;
            }
            
            buildingIndex++;
        });
        
        console.log(`Información asignada a ${buildingIndex} edificios`);
    }

    checkIntersection(mouse) {
        if (!this.cityModel) return;
        
        this.mouse.copy(mouse);
        
        // Update the raycaster with the mouse position and camera
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Calculate objects that intersect with the ray
        const intersects = this.raycaster.intersectObjects(this.cityModel.children, true);
        
        // Filter out ground objects
        const filteredIntersects = intersects.filter(intersect => 
            intersect.object && 
            intersect.object.userData.isBuilding === true &&
            intersect.object.userData.isGround !== true
        );
        
        // Restore material of previously hovered building
        if (this.hoveredBuilding && this.hoveredBuilding !== this.selectedBuilding) {
            this.restoreMaterial(this.hoveredBuilding);
        }
        
        this.hoveredBuilding = null;
        
        // Change the material of the building currently under the cursor
        if (filteredIntersects.length > 0) {
            const object = filteredIntersects[0].object;
            
            if (object.userData.isBuilding) {
                this.hoveredBuilding = object;
                
                // Don't change the material if it's the currently selected building
                if (this.hoveredBuilding !== this.selectedBuilding) {
                    this.highlightBuilding(this.hoveredBuilding, 0x333333, 0.5);
                }
                
                // Change cursor to "pointer" to indicate it's clickable
                document.body.style.cursor = 'pointer';
                return true;
            }
        }
        
        document.body.style.cursor = 'auto';
        return false;
    }

    handleClick(mousePosition) {
        try {
            // Use the provided normalized mouse coordinates directly
            this.raycaster.setFromCamera(mousePosition, this.camera);
            
            // Find intersected objects
            const intersects = this.raycaster.intersectObjects(this.cityModel.children, true);
            
            // Filter out ground/terrain objects and find only building objects
            const buildingIntersects = intersects.filter(intersect => 
                intersect.object && 
                intersect.object.userData.isBuilding === true &&
                intersect.object.userData.isGround !== true
            );
            
            // If we have building intersections
            if (buildingIntersects.length > 0) {
                // Get the first (closest) building intersection
                const intersection = buildingIntersects[0];
                const clickedObject = intersection.object;
                
                // Deselect previous building if there was one
                if (this.selectedBuilding) {
                    this.restoreMaterial(this.selectedBuilding);
                }
                
                // Select new building
                this.selectedBuilding = clickedObject;
                
                // Apply selection highlight to all parts of this building
                this.highlightBuilding(clickedObject, 0x3366ff, 0.5);
                
                // Show building info
                this.showBuildingInfo(clickedObject);
                return true;
            } else if (!this.hoveredBuilding) {
                // If clicked on empty area, hide info panel
                this.hideBuildingInfo();
                
                // Deselect previous building if there was one
                if (this.selectedBuilding) {
                    this.restoreMaterial(this.selectedBuilding);
                    this.selectedBuilding = null;
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error in handleClick:", error);
            return false;
        }
    }

    showBuildingInfo(building) {
        let infoPanel = document.getElementById('building-info');
        
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.id = 'building-info';
            document.body.appendChild(infoPanel);
        }
        
        const info = building.userData.info || { name: "Edificio sin información", type: "Desconocido" };
        
        // Generamos HTML para mostrar información específica según el tipo de edificio
        let additionalInfo = '';
        
        if (info.type === 'Comercial' || info.type === 'Servicio') {
            additionalInfo = `
                <p><strong>Año de construcción:</strong> ${info.yearBuilt || 'N/A'}</p>
                <p><strong>Plantas:</strong> ${info.floors || 'N/A'}</p>
                <p>${info.description || ''}</p>
            `;
        } else if (info.type === 'Residencial' || info.type === 'Hotel') {
            additionalInfo = `
                <p><strong>Año de construcción:</strong> ${info.yearBuilt || 'N/A'}</p>
                <p>${info.description || ''}</p>
                ${info.amenities ? '<p><strong>Servicios:</strong> ' + info.amenities.join(', ') + '</p>' : ''}
            `;
        } else if (info.type === 'Gubernamental' || info.type === 'Cultural') {
            additionalInfo = `
                <p><strong>Estilo:</strong> ${info.style || 'Moderno'}</p>
                <p><strong>Año de construcción:</strong> ${info.yearBuilt || 'N/A'}</p>
                <p>${info.historicValue || ''}</p>
                <p>${info.description || ''}</p>
            `;
        }
        
        // Generamos HTML para las reseñas
        let reviewsHTML = '';
        if (info.reseñas && info.reseñas.length > 0) {
            reviewsHTML = '<div class="reviews-container"><h4>Reseñas</h4>';
            
            info.reseñas.forEach(review => {
                const stars = '⭐'.repeat(review.puntuacion);
                const date = new Date(review.fecha).toLocaleDateString('es-ES');
                reviewsHTML += `
                    <div class="review ${review.puntuacion >= 4 ? 'review-good' : (review.puntuacion <= 2 ? 'review-bad' : 'review-neutral')}">
                        <div class="review-rating">${stars} (${review.puntuacion}/5)</div>
                        <div class="review-date">Fecha: ${date}</div>
                        <div class="review-comment">${review.comentario}</div>
                    </div>
                `;
            });
            
            reviewsHTML += '</div>';
        }
        
        infoPanel.innerHTML = `
            <h3>${info.name}</h3>
            <p><strong>Tipo:</strong> ${info.type}</p>
            <p><strong>Altura:</strong> ${info.height || 'No disponible'}</p>
            ${additionalInfo}
            ${reviewsHTML}
            <button id="close-info-btn">Cerrar</button>
        `;
        
        // Agregar evento al botón para prevenir propagación y activar temporizador
        document.getElementById('close-info-btn').addEventListener('click', (event) => {
            event.stopPropagation(); // Evitar que el evento llegue al edificio debajo
            this.hideBuildingInfo();
            
            // First store selectedBuilding in a temp variable before setting to null
            const previousSelected = this.selectedBuilding;
            this.selectedBuilding = null; 
            
            // Restore material AFTER clearing the selection
            if (previousSelected) {
                this.restoreMaterial(previousSelected);
            }
            
            // Activar temporizador para bloquear la apertura del panel durante 1 segundo
            this.canShowInfoPanel = false;
            setTimeout(() => {
                this.canShowInfoPanel = true;
            }, INFO_PANEL_COOLDOWN);
        });
        
        infoPanel.style.display = 'block';
        
        // Prevenir clics pasando a través del panel
        infoPanel.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
    
    hideBuildingInfo() {
        const infoPanel = document.getElementById('building-info');
        if (infoPanel) {
            infoPanel.style.display = 'none';
        }
    }

    // Método de depuración mejorado
    debugBuildingInfo() {
        console.log("=== DEPURACIÓN DE EDIFICIOS ===");
        
        // Contar edificios y partes
        let totalParts = 0;
        const buildingGroups = new Map();
        
        this.cityModel.traverse((object) => {
            if (object.isMesh && object.userData.isBuilding) {
                totalParts++;
                const groupId = object.userData.buildingGroup;
                
                if (groupId) {
                    if (!buildingGroups.has(groupId)) {
                        buildingGroups.set(groupId, {
                            parts: [],
                            info: object.userData.info
                        });
                    }
                    
                    buildingGroups.get(groupId).parts.push(object);
                }
            }
        });
        
        console.log(`Estadísticas:
- Total de partes de edificios: ${totalParts}
- Total de edificios completos: ${buildingGroups.size}`);
        
        // Mostrar detalle de algunos edificios
        let count = 0;
        buildingGroups.forEach((building, groupId) => {
            if (count < 5) { // Mostrar solo los primeros 5
                console.log(`Edificio ${groupId}:`);
                console.log(`  - Partes: ${building.parts.length}`);
                console.log(`  - Información:`, building.info);
                count++;
            }
        });
    }

    isHoveringBuilding() {
        return this.hoveredBuilding !== null;
    }

    restoreMaterial(object) {
        // Restore original material for all parts of the building
        const buildingGroup = object.userData.buildingGroup;
        if (buildingGroup) {
            this.cityModel.traverse((groupObject) => {
                if (groupObject.isMesh && 
                    groupObject.userData.buildingGroup === buildingGroup && 
                    groupObject !== this.selectedBuilding) {
                    if (groupObject.userData.originalMaterial) {
                        if (Array.isArray(groupObject.userData.originalMaterial)) {
                            groupObject.material = groupObject.userData.originalMaterial.slice();
                        } else {
                            groupObject.material = groupObject.userData.originalMaterial.clone();
                        }
                    }
                }
            });
        } else if (object.userData.originalMaterial) {
            // If no group, restore just this mesh
            if (Array.isArray(object.userData.originalMaterial)) {
                object.material = object.userData.originalMaterial.slice();
            } else {
                object.material = object.userData.originalMaterial.clone();
            }
        }
    }

    highlightBuilding(object, emissiveColor = 0x333333, intensity = 0.5) {
        // Highlight all parts of the building
        const buildingGroup = object.userData.buildingGroup;
        if (buildingGroup) {
            this.cityModel.traverse((groupObject) => {
                if (groupObject.isMesh && 
                    groupObject.userData.buildingGroup === buildingGroup &&
                    groupObject !== this.selectedBuilding) {
                    this.applyHighlightMaterial(groupObject, emissiveColor, intensity);
                }
            });
        } else {
            // If no group, highlight just this mesh
            this.applyHighlightMaterial(object, emissiveColor, intensity);
        }
    }

    applyHighlightMaterial(object, emissiveColor, intensity) {
        if (!object.material) return;
        
        if (Array.isArray(object.material)) {
            // Handle multi-material objects
            const newMaterials = object.material.map(mat => {
                if (mat) {
                    const newMat = mat.clone();
                    newMat.emissive = new THREE.Color(emissiveColor);
                    newMat.emissiveIntensity = intensity;
                    return newMat;
                }
                return mat;
            });
            object.material = newMaterials;
        } else {
            // Handle single material
            const newMaterial = object.material.clone();
            newMaterial.emissive = new THREE.Color(emissiveColor);
            newMaterial.emissiveIntensity = intensity;
            object.material = newMaterial;
        }
    }
}
