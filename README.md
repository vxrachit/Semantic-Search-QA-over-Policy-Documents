# 📘 Semantic Search & QA over Policy Documents (Full-Stack)

A **full-stack application** consisting of:  
- **FastAPI backend** → Handles PDF ingestion, embeddings (FAISS + SentenceTransformers), and question answering using **Google Gemini**.  
- **React + Vite frontend** → Provides a user-friendly dashboard for uploading documents, querying, and viewing results.  

---

## 🚀 Features

### Backend (FastAPI)
* Upload PDF documents (`/ingest`) tied to a specific **user_id**
* Store PDFs and FAISS indexes in **Supabase Storage**
* Generate embeddings with **SentenceTransformers**
* Search context snippets via **FAISS**
* Ask questions with `/query` → answers powered by **Google Gemini API**
* Per-user isolation (each user gets their own vector store)

### Frontend (React + Vite)
* Modern responsive UI
* PDF upload interface
* Query form with real-time results
* Results display with **citations & preview snippets**
* Mobile-friendly fallback view

---

## 📂 Project Structure

```
.
├── .gitignore
├── LICENSE
├── app                  # Backend (FastAPI)
│   ├── chunking.py
│   ├── config.py
│   ├── main.py
│   ├── pdf_utils.py
│   ├── rag.py
│   ├── static
│   │   └── favicon.ico
│   ├── storage.py
│   └── vectorstore.py
├── frontend             # Frontend (React + Vite)
│   ├── index.html
│   ├── package.json
│   ├── src
│   │   ├── main.tsx
│   │   └── components/...
│   └── vite.config.ts
├── render.yaml
└── requirements.txt
```

---

## ⚙️ Requirements

### Backend
* Python **3.9+**
* Dependencies in `requirements.txt`
* A **Supabase project** with a storage bucket (default: `policyqa`)
* A **Google API key** for Gemini

### Frontend
* Node.js **18+**
* npm or yarn

---

## 🛠 Setup

### 1. Clone the repo

```bash
git clone https://github.com/vxrachit/Semantic-Search-QA-over-Policy-Documents.git

cd Semantic-Search-QA-over-Policy-Documents
```

---

### 2. Backend Setup

Create & activate virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate   # Mac/Linux
.venv\Scripts\activate      # Windows
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure environment:

Create a `.env` file:

```
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
SUPABASE_BUCKET=policyqa
```

Run backend:

```bash
uvicorn app.main:app --reload
```

👉 API will be available at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 3. Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Configure environment:

Create a `.env` file or rename .env.example to .env:

```
VITE_API_URL=your_backend_url
```

Run frontend dev server:

```bash
npm run dev
```

👉 Frontend will be available at: [http://localhost:5173](http://localhost:5173)

---

## 📡 API Endpoints (Backend)

### 1. `/ingest` → Upload & embed PDFs

POST /ingest

Request (multipart/form-data):

* user_id: string (required) → isolates storage by user
* files: one or more PDF files

---

### 2. `/query` → Ask a question

POST /query

Request (JSON):

```json
{
  "user_id": "demo",
  "question": "What is Education Policy 2020?",
  "top_k": 5
}
```

Response includes answer + citations.

---

## 📜 License

MIT License © Rachit Verma
