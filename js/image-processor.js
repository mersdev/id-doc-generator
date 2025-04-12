// Image Processor - Handles image processing operations
export class ImageProcessor {
    processImage(imageData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    const margin = 0.1;
                    const cropX = img.width * margin;
                    const cropY = img.height * margin;
                    const cropWidth = img.width * (1 - 2*margin);
                    const cropHeight = img.height * (1 - 2*margin);
                    
                    canvas.width = cropWidth;
                    canvas.height = cropHeight;
                    
                    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
                    
                    const finalCanvas = document.createElement('canvas');
                    finalCanvas.width = cropWidth;
                    finalCanvas.height = cropHeight;
                    const finalCtx = finalCanvas.getContext('2d');
                    
                    finalCtx.fillStyle = 'white';
                    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
                    finalCtx.drawImage(canvas, 0, 0);
                    
                    resolve(finalCanvas.toDataURL('image/jpeg'));
                };
                
                img.src = imageData;
            }, 1500);
        });
    }
}