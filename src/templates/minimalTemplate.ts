import { ResumeData } from '../types/resume';

export const generateMinimalLatex = (resumeData: ResumeData): string => {
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
\\textbf{Skills} \\\\
${Object.entries(
  skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>)
).map(([category, skillList]) => 
  `\\textit{${escapeLatex(category)}}: ${skillList.map(escapeLatex).join(', ')}`
).join(' \\\\ ')}
\\\\\\vspace{4pt}`
    : '';

  // Generate experience section
  const experienceSection = experience.length > 0 ? `
\\textbf{Experience} \\\\
${experience.map(exp => `
\\textbf{${escapeLatex(exp.position)}} -- \\textit{${escapeLatex(exp.company)}} \\hfill ${escapeLatex(exp.startDate)} -- ${exp.current ? 'Present' : escapeLatex(exp.endDate)} \\\\
${exp.description ? `${escapeLatex(exp.description)} \\\\` : ''}
${exp.achievements.length > 0 ? exp.achievements.map(achievement => `$\\bullet$ ${escapeLatex(achievement)} \\\\`).join('') : ''}
`).join('\\vspace{2pt}\n')}
\\vspace{4pt}`
    : '';

  // Generate education section
  const educationSection = education.length > 0 ? `
\\textbf{Education} \\\\
${education.map(edu => `
\\textbf{${escapeLatex(edu.degree)}} in ${escapeLatex(edu.field)} -- \\textit{${escapeLatex(edu.institution)}} \\hfill ${escapeLatex(edu.graduationDate)} \\\\
${edu.gpa ? `GPA: ${escapeLatex(edu.gpa)} \\\\` : ''}
${Array.isArray(edu.honors) && edu.honors.length > 0 ? edu.honors.map(honor => `$\\bullet$ ${escapeLatex(honor)} \\\\`).join('') : ''}
`).join('\\vspace{2pt}\n')}
\\vspace{4pt}`
    : '';

  // Generate projects section
  const projectsSection = projects.length > 0 ? `
\\textbf{Projects} \\\\
${projects.map(project => `
\\textbf{${escapeLatex(project.name)}} \\\\
${escapeLatex(project.description)} \\\\
${project.technologies.length > 0 ? `\\textit{Tech}: ${project.technologies.map(escapeLatex).join(', ')} \\\\` : ''}
${project.url || project.github ? `\\textit{Links}: ${[
  project.url ? `\\href{${project.url}}{Demo}` : '',
  project.github ? `\\href{${project.github}}{Code}` : ''
].filter(Boolean).join(', ')} \\\\` : ''}
`).join('\\vspace{2pt}\n')}
\\vspace{4pt}`
    : '';

  // Generate additional sections
  const additionalSectionsText = additionalSections && additionalSections.length > 0 ? 
    additionalSections
      .filter(section => section.items && section.items.length > 0)
      .map(section => `
\\textbf{${escapeLatex(section.title)}} \\\\
${section.items.map(escapeLatex).join(', ')} \\\\
\\vspace{4pt}
`).join('\n')
    : '';

  return `\\documentclass[9pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{helvetica}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{hyperref}

% Remove page numbers
\\pagestyle{empty}

% Reduce spacing significantly
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{1pt}
\\renewcommand{\\baselinestretch}{0.9}

% Hyperlink setup
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=black,
    citecolor=black
}

\\begin{document}

% Header
\\begin{center}
{\\large \\textbf{${escapeLatex(personalInfo.fullName)}}}
${personalInfo.professionTitle ? ` \\\\ ${escapeLatex(personalInfo.professionTitle)}` : ''}
\\end{center}

\\vspace{2pt}

\\begin{center}
${[
  personalInfo.location,
  personalInfo.email,
  personalInfo.phone,
  personalInfo.website,
  personalInfo.linkedIn
].filter((item): item is string => Boolean(item)).map(escapeLatex).join(' | ')}
\\end{center}

\\vspace{6pt}

${skillsSection}

${experienceSection}

${educationSection}

${projectsSection}

${additionalSectionsText}

\\end{document}`;
};
