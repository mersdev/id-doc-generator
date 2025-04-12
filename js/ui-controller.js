// UI Controller - Handles DOM manipulation and event handling
export class UIController {
    constructor(app) {
        this.app = app;
        this.currentStep = 1;
        this.frontImage = null;
        this.backImage = null;
        this.initializeElements();
        this.bindEventListeners();
    }

    initializeElements() {
        this.elements = {
            camera: {
                captureBtn: document.getElementById('capture-btn'),
                switchBtn: document.getElementById('switch-camera'),
                view: document.getElementById('camera-view'),
                title: document.getElementById('capture-title')
            },
            preview: {
                section: document.getElementById('preview-section'),
                front: {
                    image: document.getElementById('front-preview'),
                    processing: document.getElementById('front-processing'),
                    retakeBtn: document.getElementById('retake-front')
                },
                back: {
                    image: document.getElementById('back-preview'),
                    processing: document.getElementById('back-processing'),
                    retakeBtn: document.getElementById('retake-back')
                },
                continueBtn: document.getElementById('continue-btn')
            },
            pdf: {
                section: document.getElementById('pdf-preview-section'),
                preview: document.getElementById('pdf-preview'),
                editBtn: document.getElementById('back-to-edit'),
                downloadBtn: document.getElementById('download-pdf'),
                generateBtn: document.getElementById('generate-pdf')
            },
            progress: {
                bar: document.getElementById('step-progress'),
                steps: document.querySelectorAll('.step')
            }
        };
    }

    async handleImageCapture(side) {
        const isfront = side === 'front';
        const preview = this.elements.preview[side];
        
        preview.processing.classList.remove('hidden');
        const imageData = this.app.cameraManager.captureImage();
        
        try {
            const processedImage = await this.app.imageProcessor.processImage(imageData);
            this[`${side}Image`] = processedImage;
            preview.image.src = processedImage;
            preview.processing.classList.add('hidden');
            
            if (!isfront) {
                preview.retakeBtn.classList.remove('hidden');
            }
            
            this.currentStep += 1;
            this.updateUI();
            
            if (isfront) {
                this.elements.preview.section.classList.remove('hidden');
                this.elements.camera.title.textContent = 'Capture Back of ID Card';
            }
        } catch (error) {
            console.error('Image processing failed:', error);
            preview.processing.classList.add('hidden');
        }
    }

    handleRetake(side) {
        const isfront = side === 'front';
        this.currentStep = isfront ? 1 : 2;
        this[`${side}Image`] = null;
        
        const preview = this.elements.preview[side];
        preview.image.src = '';
        
        if (isfront) {
            this.elements.preview.section.classList.add('hidden');
        } else {
            preview.retakeBtn.classList.add('hidden');
        }
        
        this.elements.camera.title.textContent = `Capture ${isfront ? 'Front' : 'Back'} of ID Card`;
        this.updateUI();
    }

    bindEventListeners() {
        this.elements.camera.captureBtn.addEventListener('click', () => {
            this.handleImageCapture(this.currentStep === 1 ? 'front' : 'back');
        });

        this.elements.camera.switchBtn.addEventListener('click', () => {
            this.app.cameraManager.switchCamera();
        });

        this.elements.preview.front.retakeBtn.addEventListener('click', () => {
            this.handleRetake('front');
        });

        this.elements.preview.back.retakeBtn.addEventListener('click', () => {
            this.handleRetake('back');
        });

        this.elements.preview.continueBtn.addEventListener('click', () => {
            if (this.currentStep === 3) {
                const pdfUrl = this.app.pdfGenerator.generatePDF(this.frontImage, this.backImage);
                this.elements.pdf.preview.innerHTML = `<iframe src="${pdfUrl}" style="width:100%;height:100%;border:none;"></iframe>`;
                this.elements.pdf.section.classList.remove('hidden');
                this.elements.preview.section.classList.add('hidden');
            }
        });

        this.elements.pdf.editBtn.addEventListener('click', () => {
            this.elements.pdf.section.classList.add('hidden');
            this.elements.preview.section.classList.remove('hidden');
        });

        this.elements.pdf.downloadBtn.addEventListener('click', () => {
            this.app.pdfGenerator.pdfDoc.save('id-card-document.pdf');
        });
    }

    updateUI() {
        this.elements.progress.bar.style.width = `${(this.currentStep - 1) * 50}%`;
        
        this.elements.progress.steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            const circle = step.querySelector('div');
            const text = step.querySelector('span');
            const isActive = stepNum <= this.currentStep;
            
            circle.classList.toggle('bg-gray-200', !isActive);
            circle.classList.toggle('text-gray-600', !isActive);
            circle.classList.toggle('bg-blue-500', isActive);
            circle.classList.toggle('text-white', isActive);
            
            text.classList.toggle('text-gray-500', !isActive);
            text.classList.toggle('text-gray-700', isActive);
        });
    }
}