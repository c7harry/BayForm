import { ResumeData } from '../types/resume';

export const generateClassicLatex = (resumeData: ResumeData): string => {
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
\\section{TECHNICAL SKILLS}
\\begin{itemize}
${Object.entries(
  skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>)
).map(([category, skillList]) => 
  `\\item \\textbf{${escapeLatex(category)}:} ${skillList.map(escapeLatex).join(', ')}`
).join('\n')}
\\end{itemize}`
    : '';

  // Generate experience section
  const experienceSection = experience.length > 0 ? `
\\section{PROFESSIONAL EXPERIENCE}
${experience.map(exp => `
\\subsection{${escapeLatex(exp.position)}}
\\textit{${escapeLatex(exp.company)}} \\hfill ${escapeLatex(exp.startDate)} -- ${exp.current ? 'Present' : escapeLatex(exp.endDate)}
${exp.description ? `\\\\${escapeLatex(exp.description)}` : ''}
${exp.achievements.length > 0 ? `\\begin{itemize}
${exp.achievements.map(achievement => `\\item ${escapeLatex(achievement)}`).join('\n')}
\\end{itemize}` : ''}
`).join('\n')}`
    : '';

  // Generate education section
  const educationSection = education.length > 0 ? `
\\section{EDUCATION}
${education.map(edu => `
\\subsection{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}}
\\textit{${escapeLatex(edu.institution)}} \\hfill ${escapeLatex(edu.graduationDate)}
${edu.gpa ? `\\\\GPA: ${escapeLatex(edu.gpa)}` : ''}
${Array.isArray(edu.honors) && edu.honors.length > 0 ? `\\begin{itemize}
${edu.honors.map(honor => `\\item ${escapeLatex(honor)}`).join('\n')}
\\end{itemize}` : ''}
`).join('\n')}`
    : '';

  // Generate projects section
  const projectsSection = projects.length > 0 ? `
\\section{PROJECTS}
${projects.map(project => `
\\subsection{${escapeLatex(project.name)}}
${escapeLatex(project.description)}
${project.technologies.length > 0 ? `\\\\\\textbf{Technologies:} ${project.technologies.map(escapeLatex).join(', ')}` : ''}
${project.url || project.github ? `\\\\\\textbf{Links:} ${[
  project.url ? `\\href{${project.url}}{Live Demo}` : '',
  project.github ? `\\href{${project.github}}{GitHub}` : ''
].filter(Boolean).join(' | ')}` : ''}
`).join('\n')}`
    : '';

  // Generate additional sections
  const additionalSectionsText = additionalSections && additionalSections.length > 0 ? 
    additionalSections
      .filter(section => section.items && section.items.length > 0)
      .map(section => `
\\section{${escapeLatex(section.title.toUpperCase())}}
\\begin{itemize}
${section.items.map(item => `\\item ${escapeLatex(item)}`).join('\n')}
\\end{itemize}
`).join('\n')
    : '';

  return `\\documentclass[10pt,letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{times}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}

% Custom section formatting
\\usepackage{titlesec}
\\titleformat{\\section}{\\normalfont\\large\\bfseries\\uppercase}{}{0em}{}[\\hrule]
\\titlespacing{\\section}{0pt}{8pt}{4pt}

\\titleformat{\\subsection}{\\normalfont\\normalsize\\bfseries}{}{0em}{}
\\titlespacing{\\subsection}{0pt}{6pt}{2pt}

% Remove page numbers
\\pagestyle{empty}

% Reduce line spacing
\\renewcommand{\\baselinestretch}{0.95}

% Custom itemize
\\setlist[itemize]{leftmargin=12pt,noitemsep,topsep=2pt,partopsep=0pt}

% Hyperlink setup
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue,
    citecolor=black
}

\\begin{document}

% Header
\\begin{center}
\\textbf{\\Large ${escapeLatex(personalInfo.fullName)}}
${personalInfo.professionTitle ? `\\\\\\normalsize ${escapeLatex(personalInfo.professionTitle)}` : ''}
\\\\\\vspace{4pt}
\\hrule
\\vspace{4pt}
${[
  personalInfo.location,
  personalInfo.email,
  personalInfo.phone,
  personalInfo.website,
  personalInfo.linkedIn
].filter((item): item is string => Boolean(item)).map(escapeLatex).join(' $\\bullet$ ')}
\\end{center}

\\vspace{8pt}

${skillsSection}

${experienceSection}

${educationSection}

${projectsSection}

${additionalSectionsText}

\\end{document}`;
};
