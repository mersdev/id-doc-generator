// Camera Manager - Handles all camera-related operations
export class CameraManager {
    constructor() {
        this.stream = null;
        this.facingMode = "environment";
        this.cameraView = document.getElementById('camera-view');
    }

    async initCamera() {
        try {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
            
            const constraints = {
                video: {
                    facingMode: this.facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.cameraView.srcObject = this.stream;
        } catch (err) {
            console.error("Camera error: ", err);
            alert("Could not access the camera. Please ensure you have granted camera permissions.");
        }
    }

    switchCamera() {
        this.facingMode = this.facingMode === "environment" ? "user" : "environment";
        this.initCamera();
    }

    captureImage() {
        const canvas = document.createElement('canvas');
        canvas.width = this.cameraView.videoWidth;
        canvas.height = this.cameraView.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.cameraView, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
    }
}