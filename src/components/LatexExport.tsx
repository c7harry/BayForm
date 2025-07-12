import React, { useState } from 'react';
import { ResumeData } from '../types/resume';
import { generateLatex, exportLatex, copyLatexToClipboard, LatexTemplateType } from '../utils/latexGenerator';
import { LatexPreview } from './Preview';
import { 
  DocumentArrowDownIcon, 
  ClipboardDocumentIcon, 
  EyeIcon,
  CodeBracketIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface LatexViewProps {
  resumeData: ResumeData;
  className?: string;
  showVisualPreview?: boolean; // If true, show the visual resume preview only
  selectedTemplate?: LatexTemplateType;
}

export const LatexView: React.FC<LatexViewProps> = ({ 
  resumeData, 
  className = '',
  showVisualPreview = false,
  selectedTemplate = 'modern'
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleExportLatex = async () => {
    setIsExporting(true);
    try {
      exportLatex(resumeData, selectedTemplate);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export LaTeX file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLatex = async () => {
    setIsCopying(true);
    try {
      await copyLatexToClipboard(resumeData, selectedTemplate);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Failed to copy LaTeX code. Please try again.');
    } finally {
      setIsCopying(false);
    }
  };

  const latexContent = generateLatex(resumeData, selectedTemplate);

  if (showVisualPreview) {
    // Only render the visual resume preview (right column)
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 ${className} flex justify-center items-start py-8`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-4 w-full max-w-6xl">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-[#0F2D52] to-blue-600 rounded-lg flex items-center justify-center">
              <EyeIcon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Resume Preview - {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template</h3>
          </div>
          
          {/* Visual Preview using LatexPreview component */}
          <div className="border rounded-lg bg-white/50 overflow-hidden flex justify-center items-start py-8 min-h-[600px]">
            <div className="w-full max-w-none overflow-x-auto">
              <LatexPreview 
                resumeData={resumeData} 
                selectedTemplate={selectedTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 ${className}`}>
      {/* Header Section - Compact */}
      <div className="relative overflow-hidden py-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D52]/5 via-orange-500/5 to-[#0F2D52]/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.1),_transparent_70%)]"></div>
        
        <div className="relative px-2 sm:px-4 lg:px-6">

          {/* Action Cards - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Export Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-4 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <DocumentArrowDownIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Download .tex File</h3>
                  <p className="text-xs text-gray-600">Get the LaTeX source file</p>
                </div>
              </div>
              
              <button
                onClick={handleExportLatex}
                disabled={isExporting}
                className={`
                  w-full py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm hover:scale-105 active:scale-95
                  ${isExporting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : exportSuccess
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                  } text-white
                `}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : exportSuccess ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    <span>Download .tex File</span>
                  </>
                )}
              </button>
            </div>

            {/* Copy Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-4 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <ClipboardDocumentIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Copy to Clipboard</h3>
                  <p className="text-xs text-gray-600">Quick copy for online editors</p>
                </div>
              </div>
              
              <button
                onClick={handleCopyLatex}
                disabled={isCopying}
                className={`
                  w-full py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm hover:scale-105 active:scale-95
                  ${isCopying 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : copySuccess
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
                  } text-white
                `}
              >
                {isCopying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Copying...</span>
                  </>
                ) : copySuccess ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    <span>Copy LaTeX Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side by Side Layout - Code Preview and Resume Preview */}
      <div className="w-full pb-8 px-2 sm:px-6 xl:px-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
          {/* Left Column - LaTeX Source Code (always visible) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">LaTeX Source Code</h3>
            </div>
            {/* Always show the code preview */}
            <div className="bg-gray-900 rounded-lg overflow-hidden flex-1">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-2 flex items-center space-x-2">
                <CodeBracketIcon className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium text-sm">resume.tex</span>
                <div className="flex space-x-1 ml-auto">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="p-3 max-h-[500px] overflow-y-auto">
                <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">
                  {latexContent}
                </pre>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
};
