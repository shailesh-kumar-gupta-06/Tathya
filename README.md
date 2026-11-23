# Tathya — Don't Guess. Verify.

**Evidence-grounded PDF document intelligence with retrieval, citations, and verification checks.**

[Live App](https://shailesh-kumar-gupta-06.github.io/Tathya/) · [API Docs](https://tathya-backend-hr3j.onrender.com/docs) · [Health Check](https://tathya-backend-hr3j.onrender.com/api/health)

> **Status:** Hackathon prototype. The deployed health endpoint has reported `retrieval: bm25` and `llm: extractive`. Some advanced capabilities are experimental and still being improved.

## Overview

Tathya allows users to upload PDFs, ask questions about their contents, and inspect source quotations and page citations. Its goal is to make document-based answers traceable rather than relying on unsupported AI responses.

## Seven Core Capabilities

| Capability | Description |
| --- | --- |
| **Multi-document analysis** | Query information across multiple uploaded PDFs. |
| **Exact citations** | Show source document, page, and supporting quotation. |
| **Safe abstention** | Respond with insufficient evidence when the system cannot support an answer. |
| **Claim verification** | Compare candidate claims with source text; current checks are heuristic, not a guarantee of correctness. |
| **Contradiction detection** | Surface potential disagreements between documents; false positives remain possible. |
| **Amendment tracking** | Analyze amendments and exceptions; authority and applicability checks are being improved. |
| **Faithfulness reporting** | Report the proportion of claims passing evidence checks, **not** an independent accuracy score. |

## Architecture: RAG and Evidence Verification

```text
PDF Upload
   ↓
PDF Text Extraction (PyMuPDF / pdfplumber)
   ↓
Text Cleaning and Chunking
   ↓
SQLite + SQLAlchemy (documents, pages, chunks)
   ↓
User Question → BM25 Retrieval
   ↓
Optional Ollama Generation / Extractive Fallback
   ↓
Claim Checks + Citations + Conflict Analysis
   ↓
Answer / Conflict Warning / Insufficient Evidence
```

**What makes this RAG?** Tathya retrieves relevant document passages before answering. When a configured LLM is available, those passages can augment the generation prompt. In the currently observed **extractive** deployment mode, it retrieves and quotes evidence without LLM-based generation. BM25 is a valid retrieval method; a vector database is not required.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Backend | Python, FastAPI, Uvicorn |
| PDF processing | PyMuPDF, pdfplumber |
| Storage | SQLite, SQLAlchemy |
| Retrieval | BM25; optional SentenceTransformers + FAISS |
| Optional LLM | Ollama with a separately configured model |
| Hosting | GitHub Pages (frontend), Render (backend) |

## Project Structure

```text
tathya/
├── backend/
│   ├── app/                 # FastAPI application code
│   ├── data/                # Local runtime data; do not commit private uploads
│   ├── requirements.txt
│   ├── requirements-ml.txt  # Optional ML dependencies
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── index.html
│   ├── .nojekyll
│   └── assets/
│       ├── css/style.css
│       └── js/
│           ├── api.js
│           ├── app.js
│           └── config.js
└── README.md
```

> Exact Python module names inside `backend/app/` depend on the current code version. Refer to the source tree for implementation details.

## Run Locally

### 1. Clone

```bash
git clone https://github.com/shailesh-kumar-gupta-06/Tathya.git
cd Tathya
```

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Review `.env.example` and configure the environment variables supported by your backend. **Never commit `.env` or credentials.**

If `backend/app/main.py` defines `app = FastAPI()`, run:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If the entry point differs, adjust the module path accordingly.

### 3. Frontend

In another terminal:

```bash
cd frontend
python3 -m http.server 5500
```

Open `http://localhost:5500`. Set the existing API URL configuration in `frontend/assets/js/config.js` to your local backend, preserving its current variable format.

### 4. Check backend

```bash
curl http://127.0.0.1:8000/api/health
```

API docs: `http://127.0.0.1:8000/docs`

## API Endpoints

These routes were visible in the deployed Swagger UI:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service health and active modes |
| GET | `/api/documents` | List documents |
| POST | `/api/documents/upload` | Upload PDF |
| GET | `/api/documents/{doc_id}` | Document details |
| DELETE | `/api/documents/{doc_id}` | Delete document |
| GET | `/api/documents/{doc_id}/pages/{page}` | Page content |
| POST | `/api/chat/ask` | Ask about selected documents |
| GET | `/api/conflicts` | Potential conflicts |
| GET | `/api/amendments` | Amendment information |
| GET | `/api/dashboard/stats` | Dashboard statistics |

See [Swagger UI](https://tathya-backend-hr3j.onrender.com/docs) for request/response schemas.

## Deployment

### Frontend — GitHub Pages

Live URL: **https://shailesh-kumar-gupta-06.github.io/Tathya/**

Publish the static `frontend/` directory using GitHub Pages, typically via a GitHub Actions workflow for a subdirectory.

### Backend — Render

Backend URL: **https://tathya-backend-hr3j.onrender.com**

Typical Render settings, **if** `backend/app/main.py` exports the FastAPI instance named `app`:

| Setting | Value |
| --- | --- |
| Root directory | `backend` |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

Configure environment variables based on `.env.example`.

**CORS:** Allow the exact GitHub Pages origin `https://shailesh-kumar-gupta-06.github.io` (not the `/Tathya/` path). A successful `/api/health` request in a browser tab does not by itself mean cross-origin requests are allowed.

**Storage:** Render's ephemeral filesystem can lose local SQLite databases and uploaded PDFs on restarts/redeploys. Use persistent storage before relying on it for real data.

**LLM:** Local Ollama models are not automatically available on Render. Extractive mode avoids a mandatory model server.

## Testing and Known Limitations

The prototype was evaluated with fictional policies, signed amendments, temporary exceptions, operational memos, and incident logs. Observed issues include:

- False `insufficient_evidence` responses when relevant evidence exists.
- False conflicts between old requirements, proposals, and actual configurations.
- Incorrect selection of event details when asked about policy requirements.
- Incomplete answers to multi-part questions.
- Evidence-support percentages that do not guarantee answer correctness.

**Do not interpret a 100% faithfulness/evidence-support score as 100% factual accuracy.** Always review citations for important decisions.

Recommended regression tests: policy versus event, superseded versus current rule, invoice amount versus approval threshold, expired exceptions, missing evidence, and unavailable Ollama.

## Security and Privacy

- Never commit `.env`, credentials, local databases, virtual environments, or user-uploaded PDFs.
- Validate uploaded PDF file type and size.
- Restrict CORS to approved origins.
- Use HTTPS and add authentication/rate limiting before handling sensitive documents.

## Project Principle

> **Don't guess. Verify.**

Tathya is a developing hackathon prototype, not a certified legal, compliance, or security decision system.
