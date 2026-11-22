// Tathya frontend configuration.
// USE_MOCK = true  -> runs entirely in the browser with labelled sample data (no backend needed).
// USE_MOCK = false -> calls the FastAPI backend at API_BASE.
window.TATHYA_CONFIG = {
  USE_MOCK: true,
  API_BASE: "http://127.0.0.1:8000",   // change to https://YOUR-BACKEND.onrender.com after deploying
  MAX_MB: 20
};
