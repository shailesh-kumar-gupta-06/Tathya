"""Rule-based claim verification. Similarity is NOT proof: every claim is checked against quoted text."""
import re
from .pdf_parser import split_sentences
from .retrieval import terms

_NUM = re.compile(r"\d[\d,]*(?:\.\d+)?")


def numbers(text: str) -> set[str]:
    out = set()
    for m in _NUM.findall(text):
        try:
            out.add(f"{float(m.replace(',', '')):g}")
        except ValueError:
            pass
    return out


def _words(text: str) -> set[str]:
    return {t for t in terms(text) if not t[0].isdigit()}


def overlap(a: str, b: str) -> float:
    wa = _words(a)
    return len(wa & _words(b)) / len(wa) if wa else 0.0


def check_claim(claim: str, evidence_texts: list[str]) -> str:
    """supported | unsupported | contradicted"""
    ev = " ".join(evidence_texts)
    if not ev.strip():
        return "unsupported"
    ov = overlap(claim, ev)
    cn, en = numbers(claim), numbers(ev)
    if cn and not cn <= en:
        return "contradicted" if (ov >= 0.5 and en) else "unsupported"
    return "supported" if ov >= 0.6 else "unsupported"


def best_sentence(claim: str, evidence_texts: list[str]) -> str | None:
    best, score = None, 0.0
    cn = numbers(claim)
    for t in evidence_texts:
        for s in split_sentences(t):
            sc = overlap(claim, s) + (0.5 if cn and cn <= numbers(s) else 0)
            if sc > score:
                best, score = s, sc
    return best


def quote_in_page(quote: str, page_text: str | None) -> bool:
    return bool(page_text) and quote in page_text
