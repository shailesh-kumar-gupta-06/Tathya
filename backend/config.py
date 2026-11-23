import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def _bool(name, default):
    return os.getenv(name, str(default)).strip().lower() in ("1", "true", "yes", "on")


APP_NAME = "Tathya"
DATA_DIR = Path(os.getenv("DATA_DIR", BASE_DIR / "data")).resolve()
UPLOAD_DIR = DATA_DIR / "uploads"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR / 'tathya.db'}")
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "20"))
MAX_PAGES = int(os.getenv("MAX_PAGES", "300"))
EXTRACT_TABLES = _bool("EXTRACT_TABLES", True)
ALLOWED_ORIGINS = [o.strip().rstrip("/") for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500").split(",") if o.strip()]

USE_LLM = _bool("USE_LLM", True)
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
LLM_MODEL = os.getenv("LLM_MODEL", "llama3.2:1b")
LLM_TIMEOUT = float(os.getenv("LLM_TIMEOUT", "120"))

EMBEDDINGS = _bool("EMBEDDINGS", False)
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

MIN_COVERAGE = float(os.getenv("MIN_COVERAGE", "0.6"))
TOP_K = int(os.getenv("TOP_K", "8"))

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
