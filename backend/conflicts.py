"""Contradiction + amendment detection (rule-based, evidence-quoting)."""
import re
from collections import defaultdict
from .retrieval import stem, tokens, STOP

CUE = re.compile(r"\b(amend\w*|substitut\w*|supersed\w*|replac\w*|revis\w*|modif\w*)\b", re.I)
_M = r"jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?"
DATE = re.compile(rf"\b(\d{{1,2}}(?:st|nd|rd|th)?\s+(?:{_M})\.?,?\s+\d{{4}}|(?:{_M})\.?\s+\d{{1,2}},?\s+\d{{4}}|\d{{1,2}}[/-]\d{{1,2}}[/-]\d{{2,4}})\b", re.I)
EFFECT = re.compile(r"effective|with effect|w\.e\.f|come[s]? into force|from the date", re.I)
_MONTH = re.compile(rf"^(?:{_M})$", re.I)
GENERIC = {"annum", "year", "yr", "month", "day", "percent", "cent", "rs", "inr", "effective", "clause", "hereby", "herein", "applicable", "agreement", "document"}

FACTS = [
    ("percent", re.compile(r"(\d+(?:\.\d+)?)\s*(?:%|per\s?cent\b|percent\b)", re.I)),
    ("years", re.compile(r"(\d+(?:\.\d+)?)\)?\s*(?:years?|yrs?)\b", re.I)),
    ("months", re.compile(r"(\d+(?:\.\d+)?)\)?\s*months?\b", re.I)),
    ("days", re.compile(r"(\d+(?:\.\d+)?)\)?\s*days?\b", re.I)),
    ("money", re.compile(r"(?:₹|\brs\.?|\binr\b|\busd\b|\$)\s*(\d[\d,]*(?:\.\d+)?)(?:\s*(lakhs?|lacs?|crores?|million|k)\b)?", re.I)),
]
_MULT = {"lakh": 1e5, "lac": 1e5, "crore": 1e7, "million": 1e6, "k": 1e3}


def extract_facts(text: str) -> dict[str, set[float]]:
    out: dict[str, set[float]] = defaultdict(set)
    for unit, rx in FACTS:
        for m in rx.finditer(text):
            v = float(m.group(1).replace(",", ""))
            if unit == "money" and m.group(2):
                v *= _MULT.get(m.group(2).lower().rstrip("s"), 1)
            out[unit].add(v)
    return out


def _subject(text: str) -> set[str]:
    words = set()
    for w in tokens(text):
        if w in STOP or w[0].isdigit() or len(w) < 3 or _MONTH.match(w) or CUE.fullmatch(w) or w in GENERIC or stem(w) in GENERIC:
            continue
        words.add(stem(w))
    return words


def effective_date(text: str) -> str | None:
    m = DATE.search(text)
    return m.group(1) if (m and EFFECT.search(text)) else None


def _ref(s):
    return {"document": s["document"], "page": s["page"], "quote": s["text"]}


def _fmt(v):
    return f"{v:g}"


def _classify(a, b, unit, va, vb, subject):
    ca, cb = bool(CUE.search(a["text"])), bool(CUE.search(b["text"]))
    diff = f"{', '.join(map(_fmt, sorted(va)))} vs {', '.join(map(_fmt, sorted(vb)))} ({unit})"
    if ca != cb:
        amend, orig = (a, b) if ca else (b, a)
        date = effective_date(amend["text"])
        chain = [
            {"role": "Original", "document": orig["document"], "page": orig["page"], "date": None, "text": orig["text"]},
            {"role": "Amendment", "document": amend["document"], "page": amend["page"], "date": ("Effective " + date) if date else None, "text": amend["text"]},
        ]
        if date:
            return {"subject": subject, "verdict": "resolved_by_amendment", "a": _ref(orig), "b": _ref(amend), "chain": chain,
                    "applicability": {"resolved": True, "text": f"{amend['document']} (page {amend['page']}) amends the earlier wording and states an effective date, {date}."},
                    "note": f"Values differ ({diff}). The amendment-style clause carries an effective date, so it is treated as the applicable version from that date."}
        return {"subject": subject, "verdict": "potential_conflict", "a": _ref(orig), "b": _ref(amend), "chain": chain,
                "applicability": {"resolved": False, "text": "An amendment-style clause exists but gives no effective date, so Tathya cannot say which version applies."},
                "note": f"Values differ ({diff}). Applicability is not established by the documents."}
    return {"subject": subject, "verdict": "conflict", "a": _ref(a), "b": _ref(b), "chain": None, "applicability": None,
            "note": f"Values differ ({diff}) and no amendment link was found. Tathya will not pick one."}


def find(sentences: list[dict], query_terms: list[str] | None = None, per_unit: int = 400) -> list[dict]:
    """sentences: [{doc_id, document, page, text}]. Returns conflicts, strongest first."""
    q = set(query_terms or [])
    by_unit: dict[str, list] = defaultdict(list)
    seen = set()
    for s in sentences:
        key = (s["doc_id"], s["page"], s["text"])
        if key in seen:
            continue
        seen.add(key)
        facts = extract_facts(s["text"])
        if not facts:
            continue
        subj = _subject(s["text"])
        for unit, vals in facts.items():
            by_unit[unit].append((s, vals, subj))
    out, done = [], set()
    for unit, lst in by_unit.items():
        lst = lst[:per_unit]
        for i in range(len(lst)):
            for j in range(i + 1, len(lst)):
                (a, va, sa), (b, vb, sb) = lst[i], lst[j]
                if va & vb:
                    continue
                if " | " in a["text"] and " | " in b["text"] and a["doc_id"] == b["doc_id"] and a["page"] == b["page"]:
                    continue
                shared = sa & sb
                strict = len(shared) >= 2 and len(shared) / max(1, min(len(sa), len(sb))) >= 0.67
                anchored = bool(q) and bool(shared & q)
                if not (strict or anchored):
                    continue
                pair = frozenset(((a["doc_id"], a["page"], a["text"]), (b["doc_id"], b["page"], b["text"])))
                if pair in done:
                    continue
                done.add(pair)
                label = []
                for w in tokens(a["text"]):
                    if stem(w) in shared and w not in label:
                        label.append(w)
                subject = (" ".join(label[:4]) or "Same subject").capitalize()
                c = _classify(a, b, unit, va, vb, subject)
                c["_score"] = len(shared)
                out.append(c)
    return sorted(out, key=lambda c: -c["_score"])


def public(c: dict) -> dict:
    return {k: c[k] for k in ("subject", "verdict", "a", "b", "note")}