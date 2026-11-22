# Tathya (तथ्य) – Evidence-First Document Intelligence AI

> **Don't Guess. Verify.**
>
> An AI-powered document verification and investigation platform that turns multiple documents into traceable, evidence-backed answers.

![Project](https://img.shields.io/badge/Project-Tathya-blue)
![Track](https://img.shields.io/badge/Track-AI%2FML-purple)
![Problem](https://img.shields.io/badge/Problem-AIML--02--Option--B-orange)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)
![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20FastAPI-green)
![AI](https://img.shields.io/badge/AI-Open--Source%20Models-blue)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

# About Tathya

**Tathya (तथ्य)** is a Sanskrit/Hindi word meaning **Fact or Truth**.

Tathya is an AI-powered document intelligence platform designed to analyse, verify and investigate information across multiple PDF documents.

Traditional AI chatbots can generate unsupported answers, overlook conflicting clauses, miss important information across documents or fail to identify changes introduced through amendments.

Tathya addresses these challenges through an evidence-first verification approach.

Instead of simply generating answers, Tathya aims to:

- Retrieve information from multiple documents.
- Provide exact page-level citations.
- Verify individual claims against original evidence.
- Detect contradictions between documents.
- Track document amendments and applicable clauses.
- Abstain when sufficient evidence is unavailable.
- Measure how much of an answer is supported by document evidence.

### Our Philosophy

**No Proof, No Answer.**

We believe AI should not just provide answers. It should also prove where those answers come from.

---

# 1. Problem Statement

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

This creates problems when users need accurate, traceable and verifiable information.

### Our Challenge

Build a verifiable Document AI system that:

1. Retrieves evidence across multiple PDF documents.
2. Provides exact citations for every factual claim.
3. Detects contradictions between documents.
4. Tracks amendments and determines which version of a rule applies.
5. Refuses to answer when sufficient evidence is unavailable.
6. Calculates a faithfulness score for generated answers.

---

# 2. Our Solution

Tathya provides a unified document intelligence platform where users can upload multiple PDFs and ask questions using natural language.

The application processes documents, extracts relevant information, retrieves supporting evidence and verifies proposed answers before displaying them.

If multiple documents contain conflicting information, Tathya highlights the differences with their supporting quotations.

If the available evidence is insufficient, Tathya clearly communicates what is missing instead of generating an unsupported response.

### Example Use Case

Suppose a user uploads three documents:

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

# 3. Seven Core Features of Tathya

These seven capabilities define the core functionality of Tathya.

## 3.1 Multiple Documents

**Analyse multiple PDFs together instead of treating every document separately.**

Users can upload multiple PDF files and ask questions across the entire document collection.

Tathya will:

- Process multiple documents.
- Extract text and tables.
- Preserve document names and page numbers.
- Generate searchable document representations.
- Retrieve relevant evidence from different PDFs.
- Combine information from multiple sources when answering questions.

**Example:**

Upload three loan agreements and ask:

"What are the differences in their eligibility requirements?"

Tathya retrieves relevant clauses from all three documents.

## 3.2 Exact Citations

**Every factual answer must point to its original source.**

Tathya provides:

- Document name.
- Exact page number.
- Original supporting quotation.
- Evidence reference.

**Example:**

```text
Answer:
The interest rate mentioned is 8%.

Source:
Loan_Agreement.pdf

Page:
5

Supporting Evidence:
"The applicable interest rate shall be 8%."
```

Users can trace the answer back to the original document.

## 3.3 Zero Guessing

**If evidence is unavailable, Tathya does not invent an answer.**

If a question cannot be answered using the uploaded documents, Tathya communicates that sufficient evidence is unavailable.

Possible responses:

- Verified Answer
- Insufficient Evidence
- Conflicting Information
- No Confident Match

**Example:**

Question: "What is the processing fee?"

If the uploaded documents do not mention the processing fee:

```text
I don't have sufficient evidence
to answer this question.

No supporting clause was found
in the uploaded documents.
```

## 3.4 Claim Verification

**Verify every individual statement instead of trusting the complete AI-generated answer.**

Tathya divides an answer into individual factual claims and checks each claim against its supporting document evidence.

**Example:**

AI-generated answer:

"The loan amount is ₹5 lakh and the interest rate is 8%."

Verification:

| Claim | Result |
|---|---|
| Loan amount is ₹5 lakh | Verified |
| Interest rate is 8% | Verified |

If a claim is unsupported or contradicted, Tathya flags it instead of presenting it as verified.

## 3.5 Contradiction Detection

**Identify conflicting information across different documents.**

Tathya compares relevant clauses, values, dates and conditions to identify potential contradictions.

**Example:**

| Document A | Document B |
|---|---|
| Minimum age: 18 years | Minimum age: 21 years |

Result:

```text
Potential Contradiction Detected

Document A:
Minimum age = 18 years

Document B:
Minimum age = 21 years

Status:
Conflicting evidence found.
```

Both original statements and their citations remain visible.

The system must distinguish genuine contradictions from differences caused by conditions, dates or document scope.

## 3.6 Amendment Tracking

**Understand how document rules and clauses change over time.**

Tathya tracks relationships between original documents and their amendments.

Example:

```text
Original Policy
       |
       v
First Amendment
       |
       v
Second Amendment
```

It analyses:

- Amendment references.
- Effective dates.
- Modified clauses.
- Replaced conditions.
- Document relationships.
- Applicable versions, where evidence supports the conclusion.

Tathya must not automatically assume that the newest uploaded document is the applicable version.

If applicability cannot be established, it reports uncertainty.

## 3.7 Faithfulness Score

**Measure how much of an AI-generated answer is supported by document evidence.**

Tathya calculates the percentage of answer sentences supported by at least one matching source quotation.

Formula:

```text
Faithfulness Score =

(Supported Answer Sentences /
 Total Answer Sentences) × 100
```

Example:

```text
Total Answer Sentences: 10

Supported Sentences: 9

Unsupported Sentences: 1

Faithfulness Score: 90%
```

The score will be based on evidence verification rather than the language model's self-assessment.

---

# 4. What Makes Tathya Different?

Tathya is not intended to be just another PDF chatbot.

Most document assistants focus primarily on searching, summarising and answering questions from uploaded documents.

Tathya aims to extend this workflow into document investigation and answer verification.

### Traditional PDF Chatbot vs Tathya

| Capability | Traditional PDF Chatbot | Tathya |
|---|---|---|
| PDF Question Answering | Yes | Yes |
| Multiple Document Analysis | Varies by product | Core feature |
| Exact Source Citations | Varies by product | Core feature |
| Individual Claim Verification | Not always available | Core feature |
| Evidence-Based Abstention | Not guaranteed | Core feature |
| Contradiction Investigation | Not always available | Core feature |
| Amendment Relationship Tracking | Not always available | Core feature |
| Faithfulness Measurement | Not always available | Core feature |
| Evidence-Based Reports | Varies by product | Planned feature |

*This is a high-level product positioning comparison, not a claim that every competing product lacks these capabilities.*

## Our Five Key Differentiators

### 1. From Answer Generation to Answer Verification

Traditional AI workflows often focus on generating answers.

Tathya focuses on checking whether individual claims are actually supported by the source documents.

### 2. From Document Search to Document Investigation

Tathya aims to connect information across multiple documents instead of simply retrieving isolated passages.

### 3. From Conflict Identification to Amendment Intelligence

Identifying different statements is only the first step.

Tathya aims to investigate their relationships, amendment references and effective dates to determine which clauses may apply.

### 4. From AI Confidence to Evidence-Based Faithfulness

An AI model sounding confident does not make its answer correct.

Tathya uses source-backed verification to calculate how much of an answer is supported by evidence.

### 5. From Black-Box Answers to Transparent Results

Users should be able to inspect:

- What the AI answered.
- Which claims were verified.
- Which documents were used.
- Which pages contain the evidence.
- What conflicts were detected.
- Why the system abstained.

### Our Core Difference

**Tathya does not simply aim to tell users what a document says. It aims to establish what the available evidence supports, where documents disagree and what remains unverified.**

---

# 5. How Tathya Works

Tathya follows an evidence-first processing pipeline.

1. **Document Upload:** Users upload multiple PDF documents.
2. **PDF Processing:** Extract text, tables and page information.
3. **Text Chunking:** Divide extracted content into meaningful sections.
4. **Embedding Generation:** Convert text into numerical vector representations.
5. **Evidence Retrieval:** Retrieve relevant passages across multiple PDFs.
6. **Answer Generation:** Generate proposed answers using retrieved evidence.
7. **Claim Verification:** Check individual claims against their sources.
8. **Contradiction Detection:** Identify potentially conflicting clauses.
9. **Amendment Analysis:** Evaluate document relationships and applicability.
10. **Faithfulness Calculation:** Calculate the evidence-supported answer percentage.
11. **Final Response:** Return verified information, citations, conflicts, a faithfulness score or an abstention message.

---

# 6. System Architecture

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
             +----------+----------+
             |                     |
             v                     v
     +---------------+     +---------------+
     | PDF PROCESSOR |     |   DATABASE    |
     |               |     |               |
     | PyMuPDF       |     | SQLite        |
     | pdfplumber    |     | SQLAlchemy    |
     +-------+-------+     +---------------+
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
     | Claim Verification        |
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

# 7. Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | HTML5 | Application structure |
| Styling | CSS3 | User interface |
| Frontend Logic | Vanilla JavaScript | API requests and interactions |
| Frontend Hosting | GitHub Pages | Static hosting |
| Backend | Python | Application logic |
| API Framework | FastAPI | REST APIs |
| Backend Hosting | Render | Backend deployment |
| PDF Processing | PyMuPDF | Text and page extraction |
| Table Extraction | pdfplumber | Table extraction |
| Embeddings | Sentence Transformers | Semantic representations |
| Vector Search | FAISS | Evidence retrieval |
| LLM | Open-Source Model | Answer generation |
| Model Runtime | Ollama / Compatible Runtime | Model inference |
| Database | SQLite | Application metadata |
| ORM | SQLAlchemy | Database operations |
| Validation | Pydantic | Input and output validation |
| Version Control | Git and GitHub | Collaboration |

All selected models, libraries and datasets will be reviewed for licence compatibility.

**AI API Policy:** The selected AIML-02 problem requires the complete pipeline to run on open-source models without paid AI APIs. Tathya will follow this requirement.

---

# 8. Project Structure

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
│   │   │   ├── claims.js
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
│   │   │   ├── claims.py
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
│   │   │   ├── claim_engine.py
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

# 9. Installation and Setup

### Prerequisites

- Python 3.11
- Git
- Ollama or compatible open-source model runtime
- Compatible open-source language model
- Compatible embedding model

Node.js is not required for the Vanilla JavaScript frontend.

### Step 1: Clone Repository

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

Start the model runtime:

```bash
ollama serve
```

The final model will be selected after testing hardware compatibility, inference quality and licence requirements.

### Step 4: Configure Environment Variables

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

# 10. Environment Configuration

Example `.env.example`:

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

Never commit actual credentials or private environment files to GitHub.

---

# 11. Running the Application

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

Open:

```text
http://localhost:5500
```

The frontend communicates with the backend through JavaScript Fetch API requests.

---

# 12. API Documentation

The following endpoints are planned for the application.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/upload` | Upload PDF documents |
| GET | `/api/documents` | Retrieve uploaded documents |
| GET | `/api/documents/{id}` | Get document details |
| DELETE | `/api/documents/{id}` | Delete a document |
| POST | `/api/chat/ask` | Ask questions |
| GET | `/api/claims/{id}` | Retrieve claim verification |
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

*These are illustrative API contracts. Final response fields may change during implementation.*

---

# 13. AI and Verification Pipeline

### 13.1 PDF Extraction

PyMuPDF extracts text page by page.

pdfplumber handles table extraction.

The system preserves document metadata and page references.

### 13.2 Text Chunking

Extracted content is divided into smaller meaningful sections.

Each chunk maintains its original document ID and page number.

### 13.3 Embedding Generation

Sentence Transformers converts document chunks and user questions into numerical vector representations.

### 13.4 Evidence Retrieval

FAISS retrieves relevant chunks based on semantic similarity.

Keyword retrieval can also be used for exact figures, dates and clause references.

### 13.5 Answer Generation

The language model receives the user question and retrieved evidence.

It generates proposed claims with references to supporting evidence.

### 13.6 Claim Verification

The verification engine:

1. Separates the answer into factual claims.
2. Identifies supporting evidence for each claim.
3. Checks source and quotation references.
4. Evaluates whether the evidence supports the claim.
5. Flags unsupported or conflicting claims.

### 13.7 Final Verification

The system checks whether the complete response meets the evidence requirements.

It returns verified claims, conflicts, abstention messages and the faithfulness score.

---

# 14. Faithfulness Score

The faithfulness score measures the percentage of answer sentences supported by at least one matching source quotation.

Formula:

```text
Faithfulness Score =

(Supported Answer Sentences /
 Total Answer Sentences) × 100
```

Example:

```text
Total sentences: 10

Supported sentences: 9

Faithfulness Score: 90%
```

The score is calculated using claim-level evidence mappings rather than the language model's self-assessment.

A high score does not automatically establish that a document is legally correct or that all relevant evidence was retrieved.

---

# 15. Contradiction Detection

The contradiction engine compares relevant statements across documents.

It evaluates:

- Subject and clause context.
- Numerical values.
- Dates.
- Conditions.
- Document scope.
- Supporting quotations.

Example:

```text
Document A:
Minimum age requirement = 18

Document B:
Minimum age requirement = 21

Result:
Potential contradiction detected.
```

The application displays both statements and their original citations.

It must distinguish actual contradictions from statements that apply under different conditions.

---

# 16. Amendment Tracking

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

- Amendment references.
- Effective dates.
- Modified clauses.
- Replaced conditions.
- Document relationships.

The system evaluates applicability using the available evidence.

If the documents do not establish which version applies, Tathya reports uncertainty instead of automatically selecting the newest document.

---

# 17. Testing and Evaluation

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

# 18. Deployment

### Frontend – GitHub Pages

The frontend is a static HTML, CSS and JavaScript application.

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
- Uploaded PDFs, databases and FAISS indexes need appropriate persistent or external storage.
- Model memory requirements and inference performance must be tested before final deployment.

The complete AI pipeline must use open-source models without paid AI APIs.

---

# 19. Security and Privacy

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

# 20. Limitations

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

# 21. Team Members

**Team Size: 3 Members**

| Member | Responsibility |
|---|---|
| Member 1 | Frontend Development – HTML, CSS, JavaScript |
| Member 2 | Backend Development – Python, FastAPI, PDF Processing and RAG |
| Member 3 | AI/ML Development – Claim Verification, Contradiction Detection and Amendment Tracking |

### Team Details

- **Member 1:** [Name] – [GitHub Profile]
- **Member 2:** [Name] – [GitHub Profile]
- **Member 3:** [Name] – [GitHub Profile]

---

# 22. Development Guidelines

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

git commit -m "Add document verification module"

git push origin feature/your-feature
```

Changes should be reviewed and merged into the main branch.

---

# 23. AI Tools Disclosure

AI-assisted development tools may be used during development.

All tools actually used must be disclosed in the final submission according to the hackathon rules.

The team is responsible for:

- Understanding generated code.
- Testing implemented features.
- Reviewing model outputs.
- Verifying citations and evidence.
- Explaining the complete architecture.

The final disclosure will list the actual tools used by the team.

---

# 24. Future Scope

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

# 25. Acknowledgements

Developed for **Hack-a-Sol 5.0 – Track 2: AI/ML, AIML-02 Option B**.

We acknowledge the developers and maintainers of the open-source libraries, models and tools used in this project.

All third-party dependencies, models and datasets will be credited in the final repository.

---

# License

This project is intended to use the MIT License, subject to the team's final licensing decision.

Third-party libraries, models and datasets remain subject to their respective licences and terms.

---

<p align="center">

# Tathya (तथ्य)

### Don't Guess. Verify.

**From documents to evidence. From answers to verification.**

Built with a focus on accuracy, transparency and responsible AI.

</p>
