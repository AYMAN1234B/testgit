'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BriefcaseIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline'

interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const [companyName, setCompanyName] = useState('')
  const [positionTitle, setPositionTitle] = useState('')

  const handleClear = () => {
    onChange('')
    setCompanyName('')
    setPositionTitle('')
  }

  const sampleJobDescription = `We are seeking a Senior Software Engineer to join our growing engineering team. The ideal candidate will have 5+ years of experience in full-stack development with expertise in React, Node.js, and cloud technologies.

Responsibilities:
• Design and implement scalable web applications
• Collaborate with cross-functional teams to deliver high-quality software
• Mentor junior developers and contribute to code reviews
• Participate in technical architecture decisions

Requirements:
• Bachelor's degree in Computer Science or related field
• Strong proficiency in JavaScript, TypeScript, React, and Node.js
• Experience with AWS, Docker, and microservices architecture
• Excellent problem-solving and communication skills
• Experience with agile development methodologies

We offer competitive compensation, comprehensive benefits, and opportunities for professional growth in a collaborative environment.`

  const handleUseSample = () => {
    onChange(sampleJobDescription)
    setCompanyName('TechCorp Inc.')
    setPositionTitle('Senior Software Engineer')
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <BriefcaseIcon className="w-5 h-5" />
          <span>Job Description</span>
        </h3>
        {!value && (
          <button
            onClick={handleUseSample}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            Use Sample
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Optional company and position fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Company Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Microsoft"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">
              Position Title <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              placeholder="e.g. Software Engineer, Product Manager"
              className="form-input"
            />
          </div>
        </div>

        {/* Main job description textarea */}
        <div>
          <label className="form-label">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste the complete job description here..."
            className="form-textarea h-64"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {value.length} characters • {value.split(' ').filter(word => word.length > 0).length} words
            </span>
            {value.length > 0 && (
              <button
                onClick={handleClear}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-1"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">💡 Tips for better analysis:</p>
              <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                <li>• Include the complete job posting for accurate keyword matching</li>
                <li>• Add requirements, responsibilities, and preferred qualifications</li>
                <li>• Include company information if available</li>
              </ul>
            </div>
          </div>
        </div>

        {value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-medium">Job description added!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Ready to analyze against your resume
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}