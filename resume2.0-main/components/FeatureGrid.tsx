'use client'

import { motion } from 'framer-motion'
import { 
  CpuChipIcon, 
  DocumentMagnifyingGlassIcon, 
  PencilSquareIcon, 
  ChartBarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: CpuChipIcon,
    title: 'ATS Optimization',
    description: 'Ensure your resume passes Applicant Tracking Systems with formatting and keyword analysis.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: DocumentMagnifyingGlassIcon,
    title: 'Smart Analysis',
    description: 'AI-powered analysis of grammar, readability, and professional language usage.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: PencilSquareIcon,
    title: 'Cover Letter Generator',
    description: 'Generate personalized, compelling cover letters tailored to specific job descriptions.',
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: ChartBarIcon,
    title: 'Detailed Scoring',
    description: 'Get comprehensive scores with actionable feedback to improve your resume.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: SparklesIcon,
    title: 'Keyword Matching',
    description: 'Match your resume keywords with job descriptions to increase visibility.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Privacy First',
    description: 'Your data is secure and never stored permanently on our servers.',
    color: 'from-gray-500 to-gray-700'
  },
  {
    icon: ClockIcon,
    title: 'Instant Results',
    description: 'Get analysis results in seconds, not hours. Optimize your resume quickly.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: DocumentArrowDownIcon,
    title: 'PDF Export',
    description: 'Download professional PDF reports with your analysis and cover letter.',
    color: 'from-emerald-500 to-green-500'
  }
]

export function FeatureGrid() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our AI-powered platform provides comprehensive tools to optimize your resume and create compelling cover letters.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="card card-hover">
                  {/* Icon */}
                  <div className="relative mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to optimize your resume?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of job seekers who have improved their interview rates with our AI-powered resume optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-primary text-lg px-8 py-3">
                🚀 Start Free Analysis
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                No signup required • Results in 30 seconds
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}