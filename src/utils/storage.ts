// Local Storage Utilities for Resume Application
import { ResumeData, JobDescription, TemplateType } from '@/types/resume';

const STORAGE_KEY = 'resumeforge_resumes';

// --- Template Migration ---
/**
 * Migrate old template names to new ones
 */
const migrateTemplate = (template: string): TemplateType => {
  switch (template) {
    case 'classic':
      return 'executive';
    case 'minimal':
      return 'creative';
    default:
      return template as TemplateType;
  }
};

// --- Resume CRUD Operations ---
/**
 * Save or update a resume in localStorage
 */
export const saveResume = (resume: ResumeData): void => {
  const resumes = getResumes();
  const existingIndex = resumes.findIndex(r => r.id === resume.id);
  if (existingIndex >= 0) {
    resumes[existingIndex] = { ...resume, updatedAt: new Date().toISOString() };
  } else {
    resumes.push(resume);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
};

/**
 * Get all resumes from localStorage
 */
export const getResumes = (): ResumeData[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  const resumes: ResumeData[] = JSON.parse(stored);
  // Migrate old template names
  return resumes.map(resume => ({
    ...resume,
    template: migrateTemplate(resume.template)
  }));
};

/**
 * Get a single resume by ID
 */
export const getResumeById = (id: string): ResumeData | null => {
  const resumes = getResumes();
  return resumes.find(r => r.id === id) || null;
};

/**
 * Delete a resume by ID
 */
export const deleteResume = (id: string): void => {
  const resumes = getResumes();
  const filtered = resumes.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Generate a unique resume ID
 */
export const generateResumeId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
