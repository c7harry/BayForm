// This is the main page for the Resume Builder app
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ResumeData, TemplateType } from '@/types/resume';
import { getResumes, saveResume, deleteResume } from '@/utils/storage';
import { generatePDF, generateSimplePDF } from '@/utils/pdfGenerator';
import { ResumeForm } from '@/components/ResumeForm';
import { ModernTemplate, ClassicTemplate, MinimalTemplate } from '@/components/ResumeTemplates';

export default function Home() {
  // --- State Management ---
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'preview'>('list');
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // --- Load resumes on mount ---
  useEffect(() => {
    setResumes(getResumes());
  }, []);

  // --- Resume Actions ---
  const handleSaveResume = (resume: ResumeData) => {
    saveResume(resume);
    setResumes(getResumes());
    setCurrentView('list');
    setSelectedResume(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditResume = (resume: ResumeData) => {
    setSelectedResume(resume);
    setCurrentView('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviewResume = (resume: ResumeData) => {
    setSelectedResume(resume);
    setSelectedTemplate(resume.template);
    setCurrentView('preview');
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
    if (!selectedResume) return;
    setIsGeneratingPDF(true);
    try {
      await generatePDF(selectedResume, 'resume-preview');
    } catch (error) {
      console.error('Error generating PDF:', error);
      generateSimplePDF(selectedResume);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // --- Template Renderer ---
  const renderTemplate = (resume: ResumeData, template: TemplateType) => {
    switch (template) {
      case 'modern':
        return <ModernTemplate resumeData={resume} />;
      case 'classic':
        return <ClassicTemplate resumeData={resume} />;
      case 'minimal':
        return <MinimalTemplate resumeData={resume} />;
      default:
        return <ModernTemplate resumeData={resume} />;
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
          {/* Preview Controls */}
          <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm no-print">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Back Button and Resume Info */}
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => {
                      setCurrentView('list');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center text-orange-500 hover:text-orange-600 font-semibold transition-colors group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Resumes
                  </button>
                  <div className="h-6 w-px bg-slate-300"></div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {selectedResume.name}
                    </h1>
                    <p className="text-slate-600">{selectedResume.personalInfo.fullName}</p>
                  </div>
                </div>
                {/* Template Selector and Actions */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-slate-700">Template:</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
                      className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 bg-white text-slate-900 font-medium"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGeneratingPDF}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleEditResume(selectedResume)}
                    className="bg-slate-800 text-white px-6 py-2 rounded-xl hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/50 font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Resume Preview */}
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-2 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 text-center">
                    <span className="text-sm text-slate-600 font-medium">Resume Preview</span>
                  </div>
                </div>
              </div>
              <div className="bg-white" id="resume-preview">
                {renderTemplate(selectedResume, selectedTemplate)}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default: Resume List View
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              {/* Left: Hero Text and Actions */}
              <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <Image src="/images/header.png" alt="BayForm" width={64} height={64} className="h-16 w-auto" />
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  Build Your Perfect
                  <span className="text-orange-400 block">Resume</span>
                </h1>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl">
                  Create professional resumes with our intuitive builder. Choose from beautiful templates and land your dream job.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => {
                      setCurrentView('create');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/50 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                  >
                    Create New Resume
                  </button>
                  {resumes.length > 0 && (
                    <button
                      onClick={() => document.getElementById('resumes-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/25 font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      View My Resumes
                    </button>
                  )}
                </div>
              </div>
              {/* Right: Stats */}
              <div className="flex-1 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                    <div className="text-3xl font-bold text-orange-400 mb-2">{resumes.length}</div>
                    <div className="text-slate-300 text-sm">Resume{resumes.length !== 1 ? 's' : ''} Created</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                    <div className="text-3xl font-bold text-orange-400 mb-2">3</div>
                    <div className="text-slate-300 text-sm">Professional Templates</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 col-span-2">
                    <div className="text-2xl font-bold text-orange-400 mb-2">PDF Ready</div>
                    <div className="text-slate-300 text-sm">Download instantly in high quality</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Resume Builder?</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our platform combines simplicity with professional design to help you create resumes that stand out.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature: Beautiful Templates */}
              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Beautiful Templates</h3>
                <p className="text-slate-600">Choose from modern, classic, and minimal designs that make your resume stand out.</p>
              </div>
              {/* Feature: Easy to Use */}
              <div className="text-center group">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Easy to Use</h3>
                <p className="text-slate-600">Intuitive form-based interface makes creating and editing resumes simple and fast.</p>
              </div>
              {/* Feature: Instant Download */}
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Instant Download</h3>
                <p className="text-slate-600">Generate and download professional PDF resumes instantly, ready for job applications.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Resume Grid Section */}
        <div id="resumes-section" className="py-16 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            {resumes.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h3>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Create your first professional resume in minutes. Our intuitive builder will guide you through every step.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('create');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/50 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                >
                  Create Your First Resume
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Resumes</h2>
                  <p className="text-xl text-slate-600">Manage, edit, and download your professional resumes</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resumes.map((resume, index) => (
                    <div
                      key={resume.id}
                      className="group bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
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
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            resume.template === 'modern' ? 'bg-blue-100 text-blue-800' :
                            resume.template === 'classic' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {resume.template}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 mb-6">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Experience</span>
                              <div className="font-medium text-slate-900">{resume.experience?.length || 0} positions</div>
                            </div>
                            <div>
                              <span className="text-slate-500">Updated</span>
                              <div className="font-medium text-slate-900">{new Date(resume.updatedAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreviewResume(resume)}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/50 text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleEditResume(resume)}
                            className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-xl hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/50 text-sm font-semibold transition-all duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResume(resume.id)}
                            className="bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50 text-sm font-semibold transition-all duration-300 group"
                            title="Delete Resume"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Quick Actions */}
                <div className="mt-12 text-center">
                  <button
                    onClick={() => {
                      setCurrentView('create');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-xl hover:from-slate-900 hover:to-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-500/50 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    + Create Another Resume
                  </button>
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
