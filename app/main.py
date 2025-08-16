from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from typing import List
import numpy as np
import os

from .config import PDF_DIR, TOP_K, CHUNK_SIZE_WORDS, CHUNK_OVERLAP_WORDS
from .pdf_utils import extract_pages
from .chunking import chunk_pages
from .vectorstore import VectorStore
from .rag import ask_llm
from .storage import upload_file

app = FastAPI(title="Policy QA (FAISS + Gemini)", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

# ---------- ingest ----------
@app.post("/ingest")
async def ingest(
    user_id: str = Form(..., description="User ID for isolation"),
    files: List[UploadFile] = File(..., description="One or more PDF files"),
):
    vs = VectorStore(user_id)

    total_chunks = 0
    for uf in files:
        if not uf.filename.lower().endswith(".pdf"):
            raise HTTPException(400, f"Unsupported file: {uf.filename}")

        # Cache locally (ephemeral), also upload raw PDF to Supabase for later
        local_pdf = PDF_DIR / f"user_{user_id}__{uf.filename}"
        local_pdf.parent.mkdir(parents=True, exist_ok=True)
        data = await uf.read()
        local_pdf.write_bytes(data)
        upload_file(user_id, local_pdf, f"pdfs/{uf.filename}")

        # Extract → chunk → embed → add
        pages = extract_pages(str(local_pdf))
        chunks = chunk_pages(pages, CHUNK_SIZE_WORDS, CHUNK_OVERLAP_WORDS)
        if not chunks:
            continue

        texts = [c["text"] for c in chunks]
        vecs = vs.embed(texts)

        metas = []
        for c in chunks:
            metas.append({
                "doc_name": uf.filename,
                "page": c["page"],
                "text": c["text"],
                "preview": c["text"][:220],
            })
        vs.add(vecs, metas)
        total_chunks += len(chunks)

    if total_chunks == 0:
        raise HTTPException(400, "No text extracted from PDFs.")
    vs.save()  # writes locally & uploads FAISS + metadata to Supabase
    return {"status": "ingested", "chunks": total_chunks}

# ---------- query ----------
class QueryIn(BaseModel):
    user_id: str
    question: str
    top_k: int | None = None

@app.post("/query")
def query(body: QueryIn):
    vs = VectorStore(body.user_id)
    if not vs.load():
        raise HTTPException(404, f"No index for user_id={body.user_id}. Ingest first.")

    q_vec = vs.embed([body.question])
    hits = vs.search(q_vec, top_k=body.top_k or TOP_K)

    # Build snippets for LLM
    snippets = []
    for score, md in hits:
        snippets.append({
            "doc_name": md["doc_name"],
            "page": md["page"],
            "text": md["text"],
            "score": round(score, 4),
        })

    answer = ask_llm(body.question, snippets)
    return {
        "answer": answer,
        "sources": [
            {
                "doc_name": s["doc_name"],
                "page": s["page"],
                "score": s["score"],
                "preview": s["text"][:160] + ("…" if len(s["text"]) > 160 else "")
            } for s in snippets
        ],
    }
