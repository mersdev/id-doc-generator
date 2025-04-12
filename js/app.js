// Main App - Orchestrates the components
import { CameraManager } from './camera.js';
import { ImageProcessor } from './image-processor.js';
import { PDFGenerator } from './pdf-generator.js';
import { UIController } from './ui-controller.js';

export class App {
    constructor() {
        this.cameraManager = new CameraManager();
        this.imageProcessor = new ImageProcessor();
        this.pdfGenerator = new PDFGenerator();
        this.uiController = new UIController(this);
        this.initialize();
    }

    async initialize() {
        await this.cameraManager.initCamera();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});