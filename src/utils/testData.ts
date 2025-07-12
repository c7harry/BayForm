// Test data for LaTeX generation
import { ResumeData } from '../types/resume';

export const testResumeData: ResumeData = {
  id: 'test-resume',
  name: 'Test Resume',
  template: 'modern',
  personalInfo: {
    fullName: 'John Doe',
    professionTitle: 'Software Engineer',
    email: 'john.doe@email.com',
    phone: '1234567890',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/johndoe',
    website: 'johndoe.dev',
    profilePicture: '',
    qrCode: {
      enabled: true,
      type: 'linkedin'
    }
  },
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '01/2020',
      endDate: '12/2023',
      current: false,
      description: 'Led development of scalable web applications',
      achievements: [
        'Increased application performance by 40%',
        'Led a team of 5 developers',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ]
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of California',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: '2019',
      gpa: '3.8',
      honors: ['Magna Cum Laude', 'Dean\'s List']
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript', category: 'Programming Languages' },
    { id: '2', name: 'React', category: 'Frameworks' },
    { id: '3', name: 'Node.js', category: 'Technologies' }
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      technologies: ['React', 'Node.js', 'MongoDB'],
      url: 'https://example.com',
      github: 'https://github.com/johndoe/ecommerce'
    }
  ],
  additionalSections: [
    {
      id: '1',
      title: 'Languages',
      items: ['English (Native)', 'Spanish (Conversational)']
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
