import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ResumeGenie - AI Resume Scorer & Cover Letter Generator',
  description: 'Boost your job search with AI-powered resume analysis and personalized cover letter generation. Get ATS-friendly optimization and expert feedback.',
  keywords: 'resume, cover letter, ATS, job search, AI, career, optimization',
  authors: [{ name: 'ResumeGenie Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'ResumeGenie - AI Resume Scorer & Cover Letter Generator',
    description: 'Boost your job search with AI-powered resume analysis and personalized cover letter generation.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeGenie - AI Resume Scorer & Cover Letter Generator',
    description: 'Boost your job search with AI-powered resume analysis and personalized cover letter generation.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}