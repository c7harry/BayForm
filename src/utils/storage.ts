// Local Storage Utilities for Resume Application
import { ResumeData, JobDescription } from '@/types/resume';

const STORAGE_KEY = 'resumeforge_resumes';

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
  return stored ? JSON.parse(stored) : [];
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

// --- AI Tailoring Simulation ---
/**
 * Simulate tailoring a resume to a job description (no external API)
 */
export const tailorResumeToJob = (resume: ResumeData, jobDescription: JobDescription): ResumeData => {
  const jobKeywords = extractKeywords(jobDescription);
  return {
    ...resume,
    personalInfo: {
      ...resume.personalInfo
    },
    experience: resume.experience.map(exp => ({
      ...exp,
      description: enhanceDescription(exp.description, jobKeywords),
      achievements: exp.achievements.map(achievement => 
        enhanceAchievement(achievement, jobKeywords)
      )
    })),
    skills: prioritizeSkills(resume.skills, jobKeywords),
    id: generateResumeId(),
    name: `${resume.name} - ${jobDescription.company}`,
    updatedAt: new Date().toISOString()
  };
};

// --- Helper Functions for AI Tailoring ---
const extractKeywords = (jobDescription: JobDescription): string[] => {
  const text = `${jobDescription.description} ${jobDescription.requirements.join(' ')} ${jobDescription.preferredSkills.join(' ')}`;
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .slice(0, 20); // Top 20 keywords
};

const enhanceDescription = (description: string, keywords: string[]): string => {
  // Simple keyword injection
  const relevantKeywords = keywords.slice(0, 3);
  return description + ` Utilized ${relevantKeywords.join(', ')} to achieve project goals.`;
};

const enhanceAchievement = (achievement: string, keywords: string[]): string => {
  return achievement; // Keep achievements as-is for now
};

const prioritizeSkills = (skills: any[], keywords: string[]) => {
  return skills.sort((a, b) => {
    const aRelevant = keywords.some(keyword => 
      a.name.toLowerCase().includes(keyword.toLowerCase())
    );
    const bRelevant = keywords.some(keyword => 
      b.name.toLowerCase().includes(keyword.toLowerCase())
    );
    if (aRelevant && !bRelevant) return -1;
    if (!aRelevant && bRelevant) return 1;
    return 0;
  });
};
