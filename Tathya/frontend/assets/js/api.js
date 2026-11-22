// API layer. Same method names for real and mock mode, so app.js never changes.
(function () {
  const C = window.TATHYA_CONFIG;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Real backend ---------- */
  async function http(path, opts) {
    let res;
    try { res = await fetch(C.API_BASE + path, opts); }
    catch (e) { throw new Error("Cannot reach the Tathya server. Check that the backend is running."); }
    if (!res.ok) {
      let detail = res.statusText;
      try { detail = (await res.json()).detail || detail; } catch (_) {}
      throw new Error(typeof detail === "string" ? detail : "Request failed (" + res.status + ")");
    }
    return res.status === 204 ? null : res.json();
  }
  const real = {
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

  /* ---------- Mock backend (sample data only) ---------- */
  let docs = [], n = 0;
  const LA = "Loan_Agreement.pdf", LP = "Loan_Policy_2026.pdf", AM = "Amendment_01.pdf";
  const SAMPLES = [
    { id: "doc_s1", name: LA, pages: 12, status: "ready" },
    { id: "doc_s2", name: LP, pages: 8, status: "ready" },
    { id: "doc_s3", name: AM, pages: 3, status: "ready" }
  ];
  const Q = {
    rate: {
      status: "verified",
      answer: "The applicable interest rate is 9% per annum, effective 1 April 2026, as revised by Amendment 1. The original agreement stated 8%.",
      faithfulness: { supported: 2, total: 2, score: 100 },
      claims: [
        { text: "The applicable interest rate is 9% per annum from 1 April 2026.", status: "supported", evidence_ids: ["ev_003"] },
        { text: "The original agreement stated 8%.", status: "supported", evidence_ids: ["ev_001"] }
      ],
      citations: [
        { evidence_id: "ev_001", document: LA, page: 5, quote: "The applicable interest rate shall be 8% per annum." },
        { evidence_id: "ev_003", document: AM, page: 2, quote: "Clause 5.1 is substituted with: the interest rate shall be 9% per annum, effective from 1 April 2026." }
      ],
      conflicts: [{
        subject: "Interest rate", verdict: "resolved_by_amendment",
        a: { document: LA, page: 5, quote: "The applicable interest rate shall be 8% per annum." },
        b: { document: AM, page: 2, quote: "Clause 5.1 is substituted with: the interest rate shall be 9% per annum, effective from 1 April 2026." },
        note: "The values differ, and Amendment 1 explicitly substitutes the original clause."
      }],
      amendment_chain: [
        { role: "Original", document: LA, page: 5, date: "12 Jan 2025", text: "Interest rate: 8% per annum (Clause 5.1)." },
        { role: "Amendment 1", document: AM, page: 2, date: "Effective 1 Apr 2026", text: "Clause 5.1 substituted. New rate: 9% per annum." }
      ],
      applicability: { resolved: true, text: "Amendment 1 names Clause 5.1 and gives an effective date, so 9% applies from 1 April 2026." }
    },
    age: {
      status: "conflict_detected", answer: null,
      message: "The documents give different minimum ages and nothing in them says which one governs. Tathya won’t pick one.",
      faithfulness: null, claims: [], citations: [],
      conflicts: [{
        subject: "Minimum applicant age", verdict: "conflict",
        a: { document: LA, page: 3, quote: "The Borrower must be at least 18 years of age." },
        b: { document: LP, page: 4, quote: "Applicants must have completed 21 years of age." },
        note: "Same subject, different values, no amendment or scope difference found."
      }]
    },
    fee: {
      status: "insufficient_evidence", answer: null,
      message: "I don’t have proof for this. No clause about a processing fee was found in the selected documents.",
      faithfulness: null, claims: [], citations: [], conflicts: [],
      missing: "Looked for: processing fee, service charge, administrative charge."
    },
    tenure: {
      status: "verified",
      answer: "The loan tenure is 60 months. Prepayment is allowed without penalty. The borrower may defer EMIs for up to six months.",
      faithfulness: { supported: 2, total: 3, score: 67 },
      claims: [
        { text: "The loan tenure is 60 months.", status: "supported", evidence_ids: ["ev_010"] },
        { text: "Prepayment is allowed without penalty.", status: "supported", evidence_ids: ["ev_011"] },
        { text: "The borrower may defer EMIs for up to six months.", status: "unsupported", evidence_ids: [] }
      ],
      citations: [
        { evidence_id: "ev_010", document: LA, page: 4, quote: "The tenure of the loan shall be sixty (60) months from the date of disbursement." },
        { evidence_id: "ev_011", document: LP, page: 6, quote: "No penalty shall be charged on prepayment of the loan." }
      ],
      conflicts: [], note: "One claim had no supporting quote and is blocked: “EMI deferral” is not mentioned in the selected documents."
    }
  };
  function pick(q) {
    q = q.toLowerCase();
    if (/interest|rate|amend|changed/.test(q)) return Q.rate;
    if (/age|eligib/.test(q)) return Q.age;
    if (/tenure|prepay|emi|month/.test(q)) return Q.tenure;
    return Q.fee;
  }
  const mock = {
    async listDocuments() { return docs.slice(); },
    async upload(files) {
      await wait(600);
      files.forEach((f) => docs.push({ id: "doc_u" + ++n, name: f.name, pages: null, status: "ready" }));
      return docs.slice();
    },
    async loadSamples() { docs = SAMPLES.map((d) => ({ ...d })); return docs.slice(); },
    async deleteDocument(id) { docs = docs.filter((d) => d.id !== id); return null; },
    async ask(question, ids) {
      await wait(1100);
      if (!ids.length) throw new Error("Select at least one document first.");
      return JSON.parse(JSON.stringify(pick(question)));
    },
    async conflicts() { await wait(300); return [Q.rate.conflicts[0], Q.age.conflicts[0]]; },
    async amendments() { await wait(300); return [{ subject: "Interest rate", chain: Q.rate.amendment_chain, applicability: Q.rate.applicability }]; }
  };

  window.TathyaAPI = C.USE_MOCK ? mock : real;
})();
