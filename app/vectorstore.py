import json
import numpy as np
import faiss
from pathlib import Path
from typing import List, Dict, Tuple, Optional
from sentence_transformers import SentenceTransformer

from .config import DATA_DIR, EMBED_MODEL, EMBED_DIM
from .storage import upload_file, download_file


def _user_paths(user_id: str):
    root = DATA_DIR / f"user_{user_id}"
    root.mkdir(parents=True, exist_ok=True)
    return {
        "index": root / "index.faiss",
        "meta":  root / "metadata.json",
    }


def _l2_normalize(x: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(x, axis=1, keepdims=True) + 1e-12
    return x / norms


class VectorStore:
    """
    Per-user FAISS (cosine via inner-product on normalized embeddings) + metadata.json.
    Supabase is the source of truth. Local files are only used as a temporary cache.
    """

    def __init__(self, user_id: str):
        self.user_id = user_id
        self.paths = _user_paths(user_id)
        self.embed_model = SentenceTransformer(EMBED_MODEL)
        self.index: Optional[faiss.Index] = None
        self.metadata: List[Dict] = []
        self.next_id = 0

    # ---------- persistence ----------
    def _load_local(self) -> bool:
        idx_p = self.paths["index"]
        meta_p = self.paths["meta"]
        if idx_p.exists() and meta_p.exists():
            self.index = faiss.read_index(str(idx_p))
            self.metadata = json.loads(meta_p.read_text(encoding="utf-8"))
            self.next_id = 0 if not self.metadata else max(m["id"] for m in self.metadata) + 1
            return True
        return False

    def _download_from_remote(self) -> bool:
        got_idx = download_file(self.user_id, self.paths["index"], "index.faiss")
        got_meta = download_file(self.user_id, self.paths["meta"], "metadata.json")
        return got_idx and got_meta

    def load(self) -> bool:
        """
        Always load from Supabase (production-safe).
        Local files are only a cache refreshed from Supabase.
        """
        if self._download_from_remote():
            return self._load_local()
        return False

    def save(self):
        if self.index is None:
            return
        # Write to local (temp cache)
        faiss.write_index(self.index, str(self.paths["index"]))
        Path(self.paths["meta"]).write_text(
            json.dumps(self.metadata, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
        # Upload to Supabase (source of truth)
        upload_file(self.user_id, self.paths["index"], "index.faiss")
        upload_file(self.user_id, self.paths["meta"], "metadata.json")

    # ---------- vector ops ----------
    def _ensure_index(self):
        if self.index is None:
            self.index = faiss.IndexFlatIP(EMBED_DIM)

    def embed(self, texts: List[str]) -> np.ndarray:
        emb = self.embed_model.encode(
            texts,
            show_progress_bar=False,
            convert_to_numpy=True,
            normalize_embeddings=False
        )
        emb = emb.astype("float32")
        emb = _l2_normalize(emb)  # inner product == cosine similarity
        return emb

    def add(self, vectors: np.ndarray, metas: List[Dict]):
        self._ensure_index()
        ids = np.arange(self.next_id, self.next_id + len(metas)).astype("int64")
        self.index.add(vectors)  # no add_with_ids for IndexFlatIP
        for i, meta in enumerate(metas):
            meta["id"] = int(ids[i])
            self.metadata.append(meta)
        self.next_id += len(metas)

    def search(self, query_vector: np.ndarray, top_k: int = 5) -> List[Tuple[float, Dict]]:
        self._ensure_index()
        D, I = self.index.search(query_vector.astype("float32"), top_k)
        hits: List[Tuple[float, Dict]] = []
        md_by_id = {m["id"]: m for m in self.metadata}
        for score, idx in zip(D[0].tolist(), I[0].tolist()):
            if idx == -1:
                continue
            md = md_by_id.get(idx)
            if md:
                hits.append((float(score), md))
        return hits
