from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import uvicorn

from services.resume_analyzer import ResumeAnalyzer
from services.cover_letter_generator import CoverLetterGenerator
from services.document_processor import DocumentProcessor
from services.pdf_exporter import PDFExporter

load_dotenv()

app = FastAPI(
    title="ResumeGenie API",
    description="AI-powered resume scorer and cover letter generator",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
resume_analyzer = ResumeAnalyzer()
cover_letter_generator = CoverLetterGenerator()
document_processor = DocumentProcessor()
pdf_exporter = PDFExporter()

class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

class AnalysisResponse(BaseModel):
    ats_score: int
    grammar_score: int
    keyword_match_score: int
    overall_score: int
    feedback: dict
    missing_keywords: list
    suggestions: list

@app.get("/")
async def root():
    return {"message": "ResumeGenie API is running!"}

@app.post("/analyze-resume", response_model=AnalysisResponse)
async def analyze_resume(request: AnalysisRequest):
    """Analyze resume against job description and return scores"""
    try:
        analysis = await resume_analyzer.analyze(
            resume_text=request.resume_text,
            job_description=request.job_description
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Extract text from uploaded PDF or Word resume"""
    try:
        # Check if file type is supported
        if not document_processor.is_supported_type(file.content_type):
            raise HTTPException(
                status_code=400, 
                detail="Only PDF and Word documents (.docx) are supported"
            )
        
        contents = await file.read()
        
        # Validate document
        validation = document_processor.validate_document(contents, file.content_type)
        if not validation["valid"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid document: {validation.get('error', 'Unknown error')}"
            )
        
        # Extract text
        text = document_processor.extract_text(contents, file.content_type)
        
        if not text or len(text.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Could not extract meaningful text from the document. Please ensure the file contains readable text."
            )
        
        return {
            "text": text, 
            "filename": file.filename,
            "file_type": validation.get("detected_type", "unknown"),
            "metadata": validation
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@app.post("/generate-cover-letter")
async def generate_cover_letter(
    resume_text: str = Form(...),
    job_description: str = Form(...),
    company_name: str = Form(""),
    position_title: str = Form("")
):
    """Generate personalized cover letter"""
    try:
        cover_letter = await cover_letter_generator.generate(
            resume_text=resume_text,
            job_description=job_description,
            company_name=company_name,
            position_title=position_title
        )
        return {"cover_letter": cover_letter}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/export-report")
async def export_report(
    analysis_data: dict = Form(...),
    cover_letter: str = Form(""),
    filename: str = Form("resume_report")
):
    """Export analysis and cover letter as PDF"""
    try:
        pdf_path = await pdf_exporter.create_report(
            analysis_data=analysis_data,
            cover_letter=cover_letter,
            filename=filename
        )
        return FileResponse(
            path=pdf_path,
            filename=f"{filename}.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)