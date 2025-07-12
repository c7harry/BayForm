// This is the view resume page
'use client';

import { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import { getResumes, saveResume, deleteResume } from '@/utils/storage';
import { exportLatex, LatexTemplateType } from '@/utils/latexGenerator';
import { exportPDF } from '@/utils/pdfGenerator';
import { ResumeForm } from '@/components/ResumeForm';
import { LatexView } from '@/components/LatexExport';
import InlineEditBubble from '@/components/InlineEditBubble';
import LandingPage from '@/components/LandingPage';
import './constructionBanner.css';

export default function Home() {
  // --- State Management ---
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'preview'>('list');
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<LatexTemplateType>('modern');
  const [isGeneratingLatex, setIsGeneratingLatex] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editedResume, setEditedResume] = useState<ResumeData | null>(null);
  const [showLatexView, setShowLatexView] = useState(false);

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

  // --- LaTeX Generation ---
  const handleGenerateLatex = async () => {
    const resumeToUse = editedResume || selectedResume;
    if (!resumeToUse) return;
    setIsGeneratingLatex(true);
    try {
      exportLatex(resumeToUse, selectedTemplate);
    } catch (error) {
      console.error('Error generating LaTeX:', error);
    } finally {
      setIsGeneratingLatex(false);
    }
  };

  // --- PDF Generation ---
  const handleGeneratePdf = async () => {
    const resumeToUse = editedResume || selectedResume;
    if (!resumeToUse) return;
    setIsGeneratingPdf(true);
    try {
      await exportPDF(resumeToUse, selectedTemplate);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
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
  const renderTemplate = (resume: ResumeData, template: LatexTemplateType) => {
    const resumeToRender = editedResume || resume;
    if (showLatexView) {
      return <LatexView resumeData={resumeToRender} selectedTemplate={template} />;
    }
    // Use LatexView for visual preview
    return <LatexView resumeData={resumeToRender} selectedTemplate={template} showVisualPreview />;
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

                {/* Template Selection */}
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-slate-700 hidden sm:inline">Template:</span>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value as LatexTemplateType)}
                      className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons - Compact Row */}
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  {/* PDF Export Button */}
                  <button
                    onClick={handleGeneratePdf}
                    disabled={isGeneratingPdf}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 flex items-center space-x-1 touch-manipulation text-xs sm:text-sm"
                  >
                    {isGeneratingPdf ? (
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
                  {/* Edit Resume Button */}
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

          {/* View Toggle Controls */}
          <div className="w-full px-2 sm:px-4 py-2 flex justify-center">
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">View Mode:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setShowLatexView(false)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        !showLatexView 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setShowLatexView(true)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                        showLatexView 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      LaTeX Export
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Using</span>
                  <span className="font-semibold text-gray-800 capitalize">{selectedTemplate}</span>
                  <span>template</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Preview - Mobile Optimized */}
          <div className="w-full px-0 sm:px-0 py-4 sm:py-8 flex justify-center">
            {showLatexView ? (
              <div className="w-full">
                {renderTemplate(selectedResume, selectedTemplate)}
              </div>
            ) : (
              // Remove the extra container and show only the rendered template
              <div className="w-full">
                {renderTemplate(selectedResume, selectedTemplate)}
              </div>
            )}
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
