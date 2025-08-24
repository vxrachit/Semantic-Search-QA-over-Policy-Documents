import fitz 
from typing import List, Tuple

def extract_pages(pdf_path: str) -> List[Tuple[int, str]]:
    """
    Returns list of (page_number, text) with 1-based page numbers.
    """
    pages = []
    with fitz.open(pdf_path) as doc:
        for i, page in enumerate(doc):
            text = page.get_text("text")
            # Fallback: if empty, you may later add OCR step
            pages.append((i + 1, text.strip()))
    return pages
