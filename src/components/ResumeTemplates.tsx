// ResumeTemplates: Contains all resume template components
import React from 'react';
import { ResumeData } from '../types/resume';
import { FaLinkedin, FaGlobe } from 'react-icons/fa';
import { QRCodeComponent } from './QRCodeComponent';

// Props for all templates
interface ResumeTemplateProps {
  resumeData: ResumeData;
  className?: string;
}

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
export const ModernTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <div className={`bg-white px-0 py-4 max-w-4xl mx-auto ${className}`} id="resume-preview">      {/* Header */}
      <div className="mb-2 relative">
        {/* QR Code positioned absolutely in top right */}
        <div className="absolute -top-3 right-6">
          <QRCodeComponent 
            personalInfo={resumeData.personalInfo} 
            size={80} 
            theme="modern" 
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-1 text-left tracking-tight pr-40">
          {resumeData.personalInfo.fullName}
        </h1>
        {resumeData.personalInfo.professionTitle && (
          <h2 className="text-lg font-medium text-gray-700 mb-2 text-left">
            {resumeData.personalInfo.professionTitle}
          </h2>
        )}
        <div className="w-full flex flex-row flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-700 justify-center text-center">
          { [
              resumeData.personalInfo.location && resumeData.personalInfo.location,
              resumeData.personalInfo.email && resumeData.personalInfo.email,
              resumeData.personalInfo.phone && formatPhoneNumber(resumeData.personalInfo.phone),
              resumeData.personalInfo.website && (
                <span key="website" className="flex items-center gap-1">
                  <span>{resumeData.personalInfo.website.charAt(0).toUpperCase() + resumeData.personalInfo.website.slice(1)}</span>
                </span>
              ),
              resumeData.personalInfo.linkedIn && (
                <span key="linkedin" className="flex items-center gap-1">
                  <span>{resumeData.personalInfo.linkedIn.charAt(0).toUpperCase() + resumeData.personalInfo.linkedIn.slice(1)}</span>
                </span>
              )
            ].filter(Boolean).map((item, idx, arr) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-[-5px] text-gray-400">|</span>}
                {item}
              </React.Fragment>
            ))}
        </div>
      </div>

      {/* Skills Section */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-black pb-1 text-center">SKILLS</h2>
          <div className="space-y-0 mt-4">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="text-left">
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {category}:
                </span>{' '}
                <span className="text-sm text-gray-700">{skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Experience Section */}
      {resumeData.experience.length > 0 && (
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-black pb-1 text-center">EXPERIENCE</h2>
          <div className="space-y-6 mt-4">
            {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
              <div key={company} className="text-left">
                {/* Company Header */}
                <div className="border-l-4 border-blue-500 pl-4 mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{company}</h3>
                  <p className="text-sm text-gray-600">{experiences[0].location}</p>
                  {experiences.length > 1 && (
                    <p className="text-xs text-blue-600 font-medium">
                      {experiences.length} roles • Career progression
                    </p>
                  )}
                </div>
                
                {/* Positions within the company */}
                <div className="space-y-4 relative">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="relative pl-8">
                      {/* Timeline for multiple roles */}
                      {experiences.length > 1 && (
                        <div className="absolute -left-2 top-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                            <span className="text-white text-xs font-bold">{experiences.length - index}</span>
                          </div>
                          {index < experiences.length - 1 && (
                            <div className="absolute left-1/2 top-full w-0.5 h-8 bg-blue-300 transform -translate-x-1/2"></div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-2">
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
                        <p className="text-sm text-gray-700 mb-2 italic">{exp.description}</p>
                      )}
                      
                      {exp.achievements.length > 0 && (
                        <ul className="space-y-1 text-sm text-gray-700">
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
      )}{/* Education Section */}
      {resumeData.education.length > 0 && (
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-black pb-1 text-center">EDUCATION</h2>
          <div className="space-y-3 mt-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-sm text-gray-700 font-medium">{edu.institution}</p>
                    {edu.honors && <p className="text-sm text-gray-600">{edu.honors}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{edu.graduationDate}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Projects Section */}
      {resumeData.projects.length > 0 && (
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-black pb-1 text-center">PROJECTS</h2>
          <div className="space-y-3 mt-4">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="text-left">
                <h3 className="text-base font-semibold text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {(project.url || project.github) && (
                  <div className="text-blue-600 text-sm">
                    {project.url && <span className="mr-4">Live: {project.url}</span>}
                    {project.github && <span>GitHub: {project.github}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information Section */}
      {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
        <div className="mb-2">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-gray-900 mb-2 border-b-2 border-black pb-1 uppercase text-center">Additional Information</h2>
            <div className="text-sm text-gray-700 mt-4">
              {resumeData.additionalSections.filter(section => section.items && section.items.length > 0).map(section => (
                <div key={section.id} className="mb-1">
                  <span className="font-bold text-gray-900 capitalize">{section.title}:</span>{' '}
                  <span className="text-gray-700">{section.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Executive Template ---
export const ClassicTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <div className={`bg-white p-6 w-full ${className}`} id="resume-preview">
      {/* Header with gradient accent */}
      <div className="relative mb-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        {/* QR Code positioned absolutely in top right */}
        <div className="absolute top-6 right-0">
          <QRCodeComponent personalInfo={resumeData.personalInfo} size={80} theme="classic" />
        </div>
        
        <div className="pt-6 pb-4 pr-40">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            {resumeData.personalInfo.fullName}
          </h1>
          {resumeData.personalInfo.professionTitle && (
            <h2 className="text-xl font-medium text-blue-700 mb-3 uppercase tracking-wide">
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
      <div className="grid grid-cols-3 gap-6">
        {/* Left column - Skills and Additional Info */}
        <div className="col-span-1 space-y-4">
          {/* Skills Section */}
          {Object.keys(skillsByCategory).length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600 uppercase tracking-wide">SKILLS</h2>
              <div className="space-y-2">
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
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600 uppercase tracking-wide">ADDITIONAL</h2>
              <div className="space-y-2">
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
        <div className="col-span-2 space-y-4">
          {/* Experience Section */}
          {resumeData.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600 uppercase tracking-wide">EXPERIENCE</h2>
              <div className="space-y-4">
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
                    <div className="space-y-2 relative">
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
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600 uppercase tracking-wide">EDUCATION</h2>
              <div className="space-y-2">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                        <p className="text-sm text-blue-700 font-medium">{edu.institution}</p>
                        {edu.honors && <p className="text-xs text-gray-600 italic">{edu.honors}</p>}
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
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600 uppercase tracking-wide">PROJECTS</h2>
              <div className="space-y-2">
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
export const MinimalTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-gray-100 p-6 w-full ${className}`} id="resume-preview">
      {/* Header with geometric design */}
      <div className="relative mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10"></div>
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20"></div>
        
        {/* QR Code positioned absolutely in top right, with higher z-index */}
        <div className="absolute top-2 right-2 z-20">
          <QRCodeComponent personalInfo={resumeData.personalInfo} size={80} theme="minimal" />
        </div>
        
        <div className="relative z-10 bg-white rounded-lg p-6 shadow-lg pr-48">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {resumeData.personalInfo.fullName}
          </h1>
          {resumeData.personalInfo.professionTitle && (
            <h2 className="text-lg font-medium text-gray-700 mb-4 tracking-wide">
              {resumeData.personalInfo.professionTitle}
            </h2>
          )}
          <div className="grid grid-cols-5 gap-2 text-sm text-gray-600">
            {[
              resumeData.personalInfo.location && { icon: "📍", text: resumeData.personalInfo.location },
              resumeData.personalInfo.email && { icon: "✉️", text: resumeData.personalInfo.email },
              resumeData.personalInfo.phone && { icon: "📞", text: formatPhoneNumber(resumeData.personalInfo.phone) },
              resumeData.personalInfo.website && { icon: "🌐", text: resumeData.personalInfo.website },
              resumeData.personalInfo.linkedIn && { icon: "💼", text: resumeData.personalInfo.linkedIn }
            ].filter((item): item is { icon: string; text: string } => Boolean(item)).map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                <span className="text-xs">{item.icon}</span>
                <span className="text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section with creative design */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm mr-3">💡</span>
            SKILLS
          </h2>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm font-bold text-purple-700 uppercase tracking-wide border-b border-purple-200 pb-1">
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm mr-3">💼</span>
            EXPERIENCE
          </h2>
          <div className="space-y-6">
            {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
              <div key={company} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                {/* Company Header */}
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                    {company}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{experiences[0].location}</p>
                  {experiences.length > 1 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                        Career Progression • {experiences.length} Roles
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Positions within the company */}
                <div className="space-y-4">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="relative pl-8">
                      {/* Timeline for multiple roles */}
                      {experiences.length > 1 && (
                        <div className="absolute -left-2 top-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                            <span className="text-white text-xs font-bold">{experiences.length - index}</span>
                          </div>
                          {index < experiences.length - 1 && (
                            <div className="absolute left-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-blue-300 to-cyan-300 transform -translate-x-1/2"></div>
                          )}
                        </div>
                      )}
                      
                      <div className={`${experiences.length > 1 ? '' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                            {experiences.length > 1 && (
                              <div className="flex gap-2 mt-1">
                                {index === 0 && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                    Current Position
                                  </span>
                                )}
                                {index > 0 && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                    Previous Position
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-blue-50 px-3 py-1 rounded-lg font-mono">
                            <p className="font-semibold">{exp.startDate} → {exp.current ? 'Present' : exp.endDate}</p>
                          </div>
                        </div>
                        
                        {exp.description && (
                          <p className="text-sm text-gray-700 mb-3 italic bg-gray-50 p-3 rounded-lg">{exp.description}</p>
                        )}
                        
                        {exp.achievements.length > 0 && (
                          <ul className="space-y-2 text-sm text-gray-700">
                            {exp.achievements.map((achievement: string, achievementIndex: number) => (
                              <li key={achievementIndex} className="flex items-start">
                                <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education and Projects in two columns */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Education Section */}
        {resumeData.education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs mr-2">🎓</span>
              EDUCATION
            </h2>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="bg-white rounded-lg p-3 shadow-md border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-xs text-gray-700">{edu.field}</p>
                      <p className="text-sm text-green-700 font-mono">{edu.institution}</p>
                      {edu.honors && <p className="text-xs text-gray-600 italic">{edu.honors}</p>}
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
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs mr-2">🚀</span>
              PROJECTS
            </h2>
            <div className="space-y-3">
              {resumeData.projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg p-3 shadow-md border-l-4 border-orange-500">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-xs text-gray-700 mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.url || project.github) && (
                    <div className="text-xs space-x-2">
                      {project.url && <span className="text-blue-600">🌐 {project.url}</span>}
                      {project.github && <span className="text-gray-600">📱 {project.github}</span>}
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
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">✨</span>
            ADDITIONAL INFO
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {resumeData.additionalSections.filter(section => section.items && section.items.length > 0).map(section => (
              <div key={section.id}>
                <h3 className="text-sm font-bold text-indigo-700 mb-1 uppercase tracking-wide">
                  {section.title}
                </h3>
                <div className="text-xs text-gray-700 space-y-1">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-indigo-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
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
export const TechTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <div className={`bg-gray-900 text-white p-6 w-full ${className}`} id="resume-preview">
      {/* Header with terminal-like design */}
      <div className="bg-black rounded-lg p-4 mb-6 border border-green-500 relative">
        {/* QR Code positioned absolutely in top right */}
        <div className="absolute top-2 right-2">
          <QRCodeComponent personalInfo={resumeData.personalInfo} size={80} theme="tech" />
        </div>
        
        <div className="flex items-center space-x-2 mb-3 pr-48">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-xs ml-2">~/resume/portfolio</span>
        </div>
        <div className="font-mono">
          <div className="text-green-400 mb-1">$ whoami</div>
          <h1 className="text-2xl font-bold text-white mb-2">{resumeData.personalInfo.fullName}</h1>
          {resumeData.personalInfo.professionTitle && (
            <>
              <div className="text-green-400 mb-1">$ cat role.txt</div>
              <h2 className="text-lg text-cyan-400 mb-3">{resumeData.personalInfo.professionTitle}</h2>
            </>
          )}
          <div className="text-green-400 mb-1">$ ls contact/</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              resumeData.personalInfo.email && `📧 ${resumeData.personalInfo.email}`,
              resumeData.personalInfo.phone && `📱 ${formatPhoneNumber(resumeData.personalInfo.phone)}`,
              resumeData.personalInfo.location && `📍 ${resumeData.personalInfo.location}`,
              resumeData.personalInfo.website && `🌐 ${resumeData.personalInfo.website}`,
              resumeData.personalInfo.linkedIn && `🔗 ${resumeData.personalInfo.linkedIn}`
            ].filter(Boolean).map((item, idx) => (
              <div key={idx} className="text-gray-300">{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills as code blocks */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-3 font-mono"># Technical Skills</h2>
          <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="mb-3 font-mono">
                <div className="text-yellow-400 text-sm">const {category.toLowerCase().replace(/\s+/g, '_')} = [</div>
                <div className="ml-4 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="text-green-300">
                      &quot;{skill}&quot;{index < skills.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
                <div className="text-yellow-400 text-sm">];</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience as commit history */}
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-3 font-mono"># Work Experience</h2>
          <div className="space-y-6">
            {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
              <div key={company} className="bg-gray-800 rounded-lg p-4 border border-green-500">
                {/* Company Header - Git repo style */}
                <div className="mb-4 pb-3 border-b border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 font-mono">$</span>
                    <span className="text-cyan-400 font-mono">cd</span>
                    <h3 className="text-lg font-bold text-white font-mono">{company.toLowerCase().replace(/\s+/g, '-')}/</h3>
                  </div>
                  <p className="text-gray-400 text-sm font-mono ml-4">📍 {experiences[0].location}</p>
                  {experiences.length > 1 && (
                    <p className="text-green-400 text-xs font-mono ml-4">
                      # {experiences.length} commits (career progression)
                    </p>
                  )}
                </div>
                
                {/* Git log style for positions */}
                <div className="space-y-3">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      {/* Commit hash and timeline */}
                      <div className="flex items-start gap-3 mb-2">
                        {experiences.length > 1 && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-black">{experiences.length - index}</span>
                            </div>
                            {index < experiences.length - 1 && (
                              <div className="w-0.5 h-8 bg-green-500 mx-auto mt-1"></div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-base font-bold text-white font-mono">{exp.position}</h4>
                              {experiences.length > 1 && (
                                <span className={`text-xs px-2 py-1 rounded font-mono ${
                                  index === 0 
                                    ? 'bg-green-900 text-green-300' 
                                    : 'bg-gray-700 text-gray-300'
                                }`}>
                                  {index === 0 ? 'HEAD' : `~${index}`}
                                </span>
                              )}
                            </div>
                            <div className="text-right text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded font-mono">
                              <p>{exp.startDate} → {exp.current ? 'HEAD' : exp.endDate}</p>
                            </div>
                          </div>
                          
                          {exp.description && (
                            <div className="mb-2">
                              <span className="text-green-400 font-mono text-xs"># </span>
                              <span className="text-gray-300 text-sm bg-gray-900 p-2 rounded font-mono">{exp.description}</span>
                            </div>
                          )}
                          
                          {exp.achievements.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-green-400 font-mono text-xs">// Key contributions:</div>
                              {exp.achievements.map((achievement: string, achievementIndex: number) => (
                                <div key={achievementIndex} className="flex items-start text-sm">
                                  <span className="text-green-400 mr-2 font-mono">+</span>
                                  <span className="text-gray-300">{achievement}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects and Education in grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Projects as repositories */}
        {resumeData.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-cyan-400 mb-3 font-mono"># Projects</h2>
            <div className="space-y-3">
              {resumeData.projects.map((project) => (
                <div key={project.id} className="bg-gray-800 rounded-lg p-3 border border-purple-500">
                  <h3 className="text-sm font-bold text-white mb-1 font-mono">{project.name}</h3>
                  <p className="text-xs text-gray-300 mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-purple-900 text-purple-300 px-2 py-0.5 rounded text-xs font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.url || project.github) && (
                    <div className="text-xs space-x-2 font-mono">
                      {project.url && <span className="text-cyan-400">🔗 {project.url}</span>}
                      {project.github && <span className="text-gray-400">📂 {project.github}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-cyan-400 mb-3 font-mono"># Education</h2>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="bg-gray-800 rounded-lg p-3 border border-blue-500">
                  <h3 className="text-sm font-bold text-white">{edu.degree}</h3>
                  <p className="text-xs text-gray-300">{edu.field}</p>
                  <p className="text-sm text-blue-400 font-mono">{edu.institution}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                    <span>{edu.graduationDate}</span>
                    {edu.gpa && <span className="bg-gray-700 px-2 py-0.5 rounded">GPA: {edu.gpa}</span>}
                  </div>
                  {edu.honors && <p className="text-xs text-yellow-400 mt-1">{edu.honors}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-yellow-500">
          <h2 className="text-lg font-bold text-cyan-400 mb-3 font-mono"># Additional Info</h2>
          <div className="grid grid-cols-2 gap-3">
            {resumeData.additionalSections.filter(section => section.items && section.items.length > 0).map(section => (
              <div key={section.id} className="font-mono">
                <div className="text-yellow-400 text-sm">{section.title.toLowerCase().replace(/\s+/g, '_')}: [</div>
                <div className="ml-4 text-gray-300 text-xs">
                  {section.items.map((item, index) => (
                    <div key={index}>&quot;{item}&quot;{index < section.items.length - 1 ? ',' : ''}</div>
                  ))}
                </div>
                <div className="text-yellow-400 text-sm">],</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Elegant Template ---
export const ElegantTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  // Group skills by category for display
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <div className={`bg-white p-8 w-full ${className}`} id="resume-preview">
      {/* Elegant Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        
        {/* QR Code positioned absolutely in top right */}
        <div className="absolute top-0 right-0">
          <QRCodeComponent personalInfo={resumeData.personalInfo} size={80} theme="elegant" />
        </div>
        
        <h1 className="text-4xl font-serif text-gray-900 mb-3 tracking-wide">
          {resumeData.personalInfo.fullName}
        </h1>
        {resumeData.personalInfo.professionTitle && (
          <h2 className="text-lg font-light text-gray-700 mb-4 tracking-widest uppercase">
            {resumeData.personalInfo.professionTitle}
          </h2>
        )}
        <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
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
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-4 gap-8">
        {/* Left sidebar */}
        <div className="col-span-1 space-y-6">
          {/* Skills */}
          {Object.keys(skillsByCategory).length > 0 && (
            <div>
              <h2 className="text-lg font-serif text-gray-900 mb-4 border-b border-gray-300 pb-2">
                EXPERTISE
              </h2>
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {skills.map((skill, index) => (
                        <div key={index} className="text-xs text-gray-700 py-1 px-2 bg-gray-50 rounded">
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
              <h2 className="text-lg font-serif text-gray-900 mb-4 border-b border-gray-300 pb-2">
                ADDITIONAL
              </h2>
              <div className="space-y-3">
                {resumeData.additionalSections.filter(section => section.items && section.items.length > 0).map(section => (
                  <div key={section.id}>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                      {section.title}
                    </h3>
                    <ul className="space-y-1">
                      {section.items.map((item, index) => (
                        <li key={index} className="text-xs text-gray-700 flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
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
        <div className="col-span-3 space-y-6">
          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-serif text-gray-900 mb-6 border-b border-gray-300 pb-2">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-6">
                {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
                  <div key={company} className="relative">
                    {/* Company Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-serif text-gray-900 font-semibold border-l-4 border-yellow-500 pl-3">
                        {company}
                      </h3>
                      <p className="text-sm text-gray-600 font-light pl-3 mt-1">{experiences[0].location}</p>
                      {experiences.length > 1 && (
                        <p className="text-xs text-yellow-600 font-light pl-3 uppercase tracking-wide">
                          Career Progression • {experiences.length} Positions
                        </p>
                      )}
                    </div>
                    
                    {/* Positions within the company */}
                    <div className="space-y-4 relative">
                      {experiences.map((exp, index) => (
                        <div key={exp.id} className="relative pl-8">
                          {/* Timeline for multiple roles */}
                          {experiences.length > 1 && (
                            <div className="absolute -left-2 top-1">
                              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-xs font-bold">{experiences.length - index}</span>
                              </div>
                              {index < experiences.length - 1 && (
                                <div className="absolute left-1/2 top-full w-0.5 h-8 bg-yellow-300 transform -translate-x-1/2"></div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900">{exp.position}</h4>
                              {experiences.length > 1 && (
                                <span className={`text-xs px-2 py-1 rounded-full font-light uppercase tracking-wide ${
                                  index === 0 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {index === 0 ? 'Current Role' : 'Previous Role'}
                                </span>
                              )}
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p className="font-light">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
                            </div>
                          </div>
                          
                          {exp.description && (
                            <p className="text-sm text-gray-700 mb-3 italic font-light">{exp.description}</p>
                          )}
                          
                          {exp.achievements.length > 0 && (
                            <ul className="space-y-2 text-sm text-gray-700">
                              {exp.achievements.map((achievement: string, achievementIndex: number) => (
                                <li key={achievementIndex} className="flex items-start font-light">
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
          <div className="grid grid-cols-2 gap-6">
            {/* Education */}
            {resumeData.education.length > 0 && (
              <div>
                <h2 className="text-lg font-serif text-gray-900 mb-4 border-b border-gray-300 pb-2">
                  EDUCATION
                </h2>
                <div className="space-y-3">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-sm text-gray-700 font-light">{edu.field}</p>
                      <p className="text-sm text-gray-700 italic">{edu.institution}</p>
                      <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                        <span className="font-light">{edu.graduationDate}</span>
                        {edu.gpa && <span className="font-light">GPA: {edu.gpa}</span>}
                      </div>
                      {edu.honors && <p className="text-xs text-gray-600 italic mt-1">{edu.honors}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && (
              <div>
                <h2 className="text-lg font-serif text-gray-900 mb-4 border-b border-gray-300 pb-2">
                  PROJECTS
                </h2>
                <div className="space-y-3">
                  {resumeData.projects.map((project) => (
                    <div key={project.id}>
                      <h3 className="text-base font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-700 mb-2 font-light">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-light">
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
