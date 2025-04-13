  // Export to PDF
  const exportToPdf = () => {
    const element = document.getElementById('a4Preview');
    const opt = {
        margin: 10,
        filename: 'id_card_copy.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
};

export { exportToPdf };