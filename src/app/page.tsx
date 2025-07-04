// This is the landing and view resume page
'use client';

import { useState, useEffect } from 'react';
import { ResumeData, TemplateType } from '@/types/resume';
import { getResumes, saveResume, deleteResume } from '@/utils/storage';
import { generatePDF } from '@/utils/pdfGenerator';
import { ResumeForm } from '@/components/ResumeForm';
import { ModernTemplate, ClassicTemplate, MinimalTemplate, TechTemplate, ElegantTemplate } from '@/components/ResumeTemplates';
import InlineEditBubble from '@/components/InlineEditBubble';
import LandingPage from '@/components/LandingPage';
import './constructionBanner.css';

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

          {/* Modern Construction Banner - Enhanced design for non-modern templates */}
          {selectedTemplate !== 'modern' && (
            <div className="w-full z-40 py-3 px-4 sm:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="construction-banner relative px-6 py-3 flex items-center justify-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="construction-icon text-2xl" role="img" aria-label="construction">
                      🚧
                    </span>
                    <div className="construction-text text-amber-900 font-extrabold text-lg tracking-wide">
                      Template Under Development
                    </div>
                    <span className="construction-icon text-2xl" role="img" aria-label="construction">
                      🚧
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 ml-4 text-amber-800 font-semibold text-sm">
                    <span role="img" aria-label="tools">⚠️</span>
                    <span>Some features may be limited</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
      <LandingPage
        resumes={resumes}
        onCreateNew={() => setCurrentView('create')}
        onEditResume={handleEditResume}
        onPreviewResume={handlePreviewResume}
        onDeleteResume={handleDeleteResume}
      />
    );
  };

  // --- Render the main content ---
  return (
    <>
      {renderContent()}
    </>
  );
}
