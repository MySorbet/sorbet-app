import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Captures an HTML element using html2canvas and converts it to a base64-encoded PDF string.
 * The output is a rasterized image-based PDF — pixel-perfect match to what the user sees.
 *
 * @param element - The DOM element to render into a PDF
 * @returns Base64-encoded PDF string (without the data URI prefix)
 */
export const generateInvoicePdfBase64 = async (
  element: HTMLElement
): Promise<string> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // A4 dimensions in mm
  const pageWidth = 210;
  const pageHeight = (canvas.height * pageWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: pageHeight > pageWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);

  // Return only the base64 portion (strip "data:application/pdf;base64,")
  return pdf.output('datauristring').split(',')[1];
};
