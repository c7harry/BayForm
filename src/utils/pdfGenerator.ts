import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from '@/types/resume';

export const generatePDF = async (resumeData: ResumeData, elementId: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate scaling to fit width properly
    const widthRatio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * widthRatio;
    
    // If content fits on one page, use original logic
    if (scaledHeight <= pdfHeight) {
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    } else {
      // Content needs multiple pages
      const pageHeight = pdfHeight;
      const scaledWidth = pdfWidth;
      let remainingHeight = scaledHeight;
      let currentY = 0;
      let pageNumber = 0;
      
      while (remainingHeight > 0) {
        if (pageNumber > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of the image for this page
        const pageContentHeight = Math.min(pageHeight, remainingHeight);
        const sourceY = (currentY / widthRatio);
        const sourceHeight = (pageContentHeight / widthRatio);
        
        // Create a temporary canvas for this page's content
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        
        if (pageCtx) {
          pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
          const pageImgData = pageCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', 0, 0, scaledWidth, pageContentHeight);
        }
        
        remainingHeight -= pageContentHeight;
        currentY += pageContentHeight;
        pageNumber++;
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