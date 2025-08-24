from pathlib import Path
from typing import Optional
import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "policyqa")

def _client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError("Supabase credentials missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def _prefix(user_id: str) -> str:
    # keep everything under user_{user_id}/
    return f"user_{user_id}"

def upload_file(user_id: str, local_path: Path, remote_name: str):
    sb = _client()
    dest = f"{_prefix(user_id)}/{remote_name}"

    # Try deleting old file first (ignore if it doesn't exist)
    try:
        sb.storage.from_(SUPABASE_BUCKET).remove([dest])
    except Exception:
        pass

    # Now upload
    with open(local_path, "rb") as f:
        sb.storage.from_(SUPABASE_BUCKET).upload(dest, f)





def download_file(user_id: str, local_path: Path, remote_name: str) -> bool:
    sb = _client()
    src = f"{_prefix(user_id)}/{remote_name}"
    try:
        data = sb.storage.from_(SUPABASE_BUCKET).download(src)
    except Exception:
        return False
    local_path.parent.mkdir(parents=True, exist_ok=True)
    with open(local_path, "wb") as f:
        f.write(data)
    return True

def list_user(user_id: str):
    sb = _client()
    return sb.storage.from_(SUPABASE_BUCKET).list(_prefix(user_id))
