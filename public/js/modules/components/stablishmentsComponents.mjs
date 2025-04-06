const renderStablishment = async (stablishment) => {
    document.title = "GreenLake -"+ stablishment.name;
    document.getElementById("foto").style.backgroundImage = `url(${stablishment.images.banner})`;
    document.getElementsByClassName("business-name")[0].textContent = stablishment.name;
    document.getElementsByClassName("business-type-tag")[0].textContent = stablishment.type;
    document.getElementsByClassName("business-description")[0].textContent = stablishment.description;
    if(stablishment.open_hours) {
        // Suponiendo que en tu HTML tienes un contenedor con clase "hours-container" (vacíalo previamente o quítalo del HTML estático)
        const hoursContainer = document.querySelector('.hours-container');
        if (hoursContainer) {
            hoursContainer.innerHTML = renderOpenHours(stablishment.open_hours);
        }
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

export {renderStablishment};