// PDF Generation Utilities for Resume Application
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '@/types/resume';

// --- DOM Helper Functions ---
// Temporarily apply a class to an element
const applyTempClass = (element: HTMLElement, className: string) => {
  element.classList.add(className);
};
// Remove a temporary class from an element
const removeTempClass = (element: HTMLElement, className: string) => {
  element.classList.remove(className);
};

// --- Main PDF Generation (with html2canvas) ---
/**
 * Generates a styled PDF from a DOM element (resume preview)
 * @param resumeData Resume data object
 * @param elementId DOM element ID to capture
 */
export const generatePDF = async (resumeData: ResumeData, elementId: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume element not found');
  }

  // PDF page size in mm and px (A4: 210mm x 297mm)
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297
  // 1mm = 3.7795275591px
  const pxPerMm = 3.7795275591;
  const a4WidthPx = Math.floor(pdfWidth * pxPerMm); // ~794px

  // Inject compact styles if not present
  if (!document.getElementById('pdf-compact-style')) {
    const style = document.createElement('style');
    style.id = 'pdf-compact-style';
    style.innerHTML = `
      .pdf-compact, .pdf-compact * {
        font-size: 85% !important;
        line-height: 1.1 !important;
        margin-top: 0.3em !important;
        margin-bottom: 0.3em !important;
        padding-top: 0.2em !important;
        padding-bottom: 0.2em !important;
      }
      .pdf-compact2, .pdf-compact2 * {
        font-size: 75% !important;
        line-height: 1.05 !important;
        margin-top: 0.15em !important;
        margin-bottom: 0.15em !important;
        padding-top: 0.1em !important;
        padding-bottom: 0.1em !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Clone the resume preview node for clean rendering
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = a4WidthPx + 'px';
  clone.style.maxWidth = 'none';
  clone.style.minWidth = '0';
  clone.style.boxSizing = 'border-box';
  clone.style.background = '#fff';
  clone.id = 'resume-preview-pdf';
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  document.body.appendChild(clone);

  // Remove any transform/animation classes for static rendering
  clone.classList.remove('motion-safe', 'animate-pulse');

  // Try with compact class, then more compact if needed
  let compactLevel = 1;
  let fits = false;
  let imgData = '';
  let imgWidth = 0;
  let imgHeight = 0;
  let renderHeight = 0;
  let canvas;
  while (!fits && compactLevel <= 2) {
    clone.classList.remove('pdf-compact', 'pdf-compact2');
    if (compactLevel === 1) clone.classList.add('pdf-compact');
    if (compactLevel === 2) clone.classList.add('pdf-compact2');
    canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: a4WidthPx,
      height: clone.scrollHeight,
      windowWidth: a4WidthPx,
      windowHeight: clone.scrollHeight
    });
    imgData = canvas.toDataURL('image/png');
    imgWidth = canvas.width;
    imgHeight = canvas.height;
    renderHeight = (imgHeight / imgWidth) * pdfWidth;
    fits = renderHeight <= pdfHeight;
    if (!fits) compactLevel++;
  }
  if (!fits) {
    alert('Warning: Your resume is very long and will be scaled down to fit a single page. Consider reducing content for best results.');
  }
  // Always scale the image to fill the entire PDF page (width and height)
  const finalImgWidth = imgWidth;
  const finalImgHeight = imgHeight;
  // Calculate scale to fill the page (cover)
  const scaleX = pdfWidth / (finalImgWidth / 2); // /2 because scale:2
  const scaleY = pdfHeight / (finalImgHeight / 2);
  const finalScale = Math.max(scaleX, scaleY); // Use max to cover the page
  const finalRenderWidth = (finalImgWidth / 2) * finalScale;
  const finalRenderHeight = (finalImgHeight / 2) * finalScale;
  const x = (pdfWidth - finalRenderWidth) / 2;
  const y = (pdfHeight - finalRenderHeight) / 2;
  pdf.addImage(imgData, 'PNG', x, y, finalRenderWidth, finalRenderHeight);
  pdf.save(`${resumeData.personalInfo.fullName}_Resume.pdf`);
  document.body.removeChild(clone);
};

// --- Simple PDF Generation (text only, fallback) ---
/**
 * Generates a simple text-based PDF as a fallback
 * @param resumeData Resume data object
 */
export const generateSimplePDF = (resumeData: ResumeData): void => {
  const pdf = new jsPDF();
  let yPosition = 20;
  const lineHeight = 7;
  const pageHeight: number = (pdf.internal.pageSize as any).height || pdf.internal.pageSize.getHeight();

  // Helper function to add text with wrapping
  const addText = (text: string, x: number, y: number, maxWidth: number = 180): number => {
    const lines: string[] = pdf.splitTextToSize(text, maxWidth) as string[];
    pdf.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };

  // Header
  pdf.setFontSize(20);
  pdf.setFont(undefined as any, 'bold');
  yPosition = addText(resumeData.personalInfo.fullName, 20, yPosition);
  pdf.setFontSize(12);
  pdf.setFont(undefined as any, 'normal');
  yPosition = addText(`${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}`, 20, yPosition + 5);
  yPosition = addText(`${resumeData.personalInfo.location}`, 20, yPosition + 5);
  if (resumeData.personalInfo.linkedIn) {
    yPosition = addText(`LinkedIn: ${resumeData.personalInfo.linkedIn}`, 20, yPosition + 5);
  }
  if (resumeData.personalInfo.website) {
    yPosition = addText(`Portfolio: ${resumeData.personalInfo.website}`, 20, yPosition + 5);
  }

  // Skills Section
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setFont(undefined as any, 'bold');
  yPosition = addText('Skills', 20, yPosition);
  const skillsByCategory = resumeData.skills.reduce((acc: Record<string, string[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);
  Object.entries(skillsByCategory).forEach(([category, skills]) => {
    pdf.setFontSize(11);
    pdf.setFont(undefined as any, 'bold');
    yPosition = addText(`${category}:`, 20, yPosition + 6);
    pdf.setFont(undefined as any, 'normal');
    yPosition = addText(skills.join(', '), 25, yPosition + 3);
  });

  // Experience Section
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setFont(undefined as any, 'bold');
  yPosition = addText('Experience', 20, yPosition);
  resumeData.experience.forEach((exp) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFontSize(12);
    pdf.setFont(undefined as any, 'bold');
    yPosition = addText(`${exp.position} - ${exp.company}`, 20, yPosition + 8);
    pdf.setFontSize(10);
    pdf.setFont(undefined as any, 'normal');
    yPosition = addText(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate} | ${exp.location}`, 20, yPosition + 3);
    yPosition = addText(exp.description, 20, yPosition + 5);
    exp.achievements.forEach((achievement: string) => {
      yPosition = addText(`• ${achievement}`, 25, yPosition + 3);
    });
  });

  // Education Section
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setFont(undefined as any, 'bold');
  yPosition = addText('Education', 20, yPosition);
  resumeData.education.forEach((edu) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFontSize(12);
    pdf.setFont(undefined as any, 'bold');
    yPosition = addText(`${edu.degree} in ${edu.field}`, 20, yPosition + 6);
    pdf.setFont(undefined as any, 'normal');
    yPosition = addText(`${edu.institution} - ${edu.graduationDate}`, 20, yPosition + 3);
    if (edu.gpa) {
      yPosition = addText(`GPA: ${edu.gpa}`, 20, yPosition + 3);
    }
    if (edu.honors) {
      yPosition = addText(`Honors: ${edu.honors}`, 20, yPosition + 3);
    }
  });

  // Additional Sections (Languages, Certifications, etc.)
  if (resumeData.additionalSections && resumeData.additionalSections.length > 0) {
    yPosition += 10;
    resumeData.additionalSections.forEach(section => {
      pdf.setFontSize(14);
      pdf.setFont(undefined as any, 'bold');
      yPosition = addText(section.title, 20, yPosition + 6);
      pdf.setFont(undefined as any, 'normal');
      yPosition = addText(section.items.join(', '), 25, yPosition + 3);
    });
  }

  pdf.save(`${resumeData.personalInfo.fullName}_Resume.pdf`);
};
