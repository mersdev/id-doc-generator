// Image processing functions are now automatically called after capture

// Process both front and back images
const processImages = async (state, elements) => {
  showProcessingOverlay('Processing images...', elements);
  try {
    updateProgress(25, elements);
    const processedFrontImage = await removeBackground(state.frontImage);
    state.processedFrontImage = processedFrontImage;
    elements.processedFrontImage.src = processedFrontImage;
    
    updateProgress(75, elements);
    const processedBackImage = await removeBackground(state.backImage);
    state.processedBackImage = processedBackImage;
    elements.processedBackImage.src = processedBackImage;
    
    updateProgress(100, elements);
    hideProcessingOverlay(elements);
  } catch (error) {
    console.error('Error processing images:', error);
    alert('Error processing images: ' + error.message);
    hideProcessingOverlay(elements);
  }
  updateProgress(0, elements);
};

// Remove background using Photoroom API
const removeBackground = async (imageDataUrl) => {
  const API_KEY = 'sandbox_bbccf26070c9cf62142597cf8250acdd8a914d4a';
  const API_URL = 'https://sdk.photoroom.com/v1/segment';

  // Convert data URL to File object
  const blob = await fetch(imageDataUrl).then(res => res.blob());
  const file = new File([blob], "image.jpg", { type: "image/jpeg" });
  
  // Create form data
  const formData = new FormData();
  formData.append('image_file', file);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const outputBlob = await response.blob();
    return URL.createObjectURL(outputBlob);
  } catch (error) {
    console.error('Error removing background:', error);
    throw new Error('Failed to remove background: ' + error.message);
  }
};

// Update progress bar
const updateProgress = (percentage, elements) => {
  elements.progressBar.style.width = `${percentage}%`;
};

// Show processing overlay
const showProcessingOverlay = (message, elements) => {
  elements.processingStatus.textContent = message;
  elements.processingOverlay.classList.remove('hidden');
};

// Hide processing overlay
const hideProcessingOverlay = (elements) => {
  elements.processingOverlay.classList.add('hidden');
};

// Export the module
export { processImages, removeBackground, updateProgress, showProcessingOverlay, hideProcessingOverlay };