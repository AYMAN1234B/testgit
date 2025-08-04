'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { 
  DocumentArrowUpIcon, 
  DocumentTextIcon, 
  XMarkIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'
import { LoadingSpinner } from './LoadingSpinner'

interface ResumeUploadProps {
  onTextExtracted: (text: string) => void
  currentText: string
}

export function ResumeUpload({ onTextExtracted, currentText }: ResumeUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'paste'>('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or Word document (.docx)')
      return
    }

    setIsUploading(true)
    setUploadError('')
    setUploadedFile(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/backend/upload-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload resume')
      }

      const data = await response.json()
      onTextExtracted(data.text)
          } catch (error) {
        setUploadError('Failed to extract text from document. Please try again or paste your resume text.')
        console.error('Upload error:', error)
      } finally {
      setIsUploading(false)
    }
  }, [onTextExtracted])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isUploading
  })

  const handleTextPaste = (text: string) => {
    onTextExtracted(text)
    setUploadedFile(null)
    setUploadError('')
  }

  const clearResume = () => {
    onTextExtracted('')
    setUploadedFile(null)
    setUploadError('')
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          📄 Resume Input
        </h3>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setUploadMethod('upload')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              uploadMethod === 'upload'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setUploadMethod('paste')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              uploadMethod === 'paste'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {uploadMethod === 'upload' ? (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`dropzone cursor-pointer ${
              isDragActive && !isDragReject ? 'active' : ''
            } ${isDragReject ? 'reject' : ''} ${isUploading ? 'pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            
                          {isUploading ? (
              <div className="flex flex-col items-center space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-600 dark:text-gray-300">
                  Extracting text from document...
                </p>
              </div>
            ) : uploadedFile ? (
              <div className="flex items-center justify-center space-x-3">
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <DocumentArrowUpIcon className="w-12 h-12 text-gray-400" />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDragActive
                      ? isDragReject
                        ? 'File type not supported'
                        : 'Drop your document here'
                      : 'Upload your resume'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Drag & drop a PDF or Word file (.docx) or click to browse
                  </p>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Supports PDF and Word (.docx) files up to 10MB
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {uploadError}
            </motion.div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            placeholder="Paste your resume content here..."
            value={currentText}
            onChange={(e) => handleTextPaste(e.target.value)}
            className="form-textarea h-64"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentText.length} characters
            </span>
            {currentText && (
              <button
                onClick={clearResume}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-1"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      )}

      {currentText && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium">Resume text extracted successfully!</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {currentText.split(' ').length} words • Ready for analysis
          </p>
        </motion.div>
      )}
    </div>
  )
}