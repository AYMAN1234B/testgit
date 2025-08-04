import fitz  # PyMuPDF
from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams
import io
from typing import Union

class PDFProcessor:
    def __init__(self):
        self.laparams = LAParams(
            line_margin=0.5,
            word_margin=0.1,
            char_margin=2.0,
            boxes_flow=0.5,
            all_texts=False
        )
    
    def extract_text(self, pdf_content: Union[bytes, io.BytesIO]) -> str:
        """Extract text from PDF using multiple methods for better reliability"""
        
        # Try PyMuPDF first (usually better formatting)
        try:
            text = self._extract_with_pymupdf(pdf_content)
            if text and len(text.strip()) > 50:  # Check if we got meaningful content
                return self._clean_text(text)
        except Exception as e:
            print(f"PyMuPDF extraction failed: {e}")
        
        # Fallback to pdfminer
        try:
            text = self._extract_with_pdfminer(pdf_content)
            if text and len(text.strip()) > 50:
                return self._clean_text(text)
        except Exception as e:
            print(f"PDFMiner extraction failed: {e}")
        
        raise Exception("Could not extract text from PDF. The file might be corrupted, password-protected, or contain only images.")
    
    def _extract_with_pymupdf(self, pdf_content: Union[bytes, io.BytesIO]) -> str:
        """Extract text using PyMuPDF (fitz)"""
        if isinstance(pdf_content, io.BytesIO):
            pdf_content = pdf_content.getvalue()
        
        # Open PDF document
        doc = fitz.open(stream=pdf_content, filetype="pdf")
        text = ""
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Extract text with layout preservation
            page_text = page.get_text("text")
            text += page_text + "\n"
        
        doc.close()
        return text
    
    def _extract_with_pdfminer(self, pdf_content: Union[bytes, io.BytesIO]) -> str:
        """Extract text using pdfminer as fallback"""
        if isinstance(pdf_content, bytes):
            pdf_content = io.BytesIO(pdf_content)
        
        # Reset stream position
        pdf_content.seek(0)
        
        # Extract text with layout parameters
        text = extract_text(pdf_content, laparams=self.laparams)
        return text
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        import re
        
        # Remove excessive whitespace
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        
        # Remove page numbers and headers/footers (common patterns)
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            
            # Skip likely page numbers
            if re.match(r'^\d+$', line):
                continue
                
            # Skip very short lines that are likely artifacts
            if len(line) < 3:
                continue
                
            # Skip lines with only special characters
            if re.match(r'^[^\w\s]+$', line):
                continue
            
            cleaned_lines.append(line)
        
        # Rejoin text
        cleaned_text = '\n'.join(cleaned_lines)
        
        # Final cleanup
        cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)
        cleaned_text = cleaned_text.strip()
        
        return cleaned_text
    
    def validate_pdf(self, pdf_content: Union[bytes, io.BytesIO]) -> dict:
        """Validate PDF and return metadata"""
        try:
            if isinstance(pdf_content, io.BytesIO):
                pdf_content = pdf_content.getvalue()
            
            doc = fitz.open(stream=pdf_content, filetype="pdf")
            
            metadata = {
                "valid": True,
                "page_count": len(doc),
                "encrypted": doc.needs_pass,
                "title": doc.metadata.get("title", ""),
                "author": doc.metadata.get("author", ""),
                "subject": doc.metadata.get("subject", ""),
                "creator": doc.metadata.get("creator", ""),
            }
            
            doc.close()
            return metadata
            
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "page_count": 0,
                "encrypted": False
            }
    
    def extract_text_with_formatting(self, pdf_content: Union[bytes, io.BytesIO]) -> dict:
        """Extract text with additional formatting information"""
        try:
            if isinstance(pdf_content, io.BytesIO):
                pdf_content = pdf_content.getvalue()
            
            doc = fitz.open(stream=pdf_content, filetype="pdf")
            
            result = {
                "text": "",
                "pages": [],
                "fonts": set(),
                "has_images": False
            }
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                
                # Get text
                page_text = page.get_text("text")
                result["text"] += page_text + "\n"
                
                # Get text with formatting
                text_dict = page.get_text("dict")
                fonts_on_page = set()
                
                for block in text_dict["blocks"]:
                    if "lines" in block:
                        for line in block["lines"]:
                            for span in line["spans"]:
                                font_info = f"{span['font']}_{span['size']}"
                                fonts_on_page.add(font_info)
                
                result["fonts"].update(fonts_on_page)
                result["pages"].append({
                    "page_num": page_num + 1,
                    "text": page_text,
                    "fonts": list(fonts_on_page)
                })
                
                # Check for images
                if page.get_images():
                    result["has_images"] = True
            
            result["fonts"] = list(result["fonts"])
            result["text"] = self._clean_text(result["text"])
            
            doc.close()
            return result
            
        except Exception as e:
            raise Exception(f"Error extracting formatted text: {str(e)}")