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
export {renderTrails};