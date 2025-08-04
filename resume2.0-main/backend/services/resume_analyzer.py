import re
import nltk
import textstat
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
from typing import Dict, List, Any
import asyncio

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class ResumeAnalyzer:
    def __init__(self):
        self.stop_words = set(nltk.corpus.stopwords.words('english'))
        # Try to load spacy model, fallback if not available
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            self.nlp = None
            print("Warning: spaCy model not found. Some features may be limited.")
    
    async def analyze(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Comprehensive resume analysis"""
        
        # Run analyses in parallel
        ats_task = asyncio.create_task(self._analyze_ats_friendliness(resume_text))
        grammar_task = asyncio.create_task(self._analyze_grammar(resume_text))
        keyword_task = asyncio.create_task(self._analyze_keywords(resume_text, job_description))
        
        ats_score, ats_feedback = await ats_task
        grammar_score, grammar_feedback = await grammar_task
        keyword_score, keyword_feedback, missing_keywords = await keyword_task
        
        # Calculate overall score
        overall_score = int((ats_score + grammar_score + keyword_score) / 3)
        
        # Generate suggestions
        suggestions = self._generate_suggestions(
            ats_score, grammar_score, keyword_score,
            ats_feedback, grammar_feedback, keyword_feedback
        )
        
        return {
            "ats_score": ats_score,
            "grammar_score": grammar_score,
            "keyword_match_score": keyword_score,
            "overall_score": overall_score,
            "feedback": {
                "ats": ats_feedback,
                "grammar": grammar_feedback,
                "keywords": keyword_feedback
            },
            "missing_keywords": missing_keywords,
            "suggestions": suggestions
        }
    
    async def _analyze_ats_friendliness(self, resume_text: str) -> tuple[int, Dict[str, Any]]:
        """Analyze ATS friendliness based on formatting and structure"""
        score = 100
        feedback = {
            "strengths": [],
            "weaknesses": [],
            "recommendations": []
        }
        
        # Check for common ATS-unfriendly elements
        if len(re.findall(r'[^\w\s\-\.,]', resume_text)) > 20:
            score -= 15
            feedback["weaknesses"].append("Contains many special characters that may confuse ATS")
            feedback["recommendations"].append("Remove unnecessary special characters and symbols")
        else:
            feedback["strengths"].append("Clean formatting with minimal special characters")
        
        # Check for contact information
        if not re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text):
            score -= 20
            feedback["weaknesses"].append("No email address found")
            feedback["recommendations"].append("Include a professional email address")
        else:
            feedback["strengths"].append("Email address found")
        
        # Check for phone number
        if not re.search(r'(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}', resume_text):
            score -= 10
            feedback["weaknesses"].append("No phone number found")
            feedback["recommendations"].append("Include a phone number")
        else:
            feedback["strengths"].append("Phone number found")
        
        # Check for section headers
        common_sections = ['experience', 'education', 'skills', 'work', 'employment']
        found_sections = sum(1 for section in common_sections if section.lower() in resume_text.lower())
        if found_sections < 2:
            score -= 15
            feedback["weaknesses"].append("Missing common resume sections")
            feedback["recommendations"].append("Include standard sections like Experience, Education, and Skills")
        else:
            feedback["strengths"].append(f"Contains {found_sections} standard resume sections")
        
        # Check length (word count)
        word_count = len(resume_text.split())
        if word_count < 200:
            score -= 20
            feedback["weaknesses"].append("Resume appears too short")
            feedback["recommendations"].append("Expand with more relevant details and accomplishments")
        elif word_count > 800:
            score -= 10
            feedback["weaknesses"].append("Resume may be too long")
            feedback["recommendations"].append("Consider condensing to 1-2 pages")
        else:
            feedback["strengths"].append("Appropriate length")
        
        return max(0, min(100, score)), feedback
    
    async def _analyze_grammar(self, resume_text: str) -> tuple[int, Dict[str, Any]]:
        """Analyze grammar and readability"""
        feedback = {
            "strengths": [],
            "weaknesses": [],
            "recommendations": []
        }
        
        # Readability score (Flesch Reading Ease)
        readability = textstat.flesch_reading_ease(resume_text)
        
        # Grammar and style checks
        score = 85  # Base score
        
        # Check for readability
        if readability >= 60:
            feedback["strengths"].append("Good readability score")
            score += 10
        elif readability >= 30:
            feedback["strengths"].append("Acceptable readability")
            score += 5
        else:
            feedback["weaknesses"].append("Text may be difficult to read")
            feedback["recommendations"].append("Simplify sentence structure for better readability")
            score -= 15
        
        # Check for passive voice (simplified)
        passive_indicators = ['was', 'were', 'been', 'being', 'be']
        passive_count = sum(1 for word in passive_indicators if word in resume_text.lower().split())
        total_words = len(resume_text.split())
        passive_ratio = passive_count / total_words if total_words > 0 else 0
        
        if passive_ratio > 0.05:  # More than 5% passive voice indicators
            score -= 10
            feedback["weaknesses"].append("High use of passive voice")
            feedback["recommendations"].append("Use more active voice to sound confident and direct")
        else:
            feedback["strengths"].append("Good use of active voice")
        
        # Check for bullet points and action verbs
        if '•' in resume_text or '*' in resume_text or resume_text.count('\n-') > 3:
            feedback["strengths"].append("Uses bullet points for organization")
            score += 5
        else:
            feedback["recommendations"].append("Use bullet points to organize information")
        
        # Action verbs check
        action_verbs = ['managed', 'led', 'developed', 'created', 'implemented', 'achieved', 
                       'improved', 'increased', 'designed', 'coordinated', 'analyzed']
        found_action_verbs = sum(1 for verb in action_verbs if verb.lower() in resume_text.lower())
        
        if found_action_verbs >= 5:
            feedback["strengths"].append("Good use of action verbs")
            score += 5
        elif found_action_verbs >= 2:
            feedback["strengths"].append("Uses some action verbs")
        else:
            feedback["weaknesses"].append("Limited use of strong action verbs")
            feedback["recommendations"].append("Start bullet points with strong action verbs")
            score -= 10
        
        return max(0, min(100, score)), feedback
    
    async def _analyze_keywords(self, resume_text: str, job_description: str) -> tuple[int, Dict[str, Any], List[str]]:
        """Analyze keyword matching between resume and job description"""
        feedback = {
            "strengths": [],
            "weaknesses": [],
            "recommendations": []
        }
        
        # Extract keywords from job description
        job_keywords = self._extract_keywords(job_description)
        resume_keywords = self._extract_keywords(resume_text)
        
        # Calculate similarity using TF-IDF
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        try:
            tfidf_matrix = vectorizer.fit_transform([resume_text.lower(), job_description.lower()])
            similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            base_score = int(similarity_score * 100)
        except:
            base_score = 30  # Fallback score
        
        # Find missing important keywords
        missing_keywords = []
        matched_keywords = []
        
        for keyword in job_keywords[:20]:  # Check top 20 keywords
            if keyword.lower() in resume_text.lower():
                matched_keywords.append(keyword)
            else:
                missing_keywords.append(keyword)
        
        # Calculate keyword match percentage
        if len(job_keywords) > 0:
            match_percentage = (len(matched_keywords) / min(len(job_keywords), 20)) * 100
            score = int((base_score + match_percentage) / 2)
        else:
            score = base_score
        
        # Provide feedback
        if len(matched_keywords) > 10:
            feedback["strengths"].append(f"Strong keyword match with {len(matched_keywords)} relevant terms")
        elif len(matched_keywords) > 5:
            feedback["strengths"].append(f"Good keyword match with {len(matched_keywords)} relevant terms")
        else:
            feedback["weaknesses"].append("Limited keyword matching with job description")
        
        if len(missing_keywords) > 0:
            feedback["recommendations"].append("Include more keywords from the job description")
            feedback["recommendations"].append(f"Consider adding: {', '.join(missing_keywords[:5])}")
        
        return max(0, min(100, score)), feedback, missing_keywords[:10]
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords from text"""
        # Clean and tokenize
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        words = nltk.word_tokenize(text)
        
        # Filter out stop words and short words
        keywords = [word for word in words if word not in self.stop_words and len(word) > 2]
        
        # Get word frequency
        word_freq = nltk.FreqDist(keywords)
        
        # Return most frequent words
        return [word for word, freq in word_freq.most_common(50)]
    
    def _generate_suggestions(self, ats_score: int, grammar_score: int, keyword_score: int,
                            ats_feedback: Dict, grammar_feedback: Dict, keyword_feedback: Dict) -> List[str]:
        """Generate actionable suggestions based on analysis"""
        suggestions = []
        
        # Priority suggestions based on lowest scores
        scores = [
            (ats_score, "ATS formatting", ats_feedback["recommendations"]),
            (grammar_score, "grammar and readability", grammar_feedback["recommendations"]),
            (keyword_score, "keyword optimization", keyword_feedback["recommendations"])
        ]
        
        # Sort by score (lowest first) and add suggestions
        scores.sort(key=lambda x: x[0])
        
        for score, category, recommendations in scores:
            if score < 70:
                suggestions.append(f"🚨 Priority: Improve {category} (Score: {score}/100)")
                suggestions.extend(recommendations[:2])  # Top 2 recommendations
            elif score < 85:
                suggestions.append(f"⚠️ Consider improving {category} (Score: {score}/100)")
                suggestions.extend(recommendations[:1])  # Top recommendation
        
        # General suggestions
        if all(score >= 85 for score, _, _ in scores):
            suggestions.append("🎉 Great work! Your resume scores well across all categories.")
            suggestions.append("💡 Consider tailoring keywords for each specific job application.")
        
        return suggestions[:8]  # Limit to 8 suggestions