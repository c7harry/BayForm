'use client';

import { useState, useEffect } from 'react';
import { ResumeData, TemplateType } from '@/types/resume';
import { getResumes, saveResume, deleteResume } from '@/utils/storage';
import { generatePDF, generateSimplePDF } from '@/utils/pdfGenerator';
import { ResumeForm } from '@/components/ResumeForm';
import { ModernTemplate, ClassicTemplate, MinimalTemplate } from '@/components/ResumeTemplates';

export default function Home() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'preview'>('list');
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    setResumes(getResumes());
  }, []);

  const handleSaveResume = (resume: ResumeData) => {
    saveResume(resume);
    setResumes(getResumes());
    setCurrentView('list');
    setSelectedResume(null);
  };

  const handleEditResume = (resume: ResumeData) => {
    setSelectedResume(resume);
    setCurrentView('edit');
  };

  const handlePreviewResume = (resume: ResumeData) => {
    setSelectedResume(resume);
    setSelectedTemplate(resume.template);
    setCurrentView('preview');
  };

  const handleDeleteResume = (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteResume(id);
      setResumes(getResumes());
    }
  };

  const handleGeneratePDF = async () => {
    if (!selectedResume) return;
    
    setIsGeneratingPDF(true);
    try {
      await generatePDF(selectedResume, 'resume-preview');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to simple PDF generation
      generateSimplePDF(selectedResume);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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

  const renderContent = () => {
    if (currentView === 'create') {
      return (
        <ResumeForm
          onSave={handleSaveResume}
          onCancel={() => setCurrentView('list')}
        />
      );
    }

    if (currentView === 'edit' && selectedResume) {
      return (
        <ResumeForm
          initialData={selectedResume}
          onSave={handleSaveResume}
          onCancel={() => setCurrentView('list')}
        />
      );
    }

    if (currentView === 'preview' && selectedResume) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Preview Controls */}
          <div className="bg-white rounded-lg shadow-sm mb-6 p-4 no-print">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">                <button
                  onClick={() => setCurrentView('list')}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  ← Back to Resumes
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  {selectedResume.name}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Template Selector */}                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
                
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                </button>
                
                <button
                  onClick={() => handleEditResume(selectedResume)}
                  className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="bg-white rounded-lg shadow-lg">
            {renderTemplate(selectedResume, selectedTemplate)}
          </div>
        </div>
      );
    }

    // Default: Resume List
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <img src="/images/header.png" alt="BayForm" className="h-14" />
          </div>
          <button
            onClick={() => setCurrentView('create')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          >
            Create New Resume
          </button>
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first resume to get started</p>            <button
              onClick={() => setCurrentView('create')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {resume.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {resume.personalInfo.fullName}
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Template: {resume.template}</p>
                    <p>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">                    <button
                      onClick={() => handlePreviewResume(resume)}
                      className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleEditResume(resume)}
                      className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  );
}
