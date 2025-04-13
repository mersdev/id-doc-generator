// Import required functions from image-processing.js
import { showProcessingOverlay, hideProcessingOverlay, updateProgress, removeBackground } from './image-processing.js';

// Camera initialization and management
const initializeCamera = async (videoElement, side, state) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Camera access is not supported by your browser');
    return;
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }, 
      audio: false 
    });
    
    videoElement.srcObject = stream;
    if (side === 'front') {
      state.frontStream = stream;
    } else {
      state.backStream = stream;
    }
  } catch (err) {
    console.error('Error accessing camera:', err);
    alert('Error accessing camera: ' + err.message);
  }
};

// Setup canvas elements
const setupCanvas = (elements) => {
  elements.frontCanvas.width = 90 * 3.779527559; // Convert mm to px (96dpi)
  elements.frontCanvas.height = 55 * 3.779527559;
  elements.backCanvas.width = 90 * 3.779527559;
  elements.backCanvas.height = 55 * 3.779527559;
};

// Capture image from video stream
const captureImage = async (side, state, elements) => {
  const video = side === 'front' ? elements.frontVideo : elements.backVideo;
  const canvas = side === 'front' ? elements.frontCanvas : elements.backCanvas;
  const context = canvas.getContext('2d');
  
  // Calculate center crop
  const videoAspect = video.videoWidth / video.videoHeight;
  const canvasAspect = canvas.width / canvas.height;
  
  let sx, sy, sWidth, sHeight;
  
  if (videoAspect > canvasAspect) {
    // Video is wider than canvas
    sHeight = video.videoHeight;
    sWidth = video.videoHeight * canvasAspect;
    sx = (video.videoWidth - sWidth) / 2;
    sy = 0;
  } else {
    // Video is taller than canvas
    sWidth = video.videoWidth;
    sHeight = video.videoWidth / canvasAspect;
    sx = 0;
    sy = (video.videoHeight - sHeight) / 2;
  }
  
  // Draw the cropped image to the canvas
  context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
  
  // Convert to data URL
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  
  // Update state and UI
  if (side === 'front') {
    state.frontImage = dataUrl;
    elements.frontImage.src = dataUrl;
    elements.frontPreview.classList.remove('hidden');
    elements.frontVideo.parentElement.classList.add('hidden');
    elements.captureFrontBtn.classList.add('hidden');
    
    // Auto process front image
    showProcessingOverlay('Processing front image...', elements);
    try {
      updateProgress(10, elements);
      const processedFrontImage = await removeBackground(dataUrl);
      state.processedFrontImage = processedFrontImage;
      elements.processedFrontImage.src = processedFrontImage;
      elements.processedFrontImage.style.display = 'block';
      updateProgress(50, elements);
      hideProcessingOverlay(elements);
    } catch (error) {
      console.error('Error processing front image:', error);
      alert('Error processing front image: ' + error.message);
      hideProcessingOverlay(elements);
    }
  } else {
    state.backImage = dataUrl;
    elements.backImage.src = dataUrl;
    elements.backPreview.classList.remove('hidden');
    elements.backVideo.parentElement.classList.add('hidden');
    elements.captureBackBtn.classList.add('hidden');
    
    // Auto process back image
    showProcessingOverlay('Processing back image...', elements);
    try {
      updateProgress(50, elements);
      const processedBackImage = await removeBackground(dataUrl);
      state.processedBackImage = processedBackImage;
      elements.processedBackImage.src = processedBackImage;
      elements.processedBackImage.style.display = 'block';
      updateProgress(100, elements);
      hideProcessingOverlay(elements);
    } catch (error) {
      console.error('Error processing back image:', error);
      alert('Error processing back image: ' + error.message);
      hideProcessingOverlay(elements);
    }
  }
  updateProgress(0, elements);
};

// Retake image
const retakeImage = (side, state, elements) => {
  if (side === 'front') {
    state.frontImage = null;
    elements.frontPreview.classList.add('hidden');
    elements.frontVideo.parentElement.classList.remove('hidden');
    elements.captureFrontBtn.classList.remove('hidden');
  } else {
    state.backImage = null;
    elements.backPreview.classList.add('hidden');
    elements.backVideo.parentElement.classList.remove('hidden');
    elements.captureBackBtn.classList.remove('hidden');
  }
};

// Export the module
export { initializeCamera, setupCanvas, captureImage, retakeImage };