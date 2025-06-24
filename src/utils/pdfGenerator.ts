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

  // CSS class for smaller font/margins if needed
  const reduceClass = 'pdf-reduce-font';
  let usedReduceClass = false;

  // Inject style for reduced font if not present
  if (!document.getElementById('pdf-reduce-font-style')) {
    const style = document.createElement('style');
    style.id = 'pdf-reduce-font-style';
    style.innerHTML = `
      .${reduceClass} {
        font-size: 85% !important;
      }
      .${reduceClass} * {
        font-size: 85% !important;
        margin-top: 0.5em !important;
        margin-bottom: 0.5em !important;
        padding-top: 0.2em !important;
        padding-bottom: 0.2em !important;
      }
    `;
    document.head.appendChild(style);
  }

  try {
    // First render attempt
    let canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth
    });

    let imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let imgWidth = canvas.width;
    let imgHeight = canvas.height;
    let ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    // If ratio is too small, try reducing font size/margins and re-render
    if (ratio < 0.7) {
      applyTempClass(element, reduceClass);
      usedReduceClass = true;
      canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        height: element.scrollHeight,
        width: element.scrollWidth
      });
      imgData = canvas.toDataURL('image/png');
      imgWidth = canvas.width;
      imgHeight = canvas.height;
      ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    }

    // Show warning if still very small
    if (ratio < 0.7) {
      alert('Warning: Your resume is very long and will be shrunk to fit a single page. Consider reducing content for better readability.');
    }

    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${resumeData.personalInfo.fullName}_Resume.pdf`);

    // Clean up
    if (usedReduceClass) removeTempClass(element, reduceClass);
  } catch (error) {
    // Clean up in case of error
    if (usedReduceClass) removeTempClass(element, reduceClass);
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
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
