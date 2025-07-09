import { ResumeData } from '../types/resume';
import { LatexTemplateType, generateLatex } from './latexGenerator';

/**
 * Exports the resume as a PDF by using our API route
 */
export const exportPDF = async (
  resumeData: ResumeData,
  template: LatexTemplateType = 'modern'
): Promise<boolean> => {
  try {
    console.log('Generating PDF via API...');

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        template
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PDF generation error:', errorData.error);
      throw new Error(`PDF generation failed: ${errorData.error}`);
    }

    const blob = await response.blob();

    if (blob.size === 0) {
      throw new Error('Invalid file received.');
    }

    // Check response type
    const contentType = response.headers.get('content-type');
    const fallbackReason = response.headers.get('x-fallback-reason');
    const isLatexContent = response.headers.get('x-latex-content');
    
    const url = URL.createObjectURL(blob);

    if (contentType === 'application/pdf' && !fallbackReason) {
      // Successful PDF generation
      const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${template}.pdf`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('PDF downloaded successfully.');
      return true;
      
    } else if (contentType === 'text/html' && fallbackReason) {
      // HTML instructions page
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        const htmlContent = await blob.text();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        console.log('PDF services unavailable. Instructions page opened.');
        
        // Also try to download the LaTeX source as backup
        await downloadLatexSource(resumeData, template);
        
        return true;
      } else {
        throw new Error('Could not open instructions window');
      }
      
    } else if (contentType === 'text/plain' || isLatexContent) {
      // LaTeX source fallback
      const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${template}.tex`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      const message = 'PDF services are temporarily unavailable. LaTeX source file downloaded instead. You can compile this using any LaTeX compiler (like Overleaf) to generate your PDF.';
      console.warn(message);
      
      // Show user-friendly message with instructions
      showLatexInstructions(message);
      
      return true;
    } else {
      throw new Error('Unknown response format received');
    }

  } catch (error) {
    console.error('Error exporting PDF:', error);
    
    // Final fallback - download LaTeX source directly
    try {
      console.log('Attempting to download LaTeX source as final fallback...');
      await downloadLatexSource(resumeData, template);
      
      const message = 'PDF generation failed, but LaTeX source has been downloaded. You can compile this using any LaTeX compiler (like Overleaf) to generate your PDF.';
      showLatexInstructions(message);
      
      return true;
    } catch (latexError) {
      console.error('Even LaTeX export failed:', latexError);
      return false;
    }
  }
};

/**
 * Downloads the LaTeX source file directly
 */
async function downloadLatexSource(resumeData: ResumeData, template: LatexTemplateType): Promise<void> {
  const latexContent = generateLatex(resumeData, template);
  const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${template}.tex`;
  
  const blob = new Blob([latexContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Shows user-friendly instructions for LaTeX compilation
 */
function showLatexInstructions(message: string): void {
  if (typeof window !== 'undefined') {
    // Create a more user-friendly modal instead of alert
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    content.innerHTML = `
      <h3>LaTeX Source Downloaded</h3>
      <p>${message}</p>
      <div style="margin-top: 20px;">
        <a href="https://www.overleaf.com" target="_blank" 
           style="display: inline-block; background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;">
          Open Overleaf
        </a>
        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                style="display: inline-block; background: #ccc; color: black; padding: 10px 20px; border: none; border-radius: 5px; margin: 5px; cursor: pointer;">
          Close
        </button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 10000);
  }
}

/**
 * Preview function with improved error handling
 */
export const previewPDF = async (
  resumeData: ResumeData,
  template: LatexTemplateType = 'modern'
): Promise<void> => {
  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        template
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Preview failed: ${errorData.error}`);
    }

    const blob = await response.blob();
    const contentType = response.headers.get('content-type');
    const fallbackReason = response.headers.get('x-fallback-reason');

    if (contentType === 'application/pdf' && !fallbackReason) {
      // Successful PDF - open in new tab
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else if (contentType === 'text/html' && fallbackReason) {
      // Instructions page
      const htmlContent = await blob.text();
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    } else {
      // LaTeX source fallback
      const message = 'PDF services are temporarily unavailable. Downloading LaTeX source file instead.';
      console.warn(message);
      
      showLatexInstructions(message);
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${template}.tex`;
      
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Preview error:', error);
    
    // Fallback to LaTeX source download
    try {
      await downloadLatexSource(resumeData, template);
      
      const message = 'Preview failed, but LaTeX source has been downloaded. You can compile this using any LaTeX compiler (like Overleaf) to generate your PDF.';
      showLatexInstructions(message);
    } catch (latexError) {
      console.error('Even LaTeX export failed:', latexError);
      alert('Unable to generate or preview the resume. Please try again later.');
    }
  }
};

/**
 * Alternative client-side PDF generation using jsPDF (for simple text-based resumes)
 */
export const generateSimplePDF = async (
  resumeData: ResumeData,
  template: LatexTemplateType = 'modern'
): Promise<boolean> => {
  try {
    // This requires installing jsPDF: npm install jspdf
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    
    // Basic PDF generation - you'd need to implement proper formatting
    doc.setFontSize(16);
    doc.text(resumeData.personalInfo.fullName, 20, 20);
    
    doc.setFontSize(12);
    doc.text(resumeData.personalInfo.email, 20, 30);
    doc.text(resumeData.personalInfo.phone, 20, 40);
    
    // Add more sections as needed...
    
    const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${template}.pdf`;
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Client-side PDF generation failed:', error);
    return false;
  }
};