'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PencilSquareIcon, 
  DocumentArrowDownIcon, 
  ClipboardDocumentIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { LoadingSpinner, LoadingDots } from './LoadingSpinner'

interface CoverLetterGeneratorProps {
  resumeText: string
  jobDescription: string
  analysisData: any
}

export function CoverLetterGenerator({ 
  resumeText, 
  jobDescription, 
  analysisData 
}: CoverLetterGeneratorProps) {
  const [coverLetter, setCoverLetter] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [positionTitle, setPositionTitle] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const generateCoverLetter = async () => {
    setIsGenerating(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('resume_text', resumeText)
      formData.append('job_description', jobDescription)
      formData.append('company_name', companyName)
      formData.append('position_title', positionTitle)

      const response = await fetch('/api/backend/generate-cover-letter', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate cover letter')
      }

      const data = await response.json()
      setCoverLetter(data.cover_letter)
    } catch (err) {
      setError('Failed to generate cover letter. Please try again.')
      console.error('Cover letter generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const exportPDF = async () => {
    setIsExporting(true)
    
    try {
      const formData = new FormData()
      formData.append('analysis_data', JSON.stringify(analysisData))
      formData.append('cover_letter', coverLetter)
      formData.append('filename', 'resume_analysis_report')

      const response = await fetch('/api/backend/export-report', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to export PDF')
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume_analysis_report.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Failed to export PDF. Please try again.')
      console.error('PDF export error:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cover Letter Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <PencilSquareIcon className="w-6 h-6" />
            <span>AI Cover Letter Generator</span>
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <SparklesIcon className="w-4 h-4" />
            <span>Powered by GPT-4</span>
          </div>
        </div>

        {!coverLetter ? (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                📝 Generate a Personalized Cover Letter
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Our AI will create a compelling, ATS-friendly cover letter based on your resume and the job description. 
                The letter will highlight your relevant experience and match the job requirements.
              </p>
            </div>

            {/* Optional fields */}
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
                  placeholder="e.g. Software Engineer"
                  className="form-input"
                />
              </div>
            </div>

            <button
              onClick={generateCoverLetter}
              disabled={isGenerating}
              className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isGenerating ? (
                <>
                  <LoadingDots />
                  <span>Generating Cover Letter...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Generate AI Cover Letter</span>
                </>
              )}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cover letter display */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                  {coverLetter}
                </pre>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2"
              >
                <ClipboardDocumentIcon className="w-5 h-5" />
                <span>{copySuccess ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
              
              <button
                onClick={() => setCoverLetter('')}
                className="flex-1 btn-outline"
              >
                🔄 Generate New Version
              </button>
            </div>

            {copySuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
              >
                ✅ Cover letter copied to clipboard!
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* PDF Export */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Export Complete Report</span>
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
              📄 Professional PDF Report
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
              Download a comprehensive report including your resume analysis, scores, feedback, and{coverLetter ? ' generated cover letter' : ' (cover letter will be included if generated)'}.
            </p>
            <ul className="text-sm text-purple-600 dark:text-purple-400 space-y-1">
              <li>• Detailed score breakdown and feedback</li>
              <li>• Actionable recommendations</li>
              <li>• Missing keywords analysis</li>
              {coverLetter && <li>• AI-generated cover letter</li>}
              <li>• Professional formatting with ResumeGenie branding</li>
            </ul>
          </div>

          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {isExporting ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>Download PDF Report</span>
              </>
            )}
          </button>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}