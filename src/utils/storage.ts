import { ResumeData, JobDescription } from '@/types/resume';

const STORAGE_KEY = 'resumeforge_resumes';

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

export const getResumes = (): ResumeData[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getResumeById = (id: string): ResumeData | null => {
  const resumes = getResumes();
  return resumes.find(r => r.id === id) || null;
};

export const deleteResume = (id: string): void => {
  const resumes = getResumes();
  const filtered = resumes.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const generateResumeId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Simulated AI resume tailoring (without external API)
export const tailorResumeToJob = (resume: ResumeData, jobDescription: JobDescription): ResumeData => {
  const jobKeywords = extractKeywords(jobDescription);
  
  return {
    ...resume,
    personalInfo: {
      ...resume.personalInfo,
      summary: tailorSummary(resume.personalInfo.summary, jobKeywords, jobDescription)
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

const tailorSummary = (originalSummary: string, keywords: string[], jobDescription: JobDescription): string => {
  const relevantKeywords = keywords.slice(0, 5);
  const tailoredSummary = originalSummary + ` Experienced in ${relevantKeywords.join(', ')} with a strong focus on ${jobDescription.title.toLowerCase()} responsibilities.`;
  return tailoredSummary;
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
