import React from 'react';
import { ResumeData } from '../types/resume';
import { LatexTemplateType } from '../utils/latexGenerator';

interface LatexPreviewProps {
  resumeData: ResumeData;
  selectedTemplate: LatexTemplateType;
  className?: string;
}

export const LatexPreview: React.FC<LatexPreviewProps> = ({ 
  resumeData, 
  selectedTemplate,
  className = '' 
}) => {
  const { personalInfo, experience, education, skills, projects, additionalSections } = resumeData;

  // Helper function to format phone number
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  // Generate contact info
  const contactInfo = [
    personalInfo.location,
    personalInfo.email,
    formatPhoneNumber(personalInfo.phone),
    personalInfo.website,
    personalInfo.linkedIn,
  ].filter(Boolean);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  // Template-specific styling
  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case 'modern':
        return {
          container: 'bg-white w-full min-h-full relative',
          header: 'text-center mb-8 border-b-2 border-blue-800 pb-6',
          name: 'text-4xl font-bold text-gray-900 mb-2',
          title: 'text-xl text-blue-800 mb-4',
          contact: 'text-gray-600 text-sm',
          sectionTitle: 'text-xl font-bold text-blue-800 mb-4 border-b border-blue-800 pb-1',
          skillCategory: 'font-semibold text-blue-800',
          experienceItem: 'mb-6 border-l-4 border-blue-800 pl-4',
          jobTitle: 'font-bold text-lg text-gray-900',
          company: 'text-blue-800 font-medium',
          dates: 'text-gray-600 text-sm',
          description: 'text-gray-700 mt-2',
          achievements: 'list-disc list-inside text-gray-700 mt-2 space-y-1',
        };
      case 'classic':
        return {
          container: 'bg-white w-full min-h-full font-serif relative',
          header: 'text-center mb-8 border-b border-gray-800 pb-6',
          name: 'text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide',
          title: 'text-lg text-gray-800 mb-4',
          contact: 'text-gray-600 text-sm',
          sectionTitle: 'text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-800 pb-1',
          skillCategory: 'font-bold text-gray-900',
          experienceItem: 'mb-6',
          jobTitle: 'font-bold text-lg text-gray-900',
          company: 'text-gray-800 italic',
          dates: 'text-gray-600 text-sm float-right',
          description: 'text-gray-700 mt-2',
          achievements: 'list-disc list-inside text-gray-700 mt-2 space-y-1',
        };
      case 'minimal':
        return {
          container: 'bg-white w-full min-h-full font-sans relative',
          header: 'mb-8',
          name: 'text-2xl font-bold text-gray-900 mb-1',
          title: 'text-base text-gray-700 mb-4',
          contact: 'text-gray-600 text-sm',
          sectionTitle: 'text-base font-bold text-gray-900 mb-3',
          skillCategory: 'font-medium text-gray-800 italic',
          experienceItem: 'mb-4',
          jobTitle: 'font-bold text-base text-gray-900',
          company: 'text-gray-800 italic',
          dates: 'text-gray-600 text-sm float-right',
          description: 'text-gray-700 mt-1 text-sm',
          achievements: 'text-gray-700 mt-1 space-y-1 text-sm',
        };
      default:
        return getTemplateStyles(); // Default to modern
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className={`${className}`}>
      {/* Paper container with proper A4 aspect ratio and responsive scaling */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Paper shadow effect */}
          <div 
            className="absolute top-1 left-1 bg-gray-300 opacity-50 rounded-sm"
            style={{ 
              width: '210mm', 
              minHeight: '297mm',
              transform: 'scale(0.5)',
              transformOrigin: 'top center',
            }}
          ></div>
          
          {/* Main paper */}
          <div 
            className="bg-white shadow-2xl border border-gray-300 mx-auto relative rounded-sm" 
            style={{ 
              width: '210mm', 
              minHeight: '297mm',
              // Increased scaling for better readability
              transform: 'scale(0.75)',
              transformOrigin: 'top center',
              marginBottom: '-50%',
            }}
          >
            <div className={styles.container} style={{ 
              width: '100%', 
              minHeight: '297mm', 
              margin: 0, 
              boxSizing: 'border-box',
              padding: selectedTemplate === 'minimal' ? '20mm 15mm' : '25mm 20mm'
            }}>
              {/* Paper dimensions indicator */}
              <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-75 font-mono">
                A4 Paper
              </div>
              
              {/* Header */}
              <div className={styles.header}>
          <h1 className={styles.name}>{personalInfo.fullName}</h1>
          {personalInfo.professionTitle && (
            <h2 className={styles.title}>{personalInfo.professionTitle}</h2>
          )}
          <div className={styles.contact}>
            {selectedTemplate === 'classic' 
              ? contactInfo.join(' • ')
              : contactInfo.join(' | ')
            }
          </div>
        </div>

        {/* Skills Section */}
        {Object.keys(skillsByCategory).length > 0 && (
          <div className="mb-8">
            <h3 className={styles.sectionTitle}>
              {selectedTemplate === 'classic' ? 'TECHNICAL SKILLS' : 'Skills'}
            </h3>
            <div className="space-y-2">
              {Object.entries(skillsByCategory).map(([category, skillList]) => (
                <div key={category}>
                  {selectedTemplate === 'minimal' ? (
                    <p className="text-sm">
                      <span className={styles.skillCategory}>{category}:</span> {skillList.join(', ')}
                    </p>
                  ) : (
                    <p className="text-sm">
                      <span className={styles.skillCategory}>{category}:</span> {skillList.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="mb-8">
            <h3 className={styles.sectionTitle}>
              {selectedTemplate === 'classic' ? 'PROFESSIONAL EXPERIENCE' : 'Experience'}
            </h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className={styles.experienceItem}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className={styles.jobTitle}>{exp.position}</h4>
                      <p className={styles.company}>{exp.company}</p>
                    </div>
                    <span className={styles.dates}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className={styles.description}>{exp.description}</p>
                  )}
                  {exp.achievements.length > 0 && (
                    selectedTemplate === 'minimal' ? (
                      <div className={styles.achievements}>
                        {exp.achievements.map((achievement, idx) => (
                          <p key={idx}>• {achievement}</p>
                        ))}
                      </div>
                    ) : (
                      <ul className={styles.achievements}>
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <div className="mb-8">
            <h3 className={styles.sectionTitle}>
              {selectedTemplate === 'classic' ? 'EDUCATION' : 'Education'}
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h4>
                      <p className="text-gray-800 italic">{edu.institution}</p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                  </div>
                  {Array.isArray(edu.honors) && edu.honors.length > 0 && (
                    selectedTemplate === 'minimal' ? (
                      <div className="text-sm text-gray-700 space-y-1">
                        {edu.honors.map((honor, idx) => (
                          <p key={idx}>• {honor}</p>
                        ))}
                      </div>
                    ) : (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {edu.honors.map((honor, idx) => (
                          <li key={idx}>{honor}</li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h3 className={styles.sectionTitle}>
              {selectedTemplate === 'classic' ? 'PROJECTS' : 'Projects'}
            </h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <h4 className="font-bold text-gray-900 mb-1">{project.name}</h4>
                  <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">
                        {selectedTemplate === 'minimal' ? 'Tech:' : 'Technologies:'}
                      </span> {project.technologies.join(', ')}
                    </p>
                  )}
                  {(project.url || project.github) && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">
                        {selectedTemplate === 'minimal' ? 'Links:' : 'Links:'}
                      </span>{' '}
                      {[
                        project.url ? (selectedTemplate === 'minimal' ? 'Demo' : 'Live Demo') : '',
                        project.github ? (selectedTemplate === 'minimal' ? 'Code' : 'GitHub') : ''
                      ].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Sections */}
        {additionalSections && additionalSections.length > 0 && (
          <div className="mb-8">
            {additionalSections
              .filter(section => section.items && section.items.length > 0)
              .map((section) => (
                <div key={section.id} className="mb-6">
                  <h3 className={styles.sectionTitle}>
                    {selectedTemplate === 'classic' ? section.title.toUpperCase() : section.title}
                  </h3>
                  {selectedTemplate === 'classic' ? (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {section.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">{section.items.join(', ')}</p>
                  )}
                </div>
              ))}
          </div>
        )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
