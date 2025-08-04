import io
from typing import Union, Dict, Any
from .pdf_processor import PDFProcessor
from .docx_processor import DocxProcessor

class DocumentProcessor:
    def __init__(self):
        self.pdf_processor = PDFProcessor()
        self.docx_processor = DocxProcessor()
        
        # Supported file types
        self.supported_types = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
        }
    
    def extract_text(self, file_content: Union[bytes, io.BytesIO], content_type: str) -> str:
        """Extract text from document based on content type"""
        
        # Normalize content type
        content_type = content_type.lower().strip()
        
        if content_type == 'application/pdf':
            return self.pdf_processor.extract_text(file_content)
        elif content_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']:
            return self.docx_processor.extract_text(file_content)
        else:
            # Try to detect file type by content if content_type is not recognized
            return self._extract_by_detection(file_content)
    
    def _extract_by_detection(self, file_content: Union[bytes, io.BytesIO]) -> str:
        """Try to detect file type and extract text accordingly"""
        
        if isinstance(file_content, io.BytesIO):
            content_bytes = file_content.getvalue()
        else:
            content_bytes = file_content
        
        # Check PDF signature
        if content_bytes.startswith(b'%PDF'):
            return self.pdf_processor.extract_text(file_content)
        
        # Check DOCX signature (ZIP archive with specific structure)
        elif content_bytes.startswith(b'PK') and b'word/' in content_bytes[:1024]:
            return self.docx_processor.extract_text(file_content)
        
        else:
            raise Exception("Unsupported file format. Please upload a PDF or Word document (.docx).")
    
    def validate_document(self, file_content: Union[bytes, io.BytesIO], content_type: str) -> Dict[str, Any]:
        """Validate document and return metadata"""
        
        content_type = content_type.lower().strip()
        
        try:
            if content_type == 'application/pdf':
                return self.pdf_processor.validate_pdf(file_content)
            elif content_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']:
                return self.docx_processor.validate_docx(file_content)
            else:
                # Try detection
                return self._validate_by_detection(file_content)
        except Exception as e:
            return {
                "valid": False,
                "error": str(e),
                "file_type": "unknown"
            }
    
    def _validate_by_detection(self, file_content: Union[bytes, io.BytesIO]) -> Dict[str, Any]:
        """Try to detect and validate file type"""
        
        if isinstance(file_content, io.BytesIO):
            content_bytes = file_content.getvalue()
        else:
            content_bytes = file_content
        
        # Check PDF signature
        if content_bytes.startswith(b'%PDF'):
            result = self.pdf_processor.validate_pdf(file_content)
            result["detected_type"] = "pdf"
            return result
        
        # Check DOCX signature
        elif content_bytes.startswith(b'PK') and b'word/' in content_bytes[:1024]:
            result = self.docx_processor.validate_docx(file_content)
            result["detected_type"] = "docx"
            return result
        
        else:
            return {
                "valid": False,
                "error": "Unsupported file format",
                "detected_type": "unknown"
            }
    
    def get_supported_types(self) -> Dict[str, str]:
        """Return supported file types"""
        return self.supported_types.copy()
    
    def is_supported_type(self, content_type: str) -> bool:
        """Check if content type is supported"""
        content_type = content_type.lower().strip()
        return (content_type in self.supported_types or 
                content_type == 'application/msword')  # Also support older .doc content type