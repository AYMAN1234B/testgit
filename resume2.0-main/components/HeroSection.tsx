'use client'

import { motion } from 'framer-motion'
import { CheckIcon, SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full text-primary-600 dark:text-primary-400 text-sm font-medium border border-primary-200 dark:border-primary-800"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>AI-Powered Resume Optimization</span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Land Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                AI-Optimized
              </span>{' '}
              Resumes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get instant ATS-friendly resume scoring, personalized feedback, and AI-generated cover letters 
              that help you stand out in today's competitive job market.
            </p>
          </motion.div>

          {/* Features list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300"
          >
            <div className="flex items-center space-x-2">
              <CheckIcon className="w-5 h-5 text-green-500" />
              <span>ATS Optimization</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckIcon className="w-5 h-5 text-green-500" />
              <span>Grammar & Style Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckIcon className="w-5 h-5 text-green-500" />
              <span>Keyword Matching</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckIcon className="w-5 h-5 text-green-500" />
              <span>AI Cover Letters</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckIcon className="w-5 h-5 text-green-500" />
              <span>PDF Reports</span>
            </div>
          </motion.div>

          {/* Demo preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16"
          >
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur-xl opacity-25"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Mock browser header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">resumegenie.com</div>
                  </div>
                </div>
                
                {/* Mock interface */}
                <div className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Upload section */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                        <DocumentTextIcon className="w-5 h-5" />
                        <span className="font-medium">Upload Resume</span>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-700/50">
                        <div className="text-gray-400 dark:text-gray-500 text-sm">
                          Drag & drop your PDF or paste text
                        </div>
                      </div>
                    </div>

                    {/* Results section */}
                    <div className="space-y-4">
                      <div className="text-primary-600 dark:text-primary-400 font-medium">
                        📊 Analysis Results
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">ATS Score</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">85/100</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Keywords</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div className="w-3/5 h-full bg-yellow-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-yellow-600">78/100</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Grammar</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div className="w-full h-full bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">92/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}