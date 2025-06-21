import React, { useState } from 'react';
import { ResumeData, PersonalInfo, Experience, Education, Skill, Project, AdditionalSection } from '@/types/resume';
import { generateResumeId } from '@/utils/storage';

interface ResumeFormProps {
  initialData?: ResumeData;
  onSave: (resume: ResumeData) => void;
  onCancel: () => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ initialData, onSave, onCancel }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(
    initialData || {
      id: generateResumeId(),
      name: 'My Resume',
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedIn: '',
        website: '',
        summary: '' // Add summary for type compatibility
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      template: 'modern',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      additionalSections: [
        { id: generateResumeId(), title: 'Languages', items: [] },
        { id: generateResumeId(), title: 'Certifications', items: [] }
      ]
    }
  );

  // Restore helper functions for personal info, experience, education
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };
  const addExperience = () => {
    const newExp: Experience = {
      id: generateResumeId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };
  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };
  const addEducation = () => {
    const newEdu: Education = {
      id: generateResumeId(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
      honors: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };
  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // --- Skill Categories ---
  const defaultCategories = ['Software', 'Technologies & Frameworks', 'General'];
  const [skillCategories, setSkillCategories] = useState<string[]>([...defaultCategories]);

  // Ensure all categories in resumeData.skills are present in skillCategories
  React.useEffect(() => {
    const allCategories = [
      ...defaultCategories,
      ...resumeData.skills.map(skill => skill.category)
    ];
    const uniqueCategories = Array.from(new Set(allCategories));
    if (uniqueCategories.length !== skillCategories.length || uniqueCategories.some(cat => !skillCategories.includes(cat))) {
      setSkillCategories(uniqueCategories);
    }
  }, [resumeData.skills]);

  const addSkillCategory = () => {
    const newCategory = prompt('Enter new skill category name:');
    if (newCategory && !skillCategories.includes(newCategory)) {
      setSkillCategories([...skillCategories, newCategory]);
    }
  };
  const removeSkillCategory = (cat: string) => {
    setSkillCategories(skillCategories.filter(c => c !== cat));
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.category !== cat)
    }));
  };

  const addSkill = (category: string) => {
    const newSkill: Skill = {
      id: generateResumeId(),
      name: '',
      category
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };
  const updateSkill = (id: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => skill.id === id ? { ...skill, name: value } : skill)
    }));
  };
  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  // --- Additional Sections ---
  const addAdditionalSection = () => {
    const title = prompt('Enter new section title:');
    if (title) {
      setResumeData(prev => ({
        ...prev,
        additionalSections: [
          ...(prev.additionalSections || []),
          { id: generateResumeId(), title, items: [] }
        ]
      }));
    }
  };
  const updateAdditionalSectionItem = (sectionId: string, idx: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      additionalSections: (prev.additionalSections || []).map(section =>
        section.id === sectionId
          ? { ...section, items: section.items.map((item, i) => i === idx ? value : item) }
          : section
      )
    }));
  };
  const addAdditionalSectionItem = (sectionId: string) => {
    setResumeData(prev => ({
      ...prev,
      additionalSections: (prev.additionalSections || []).map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, ''] }
          : section
      )
    }));
  };
  const removeAdditionalSectionItem = (sectionId: string, idx: number) => {
    setResumeData(prev => ({
      ...prev,
      additionalSections: (prev.additionalSections || []).map(section =>
        section.id === sectionId
          ? { ...section, items: section.items.filter((_, i) => i !== idx) }
          : section
      )
    }));
  };
  const removeAdditionalSection = (sectionId: string) => {
    setResumeData(prev => ({
      ...prev,
      additionalSections: (prev.additionalSections || []).filter(section => section.id !== sectionId)
    }));
  };

  // --- Project Helpers ---
  const addProject = () => {
    const newProject: Project = {
      id: generateResumeId(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: ''
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };
  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };
  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id
          ? field === 'technologies'
            ? { ...proj, technologies: value.split(',').map((t: string) => t.trim()).filter(Boolean) }
            : { ...proj, [field]: value }
          : proj
      )
    }));
  };

  // Set default additional sections to Languages and Certifications
  const [additionalSectionsInitialized, setAdditionalSectionsInitialized] = useState(false);
  React.useEffect(() => {
    if (!additionalSectionsInitialized && (!resumeData.additionalSections || resumeData.additionalSections.length === 0)) {
      setResumeData(prev => ({
        ...prev,
        additionalSections: [
          { id: generateResumeId(), title: 'Languages', items: [] },
          { id: generateResumeId(), title: 'Certifications', items: [] }
        ]
      }));
      setAdditionalSectionsInitialized(true);
    }
  }, [additionalSectionsInitialized, resumeData.additionalSections]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(resumeData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Resume Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume Name
        </label>
        <input
          type="text"
          value={resumeData.name}
          onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Skills (Top Section) */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          <button
            type="button"
            onClick={addSkillCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Category
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map(category => (
            <div key={category} className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{category.replace(/\b\w/g, c => c.toUpperCase())}</span>
                {!defaultCategories.includes(category) && (
                  <button
                    type="button"
                    onClick={() => removeSkillCategory(category)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {resumeData.skills.filter(skill => skill.category === category).map(skill => (
                  <div key={skill.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={e => updateSkill(skill.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Skill name"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSkill(category)}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  Add Skill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={resumeData.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
            <input
              type="tel"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="url"
              value={resumeData.personalInfo.linkedIn}
              onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={resumeData.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Professional Summary field removed */}
      </div>

      {/* Experience */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
          <button
            type="button"
            onClick={addExperience}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Experience
          </button>
        </div>
        {resumeData.experience.map((exp, index) => (
          <div key={exp.id} className="bg-white p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YYYY"
                  disabled={exp.current}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Currently work here</label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your role and responsibilities..."
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Achievements (one per line)
              </label>
              <textarea
                value={exp.achievements.join('\n')}
                onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value.split('\n').filter(a => a.trim()))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="• Increased sales by 25%&#10;• Led a team of 5 developers&#10;• Implemented new process that saved 10 hours/week"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <button
            type="button"
            onClick={addEducation}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Education
          </button>
        </div>
        {resumeData.education.map((edu, index) => (
          <div key={edu.id} className="bg-white p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Date</label>
                <input
                  type="text"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GPA (optional)</label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Honors (optional)</label>
                <input
                  type="text"
                  value={edu.honors}
                  onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Magna Cum Laude, Dean's List, etc."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <button
            type="button"
            onClick={addProject}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Project
          </button>
        </div>
        {resumeData.projects.map((proj, index) => (
          <div key={proj.id} className="bg-white p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeProject(proj.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                <input
                  type="url"
                  value={proj.url || ''}
                  onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Link</label>
                <input
                  type="url"
                  value={proj.github || ''}
                  onChange={(e) => updateProject(proj.id, 'github', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the project..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                <input
                  type="text"
                  value={proj.technologies.join(', ')}
                  onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="React, Node.js, etc."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Sections (Languages, Certifications, etc.) */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Additional Sections</h3>
          <button
            type="button"
            onClick={addAdditionalSection}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Section
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(resumeData.additionalSections || []).map(section => (
            <div key={section.id} className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{section.title}</span>
                <button
                  type="button"
                  onClick={() => removeAdditionalSection(section.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => updateAdditionalSectionItem(section.id, idx, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Item"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalSectionItem(section.id, idx)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addAdditionalSectionItem(section.id)}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  Add Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Resume
        </button>
      </div>
    </form>
  );
};
