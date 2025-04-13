// State management
const createState = () => ({
  frontImage: null,
  backImage: null,
  processedFrontImage: null,
  processedBackImage: null,
  currentTab: 'capture',
  frontStream: null,
  backStream: null
});

// DOM elements
const getElements = () => ({
  tabs: document.querySelectorAll('.tab'),
  tabContents: document.querySelectorAll('.tab-content'),
  frontVideo: document.getElementById('front-video'),
  backVideo: document.getElementById('back-video'),
  captureFrontBtn: document.getElementById('capture-front'),
  captureBackBtn: document.getElementById('capture-back'),
  frontCanvas: document.getElementById('front-canvas'),
  backCanvas: document.getElementById('back-canvas'),
  frontImage: document.getElementById('front-image'),
  backImage: document.getElementById('back-image'),
  frontPreview: document.getElementById('front-preview'),
  backPreview: document.getElementById('back-preview'),
  retakeFrontBtn: document.getElementById('retake-front'),
  retakeBackBtn: document.getElementById('retake-back'),
  nextToPreviewBtn: document.getElementById('next-to-preview'),
  backToCaptureBtn: document.getElementById('back-to-capture'),
  nextToExportBtn: document.getElementById('next-to-export'),
  backToPreviewBtn: document.getElementById('back-to-preview'),
  processImagesBtn: document.getElementById('process-images'),
  exportPdfBtn: document.getElementById('export-pdf'),
  progressBar: document.getElementById('progress-bar'),
  processedFrontImage: document.getElementById('processed-front-image'),
  processedBackImage: document.getElementById('processed-back-image'),
  a4Preview: document.getElementById('a4-preview'),
  processingOverlay: document.getElementById('processing-overlay'),
  processingStatus: document.getElementById('processing-status')
});

// Import required functions
import { setupEventListeners } from './ui.js';
import { initializeCamera, setupCanvas } from './camera.js';

// Initialize the application
const init = (state, elements) => {
  // Set up event listeners
  setupEventListeners(state, elements);
  
  // Initialize camera streams
  initializeCamera(elements.frontVideo, 'front', state);
  initializeCamera(elements.backVideo, 'back', state);
  
  // Setup canvas contexts
  setupCanvas(elements);
};

// Export the module
export { createState, getElements, init };