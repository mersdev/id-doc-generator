 
// Initialize camera
const initCamera = async (videoElement, facingMode = 'environment') => {
    try {
        const constraints = {
            video: {
                facingMode: facingMode,
                width: { ideal: 4096, min: 640, max: 4096 },
                height: { ideal: 2160, min: 480, max: 2160 },
                aspectRatio: { ideal: 1.7777777778 },
                frameRate: { ideal: 30, min: 15 }
            }
        };
        
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
    canvas.width = 340; // 90mm in pixels
    canvas.height = 210; // 55mm in pixels
    const ctx = canvas.getContext('2d');
    
    // Draw the current video frame to the canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Return the image data as a base64 string
    return canvas.toDataURL('image/jpeg');
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
                'x-api-key': 'sandbox_bbccf26070c9cf62142597cf8250acdd8a914d4a'
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