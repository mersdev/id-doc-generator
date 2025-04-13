// UI management functions
const setupEventListeners = (state, elements) => {
  // Tab navigation
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab, state, elements));
  });
  
  // Capture buttons
  elements.captureFrontBtn.addEventListener('click', () => captureImage('front', state, elements));
  elements.captureBackBtn.addEventListener('click', () => captureImage('back', state, elements));
  
  // Retake buttons
  elements.retakeFrontBtn.addEventListener('click', () => retakeImage('front', state, elements));
  elements.retakeBackBtn.addEventListener('click', () => retakeImage('back', state, elements));
  
  // Navigation buttons
  elements.nextToPreviewBtn.addEventListener('click', () => switchTab('preview', state, elements));
  elements.backToCaptureBtn.addEventListener('click', () => switchTab('capture', state, elements));
  elements.nextToExportBtn.addEventListener('click', () => switchTab('export', state, elements));
  elements.backToPreviewBtn.addEventListener('click', () => switchTab('preview', state, elements));
  
  // Process and export buttons
  elements.processImagesBtn.addEventListener('click', () => processImages(state, elements));
  elements.exportPdfBtn.addEventListener('click', () => exportToPdf(state, elements));
};

// Switch between tabs
const switchTab = (tabName, state, elements) => {
  if (tabName === 'preview' && (!state.frontImage || !state.backImage)) {
    alert('Please capture both front and back images of your ID card first.');
    return;
  }
  
  state.currentTab = tabName;
  
  // Update active tab
  elements.tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  
  // Show active tab content
  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}-tab`);
  });
};

// Export the module
export { setupEventListeners, switchTab };