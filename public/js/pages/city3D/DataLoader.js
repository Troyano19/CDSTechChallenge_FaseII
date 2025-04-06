/**
 * Clase para manejar la carga y procesamiento de datos para la aplicación
 */
class DataLoader {
    constructor() {
        this.dataReady = false;
        this.csvData = null;
    }

    /**
     * Carga el archivo CSV de opiniones turísticas
     */
    async loadCSV() {
        try {
            const response = await fetch('data/opiniones_turisticas.csv');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo CSV');
            }
            
            const csvText = await response.text();
            this.csvData = this.procesarCSV(csvText);
            this.dataReady = true;
            return this.csvData;
        } catch (error) {
            console.error('Error cargando el CSV:', error);
            return [];
        }
    }
    
    /**
     * Procesa el texto del CSV y lo convierte en un array de objetos
     */
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
    
    /**
     * Maneja correctamente las líneas CSV con campos entre comillas
     */
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

    /**
     * Limpia un texto de marcas de formato tipo markdown
     */
    limpiarTexto(texto) {
        // Eliminar texto entre marcas ** (formato negrita de markdown)
        texto = texto.replace(/\*\*([^*]+)\*\*/g, '');
        // Eliminar texto entre marcas __ (formato negrita de markdown)
        return texto.replace(/__([^_]+)__/g, '');
    }

    /**
     * Filtra y agrupa los datos por servicio/hotel
     */
    getServiciosYHoteles() {
        if (!this.csvData) {
            return { servicios: [], hoteles: [] };
        }
        
        // Filtrar solo servicios y hoteles y excluir comentarios con errores
        const datosFiltrados = this.csvData.filter(row => 
            (row.tipo_servicio === 'Servicio' || row.tipo_servicio === 'Hotel') && 
            !row.comentario.includes("[Error: Could not generate text due to API failure]")
        );
        
        // Agrupar por nombre de servicio
        const serviciosAgrupados = {};
        datosFiltrados.forEach(row => {
            const nombreServicio = row.nombre_servicio;
            if (!serviciosAgrupados[nombreServicio]) {
                serviciosAgrupados[nombreServicio] = {
                    nombre: nombreServicio,
                    tipo: row.tipo_servicio,
                    reseñas: []
                };
            }
            
            // Limpiar el comentario de marcas de formato antes de agregarlo
            const comentarioLimpio = this.limpiarTexto(row.comentario);
            
            serviciosAgrupados[nombreServicio].reseñas.push({
                puntuacion: parseInt(row.puntuacion),
                comentario: comentarioLimpio,
                fecha: row.fecha
            });
        });
        
        // Obtener mejor y peor reseña de cada servicio
        const serviciosConReseñas = [];
        Object.values(serviciosAgrupados).forEach(servicio => {
            // Ordenar por puntuación
            servicio.reseñas.sort((a, b) => b.puntuacion - a.puntuacion);
            
            // Tomar mejor y peor
            const mejor = servicio.reseñas[0];
            const peor = servicio.reseñas.length > 1 ? servicio.reseñas[servicio.reseñas.length - 1] : mejor;
            
            serviciosConReseñas.push({
                nombre: servicio.nombre,
                tipo: servicio.tipo,
                mejor: mejor,
                peor: peor
            });
        });
        
        // Separar en servicios y hoteles
        const servicios = serviciosConReseñas.filter(servicio => servicio.tipo === 'Servicio');
        const hoteles = serviciosConReseñas.filter(servicio => servicio.tipo === 'Hotel');
        
        return { servicios, hoteles };
    }
}

// Exportamos una instancia singleton
export const dataLoader = new DataLoader();
