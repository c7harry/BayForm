export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string; // e.g., 'Software', 'Technologies & Frameworks', 'General', or user-defined
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

export interface AdditionalSection {
  id: string;
  title: string; // e.g., 'Languages', 'Certifications', or user-defined
  items: string[];
}

export interface ResumeData {
  id: string;
  name: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  template: TemplateType;
  createdAt: string;
  updatedAt: string;
  additionalSections?: AdditionalSection[]; // New: for languages, certifications, and user-defined
}

export type TemplateType = 'modern' | 'classic' | 'minimal' | 'creative';

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  preferredSkills: string[];
}
