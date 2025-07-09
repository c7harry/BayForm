import { ResumeData } from '../types/resume';

export const generateModernLatex = (resumeData: ResumeData): string => {
  const { personalInfo, experience, education, skills, projects, additionalSections } = resumeData;

  // Helper function to escape LaTeX special characters
  const escapeLatex = (text: string): string => {
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/[{}]/g, (match) => `\\${match}`)
      .replace(/[%$&#^_~]/g, (match) => `\\${match}`)
      .replace(/"/g, "''");
  };

  // Generate skills section
  const skillsSection = skills.length > 0 ? `
\\section{Skills}
${Object.entries(
  skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>)
).map(([category, skillList]) => 
  `\\textbf{${escapeLatex(category)}:} ${skillList.map(escapeLatex).join(', ')}`
).join(' \\\\ ')}`
    : '';

  // Generate experience section
  const experienceSection = experience.length > 0 ? `
\\section{Experience}
${experience.map(exp => `
\\textbf{${escapeLatex(exp.position)}} \\hfill ${escapeLatex(exp.startDate)} -- ${exp.current ? 'Present' : escapeLatex(exp.endDate)} \\\\
\\textit{${escapeLatex(exp.company)}} \\\\
${exp.description ? `${escapeLatex(exp.description)} \\\\` : ''}
${exp.achievements.length > 0 ? `\\begin{itemize}
${exp.achievements.map(achievement => `\\item ${escapeLatex(achievement)}`).join('\n')}
\\end{itemize}` : ''}
`).join('\n')}`
    : '';

  // Generate education section
  const educationSection = education.length > 0 ? `
\\section{Education}
${education.map(edu => `
\\textbf{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}} \\hfill ${escapeLatex(edu.graduationDate)} \\\\
\\textit{${escapeLatex(edu.institution)}} \\\\
${edu.gpa ? `GPA: ${escapeLatex(edu.gpa)} \\\\` : ''}
${Array.isArray(edu.honors) && edu.honors.length > 0 ? `\\begin{itemize}
${edu.honors.map(honor => `\\item ${escapeLatex(honor)}`).join('\n')}
\\end{itemize}` : ''}
`).join('\n')}`
    : '';

  // Generate projects section
  const projectsSection = projects.length > 0 ? `
\\section{Projects}
${projects.map(project => `
\\textbf{${escapeLatex(project.name)}} \\\\
${escapeLatex(project.description)} \\\\
${project.technologies.length > 0 ? `\\textit{Technologies:} ${project.technologies.map(escapeLatex).join(', ')} \\\\` : ''}
${project.url || project.github ? `\\textit{Links:} ${[
  project.url ? `\\href{${project.url}}{Live Demo}` : '',
  project.github ? `\\href{${project.github}}{GitHub}` : ''
].filter(Boolean).join(' | ')} \\\\` : ''}
`).join('\n')}`
    : '';

  // Generate additional sections
  const additionalSectionsText = additionalSections && additionalSections.length > 0 ? 
    additionalSections
      .filter(section => section.items && section.items.length > 0)
      .map(section => `
\\section{${escapeLatex(section.title)}}
${section.items.map(escapeLatex).join(', ')}
`).join('\n')
    : '';

  return `\\documentclass[10pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}

% Define colors
\\definecolor{accent}{RGB}{15, 45, 82}

% Custom section formatting
\\usepackage{titlesec}
\\titleformat{\\section}{\\color{accent}\\large\\bfseries}{}{0em}{}[\\color{accent}\\titlerule]
\\titlespacing{\\section}{0pt}{8pt}{4pt}

% Remove page numbers
\\pagestyle{empty}

% Reduce line spacing
\\renewcommand{\\baselinestretch}{0.95}

% Custom itemize
\\setlist[itemize]{leftmargin=12pt,noitemsep,topsep=2pt,partopsep=0pt}

\\begin{document}

% Header
\\begin{center}
\\textbf{\\Large ${escapeLatex(personalInfo.fullName)}} \\\\
${personalInfo.professionTitle ? `\\normalsize ${escapeLatex(personalInfo.professionTitle)} \\\\` : ''}
\\vspace{4pt}
${[
  personalInfo.location,
  personalInfo.email,
  personalInfo.phone,
  personalInfo.website,
  personalInfo.linkedIn
].filter(Boolean).map(escapeLatex).join(' | ')}
\\end{center}

\\vspace{8pt}

${skillsSection}

${experienceSection}

${educationSection}

${projectsSection}

${additionalSectionsText}

\\end{document}`;
};
