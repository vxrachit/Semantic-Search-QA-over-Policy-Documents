# 📘 Semantic Search & QA over Policy Documents

A **FastAPI backend** that allows you to upload PDF policy documents, build embeddings with FAISS + SentenceTransformers, and query them with **Google Gemini** for precise, citation-backed answers.

---

## 🚀 Features

* Upload PDF documents (`/ingest`) tied to a specific **user\_id**
* Store PDFs and FAISS indexes in **Supabase Storage**
* Generate embeddings with **SentenceTransformers**
* Search context snippets via **FAISS**
* Ask questions with `/query` → answers powered by **Google Gemini API**
* Per-user isolation (each user gets their own vector store)

---

## 📂 Project Structure

```
.
├── .gitignore
├── LICENSE
├── app
│   ├── chunking.py
│   ├── config.py
│   ├── main.py
│   ├── pdf_utils.py
│   ├── rag.py
│   ├── static
│   │   └── favicon.ico
│   ├── storage.py
│   └── vectorstore.py
├── render.yaml
└── requirements.txt

```

---

## ⚙️ Requirements

* Python **3.9+**
* Dependencies in `requirements.txt`
* A **Supabase project** with a storage bucket (default: `policyqa`)
* A **Google API key** for Gemini

---

## 🛠 Setup

### 1. Clone the repo

```bash
git clone https://github.com/vxrachit/Semantic-Search-QA-over-Policy-Documents.git

cd Semantic-Search-QA-over-Policy-Documents
```

### 2. Create & activate virtual environment

```bash
python -m venv .venv
source .venv/bin/activate   # Mac/Linux
.venv\Scripts\activate      # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment

Create a `.env` file:

```
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
SUPABASE_BUCKET=policyqa
```

---

## ▶️ Run the API

Start FastAPI with Uvicorn:

```bash
uvicorn app.main:app --reload
```

The API will be available at:
👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

Documentation:
👉 [Click Here](https://docs.vxrachit.is-a.dev/semantic-search-qa-over-policy-documents/)

---

## 📡 API Endpoints

### 1. `/ingest` → Upload & embed PDFs

POST /ingest

Request (multipart/form-data):

* user\_id: string (required) → isolates storage by user
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

Response:

```json
{
  "answer": "National Education Policy 2020 is a policy from the Ministry of Human Resource Development, Government of India [Doc: NEP_Final_English_0.pdf, p.1]. A major development since the last Policy of 1986/92 has been the Right of Children to Free and Compulsory Education Act 2009 [Doc: NEP_Final_English_0.pdf, p.5].",
  "sources": [
    {
      "doc_name": "NEP_Final_English_0.pdf",
      "page": 1,
      "score": 0.6943,
      "preview": "1 National Education Policy 2020 Ministry of Human Resource Development Government of India"
    },
    {
      "doc_name": "NEP_Final_English_0.pdf",
      "page": 5,
      "score": 0.6855,
      "preview": "this Policy. A major development since the last Policy of 1986/92 has been the Right of Children to Free and Compulsory Education Act 2009 which laid down legal…"
    },
    {
      "doc_name": "NEP_Final_English_0.pdf",
      "page": 63,
      "score": 0.6647,
      "preview": "National Education Policy 2020 62 systematic manner. Therefore, the implementation of this Policy will be led by various bodies including MHRD, CABE, Union and …"
    },
    {
      "doc_name": "NEP_Final_English_0.pdf",
      "page": 3,
      "score": 0.6631,
      "preview": "National Education Policy 2020 2 19 Effective Governance and Leadership for Higher Education Institutions 49 PART III. OTHER KEY AREAS OF FOCUS 20 Professional …"
    },
    {
      "doc_name": "NEP_Final_English_0.pdf",
      "page": 32,
      "score": 0.6565,
      "preview": "National Education Policy 2020 31 8.4. The public education system is the foundation of a vibrant democratic society, and the way it is run must be transformed …"
    }
  ]
}
```

---

## 📜 License

MIT License © Rachit Verma
