from typing import List, Dict

def chunk_text_words(text: str, chunk_size: int, overlap: int) -> List[str]:
    words = text.split()
    if not words:
        return []
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end]).strip()
        if chunk:
            chunks.append(chunk)
        if end == len(words):
            break
        start = max(0, end - overlap)
    return chunks

def chunk_pages(pages, chunk_size=180, overlap=40) -> List[Dict]:
    """
    pages: list[(page_num, text)]
    returns: list of dicts with fields: {page, chunk_id, text}
    """
    out = []
    for page_num, text in pages:
        pieces = chunk_text_words(text, chunk_size, overlap)
        for ci, ch in enumerate(pieces):
            out.append({"page": page_num, "chunk_id": ci, "text": ch})
    return out
