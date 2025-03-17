export class UI {
    constructor(cameraManager) {
        this.cameraManager = cameraManager;
        this.createResetButton();
        this.createPositionPanel();
    }

    createResetButton() {
        const resetButton = document.createElement('button');
        resetButton.id = 'reset-camera';
        resetButton.textContent = 'Resetear Cámara';
        resetButton.addEventListener('click', () => {
            this.cameraManager.resetCamera();
        });
        document.body.appendChild(resetButton);
    }

    createPositionPanel() {
        const positionPanel = document.createElement('div');
        positionPanel.id = 'position-panel';
        
        // Crear el contenido inicial
        positionPanel.innerHTML = `
            <div class="position-row">X: <span id="pos-x">0.0</span></div>
            <div class="position-row">Y: <span id="pos-y">0.0</span></div>
            <div class="position-row">Z: <span id="pos-z">0.0</span></div>
        `;
        
        document.body.appendChild(positionPanel);
        
        // Guardar referencias a los elementos para actualización rápida
        this.posXElement = document.getElementById('pos-x');
        this.posYElement = document.getElementById('pos-y');
        this.posZElement = document.getElementById('pos-z');
    }

    updatePositionPanel(position) {
        if (this.posXElement && this.posYElement && this.posZElement) {
            this.posXElement.textContent = position.x.toFixed(1);
            this.posYElement.textContent = position.y.toFixed(1);
            this.posZElement.textContent = position.z.toFixed(1);
        }
    }
}
