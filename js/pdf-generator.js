// PDF Generator - Handles PDF creation and manipulation
export class PDFGenerator {
    constructor() {
        this.pdfDoc = null;
        this.frontImage = null;
        this.backImage = null;
    }

    generatePDF(frontImage, backImage) {
        this.frontImage = frontImage;
        this.backImage = backImage;
        
        const { jsPDF } = window.jspdf;
        this.pdfDoc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm'
        });

        this.pdfDoc.setFontSize(16);
        this.pdfDoc.text('ID Card Document', 105, 10, { align: 'center' });

        if (this.frontImage) {
            this.addImageToPDF(this.frontImage, 20);
        }
        
        if (this.backImage) {
            this.addImageToPDF(this.backImage, 150);
        }

        return this.pdfDoc.output('datauristring');
    }

    addImageToPDF(imageData, yPosition) {
        if (!imageData) return;

        const img = new Image();
        img.src = imageData;

        const maxWidth = 180;
        const maxHeight = 120;

        let width = img.width * 0.264583;
        let height = img.height * 0.264583;

        const scale = Math.min(maxWidth / width, maxHeight / height, 1);
        width *= scale;
        height *= scale;

        const x = (210 - width) / 2;
        this.pdfDoc.addImage(imageData, 'JPEG', x, yPosition, width, height);
    }

    deleteImage(side) {
        if (side === 'front') {
            this.frontImage = null;
        } else if (side === 'back') {
            this.backImage = null;
        }
        return this.generatePDF(this.frontImage, this.backImage);
    }
}