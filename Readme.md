# Tathya (तथ्य) – Zero-Guessing & Contradiction-Checking Document AI

> **Don't Guess. Verify.**
>
> An evidence-first AI document assistant that answers only with verifiable proof.

![Project](https://img.shields.io/badge/Project-Tathya-blue)
![Track](https://img.shields.io/badge/Track-AI%2FML-purple)
![Problem Statement](https://img.shields.io/badge/Problem-AIML--02--Option--B-orange)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)
![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20FastAPI-green)
![AI](https://img.shields.io/badge/AI-Open--Source%20Models-blue)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## About Tathya

**Tathya (तथ्य)** is a Sanskrit/Hindi word meaning *Fact* or *Truth*.

Tathya is an AI-powered document intelligence system designed to analyse, verify and retrieve information from multiple PDF documents.

Traditional AI chatbots can sometimes generate unsupported answers, overlook conflicting clauses or miss important information across multiple documents.

Tathya addresses this problem through an evidence-first approach.

Instead of simply generating answers, Tathya retrieves relevant information, verifies supporting evidence, identifies contradictions and provides exact document citations.

When sufficient evidence is unavailable, Tathya abstains from answering instead of guessing.

### Our Philosophy

**No Proof, No Answer.**

We believe AI should not just provide answers. It should also explain where those answers come from.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Our Solution](#2-our-solution)
3. [Key Features](#3-key-features)
4. [How Tathya Works](#4-how-tathya-works)
5. [System Architecture](#5-system-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Project Structure](#7-project-structure)
8. [Installation and Setup](#8-installation-and-setup)
9. [Environment Configuration](#9-environment-configuration)
10. [Running the Application](#10-running-the-application)
11. [API Documentation](#11-api-documentation)
12. [AI and Verification Pipeline](#12-ai-and-verification-pipeline)
13. [Faithfulness Score](#13-faithfulness-score)
14. [Contradiction Detection](#14-contradiction-detection)
15. [Amendment Tracking](#15-amendment-tracking)
16. [Deployment](#16-deployment)
17. [Testing and Evaluation](#17-testing-and-evaluation)
18. [Security and Privacy](#18-security-and-privacy)
19. [Limitations](#19-limitations)
20. [Team Members](#20-team-members)
21. [Development Guidelines](#21-development-guidelines)
22. [AI Tools Disclosure](#22-ai-tools-disclosure)
23. [Future Scope](#23-future-scope)
24. [Acknowledgements](#24-acknowledgements)
25. [License](#25-license)

---

## 1. Problem Statement

**Hack-a-Sol 5.0 | Track 2: AI/ML | AIML-02 – Option B**

### Zero-Guessing & Contradiction-Checking Document AI

In high-stakes fields such as banking, insurance and public policy, organisations depend on large collections of documents, including:

- Loan agreements
- Insurance policies
- Regulatory circulars
- Vendor contracts
- Terms and conditions
- Policy amendments

Traditional AI assistants can summarise documents but may overlook conflicting clauses, miss answers across multiple PDFs or generate information without sufficient evidence.

This becomes a serious problem when users need accurate and verifiable information.

### Our Challenge

Build a verifiable Document AI system that:

1. Retrieves evidence across multiple PDF documents.
2. Provides exact citations for every factual claim.
3. Detects contradictions between documents.
4. Tracks amendments and determines which version of a rule applies.
5. Refuses to answer when sufficient evidence is unavailable.
6. Calculates a faithfulness score for generated answers.

---

## 2. Our Solution

Tathya provides a unified document intelligence platform where users can upload multiple PDFs and ask questions using natural language.

The system processes documents, extracts relevant information, retrieves supporting evidence and verifies proposed answers before presenting them.

If multiple documents contain conflicting information, Tathya highlights the differences with supporting quotations.

If the available evidence is insufficient, Tathya clearly communicates the missing information instead of generating an unsupported response.

### Example Use Case

Suppose a user uploads:

| Document | Description |
|---|---|
| Loan Agreement | Original loan conditions |
| Loan Policy | Updated loan policy |
| Amendment Document | Changes to original conditions |

The user asks:

"What is the applicable interest rate?"

Tathya will:

1. Search across all uploaded documents.
2. Retrieve relevant clauses.
3. Identify different interest rates.
4. Check amendment references and effective dates.
5. Verify the supporting evidence.
6. Provide a cited answer or abstain if the applicable rate cannot be established.

---

## 3. Key Features

### 3.1 Multi-Document Evidence Retrieval

- Upload multiple PDF documents.
- Extract text page by page.
- Extract tables and structured information.
- Divide documents into meaningful chunks.
- Generate semantic embeddings.
- Search across multiple documents.
- Retrieve relevant passages for user questions.

### 3.2 Exact Citations

Every factual answer should include:

- Document name
- Page number
- Exact supporting quotation
- Evidence reference

Each claim should be linked to its supporting source.

### 3.3 Contradiction Detection

Identify potentially conflicting information across different documents.

Example:

| Source | Statement |
|---|---|
| Policy A | Minimum eligibility age is 18 |
| Policy B | Minimum eligibility age is 21 |

Tathya displays both statements with their original citations.

The system should distinguish genuine contradictions from differences caused by conditions, dates or document scope.

### 3.4 Amendment Chain Tracking

Track relationships between original documents and their amendments.

Example:

Original Policy → First Amendment → Second Amendment

Analyse:

- Amendment references
- Effective dates
- Replaced clauses
- Modified conditions
- Document relationships

Tathya must not automatically assume that the newest uploaded document is the applicable version.

### 3.5 Zero-Guessing Abstention

Tathya must not generate answers when evidence is insufficient.

Possible response statuses:

- Verified Answer
- Conflict Detected
- Insufficient Evidence
- No Confident Answer

Unsupported claims should be blocked rather than presented as facts.

### 3.6 Faithfulness Score

Calculate the percentage of answer sentences supported by at least one matching source quotation.

Example:

- Total answer sentences: 10
- Supported sentences: 8
- Faithfulness score: 80%

### 3.7 Bonus Features

Planned additional features:

- Highlight cited passages on rendered PDF pages.
- Support Hindi questions and answers.
- Perform calculations based on document clauses, such as EMI and penalties, with working shown.

---

## 4. How Tathya Works

Tathya follows an evidence-first processing pipeline.

1. **Document Upload:** Users upload PDF documents.
2. **PDF Processing:** Extract text, tables and page information.
3. **Text Chunking:** Divide extracted content into meaningful sections.
4. **Embedding Generation:** Convert text into numerical vector representations.
5. **Evidence Retrieval:** Retrieve relevant passages across multiple PDFs.
6. **Answer Generation:** Generate a proposed answer using retrieved evidence.
7. **Evidence Verification:** Check every proposed claim against its supporting source.
8. **Contradiction Detection:** Identify potentially conflicting clauses.
9. **Amendment Analysis:** Evaluate document relationships and applicability.
10. **Final Response:** Return verified information, citations, a faithfulness score or an abstention message.

---

## 5. System Architecture

```text
                    USER
                      |
                      v
        +---------------------------+
        |         FRONTEND          |
        |                           |
        |       GitHub Pages        |
        |                           |
        |         HTML5             |
        |         CSS3              |
        |    Vanilla JavaScript     |
        +-------------+-------------+
                      |
                      | HTTPS REST API
                      |
                      v
        +---------------------------+
        |         BACKEND           |
        |                           |
        |          Render           |
        |                           |
        |         FastAPI           |
        +-------------+-------------+
                      |
          +-----------+-----------+
          |                       |
          v                       v
  +---------------+       +---------------+
  | PDF PROCESSOR |       |   DATABASE    |
  |               |       |               |
  | PyMuPDF       |       | SQLite        |
  | pdfplumber    |       | SQLAlchemy    |
  +-------+-------+       +---------------+
          |
          v
  +---------------------------+
  |       RAG PIPELINE        |
  |                           |
  | Text Chunking             |
  | Sentence Transformers     |
  | FAISS Retrieval           |
  +-------------+-------------+
                |
                v
  +---------------------------+
  |        AI ENGINE          |
  |                           |
  | Open-Source LLM           |
  | Compatible Model Runtime  |
  +-------------+-------------+
                |
                v
  +---------------------------+
  |    VERIFICATION ENGINE    |
  |                           |
  | Evidence Verification     |
  | Citation Validation       |
  | Contradiction Detection   |
  | Amendment Tracking        |
  | Faithfulness Calculation  |
  +-------------+-------------+
                |
                v
  +---------------------------+
  |      FINAL RESPONSE       |
  |                           |
  | Verified Answer           |
  | Exact Citations           |
  | Faithfulness Score        |
  | Conflict Alerts           |
  | Abstention                |
  +---------------------------+
```

---

## 6. Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | HTML5 | Application structure |
| Styling | CSS3 | User interface |
| Frontend Logic | Vanilla JavaScript | Interactions and API requests |
| Frontend Hosting | GitHub Pages | Static hosting |
| Backend | Python | Application logic |
| API Framework | FastAPI | REST APIs |
| Backend Hosting | Render | Backend deployment |
| PDF Processing | PyMuPDF | Text and page extraction |
| Table Extraction | pdfplumber | Table extraction |
| Embeddings | Sentence Transformers | Semantic representations |
| Vector Search | FAISS | Evidence retrieval |
| LLM | Open-source model | Answer generation |
| Model Runtime | Ollama / compatible runtime | Model inference |
| Database | SQLite | Application metadata |
| ORM | SQLAlchemy | Database operations |
| Validation | Pydantic | Input and output validation |
| Version Control | Git and GitHub | Collaboration |

All selected models, libraries and datasets will be reviewed for licence compatibility.

**AI API Policy:** The AIML-02 problem requires the complete pipeline to run on open-source models without paid AI APIs. Tathya will follow this requirement.

---

## 7. Project Structure

```text
tathya/
│
├── frontend/
│   ├── index.html
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css
│   │   │   ├── dashboard.css
│   │   │   └── responsive.css
│   │   │
│   │   ├── js/
│   │   │   ├── config.js
│   │   │   ├── api.js
│   │   │   ├── dashboard.js
│   │   │   ├── documents.js
│   │   │   ├── chat.js
│   │   │   ├── conflicts.js
│   │   │   ├── amendments.js
│   │   │   └── pdf-viewer.js
│   │   │
│   │   └── images/
│   │
│   └── .nojekyll
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   │
│   │   ├── api/
│   │   │   ├── documents.py
│   │   │   ├── chat.py
│   │   │   ├── conflicts.py
│   │   │   ├── amendments.py
│   │   │   ├── reports.py
│   │   │   └── dashboard.py
│   │   │
│   │   ├── core/
│   │   │   ├── pdf_parser.py
│   │   │   ├── table_extractor.py
│   │   │   ├── chunker.py
│   │   │   ├── embeddings.py
│   │   │   ├── vector_store.py
│   │   │   ├── retriever.py
│   │   │   └── llm.py
│   │   │
│   │   ├── engines/
│   │   │   ├── answer_engine.py
│   │   │   ├── evidence_engine.py
│   │   │   ├── citation_engine.py
│   │   │   ├── verification_engine.py
│   │   │   ├── contradiction_engine.py
│   │   │   ├── amendment_engine.py
│   │   │   └── faithfulness_engine.py
│   │   │
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── database/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── storage/
│   ├── uploads/
│   ├── processed/
│   ├── vector_index/
│   └── reports/
│
├── sample_data/
│
├── scripts/
│   ├── setup.sh
│   ├── start.sh
│   ├── setup.ps1
│   └── start.ps1
│
├── docs/
│   ├── architecture.md
│   ├── verification_pipeline.md
│   └── API.md
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 8. Installation and Setup

### Prerequisites

Install:

- Python 3.11
- Git
- Ollama or another compatible open-source model runtime
- A compatible open-source language model
- A compatible embedding model

Node.js is not required for the Vanilla JavaScript frontend.

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/tathya.git

cd tathya
```

### Step 2: Setup Backend

**Ubuntu / Linux**

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

**Windows PowerShell**

```powershell
cd backend

python -m venv venv

.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

### Step 3: Configure AI Model

Install Ollama and download the selected compatible model.

Example:

```bash
ollama pull llama3.2:1b
```

Start the local model runtime:

```bash
ollama serve
```

The final model will be selected after testing hardware compatibility, inference quality and licence requirements.

### Step 4: Environment Configuration

Create a `.env` file using `.env.example`.

### Step 5: Start Backend

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 9. Environment Configuration

Example backend `.env.example`:

```env
APP_NAME=Tathya
APP_ENV=development
DEBUG=true

DATABASE_URL=sqlite:///./tathya.db

UPLOAD_DIR=../storage/uploads
PROCESSED_DIR=../storage/processed
VECTOR_DIR=../storage/vector_index

MAX_UPLOAD_SIZE_MB=20

LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
LLM_MODEL=llama3.2:1b

EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

FRONTEND_URL=http://localhost:5500
ALLOWED_ORIGINS=http://localhost:5500
```

These are example development settings.

Production settings must be configured separately.

Never commit actual secrets, API credentials or private environment files to GitHub.

---

## 10. Running the Application

### Start Backend

```bash
cd backend

uvicorn app.main:app --reload --port 8000
```

### Start Frontend

Open another terminal:

```bash
cd frontend

python -m http.server 5500
```

Open the application:

```text
http://localhost:5500
```

The frontend communicates with the backend through JavaScript Fetch API requests.

---

## 11. API Documentation

The following endpoints are planned for the application.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/upload` | Upload PDF documents |
| GET | `/api/documents` | Retrieve uploaded documents |
| GET | `/api/documents/{id}` | Get document details |
| DELETE | `/api/documents/{id}` | Delete a document |
| POST | `/api/chat/ask` | Ask questions |
| GET | `/api/conflicts` | Retrieve detected conflicts |
| GET | `/api/amendments` | Retrieve amendment chains |
| GET | `/api/reports/{id}` | Retrieve analysis reports |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/documents/{id}/pages/{page}` | Retrieve page information |

### Example Request

```json
{
  "question": "What is the applicable interest rate?",
  "document_ids": [
    "doc_001",
    "doc_002"
  ]
}
```

### Example Response

```json
{
  "status": "conflict_detected",
  "answer": null,
  "faithfulness_score": null,
  "citations": [],
  "conflicts": [
    {
      "document": "loan_policy.pdf",
      "page": 4,
      "quote": "The interest rate shall be 8%."
    },
    {
      "document": "updated_policy.pdf",
      "page": 7,
      "quote": "The revised interest rate shall be 9%."
    }
  ],
  "message": "Conflicting information found. The applicable rate could not be verified."
}
```

*Note: These are illustrative API contracts. Final response fields may change during implementation.*

---

## 12. AI and Verification Pipeline

### 12.1 PDF Extraction

PyMuPDF extracts text page by page.

pdfplumber handles table extraction.

The system preserves document metadata and page references.

### 12.2 Text Chunking

Extracted content is divided into smaller meaningful sections.

Each chunk maintains its original document ID and page number.

### 12.3 Embedding Generation

Sentence Transformers converts document chunks and user questions into numerical vector representations.

### 12.4 Evidence Retrieval

FAISS retrieves relevant chunks based on semantic similarity.

Keyword retrieval will also be used for exact figures, dates and clause references.

### 12.5 Answer Generation

The language model receives the user question and retrieved evidence.

It generates proposed claims with references to the retrieved evidence.

### 12.6 Evidence Verification

The verification engine checks:

1. Whether the cited evidence exists.
2. Whether the quotation matches the original document.
3. Whether the evidence supports the proposed claim.
4. Whether conflicting evidence exists.
5. Whether sufficient proof is available.

Only verified claims are eligible for the final response.

---

## 13. Faithfulness Score

The faithfulness score measures how much of the generated answer is supported by document evidence.

Formula:

```text
Faithfulness Score =

(Supported Answer Sentences /
 Total Answer Sentences) × 100
```

Example:

```text
Total sentences: 10

Supported sentences: 8

Faithfulness Score: 80%
```

The score will be calculated using claim-level evidence mappings, not the language model's self-assessment.

Unsupported claims will be identified and blocked according to the verification policy.

---

## 14. Contradiction Detection

The contradiction engine compares relevant statements across documents.

It evaluates:

- Subject and clause context
- Numerical values
- Dates
- Conditions
- Document scope
- Supporting quotations

Example:

```text
Document A:
Minimum age requirement = 18

Document B:
Minimum age requirement = 21

Result:
Potential contradiction detected.
```

The application displays both statements and their citations.

It must distinguish actual contradictions from statements that apply under different conditions.

---

## 15. Amendment Tracking

The amendment engine identifies relationships between original documents and their amendments.

Example:

```text
Original Agreement
        |
        v
First Amendment
        |
        v
Second Amendment
```

It analyses:

- Amendment references
- Effective dates
- Modified clauses
- Replaced conditions
- Document relationships

The system evaluates which rule applies using the available amendment evidence.

If applicability cannot be established, Tathya reports uncertainty instead of assuming the newest uploaded document is automatically valid.

---

## 16. Deployment

### Frontend – GitHub Pages

The frontend is a static HTML, CSS and JavaScript application.

Deployment steps:

1. Push frontend code to GitHub.
2. Open repository Settings.
3. Navigate to Pages.
4. Configure the deployment source.
5. Publish the frontend.

Example frontend URL:

```text
https://YOUR_USERNAME.github.io/tathya/
```

### Backend – Render

The Python FastAPI backend will be deployed using Render.

Deployment steps:

1. Connect the GitHub repository to Render.
2. Configure the backend directory as the service root.
3. Configure the Python build command.
4. Configure the start command.
5. Add production environment variables.
6. Configure CORS for the GitHub Pages domain.
7. Deploy and test the API.

Example start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Example backend URL:

```text
https://YOUR-BACKEND-NAME.onrender.com
```

### Production Considerations

- GitHub Pages hosts only the static frontend.
- Render must have access to the selected model inference runtime.
- A model running on a developer's laptop will not automatically be accessible to the deployed backend.
- Free hosting plans have compute and storage limitations.
- SQLite databases, uploaded PDFs and FAISS indexes require appropriate persistent or external storage.
- Model memory requirements and inference performance must be tested before final deployment.

The complete AI pipeline must remain based on open-source models without paid AI APIs.

---

## 17. Testing and Evaluation

Tathya will be tested using documents with known answers, conflicting clauses and amendment relationships.

### Functional Testing

| Test Case | Expected Result |
|---|---|
| Upload a valid PDF | Document processed |
| Upload multiple PDFs | All documents indexed |
| Ask a supported question | Answer with citations |
| Ask an unsupported question | Safe abstention |
| Upload conflicting clauses | Conflict alert |
| Upload amendment documents | Amendment relationships identified |
| Verify page references | Correct source pages |
| Calculate faithfulness | Evidence-based percentage |

### Evaluation Metrics

We will evaluate:

- Retrieval Precision@K
- Retrieval Recall@K
- Citation Accuracy
- Claim Verification Accuracy
- Contradiction Detection Precision and Recall
- Amendment Relationship Accuracy
- Abstention Accuracy
- Average Response Time

Actual evaluation results will be added after testing.

---

## 18. Security and Privacy

Tathya is designed with responsible document processing in mind.

Planned security measures:

- PDF file type validation.
- File size restrictions.
- Safe filename handling.
- Input validation.
- Restricted CORS configuration.
- Environment-based configuration.
- Secure handling of uploaded documents.
- No hardcoded credentials.
- Safe error handling.

Users should only upload documents they are authorised to process.

Public demonstration datasets should contain public, licensed or self-collected information.

---

## 19. Limitations

Tathya may have limitations when processing:

- Scanned PDFs without OCR.
- Poor-quality document scans.
- Complex tables.
- Handwritten content.
- Ambiguous amendment references.
- Documents with missing effective dates.
- Conflicting clauses requiring external legal interpretation.
- Very large documents on resource-limited hosting.

Tathya provides document-based evidence analysis. It does not replace legal, financial or professional advice.

---

## 20. Team Members

**Team Size: 3 Members**

| Member | Responsibility |
|---|---|
| Member 1 | Frontend Development – HTML, CSS, JavaScript |
| Member 2 | Backend Development – Python, FastAPI, PDF Processing and RAG |
| Member 3 | AI/ML Development – Verification, Contradiction Detection and Amendment Tracking |

### Team Details

- **Member 1:** [Name] – [GitHub Profile]
- **Member 2:** [Name] – [GitHub Profile]
- **Member 3:** [Name] – [GitHub Profile]

---

## 21. Development Guidelines

We follow a modular development approach.

- Keep frontend and backend independent.
- Use documented REST APIs.
- Maintain consistent API response schemas.
- Test individual modules before integration.
- Preserve document and page-level metadata.
- Verify AI-generated claims before displaying them.
- Commit changes regularly.
- Document model versions and dependencies.

### Git Workflow

```bash
git checkout -b feature/your-feature

git add .

git commit -m "Add document processing module"

git push origin feature/your-feature
```

Changes should be reviewed and merged into the main branch.

---

## 22. AI Tools Disclosure

AI-assisted development tools may be used during development.

All tools actually used must be disclosed in the final submission in accordance with the hackathon rules.

The team is responsible for:

- Understanding generated code.
- Testing implemented features.
- Reviewing model outputs.
- Verifying citations and evidence.
- Explaining the complete architecture.

The final disclosure will list the actual tools used by the team.

---

## 23. Future Scope

Potential improvements include:

- OCR support for scanned PDFs.
- Advanced table understanding.
- Multilingual document retrieval.
- Advanced clause comparison.
- Visual document change tracking.
- Exportable PDF analysis reports.
- Role-based access control.
- Improved evaluation and benchmarking.
- Support for additional document formats.

---

## 24. Acknowledgements

Developed for **Hack-a-Sol 5.0 – Track 2: AI/ML, AIML-02 Option B**.

We acknowledge the developers and maintainers of the open-source libraries, models and tools used in this project.

All third-party dependencies, models and datasets will be credited in the final repository.

---

## 25. License

This project is intended to use the MIT License, subject to the team's final licensing decision.

Third-party libraries, models and datasets remain subject to their respective licences and terms.

---

<p align="center">

# Tathya (तथ्य)

### Don't Guess. Verify.

**Making AI answers accountable through evidence.**

Built with a focus on accuracy, transparency and responsible AI.

</p>
