'use client'

import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

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

interface ScoreCardProps {
  data: AnalysisData
}

export function ScoreCard({ data }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { bg: 'score-excellent', icon: '🟢', text: 'Excellent' }
    if (score >= 70) return { bg: 'score-good', icon: '🟡', text: 'Good' }
    if (score >= 50) return { bg: 'score-needs-work', icon: '🟠', text: 'Needs Work' }
    return { bg: 'score-poor', icon: '🔴', text: 'Poor' }
  }

  const getProgressBarColor = (score: number) => {
    if (score >= 85) return 'bg-green-500'
    if (score >= 70) return 'bg-yellow-500'
    if (score >= 50) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const scoreItems = [
    { 
      label: 'ATS Friendliness', 
      score: data.ats_score, 
      icon: '🤖',
      description: 'How well your resume works with Applicant Tracking Systems'
    },
    { 
      label: 'Grammar & Clarity', 
      score: data.grammar_score, 
      icon: '✍️',
      description: 'Writing quality, readability, and language usage'
    },
    { 
      label: 'Keyword Matching', 
      score: data.keyword_match_score, 
      icon: '🔑',
      description: 'Alignment with job description keywords and requirements'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card text-center"
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Overall Resume Score
          </h3>
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={getScoreColor(data.overall_score)}
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - data.overall_score / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(data.overall_score)}`}>
                {data.overall_score}
              </span>
            </div>
          </div>
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(data.overall_score).bg} mt-4`}>
            <span>{getScoreBadge(data.overall_score).icon}</span>
            <span>{getScoreBadge(data.overall_score).text}</span>
          </div>
        </div>
      </motion.div>

      {/* Detailed Scores */}
      <div className="grid md:grid-cols-3 gap-6">
        {scoreItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {item.label}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                  {item.score}/100
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreBadge(item.score).bg}`}>
                  {getScoreBadge(item.score).text}
                </span>
              </div>
              
              <div className="progress-bar h-3">
                <motion.div
                  className={`progress-fill ${getProgressBarColor(item.score)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Feedback */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ATS Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <span>🤖</span>
            <span>ATS Analysis</span>
          </h4>
          
          <div className="space-y-4">
            {data.feedback.ats.strengths.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2 flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Strengths</span>
                </h5>
                <ul className="space-y-1">
                  {data.feedback.ats.strengths.slice(0, 3).map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.feedback.ats.weaknesses.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2 flex items-center space-x-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span>Issues</span>
                </h5>
                <ul className="space-y-1">
                  {data.feedback.ats.weaknesses.slice(0, 3).map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.feedback.ats.recommendations.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center space-x-1">
                  <LightBulbIcon className="w-4 h-4" />
                  <span>Recommendations</span>
                </h5>
                <ul className="space-y-1">
                  {data.feedback.ats.recommendations.slice(0, 2).map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Grammar Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <span>✍️</span>
            <span>Grammar & Style</span>
          </h4>
          
          <div className="space-y-4">
            {data.feedback.grammar.strengths.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2 flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Strengths</span>
                </h5>
                <ul className="space-y-1">
                  {data.feedback.grammar.strengths.slice(0, 3).map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.feedback.grammar.weaknesses.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2 flex items-center space-x-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span>Issues</span>
                </h5>
                <ul className="space-y-1">
                  {data.feedback.grammar.weaknesses.slice(0, 3).map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.feedback.grammar.recommendations.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center space-x-1">
                  <LightBulbIcon className="w-4 h-4" />
                  <span>Recommendations</span>
                </h5>
                <ul className="space-y-1">
                  {data.feedback.grammar.recommendations.slice(0, 2).map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Keywords Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <span>🔑</span>
            <span>Keywords</span>
          </h4>
          
          <div className="space-y-4">
            {data.feedback.keywords.strengths.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2 flex items-center space-x-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Strengths</span>
                </h5>
                <ul className="space-y-1">
                  {data.feedback.keywords.strengths.slice(0, 3).map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.missing_keywords.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2 flex items-center space-x-1">
                  <InformationCircleIcon className="w-4 h-4" />
                  <span>Missing Keywords</span>
                </h5>
                <div className="flex flex-wrap gap-1">
                  {data.missing_keywords.slice(0, 8).map((keyword, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                  {data.missing_keywords.length > 8 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                      +{data.missing_keywords.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {data.feedback.keywords.recommendations.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center space-x-1">
                  <LightBulbIcon className="w-4 h-4" />
                  <span>Recommendations</span>
                </h5>
                <ul className="space-y-1">
                  {data.feedback.keywords.recommendations.slice(0, 2).map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Action Items */}
      {data.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5" />
            <span>Priority Action Items</span>
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            {data.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-sm mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {suggestion}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}