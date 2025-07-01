// This is the landing and view resume page
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ResumeData, TemplateType } from '@/types/resume';
import { getResumes, saveResume, deleteResume } from '@/utils/storage';
import { generatePDF } from '@/utils/pdfGenerator';
import { ResumeForm } from '@/components/ResumeForm';
import { ModernTemplate, ClassicTemplate, MinimalTemplate, TechTemplate, ElegantTemplate } from '@/components/ResumeTemplates';
import InlineEditBubble from '@/components/InlineEditBubble';

export default function Home() {
  // --- State Management ---
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'preview'>('list');
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editedResume, setEditedResume] = useState<ResumeData | null>(null);

  // --- Load resumes on mount ---
  useEffect(() => {
    setResumes(getResumes());
  }, []);

  // --- Resume Actions ---
  const handleSaveResume = (resume: ResumeData) => {
    saveResume(resume);
    setResumes(getResumes());
    setSelectedResume(resume);
    setEditedResume(resume);
    setSelectedTemplate(resume.template);
    setCurrentView('preview');
    setIsEditingInline(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditResume = (resume: ResumeData) => {
    setSelectedResume(resume);
    setCurrentView('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviewResume = (resume: ResumeData) => {
    setSelectedResume(resume);
    setEditedResume(resume);
    setSelectedTemplate(resume.template);
    setCurrentView('preview');
    setIsEditingInline(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteResume = (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteResume(id);
      setResumes(getResumes());
    }
  };

  // --- PDF Generation ---
  const handleGeneratePDF = async () => {
    const resumeToUse = editedResume || selectedResume;
    if (!resumeToUse) return;
    setIsGeneratingPDF(true);
    try {
      await generatePDF(resumeToUse, selectedTemplate);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // --- Inline Editing Functions ---
  const handleToggleInlineEdit = () => {
    if (isEditingInline) {
      // Save changes when exiting edit mode
      if (editedResume && selectedResume) {
        const updatedResume = { ...editedResume, updatedAt: new Date().toISOString() };
        saveResume(updatedResume);
        setResumes(getResumes());
        setSelectedResume(updatedResume);
      }
    } else {
      // Enter edit mode
      setEditedResume(selectedResume);
    }
    setIsEditingInline(!isEditingInline);
  };

  const handleInlineEdit = (field: string, value: any, section?: string, index?: number) => {
    if (!editedResume) return;

    const updatedResume = { ...editedResume };

    if (section === 'personalInfo') {
      updatedResume.personalInfo = { ...updatedResume.personalInfo, [field]: value };
    } else if (section === 'experience' && typeof index === 'number') {
      updatedResume.experience[index] = { ...updatedResume.experience[index], [field]: value };
    } else if (section === 'education' && typeof index === 'number') {
      updatedResume.education[index] = { ...updatedResume.education[index], [field]: value };
    } else if (section === 'projects' && typeof index === 'number') {
      updatedResume.projects[index] = { ...updatedResume.projects[index], [field]: value };
    } else if (section === 'skills' && typeof index === 'number') {
      updatedResume.skills[index] = { ...updatedResume.skills[index], [field]: value };
    } else if (section === 'additionalSections' && typeof index === 'number') {
      if (!updatedResume.additionalSections) updatedResume.additionalSections = [];
      updatedResume.additionalSections[index] = { ...updatedResume.additionalSections[index], [field]: value };
    }

    setEditedResume(updatedResume);
  };

  // --- Template Renderer ---
  const renderTemplate = (resume: ResumeData, template: TemplateType) => {
    const resumeToRender = editedResume || resume;
    const templateProps = {
      resumeData: resumeToRender,
      isEditing: isEditingInline,
      onEdit: handleInlineEdit
    };

    switch (template) {
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'executive':
        return <ClassicTemplate {...templateProps} />;
      case 'creative':
        return <MinimalTemplate {...templateProps} />;
      case 'tech':
        return <TechTemplate {...templateProps} />;
      case 'elegant':
        return <ElegantTemplate {...templateProps} />;
      default:
        return <ModernTemplate {...templateProps} />;
    }
  };

  // --- Main Content Renderer ---
  const renderContent = () => {
    // Create Resume View
    if (currentView === 'create') {
      return (
        <ResumeForm
          onSave={handleSaveResume}
          onCancel={() => setCurrentView('list')}
        />
      );
    }

    // Edit Resume View
    if (currentView === 'edit' && selectedResume) {
      return (
        <ResumeForm
          initialData={selectedResume}
          onSave={handleSaveResume}
          onCancel={() => setCurrentView('list')}
        />
      );
    }

    // Preview Resume View
    if (currentView === 'preview' && selectedResume) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
          {/* Preview Controls - Single Row Design */}
          <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm no-print">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Back Button */}
                <button
                  onClick={() => {
                    setCurrentView('list');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center text-orange-500 hover:text-orange-600 font-semibold transition-colors group touch-manipulation flex-shrink-0"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden lg:inline">Back to Resumes</span>
                  <span className="lg:hidden">Back</span>
                </button>
                
                {/* Resume Info - Compact */}
                <div className="flex-1 min-w-0 mx-2 sm:mx-4">
                  <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-slate-900 truncate leading-tight">
                    {(editedResume || selectedResume).name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 truncate leading-tight">{(editedResume || selectedResume).personalInfo.fullName}</p>
                </div>

                {/* Template Selector - Compact */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <label className="text-xs font-medium text-slate-700 hidden sm:block">Template:</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
                    className="px-2 sm:px-3 py-1 sm:py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white text-slate-900 font-medium text-xs sm:text-sm touch-manipulation"
                  >
                    <option value="modern">Modern</option>
                    <option value="executive">Executive</option>
                    <option value="creative">Creative</option>
                    <option value="tech">Tech</option>
                    <option value="elegant">Elegant</option>
                  </select>
                  {selectedTemplate !== 'modern' && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold border border-yellow-200 animate-pulse">Work in Progress</span>
                  )}
                </div>

                {/* Action Buttons - Compact Row */}
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGeneratingPDF}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 flex items-center space-x-1 touch-manipulation text-xs sm:text-sm"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="hidden sm:inline">PDF</span>
                        <span className="sm:hidden">PDF</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleEditResume(selectedResume)}
                    className="bg-[#0F2D52] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-[#0a1f3d] focus:outline-none focus:ring-2 focus:ring-[#0F2D52]/50 font-semibold transition-all duration-300 flex items-center space-x-1 touch-manipulation text-xs sm:text-sm"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden sm:inline">Edit Resume</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Resume Preview - Mobile Optimized */}
          <div className="w-full px-2 sm:px-4 py-4 sm:py-8 flex justify-center">
            <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl border border-slate-200 overflow-hidden h-fit w-fit">
              {/* Browser-like header - Hidden on small mobile */}
              <div className="hidden sm:block p-2 bg-gradient-to-r from-[#0F2D52]/10 to-[#0F2D52]/5 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 text-center">
                    <span className="text-sm text-slate-600 font-medium">Resume Preview</span>
                  </div>
                </div>
              </div>
              {/* Resume Content - Mobile responsive with proper fit */}
              <div className="bg-white relative h-fit overflow-hidden flex justify-center" id="resume-preview">
                <div className="overflow-hidden h-fit">
                  <div className="origin-top-left scale-[0.55] sm:scale-100 w-[calc(210mm*0.55)] sm:w-[210mm] h-fit leading-none">
                    <div className="h-fit leading-none">
                      {renderTemplate(selectedResume, selectedTemplate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Inline Edit Bubble */}
          <InlineEditBubble
            isEditingInline={isEditingInline}
            onToggleEdit={handleToggleInlineEdit}
          />
        </div>
      );
    }

    // Default: Resume List View
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section - Completely Redesigned */}
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50">
            <div className="absolute top-0 left-0 w-72 h-72 bg-orange-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Navigation */}
          <nav className="relative z-5 py-5">
            <div className="flex items-center justify-center w-full">
              <Image 
                src="/images/header.png" 
                alt="BayForm" 
                width={128} 
                height={128} 
                className="h-32 sm:h-32 lg:h-32 w-auto mb-0" 
                style={{ marginBottom: '-4rem' }}
              />
            </div>
          </nav>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-8">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No Sign-Up Required • Local Storage Only
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
                Create Your
                <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Perfect Resume
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl text-slate-600 mt-2">
                  in Minutes
                </span>
              </h1>

              {/* Subtitle */}                <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Build professional, ATS-friendly resumes with our easy-to-use builder. 
                Choose from stunning templates designed by experts and land your dream job. 
                <span className="block mt-2 font-semibold text-green-600">
                  100% Private - Your data stays on your device!
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button
                  onClick={() => {
                    setCurrentView('create');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/50 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2"
                >
                  <span>Start Building Now</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                {resumes.length > 0 && (
                  <button
                    onClick={() => document.getElementById('resumes-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-2xl hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300/50 font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>View My Resumes ({resumes.length})</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-center justify-center opacity-70">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800 mb-1">{resumes.length}+</div>
                  <div className="text-sm text-slate-600">Resumes Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800 mb-1">5</div>
                  <div className="text-sm text-slate-600">Pro Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
                  <div className="text-sm text-slate-600">Private & Secure</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">Local</div>
                  <div className="text-sm text-slate-600">Storage Only</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Resume Preview */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-slate-600 text-sm font-medium">Resume Preview</div>
                  </div>
                </div>
                <div className="p-8 sm:p-12">
                  <div className="space-y-6">
                    <div>
                      <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-orange-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-100 rounded"></div>
                        <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                        <div className="h-3 bg-slate-100 rounded w-4/6"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-blue-200 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                        <div className="h-3 bg-slate-100 rounded"></div>
                        <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Features Section - Completely Redesigned */}
        <div className="py-8 lg:py-8 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacy First
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Everything You Need
                <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Without Compromise
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Create professional resumes instantly with complete privacy. No accounts, no servers, no data collection - 
                your information stays securely on your device.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Feature 1: Privacy First */}
              <div className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-green-600 transition-colors">
                    100% Private
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    No sign-up required! Your personal information and resume data never leaves your device. Everything is stored locally in your browser.
                  </p>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      No account creation needed
                    </li>
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Local storage only
                    </li>
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete data privacy
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 2: Professional Templates */}
              <div className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    Stunning Templates
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    Choose from professionally designed templates that are optimized for different industries and career levels.
                  </p>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      5 unique designs
                    </li>
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Industry-specific layouts
                    </li>
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Modern typography
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 3: Instant & Ready */}
              <div className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">
                    Start Immediately
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    No setup, no waiting, no hassle. Click start and begin building your resume right away. Download as PDF when you&apos;re done.
                  </p>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Zero setup time
                    </li>
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Instant PDF download
                    </li>
                    <li className="flex items-center text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      ATS-friendly format
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-20">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 lg:p-16">
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Ready to Build Your Dream Career?
                </h3>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals who have already created their perfect resume with our platform.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('create');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/50 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                >
                  Start Building Now - It&apos;s Free
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Resume Grid Section - Completely Redesigned */}
        <div id="resumes-section" className="py-8 lg:py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {resumes.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-blue-100 w-40 h-40 rounded-full mx-auto blur-3xl opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-2xl">
                    <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                  Your Resume Journey
                  <span className="block text-3xl lg:text-4xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Starts Here
                  </span>
                </h3>
                <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Take the first step towards your dream career. Create your professional resume in just a few minutes with our intuitive builder.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => {
                      setCurrentView('create');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/50 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2"
                  >
                    <span>Create Your First Resume</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Your Portfolio
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                    Your Professional
                    <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      Resume Collection
                    </span>
                  </h2>
                  <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                    Manage, customize, and download your professional resumes. Each one tailored for success.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resumes.map((resume, index) => (
                    <div
                      key={resume.id}
                      className="group relative"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      <div className="relative bg-white rounded-3xl shadow-xl border border-slate-200 hover:shadow-2xl hover:border-orange-200 transition-all duration-500 overflow-hidden">
                        {/* Resume Header */}
                        <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-100">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                                {resume.name}
                              </h3>
                              <p className="text-slate-600 font-medium mb-1">
                                {resume.personalInfo.fullName}
                              </p>
                              <p className="text-sm text-slate-500">
                                {resume.personalInfo.email}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-xl text-xs font-medium border ${
                              resume.template === 'modern' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              resume.template === 'executive' ? 'bg-green-50 text-green-700 border-green-200' :
                              resume.template === 'creative' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              resume.template === 'tech' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                              resume.template === 'elegant' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                              {resume.template === 'modern' ? 'Modern' :
                               resume.template === 'executive' ? 'Executive' :
                               resume.template === 'creative' ? 'Creative' :
                               resume.template === 'tech' ? 'Tech' :
                               resume.template === 'elegant' ? 'Elegant' :
                               resume.template}
                            </div>
                          </div>
                        </div>

                        {/* Resume Content */}
                        <div className="p-6">
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 mb-6">
                            <div className="grid grid-cols-2 gap-6 text-sm">
                              <div>
                                <div className="flex items-center text-slate-500 mb-2">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  Experience
                                </div>
                                <div className="text-lg font-bold text-slate-900">{resume.experience?.length || 0} positions</div>
                              </div>
                              <div>
                                <div className="flex items-center text-slate-500 mb-2">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Updated
                                </div>
                                <div className="text-lg font-bold text-slate-900">{new Date(resume.updatedAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-3">
                            <button
                              onClick={() => handlePreviewResume(resume)}
                              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/50 font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>Preview & Download</span>
                            </button>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditResume(resume)}
                                className="flex-1 bg-slate-100 text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-300/50 font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteResume(resume.id)}
                                className="bg-red-50 text-red-600 px-4 py-3 rounded-xl hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-300/50 font-semibold transition-all duration-300 group"
                                title="Delete Resume"
                              >
                                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Resume CTA */}
                <div className="mt-16 text-center">
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-12 border border-slate-200">
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                      Need Another Resume?
                    </h3>
                    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                      Create multiple versions tailored for different positions or industries.
                    </p>
                    <button
                      onClick={() => {
                        setCurrentView('create');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-2xl hover:from-slate-900 hover:to-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-500/50 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Create Another Resume</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Render the main content ---
  return (
    <>
      {renderContent()}
    </>
  );
}
