"""Question -> retrieve -> (draft) -> verify -> conflicts/amendments -> answer or abstain."""
from sqlalchemy.orm import Session
from . import config, conflicts as cf, llm, retrieval, verify
from .db import Chunk, Document, Page
from .pdf_parser import split_sentences
from .retrieval import terms


class Evidence:
    def __init__(self):
        self.items, self._idx = [], {}

    def add(self, document, page, quote) -> str:
        key = (document, page, quote)
        if key not in self._idx:
            self._idx[key] = f"ev_{len(self.items) + 1:03d}"
            self.items.append({"evidence_id": self._idx[key], "document": document, "page": page, "quote": quote})
        return self._idx[key]


def _base(status, **kw):
    r = {"status": status, "answer": None, "message": None, "faithfulness": None, "claims": [], "citations": [], "conflicts": []}
    r.update(kw)
    return r


def _abstain(q_terms, message=None):
    return _base("insufficient_evidence",
                 message=message or "I don’t have proof for this. No clause matching your question was found in the selected documents.",
                 missing=("Looked for: " + ", ".join(dict.fromkeys(q_terms))) if q_terms else None)


def _faith(claims):
    n = len(claims)
    ok = sum(1 for c in claims if c["status"] == "supported")
    return {"supported": ok, "total": n, "score": round(100 * ok / n)} if n else None


def ask(db: Session, question: str, doc_ids: list[str]) -> dict:
    docs = {d.id: d for d in db.query(Document).filter(Document.id.in_(doc_ids)).all()}
    if not docs:
        raise ValueError("Select at least one document first.")
    q_terms = terms(question)
    if not q_terms:
        return _abstain([], "Please ask a more specific question.")
    chunks = db.query(Chunk).filter(Chunk.doc_id.in_(list(docs))).all()
    top = retrieval.search(chunks, q_terms, question, config.TOP_K)
    qset = set(q_terms)

    def cov(text):
        return len(qset & set(terms(text))) / len(qset)

    if not top or max(cov(c.text) for c in top) < config.MIN_COVERAGE:
        return _abstain(q_terms)

    pages = {(p.doc_id, p.page): p.text for p in db.query(Page).filter(Page.doc_id.in_(list(docs))).all()}
    pool = []
    for c in top:
        for s in split_sentences(c.text):
            pool.append({"doc_id": c.doc_id, "document": docs[c.doc_id].name, "page": c.page, "text": s, "cov": cov(s), "chunk": c})

    # --- contradictions among passages relevant to the question ---
    # anchor terms must be discriminative: very common words ("loan") must not make two clauses "the same subject"
    chunk_terms = [set(terms(c.text)) for c in chunks]
    anchors = [t for t in qset if sum(t in s for s in chunk_terms) / len(chunk_terms) <= 0.4]
    found = cf.find([p for p in pool if p["cov"] >= 0.3], anchors)
    unresolved = [c for c in found if c["verdict"] != "resolved_by_amendment"]
    if unresolved:
        return _base("conflict_detected", conflicts=[cf.public(c) for c in found],
                     message="The documents disagree on this and nothing in them settles which version governs. Tathya won’t pick one.")
    if found:  # every conflict is resolved by an amendment with an effective date
        c = found[0]
        ev, claims = Evidence(), []
        for ref in (c["b"], c["a"]):
            if verify.quote_in_page(ref["quote"], pages.get(_find_doc(docs, ref["document"], ref["page"]))):
                claims.append({"text": ref["quote"], "status": "supported", "evidence_ids": [ev.add(ref["document"], ref["page"], ref["quote"])]})
        if len(claims) == 2:
            return _base("verified", answer=f"As amended: {c['b']['quote']} The earlier version said: {c['a']['quote']}",
                         claims=claims, citations=ev.items, faithfulness=_faith(claims), conflicts=[cf.public(c)],
                         amendment_chain=c["chain"], applicability=c["applicability"])

    # --- draft claims (LLM if reachable, else extractive) ---
    note, claims, ev = None, [], Evidence()
    drafted = None
    if llm.available():
        evid = top[:5]
        drafted = llm.draft(question, [(i + 1, docs[c.doc_id].name, c.page, c.text) for i, c in enumerate(evid)])
        if drafted is None:
            note = "The language model could not be reached, so Tathya quoted the documents directly."
    if drafted is not None:
        for d in drafted:
            cited = [evid[i - 1] for i in d["ids"] if 1 <= i <= len(evid)]
            status = verify.check_claim(d["text"], [c.text for c in cited])
            ids = []
            if status == "supported":
                q = verify.best_sentence(d["text"], [c.text for c in cited])
                owner = next((c for c in cited if q and q in c.text), None)
                if q and owner and verify.quote_in_page(q, pages.get((owner.doc_id, owner.page))):
                    ids = [ev.add(docs[owner.doc_id].name, owner.page, q)]
                else:
                    status = "unsupported"
            claims.append({"text": d["text"], "status": status, "evidence_ids": ids})
        blocked = sum(1 for c in claims if c["status"] != "supported")
        note = f"{blocked} claim(s) from the model’s draft were blocked because no quote supports them." if blocked else None
    else:
        note = note or "Extractive mode: no language model is running, so answers are sentences quoted directly from your documents."
        seen = set()
        for p in sorted((p for p in pool if p["cov"] >= config.MIN_COVERAGE), key=lambda p: (-p["cov"], len(p["text"]))):
            if p["text"] in seen or len(claims) >= 3:
                continue
            seen.add(p["text"])
            if verify.quote_in_page(p["text"], pages.get((p["doc_id"], p["page"]))):
                claims.append({"text": p["text"], "status": "supported", "evidence_ids": [ev.add(p["document"], p["page"], p["text"])]})

    good = [c["text"] for c in claims if c["status"] == "supported"]
    if not good:
        return _abstain(q_terms, "I don’t have proof for this. The draft answer could not be backed by a quote from the selected documents.")
    return _base("verified", answer=" ".join(good).replace(" | ", ": "), claims=claims, citations=ev.items, faithfulness=_faith(claims), note=note)


def _find_doc(docs, name, page):
    return next(((i, page) for i, d in docs.items() if d.name == name), (None, page))


def library_sentences(db: Session):
    rows = db.query(Page, Document).join(Document, Document.id == Page.doc_id).all()
    return [{"doc_id": d.id, "document": d.name, "page": p.page, "text": s} for p, d in rows for s in split_sentences(p.text)]
