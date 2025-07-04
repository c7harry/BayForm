'use client';

import Image from 'next/image';
import { ResumeData } from '@/types/resume';

interface LandingPageProps {
  resumes: ResumeData[];
  onCreateNew: () => void;
  onEditResume: (resume: ResumeData) => void;
  onPreviewResume: (resume: ResumeData) => void;
  onDeleteResume: (id: string) => void;
}

export default function LandingPage({
  resumes,
  onCreateNew,
  onEditResume,
  onPreviewResume,
  onDeleteResume
}: LandingPageProps) {
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

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
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
                  onCreateNew();
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
                    onCreateNew();
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
                            onClick={() => onPreviewResume(resume)}
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
                              onClick={() => onEditResume(resume)}
                              className="flex-1 bg-slate-100 text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-300/50 font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => onDeleteResume(resume.id)}
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
                      onCreateNew();
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
}