from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import black, blue, green, orange, red, grey
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import os
import tempfile
from datetime import datetime
from typing import Dict, Any
import json

class PDFExporter:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Title'],
            fontSize=24,
            spaceAfter=30,
            textColor=blue,
            alignment=TA_CENTER
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=blue,
            borderWidth=1,
            borderColor=blue,
            borderPadding=5
        ))
        
        # Score style
        self.styles.add(ParagraphStyle(
            name='Score',
            parent=self.styles['Normal'],
            fontSize=14,
            alignment=TA_CENTER,
            spaceBefore=10,
            spaceAfter=10
        ))
        
        # Feedback style
        self.styles.add(ParagraphStyle(
            name='Feedback',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceBefore=5,
            spaceAfter=5,
            leftIndent=20
        ))
    
    async def create_report(self, analysis_data: Dict[str, Any], cover_letter: str = "", 
                          filename: str = "resume_report") -> str:
        """Create PDF report with analysis and cover letter"""
        
        # Create temporary file
        temp_dir = tempfile.gettempdir()
        pdf_path = os.path.join(temp_dir, f"{filename}.pdf")
        
        # Create PDF document
        doc = SimpleDocTemplate(pdf_path, pagesize=letter, topMargin=inch, bottomMargin=inch)
        story = []
        
        # Parse analysis data if it's a string
        if isinstance(analysis_data, str):
            try:
                analysis_data = json.loads(analysis_data)
            except json.JSONDecodeError:
                raise ValueError("Invalid analysis data format")
        
        # Add title and header
        story.extend(self._create_header())
        
        # Add executive summary
        story.extend(self._create_executive_summary(analysis_data))
        
        # Add detailed scores
        story.extend(self._create_scores_section(analysis_data))
        
        # Add feedback sections
        story.extend(self._create_feedback_section(analysis_data))
        
        # Add suggestions
        story.extend(self._create_suggestions_section(analysis_data))
        
        # Add cover letter if provided
        if cover_letter:
            story.append(PageBreak())
            story.extend(self._create_cover_letter_section(cover_letter))
        
        # Add footer
        story.extend(self._create_footer())
        
        # Build PDF
        doc.build(story)
        
        return pdf_path
    
    def _create_header(self) -> list:
        """Create report header"""
        elements = []
        
        # Title
        title = Paragraph("ResumeGenie Analysis Report", self.styles['CustomTitle'])
        elements.append(title)
        
        # Generation date
        date_str = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        date_para = Paragraph(f"Generated on {date_str}", self.styles['Normal'])
        elements.append(date_para)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _create_executive_summary(self, analysis_data: Dict[str, Any]) -> list:
        """Create executive summary section"""
        elements = []
        
        # Section header
        header = Paragraph("📋 Executive Summary", self.styles['SectionHeader'])
        elements.append(header)
        
        # Overall score
        overall_score = analysis_data.get('overall_score', 0)
        score_color = self._get_score_color(overall_score)
        
        score_text = f"<font color='{score_color}'>Overall Resume Score: {overall_score}/100</font>"
        score_para = Paragraph(score_text, self.styles['Score'])
        elements.append(score_para)
        
        # Score interpretation
        interpretation = self._get_score_interpretation(overall_score)
        interp_para = Paragraph(interpretation, self.styles['Normal'])
        elements.append(interp_para)
        
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _create_scores_section(self, analysis_data: Dict[str, Any]) -> list:
        """Create detailed scores section"""
        elements = []
        
        # Section header
        header = Paragraph("📊 Detailed Scores", self.styles['SectionHeader'])
        elements.append(header)
        
        # Scores table
        scores_data = [
            ['Category', 'Score', 'Status'],
            ['ATS Friendliness', f"{analysis_data.get('ats_score', 0)}/100", 
             self._get_status_emoji(analysis_data.get('ats_score', 0))],
            ['Grammar & Clarity', f"{analysis_data.get('grammar_score', 0)}/100", 
             self._get_status_emoji(analysis_data.get('grammar_score', 0))],
            ['Keyword Match', f"{analysis_data.get('keyword_match_score', 0)}/100", 
             self._get_status_emoji(analysis_data.get('keyword_match_score', 0))],
        ]
        
        scores_table = Table(scores_data, colWidths=[2*inch, 1*inch, 1*inch])
        scores_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), blue),
            ('TEXTCOLOR', (0, 0), (-1, 0), black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), grey),
            ('GRID', (0, 0), (-1, -1), 1, black),
        ]))
        
        elements.append(scores_table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _create_feedback_section(self, analysis_data: Dict[str, Any]) -> list:
        """Create feedback section"""
        elements = []
        
        feedback = analysis_data.get('feedback', {})
        
        # ATS Feedback
        if 'ats' in feedback:
            elements.extend(self._create_category_feedback("🤖 ATS Friendliness", feedback['ats']))
        
        # Grammar Feedback
        if 'grammar' in feedback:
            elements.extend(self._create_category_feedback("✍️ Grammar & Clarity", feedback['grammar']))
        
        # Keywords Feedback
        if 'keywords' in feedback:
            elements.extend(self._create_category_feedback("🔑 Keyword Optimization", feedback['keywords']))
        
        # Missing keywords
        missing_keywords = analysis_data.get('missing_keywords', [])
        if missing_keywords:
            elements.append(Paragraph("❌ Missing Keywords", self.styles['SectionHeader']))
            keywords_text = ", ".join(missing_keywords[:10])  # Limit to 10 keywords
            keywords_para = Paragraph(f"Consider adding these keywords: {keywords_text}", self.styles['Feedback'])
            elements.append(keywords_para)
            elements.append(Spacer(1, 15))
        
        return elements
    
    def _create_category_feedback(self, title: str, category_feedback: Dict[str, list]) -> list:
        """Create feedback for a specific category"""
        elements = []
        
        elements.append(Paragraph(title, self.styles['SectionHeader']))
        
        # Strengths
        strengths = category_feedback.get('strengths', [])
        if strengths:
            elements.append(Paragraph("✅ <b>Strengths:</b>", self.styles['Normal']))
            for strength in strengths[:3]:  # Limit to 3
                elements.append(Paragraph(f"• {strength}", self.styles['Feedback']))
        
        # Weaknesses
        weaknesses = category_feedback.get('weaknesses', [])
        if weaknesses:
            elements.append(Paragraph("⚠️ <b>Areas for Improvement:</b>", self.styles['Normal']))
            for weakness in weaknesses[:3]:  # Limit to 3
                elements.append(Paragraph(f"• {weakness}", self.styles['Feedback']))
        
        # Recommendations
        recommendations = category_feedback.get('recommendations', [])
        if recommendations:
            elements.append(Paragraph("💡 <b>Recommendations:</b>", self.styles['Normal']))
            for rec in recommendations[:3]:  # Limit to 3
                elements.append(Paragraph(f"• {rec}", self.styles['Feedback']))
        
        elements.append(Spacer(1, 15))
        
        return elements
    
    def _create_suggestions_section(self, analysis_data: Dict[str, Any]) -> list:
        """Create suggestions section"""
        elements = []
        
        suggestions = analysis_data.get('suggestions', [])
        if not suggestions:
            return elements
        
        # Section header
        header = Paragraph("💡 Action Items", self.styles['SectionHeader'])
        elements.append(header)
        
        # Add suggestions
        for i, suggestion in enumerate(suggestions[:8], 1):  # Limit to 8 suggestions
            suggestion_para = Paragraph(f"{i}. {suggestion}", self.styles['Feedback'])
            elements.append(suggestion_para)
        
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _create_cover_letter_section(self, cover_letter: str) -> list:
        """Create cover letter section"""
        elements = []
        
        # Section header
        header = Paragraph("💌 Generated Cover Letter", self.styles['SectionHeader'])
        elements.append(header)
        
        # Cover letter content
        # Split into paragraphs and format
        paragraphs = cover_letter.split('\n\n')
        for para in paragraphs:
            if para.strip():
                para_element = Paragraph(para.strip(), self.styles['Normal'])
                elements.append(para_element)
                elements.append(Spacer(1, 10))
        
        return elements
    
    def _create_footer(self) -> list:
        """Create report footer"""
        elements = []
        
        elements.append(Spacer(1, 30))
        footer_text = "Generated by <b>ResumeGenie</b> - AI-powered resume optimization"
        footer_para = Paragraph(footer_text, self.styles['Normal'])
        elements.append(footer_para)
        
        return elements
    
    def _get_score_color(self, score: int) -> str:
        """Get color based on score"""
        if score >= 85:
            return "green"
        elif score >= 70:
            return "orange"
        else:
            return "red"
    
    def _get_status_emoji(self, score: int) -> str:
        """Get status emoji based on score"""
        if score >= 85:
            return "🟢 Excellent"
        elif score >= 70:
            return "🟡 Good"
        elif score >= 50:
            return "🟠 Needs Work"
        else:
            return "🔴 Poor"
    
    def _get_score_interpretation(self, score: int) -> str:
        """Get score interpretation text"""
        if score >= 90:
            return "🎉 Excellent! Your resume is well-optimized and should perform very well with ATS systems and recruiters."
        elif score >= 80:
            return "👍 Great work! Your resume is in good shape with minor areas for improvement."
        elif score >= 70:
            return "👌 Good foundation! Some optimization will help your resume stand out more."
        elif score >= 60:
            return "⚠️ Your resume needs some work to be competitive. Focus on the recommendations below."
        else:
            return "🚨 Significant improvements needed. Please address the major issues identified below."