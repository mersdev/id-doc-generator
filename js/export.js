// PDF export functionality
const exportToPdf = async (state, elements) => {
  const { a4Preview } = elements;
  
  const options = {
    margin: 0,
    filename: 'id-card-document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(options).from(a4Preview).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF: ' + error.message);
  }
};

// Export the module
export { exportToPdf };