// ResumeForm: Main form for creating and editing resumes
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { VerticalProgressBar } from './VerticalProgressBar';

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
        professionTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedIn: '',
        website: '',
        profilePicture: '',
        qrCode: {
          enabled: false,
          type: 'linkedin'
        }
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

  // --- Section Refs for Navigation ---
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [currentProgressStep, setCurrentProgressStep] = useState('personal');

  // --- Progress Bar Tooltip Guide ---
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);

  // Show progress bar tooltip after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgressTooltip(true);
      
      // Auto-hide the tooltip after 8 seconds
      const hideTimer = setTimeout(() => {
        setShowProgressTooltip(false);
      }, 8000);

      // Cleanup function will clear the hide timer if component unmounts
      return () => clearTimeout(hideTimer);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Hide tooltip when user clicks on progress bar
  const handleProgressTooltipDismiss = () => {
    setShowProgressTooltip(false);
  };

  // Reset current step to 'personal' when starting with new resume data
  useEffect(() => {
    if (!initialData) {
      setCurrentProgressStep('personal');
    }
  }, [initialData]);

  // --- Progress Bar Steps ---
  const progressSteps = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: <UserIcon className="w-4 h-4" />,
      gradient: 'from-orange-400 to-pink-500',
      completed: resumeData.personalInfo.fullName.trim() !== '' && resumeData.personalInfo.email.trim() !== '' && resumeData.personalInfo.professionTitle.trim() !== '',
      color: '#f97316',
      count: [resumeData.personalInfo.fullName, resumeData.personalInfo.email, resumeData.personalInfo.professionTitle].filter(item => item.trim() !== '').length,
      total: 3
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <CodeBracketIcon className="w-4 h-4" />,
      gradient: 'from-emerald-400 to-teal-500',
      completed: resumeData.skills.length > 0,
      color: '#10b981',
      count: resumeData.skills.length,
      total: 5
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: <BriefcaseIcon className="w-4 h-4" />,
      gradient: 'from-blue-400 to-indigo-500',
      completed: resumeData.experience.length > 0,
      color: '#3b82f6',
      count: resumeData.experience.length,
      total: 2
    },
    {
      id: 'education',
      label: 'Education',
      icon: <AcademicCapIcon className="w-4 h-4" />,
      gradient: 'from-purple-400 to-violet-500',
      completed: resumeData.education.length > 0,
      color: '#8b5cf6',
      count: resumeData.education.length,
      total: 1
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <CubeIcon className="w-4 h-4" />,
      gradient: 'from-rose-400 to-pink-500',
      completed: resumeData.projects.length > 0,
      color: '#ec4899',
      count: resumeData.projects.length,
      total: 2
    },
    {
      id: 'additional',
      label: 'Additional',
      icon: <InformationCircleIcon className="w-4 h-4" />,
      gradient: 'from-amber-400 to-orange-500',
      completed: (resumeData.additionalSections?.some(section => section.items.length > 0)) || false,
      color: '#f59e0b',
      count: resumeData.additionalSections?.reduce((total, section) => total + section.items.length, 0) || 0,
      total: 3
    }
  ];

  // --- Navigation Handler ---
  const handleProgressStepClick = (stepId: string) => {
    const targetRef = sectionRefs.current[stepId];
    if (targetRef) {
      targetRef.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setCurrentProgressStep(stepId);
    }
  };

  // --- Intersection Observer for Progress Tracking ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // Find the section that's most visible
        let mostVisibleEntry: IntersectionObserverEntry | undefined;
        let maxVisibilityRatio = 0;
        
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibilityRatio) {
            maxVisibilityRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        }
        
        if (mostVisibleEntry) {
          const sectionKey = (mostVisibleEntry.target as Element).getAttribute('data-section');
          if (sectionKey && sectionKey !== currentProgressStep) {
            setCurrentProgressStep(sectionKey);
          }
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9], // Multiple thresholds for better detection
        rootMargin: '-100px 0px -200px 0px'
      }
    );

    // Observe sections with a slight delay to ensure they're rendered
    const timeoutId = setTimeout(() => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [currentProgressStep]);

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

  // --- Collapse/Expand All Functionality ---
  const areAllSectionsCollapsed = () => {
    return Object.values(collapsedSections).every(collapsed => collapsed);
  };

  const areAllSectionsExpanded = () => {
    return Object.values(collapsedSections).every(collapsed => !collapsed);
  };

  const toggleAllSections = () => {
    const shouldCollapse = !areAllSectionsCollapsed();
    setCollapsedSections({
      personal: shouldCollapse,
      skills: shouldCollapse,
      experience: shouldCollapse,
      education: shouldCollapse,
      projects: shouldCollapse,
      additional: shouldCollapse
    });
    
    const action = shouldCollapse ? 'Collapsed' : 'Expanded';
    toast.success(`${action} all sections`, {
      icon: shouldCollapse ? '📁' : '📂',
      duration: 2000,
    });
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

  // --- QR Code Settings Helper ---
  const updateQRCodeSettings = (enabled: boolean, type: 'linkedin' | 'website' | 'none') => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        qrCode: { enabled, type }
      }
    }));
  };

  // --- Profile Picture Helper ---
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        updatePersonalInfo('profilePicture', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    updatePersonalInfo('profilePicture', '');
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

  // --- Sections ---
  const sections = DEFAULT_SECTIONS;

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
        containerStyle={{
          top: 80, // Account for fixed header
        }}
        toastOptions={{
          duration: 3500,
          style: {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            color: '#1e293b',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            maxWidth: '350px',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          },
          success: {
            style: {
              background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(220, 252, 231, 0.95) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#15803d',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#dcfce7',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(252, 231, 243, 0.95) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#dc2626',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fef2f2',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              color: '#475569',
            },
            iconTheme: {
              primary: '#64748b',
              secondary: '#f1f5f9',
            },
          },
        }}
      />
      
      {/* Vertical Progress Bar */}
      <VerticalProgressBar
        steps={progressSteps}
        currentStep={currentProgressStep}
        onStepClick={handleProgressStepClick}
        showTooltip={showProgressTooltip}
        onTooltipDismiss={handleProgressTooltipDismiss}
      />
      
      {/* Fixed Header - Mobile Optimized */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-md">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Image src="/images/header.png" alt="Bayform Logo" width={80} height={26} className="h-6 w-auto object-contain rounded-md flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-sm font-bold text-gray-900 leading-tight truncate">Resume Builder</h1>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <motion.button
                type="button"
                onClick={onCancel}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium touch-manipulation min-h-[44px] min-w-[60px]"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                form="resume-form"
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium shadow-lg touch-manipulation min-h-[44px]"
              >
                Save
              </motion.button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Image src="/images/header.png" alt="Bayform Logo" width={120} height={40} className="h-10 w-auto object-contain rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Resume Builder</h1>
              <p className="text-sm text-gray-600 font-medium">Create your professional resume with style</p>
            </div>
          </div>
          <div className="flex gap-4 ml-auto">
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 font-semibold"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              form="resume-form"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
               Save Resume
            </motion.button>
          </div>
        </div>
      </header>
      {/* Main Content with mobile-optimized padding */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8 pt-20 sm:pt-24"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header - Mobile Optimized */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-4 sm:p-8 mb-4 sm:mb-8 relative overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-pulse" />
            <div className="relative">
              {/* Resume Name - Mobile optimized */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-full max-w-md"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                  <HeartIcon className="w-4 h-4 text-red-400" />
                  Resume Name *
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={resumeData.name}
                    onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-400 group-hover:border-gray-300 text-base touch-manipulation"
                    placeholder="e.g., John Doe - Software Engineer"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Collapse/Expand All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-end mb-4 sm:mb-6"
          >
            <motion.button
              type="button"
              onClick={toggleAllSections}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm sm:text-base touch-manipulation"
            >
              <motion.div
                animate={{ 
                  rotate: areAllSectionsCollapsed() ? 180 : 0 
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {areAllSectionsCollapsed() ? (
                  <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </motion.div>
              <span>
                {areAllSectionsCollapsed() ? 'Expand All' : 'Collapse All'}
              </span>
            </motion.button>
          </motion.div>

          <form id="resume-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
            <AnimatePresence>
              {sections.map((section, idx) => (
                <motion.div
                  key={section.key}
                  ref={(el) => { sectionRefs.current[section.key] = el; }}
                  data-section={section.key}
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
                  
                  {/* Header + Dropdown wrapper with extended background - Mobile optimized */}
                  <div className={`flex items-center justify-between relative ${section.bgColor} border-b border-white/30`}>
                    <motion.button
                      type="button"
                      onClick={() => {
                        toggleSection(section.key as any);
                        toast.success(`${collapsedSections[section.key as keyof typeof collapsedSections] ? 'Expanded' : 'Collapsed'} ${section.label}`, {
                          icon: collapsedSections[section.key as keyof typeof collapsedSections] ? '👁️' : '👀',
                          duration: 1500,
                        });
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between transition-all duration-300 focus:outline-none group/button relative overflow-hidden touch-manipulation"
                    >
                      {/* Button background animation */}
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-0 group-hover/button:opacity-10 transition-opacity duration-300`}
                        layoutId={`bg-${section.key}`}
                      />
                      
                      <div className="flex items-center space-x-2 sm:space-x-4 relative z-10 min-w-0 flex-1">
                        <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex-shrink-0">
                          {section.icon}
                        </span>
                        <div className="text-left min-w-0 flex-1">
                          <motion.h3 
                            className="text-lg sm:text-xl font-bold text-gray-900 group-hover/button:text-gray-800 transition-colors leading-tight"
                            layoutId={`title-${section.key}`}
                          >
                            {section.label}
                          </motion.h3>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 sm:gap-4 mt-1 flex-wrap"
                          >
                            {section.key === 'personal' && (
                              <span className="text-xs sm:text-sm text-amber-600 font-medium bg-amber-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">Required fields</span>
                            )}
                            {section.key === 'skills' && (
                              <span className="text-xs sm:text-sm text-emerald-600 font-medium bg-emerald-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">Organize by category</span>
                            )}
                            {section.key === 'experience' && (
                              <span className="text-xs sm:text-sm text-blue-600 font-medium bg-blue-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                                {resumeData.experience.length} {resumeData.experience.length === 1 ? 'position' : 'positions'}
                              </span>
                            )}
                            {section.key === 'education' && (
                              <span className="text-xs sm:text-sm text-purple-600 font-medium bg-purple-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                                {resumeData.education.length} {resumeData.education.length === 1 ? 'entry' : 'entries'}
                              </span>
                            )}
                            {section.key === 'projects' && (
                              <span className="text-xs sm:text-sm text-rose-600 font-medium bg-rose-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                                {resumeData.projects.length} {resumeData.projects.length === 1 ? 'project' : 'projects'}
                              </span>
                            )}
                            {section.key === 'additional' && (
                              <span className="text-xs sm:text-sm text-amber-600 font-medium bg-amber-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">Languages, Certifications, etc.</span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ 
                          rotate: collapsedSections[section.key as keyof typeof collapsedSections] ? 0 : 180 
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative z-10 flex-shrink-0 ml-2"
                      >
                        <ChevronDownIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover/button:text-gray-700 transition-colors" />
                      </motion.div>
                    </motion.button>
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
                          className="p-4 sm:p-8 bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-sm"
                        >                          {/* Section content rendering logic remains the same, just with updated styling */}
                          {section.key === 'personal' && (
                            <PersonalInfoSection 
                              resumeData={resumeData} 
                              updatePersonalInfo={updatePersonalInfo}
                              updateQRCodeSettings={updateQRCodeSettings}
                              handleProfilePictureUpload={handleProfilePictureUpload}
                              removeProfilePicture={removeProfilePicture}
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
                            <ExperienceSection 
                              resumeData={resumeData}
                              addExperience={addExperience}
                              updateExperience={updateExperience}
                              removeExperience={removeExperience}
                            />
                          )}
                          {section.key === 'education' && (
                            <EducationSection 
                              resumeData={resumeData}
                              addEducation={addEducation}
                              updateEducation={updateEducation}
                              removeEducation={removeEducation}
                            />
                          )}
                          {section.key === 'projects' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                              <motion.div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                                <p className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                                  <CubeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                                  Showcase your notable projects and achievements.
                                </p>
                                <motion.button
                                  type="button"
                                  onClick={() => {
                                    addProject();
                                    toast.success('Project added', { 
                                      icon: '🚀',
                                      duration: 2000,
                                    });
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-rose-500/20 transition-all duration-300 font-semibold shadow-lg w-full sm:w-auto touch-manipulation min-h-[44px]"
                                >
                                  <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
                                            toast.success('Project removed', { 
                                              icon: '🗑️',
                                              duration: 1500,
                                            });
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
                                    <p className="text-sm mt-2">Click &quot;Add Project&quot; to get started ✨</p>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          )}
                          {section.key === 'additional' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                              {/* Mobile-optimized header */}
                              <motion.div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                                <p className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                                  <InformationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                                  Add languages, certifications, and other relevant information.
                                </p>
                                <motion.button
                                  type="button"
                                  onClick={() => {
                                    addAdditionalSection();
                                    toast.success('Section added', { 
                                      icon: '📝',
                                      duration: 2000,
                                    });
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 font-semibold shadow-lg w-full sm:w-auto touch-manipulation min-h-[44px]"
                                >
                                  <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  Add Section
                                </motion.button>
                              </motion.div>
                              
                              {/* Mobile-first grid layout */}
                              <motion.div 
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
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
                                      className="bg-gradient-to-br from-white/80 to-amber-50/50 border-2 border-amber-100 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                                    >
                                      <div className="flex justify-between items-start mb-3 sm:mb-4">
                                        <motion.h4 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2 flex-1 min-w-0">
                                          <span className="text-amber-500">📋</span>
                                          <span className="truncate">{additionalSection.title}</span>
                                        </motion.h4>
                                        <motion.button
                                          type="button"
                                          onClick={() => {
                                            removeAdditionalSection(additionalSection.id);
                                            toast.success('Section removed', { 
                                              icon: '🗑️',
                                              duration: 1500,
                                            });
                                          }}
                                          whileHover={{ scale: 1.1, rotate: 90 }}
                                          whileTap={{ scale: 0.9 }}
                                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ml-2"
                                        >
                                          <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </motion.button>
                                      </div>
                                      
                                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                                        <AnimatePresence>
                                          {additionalSection.items.map((item, itemIndex) => (
                                            <motion.div
                                              key={itemIndex}
                                              initial={{ opacity: 0, x: -10 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              exit={{ opacity: 0, x: 10 }}
                                              transition={{ delay: itemIndex * 0.05 }}
                                              className="flex items-center space-x-2 sm:space-x-3 group/item"
                                            >
                                              <div className="relative flex-1">
                                                <input
                                                  type="text"
                                                  value={item}
                                                  onChange={e => updateAdditionalSectionItem(additionalSection.id, itemIndex, e.target.value)}
                                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-sm bg-white/70 backdrop-blur-sm text-base touch-manipulation"
                                                  placeholder="Enter item"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                              </div>
                                              <motion.button
                                                type="button"
                                                onClick={() => {
                                                  removeAdditionalSectionItem(additionalSection.id, itemIndex);
                                                  toast.success('Item removed', { 
                                                    icon: '❌',
                                                    duration: 1200,
                                                  });
                                                }}
                                                whileHover={{ scale: 1.1, rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50 sm:opacity-0 sm:group-hover/item:opacity-100 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                                              >
                                                <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                              </motion.button>
                                            </motion.div>
                                          ))}
                                        </AnimatePresence>
                                      </div>
                                      
                                      <motion.button
                                        type="button"
                                        onClick={() => {
                                          addAdditionalSectionItem(additionalSection.id);
                                          toast.success('Item added', { 
                                            icon: '➕',
                                            duration: 1500,
                                          });
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-xl hover:from-amber-200 hover:to-orange-200 transition-all duration-300 text-sm font-semibold border-2 border-amber-200 hover:border-amber-300 touch-manipulation min-h-[44px]"
                                      >
                                        + Add Item
                                      </motion.button>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </motion.div>
                              
                              {/* Empty state - Mobile optimized */}
                              {(!resumeData.additionalSections || resumeData.additionalSections.length === 0) && (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-center py-8 sm:py-12 text-gray-500"
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
                                    <InformationCircleIcon className="mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-4 text-gray-300" />
                                  </motion.div>
                                  <p className="text-base sm:text-lg">No additional sections added yet</p>
                                  <p className="text-sm mt-2">Click &quot;Add Section&quot; to get started ✨</p>
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Action Buttons */}
          </form>
        </div>
      </motion.div>
    </>
  );
};

// Enhanced Personal Info Section Component - Mobile Optimized
const PersonalInfoSection: React.FC<{
  resumeData: ResumeData;
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  updateQRCodeSettings: (enabled: boolean, type: 'linkedin' | 'website' | 'none') => void;
  handleProfilePictureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeProfilePicture: () => void;
}> = ({ resumeData, updatePersonalInfo, updateQRCodeSettings, handleProfilePictureUpload, removeProfilePicture }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Essential Information - 2 column layout on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Full Name */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-orange-500" />
            Full Name *
          </label>
          <div className="relative group">
            <input
              type="text"
              value={resumeData.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-base touch-manipulation"
              placeholder="John Doe"
              required
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </motion.div>

        {/* Profession Title */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <BriefcaseIcon className="w-4 h-4 text-blue-500" />
            Profession Title *
          </label>
          <div className="relative group">
            <input
              type="text"
              value={resumeData.personalInfo.professionTitle}
              onChange={(e) => updatePersonalInfo('professionTitle', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-base touch-manipulation"
              placeholder="Software Engineer"
              required
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Contact Information - 2 column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Email */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>📧</span>
            Email Address *
          </label>
          <div className="relative group">
            <input
              type="email"
              value={resumeData.personalInfo.email || ''}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-base touch-manipulation"
              placeholder="john.doe@example.com"
              required
              inputMode="email"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </motion.div>

        {/* Phone */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>📱</span>
            Phone Number
          </label>
          <div className="relative group">
            <input
              type="tel"
              value={resumeData.personalInfo.phone || ''}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-base touch-manipulation"
              placeholder="(555) 123-4567"
              inputMode="tel"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Location - Full width */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>📍</span>
          Location *
        </label>
        <div className="relative group">
          <input
            type="text"
            value={resumeData.personalInfo.location || ''}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-base touch-manipulation"
            placeholder="City, State"
            required
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </motion.div>

      {/* Professional Links - 2 column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* LinkedIn */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>💼</span>
            LinkedIn Profile
          </label>
          <div className="relative group">
            <input
              type="text"
              value={resumeData.personalInfo.linkedIn || ''}
              onChange={(e) => {
                let value = e.target.value;
                // Remove protocol and domain if user pastes full URL
                value = value.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\//, 'linkedin.com/in/');
                updatePersonalInfo('linkedIn', value);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-base touch-manipulation"
              placeholder="linkedin.com/in/user-name"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </motion.div>

        {/* Website */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>🌐</span>
            Website/Portfolio
          </label>
          <div className="relative group">
            <input
              type="text"
              value={resumeData.personalInfo.website || ''}
              onChange={(e) => {
                let value = e.target.value;
                // Remove protocol if user pastes full URL
                value = value.replace(/^(https?:\/\/)?(www\.)?/, '');
                updatePersonalInfo('website', value);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-base touch-manipulation"
              placeholder="portfolio.com"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Optional Features Row - Profile Picture and QR Code */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 pt-6 border-t border-gray-200"
      >
        {/* Profile Picture Section */}
        <div className="bg-gradient-to-br from-orange-50 via-orange-25 to-pink-50 rounded-xl p-4 border border-orange-200 relative overflow-hidden group">
          {/* Animated background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative">
            <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center">
                <span className="text-white text-xs">📸</span>
              </div>
              Profile Picture
              <span className="text-xs font-normal bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Optional</span>
            </label>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Profile Picture Display */}
              <div className="relative group/pic">
                {resumeData.personalInfo.profilePicture ? (
                  <div className="relative">
                    <Image
                      src={resumeData.personalInfo.profilePicture}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-3 border-white shadow-lg ring-2 ring-orange-200 group-hover/pic:ring-orange-300 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover/pic:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Edit</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 hover:scale-110 transition-all duration-200 touch-manipulation flex items-center justify-center shadow-lg ring-2 ring-white"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center text-orange-400 bg-orange-50/50 hover:bg-orange-100/50 hover:border-orange-400 transition-all duration-300 group-hover/pic:scale-105">
                    <span className="text-2xl mb-1">📸</span>
                    <span className="text-xs font-medium">Add Photo</span>
                  </div>
                )}
              </div>
              
              {/* Upload Controls */}
              <div className="w-full space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  id="profile-picture-upload"
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="cursor-pointer flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 touch-manipulation"
                >
                  <span className="mr-2">
                    {resumeData.personalInfo.profilePicture ? '🔄' : '📤'}
                  </span>
                  {resumeData.personalInfo.profilePicture ? 'Replace Photo' : 'Upload Photo'}
                </label>
                <p className="text-xs text-gray-600 text-center">
                  <span className="font-medium">Tip:</span> Square images (1:1 ratio) work best
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Settings Section */}
        <div className="bg-gradient-to-br from-blue-50 via-blue-25 to-purple-50 rounded-xl p-4 border border-blue-200 relative overflow-hidden group">
          {/* Animated background accent */}
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/40 to-purple-200/40 rounded-full blur-xl translate-y-6 -translate-x-6 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative">
            <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs">📱</span>
              </div>
              QR Code Settings
              <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Optional</span>
            </label>
            
            <p className="text-xs text-gray-600 mb-4 bg-white/60 rounded-lg p-2 border border-blue-100">
              <span className="font-medium text-blue-600">💡 Pro Tip:</span> Add a QR code to make your digital profiles easily accessible
            </p>
            
            <div className="space-y-4">
              {/* Main Toggle */}
              <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-blue-100 hover:bg-white/90 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${
                    resumeData.personalInfo.qrCode?.enabled 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-md ${
                      resumeData.personalInfo.qrCode?.enabled ? 'left-5' : 'left-1'
                    }`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Include QR Code</span>
                </div>
                <input
                  type="checkbox"
                  id="qr-enabled"
                  checked={resumeData.personalInfo.qrCode?.enabled || false}
                  onChange={(e) => updateQRCodeSettings(
                    e.target.checked, 
                    resumeData.personalInfo.qrCode?.type || 'linkedin'
                  )}
                  className="sr-only"
                />
                <label htmlFor="qr-enabled" className="cursor-pointer">
                  <span className="sr-only">Toggle QR Code</span>
                </label>
              </div>
              
              {/* QR Code Options */}
              {resumeData.personalInfo.qrCode?.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 pl-4 border-l-2 border-blue-200"
                >
                  <p className="text-xs font-semibold text-gray-700 mb-2">Link to:</p>
                  
                  {/* LinkedIn Option */}
                  <label className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all ${
                    resumeData.personalInfo.qrCode?.type === 'linkedin' && resumeData.personalInfo.linkedIn
                      ? 'bg-blue-100 border border-blue-300' 
                      : resumeData.personalInfo.linkedIn
                      ? 'bg-white/50 hover:bg-blue-50 border border-gray-200' 
                      : 'bg-gray-50 border border-gray-200 cursor-not-allowed opacity-60'
                  }`}>
                    <input
                      type="radio"
                      id="qr-linkedin"
                      name="qr-type"
                      value="linkedin"
                      checked={resumeData.personalInfo.qrCode?.type === 'linkedin'}
                      onChange={() => updateQRCodeSettings(true, 'linkedin')}
                      disabled={!resumeData.personalInfo.linkedIn}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-sm">💼</span>
                      <span className={`text-xs font-medium ${
                        resumeData.personalInfo.linkedIn ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        LinkedIn Profile
                      </span>
                      {!resumeData.personalInfo.linkedIn && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Add URL first
                        </span>
                      )}
                    </div>
                  </label>
                  
                  {/* Website Option */}
                  <label className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all ${
                    resumeData.personalInfo.qrCode?.type === 'website' && resumeData.personalInfo.website
                      ? 'bg-blue-100 border border-blue-300' 
                      : resumeData.personalInfo.website
                      ? 'bg-white/50 hover:bg-blue-50 border border-gray-200' 
                      : 'bg-gray-50 border border-gray-200 cursor-not-allowed opacity-60'
                  }`}>
                    <input
                      type="radio"
                      id="qr-website"
                      name="qr-type"
                      value="website"
                      checked={resumeData.personalInfo.qrCode?.type === 'website'}
                      onChange={() => updateQRCodeSettings(true, 'website')}
                      disabled={!resumeData.personalInfo.website}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-sm">🌐</span>
                      <span className={`text-xs font-medium ${
                        resumeData.personalInfo.website ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        Website/Portfolio
                      </span>
                      {!resumeData.personalInfo.website && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Add URL first
                        </span>
                      )}
                    </div>
                  </label>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Skills Section Component - Mobile Optimized
const SkillsSection: React.FC<{
  resumeData: ResumeData;
  skillCategories: string[];
  addSkillCategory: () => void;
  removeSkillCategory: (cat: string) => void;
  addSkill: (category: string) => void;
  updateSkill: (id: string, value: string) => void;
  removeSkill: (id: string) => void;
  DEFAULT_SKILL_CATEGORIES: string[];
}> = ({ resumeData, skillCategories, addSkillCategory, addSkill, updateSkill, removeSkill }) => {
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [newSkillValue, setNewSkillValue] = useState('');

  const handleSkillEdit = (skillId: string, currentValue: string) => {
    setEditingSkill(skillId);
    setNewSkillValue(currentValue);
  };

  const handleSkillSave = (skillId: string) => {
    if (newSkillValue.trim()) {
      updateSkill(skillId, newSkillValue.trim());
    }
    setEditingSkill(null);
    setNewSkillValue('');
  };

  const handleSkillCancel = () => {
    setEditingSkill(null);
    setNewSkillValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, skillId: string) => {
    if (e.key === 'Enter') {
      handleSkillSave(skillId);
    } else if (e.key === 'Escape') {
      handleSkillCancel();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-gray-600 flex items-center gap-2 text-sm sm:text-base mb-2">
          <CodeBracketIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
          Add your technical and soft skills organized by category.
        </p>
      </div>
      
      {skillCategories.map((category) => {
        const categorySkills = resumeData.skills.filter(skill => skill.category === category);
        
        return (
          <motion.div 
            key={category} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl border border-emerald-200 overflow-hidden relative group hover:shadow-lg transition-all duration-300"
          >
            {/* Animated background accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-xl -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative p-4 sm:p-4">
              <div className="flex items-center justify-between mb-4"> 
                <h4 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                  {category}
                  <span className="text-xs font-normal bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                    {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
                  </span>
                </h4>
                <motion.button
                  type="button"
                  onClick={() => addSkill(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation"
                >
                  <PlusIcon className="w-3 h-3" />
                  Add Skill
                </motion.button>
              </div>
              
              {/* Skills Display */}
              <div className="space-y-3">
                {categorySkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {categorySkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="group/skill relative"
                        >
                          {editingSkill === skill.id ? (
                            /* Edit Mode */
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={newSkillValue}
                                onChange={(e) => setNewSkillValue(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, skill.id)}
                                onBlur={() => handleSkillSave(skill.id)}
                                className="px-3 py-1.5 text-sm border-2 border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white min-w-[120px]"
                                placeholder="Enter skill name"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSkillSave(skill.id)}
                                className="w-6 h-6 bg-emerald-500 text-white rounded-full text-xs hover:bg-emerald-600 transition-colors flex items-center justify-center"
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                onClick={handleSkillCancel}
                                className="w-6 h-6 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors flex items-center justify-center"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            /* Display Mode */
                            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 group-hover/skill:border-emerald-300">
                              <span 
                                className="text-sm font-medium text-gray-800 cursor-pointer hover:text-emerald-600 transition-colors"
                                onClick={() => handleSkillEdit(skill.id, skill.name)}
                                title="Click to edit"
                              >
                                {skill.name || 'Untitled Skill'}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeSkill(skill.id)}
                                className="ml-1 w-4 h-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover/skill:opacity-100 flex items-center justify-center touch-manipulation"
                                title="Remove skill"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Empty State */
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 border-2 border-dashed border-emerald-200 rounded-lg bg-white/40"
                  >
                    <div className="text-emerald-400 text-2xl mb-2">🎯</div>
                    <p className="text-sm text-gray-600 mb-2">No skills in this category yet</p>
                    <button
                      type="button"
                      onClick={() => addSkill(category)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline decoration-dotted underline-offset-2 hover:decoration-solid transition-all"
                    >
                      Add your first {category.toLowerCase()} skill
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
      
      {/* Add New Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center pt-4"
      >
        <motion.button
          type="button"
          onClick={addSkillCategory}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-emerald-100 hover:to-teal-100 text-gray-700 hover:text-emerald-700 rounded-xl border border-gray-300 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-300 font-medium text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Category
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Experience Section Component - Modern Design
const ExperienceSection: React.FC<{
  resumeData: ResumeData;
  addExperience: () => void;
  updateExperience: (id: string, field: keyof Experience, value: any) => void;
  removeExperience: (id: string) => void;
}> = ({ resumeData, addExperience, updateExperience, removeExperience }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (expId: string) => {
    setExpandedCard(expandedCard === expId ? null : expId);
  };

  const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
    if (!startDate) return 'Start Date Not Set';
    if (current) return `${startDate} - Present`;
    if (!endDate) return `${startDate} - End Date Not Set`;
    return `${startDate} - ${endDate}`;
  };

  const getExperiencePreview = (exp: Experience) => {
    const title = exp.position || 'Position Not Set';
    const company = exp.company || 'Company Not Set';
    const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.current);
    return { title, company, dateRange };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 flex items-center gap-2 text-sm sm:text-base mb-2">
            <BriefcaseIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Add your work experience in reverse chronological order.
          </p>
          <p className="text-xs text-gray-500">
            Start with your most recent position first
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => {
            addExperience();
            toast.success('New experience added', { 
              icon: '💼',
              duration: 2000,
            });
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm touch-manipulation"
        >
          <PlusIcon className="w-4 h-4" />
          Add Experience
        </motion.button>
      </div>

      {/* Experience Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {resumeData.experience.map((exp, index) => {
            const { title, company, dateRange } = getExperiencePreview(exp);
            const isExpanded = expandedCard === exp.id;
            
            return (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ delay: index * 0.1, layout: { duration: 0.3 } }}
                className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200 overflow-hidden relative group hover:shadow-lg transition-all duration-300"
              >
                {/* Animated background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative">
                  {/* Card Header - Always Visible */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-white/30 transition-colors duration-200"
                    onClick={() => toggleCard(exp.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">#{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg truncate">
                              {title}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {company} • {dateRange}
                            </p>
                          </div>
                        </div>
                        
                        {/* Quick preview */}
                        {!isExpanded && (
                          <div className="ml-13">
                            {exp.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {exp.description}
                              </p>
                            )}
                            {exp.achievements.length > 0 && (
                              <p className="text-xs text-blue-600 mt-1">
                                {exp.achievements.length} achievement{exp.achievements.length !== 1 ? 's' : ''} added
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeExperience(exp.id);
                            toast.success('Experience removed', { 
                              icon: '🗑️',
                              duration: 1500,
                            });
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center justify-center touch-manipulation"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-8 h-8 text-gray-400 flex items-center justify-center"
                        >
                          <ChevronDownIcon className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-blue-200/50">
                          <div className="pt-4 space-y-4">
                            {/* Primary Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Job Title *
                                  </label>
                                  <input
                                    type="text"
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 text-base"
                                    placeholder="Software Engineer"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Company *
                                  </label>
                                  <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 text-base"
                                    placeholder="Tech Company Inc."
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location
                                  </label>
                                  <input
                                    type="text"
                                    value={exp.location}
                                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 text-base"
                                    placeholder="New York, NY"
                                  />
                                </div>
                                
                                {/* Date Range */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                      Start Date *
                                    </label>
                                    <input
                                      type="text"
                                      value={exp.startDate}
                                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 text-base"
                                      placeholder="MM/YYYY"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                      End Date
                                    </label>
                                    <input
                                      type="text"
                                      value={exp.endDate}
                                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 disabled:bg-gray-100 text-base"
                                      placeholder="MM/YYYY"
                                      disabled={exp.current}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Current Position Toggle */}
                            <div className="flex items-center p-3 bg-white/60 rounded-lg border border-blue-100">
                              <input
                                type="checkbox"
                                id={`current-${exp.id}`}
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`current-${exp.id}`} className="ml-3 text-sm font-medium text-gray-700">
                                I currently work here
                              </label>
                              {exp.current && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  Current Position
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Description
                                <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                              </label>
                              <textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 text-base resize-y"
                                placeholder="Describe your role, responsibilities, and main duties..."
                              />
                            </div>

                            {/* Achievements */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Key Achievements & Accomplishments
                                <span className="text-xs text-gray-500 ml-1">(One per line)</span>
                              </label>
                              <textarea
                                value={exp.achievements.join('\n')}
                                onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value.split('\n').filter(a => a.trim()))}
                                rows={4}
                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 text-base resize-y"
                                placeholder="• Increased sales by 25% through strategic initiatives&#10;• Led a cross-functional team of 8 developers&#10;• Implemented new process that reduced costs by $50K annually&#10;• Received Employee of the Year award"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {resumeData.experience.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30"
        >
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <BriefcaseIcon className="w-16 h-16 text-blue-300 mb-4" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No work experience added yet</h3>
          <p className="text-gray-600 mb-4">Start building your professional history</p>
          <motion.button
            type="button"
            onClick={() => {
              addExperience();
              toast.success('First experience added! 🎉', { 
                icon: '💼',
                duration: 2000,
              });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            <PlusIcon className="w-5 h-5" />
            Add Your First Experience
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Enhanced Education Section Component - Modern Design
const EducationSection: React.FC<{
  resumeData: ResumeData;
  addEducation: () => void;
  updateEducation: (id: string, field: keyof Education, value: any) => void;
  removeEducation: (id: string) => void;
}> = ({ resumeData, addEducation, updateEducation, removeEducation }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (eduId: string) => {
    setExpandedCard(expandedCard === eduId ? null : eduId);
  };

  const formatGraduationDate = (date: string) => {
    if (!date) return 'Graduation Date Not Set';
    return date;
  };

  const getEducationPreview = (edu: Education) => {
    const degree = edu.degree || 'Degree Not Set';
    const institution = edu.institution || 'Institution Not Set';
    const field = edu.field || 'Field Not Set';
    const graduationDate = formatGraduationDate(edu.graduationDate);
    return { degree, institution, field, graduationDate };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 flex items-center gap-2 text-sm sm:text-base mb-2">
            <AcademicCapIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            Add your educational background in reverse chronological order.
          </p>
          <p className="text-xs text-gray-500">
            Start with your most recent education first
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => {
            addEducation();
            toast.success('New education added', { 
              icon: '🎓',
              duration: 2000,
            });
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm touch-manipulation"
        >
          <PlusIcon className="w-4 h-4" />
          Add Education
        </motion.button>
      </div>

      {/* Education Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {resumeData.education.map((edu, index) => {
            const { degree, institution, field, graduationDate } = getEducationPreview(edu);
            const isExpanded = expandedCard === edu.id;
            
            return (
              <motion.div
                key={edu.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ delay: index * 0.1, layout: { duration: 0.3 } }}
                className="bg-gradient-to-br from-purple-50/80 to-violet-50/80 rounded-xl border border-purple-200 overflow-hidden relative group hover:shadow-lg transition-all duration-300"
              >
                {/* Animated background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-violet-200/20 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative">
                  {/* Card Header - Always Visible */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-white/30 transition-colors duration-200"
                    onClick={() => toggleCard(edu.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">#{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg truncate">
                              {degree}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {institution} • {field}
                            </p>
                          </div>
                        </div>
                        
                        {/* Quick preview */}
                        {!isExpanded && (
                          <div className="ml-13">
                            <p className="text-sm text-gray-600">
                              Graduation: {graduationDate}
                            </p>
                            {(edu.gpa || edu.honors) && (
                              <div className="flex items-center gap-2 mt-1">
                                {edu.gpa && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                    GPA: {edu.gpa}
                                  </span>
                                )}
                                {edu.honors && (
                                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                                    {edu.honors}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEducation(edu.id);
                            toast.success('Education removed', { 
                              icon: '🗑️',
                              duration: 1500,
                            });
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center justify-center touch-manipulation"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.div
                          animate={{ 
                            rotate: isExpanded ? 180 : 0 
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-8 h-8 flex items-center justify-center"
                        >
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-purple-200 bg-white/40"
                      >
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { field: 'institution', label: 'Institution', placeholder: 'University Name', required: true },
                              { field: 'degree', label: 'Degree', placeholder: "Bachelor's, Master's, etc.", required: true },
                              { field: 'field', label: 'Field of Study', placeholder: 'Computer Science', required: true },
                              { field: 'graduationDate', label: 'Graduation Date', placeholder: 'MM/YYYY', required: true },
                              { field: 'gpa', label: 'GPA', placeholder: '3.8', required: false },
                              { field: 'honors', label: 'Honors', placeholder: 'Magna Cum Laude, Dean\'s List', required: false },
                            ].map((fieldConfig) => (
                              <div key={fieldConfig.field} className="relative group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  {fieldConfig.label}
                                  {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <input
                                  type="text"
                                  value={edu[fieldConfig.field as keyof Education] as string || ''}
                                  onChange={(e) => updateEducation(edu.id, fieldConfig.field as keyof Education, e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/70 backdrop-blur-sm"
                                  placeholder={fieldConfig.placeholder}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                              </div>
                            ))}
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex justify-end pt-2">
                            <motion.button
                              type="button"
                              onClick={() => setExpandedCard(null)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                            >
                              Collapse
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {resumeData.education.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/30"
        >
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <AcademicCapIcon className="w-16 h-16 text-purple-300 mb-4" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No education added yet</h3>
          <p className="text-gray-600 mb-4">Start building your educational background</p>
          <motion.button
            type="button"
            onClick={() => {
              addEducation();
              toast.success('First education added! 🎉', { 
                icon: '🎓',
                duration: 2000,
              });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            <PlusIcon className="w-5 h-5" />
            Add Your First Education
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};
