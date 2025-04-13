import { captureImage, initCamera, processImageWithPhotoRoom, stopCamera } from './camera.js';
import { exportToPdf } from './export.js';

// State management
const state = {
    frontImage: null,
    backImage: null,
    stream: null,
    streamBack: null
};

// DOM Elements
const elements = {
    step1Content: document.getElementById('step1Content'),
    step2Content: document.getElementById('step2Content'),
    step3Content: document.getElementById('step3Content'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    stepLine2: document.getElementById('stepLine2'),
    cameraView: document.getElementById('cameraView'),
    cameraViewBack: document.getElementById('cameraViewBack'),
    captureFrontBtn: document.getElementById('captureFrontBtn'),
    captureBackBtn: document.getElementById('captureBackBtn'),
    nextToBackBtn: document.getElementById('nextToBackBtn'),
    backToFrontBtn: document.getElementById('backToFrontBtn'),
    nextToPreviewBtn: document.getElementById('nextToPreviewBtn'),
    exportPdfBtn: document.getElementById('exportPdfBtn'),
    restartProcessBtn: document.getElementById('restartProcessBtn'),
    frontPreview: document.getElementById('frontPreview'),
    backPreview: document.getElementById('backPreview'),
    frontProcessing: document.getElementById('frontProcessing'),
    backProcessing: document.getElementById('backProcessing')
};

// Event Handlers
const setupEventHandlers = () => {
    // Capture front button
    elements.captureFrontBtn.addEventListener('click', async () => {
        elements.frontProcessing.style.display = 'flex';
        
        // Capture image
        const imageData = captureImage(elements.cameraView);
        state.frontImage = imageData;
        
        // Process image
        const processedImage = await processImageWithPhotoRoom(imageData);
        state.frontImage = processedImage;
        
        elements.frontProcessing.style.display = 'none';
        elements.nextToBackBtn.disabled = false;
    });
    
    // Next to back button
    elements.nextToBackBtn.addEventListener('click', () => {
        // Stop front camera
        stopCamera(state.stream);
        
        // Show step 2
        elements.step1Content.style.display = 'none';
        elements.step2Content.style.display = 'block';
        elements.step2.classList.remove('inactive');
        elements.step2.classList.add('active');
        elements.stepLine2.classList.add('active');
        
        // Initialize back camera
        initCamera(elements.cameraViewBack).then(stream => {
            state.streamBack = stream;
        });
    });
    
    // Capture back button
    elements.captureBackBtn.addEventListener('click', async () => {
        elements.backProcessing.style.display = 'flex';
        
        // Capture image
        const imageData = captureImage(elements.cameraViewBack);
        state.backImage = imageData;
        
        // Process image
        const processedImage = await processImageWithPhotoRoom(imageData);
        state.backImage = processedImage;
        
        elements.backProcessing.style.display = 'none';
        elements.nextToPreviewBtn.disabled = false;
    });
    
    // Back to front button
    elements.backToFrontBtn.addEventListener('click', () => {
        // Stop back camera
        stopCamera(state.streamBack);
        
        // Show step 1
        elements.step2Content.style.display = 'none';
        elements.step1Content.style.display = 'block';
        elements.step2.classList.remove('active');
        elements.step2.classList.add('inactive');
        elements.stepLine2.classList.remove('active');
        elements.nextToBackBtn.disabled = state.frontImage === null;
        
        // Reinitialize front camera
        initCamera(elements.cameraView).then(stream => {
            state.stream = stream;
        });
    });
    
    // Next to preview button
    elements.nextToPreviewBtn.addEventListener('click', () => {
        // Stop back camera
        stopCamera(state.streamBack);
        
        // Show step 3
        elements.step2Content.style.display = 'none';
        elements.step3Content.style.display = 'block';
        elements.step3.classList.remove('inactive');
        elements.step3.classList.add('active');
        
        // Set preview images
        elements.frontPreview.src = state.frontImage;
        elements.backPreview.src = state.backImage;
    });
    
    // Export PDF button
    elements.exportPdfBtn.addEventListener('click', exportToPdf);
    
    // Restart process button
    elements.restartProcessBtn.addEventListener('click', () => {
        // Reset state
        state.frontImage = null;
        state.backImage = null;
        
        // Show step 1
        elements.step3Content.style.display = 'none';
        elements.step1Content.style.display = 'block';
        
        // Reset steps
        elements.step2.classList.remove('active');
        elements.step2.classList.add('inactive');
        elements.step3.classList.remove('active');
        elements.step3.classList.add('inactive');
        elements.stepLine2.classList.remove('active');
        
        // Reset buttons
        elements.nextToBackBtn.disabled = true;
        elements.nextToPreviewBtn.disabled = true;
        
        // Reinitialize front camera
        initCamera(elements.cameraView).then(stream => {
            state.stream = stream;
        });
    });
};

// Initialize the app
const initApp = async () => {
    // Initialize front camera
    state.stream = await initCamera(elements.cameraView);
    
    // Set up event handlers
    setupEventHandlers();
};

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);