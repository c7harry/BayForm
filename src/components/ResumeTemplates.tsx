import React from 'react';
import { ResumeData } from '@/types/resume';

interface ResumeTemplateProps {
  resumeData: ResumeData;
  className?: string;
}

export const ModernTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto ${className}`} id="resume-preview">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {resumeData.personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          <span>{resumeData.personalInfo.email}</span>
          <span>{resumeData.personalInfo.phone}</span>
          <span>{resumeData.personalInfo.location}</span>
          {resumeData.personalInfo.linkedIn && (
            <span>{resumeData.personalInfo.linkedIn}</span>
          )}
          {resumeData.personalInfo.website && (
            <span>{resumeData.personalInfo.website}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-3">Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
      </div>

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Experience</h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                </div>
                <div className="text-right text-gray-600">
                  <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  <p>{exp.location}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{exp.description}</p>
              {exp.achievements.length > 0 && (
                <ul className="space-y-1">
                  {exp.achievements.map((achievement, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Education</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-blue-600 font-medium">{edu.institution}</p>
                  {edu.honors && <p className="text-gray-600">{edu.honors}</p>}
                </div>
                <div className="text-right text-gray-600">
                  <p>{edu.graduationDate}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['technical', 'soft', 'language'].map((category) => {
              const categorySkills = resumeData.skills.filter(skill => skill.category === category);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                    {category} Skills
                  </h3>
                  <div className="space-y-1">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex justify-between">
                        <span className="text-gray-700">{skill.name}</span>
                        <span className="text-sm text-gray-500 capitalize">{skill.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Projects</h2>
          {resumeData.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              {(project.url || project.github) && (
                <div className="text-blue-600 text-sm">
                  {project.url && <span className="mr-4">Live: {project.url}</span>}
                  {project.github && <span>GitHub: {project.github}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ClassicTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto ${className}`} id="resume-preview">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {resumeData.personalInfo.fullName}
        </h1>
        <div className="text-gray-600 space-y-1">
          <p>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
          <p>{resumeData.personalInfo.location}</p>
          {resumeData.personalInfo.linkedIn && <p>{resumeData.personalInfo.linkedIn}</p>}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
      </div>

      {/* Experience */}
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

      {/* Education */}
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

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Skills
          </h2>
          {['technical', 'soft', 'language'].map((category) => {
            const categorySkills = resumeData.skills.filter(skill => skill.category === category);
            if (categorySkills.length === 0) return null;
            
            return (
              <div key={category} className="mb-3">
                <h3 className="font-bold text-gray-900 capitalize">{category} Skills:</h3>
                <p className="text-gray-700">
                  {categorySkills.map(skill => skill.name).join(', ')}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MinimalTemplate: React.FC<ResumeTemplateProps> = ({ resumeData, className = '' }) => {
  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto ${className}`} id="resume-preview">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-light text-gray-900 mb-4">
          {resumeData.personalInfo.fullName}
        </h1>
        <div className="text-gray-600 space-x-4">
          <span>{resumeData.personalInfo.email}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.phone}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.location}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <p className="text-gray-700 text-lg leading-relaxed">
          {resumeData.personalInfo.summary}
        </p>
      </div>

      {/* Experience */}
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

      {/* Education */}
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

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-6">Skills</h2>
          <p className="text-gray-700">
            {resumeData.skills.map(skill => skill.name).join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
};
