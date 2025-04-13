# ID Document Generator

This application helps users capture and process ID card images, then generate PDF documents.

## Workflow

1. **Camera Initialization**
   - The app requests camera access and initializes the video stream
   - Uses `initCamera()` from `camera.js` to start the camera

2. **Image Capture**
   - User positions their ID card within the frame
   - When capture button is clicked, `captureImage()`:
     - Creates canvas element
     - Adjusts dimensions based on device orientation
     - Captures image from video stream
     - Returns base64 encoded image

3. **Image Processing**
   - Uses PhotoRoom API to remove background (`processImageWithPhotoRoom()`)
   - Handles both success and error cases

4. **PDF Generation**
   - Uses html2pdf.js to generate PDF from processed images
   - Includes front and back sides of ID card

## Components

- `index.html`: Main UI with camera view and controls
- `camera.js`: Handles camera operations and image processing
- `main.js`: Coordinates the workflow between components