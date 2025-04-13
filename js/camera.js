 
// Initialize camera
const initCamera = async (videoElement, facingMode = 'environment') => {
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
        return stream;
    } catch (err) {
        console.error("Camera error: ", err);
        alert("Could not access the camera. Please make sure you have granted camera permissions.");
        return null;
    }
};

// Stop camera stream
const stopCamera = (stream) => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
};


 // Capture image from video stream
const captureImage = (videoElement) => {
    const canvas = document.createElement('canvas');
    
    // Check if device is in portrait mode
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    
    // Set canvas dimensions based on orientation
    if (isPortrait) {
        // For portrait mode, first capture full resolution
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Create a new canvas for cropped image with 16:9 aspect ratio
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = canvas.width; // Maintain original width
        croppedCanvas.height = canvas.width * (9/16); // Calculate height for 16:9 ratio
        
        const croppedCtx = croppedCanvas.getContext('2d');
        
        // Calculate vertical crop coordinate (center of image)
        const cropY = (canvas.height - croppedCanvas.height) / 2;
        
        // Draw cropped portion to new canvas (maintaining full width)
        croppedCtx.drawImage(
            canvas, 
            0, cropY, canvas.width, croppedCanvas.height,
            0, 0, croppedCanvas.width, croppedCanvas.height
        );
        
        // Return the cropped image
        return croppedCanvas.toDataURL('image/jpeg', 0.9);
    } else {
        // For landscape, maintain ID card aspect ratio (90mm x 55mm)
        canvas.width = 340; // ~90mm in pixels
        canvas.height = 210; // ~55mm in pixels
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        return canvas.toDataURL('image/jpeg', 0.9);
    }
    
    // Return the image data as a base64 string with higher quality
    return canvas.toDataURL('image/jpeg', 0.9);
};

// Process image with PhotoRoom API
const processImageWithPhotoRoom = async (imageData) => {
    try {
        // Convert base64 to blob
        const blob = await fetch(imageData).then(res => res.blob());
        
        // Create form data
        const formData = new FormData();
        formData.append('image_file', blob);
        
        // API request
        const response = await fetch('https://sdk.photoroom.com/v1/segment', {
            method: 'POST',
            headers: {
                'Accept': 'image/png, application/json',
                'x-api-key': 'bbccf26070c9cf62142597cf8250acdd8a914d4a'
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        // Convert response to blob then to base64
        const resultBlob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(resultBlob);
        });
    } catch (error) {
        console.error('Error processing image:', error);
        // Return original image if processing fails
        return imageData;
    }
};

export { initCamera, stopCamera, captureImage, processImageWithPhotoRoom };