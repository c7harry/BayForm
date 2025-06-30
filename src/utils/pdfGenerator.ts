import { pdf } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import { ModernResumePDF, getQRCodeURL } from '../templates/ModernResumePDF';
import { ExecutiveResumePDF } from '../templates/ExecutiveResumePDF';
import { CreativeResumePDF } from '../templates/CreativeResumePDF';
import { TechResumePDF } from '../templates/TechResumePDF';
import { ElegantResumePDF } from '../templates/ElegantResumePDF';
import React from 'react';

// Template name mapping (for display purposes)
const templateNames = {
  modern: 'Modern',
  executive: 'Executive',
  creative: 'Creative',
  tech: 'Tech',
  elegant: 'Elegant',
};

// Template component mapping
const templateComponents = {
  modern: ModernResumePDF,
  executive: ExecutiveResumePDF,
  creative: CreativeResumePDF,
  tech: TechResumePDF,
  elegant: ElegantResumePDF,
};

// Main PDF generation function
export const generatePDF = async (
  resumeData: ResumeData, 
  template: keyof typeof templateComponents = 'modern'
): Promise<void> => {
  try {
    // Generate QR code data URL if needed
    const qrCodeDataURL = await getQRCodeURL(resumeData.personalInfo);
    
    // Get the appropriate template component
    const TemplateComponent = templateComponents[template] || ModernResumePDF;
    
    const MyDoc = () => React.createElement(TemplateComponent, { 
      resumeData, 
      qrCodeDataURL 
    });
    const asPdf = pdf(React.createElement(MyDoc));
    const blob = await asPdf.toBlob();
    
    // Create download link with template name
    const templateDisplayName = templateNames[template] || 'Modern';
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalInfo.fullName}_Resume_${templateDisplayName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Export template utilities
export { templateComponents, templateNames };
