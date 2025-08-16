import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

# Use /tmp on servers like Render; overridden by DATA_DIR env if provided
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.getenv("DATA_DIR", "/tmp/policyqa"))
PDF_DIR = DATA_DIR / "pdfs"                # local cache (ephemeral on Render)
DATA_DIR.mkdir(parents=True, exist_ok=True)
PDF_DIR.mkdir(parents=True, exist_ok=True)

# Models
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
EMBED_DIM = 384  # all-MiniLM-L6-v2
TOP_K = 5
CHUNK_SIZE_WORDS = 180
CHUNK_OVERLAP_WORDS = 40

# Supabase (for persistent storage)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "policyqa")
