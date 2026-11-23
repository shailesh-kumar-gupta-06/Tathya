"""Open-source LLM through Ollama. Returns None when unreachable so the pipeline can fall back honestly."""
import json
import re
import time
import httpx
from . import config

_cache = {"t": 0.0, "ok": False}


def available() -> bool:
    if not config.USE_LLM:
        return False
    if time.time() - _cache["t"] < 20:
        return _cache["ok"]
    try:
        ok = httpx.get(config.OLLAMA_BASE_URL + "/api/tags", timeout=1.5).status_code == 200
    except Exception:
        ok = False
    _cache.update(t=time.time(), ok=ok)
    return ok


SYSTEM = (
    "You answer questions strictly from the numbered evidence passages. Never use outside knowledge. "
    "Write short, atomic factual claims. Each claim must cite the evidence ids that state it. "
    "If the evidence does not answer the question, return an empty claims list. "
    'Reply with JSON only: {"claims":[{"text":"...","evidence":["E1"]}]}'
)


def draft(question: str, evidences: list[tuple[int, str, int, str]]):
    """evidences: [(n, document, page, text)] -> [{'text', 'ids': [int]}] or None on failure."""
    block = "\n".join(f"[E{n}] ({doc}, page {pg}) {txt}" for n, doc, pg, txt in evidences)
    try:
        r = httpx.post(config.OLLAMA_BASE_URL + "/api/chat", timeout=config.LLM_TIMEOUT, json={
            "model": config.LLM_MODEL, "stream": False, "format": "json", "options": {"temperature": 0},
            "messages": [{"role": "system", "content": SYSTEM}, {"role": "user", "content": f"Evidence:\n{block}\n\nQuestion: {question}"}],
        })
        r.raise_for_status()
        data = json.loads(r.json()["message"]["content"])
        claims = []
        for c in data.get("claims", []):
            text = str(c.get("text", "")).strip()
            ids = [int(m) for e in c.get("evidence", []) for m in re.findall(r"\d+", str(e))]
            if text:
                claims.append({"text": text, "ids": ids})
        return claims
    except Exception:
        _cache.update(t=time.time(), ok=False)
        return None
