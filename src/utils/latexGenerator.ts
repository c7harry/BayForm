import { ResumeData } from '../types/resume';
import { generateModernLatex } from '../templates/modernTemplate';
import { generateClassicLatex } from '../templates/classicTemplate';
import { generateMinimalLatex } from '../templates/minimalTemplate';

export type LatexTemplateType = 'modern' | 'classic' | 'minimal';

// LaTeX escape function to handle special characters
function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\$/g, '\\$')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/"/g, "''")
    .replace(/'/g, "'");
}

// Format phone number for display
function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

// Generate contact information
function generateContactInfo(personalInfo: ResumeData['personalInfo']): string {
  const contactItems = [
    personalInfo.location,
    personalInfo.email,
    formatPhoneNumber(personalInfo.phone),
    personalInfo.website,
    personalInfo.linkedIn,
  ].filter(Boolean).map(item => escapeLatex(item!));

  return contactItems.join(' | ');
}

// Generate skills section
function generateSkillsSection(skills: ResumeData['skills']): string {
  if (skills.length === 0) return '';

  const skillsByCategory: Record<string, string[]> = {};
  skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(escapeLatex(skill.name));
  });

  let skillsLatex = `\\section{Skills}\n`;
  
  Object.entries(skillsByCategory).forEach(([category, skillList]) => {
    skillsLatex += `\\textbf{${escapeLatex(category)}:} ${skillList.join(', ')}\\\\\n`;
  });

  return skillsLatex + '\n';
}

// Group experiences by company
function groupExperiencesByCompany(experiences: ResumeData['experience']) {
  const grouped: { [company: string]: ResumeData['experience'] } = {};
  
  experiences.forEach(exp => {
    const normalizedCompany = exp.company.trim();
    const groupKey = normalizedCompany;
    
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(exp);
  });

  // Sort experiences within each company by start date (most recent first)
  Object.keys(grouped).forEach(company => {
    grouped[company].sort((a, b) => {
      const parseDate = (dateStr: string) => {
        if (!dateStr) return new Date(0);
        if (/^\d{4}$/.test(dateStr)) {
          return new Date(parseInt(dateStr), 0);
        }
        if (/^\d{2}\/\d{4}$/.test(dateStr)) {
          const [month, year] = dateStr.split('/');
          return new Date(parseInt(year), parseInt(month) - 1);
        }
        if (/^[A-Za-z]+ \d{4}$/.test(dateStr)) {
          return new Date(dateStr);
        }
        return new Date(dateStr);
      };
      
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });
  });

  return grouped;
}

// Generate experience section
function generateExperienceSection(experiences: ResumeData['experience']): string {
  if (experiences.length === 0) return '';

  let experienceLatex = `\\section{Experience}\n`;

  const groupedExperiences = groupExperiencesByCompany(experiences);
  
  Object.entries(groupedExperiences).forEach(([company, companyExperiences]) => {
    // Company header
    experienceLatex += `\\textbf{\\large ${escapeLatex(company)}} \\hfill ${escapeLatex(companyExperiences[0].location)}\\\\\n`;
    
    companyExperiences.forEach((exp) => {
      // Position and dates
      const endDate = exp.current ? 'Present' : exp.endDate;
      experienceLatex += `\\textit{${escapeLatex(exp.position)}} \\hfill ${escapeLatex(exp.startDate)} - ${escapeLatex(endDate)}\\\\\n`;
      
      // Description
      if (exp.description) {
        experienceLatex += `${escapeLatex(exp.description)}\\\\\n`;
      }
      
      // Achievements
      if (exp.achievements.length > 0) {
        experienceLatex += `\\begin{itemize}\n`;
        exp.achievements.forEach(achievement => {
          experienceLatex += `\\item ${escapeLatex(achievement)}\n`;
        });
        experienceLatex += `\\end{itemize}\n`;
      }
      
      experienceLatex += '\n';
    });
  });

  return experienceLatex;
}

// Generate education section
function generateEducationSection(education: ResumeData['education']): string {
  if (education.length === 0) return '';

  let educationLatex = `\\section{Education}\n`;

  education.forEach((edu) => {
    // Degree and institution
    educationLatex += `\\textbf{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}} \\hfill ${escapeLatex(edu.graduationDate)}\\\\\n`;
    educationLatex += `\\textit{${escapeLatex(edu.institution)}}\\\\\n`;
    
    // GPA
    if (edu.gpa) {
      educationLatex += `GPA: ${escapeLatex(edu.gpa)}\\\\\n`;
    }
    
    // Honors
    if (Array.isArray(edu.honors) && edu.honors.length > 0) {
      educationLatex += `\\begin{itemize}\n`;
      edu.honors.forEach(honor => {
        educationLatex += `\\item ${escapeLatex(honor)}\n`;
      });
      educationLatex += `\\end{itemize}\n`;
    }
    
    educationLatex += '\n';
  });

  return educationLatex;
}

// Generate projects section
function generateProjectsSection(projects: ResumeData['projects']): string {
  if (projects.length === 0) return '';

  let projectsLatex = `\\section{Projects}\n`;

  projects.forEach((project) => {
    projectsLatex += `\\textbf{${escapeLatex(project.name)}}\\\\\n`;
    projectsLatex += `${escapeLatex(project.description)}\\\\\n`;
    
    // Technologies
    if (project.technologies.length > 0) {
      const techList = project.technologies.map(escapeLatex).join(', ');
      projectsLatex += `\\textit{Technologies:} ${techList}\\\\\n`;
    }
    
    // Links
    const links = [];
    if (project.url) links.push(`Live: ${escapeLatex(project.url)}`);
    if (project.github) links.push(`GitHub: ${escapeLatex(project.github)}`);
    if (links.length > 0) {
      projectsLatex += `${links.join(' | ')}\\\\\n`;
    }
    
    projectsLatex += '\n';
  });

  return projectsLatex;
}

// Generate additional sections
function generateAdditionalSections(additionalSections: ResumeData['additionalSections']): string {
  if (!additionalSections || additionalSections.length === 0) return '';

  let additionalLatex = `\\section{Additional Information}\n`;

  additionalSections
    .filter(section => section.items && section.items.length > 0)
    .forEach(section => {
      const items = section.items.map(escapeLatex).join(', ');
      additionalLatex += `\\textbf{${escapeLatex(section.title)}:} ${items}\\\\\n`;
    });

  return additionalLatex + '\n';
}

// Main LaTeX generation function
export const generateLatex = (resumeData: ResumeData, templateType: LatexTemplateType = 'modern'): string => {
  switch (templateType) {
    case 'classic':
      return generateClassicLatex(resumeData);
    case 'minimal':
      return generateMinimalLatex(resumeData);
    case 'modern':
    default:
      return generateModernLatex(resumeData);
  }
};

// Template name mapping (for display purposes)
const templateNames = {
  modern: 'Modern',
  classic: 'Classic',
  minimal: 'Minimal',
};

// Main LaTeX export function
export const exportLatex = (
  resumeData: ResumeData, 
  template: LatexTemplateType = 'modern'
): void => {
  try {
    const latexContent = generateLatex(resumeData, template);
    
    // Create download link
    const templateDisplayName = templateNames[template] || 'Modern';
    const blob = new Blob([latexContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalInfo.fullName}_Resume_${templateDisplayName}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating LaTeX:', error);
    throw error;
  }
};

// Function to copy LaTeX to clipboard
export const copyLatexToClipboard = async (resumeData: ResumeData, template: LatexTemplateType = 'modern'): Promise<void> => {
  try {
    const latexContent = generateLatex(resumeData, template);
    await navigator.clipboard.writeText(latexContent);
  } catch (error) {
    console.error('Error copying LaTeX to clipboard:', error);
    throw error;
  }
};
