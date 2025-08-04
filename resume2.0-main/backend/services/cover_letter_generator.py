import openai
import os
from typing import Optional
import asyncio

class CoverLetterGenerator:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o")
        
    async def generate(self, resume_text: str, job_description: str, 
                      company_name: str = "", position_title: str = "") -> str:
        """Generate a personalized cover letter using OpenAI"""
        
        if not openai.api_key:
            raise ValueError("OpenAI API key not found. Please set OPENAI_API_KEY environment variable.")
        
        # Create the prompt
        prompt = self._build_prompt(resume_text, job_description, company_name, position_title)
        
        try:
            # Make async call to OpenAI
            client = openai.AsyncOpenAI(api_key=openai.api_key)
            
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert career coach and professional writer specializing in creating compelling, ATS-friendly cover letters. Your goal is to help job seekers stand out while ensuring their cover letters pass through Applicant Tracking Systems.

Guidelines for writing cover letters:
1. Keep it concise (250-400 words maximum)
2. Use a professional, confident tone
3. Include relevant keywords from the job description
4. Highlight specific achievements and quantifiable results
5. Show genuine interest in the company and role
6. Avoid generic phrases and clichés
7. Use active voice and strong action verbs
8. Ensure ATS compatibility with clean formatting
9. Create a compelling opening that grabs attention
10. End with a strong call to action

Format the cover letter with proper business letter structure."""
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            cover_letter = response.choices[0].message.content.strip()
            
            # Post-process the cover letter
            cover_letter = self._post_process_cover_letter(cover_letter, company_name, position_title)
            
            return cover_letter
            
        except Exception as e:
            raise Exception(f"Error generating cover letter: {str(e)}")
    
    def _build_prompt(self, resume_text: str, job_description: str, 
                     company_name: str, position_title: str) -> str:
        """Build the prompt for OpenAI"""
        
        prompt = f"""Please write a compelling, ATS-friendly cover letter based on the following information:

RESUME INFORMATION:
{resume_text[:2000]}  # Limit resume text to prevent token overflow

JOB DESCRIPTION:
{job_description[:1500]}  # Limit job description

ADDITIONAL DETAILS:
Company Name: {company_name if company_name else '[Company Name]'}
Position Title: {position_title if position_title else '[Position Title]'}

REQUIREMENTS:
1. Write a professional cover letter that highlights relevant experience from the resume
2. Match the tone and keywords from the job description
3. Include specific achievements and quantifiable results where possible
4. Show enthusiasm for the role and company
5. Keep it between 250-400 words
6. Use proper business letter formatting
7. Make it ATS-friendly with clean, simple formatting
8. Avoid generic phrases - make it personalized and specific
9. Include a strong opening and compelling call to action
10. If company name or position title are not provided, use placeholders like [Company Name] and [Position Title]

The cover letter should be ready to use with minimal editing and should significantly increase the candidate's chances of getting an interview."""
        
        return prompt
    
    def _post_process_cover_letter(self, cover_letter: str, company_name: str, position_title: str) -> str:
        """Post-process the generated cover letter"""
        
        # Ensure proper formatting
        cover_letter = cover_letter.strip()
        
        # Add date if not present
        if not cover_letter.startswith("Dear") and "Date:" not in cover_letter:
            cover_letter = f"[Date]\n\n{cover_letter}"
        
        # Ensure proper closing if missing
        if not any(closing in cover_letter.lower() for closing in ["sincerely", "best regards", "thank you"]):
            cover_letter += "\n\nSincerely,\n[Your Name]"
        
        # Replace placeholders if company name or position were provided
        if company_name and "[Company Name]" in cover_letter:
            cover_letter = cover_letter.replace("[Company Name]", company_name)
        
        if position_title and "[Position Title]" in cover_letter:
            cover_letter = cover_letter.replace("[Position Title]", position_title)
        
        # Clean up any double spaces or excessive line breaks
        import re
        cover_letter = re.sub(r'\n{3,}', '\n\n', cover_letter)
        cover_letter = re.sub(r' {2,}', ' ', cover_letter)
        
        return cover_letter
    
    def get_sample_cover_letter(self) -> str:
        """Return a sample cover letter for demonstration purposes"""
        return """[Date]

Dear Hiring Manager,

I am writing to express my strong interest in the [Position Title] position at [Company Name]. With my background in [relevant field] and proven track record of [specific achievement], I am excited about the opportunity to contribute to your team's continued success.

In my previous role as [previous position], I successfully [specific accomplishment with numbers/metrics]. This experience has equipped me with [relevant skills] that directly align with your requirements for [specific job requirement]. I am particularly drawn to [Company Name] because of [specific reason related to company/mission].

Your job description mentions the need for [specific requirement from job posting]. In my experience, I have [relevant experience that matches this requirement]. For example, [specific example with results]. I am confident that these skills, combined with my passion for [relevant area], make me a strong candidate for this position.

I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to [Company Name]'s objectives. Thank you for considering my application, and I look forward to hearing from you soon.

Sincerely,
[Your Name]"""