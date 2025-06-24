// ResumeForm: Main form for creating and editing resumes
import React, { useState } from 'react';
import Image from 'next/image';
import { ResumeData, PersonalInfo, Experience, Education, Skill, Project, AdditionalSection } from '@/types/resume';
import { generateResumeId } from '@/utils/storage';
import { FaChevronDown, FaChevronUp, FaPlus, FaTimes, FaUser, FaBriefcase, FaGraduationCap, FaCode, FaProjectDiagram, FaInfoCircle } from 'react-icons/fa';

// Default skill categories
const DEFAULT_SKILL_CATEGORIES = ['Software', 'Technologies & Frameworks', 'General'];

// Props for the ResumeForm component
interface ResumeFormProps {
  initialData?: ResumeData;
  onSave: (resume: ResumeData) => void;
  onCancel: () => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ initialData, onSave, onCancel }) => {
  // --- State Management ---
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
        summary: ''
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

  // --- Section Collapse State ---
  const [collapsedSections, setCollapsedSections] = useState({
    personal: false,
    skills: false,
    experience: false,
    education: false,
    projects: false,
    additional: false
  });
  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // --- Personal Info Helpers ---
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // --- Experience Helpers ---
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

  // --- Education Helpers ---
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
  const [skillCategories, setSkillCategories] = useState<string[]>([...DEFAULT_SKILL_CATEGORIES]);
  // Ensure all categories in resumeData.skills are present in skillCategories
  React.useEffect(() => {
    const allCategories = [
      ...DEFAULT_SKILL_CATEGORIES,
      ...resumeData.skills.map(skill => skill.category)
    ];
    const uniqueCategories = Array.from(new Set(allCategories));
    if (uniqueCategories.length !== skillCategories.length || uniqueCategories.some(cat => !skillCategories.includes(cat))) {
      setSkillCategories(uniqueCategories);
    }
  }, [resumeData.skills, skillCategories]);
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
  // --- Skill Helpers ---
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

  // --- Additional Sections Helpers ---
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

  // --- Default Additional Sections Initialization ---
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

  // --- Form Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(resumeData);
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">          <div className="flex items-center space-x-4 mb-4">
            <Image src="/images/header.png" alt="BayForm" width={56} height={56} className="h-14 w-auto" />
            <div>
              <p className="text-gray-600">Create your professional resume by filling out the sections below.</p>
            </div>
          </div>
          
          {/* Resume Name */}
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Name *
            </label>
            <input
              type="text"
              value={resumeData.name}
              onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="e.g., John Doe - Software Engineer"
              required
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('personal')}
              className="w-full px-6 py-4 bg-orange-50 border-b border-gray-200 flex items-center justify-between hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FaUser className="text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <span className="text-sm text-gray-500">Required fields</span>
              </div>
              {collapsedSections.personal ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            
            {!collapsedSections.personal && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="City, State"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.linkedIn}
                      onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website/Portfolio
                    </label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.website}
                      onChange={(e) => updatePersonalInfo('website', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="https://johndoe.com"
                    />
                  </div>
                </div>
              </div>
            )}          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('skills')}
              className="w-full px-6 py-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FaCode className="text-slate-800" />
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                <span className="text-sm text-gray-500">Organize by category</span>
              </div>
              {collapsedSections.skills ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            
            {!collapsedSections.skills && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Organize your skills into categories for better presentation.</p>
                  <button
                    type="button"
                    onClick={addSkillCategory}
                    className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                  >
                    <FaPlus className="mr-2 text-sm" />
                    Add Category
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {skillCategories.map(category => (
                    <div key={category} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {category.replace(/\b\w/g, c => c.toUpperCase())}
                        </h4>
                        {!DEFAULT_SKILL_CATEGORIES.includes(category) && (
                          <button
                            type="button"
                            onClick={() => removeSkillCategory(category)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {resumeData.skills.filter(skill => skill.category === category).map(skill => (
                          <div key={skill.id} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={e => updateSkill(skill.id, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm"
                              placeholder="Enter skill"
                            />
                            <button
                              type="button"
                              onClick={() => removeSkill(skill.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => addSkill(category)}
                        className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
                      >
                        + Add Skill
                      </button>
                    </div>
                  ))}
                </div>
              </div>            )}
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('experience')}
              className="w-full px-6 py-4 bg-orange-50 border-b border-gray-200 flex items-center justify-between hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FaBriefcase className="text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                <span className="text-sm text-gray-500">
                  {resumeData.experience.length} {resumeData.experience.length === 1 ? 'position' : 'positions'}
                </span>
              </div>
              {collapsedSections.experience ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            
            {!collapsedSections.experience && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Add your work experience in reverse chronological order.</p>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  >
                    <FaPlus className="mr-2 text-sm" />
                    Add Experience
                  </button>
                </div>
                
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-900">Experience #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            placeholder="Software Engineer"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            placeholder="Tech Company Inc."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            placeholder="New York, NY"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label className="text-sm font-medium text-gray-700">Currently work here</label>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            placeholder="MM/YYYY"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors disabled:bg-gray-100"
                            placeholder="MM/YYYY"
                            disabled={exp.current}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="Describe your role and responsibilities..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Key Achievements
                          <span className="text-xs text-gray-500 ml-1">(one per line)</span>
                        </label>
                        <textarea
                          value={exp.achievements.join('\n')}
                          onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value.split('\n').filter(a => a.trim()))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="• Increased sales by 25%&#10;• Led a team of 5 developers&#10;• Implemented new process that saved 10 hours/week"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {resumeData.experience.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaBriefcase className="mx-auto text-4xl mb-4 text-gray-300" />
                      <p>No work experience added yet. Click &quot;Add Experience&quot; to get started.</p>
                    </div>
                  )}
                </div>
              </div>            )}
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('education')}
              className="w-full px-6 py-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FaGraduationCap className="text-slate-800" />
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                <span className="text-sm text-gray-500">
                  {resumeData.education.length} {resumeData.education.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              {collapsedSections.education ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            
            {!collapsedSections.education && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Add your educational background.</p>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                  >
                    <FaPlus className="mr-2 text-sm" />
                    Add Education
                  </button>
                </div>
                
                <div className="space-y-6">
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-900">Education #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="University Name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="Bachelor's, Master's, etc."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="Computer Science"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Date</label>
                          <input
                            type="text"
                            value={edu.graduationDate}
                            onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="MM/YYYY"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GPA (optional)</label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="3.8"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Honors (optional)</label>
                          <input
                            type="text"
                            value={edu.honors}
                            onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="Magna Cum Laude, Dean's List, etc."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {resumeData.education.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaGraduationCap className="mx-auto text-4xl mb-4 text-gray-300" />
                      <p>No education added yet. Click &quot;Add Education&quot; to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('projects')}
              className="w-full px-6 py-4 bg-orange-50 border-b border-gray-200 flex items-center justify-between hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FaProjectDiagram className="text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                <span className="text-sm text-gray-500">
                  {resumeData.projects.length} {resumeData.projects.length === 1 ? 'project' : 'projects'}
                </span>
              </div>
              {collapsedSections.projects ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            
            {!collapsedSections.projects && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Showcase your notable projects and achievements.</p>
                  <button
                    type="button"
                    onClick={addProject}
                    className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  >
                    <FaPlus className="mr-2 text-sm" />
                    Add Project
                  </button>
                </div>
                
                <div className="space-y-6">
                  {resumeData.projects.map((proj, index) => (
                    <div key={proj.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-900">Project #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeProject(proj.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            placeholder="My Awesome Project"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                          <input
                            type="text"
                            value={proj.technologies.join(', ')}
                            onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                          <input
                            type="url"
                            value={proj.url || ''}
                            onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            placeholder="https://myproject.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository</label>
                          <input
                            type="url"
                            value={proj.github || ''}
                            onChange={(e) => updateProject(proj.id, 'github', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                            placeholder="https://github.com/username/repo"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                        <textarea
                          value={proj.description}
                          onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                          placeholder="Brief description of the project, its purpose, and key features..."
                        />
                      </div>
                    </div>
                  ))}
                  
                  {resumeData.projects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaProjectDiagram className="mx-auto text-4xl mb-4 text-gray-300" />
                      <p>No projects added yet. Click &quot;Add Project&quot; to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('additional')}
              className="w-full px-6 py-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FaInfoCircle className="text-slate-800" />
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                <span className="text-sm text-gray-500">Languages, Certifications, etc.</span>
              </div>
              {collapsedSections.additional ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            
            {!collapsedSections.additional && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">Add languages, certifications, and other relevant information.</p>
                  <button
                    type="button"
                    onClick={addAdditionalSection}
                    className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                  >
                    <FaPlus className="mr-2 text-sm" />
                    Add Section
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(resumeData.additionalSections || []).map(section => (
                    <div key={section.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">{section.title}</h4>
                        <button
                          type="button"
                          onClick={() => removeAdditionalSection(section.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={item}
                              onChange={e => updateAdditionalSectionItem(section.id, idx, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-sm"
                              placeholder="Enter item"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalSectionItem(section.id, idx)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => addAdditionalSectionItem(section.id)}
                        className="w-full px-3 py-2 bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition-colors text-sm font-medium"
                      >
                        + Add Item
                      </button>
                    </div>
                  ))}
                </div>
                
                {(!resumeData.additionalSections || resumeData.additionalSections.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <FaInfoCircle className="mx-auto text-4xl mb-4 text-gray-300" />
                    <p>No additional sections added yet. Click &quot;Add Section&quot; to get started.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
              >
                Cancel
              </button>              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors font-medium"
              >
                Save Resume</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
