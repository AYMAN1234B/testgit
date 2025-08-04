# 🧞‍♂️ ResumeGenie - AI Resume Scorer & Cover Letter Generator

ResumeGenie is a comprehensive AI-powered tool that helps job seekers optimize their resumes and create compelling cover letters. Get instant ATS-friendly analysis, detailed feedback, and personalized cover letters to boost your job search success.

![ResumeGenie Demo](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=ResumeGenie+Demo)

## ✨ Features

### 🤖 **AI-Powered Resume Analysis**
- **ATS Optimization**: Ensures your resume passes Applicant Tracking Systems
- **Grammar & Style Check**: Analyzes readability, grammar, and professional language
- **Keyword Matching**: Compares your resume against job descriptions for better visibility

### 📊 **Comprehensive Scoring**
- Overall resume score with detailed breakdown
- Individual scores for ATS friendliness, grammar, and keyword matching
- Visual progress bars and color-coded badges
- Actionable feedback and recommendations

### ✍️ **AI Cover Letter Generator**
- Powered by GPT-4o for high-quality content
- Personalized letters based on your resume and job description
- ATS-friendly formatting and professional tone
- Customizable company name and position title

### 📄 **Professional PDF Reports**
- Download comprehensive analysis reports
- Includes scores, feedback, and generated cover letter
- Professional formatting with ResumeGenie branding
- Ready to share with career coaches or recruiters

### 🎨 **Modern UI/UX**
- Beautiful, responsive design with Tailwind CSS
- Dark/light theme support
- Smooth animations and transitions
- Mobile-friendly interface

## 🚀 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Dropzone** - File upload functionality

### Backend
- **FastAPI** - High-performance Python web framework
- **OpenAI GPT-4o** - AI-powered cover letter generation
- **PyMuPDF** - PDF text extraction
- **NLTK & spaCy** - Natural language processing
- **scikit-learn** - Machine learning for text analysis
- **ReportLab** - PDF report generation

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **OpenAI API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/resume-genie.git
cd resume-genie
```

### 2. Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

### 3. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
cd backend
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Download spaCy model (optional but recommended)
python -m spacy download en_core_web_sm
```

### 4. Environment Configuration
Create a `.env` file in the `backend` directory:
```bash
cp backend/.env.example backend/.env
```

Edit the `.env` file and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
ENVIRONMENT=development
```

### 5. Start Both Services
```bash
# Option 1: Start both frontend and backend together
npm run dev:all

# Option 2: Start services separately
# Terminal 1 - Frontend (port 3000)
npm run dev

# Terminal 2 - Backend (port 8000)
npm run dev:backend
```

## 📖 Usage

### 1. **Upload Your Resume**
- Drag and drop a PDF file or paste your resume text
- The system supports multiple PDF extraction methods for reliability

### 2. **Add Job Description**
- Paste the complete job posting
- Include requirements, responsibilities, and qualifications
- Optionally add company name and position title

### 3. **Get Analysis**
- Receive instant scoring across three key areas
- View detailed feedback and recommendations
- See missing keywords and improvement suggestions

### 4. **Generate Cover Letter**
- Create AI-powered, personalized cover letters
- Automatically tailored to match job requirements
- Copy to clipboard or regenerate variations

### 5. **Export Results**
- Download professional PDF reports
- Share with career coaches or keep for reference
- Includes all analysis data and generated content

## 🔧 API Endpoints

### Resume Analysis
```http
POST /analyze-resume
Content-Type: application/json

{
  "resume_text": "Your resume content...",
  "job_description": "Job posting content..."
}
```

### File Upload
```http
POST /upload-resume
Content-Type: multipart/form-data

file: resume.pdf
```

### Cover Letter Generation
```http
POST /generate-cover-letter
Content-Type: multipart/form-data

resume_text: "Resume content..."
job_description: "Job description..."
company_name: "Company Name"
position_title: "Position Title"
```

### PDF Export
```http
POST /export-report
Content-Type: multipart/form-data

analysis_data: "{analysis_json}"
cover_letter: "Generated cover letter..."
filename: "report_name"
```

## 🎯 Resume Analysis Criteria

### ATS Friendliness (🤖)
- Contact information presence
- Standard section headers
- Clean formatting without special characters
- Appropriate length and structure
- File format compatibility

### Grammar & Clarity (✍️)
- Readability score (Flesch Reading Ease)
- Active vs. passive voice usage
- Action verb utilization
- Professional language assessment
- Bullet point organization

### Keyword Matching (🔑)
- TF-IDF similarity analysis
- Important keyword identification
- Missing keyword detection
- Industry-specific term matching
- Relevance scoring

## 🚧 Development

### Project Structure
```
resume-genie/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── backend/              # FastAPI backend
│   ├── services/         # Business logic
│   ├── main.py          # FastAPI app
│   └── requirements.txt  # Python dependencies
├── public/              # Static assets
└── ...
```

### Available Scripts
```bash
# Development
npm run dev              # Start frontend only
npm run dev:backend      # Start backend only
npm run dev:all         # Start both services

# Building
npm run build           # Build for production
npm run start           # Start production server

# Linting
npm run lint            # Run ESLint
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4o API
- **Tailwind CSS** for the utility-first CSS framework
- **FastAPI** for the high-performance backend framework
- **Next.js** for the React framework

## 📞 Support

For support, email support@resumegenie.com or join our [Discord community](https://discord.gg/resumegenie).

## 🗺️ Roadmap

- [ ] **Multi-language Support** - Support for resumes in multiple languages
- [ ] **Resume Templates** - Pre-built ATS-friendly resume templates
- [ ] **Job Matching** - AI-powered job recommendation engine
- [ ] **Interview Prep** - AI-generated interview questions and answers
- [ ] **Chrome Extension** - Browser extension for quick analysis
- [ ] **LinkedIn Integration** - Import profiles directly from LinkedIn

---

**Built with ❤️ by the ResumeGenie Team**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/resume-genie)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/resume-genie)