// ResumeForm: Main form for creating and editing resumes
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from 'react-spring';
import { Transition } from '@headlessui/react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  PlusIcon, 
  XMarkIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  CubeIcon,
  InformationCircleIcon,
  EllipsisVerticalIcon,
  SparklesIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { 
  UserIcon as UserIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  CodeBracketIcon as CodeBracketIconSolid,
  CubeIcon as CubeIconSolid,
  InformationCircleIcon as InformationCircleIconSolid
} from '@heroicons/react/24/solid';
import toast, { Toaster } from 'react-hot-toast';
import { ResumeData, PersonalInfo, Experience, Education, Skill, Project, AdditionalSection } from '@/types/resume';
import { generateResumeId } from '@/utils/storage';

// Default skill categories
const DEFAULT_SKILL_CATEGORIES = ['Software', 'Technologies & Frameworks', 'General'];

// Section configuration for order and renaming
const DEFAULT_SECTIONS = [
  { 
    key: 'personal', 
    label: 'Personal Information', 
    icon: <UserIconSolid className="w-5 h-5 text-orange-500" />,
    outlineIcon: <UserIcon className="w-5 h-5" />,
    gradient: 'from-orange-400 to-pink-500',
    bgColor: 'bg-gradient-to-r from-orange-50 to-pink-50',
    borderColor: 'border-orange-200'
  },
  { 
    key: 'skills', 
    label: 'Skills', 
    icon: <CodeBracketIconSolid className="w-5 h-5 text-emerald-500" />,
    outlineIcon: <CodeBracketIcon className="w-5 h-5" />,
    gradient: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-gradient-to-r from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200'
  },
  { 
    key: 'experience', 
    label: 'Work Experience', 
    icon: <BriefcaseIconSolid className="w-5 h-5 text-blue-500" />,
    outlineIcon: <BriefcaseIcon className="w-5 h-5" />,
    gradient: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200'
  },
  { 
    key: 'education', 
    label: 'Education', 
    icon: <AcademicCapIconSolid className="w-5 h-5 text-purple-500" />,
    outlineIcon: <AcademicCapIcon className="w-5 h-5" />,
    gradient: 'from-purple-400 to-violet-500',
    bgColor: 'bg-gradient-to-r from-purple-50 to-violet-50',
    borderColor: 'border-purple-200'
  },
  { 
    key: 'projects', 
    label: 'Projects', 
    icon: <CubeIconSolid className="w-5 h-5 text-rose-500" />,
    outlineIcon: <CubeIcon className="w-5 h-5" />,
    gradient: 'from-rose-400 to-pink-500',
    bgColor: 'bg-gradient-to-r from-rose-50 to-pink-50',
    borderColor: 'border-rose-200'
  },
  { 
    key: 'additional', 
    label: 'Additional Information', 
    icon: <InformationCircleIconSolid className="w-5 h-5 text-amber-500" />,
    outlineIcon: <InformationCircleIcon className="w-5 h-5" />,
    gradient: 'from-amber-400 to-orange-500',
    bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
    borderColor: 'border-amber-200'
  },
];

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

  // --- Section Order and Renaming ---
  const [sections, setSections] = useState(
    DEFAULT_SECTIONS
  );

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    setSections(prev => {
      const arr = [...prev];
      const t = dir === 'up' ? idx - 1 : idx + 1;
      if (t < 0 || t >= arr.length) return arr;
      [arr[idx], arr[t]] = [arr[t], arr[idx]];
      return arr;
    });
  };
  const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
  const [renameModal, setRenameModal] = useState<{ open: boolean, idx: number | null }>({ open: false, idx: null });
  const [renameValue, setRenameValue] = useState('');
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);
  const threeDotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Close menu on outside click or re-click
  useEffect(() => {
    if (menuOpenIdx === null) return;
    function handleClick(e: MouseEvent) {
      if (menuOpenIdx === null) return;
      const menu = menuRefs.current[menuOpenIdx!];
      const btn = threeDotRefs.current[menuOpenIdx!];
      if (menu && btn && !menu.contains(e.target as Node) && !btn.contains(e.target as Node)) {
        setMenuOpenIdx(null);
      }
      // If click is on the three-dot button, close menu
      if (btn && btn.contains(e.target as Node)) {
        setMenuOpenIdx(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpenIdx]);

  const openMenu = (idx: number) => setMenuOpenIdx(idx);
  const closeMenu = () => setMenuOpenIdx(null);

  const handleRename = (idx: number) => {
    setRenameValue(sections[idx].label);
    setRenameModal({ open: true, idx });
    closeMenu();
  };
  const handleRenameSubmit = () => {
    if (renameModal.idx !== null && renameValue.trim()) {
      setSections(prev => prev.map((s, i) => i === renameModal.idx ? { ...s, label: renameValue.trim() } : s));
    }
    setRenameModal({ open: false, idx: null });
  };
  const handleRenameCancel = () => setRenameModal({ open: false, idx: null });

  // --- Form Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(resumeData);
  };
  // --- Render ---
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        }}
      />      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-8 relative overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-pulse" />
            
            <div className="relative">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-4 mb-6"
              >
                <div className="relative">
                  <Image 
                    src="/images/header.png" 
                    alt="BayForm" 
                    width={64} 
                    height={64} 
                    className="h-16 w-auto rounded-2xl shadow-lg" 
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute -top-1 -right-1"
                  >
                    <SparklesIcon className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </div>
                <div>
                  <motion.h1 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Resume Builder
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-gray-600 mt-1"
                  >
                    Create your professional resume with style ✨
                  </motion.p>
                </div>
              </motion.div>
              
              {/* Resume Name */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="max-w-md"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <HeartIcon className="w-4 h-4 text-red-400" />
                  Resume Name *
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={resumeData.name}
                    onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-400 group-hover:border-gray-300"
                    placeholder="e.g., John Doe - Software Engineer"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
              {sections.map((section, idx) => (
                <motion.div
                  key={section.key}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.95 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden relative group hover:shadow-2xl transition-all duration-500"
                >
                  {/* Animated border */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`} />
                  
                  {/* Header + Dropdown wrapper with extended background */}
                  <div className={`flex items-center justify-between relative ${section.bgColor} border-b border-white/30`}>
                    <motion.button
                      type="button"
                      onClick={() => {
                        toggleSection(section.key as any);
                        toast.success(`${collapsedSections[section.key as keyof typeof collapsedSections] ? 'Expanded' : 'Collapsed'} ${section.label}`, {
                          icon: collapsedSections[section.key as keyof typeof collapsedSections] ? '👁️' : '👀',
                        });
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full px-8 py-6 flex items-center justify-between transition-all duration-300 focus:outline-none group/button relative overflow-hidden"
                    >
                      {/* Button background animation */}
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-0 group-hover/button:opacity-10 transition-opacity duration-300`}
                        layoutId={`bg-${section.key}`}
                      />
                      
                      <div className="flex items-center space-x-4 relative z-10">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="relative"
                        >
                          {section.icon}
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-full bg-current opacity-20"
                          />
                        </motion.div>
                        
                        <div className="text-left">
                          <motion.h3 
                            className="text-xl font-bold text-gray-900 group-hover/button:text-gray-800 transition-colors"
                            layoutId={`title-${section.key}`}
                          >
                            {section.label}
                          </motion.h3>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 mt-1"
                          >
                            {section.key === 'personal' && (
                              <span className="text-sm text-amber-600 font-medium bg-amber-100 px-3 py-1 rounded-full">Required fields</span>
                            )}
                            {section.key === 'skills' && (
                              <span className="text-sm text-emerald-600 font-medium bg-emerald-100 px-3 py-1 rounded-full">Organize by category</span>
                            )}
                            {section.key === 'experience' && (
                              <span className="text-sm text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">
                                {resumeData.experience.length} {resumeData.experience.length === 1 ? 'position' : 'positions'}
                              </span>
                            )}
                            {section.key === 'education' && (
                              <span className="text-sm text-purple-600 font-medium bg-purple-100 px-3 py-1 rounded-full">
                                {resumeData.education.length} {resumeData.education.length === 1 ? 'entry' : 'entries'}
                              </span>
                            )}
                            {section.key === 'projects' && (
                              <span className="text-sm text-rose-600 font-medium bg-rose-100 px-3 py-1 rounded-full">
                                {resumeData.projects.length} {resumeData.projects.length === 1 ? 'project' : 'projects'}
                              </span>
                            )}
                            {section.key === 'additional' && (
                              <span className="text-sm text-amber-600 font-medium bg-amber-100 px-3 py-1 rounded-full">Languages, Certifications, etc.</span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ 
                          rotate: collapsedSections[section.key as keyof typeof collapsedSections] ? 0 : 180 
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative z-10"
                      >
                        <ChevronDownIcon className="w-6 h-6 text-gray-500 group-hover/button:text-gray-700 transition-colors" />
                      </motion.div>
                    </motion.button>
                    
                    {section.key !== 'personal' && (
                      <div className="relative pr-4" ref={el => { menuRefs.current[idx] = el; }}>
                        <motion.button
                          type="button"
                          ref={el => { threeDotRefs.current[idx] = el; }}
                          onClick={() => {
                            setMenuOpenIdx(menuOpenIdx === idx ? null : idx);
                            if (menuOpenIdx !== idx) {
                              toast.success('Section menu opened', { icon: '⚙️' });
                            }
                          }}
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 text-gray-500 hover:text-gray-800 focus:outline-none rounded-xl hover:bg-white/50 transition-all duration-300"
                        >
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </motion.button>
                        
                        <AnimatePresence>
                          {menuOpenIdx === idx && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className={`absolute right-0 top-full mt-2 w-48 ${section.bgColor} border border-white/30 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-lg`}
                            >
                              <motion.button
                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', x: 4 }}
                                className={`block w-full text-left px-4 py-3 text-sm transition-all duration-200 ${idx === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900'}`}
                                onClick={() => { 
                                  if (idx > 0) { 
                                    moveSection(idx, 'up'); 
                                    closeMenu(); 
                                    toast.success('Section moved up!', { icon: '⬆️' });
                                  } 
                                }}
                                disabled={idx === 0}
                              >
                                ⬆️ Move Up
                              </motion.button>
                              <motion.button
                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', x: 4 }}
                                className={`block w-full text-left px-4 py-3 text-sm transition-all duration-200 ${idx === sections.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900'}`}
                                onClick={() => { 
                                  if (idx < sections.length - 1) { 
                                    moveSection(idx, 'down'); 
                                    closeMenu(); 
                                    toast.success('Section moved down!', { icon: '⬇️' });
                                  } 
                                }}
                                disabled={idx === sections.length - 1}
                              >
                                ⬇️ Move Down
                              </motion.button>
                              <motion.button
                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', x: 4 }}
                                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-gray-900 transition-all duration-200"
                                onClick={() => {
                                  handleRename(idx);
                                  toast.success('Rename dialog opened', { icon: '✏️' });
                                }}
                              >
                                ✏️ Rename
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {!collapsedSections[section.key as keyof typeof collapsedSections] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <motion.div 
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="p-8 bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-sm"
                        >                          {/* Section content rendering logic remains the same, just with updated styling */}
                          {section.key === 'personal' && (
                            <PersonalInfoSection 
                              resumeData={resumeData} 
                              updatePersonalInfo={updatePersonalInfo} 
                            />
                          )}
                          {section.key === 'skills' && (
                            <SkillsSection 
                              resumeData={resumeData}
                              skillCategories={skillCategories}
                              addSkillCategory={addSkillCategory}
                              removeSkillCategory={removeSkillCategory}
                              addSkill={addSkill}
                              updateSkill={updateSkill}
                              removeSkill={removeSkill}
                              DEFAULT_SKILL_CATEGORIES={DEFAULT_SKILL_CATEGORIES}
                            />
                          )}
                          {section.key === 'experience' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                              <motion.div className="flex justify-between items-center mb-8">
                                <p className="text-gray-600 flex items-center gap-2">
                                  <BriefcaseIcon className="w-5 h-5 text-blue-500" />
                                  Add your work experience in reverse chronological order.
                                </p>
                                <motion.button
                                  type="button"
                                  onClick={() => {
                                    addExperience();
                                    toast.success('New experience added!', { icon: '💼' });
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-semibold shadow-lg"
                                >
                                  <PlusIcon className="w-5 h-5 mr-2" />
                                  Add Experience
                                </motion.button>
                              </motion.div>
                              <div className="space-y-6">
                                <AnimatePresence>
                                  {resumeData.experience.map((exp, index) => (
                                    <motion.div
                                      key={exp.id}
                                      layout
                                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="bg-gradient-to-br from-white/80 to-blue-50/50 border-2 border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                                    >
                                      <div className="flex justify-between items-start mb-6">
                                        <motion.h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                          <span className="text-blue-500">🏢</span>
                                          Experience #{index + 1}
                                        </motion.h4>
                                        <motion.button
                                          type="button"
                                          onClick={() => {
                                            removeExperience(exp.id);
                                            toast.success('Experience removed!', { icon: '🗑️' });
                                          }}
                                          whileHover={{ scale: 1.1, rotate: 90 }}
                                          whileTap={{ scale: 0.9 }}
                                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                                        >
                                          <XMarkIcon className="w-5 h-5" />
                                        </motion.button>
                                      </div>
                                      {/* Experience form fields with enhanced styling */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {[
                                          { field: 'position', label: 'Job Title', placeholder: 'Software Engineer' },
                                          { field: 'company', label: 'Company', placeholder: 'Tech Company Inc.' },
                                          { field: 'location', label: 'Location', placeholder: 'New York, NY' },
                                        ].map((fieldConfig) => (
                                          <div key={fieldConfig.field} className="relative group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                              {fieldConfig.label}
                                            </label>
                                            <input
                                              type="text"
                                              value={exp[fieldConfig.field as keyof Experience] as string}
                                              onChange={(e) => updateExperience(exp.id, fieldConfig.field as keyof Experience, e.target.value)}
                                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                                              placeholder={fieldConfig.placeholder}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                          </div>
                                        ))}                                        <div className="flex items-center space-x-3 mt-6">
                                          <input
                                            type="checkbox"
                                            checked={exp.current}
                                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                          />
                                          <label className="text-sm font-medium text-gray-700">Currently work here</label>
                                        </div>
                                        <div className="relative group">
                                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Start Date
                                          </label>
                                          <input
                                            type="text"
                                            value={exp.startDate}
                                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                                            placeholder="MM/YYYY"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </div>
                                        <div className="relative group">
                                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            End Date
                                          </label>
                                          <input
                                            type="text"
                                            value={exp.endDate}
                                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm disabled:bg-gray-100"
                                            placeholder="MM/YYYY"
                                            disabled={exp.current}
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </div>
                                      </div>
                                      <div className="mb-4 relative group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
                                        <textarea
                                          value={exp.description}
                                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                          rows={3}
                                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                                          placeholder="Describe your role and responsibilities..."
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                      </div>
                                      <div className="relative group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                          Key Achievements
                                          <span className="text-xs text-gray-500 ml-1">(one per line)</span>
                                        </label>
                                        <textarea
                                          value={exp.achievements.join('\n')}
                                          onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value.split('\n').filter(a => a.trim()))}
                                          rows={4}
                                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                                          placeholder="• Increased sales by 25%&#10;• Led a team of 5 developers&#10;• Implemented new process that saved 10 hours/week"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                      </div>
                                      {/* Continue with description and achievements fields... */}
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                                {resumeData.experience.length === 0 && (
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 text-gray-500"
                                  >
                                    <motion.div
                                      animate={{ 
                                        y: [0, -10, 0],
                                        scale: [1, 1.1, 1]
                                      }}
                                      transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                      }}
                                    >
                                      <BriefcaseIcon className="mx-auto w-16 h-16 mb-4 text-gray-300" />
                                    </motion.div>
                                    <p className="text-lg">No work experience added yet</p>
                                    <p className="text-sm mt-2">Click "Add Experience" to get started ✨</p>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>                          )}
                          {section.key === 'education' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                              <motion.div className="flex justify-between items-center mb-8">
                                <p className="text-gray-600 flex items-center gap-2">
                                  <AcademicCapIcon className="w-5 h-5 text-purple-500" />
                                  Add your educational background.
                                </p>
                                <motion.button
                                  type="button"
                                  onClick={() => {
                                    addEducation();
                                    toast.success('New education added!', { icon: '🎓' });
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-600 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 font-semibold shadow-lg"
                                >
                                  <PlusIcon className="w-5 h-5 mr-2" />
                                  Add Education
                                </motion.button>
                              </motion.div>
                              <div className="space-y-6">
                                <AnimatePresence>
                                  {resumeData.education.map((edu, index) => (
                                    <motion.div
                                      key={edu.id}
                                      layout
                                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="bg-gradient-to-br from-white/80 to-purple-50/50 border-2 border-purple-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                                    >
                                      <div className="flex justify-between items-start mb-6">
                                        <motion.h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                          <span className="text-purple-500">🎓</span>
                                          Education #{index + 1}
                                        </motion.h4>
                                        <motion.button
                                          type="button"
                                          onClick={() => {
                                            removeEducation(edu.id);
                                            toast.success('Education removed!', { icon: '🗑️' });
                                          }}
                                          whileHover={{ scale: 1.1, rotate: 90 }}
                                          whileTap={{ scale: 0.9 }}
                                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                                        >
                                          <XMarkIcon className="w-5 h-5" />
                                        </motion.button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                          { field: 'institution', label: 'Institution', placeholder: 'University Name' },
                                          { field: 'degree', label: 'Degree', placeholder: "Bachelor's, Master's, etc." },
                                          { field: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
                                          { field: 'graduationDate', label: 'Graduation Date', placeholder: 'MM/YYYY' },
                                          { field: 'gpa', label: 'GPA (optional)', placeholder: '3.8' },
                                          { field: 'honors', label: 'Honors (optional)', placeholder: 'Magna Cum Laude, Dean\'s List, etc.' },
                                        ].map((fieldConfig) => (
                                          <div key={fieldConfig.field} className="relative group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                              {fieldConfig.label}
                                            </label>
                                            <input
                                              type="text"
                                              value={edu[fieldConfig.field as keyof Education] as string}
                                              onChange={(e) => updateEducation(edu.id, fieldConfig.field as keyof Education, e.target.value)}
                                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                                              placeholder={fieldConfig.placeholder}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                                {resumeData.education.length === 0 && (
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 text-gray-500"
                                  >
                                    <motion.div
                                      animate={{ 
                                        y: [0, -10, 0],
                                        scale: [1, 1.1, 1]
                                      }}
                                      transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                      }}
                                    >
                                      <AcademicCapIcon className="mx-auto w-16 h-16 mb-4 text-gray-300" />
                                    </motion.div>
                                    <p className="text-lg">No education added yet</p>
                                    <p className="text-sm mt-2">Click "Add Education" to get started ✨</p>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          )}
                          {section.key === 'projects' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                              <motion.div className="flex justify-between items-center mb-8">
                                <p className="text-gray-600 flex items-center gap-2">
                                  <CubeIcon className="w-5 h-5 text-rose-500" />
                                  Showcase your notable projects and achievements.
                                </p>
                                <motion.button
                                  type="button"
                                  onClick={() => {
                                    addProject();
                                    toast.success('New project added!', { icon: '🚀' });
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition-all duration-300 font-semibold shadow-lg"
                                >
                                  <PlusIcon className="w-5 h-5 mr-2" />
                                  Add Project
                                </motion.button>
                              </motion.div>
                              <div className="space-y-6">
                                <AnimatePresence>
                                  {resumeData.projects.map((proj, index) => (
                                    <motion.div
                                      key={proj.id}
                                      layout
                                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="bg-gradient-to-br from-white/80 to-rose-50/50 border-2 border-rose-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                                    >
                                      <div className="flex justify-between items-start mb-6">
                                        <motion.h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                          <span className="text-rose-500">🚀</span>
                                          Project #{index + 1}
                                        </motion.h4>
                                        <motion.button
                                          type="button"
                                          onClick={() => {
                                            removeProject(proj.id);
                                            toast.success('Project removed!', { icon: '🗑️' });
                                          }}
                                          whileHover={{ scale: 1.1, rotate: 90 }}
                                          whileTap={{ scale: 0.9 }}
                                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                                        >
                                          <XMarkIcon className="w-5 h-5" />
                                        </motion.button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {[
                                          { field: 'name', label: 'Project Name', placeholder: 'My Awesome Project' },
                                          { field: 'technologies', label: 'Technologies Used', placeholder: 'React, Node.js, MongoDB' },
                                          { field: 'url', label: 'Live URL', placeholder: 'https://myproject.com' },
                                          { field: 'github', label: 'GitHub Repository', placeholder: 'https://github.com/username/repo' },
                                        ].map((fieldConfig) => (
                                          <div key={fieldConfig.field} className="relative group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                              {fieldConfig.label}
                                            </label>
                                            <input
                                              type={fieldConfig.field === 'url' || fieldConfig.field === 'github' ? 'url' : 'text'}
                                              value={
                                                fieldConfig.field === 'technologies' 
                                                  ? proj.technologies.join(', ')
                                                  : (proj[fieldConfig.field as keyof Project] as string) || ''
                                              }
                                              onChange={(e) => updateProject(proj.id, fieldConfig.field as keyof Project, e.target.value)}
                                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                                              placeholder={fieldConfig.placeholder}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                          </div>
                                        ))}
                                      </div>
                                      <div className="relative group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                          Project Description
                                        </label>
                                        <textarea
                                          value={proj.description}
                                          onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                          rows={3}
                                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                                          placeholder="Brief description of the project, its purpose, and key features..."
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                      </div>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                                {resumeData.projects.length === 0 && (
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 text-gray-500"
                                  >
                                    <motion.div
                                      animate={{ 
                                        y: [0, -10, 0],
                                        scale: [1, 1.1, 1]
                                      }}
                                      transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                      }}
                                    >
                                      <CubeIcon className="mx-auto w-16 h-16 mb-4 text-gray-300" />
                                    </motion.div>
                                    <p className="text-lg">No projects added yet</p>
                                    <p className="text-sm mt-2">Click "Add Project" to get started ✨</p>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          )}
                          {section.key === 'additional' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                              <motion.div className="flex justify-between items-center mb-8">
                                <p className="text-gray-600 flex items-center gap-2">
                                  <InformationCircleIcon className="w-5 h-5 text-amber-500" />
                                  Add languages, certifications, and other relevant information.
                                </p>
                                <motion.button
                                  type="button"
                                  onClick={() => {
                                    addAdditionalSection();
                                    toast.success('New section added!', { icon: '📝' });
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 font-semibold shadow-lg"
                                >
                                  <PlusIcon className="w-5 h-5 mr-2" />
                                  Add Section
                                </motion.button>
                              </motion.div>
                              <motion.div 
                                layout
                                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                              >
                                <AnimatePresence>
                                  {(resumeData.additionalSections || []).map((additionalSection, index) => (
                                    <motion.div
                                      key={additionalSection.id}
                                      layout
                                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="bg-gradient-to-br from-white/80 to-amber-50/50 border-2 border-amber-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                                    >
                                      <div className="flex justify-between items-center mb-4">
                                        <motion.h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                          <span className="text-amber-500">📋</span>
                                          {additionalSection.title}
                                        </motion.h4>
                                        <motion.button
                                          type="button"
                                          onClick={() => {
                                            removeAdditionalSection(additionalSection.id);
                                            toast.success('Section removed!', { icon: '🗑️' });
                                          }}
                                          whileHover={{ scale: 1.1, rotate: 90 }}
                                          whileTap={{ scale: 0.9 }}
                                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                                        >
                                          <XMarkIcon className="w-5 h-5" />
                                        </motion.button>
                                      </div>
                                      
                                      <div className="space-y-3 mb-4">
                                        <AnimatePresence>
                                          {additionalSection.items.map((item, itemIndex) => (
                                            <motion.div
                                              key={itemIndex}
                                              initial={{ opacity: 0, x: -10 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              exit={{ opacity: 0, x: 10 }}
                                              transition={{ delay: itemIndex * 0.05 }}
                                              className="flex items-center space-x-3 group/item"
                                            >
                                              <div className="relative flex-1">
                                                <input
                                                  type="text"
                                                  value={item}
                                                  onChange={e => updateAdditionalSectionItem(additionalSection.id, itemIndex, e.target.value)}
                                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-sm bg-white/70 backdrop-blur-sm"
                                                  placeholder="Enter item"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                              </div>
                                              <motion.button
                                                type="button"
                                                onClick={() => {
                                                  removeAdditionalSectionItem(additionalSection.id, itemIndex);
                                                  toast.success('Item removed!', { icon: '❌' });
                                                }}
                                                whileHover={{ scale: 1.1, rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover/item:opacity-100"
                                              >
                                                <XMarkIcon className="w-4 h-4" />
                                              </motion.button>
                                            </motion.div>
                                          ))}
                                        </AnimatePresence>
                                      </div>
                                      
                                      <motion.button
                                        type="button"
                                        onClick={() => {
                                          addAdditionalSectionItem(additionalSection.id);
                                          toast.success('New item added!', { icon: '➕' });
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-xl hover:from-amber-200 hover:to-orange-200 transition-all duration-300 text-sm font-semibold border-2 border-amber-200 hover:border-amber-300"
                                      >
                                        + Add Item
                                      </motion.button>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </motion.div>
                              {(!resumeData.additionalSections || resumeData.additionalSections.length === 0) && (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-center py-12 text-gray-500"
                                >
                                  <motion.div
                                    animate={{ 
                                      y: [0, -10, 0],
                                      scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  >
                                    <InformationCircleIcon className="mx-auto w-16 h-16 mb-4 text-gray-300" />
                                  </motion.div>
                                  <p className="text-lg">No additional sections added yet</p>
                                  <p className="text-sm mt-2">Click "Add Section" to get started ✨</p>
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                          {/* Add similar enhanced styling for education, projects, and additional sections */}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8"
            >
              <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.button
                  type="button"
                  onClick={onCancel}
                  whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  ✨ Save Resume
                </motion.button>
              </div>
            </motion.div>
          </form>

          {/* Enhanced Rename Modal */}
          <AnimatePresence>
            {renameModal.open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20"
                >
                  <motion.h2 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2"
                  >
                    ✏️ Rename Section
                  </motion.h2>
                  <motion.input
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    type="text"
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    autoFocus
                    placeholder="Enter new section name..."
                  />
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-end space-x-4"
                  >
                    <motion.button 
                      onClick={handleRenameCancel} 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      onClick={handleRenameSubmit} 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
                    >
                      Save
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

// Enhanced Personal Info Section Component
const PersonalInfoSection: React.FC<{
  resumeData: ResumeData;
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
}> = ({ resumeData, updatePersonalInfo }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="md:col-span-2"
    >
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <UserIcon className="w-4 h-4 text-orange-500" />
        Full Name *
      </label>
      <div className="relative group">
        <input
          type="text"
          value={resumeData.personalInfo.fullName}
          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
          placeholder="John Doe"
          required
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>    </motion.div>
    
    {[
      { field: 'email', label: 'Email Address', type: 'email', placeholder: 'john.doe@example.com', required: true, icon: '📧' },
      { field: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(555) 123-4567', required: true, icon: '📱' },
      { field: 'location', label: 'Location', type: 'text', placeholder: 'City, State', required: true, icon: '📍' },
      { field: 'linkedIn', label: 'LinkedIn Profile', type: 'url', placeholder: 'https://linkedin.com/in/johndoe', required: false, icon: '💼' },
      { field: 'website', label: 'Website/Portfolio', type: 'url', placeholder: 'https://johndoe.com', required: false, icon: '🌐' },
    ].map((fieldConfig, index) => (
      <motion.div 
        key={fieldConfig.field}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + index * 0.05 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>{fieldConfig.icon}</span>
          {fieldConfig.label} {fieldConfig.required && '*'}
        </label>
        <div className="relative group">
          <input
            type={fieldConfig.type}
            value={resumeData.personalInfo[fieldConfig.field as keyof PersonalInfo]}
            onChange={(e) => updatePersonalInfo(fieldConfig.field as keyof PersonalInfo, e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            placeholder={fieldConfig.placeholder}
            required={fieldConfig.required}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// Enhanced Skills Section Component
const SkillsSection: React.FC<{
  resumeData: ResumeData;
  skillCategories: string[];
  addSkillCategory: () => void;
  removeSkillCategory: (cat: string) => void;
  addSkill: (category: string) => void;
  updateSkill: (id: string, value: string) => void;
  removeSkill: (id: string) => void;
  DEFAULT_SKILL_CATEGORIES: string[];
}> = ({ 
  resumeData, 
  skillCategories, 
  addSkillCategory, 
  removeSkillCategory, 
  addSkill, 
  updateSkill, 
  removeSkill, 
  DEFAULT_SKILL_CATEGORIES 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-8"
    >
      <p className="text-gray-600 flex items-center gap-2">
        <CodeBracketIcon className="w-5 h-5 text-emerald-500" />
        Organize your skills into categories for better presentation.
      </p>
      <motion.button
        type="button"
        onClick={() => {
          addSkillCategory();
          toast.success('New skill category added!', { icon: '🎯' });
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 font-semibold shadow-lg"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Category
      </motion.button>
    </motion.div>
    
    <motion.div 
      layout
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {skillCategories.map((category, index) => (
          <motion.div
            key={category}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/80 to-emerald-50/50 border-2 border-emerald-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm group"
          >
            <div className="flex justify-between items-center mb-4">
              <motion.h4 
                className="font-bold text-gray-900 capitalize text-lg flex items-center gap-2"
                layoutId={`category-${category}`}
              >
                <span className="text-emerald-500">💻</span>
                {category.replace(/\b\w/g, c => c.toUpperCase())}
              </motion.h4>
              {!DEFAULT_SKILL_CATEGORIES.includes(category) && (
                <motion.button
                  type="button"
                  onClick={() => {
                    removeSkillCategory(category);
                    toast.success('Skill category removed!', { icon: '🗑️' });
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              )}
            </div>
            
            <div className="space-y-3 mb-4">
              <AnimatePresence>
                {resumeData.skills.filter(skill => skill.category === category).map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: skillIndex * 0.05 }}
                    className="flex items-center space-x-3 group/skill"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={e => updateSkill(skill.id, e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-sm bg-white/70 backdrop-blur-sm"
                        placeholder="Enter skill"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => {
                        removeSkill(skill.id);
                        toast.success('Skill removed!', { icon: '❌' });
                      }}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover/skill:opacity-100"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <motion.button
              type="button"
              onClick={() => {
                addSkill(category);
                toast.success('New skill added!', { icon: '⭐' });
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-xl hover:from-emerald-200 hover:to-teal-200 transition-all duration-300 text-sm font-semibold border-2 border-emerald-200 hover:border-emerald-300"
            >
              + Add Skill
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  </motion.div>
);
