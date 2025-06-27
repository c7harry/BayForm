import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '../types/resume';

// This is a re-implementation of the PDF generation logic.
// It aims to create a PDF that looks identical to the preview
// and handles multi-page resumes by avoiding cutting through elements.
export const generatePDF = async (resumeData: ResumeData, elementId: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume element not found');
  }

  try {
    // Use html2canvas to capture the entire resume element as a single, high-quality image.
    // This ensures the PDF looks exactly like the web preview.
    const canvas = await html2canvas(element, {
      scale: 2, // Use a higher scale for better resolution in the PDF
      useCORS: true, // Allows rendering of cross-origin images
      backgroundColor: '#ffffff',
      // Set canvas dimensions to match the full scrollable content of the element
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const pdf = new jsPDF('p', 'mm', 'a4'); // Create a standard A4 size PDF in portrait mode
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate the ratio to fit the canvas width to the PDF width
    const widthRatio = pdfWidth / canvasWidth;
    const scaledCanvasHeight = canvasHeight * widthRatio;

    // If the entire resume fits on a single page, add it and save the PDF.
    if (scaledCanvasHeight <= pdfHeight) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, scaledCanvasHeight);
    } else {
      // For resumes that need multiple pages, implement intelligent page breaks.
      let yPositionOnCanvas = 0; // Tracks the y-position on the source canvas for slicing

      while (yPositionOnCanvas < canvasHeight) {
        if (yPositionOnCanvas > 0) {
          pdf.addPage();
        }

        // Determine the maximum possible content height for the current PDF page
        const maxHeightOnCanvas = pdfHeight / widthRatio;
        let pageContentHeight = maxHeightOnCanvas;

        // Find the best position to break the page to avoid cutting elements in half.
        // We do this by checking the positions of the direct children of the resume container.
        let bestBreakPoint = yPositionOnCanvas + maxHeightOnCanvas;
        
        const childElements = Array.from(element.children) as HTMLElement[];
        let lastFittingElementBottom = yPositionOnCanvas;

        for (const child of childElements) {
          const childTop = child.offsetTop * 2; // Multiply by scale to match canvas coordinates
          const childBottom = (child.offsetTop + child.offsetHeight) * 2;

          // If the bottom of the element is within the current page, it's a potential break point.
          if (childBottom <= bestBreakPoint) {
            lastFittingElementBottom = childBottom;
          } else {
            // This element is cut by the page break.
            // If we found at least one element that fits, we break after the last fitting one.
            if (lastFittingElementBottom > yPositionOnCanvas) {
              bestBreakPoint = lastFittingElementBottom;
            }
            // Once we find an element that gets cut, we stop and use the best break point found so far.
            break;
          }
        }
        
        // If a good break point was found, use it. Otherwise, a hard cut is necessary (e.g., for a single element taller than a page).
        pageContentHeight = bestBreakPoint - yPositionOnCanvas;
        
        // Ensure the final slice does not exceed the canvas height
        if (yPositionOnCanvas + pageContentHeight > canvasHeight) {
            pageContentHeight = canvasHeight - yPositionOnCanvas;
        }

        // Create a temporary canvas for the current page's content slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = pageContentHeight;
        const pageCtx = pageCanvas.getContext('2d');

        if (pageCtx) {
          // Copy the calculated slice from the main canvas to the page-specific canvas
          pageCtx.drawImage(canvas, 0, yPositionOnCanvas, canvasWidth, pageContentHeight, 0, 0, canvasWidth, pageContentHeight);
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          const pageImgHeight = (pageCanvas.height / canvasWidth) * pdfWidth;
          
          // Add the slice as an image to the current PDF page
          pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageImgHeight);
        }

        // Move to the next slice of the canvas
        yPositionOnCanvas += pageContentHeight;
      }
    }

    pdf.save(`${resumeData.personalInfo.fullName}_Resume.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const generateSimplePDF = (resumeData: ResumeData): void => {
  const pdf = new jsPDF();
  let yPosition = 20;
  const lineHeight = 7;
  const pageHeight: number = (pdf.internal.pageSize as any).height || pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxY = pageHeight - margin; // Leave margin at bottom

  // Helper function to check if we need a new page
  const checkNewPage = (additionalLines: number = 1): void => {
    if (yPosition + (additionalLines * lineHeight) > maxY) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Helper function to add text with wrapping and page breaks
  const addText = (text: string, x: number, y: number, maxWidth: number = 180): number => {
    const lines: string[] = pdf.splitTextToSize(text, maxWidth) as string[];
    
    // Check if we need a new page for all lines
    checkNewPage(lines.length);
    
    // If we still don't have enough space after page break, split across pages
    let currentY = yPosition;
    let lineIndex = 0;
    
    while (lineIndex < lines.length) {
      // Calculate how many lines we can fit on current page
      const remainingSpace = maxY - currentY;
      const linesPerPage = Math.floor(remainingSpace / lineHeight);
      const linesToAdd = Math.min(linesPerPage, lines.length - lineIndex);
      
      if (linesToAdd <= 0) {
        pdf.addPage();
        currentY = 20;
        continue;
      }
      
      // Add lines that fit on current page
      const pageLines = lines.slice(lineIndex, lineIndex + linesToAdd);
      pdf.text(pageLines, x, currentY);
      currentY += pageLines.length * lineHeight;
      lineIndex += linesToAdd;
      
      // If more lines remain, add new page
      if (lineIndex < lines.length) {
        pdf.addPage();
        currentY = 20;
      }
    }
    
    yPosition = currentY;
    return yPosition;
  };

  // Header
  checkNewPage(4); // Reserve space for header
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

  // Skills (Top Section)
  yPosition += 10;
  checkNewPage(3);
  pdf.setFontSize(14);
  pdf.setFont(undefined as any, 'bold');
  yPosition = addText('Skills', 20, yPosition);
  const skillsByCategory = resumeData.skills.reduce((acc: Record<string, string[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);
  Object.entries(skillsByCategory).forEach(([category, skills]) => {
    checkNewPage(2);
    pdf.setFontSize(11);
    pdf.setFont(undefined as any, 'bold');
    yPosition = addText(`${category}:`, 20, yPosition + 6);
    pdf.setFont(undefined as any, 'normal');
    yPosition = addText(skills.join(', '), 25, yPosition + 3);
  });

  // Experience
  yPosition += 10;
  checkNewPage(3);
  pdf.setFontSize(14);
  pdf.setFont(undefined as any, 'bold');
  yPosition = addText('Experience', 20, yPosition);
  resumeData.experience.forEach((exp) => {
    // Estimate space needed for this experience entry
    const estimatedLines = 3 + exp.achievements.length + (exp.description ? 2 : 0);
    checkNewPage(estimatedLines);
    
    pdf.setFontSize(12);
    pdf.setFont(undefined as any, 'bold');
    yPosition = addText(`${exp.position} - ${exp.company}`, 20, yPosition + 8);
    pdf.setFontSize(10);
    pdf.setFont(undefined as any, 'normal');
    yPosition = addText(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate} | ${exp.location}`, 20, yPosition + 3);
    if (exp.description) {
      yPosition = addText(exp.description, 20, yPosition + 5);
    }
    exp.achievements.forEach((achievement: string) => {
      yPosition = addText(`• ${achievement}`, 25, yPosition + 3);
    });
  });

  // Education
  yPosition += 10;
  checkNewPage(3);
  pdf.setFontSize(14);
  pdf.setFont(undefined as any, 'bold');
  yPosition = addText('Education', 20, yPosition);
  resumeData.education.forEach((edu) => {
    checkNewPage(4);
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

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    yPosition += 10;
    checkNewPage(3);
    pdf.setFontSize(14);
    pdf.setFont(undefined as any, 'bold');
    yPosition = addText('Projects', 20, yPosition);
    resumeData.projects.forEach((project) => {
      checkNewPage(4);
      pdf.setFontSize(12);
      pdf.setFont(undefined as any, 'bold');
      yPosition = addText(project.name, 20, yPosition + 6);
      pdf.setFont(undefined as any, 'normal');
      yPosition = addText(project.description, 20, yPosition + 3);
      if (project.technologies && project.technologies.length > 0) {
        yPosition = addText(`Technologies: ${project.technologies.join(', ')}`, 20, yPosition + 3);
      }
      if (project.url) {
        yPosition = addText(`Live Demo: ${project.url}`, 20, yPosition + 3);
      }
      if (project.github) {
        yPosition = addText(`GitHub: ${project.github}`, 20, yPosition + 3);
      }
    });
  }

  // Additional Sections (Languages, Certifications, etc.)
  if (resumeData.additionalSections && resumeData.additionalSections.length > 0) {
    yPosition += 10;
    resumeData.additionalSections.forEach(section => {
      if (section.items && section.items.length > 0) {
        checkNewPage(3);
        pdf.setFontSize(14);
        pdf.setFont(undefined as any, 'bold');
        yPosition = addText(section.title, 20, yPosition + 6);
        pdf.setFont(undefined as any, 'normal');
        yPosition = addText(section.items.join(', '), 25, yPosition + 3);
      }
    });
  }

  pdf.save(`${resumeData.personalInfo.fullName}_Resume.pdf`);
};