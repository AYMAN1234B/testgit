'use client'

import { useState } from 'react'
import { ResumeUpload } from '@/components/ResumeUpload'
import { JobDescriptionInput } from '@/components/JobDescriptionInput'
import { ScoreCard } from '@/components/ScoreCard'
import { CoverLetterGenerator } from '@/components/CoverLetterGenerator'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { HeroSection } from '@/components/HeroSection'
import { FeatureGrid } from '@/components/FeatureGrid'
import { motion } from 'framer-motion'

interface AnalysisData {
  ats_score: number
  grammar_score: number
  keyword_match_score: number
  overall_score: number
  feedback: {
    ats: { strengths: string[], weaknesses: string[], recommendations: string[] }
    grammar: { strengths: string[], weaknesses: string[], recommendations: string[] }
    keywords: { strengths: string[], weaknesses: string[], recommendations: string[] }
  }
  missing_keywords: string[]
  suggestions: string[]
}

export default function Home() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [step, setStep] = useState(1) // 1: Input, 2: Analysis, 3: Results
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both resume and job description')
      return
    }

    setIsAnalyzing(true)
    setError('')
    
    try {
      const response = await fetch('/api/backend/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setAnalysisData(data)
      setStep(3)
    } catch (err) {
      setError('Failed to analyze resume. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setResumeText('')
    setJobDescription('')
    setAnalysisData(null)
    setError('')
  }

  if (step === 1 && !resumeText && !jobDescription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <FeatureGrid />
        
        {/* CTA Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => setStep(2)}
            className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            🚀 Start Your Resume Analysis
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className={`h-1 w-16 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center justify-between w-80 text-sm text-gray-600 dark:text-gray-400">
          <span className={step >= 1 ? 'font-semibold text-primary-600' : ''}>Upload Resume</span>
          <span className={step >= 2 ? 'font-semibold text-primary-600' : ''}>Add Job Details</span>
          <span className={step >= 3 ? 'font-semibold text-primary-600' : ''}>View Results</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div 
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Main Content */}
      {step === 2 && (
        <motion.div 
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <ResumeUpload 
              onTextExtracted={setResumeText}
              currentText={resumeText}
            />
          </div>
          
          <div className="space-y-6">
            <JobDescriptionInput 
              value={jobDescription}
              onChange={setJobDescription}
            />
            
            {resumeText && jobDescription && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Analyzing Resume...</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Analyze My Resume</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {step === 3 && analysisData && (
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              📊 Your Resume Analysis
            </h2>
            <button
              onClick={handleReset}
              className="btn-outline"
            >
              🔄 Analyze Another Resume
            </button>
          </div>
          
          <ScoreCard data={analysisData} />
          
          <CoverLetterGenerator 
            resumeText={resumeText}
            jobDescription={jobDescription}
            analysisData={analysisData}
          />
        </motion.div>
      )}
    </div>
  )
}