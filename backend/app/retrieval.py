"""Hybrid retrieval: BM25 (always on) + optional dense vectors (Sentence Transformers + FAISS)."""
import importlib.util
import math
import re
from collections import Counter
from . import config

STOP = set("""a an the of to in on for and or is are was were be been being by with as at from that this these those it its
shall will may can must what which who whom how when where why do does did has have had not no any all per under over such than
then there their they them his her our your you i we if but about into out up also""".split())
_TOK = re.compile(r"[a-z0-9]+(?:\.[0-9]+)?")


def stem(w: str) -> str:
    return w[:-1] if len(w) > 3 and w.endswith("s") and not w.endswith("ss") else w


def tokens(text: str) -> list[str]:
    return _TOK.findall(text.lower())


def terms(text: str) -> list[str]:
    return [stem(w) for w in tokens(text) if w not in STOP and (len(w) > 1 or w.isdigit())]


class BM25:
    def __init__(self, docs: list[list[str]], k1=1.5, b=0.75):
        self.k1, self.b = k1, b
        self.tf = [Counter(d) for d in docs]
        self.len = [len(d) for d in docs]
        n = len(docs)
        self.avg = (sum(self.len) / n) if n else 1.0
        df = Counter()
        for d in self.tf:
            df.update(d.keys())
        self.idf = {t: math.log(1 + (n - c + 0.5) / (c + 0.5)) for t, c in df.items()}

    def scores(self, q: list[str]) -> list[float]:
        out = []
        for tf, ln in zip(self.tf, self.len):
            s = 0.0
            for t in set(q):
                f = tf.get(t, 0)
                if f:
                    s += self.idf[t] * f * (self.k1 + 1) / (f + self.k1 * (1 - self.b + self.b * ln / (self.avg or 1)))
            out.append(s)
        return out


_model = None


def dense_ready() -> bool:
    return config.EMBEDDINGS and importlib.util.find_spec("sentence_transformers") is not None


def embed(texts: list[str]):
    global _model
    import numpy as np
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(config.EMBEDDING_MODEL)
    return np.asarray(_model.encode(texts, normalize_embeddings=True), dtype="float32")


def _dense_order(chunks, question, limit=50):
    import numpy as np
    m = np.frombuffer(b"".join(c.emb for c in chunks), dtype="float32").reshape(len(chunks), -1)
    q = embed([question])[0]
    try:
        import faiss
        index = faiss.IndexFlatIP(m.shape[1])
        index.add(m)
        _, ids = index.search(q.reshape(1, -1), min(limit, len(chunks)))
        return [int(i) for i in ids[0] if i >= 0]
    except ImportError:
        return [int(i) for i in np.argsort(-(m @ q))[:limit]]


def search(chunks, q_terms: list[str], question: str, k: int):
    """Reciprocal-rank fusion of BM25 and (optionally) dense retrieval. Returns top-k chunks."""
    if not chunks:
        return []
    bm = BM25([terms(c.text) for c in chunks])
    s = bm.scores(q_terms)
    fused: dict[int, float] = {}
    for r, i in enumerate(sorted(range(len(chunks)), key=lambda i: -s[i])[:50]):
        if s[i] > 0:
            fused[i] = fused.get(i, 0) + 1 / (60 + r)
    if dense_ready() and all(c.emb for c in chunks):
        for r, i in enumerate(_dense_order(chunks, question)):
            fused[i] = fused.get(i, 0) + 1 / (60 + r)
    return [chunks[i] for i in sorted(fused, key=lambda i: -fused[i])[:k]]
