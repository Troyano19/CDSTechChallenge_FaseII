const renderTrails = async (trail) => {
    document.title = "GreenLake -"+ trail.name;
    document.getElementById("foto").style.backgroundImage = `url(${trail.images.banner})`;
    document.getElementsByClassName("business-name")[0].textContent = trail.name;
    if(trail.difficulty === "easy") {
        document.getElementById("dificultad").textContent = "Fácil";
    }else if(trail.difficulty === "medium") {
        document.getElementById("dificultad").textContent = "Medio";
    }else if(trail.difficulty === "hard") {
        document.getElementById("dificultad").textContent = "Difícil";
    }else{
        document.getElementById("dificultad").textContent = trail.difficulty;
    }
    document.getElementsByClassName("business-description")[0].textContent = trail.description;
    const tagsContainer = document.getElementsByClassName("business-tags")[0];
    if (tagsContainer && trail.tags && Array.isArray(trail.tags)) {
        // Limpiar el contenido existente
        tagsContainer.innerHTML = "";
        trail.tags.forEach(tag => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    }
}
const renderOpenHours = (open_hours) => {
    // Definir el orden de los días
    const daysOrder = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    let html = '';

    daysOrder.forEach(day => {
        if (open_hours[day] && open_hours[day].length > 0) {
            // Capitalizar el nombre del día
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            // Crear una cadena con cada intervalo "open - close", separados por comas si hay varios
            const intervals = open_hours[day]
                .map(interval => `${interval.open} - ${interval.close}`)
                .join(', ');
            html += `
                <div class="day-hours">
                    <span class="day-name">${dayName}</span>
                    <span class="day-time">${intervals}</span>
                </div>
            `;
        }
    });
    return html;
};

export {renderTrails};