// ResumeTemplates: Contains all resume template components
import React from 'react';
import { ResumeData } from '../types/resume';
import { FaLinkedin, FaGlobe } from 'react-icons/fa';
import { QRCodeComponent } from './QRCodeComponent';

// Props for all templates
interface ResumeTemplateProps {
  resumeData: ResumeData;
  className?: string;
  isEditing?: boolean;
  onEdit?: (field: string, value: any, section?: string, index?: number) => void;
}

// Editable text component with automatic sizing
const EditableText: React.FC<{
  value: string;
  isEditing: boolean;
  onEdit: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  width?: 'auto' | 'full' | 'wide' | 'extra-wide' | 'super-wide';
}> = ({ value, isEditing, onEdit, className = '', multiline = false, placeholder = '', width = 'auto' }) => {
  if (!isEditing) {
    return <span className={className}>{value}</span>;
  }

  // Calculate dynamic width based on text length
  const getDynamicWidth = (currentText: string = value) => {
    const textLength = currentText.length;
    const placeholderLength = placeholder.length;
    
    // Use placeholder length as minimum when text is empty, add generous padding
    const contentLength = textLength || placeholderLength;
    const baseWidth = Math.max(contentLength * 1.3 + 10, 25); // More generous: 1.3ch per character + 10ch padding, min 25ch
    
    if (width === 'full') return { className: 'w-full', style: {} };
    
    // More generous maximum widths, but constrained to prevent overflow
    let maxWidth = 60; // Default max width in characters
    switch (width) {
      case 'super-wide':
        maxWidth = 85; // Reduced from 120 to prevent overflow on 210mm pages
        break;
      case 'extra-wide':
        maxWidth = 75; // Reduced from 90
        break;
      case 'wide':
        maxWidth = 65; // Reduced from 75
        break;
      default:
        maxWidth = 55;
    }
    
    const finalWidth = Math.min(baseWidth, maxWidth);
    return { 
      className: 'min-w-0 max-w-full', // Added max-w-full to prevent overflow
      style: { width: `${finalWidth}ch`, maxWidth: '100%' } // Added maxWidth: '100%' as fallback
    };
  };

  // Calculate dynamic height for multiline text
  const getDynamicRows = (currentText: string = value) => {
    if (!multiline) return 1;
    
    const textLength = currentText.length || placeholder.length;
    // More generous: assume 50 characters per line for better spacing
    const estimatedCharsPerLine = 50; 
    const estimatedLines = Math.ceil(textLength / estimatedCharsPerLine);
    
    // Also count actual line breaks
    const lineBreaks = (currentText.match(/\n/g) || []).length;
    const totalLines = Math.max(estimatedLines, lineBreaks + 1);
    
    // More generous minimum and maximum rows
    const minRows = 3; // Start with 3 rows minimum for better UX
    const maxRows = width === 'super-wide' ? 10 : width === 'extra-wide' ? 8 : 6;
    
    return Math.max(minRows, Math.min(totalLines, maxRows));
  };

  // Handle input changes with dynamic resizing
  const handleChange = (newValue: string) => {
    onEdit(newValue);
    // The component will re-render with new dimensions automatically
  };

  const dynamicWidth = getDynamicWidth();

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className={`${className} ${dynamicWidth.className} border border-blue-300 rounded px-2 py-1 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none hover:border-blue-400 transition-colors`}
        placeholder={placeholder}
        rows={getDynamicRows()}
        style={{ ...dynamicWidth.style, minWidth: '15ch' }} // Larger minimum width
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      className={`${className} ${dynamicWidth.className} border border-blue-300 rounded px-2 py-1 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-colors`}
      placeholder={placeholder}
      style={{ ...dynamicWidth.style, minWidth: '15ch' }} // Larger minimum width
    />
  );
};

// Helper to group experiences by company and sort by date
function groupExperiencesByCompany(experiences: ResumeData['experience']) {
  const grouped: { [company: string]: ResumeData['experience'] } = {};
  
  experiences.forEach(exp => {
    // Normalize company name for grouping (trim whitespace and normalize case)
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
      // Parse dates for proper sorting
      const parseDate = (dateStr: string) => {
        // Handle different date formats like "06/2025", "2025", "May 2025", etc.
        if (!dateStr) return new Date(0);
        
        // If it's just a year
        if (/^\d{4}$/.test(dateStr)) {
          return new Date(parseInt(dateStr), 0);
        }
        
        // If it's MM/YYYY format
        if (/^\d{2}\/\d{4}$/.test(dateStr)) {
          const [month, year] = dateStr.split('/');
          return new Date(parseInt(year), parseInt(month) - 1);
        }
        
        // If it's Month YYYY format
        if (/^[A-Za-z]+ \d{4}$/.test(dateStr)) {
          return new Date(dateStr);
        }
        
        // Try to parse as regular date
        return new Date(dateStr);
      };
      
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });
  });

  return grouped;
}

// Helper to format phone numbers (US-style, fallback to original if not matched)
function formatPhoneNumber(phone: string) {
  if (!phone) return '';
  // Remove all non-digit characters
  const cleaned = ('' + phone).replace(/\D/g, '');
  // US phone format: (123) 456-7890
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

// --- Modern Template ---
export const ModernTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '', isEditing = false, onEdit }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  const handleEdit = (field: string, value: any, section?: string, index?: number) => {
    if (onEdit) onEdit(field, value, section, index);
  };

  // Function to render sections in user-defined order
  const renderOrderedSections = () => {
    const sectionOrder = resumeData.sectionOrder || ['skills', 'experience', 'education', 'projects', 'additional'];
    
    return sectionOrder.map(sectionKey => {
      switch (sectionKey) {
        case 'skills':
          return Object.keys(skillsByCategory).length > 0 ? (
            <div className="mb-1" key="skills">
              <h2 className="text-xs font-bold text-black border-t border-black pt-0.5 mt-1 mb-0.5 text-center">SKILLS</h2>
              <div className="text-center space-y-0.5">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category} className="flex justify-center items-baseline">
                    <span className="text-xs font-bold text-black capitalize">
                      {category}:
                    </span>
                    <span className="text-xs text-black ml-0">{skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null;

        case 'experience':
          return resumeData.experience.length > 0 ? (
            <div className="mb-1" key="experience">
              <h2 className="text-xs font-bold text-black border-t border-black pt-0.5 mt-1 mb-0.5 text-center">EXPERIENCE</h2>
              <div className="space-y-1 mt-0.5">
                {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
                  <div key={company} className="mb-0.5">
                    {/* Company Header */}
                    <h3 className="text-sm font-bold text-black mb-0">
                      <EditableText
                        value={company}
                        isEditing={isEditing}
                        onEdit={(value) => {
                          // Update all experiences for this company
                          experiences.forEach((exp, index) => {
                            const expIndex = resumeData.experience.findIndex(e => e.id === exp.id);
                            if (expIndex !== -1) {
                              handleEdit('company', value, 'experience', expIndex);
                            }
                          });
                        }}
                        className="text-sm font-bold text-black"
                        placeholder="Company Name"
                      />
                      {' - '}
                      <EditableText
                        value={experiences[0].location}
                        isEditing={isEditing}
                        onEdit={(value) => {
                          const expIndex = resumeData.experience.findIndex(e => e.id === experiences[0].id);
                          if (expIndex !== -1) {
                            handleEdit('location', value, 'experience', expIndex);
                          }
                        }}
                        className="text-sm font-bold text-black"
                        placeholder="Location"
                      />
                    </h3>
                    
                    {/* Positions within the company */}
                    {experiences.map((exp) => {
                      const expIndex = resumeData.experience.findIndex(e => e.id === exp.id);
                      return (
                        <div key={exp.id} className="mb-1.5">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-xs italic text-black">
                              <EditableText
                                value={exp.position}
                                isEditing={isEditing}
                                onEdit={(value) => handleEdit('position', value, 'experience', expIndex)}
                                className="text-xs italic text-black"
                                placeholder="Position Title"
                              />
                            </h4>
                            <span className="text-xs font-bold text-black">
                              <EditableText
                                value={exp.startDate}
                                isEditing={isEditing}
                                onEdit={(value) => handleEdit('startDate', value, 'experience', expIndex)}
                                className="text-xs font-bold text-black"
                                placeholder="Start Date"
                              />
                              {' - '}
                              <EditableText
                                value={exp.current ? 'Present' : exp.endDate}
                                isEditing={isEditing && !exp.current}
                                onEdit={(value) => handleEdit('endDate', value, 'experience', expIndex)}
                                className="text-xs font-bold text-black"
                                placeholder="End Date"
                              />
                            </span>
                          </div>
                          
                          {exp.description && (
                            <p className="text-xs text-black mb-1 italic">
                              <EditableText
                                value={exp.description}
                                isEditing={isEditing}
                                onEdit={(value) => handleEdit('description', value, 'experience', expIndex)}
                                className="text-xs text-black italic"
                                multiline={true}
                                placeholder="Job description"
                                width="super-wide"
                              />
                            </p>
                          )}
                          
                          {/* Achievements */}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="text-xs text-black space-y-0.5 ml-2">
                              {exp.achievements.map((achievement, achIndex) => (
                                <li key={achIndex} className="relative pl-2">
                                  <span className="absolute left-0 top-0">•</span>
                                  <EditableText
                                    value={achievement}
                                    isEditing={isEditing}
                                    onEdit={(value) => {
                                      const updatedAchievements = [...exp.achievements];
                                      updatedAchievements[achIndex] = value;
                                      handleEdit('achievements', updatedAchievements, 'experience', expIndex);
                                    }}
                                    className="text-xs text-black"
                                    multiline={true}
                                    placeholder="Achievement description"
                                    width="super-wide"
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : null;

        case 'education':
          return resumeData.education.length > 0 ? (
            <div className="mb-1" key="education">
              <h2 className="text-xs font-bold text-black border-t border-black pt-0.5 mt-1 mb-0.5 text-center">EDUCATION</h2>
              <div className="space-y-1 mt-0.5">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="mb-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-black">
                          <EditableText
                            value={edu.institution}
                            isEditing={isEditing}
                            onEdit={(value) => handleEdit('institution', value, 'education', index)}
                            className="text-sm font-bold text-black"
                            placeholder="Institution Name"
                          />
                        </h3>
                        <h4 className="text-xs italic text-black">
                          <EditableText
                            value={edu.degree}
                            isEditing={isEditing}
                            onEdit={(value) => handleEdit('degree', value, 'education', index)}
                            className="text-xs italic text-black"
                            placeholder="Degree"
                          />
                          {edu.field && (
                            <>
                              {' in '}
                              <EditableText
                                value={edu.field}
                                isEditing={isEditing}
                                onEdit={(value) => handleEdit('field', value, 'education', index)}
                                className="text-xs italic text-black"
                                placeholder="Field of Study"
                              />
                            </>
                          )}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-black">
                        <EditableText
                          value={edu.graduationDate}
                          isEditing={isEditing}
                          onEdit={(value) => handleEdit('graduationDate', value, 'education', index)}
                          className="text-xs font-bold text-black"
                          placeholder="Graduation Date"
                        />
                      </span>
                    </div>
                    
                    {edu.gpa && (
                      <p className="text-xs text-black">
                        GPA: <EditableText
                          value={edu.gpa}
                          isEditing={isEditing}
                          onEdit={(value) => handleEdit('gpa', value, 'education', index)}
                          className="text-xs text-black"
                          placeholder="GPA"
                        />
                      </p>
                    )}
                    
                    {edu.honors && edu.honors.length > 0 && (
                      <div className="text-xs text-black">
                        <strong>Honors:</strong> {edu.honors.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null;

        case 'projects':
          return resumeData.projects.length > 0 ? (
            <div className="mb-1" key="projects">
              <h2 className="text-xs font-bold text-black border-t border-black pt-0.5 mt-1 mb-0.5 text-center">PROJECTS</h2>
              <div className="space-y-1 mt-0.5">
                {resumeData.projects.map((project, index) => (
                  <div key={project.id} className="mb-1">
                    <h3 className="text-sm font-bold text-black">
                      <EditableText
                        value={project.name}
                        isEditing={isEditing}
                        onEdit={(value) => handleEdit('name', value, 'projects', index)}
                        className="text-sm font-bold text-black"
                        placeholder="Project Name"
                      />
                      {project.url && (
                        <span className="text-xs text-black ml-2">
                          • <EditableText
                            value={project.url}
                            isEditing={isEditing}
                            onEdit={(value) => handleEdit('url', value, 'projects', index)}
                            className="text-xs text-black"
                            placeholder="Project URL"
                          />
                        </span>
                      )}
                    </h3>
                    
                    {project.technologies.length > 0 && (
                      <p className="text-xs italic text-black mb-0.5">
                        <strong>Technologies:</strong> {project.technologies.join(', ')}
                      </p>
                    )}
                    
                    {project.description && (
                      <p className="text-xs text-black">
                        <EditableText
                          value={project.description}
                          isEditing={isEditing}
                          onEdit={(value) => handleEdit('description', value, 'projects', index)}
                          className="text-xs text-black"
                          multiline={true}
                          placeholder="Project description"
                          width="super-wide"
                        />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null;

        case 'additional':
          return resumeData.additionalSections && resumeData.additionalSections.length > 0 ? (
            resumeData.additionalSections.map((section, sectionIndex) => {
              if (section.items.length === 0) return null;
              return (
                <div className="mb-1" key={`additional-${section.id}`}>
                  <h2 className="text-xs font-bold text-black border-t border-black pt-0.5 mt-1 mb-0.5 text-center">
                    {section.title.toUpperCase()}
                  </h2>
                  <div className="text-center">
                    <span className="text-xs text-black">
                      {section.items.filter(item => item.trim()).join(' • ')}
                    </span>
                  </div>
                </div>
              );
            })
          ) : null;

        default:
          return null;
      }
    }).filter(Boolean);
  };

  return (
    <div className={`bg-white px-3 py-2 mx-auto print:max-w-none print:mx-0 ${className} ${isEditing ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}`} id="resume-preview" style={{ minWidth: '210mm', maxWidth: '210mm', fontSize: '10px' }}>
      {isEditing && (
        <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1 mb-2 text-xs text-blue-800 no-print">
          📝 Editing Mode: Click on any text to modify it. Click &quot;Save&quot; when done.
        </div>
      )}
      {/* Header */}
      <div className="mb-1 relative">
        <div className="flex-1 pr-20">
          <h1 className="text-2xl font-bold text-black mb-0.5 text-left tracking-tight uppercase">
            <EditableText
              value={resumeData.personalInfo.fullName}
              isEditing={isEditing}
              onEdit={(value) => handleEdit('fullName', value, 'personalInfo')}
              className="text-2xl font-bold text-black tracking-tight uppercase"
              placeholder="Your Full Name"
            />
          </h1>
          {resumeData.personalInfo.professionTitle && (
            <h2 className="text-base font-bold text-black mb-1 text-left uppercase">
              <EditableText
                value={resumeData.personalInfo.professionTitle}
                isEditing={isEditing}
                onEdit={(value) => handleEdit('professionTitle', value, 'personalInfo')}
                className="text-base font-bold text-black uppercase"
                placeholder="Your Professional Title"
              />
            </h2>
          )}
        </div>
        
        {/* QR Code - Absolutely positioned */}
        <div className="absolute bottom-0 right-3 transform translate-x-0">
          <QRCodeComponent 
            personalInfo={resumeData.personalInfo} 
            size={70} 
            theme="modern" 
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-wrap items-center justify-center gap-x-1 text-xs text-black mb-1">
        {[
          resumeData.personalInfo.location,
          resumeData.personalInfo.email,
          formatPhoneNumber(resumeData.personalInfo.phone),
          resumeData.personalInfo.website,
          resumeData.personalInfo.linkedIn
        ].filter(Boolean).map((item, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="mx-1 font-bold">|</span>}
            <span>{item}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Sections in User-Defined Order */}
      {renderOrderedSections()}
    </div>
  );
};

// --- Executive Template ---
export const ClassicTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '', isEditing = false, onEdit }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <div className={`bg-white p-3 mx-auto print:max-w-none print:mx-0 ${className}`} id="resume-preview" style={{ minWidth: '210mm', maxWidth: '210mm', fontSize: '12px' }}>
      {/* Header with gradient accent */}
      <div className="relative mb-1">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        {/* QR Code positioned absolutely in top right */}
        <div className="absolute top-4 right-0">
          <QRCodeComponent personalInfo={resumeData.personalInfo} size={75} theme="classic" />
        </div>
        
        <div className="pt-4 pb-2 pr-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
            {resumeData.personalInfo.fullName}
          </h1>
          {resumeData.personalInfo.professionTitle && (
            <h2 className="text-lg font-medium text-blue-700 mb-2 uppercase tracking-wide">
              {resumeData.personalInfo.professionTitle}
            </h2>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700">
            {[
              resumeData.personalInfo.location && resumeData.personalInfo.location,
              resumeData.personalInfo.email && resumeData.personalInfo.email,
              resumeData.personalInfo.phone && formatPhoneNumber(resumeData.personalInfo.phone),
              resumeData.personalInfo.website && resumeData.personalInfo.website,
              resumeData.personalInfo.linkedIn && resumeData.personalInfo.linkedIn
            ].filter(Boolean).map((item, idx) => (
              <span key={idx} className="flex items-center">
                <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left column - Skills and Additional Info */}
        <div className="col-span-1 space-y-3">
          {/* Skills Section */}
          {Object.keys(skillsByCategory).length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600 uppercase tracking-wide">SKILLS</h2>
              <div className="space-y-1">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600 uppercase tracking-wide">ADDITIONAL</h2>
              <div className="space-y-1">
                {resumeData.additionalSections.filter(section => section.items && section.items.length > 0).map(section => (
                  <div key={section.id}>
                    <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">
                      {section.title}
                    </h3>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {section.items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Experience, Education, Projects */}
        <div className="col-span-2 space-y-3">
          {/* Experience Section */}
          {resumeData.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600 uppercase tracking-wide">EXPERIENCE</h2>
              <div className="space-y-3">
                {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
                  <div key={company}>
                    {/* Company Header */}
                    <div className="mb-2">
                      <h3 className="text-base font-bold text-blue-700 border-l-3 border-blue-600 pl-2">
                        {company}
                      </h3>
                      <p className="text-xs text-gray-600 pl-2">{experiences[0].location}</p>
                      {experiences.length > 1 && (
                        <p className="text-xs text-blue-600 font-medium pl-2">
                          {experiences.length} positions
                        </p>
                      )}
                    </div>
                    
                    {/* Positions within the company */}
                    <div className="space-y-1 relative">
                      {experiences.map((exp, index) => (
                        <div key={exp.id} className="relative pl-8">
                          {/* Timeline indicator for multiple roles */}
                          {experiences.length > 1 && (
                            <div className="absolute -left-2 top-1">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                <span className="text-white text-xs font-bold">{experiences.length - index}</span>
                              </div>
                              {index < experiences.length - 1 && (
                                <div className="absolute left-1/2 top-full w-0.5 h-6 bg-blue-300 transform -translate-x-1/2"></div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h4 className="text-sm font-bold text-gray-900">{exp.position}</h4>
                              {experiences.length > 1 && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  index === 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {index === 0 ? 'Current' : 'Previous'}
                                </span>
                              )}
                            </div>
                            <div className="text-right text-xs text-gray-600">
                              <p className="font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                            </div>
                          </div>
                          
                          {exp.description && (
                            <p className="text-xs text-gray-700 mb-1 italic">{exp.description}</p>
                          )}
                          
                          {exp.achievements.length > 0 && (
                            <ul className="space-y-1 text-xs text-gray-700">
                              {exp.achievements.map((achievement: string, achievementIndex: number) => (
                                <li key={achievementIndex} className="flex items-start">
                                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {resumeData.education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600 uppercase tracking-wide">EDUCATION</h2>
              <div className="space-y-1">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                        <p className="text-sm text-blue-700 font-medium">{edu.institution}</p>
                        {edu.honors && Array.isArray(edu.honors) && edu.honors.length > 0 && (
                          <ul className="text-xs text-gray-600 italic pl-4 list-disc mt-0.5">
                            {edu.honors.map((honor, idx) => (
                              <li key={idx}>{honor}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-600">
                        <p className="font-medium">{edu.graduationDate}</p>
                        {edu.gpa && <p>GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {resumeData.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600 uppercase tracking-wide">PROJECTS</h2>
              <div className="space-y-1">
                {resumeData.projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
                    <p className="text-xs text-gray-700 mb-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {(project.url || project.github) && (
                      <div className="text-blue-600 text-xs">
                        {project.url && <span className="mr-3">🌐 {project.url}</span>}
                        {project.github && <span>📱 {project.github}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Creative Template ---
export const MinimalTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '', isEditing = false, onEdit }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-gray-100 p-4 mx-auto print:bg-white print:max-w-none print:mx-0 ${className}`} id="resume-preview" style={{ minWidth: '210mm', maxWidth: '210mm', fontSize: '12px' }}>
      {/* Header with geometric design */}
      <div className="relative mb-4">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10"></div>
        <div className="absolute top-3 right-3 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20"></div>
        
        {/* QR Code positioned absolutely in top right, with higher z-index */}
        <div className="absolute top-1 right-1 z-20">
          <QRCodeComponent personalInfo={resumeData.personalInfo} size={75} theme="minimal" />
        </div>
        
        <div className="relative z-10 bg-white rounded-lg p-4 shadow-lg pr-20">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            {resumeData.personalInfo.fullName}
          </h1>
          {resumeData.personalInfo.professionTitle && (
            <h2 className="text-base font-medium text-gray-700 mb-2 tracking-wide">
              {resumeData.personalInfo.professionTitle}
            </h2>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
            {[
              resumeData.personalInfo.location && { icon: "📍", text: resumeData.personalInfo.location },
              resumeData.personalInfo.email && { icon: "✉️", text: resumeData.personalInfo.email },
              resumeData.personalInfo.phone && { icon: "📞", text: formatPhoneNumber(resumeData.personalInfo.phone) },
              resumeData.personalInfo.website && { icon: "🌐", text: resumeData.personalInfo.website },
              resumeData.personalInfo.linkedIn && { icon: "💼", text: resumeData.personalInfo.linkedIn }
            ].filter((item): item is { icon: string; text: string } => Boolean(item)).map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section with creative design */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs mr-2">💡</span>
            SKILLS
          </h2>
          <div className="bg-white rounded-lg p-3 shadow-md">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="space-y-1">
                  <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wide border-b border-purple-200 pb-0.5">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium border border-purple-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Experience Section */}
      {resumeData.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs mr-2">💼</span>
            EXPERIENCE
          </h2>
          <div className="space-y-4">
            {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
              <div key={company} className="bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                {/* Company Header */}
                <div className="mb-2 pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                    {company}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">{experiences[0].location}</p>
                  {experiences.length > 1 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                        Career Progression • {experiences.length} Roles
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Positions within the company */}
                <div className="space-y-2">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="relative pl-8">
                      {/* Timeline for multiple roles */}
                      {experiences.length > 1 && (
                        <div className="absolute -left-2 top-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                            <span className="text-white text-xs font-bold">{experiences.length - index}</span>
                          </div>
                          {index < experiences.length - 1 && (
                            <div className="absolute left-1/2 top-full w-0.5 h-6 bg-blue-300 transform -translate-x-1/2"></div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">{exp.position}</h4>
                          {experiences.length > 1 && index === 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                              Current Role
                            </span>
                          )}
                          {experiences.length > 1 && index > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                              Previous Role
                            </span>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p className="font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                        </div>
                      </div>
                      
                      {exp.description && (
                        <p className="text-sm text-gray-700 mb-1 italic">{exp.description}</p>
                      )}
                      
                      {exp.achievements.length > 0 && (
                        <ul className="space-y-0.5 text-sm text-gray-700">
                          {exp.achievements.map((achievement: string, achievementIndex: number) => (
                            <li key={achievementIndex} className="flex items-start">
                              <span className="mr-2 text-blue-500">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {resumeData.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs mr-2">🎓</span>
            EDUCATION
          </h2>
          <div className="space-y-2">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="bg-white rounded-lg p-2 shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-xs text-gray-700">{edu.field}</p>
                    <p className="text-sm text-gray-900 font-medium">{edu.institution}</p>
                    {edu.honors && Array.isArray(edu.honors) && edu.honors.length > 0 && (
                      <ul className="text-xs text-gray-600 italic pl-4 list-disc mt-0.5">
                        {edu.honors.map((honor, idx) => (
                          <li key={idx}>{honor}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    <p className="font-medium">{edu.graduationDate}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {resumeData.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs mr-2">🚀</span>
            PROJECTS
          </h2>
          <div className="space-y-1">
            {resumeData.projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
                <p className="text-xs text-gray-700 mb-0.5 font-light">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-0.5">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-md text-xs font-light">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {(project.url || project.github) && (
                  <div className="text-xs text-gray-600 font-light">
                    {project.url && <div>Website: {project.url}</div>}
                    {project.github && <div>Repository: {project.github}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
        <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center">
            <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-2">
              <div className="w-2.5 h-2.5 bg-white rounded-sm rotate-45"></div>
            </div>
            ADDITIONAL INFORMATION
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.additionalSections.filter(section => section.items && section.items.length > 0).map(section => (
              <div key={section.id}>
                <h3 className="text-sm font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                  {section.title}
                </h3>
                <div className="text-xs text-slate-700 space-y-0.5">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-1 flex-shrink-0"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Tech Template ---
export const TechTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '', isEditing = false, onEdit }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <div className={`bg-white p-2 mx-auto print:max-w-none print:mx-0 ${className}`} id="resume-preview" style={{ minWidth: '210mm', maxWidth: '210mm', fontSize: '12px' }}>
      {/* Header with modern geometric design */}
      <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white rounded-lg p-2 mb-2">
        {/* Geometric accent elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-500/20 to-blue-500/20 rounded-tr-full"></div>
        
        {/* QR Code positioned absolutely in top right */}
        <div className="absolute top-2 right-2 z-10">
          <QRCodeComponent personalInfo={resumeData.personalInfo} size={75} theme="tech" />
        </div>
        
        <div className="relative z-10 pr-20">
          <h1 className="text-3xl font-bold mb-0.5 tracking-tight">{resumeData.personalInfo.fullName}</h1>
          {resumeData.personalInfo.professionTitle && (
            <h2 className="text-lg font-medium text-blue-200 mb-1 tracking-wide">
              {resumeData.personalInfo.professionTitle}
            </h2>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {[
              resumeData.personalInfo.email && resumeData.personalInfo.email,
              resumeData.personalInfo.phone && formatPhoneNumber(resumeData.personalInfo.phone),
              resumeData.personalInfo.location && resumeData.personalInfo.location,
              resumeData.personalInfo.website && resumeData.personalInfo.website,
              resumeData.personalInfo.linkedIn && resumeData.personalInfo.linkedIn
            ].filter(Boolean).map((item, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-gray-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills with modern card design */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="mb-2">
          <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            CORE COMPETENCIES
          </h2>
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-2 border border-slate-200">
            <div className="space-y-1">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="flex items-start gap-2">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide min-w-[110px] mt-0.5 flex-shrink-0 whitespace-pre-line">
                    {category.replace('Technologies & Frameworks', 'Technologies &\nFrameworks')}:
                  </h3>
                  <div className="flex flex-wrap gap-1 flex-1 max-w-[calc(100%-130px)]">
                    {skills.map((skill, index) => (
                      <span key={index} className="bg-white text-slate-700 px-1.5 py-0.5 rounded-md text-xs font-medium border border-slate-300 shadow-sm whitespace-nowrap">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Experience with timeline design */}
      {resumeData.experience.length > 0 && (
        <div className="mb-2">
          <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mr-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-2">
            {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
              <div key={company} className="relative bg-white rounded-lg border border-slate-200 shadow-sm">
                {/* Company Header */}
                <div className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-t-lg p-1.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{company}</h3>
                      <p className="text-sm text-slate-600 mt-0.5">{experiences[0].location}</p>
                      {experiences.length > 1 && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                            {experiences.length} positions • Career progression
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Positions within the company */}
                <div className="p-1.5 space-y-1.5">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="relative pl-8">
                      {/* Timeline for multiple roles */}
                      {experiences.length > 1 && (
                        <div className="absolute -left-2 top-1">
                          <div className="w-5 h-5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                            <span className="text-white text-xs font-bold">{experiences.length - index}</span>
                          </div>
                          {index < experiences.length - 1 && (
                            <div className="absolute left-1/2 top-full w-0.5 h-6 bg-gradient-to-b from-teal-300 to-blue-300 transform -translate-x-1/2"></div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-0.5">
                        <div>
                          <h4 className="text-base font-bold text-slate-800">{exp.position}</h4>
                          {experiences.length > 1 && (
                            <div className="flex gap-1 mt-0.5">
                              {index === 0 && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                  Current
                                </span>
                              )}
                              {index > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                                  Previous
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right text-xs bg-slate-100 px-2 py-1 rounded-lg">
                          <p className="font-semibold text-slate-700">{exp.startDate} → {exp.current ? 'Present' : exp.endDate}</p>
                        </div>
                      </div>
                      
                      {exp.description && (
                        <p className="text-sm text-slate-700 mb-0.5 italic">{exp.description}</p>
                      )}
                      
                      {exp.achievements.length > 0 && (
                        <ul className="space-y-0.5 text-sm text-slate-700">
                          {exp.achievements.map((achievement: string, achievementIndex: number) => (
                            <li key={achievementIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education and Projects in two columns */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Education Section */}
        {resumeData.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <span className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs mr-2">🎓</span>
              EDUCATION
            </h2>
            <div className="space-y-2">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="bg-white rounded-lg p-2 shadow-md border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-xs text-gray-700">{edu.field}</p>
                      <p className="text-sm text-gray-900 font-medium">{edu.institution}</p>
                      {edu.honors && Array.isArray(edu.honors) && edu.honors.length > 0 && (
                        <ul className="text-xs text-gray-600 italic pl-4 list-disc mt-0.5">
                          {edu.honors.map((honor, idx) => (
                            <li key={idx}>{honor}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-600">
                      <p className="font-medium">{edu.graduationDate}</p>
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {resumeData.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <span className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs mr-2">🚀</span>
              PROJECTS
            </h2>
            <div className="space-y-2">
              {resumeData.projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg p-2 shadow-md border-l-4 border-orange-500">
                  <h3 className="text-xs font-bold text-gray-900 mb-0.5">{project.name}</h3>
                  <p className="text-xs text-gray-700 mb-0.5">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-0.5">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-md text-xs font-light">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.url || project.github) && (
                    <div className="text-xs space-x-2">
                      {project.url && <span className="text-blue-600">🌐 {project.url}</span>}
                      {project.github && <span className="text-slate-600">📂 {project.github}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
        <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center">
            <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-2">
              <div className="w-2.5 h-2.5 bg-white rounded-sm rotate-45"></div>
            </div>
            ADDITIONAL INFORMATION
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.additionalSections.filter(section => section.items && section.items.length > 0).map(section => (
              <div key={section.id}>
                <h3 className="text-sm font-bold text-slate-700 mb-0.5 uppercase tracking-wide">
                  {section.title}
                </h3>
                <div className="text-xs text-slate-700 space-y-0.5">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-1 flex-shrink-0"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Elegant Template ---
export const ElegantTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '', isEditing = false, onEdit }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <div className={`bg-white p-5 mx-auto print:max-w-none print:mx-0 ${className}`} id="resume-preview" style={{ minWidth: '210mm', maxWidth: '210mm', fontSize: '12px' }}>
      {/* Elegant Header */}
      <div className="text-center mb-5 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        
        {/* QR Code positioned absolutely in top right */}
        <div className="absolute top-0 right-0">
          <QRCodeComponent personalInfo={resumeData.personalInfo} size={70} theme="elegant" />
        </div>
        
        <h1 className="text-3xl font-serif text-gray-900 mb-2 tracking-wide">
          {resumeData.personalInfo.fullName}
        </h1>
        {resumeData.personalInfo.professionTitle && (
          <h2 className="text-base font-light text-gray-700 mb-3 tracking-widest uppercase">
            {resumeData.personalInfo.professionTitle}
          </h2>
        )}
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-600">
          {[
            resumeData.personalInfo.email && resumeData.personalInfo.email,
            resumeData.personalInfo.phone && formatPhoneNumber(resumeData.personalInfo.phone),
            resumeData.personalInfo.location && resumeData.personalInfo.location,
            resumeData.personalInfo.website && resumeData.personalInfo.website,
            resumeData.personalInfo.linkedIn && resumeData.personalInfo.linkedIn
          ].filter(Boolean).map((item, idx, arr) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="w-1 h-1 bg-gray-400 rounded-full"></span>}
              <span className="font-light">{item}</span>
            </React.Fragment>
          ))}
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-4 gap-5">
        {/* Left sidebar */}
        <div className="col-span-1 space-y-4">
          {/* Skills */}
          {Object.keys(skillsByCategory).length > 0 && (
            <div>
              <h2 className="text-base font-serif text-gray-900 mb-2 border-b border-gray-300 pb-1">
                EXPERTISE
              </h2>
              <div className="space-y-2">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">
                      {category}
                    </h3>
                    <div className="space-y-0.5">
                      {skills.map((skill, index) => (
                        <div key={index} className="text-xs text-gray-700 py-0.5 px-1.5 bg-gray-50 rounded">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
            <div>
              <h2 className="text-base font-serif text-gray-900 mb-2 border-b border-gray-300 pb-1">
                ADDITIONAL
              </h2>
              <div className="space-y-2">
                {resumeData.additionalSections.filter(section => section.items && section.items.length > 0).map(section => (
                  <div key={section.id}>
                    <h3 className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">
                      {section.title}
                    </h3>
                    <ul className="space-y-0.5">
                      {section.items.map((item, index) => (
                        <li key={index} className="text-xs text-gray-700 flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="col-span-3 space-y-4">
          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-serif text-gray-900 mb-3 border-b border-gray-300 pb-1">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-3">
                {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
                  <div key={company} className="relative">
                    {/* Company Header */}
                    <div className="mb-2">
                      <h3 className="text-base font-serif text-gray-900 font-semibold border-l-4 border-yellow-500 pl-2">
                        {company}
                      </h3>
                      <p className="text-xs text-gray-600 font-light pl-2 mt-0.5">{experiences[0].location}</p>
                      {experiences.length > 1 && (
                        <p className="text-xs text-yellow-600 font-light pl-2 uppercase tracking-wide">
                          Career Progression • {experiences.length} Positions
                        </p>
                      )}
                    </div>
                    
                    {/* Positions within the company */}
                    <div className="space-y-2 relative">
                      {experiences.map((exp, index) => (
                        <div key={exp.id} className="relative pl-6">
                          {/* Timeline for multiple roles */}
                          {experiences.length > 1 && (
                            <div className="absolute -left-1.5 top-0.5">
                              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-xs font-bold">{experiences.length - index}</span>
                              </div>
                              {index < experiences.length - 1 && (
                                <div className="absolute left-1/2 top-full w-0.5 h-6 bg-yellow-300 transform -translate-x-1/2"></div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900">{exp.position}</h4>
                              {experiences.length > 1 && (
                                <div className="flex gap-1 mt-0.5">
                                  {index === 0 && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                      Current Role
                                    </span>
                                  )}
                                  {index > 0 && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                                      Previous Role
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-right text-xs text-gray-600">
                              <p className="font-light">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
                            </div>
                          </div>
                          
                          {exp.description && (
                            <p className="text-xs text-gray-700 mb-1 italic font-light">{exp.description}</p>
                          )}
                          
                          {exp.achievements.length > 0 && (
                            <ul className="space-y-1 text-xs text-gray-700">
                              {exp.achievements.map((achievement: string, achievementIndex: number) => (
                                <li key={achievementIndex} className="flex items-start">
                                  <span className="w-1 h-1 bg-yellow-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education and Projects */}
          <div className="grid grid-cols-2 gap-4">
            {/* Education */}
            {resumeData.education.length > 0 && (
              <div>
                <h2 className="text-base font-serif text-gray-900 mb-2 border-b border-gray-300 pb-1">
                  EDUCATION
                </h2>
                <div className="space-y-2">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-xs text-gray-700">{edu.field}</p>
                      <p className="text-sm text-gray-900 font-medium">{edu.institution}</p>
                      {edu.honors && Array.isArray(edu.honors) && edu.honors.length > 0 && (
                        <ul className="text-xs text-gray-600 italic pl-4 list-disc mt-0.5">
                          {edu.honors.map((honor, idx) => (
                            <li key={idx}>{honor}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && (
              <div>
                <h2 className="text-base font-serif text-gray-900 mb-2 border-b border-gray-300 pb-1">
                  PROJECTS
                </h2>
                <div className="space-y-2">
                  {resumeData.projects.map((project) => (
                    <div key={project.id}>
                      <h3 className="text-sm font-bold text-gray-900">{project.name}</h3>
                      <p className="text-xs text-gray-700 mb-1 font-light">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs font-light">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {(project.url || project.github) && (
                        <div className="text-xs text-gray-600 font-light">
                          {project.url && <div>Website: {project.url}</div>}
                          {project.github && <div>Repository: {project.github}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
