import re
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from . import config, conflicts as cf, llm, pdf_parser, pipeline, retrieval
from .db import Chunk, Document, Page, SessionLocal, get_db, init_db


@asynccontextmanager
async def lifespan(app):
    init_db()
    yield


app = FastAPI(title="Tathya API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=config.ALLOWED_ORIGINS, allow_methods=["*"], allow_headers=["*"])


def _doc(d: Document):
    return {"id": d.id, "name": d.name, "pages": d.pages, "status": d.status}


def _safe_name(name: str) -> str:
    base = re.sub(r"[^\w .()-]", "_", Path(name or "document.pdf").name)[:120]
    return base or "document.pdf"


@app.get("/api/health")
def health():
    return {"status": "ok", "llm": f"ollama:{config.LLM_MODEL}" if llm.available() else "extractive",
            "retrieval": "hybrid-dense+bm25" if retrieval.dense_ready() else "bm25"}


@app.get("/api/documents")
def list_documents(db: Session = Depends(get_db)):
    return [_doc(d) for d in db.query(Document).order_by(Document.created).all()]


@app.post("/api/documents/upload")
async def upload(files: list[UploadFile] = File(...), db: Session = Depends(get_db)):
    limit = config.MAX_UPLOAD_MB * 1024 * 1024
    staged = []
    for f in files:                                  # validate everything before storing anything
        name = _safe_name(f.filename)
        if not name.lower().endswith(".pdf"):
            raise HTTPException(400, f"{name} is not a PDF.")
        data = await f.read(limit + 1)
        if len(data) > limit:
            raise HTTPException(413, f"{name} is larger than {config.MAX_UPLOAD_MB} MB.")
        if not data.startswith(b"%PDF-"):
            raise HTTPException(400, f"{name} does not look like a valid PDF.")
        staged.append((name, data))
    for name, data in staged:
        doc_id = "doc_" + uuid.uuid4().hex[:8]
        stored = f"{doc_id}.pdf"                      # server-generated filename
        path = config.UPLOAD_DIR / stored
        path.write_bytes(data)
        try:
            pages = pdf_parser.extract(path)
        except ValueError as e:
            path.unlink(missing_ok=True)
            raise HTTPException(422, f"{name}: {e}")
        chunk_rows = [(pg, i, t) for pg, text in pages for i, t in enumerate(pdf_parser.make_chunks(text))]
        embs = None
        if retrieval.dense_ready() and chunk_rows:
            embs = retrieval.embed([t for _, _, t in chunk_rows])
        db.add(Document(id=doc_id, name=name, stored_as=stored, pages=len(pages), status="ready"))
        db.add_all(Page(doc_id=doc_id, page=pg, text=t) for pg, t in pages)
        db.add_all(Chunk(doc_id=doc_id, page=pg, idx=i, text=t, emb=(embs[k].tobytes() if embs is not None else None))
                   for k, (pg, i, t) in enumerate(chunk_rows))
        db.commit()
    return [_doc(d) for d in db.query(Document).order_by(Document.created).all()]


@app.get("/api/documents/{doc_id}")
def get_document(doc_id: str, db: Session = Depends(get_db)):
    d = db.get(Document, doc_id)
    if not d:
        raise HTTPException(404, "Document not found.")
    return _doc(d)


@app.delete("/api/documents/{doc_id}", status_code=204)
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    d = db.get(Document, doc_id)
    if not d:
        raise HTTPException(404, "Document not found.")
    db.query(Chunk).filter(Chunk.doc_id == doc_id).delete()
    db.query(Page).filter(Page.doc_id == doc_id).delete()
    (config.UPLOAD_DIR / d.stored_as).unlink(missing_ok=True)
    db.delete(d)
    db.commit()


@app.get("/api/documents/{doc_id}/pages/{page}")
def get_page(doc_id: str, page: int, db: Session = Depends(get_db)):
    p = db.query(Page).filter(Page.doc_id == doc_id, Page.page == page).first()
    if not p:
        raise HTTPException(404, "Page not found.")
    return {"document_id": doc_id, "page": page, "text": p.text}


class AskIn(BaseModel):
    question: str = Field(min_length=2, max_length=500)
    document_ids: list[str] = Field(min_length=1, max_length=50)


@app.post("/api/chat/ask")
def ask(body: AskIn, db: Session = Depends(get_db)):
    try:
        return pipeline.ask(db, body.question.strip(), body.document_ids)
    except ValueError as e:
        raise HTTPException(400, str(e))


def _library_conflicts(db):
    return cf.find(pipeline.library_sentences(db))


@app.get("/api/conflicts")
def conflicts(db: Session = Depends(get_db)):
    return [cf.public(c) for c in _library_conflicts(db)]


@app.get("/api/amendments")
def amendments(db: Session = Depends(get_db)):
    return [{"subject": c["subject"], "chain": c["chain"], "applicability": c["applicability"]}
            for c in _library_conflicts(db) if c["chain"]]


@app.get("/api/dashboard/stats")
def stats(db: Session = Depends(get_db)):
    return {"documents": db.query(Document).count(), "pages": db.query(Page).count(), "chunks": db.query(Chunk).count()}
