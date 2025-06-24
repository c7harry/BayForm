// ResumeTemplates: Contains all resume template components
import React from 'react';
import { ResumeData } from '@/types/resume';
import { FaLinkedin, FaGlobe } from 'react-icons/fa';

// Props for all templates
interface ResumeTemplateProps {
  resumeData: ResumeData;
  className?: string;
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
      <div className="border-b-2 border-gray-400 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 text-left tracking-tight">
          {resumeData.personalInfo.fullName}
        </h1>
        {resumeData.personalInfo.professionTitle && (
          <h2 className="text-lg font-medium text-gray-700 mb-2 text-left">
            {resumeData.personalInfo.professionTitle}
          </h2>
        )}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 text-sm text-gray-700">
          {/* Personal Info Row: All fields separated by |, always one row */}
          <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-0 text-sm text-gray-700 whitespace-nowrap overflow-x-auto">
            { [
              resumeData.personalInfo.email && resumeData.personalInfo.email,
              resumeData.personalInfo.phone && resumeData.personalInfo.phone,
              resumeData.personalInfo.location && resumeData.personalInfo.location,
              resumeData.personalInfo.linkedIn && (
                <span key="linkedin" className="flex items-center gap-1">
                  <FaLinkedin className="text-blue-600" />
                  <span>{resumeData.personalInfo.linkedIn.charAt(0).toUpperCase() + resumeData.personalInfo.linkedIn.slice(1)}</span>
                </span>
              ),
              resumeData.personalInfo.website && (
                <span key="website" className="flex items-center gap-1">
                  <FaGlobe className="text-green-600" />
                  <span>{resumeData.personalInfo.website.charAt(0).toUpperCase() + resumeData.personalInfo.website.slice(1)}</span>
                </span>
              )
            ].filter(Boolean).map((item, idx, arr) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="mx-0 text-gray-400">|</span>}
                {item}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">SKILLS</h2>
          <div className="space-y-2">
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
      )}{/* Experience Section */}
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">EXPERIENCE</h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="text-left">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-1 text-sm text-gray-700">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}      {/* Education Section */}
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">EDUCATION</h2>
          <div className="space-y-3">
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
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">PROJECTS</h2>
          <div className="space-y-3">
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
        <div className="mb-6">
          {resumeData.additionalSections.map(section => (
            <div key={section.id} className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1 uppercase">{section.title}</h2>
              <div className="text-sm text-gray-700">
                {section.items.map((item, index) => (
                  <div key={index} className="mb-1">{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Classic Template ---
export const ClassicTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto ${className}`} id="resume-preview">      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {resumeData.personalInfo.fullName}
        </h1>
        {resumeData.personalInfo.professionTitle && (
          <h2 className="text-lg font-medium text-gray-700 mb-3">
            {resumeData.personalInfo.professionTitle}
          </h2>
        )}
        <div className="text-gray-600 space-y-1">
          <p>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
          <p>{resumeData.personalInfo.location}</p>
          {resumeData.personalInfo.linkedIn && <p>{resumeData.personalInfo.linkedIn}</p>}
        </div>
      </div>
      {/* Skills Section */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Skills
          </h2>
          <div className="flex flex-col items-center">
            {Array.from(new Set(resumeData.skills.map(skill => skill.category))).map(category => {
              const categorySkills = resumeData.skills.filter(skill => skill.category === category);
              if (categorySkills.length === 0) return null;
              return (
                <div key={category} className="mb-1">
                  <span className="font-bold text-gray-900 capitalize">{category}:</span>{' '}
                  <span className="text-gray-700">{categorySkills.map(skill => skill.name).join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Experience Section */}
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Professional Experience
          </h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                <p className="text-gray-700 font-semibold">{exp.company}, {exp.location}</p>
                <p className="text-gray-600 italic">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <p className="text-gray-700 mb-2">{exp.description}</p>
              {exp.achievements.length > 0 && (
                <ul className="space-y-1 ml-4">
                  {exp.achievements.map((achievement, index) => (
                    <li key={index} className="text-gray-700 list-disc">
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Education Section */}
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Education
          </h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {edu.degree} in {edu.field}
              </h3>
              <p className="text-gray-700">{edu.institution}</p>
              <p className="text-gray-600">{edu.graduationDate}</p>
              {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              {edu.honors && <p className="text-gray-600 italic">{edu.honors}</p>}
            </div>
          ))}
        </div>
      )}
      {/* Projects Section */}
      {resumeData.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Projects
          </h2>
          {resumeData.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              {(project.url || project.github) && (
                <div className="text-orange-500 text-sm">
                  {project.url && <span className="mr-4">Live: {project.url}</span>}
                  {project.github && <span>GitHub: {project.github}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Additional Sections */}
      {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-orange-500 mb-4">Additional Information</h2>
          <div className="flex flex-col items-center">
            {resumeData.additionalSections.map(section => (
              <div key={section.id} className="mb-1">
                <span className="font-bold text-gray-900 capitalize">{section.title}:</span>{' '}
                <span className="text-gray-700">{section.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Minimal Template ---
export const MinimalTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto ${className}`} id="resume-preview">      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-light text-gray-900 mb-4">
          {resumeData.personalInfo.fullName}
        </h1>
        {resumeData.personalInfo.professionTitle && (
          <h2 className="text-xl font-light text-gray-600 mb-4">
            {resumeData.personalInfo.professionTitle}
          </h2>
        )}
        <div className="text-gray-600 space-x-4">
          <span>{resumeData.personalInfo.email}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.phone}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.location}</span>
        </div>
      </div>
      {/* Skills Section */}
      {resumeData.skills.length > 0 && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Skills</h2>
          <div className="flex flex-col items-center">
            {Array.from(new Set(resumeData.skills.map(skill => skill.category))).map(category => {
              const categorySkills = resumeData.skills.filter(skill => skill.category === category);
              if (categorySkills.length === 0) return null;
              return (
                <div key={category} className="mb-1">
                  <span className="font-semibold text-gray-900">{category}:</span>{' '}
                  <span className="text-gray-700">{categorySkills.map(skill => skill.name).join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Experience Section */}
      {resumeData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Experience</h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-8">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="col-span-2">
                  <h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                </div>
                <div className="text-right text-gray-600">
                  <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  <p>{exp.location}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{exp.description}</p>
              {exp.achievements.length > 0 && (
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, index) => (
                    <li key={index} className="text-gray-700">
                      — {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Education Section */}
      {resumeData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Education</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <p className="text-gray-700">{edu.institution}</p>
              </div>
              <div className="text-right text-gray-600">
                <p>{edu.graduationDate}</p>
                {edu.gpa && <p>GPA: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Projects Section */}
      {resumeData.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Projects</h2>
          {resumeData.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              {(project.url || project.github) && (
                <div className="text-orange-500 text-sm">
                  {project.url && <span className="mr-4">Live: {project.url}</span>}
                  {project.github && <span>GitHub: {project.github}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Additional Sections */}
      {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-orange-500 mb-4">Additional Information</h2>
          <div className="flex flex-col items-center">
            {resumeData.additionalSections.map(section => (
              <div key={section.id} className="mb-1">
                <span className="font-semibold text-gray-900">{section.title}:</span>{' '}
                <span className="text-gray-700">{section.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
