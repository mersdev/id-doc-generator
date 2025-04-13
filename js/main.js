// Import modules
import { createState, getElements, init } from './core.js';
import { initializeCamera, setupCanvas, captureImage, retakeImage } from './camera.js';
import { processImages, removeBackground, updateProgress, showProcessingOverlay, hideProcessingOverlay } from './image-processing.js';
import { setupEventListeners, switchTab } from './ui.js';
import { exportToPdf } from './export.js';

// Make functions available globally
window.captureImage = captureImage;
window.retakeImage = retakeImage;
window.processImages = processImages;
window.exportToPdf = exportToPdf;
window.switchTab = switchTab;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const state = createState();
  const elements = getElements();
  init(state, elements);
});