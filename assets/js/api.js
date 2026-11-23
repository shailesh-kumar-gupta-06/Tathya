// API layer: talks to the FastAPI backend.
(function () {
  const C = window.TATHYA_CONFIG;
  async function http(path, opts) {
    let res;
    try { res = await fetch(C.API_BASE + path, opts); }
    catch (e) { throw new Error("Cannot reach the Tathya server at " + C.API_BASE + "."); }
    if (!res.ok) {
      let detail = res.statusText;
      try { detail = (await res.json()).detail || detail; } catch (_) {}
      throw new Error(typeof detail === "string" ? detail : "Request failed (" + res.status + ")");
    }
    return res.status === 204 ? null : res.json();
  }
  window.TathyaAPI = {
    health: () => http("/api/health"),
    listDocuments: () => http("/api/documents"),
    upload: (files) => {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      return http("/api/documents/upload", { method: "POST", body: fd });
    },
    deleteDocument: (id) => http("/api/documents/" + encodeURIComponent(id), { method: "DELETE" }),
    ask: (question, document_ids) =>
      http("/api/chat/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, document_ids }) }),
    conflicts: () => http("/api/conflicts"),
    amendments: () => http("/api/amendments")
  };
})();