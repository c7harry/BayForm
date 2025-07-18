// JobDescriptionForm: Modal form for entering job description details
import React, { useState } from 'react';
import { JobDescription } from '@/types/resume';

// Props for the form component
interface JobDescriptionFormProps {
  onSubmit: (jobDescription: JobDescription) => void;
  onCancel: () => void;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({ onSubmit, onCancel }) => {
  // State for the job description fields
  const [jobDescription, setJobDescription] = useState<JobDescription>({
    title: '',
    company: '',
    description: '',
    requirements: [],
    preferredSkills: []
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(jobDescription);
  };

  // Update a specific field in the job description
  const updateField = (field: keyof JobDescription, value: string | string[]) => {
    setJobDescription(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Paste Job Description for AI Tailoring
          </h2>
          {/* Job Description Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={jobDescription.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Engineer"
                required
              />
            </div>
            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                value={jobDescription.company}
                onChange={(e) => updateField('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Tech Corp Inc."
                required
              />
            </div>
            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={jobDescription.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste the full job description here..."
                required
              />
            </div>
            {/* Key Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Requirements (one per line)
              </label>
              <textarea
                value={jobDescription.requirements.join('\n')}
                onChange={(e) => updateField('requirements', e.target.value.split('\n').filter(req => req.trim()))}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="• Bachelor's degree in Computer Science\n• 3+ years of React experience\n• Experience with TypeScript"
              />
            </div>
            {/* Preferred Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Skills (one per line)
              </label>
              <textarea
                value={jobDescription.preferredSkills.join('\n')}
                onChange={(e) => updateField('preferredSkills', e.target.value.split('\n').filter(skill => skill.trim()))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="• AWS experience\n• GraphQL knowledge\n• Agile/Scrum methodology"
              />
            </div>
            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Tailor Resume
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
