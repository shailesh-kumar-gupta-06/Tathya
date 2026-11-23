"""PDF -> page-wise text (PyMuPDF) + table rows (pdfplumber) -> sentences -> overlapping chunks."""
import re
from pathlib import Path
import fitz  # PyMuPDF
from . import config

_ABBR = "".join(rf"(?<!\b{a}\.)" for a in ("Rs", "No", "Sr", "Mr", "Mrs", "Dr", "vs", "Inc", "Ltd", "approx", "sq"))
_SPLIT = re.compile(_ABBR + r"(?<=[.!?;])\s+(?=[A-Z0-9(“\"‘'₹])")


def clean(raw: str) -> str:
    t = raw.replace("\u00ad", "")
    t = re.sub(r"-\n(?=[a-z])", "", t)
    t = re.sub(r"[ \t\r\f\v]+", " ", t)
    t = re.sub(r"\s*\n\s*", " ", t)
    return t.strip()


def split_sentences(text: str) -> list[str]:
    out = []
    for line in text.split("\n"):          # table rows live on their own lines
        line = line.strip()
        if not line:
            continue
        out += [p.strip() for p in _SPLIT.split(line) if len(p.strip()) >= 3]
    return out


def make_chunks(text: str, size: int = 3, step: int = 2, max_chars: int = 700) -> list[str]:
    sents = split_sentences(text)
    chunks, i = [], 0
    while i < len(sents):
        window = sents[i:i + size]
        chunks.append(" ".join(window)[:max_chars * 2])
        if i + size >= len(sents):
            break
        i += step
    return chunks


def _tables(path: Path, n: int) -> dict[int, list[str]]:
    out: dict[int, list[str]] = {}
    try:
        import pdfplumber
        with pdfplumber.open(path) as pdf:
            for i, pg in enumerate(pdf.pages[:n], start=1):
                rows = []
                for tb in pg.extract_tables() or []:
                    for r in tb:
                        cells = [re.sub(r"\s+", " ", c or "").strip() for c in r]
                        if sum(1 for c in cells if c) >= 2:
                            rows.append(" | ".join(c for c in cells if c))
                if rows:
                    out[i] = rows
    except Exception:
        pass
    return out


def extract(path: Path) -> list[tuple[int, str]]:
    """Return [(page_number, text)]. Raises ValueError for unreadable or image-only PDFs."""
    try:
        doc = fitz.open(path)
    except Exception:
        raise ValueError("This file could not be read as a PDF.")
    if doc.needs_pass:
        doc.close()
        raise ValueError("This PDF is password-protected.")
    n = min(len(doc), config.MAX_PAGES)
    bodies = [clean(doc[i].get_text("text")) for i in range(n)]
    doc.close()
    tables = _tables(path, n) if config.EXTRACT_TABLES and n <= 60 else {}
    pages = []
    for i, body in enumerate(bodies, start=1):
        rows = tables.get(i, [])
        pages.append((i, body + ("\n" + "\n".join(rows) if rows else "")))
    if not any(len(t) > 20 for _, t in pages):
        raise ValueError("No readable text found. This looks like a scanned PDF, which needs OCR (not enabled yet).")
    return pages
