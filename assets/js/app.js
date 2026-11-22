(function () {
  const C = window.TATHYA_CONFIG, API = window.TathyaAPI;
  const $ = (s) => document.querySelector(s);
  let docs = [], selected = new Set(), online = false;

  // All dynamic text goes through textContent, so document quotes can never inject HTML.
  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const k in props || {}) {
      if (k === "class") e.className = props[k];
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), props[k]);
      else e.setAttribute(k, props[k]);
    }
    kids.flat().forEach((c) => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 5000);
  }

  /* ---------- icons (static, trusted markup) ---------- */
  const P = {
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
    split: '<path d="M12 3v18M4 7h5M15 17h5M4 17h5M15 7h5"/>',
    branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 7v10M18 11c0 4-6 3-12 6"/>',
    upload: '<path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
    quote: '<path d="M9 7H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a2 2 0 0 1-2 2M19 7h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a2 2 0 0 1-2 2"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    send: '<path d="m4 12 16-8-6 16-3-6-7-2Z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    alert: '<path d="M12 4 3 20h18L12 4Z"/><path d="M12 10v4m0 3v.01"/>'
  };
  document.querySelectorAll("[data-ic]").forEach((el) => {
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[el.dataset.ic] || "") + "</svg>";
  });

  /* ---------- server status ---------- */
  async function checkServer() {
    try {
      await API.health(); online = true;
      $("#offline").hidden = true;
      $("#status").classList.remove("off"); $("#status").classList.add("on"); $("#statusText").textContent = "Server connected";
      setDocs(await API.listDocuments());
    } catch (e) {
      online = false;
      $("#offline").hidden = false; $("#offlineMsg").textContent = e.message;
      $("#status").classList.remove("on"); $("#status").classList.add("off"); $("#statusText").textContent = "Server offline";
    }
  }
  $("#retry").addEventListener("click", checkServer);

  /* ---------- documents ---------- */
  function renderDocs() {
    const ul = $("#docList"); ul.replaceChildren();
    docs.forEach((d) => {
      const cb = h("input", { type: "checkbox", "aria-label": "Use " + d.name, onchange: (e) => {
        e.target.checked ? selected.add(d.id) : selected.delete(d.id); count();
      } });
      cb.checked = selected.has(d.id);
      ul.append(h("li", {}, cb,
        h("div", {}, h("div", { class: "nm" }, d.name),
          h("div", { class: "st" + (d.status !== "ready" ? " proc" : "") },
            d.status === "ready" ? (d.pages ? d.pages + " pages · ready" : "Ready") : "Processing…")),
        h("button", { class: "x", type: "button", "aria-label": "Remove " + d.name, onclick: () => removeDoc(d.id) }, "×")));
    });
    $("#docEmpty").hidden = docs.length > 0; count();
  }
  function count() {
    $("#docCount").textContent = docs.length;
    const chip = $("#selChip");
    chip.hidden = !docs.length;
    chip.textContent = selected.size + " of " + docs.length + " selected";
  }
  function setDocs(list) {
    const old = new Set(docs.map((d) => d.id));
    docs = list; list.forEach((d) => { if (!old.has(d.id)) selected.add(d.id); });
    selected = new Set([...selected].filter((id) => list.some((d) => d.id === id)));
    renderDocs();
  }
  async function removeDoc(id) {
    try { await API.deleteDocument(id); setDocs(await API.listDocuments()); } catch (e) { toast(e.message); }
  }
  async function addFiles(fileList) {
    if (!online) { toast("The server is offline, so files can’t be uploaded yet."); return; }
    const ok = [];
    [...fileList].forEach((f) => {
      if (!/\.pdf$/i.test(f.name)) toast(f.name + " is not a PDF.");
      else if (f.size > C.MAX_MB * 1048576) toast(f.name + " is larger than " + C.MAX_MB + " MB.");
      else ok.push(f);
    });
    if (!ok.length) return;
    const note = $("#docEmpty"); note.textContent = "Reading " + ok.length + " file(s)…"; note.hidden = false;
    try { setDocs(await API.upload(ok)); } catch (e) { toast(e.message); }
    note.textContent = "No documents yet."; renderDocs();
  }
  const drop = $("#drop");
  $("#fileInput").addEventListener("change", (e) => { addFiles(e.target.files); e.target.value = ""; });
  ["dragover", "dragenter"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

  /* ---------- renderers ---------- */
  const STATUS = { verified: "Verified", conflict_detected: "Conflict detected", insufficient_evidence: "Insufficient evidence" };
  const CLAIM = { supported: "Supported", unsupported: "Blocked: no proof", contradicted: "Contradicted" };

  const slip = (c, label) => h("div", { class: "slip" },
    label ? h("div", { class: "side-l" }, label) : null,
    h("blockquote", {}, "“" + c.quote + "”"),
    h("div", { class: "src" }, h("b", {}, c.document), " · page " + c.page + (c.evidence_id ? " · " + c.evidence_id : "")));

  function faith(f, claims) {
    if (!f) return null;
    return h("div", { class: "faith" },
      h("div", { class: "lab" }, h("span", {}, f.supported + " of " + f.total + " claims backed by a quote"), h("b", {}, f.score + "%")),
      h("div", { class: "segs", role: "img", "aria-label": "Faithfulness " + f.score + " percent" },
        (claims || []).map((c) => h("span", { class: "seg " + c.status, title: c.text }))));
  }
  function conflictBlock(c) {
    const resolved = c.verdict === "resolved_by_amendment";
    const label = resolved ? "Values differ, amendment applies" : c.verdict === "potential_conflict" ? "Potential conflict" : "Conflict";
    return h("div", { class: "confl" },
      h("h3", {}, c.subject, h("span", { class: "tag " + (resolved ? "supported" : "contradicted") }, label)),
      h("div", { class: "pair" }, slip(c.a, "Document A"), slip(c.b, "Document B")),
      c.note ? h("p", { class: "verdict" }, c.note) : null);
  }
  function chainBlock(chain, ap) {
    return h("div", {},
      h("ol", { class: "chain" }, chain.map((s) => h("li", {},
        h("div", { class: "role" }, s.role + ": " + s.document),
        h("div", { class: "meta" }, "page " + s.page + (s.date ? " · " + s.date : "")),
        h("div", {}, s.text)))),
      ap ? h("p", { class: "applies" + (ap.resolved ? "" : " unsure") }, (ap.resolved ? "Applies today: " : "Not established: ") + ap.text) : null);
  }
  function resultCard(r) {
    const body = [];
    if (r.answer) body.push(h("p", { class: "answer" }, r.answer));
    ["message", "missing", "note"].forEach((k) => r[k] && body.push(h("p", { class: "msg" + (k === "message" ? "" : " muted") }, r[k])));
    if (r.claims && r.claims.length) body.push(h("div", {}, h("h3", {}, "Claim check"),
      h("ul", { class: "claims" }, r.claims.map((c) => h("li", {},
        h("span", { class: "tag " + c.status }, CLAIM[c.status] || c.status),
        h("div", {}, c.text, c.evidence_ids && c.evidence_ids.length ? h("div", { class: "ev" }, "Evidence: " + c.evidence_ids.join(", ")) : null))))));
    if (r.citations && r.citations.length) body.push(h("div", {}, h("h3", {}, "Sources"), h("div", { class: "cites" }, r.citations.map((c) => slip(c)))));
    if (r.conflicts && r.conflicts.length) body.push(h("div", {}, h("h3", {}, "Documents compared"), h("div", { class: "cites" }, r.conflicts.map(conflictBlock))));
    if (r.amendment_chain && r.amendment_chain.length) body.push(h("div", {}, h("h3", {}, "Amendment chain"), chainBlock(r.amendment_chain, r.applicability)));
    return h("article", { class: "card" },
      h("div", { class: "card-head" }, h("span", { class: "stamp " + r.status }, STATUS[r.status] || r.status), faith(r.faithfulness, r.claims)),
      h("div", { class: "card-body" }, body));
  }

  /* ---------- ask ---------- */
  const thread = $("#thread"), askView = $("#view-ask");
  $("#askForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const i = $("#q"), q = i.value.trim(); if (!q) return;
    if (!online) { toast("The server is offline. Start the backend and try again."); return; }
    if (!selected.size) { toast(docs.length ? "Tick at least one document to search." : "Upload a PDF first."); return; }
    i.value = ""; $("#intro").hidden = true;
    thread.append(h("div", { class: "qbubble" }, q));
    const wait = h("div", { class: "card" }, h("div", { class: "card-body dots", "aria-label": "Checking the documents" }, h("span"), h("span"), h("span")));
    thread.append(wait); $("#askBtn").disabled = true; askView.scrollTop = askView.scrollHeight;
    try { wait.replaceWith(resultCard(await API.ask(q, [...selected]))); }
    catch (err) { wait.remove(); toast(err.message); }
    $("#askBtn").disabled = false; askView.scrollTop = askView.scrollHeight;
  });

  /* ---------- sections ---------- */
  const TITLES = {
    ask: ["Ask your documents", "Get answers backed by exact quotes, or a clear “no proof”."],
    conflicts: ["Conflicts", "Clauses that disagree across your documents."],
    amendments: ["Amendments", "How rules change, and which version applies."]
  };
  async function fill(box, loader, render, emptyMsg) {
    box.replaceChildren(h("div", { class: "empty" }, "Loading…"));
    try { const d = await loader(); box.replaceChildren(...(d.length ? d.map(render) : [h("div", { class: "empty" }, emptyMsg)])); }
    catch (err) { box.replaceChildren(h("div", { class: "empty" }, err.message)); }
  }
  function show(v) {
    document.querySelectorAll(".nav-i").forEach((x) => (x.dataset.view === v ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current")));
    ["ask", "conflicts", "amendments"].forEach((n) => ($("#view-" + n).hidden = n !== v));
    $(".composer").hidden = v !== "ask";
    $("#pageTitle").textContent = TITLES[v][0]; $("#pageSub").textContent = TITLES[v][1];
    if (v === "conflicts") fill($("#conflictsBox"), API.conflicts, (c) => h("div", { class: "card" }, h("div", { class: "card-body" }, conflictBlock(c))), "No conflicts found in the uploaded documents.");
    if (v === "amendments") fill($("#amendBox"), API.amendments, (a) => h("div", { class: "card" }, h("div", { class: "card-body" }, h("h3", {}, a.subject), chainBlock(a.chain, a.applicability))), "No amendment chains found.");
  }
  document.querySelectorAll(".nav-i").forEach((b) => b.addEventListener("click", () => { show(b.dataset.view); if (window.innerWidth <= 1000) drawer(false); }));

  /* ---------- mobile drawer ---------- */
  function drawer(open) {
    document.body.classList.toggle("open", open);
    $("#menuBtn").setAttribute("aria-expanded", open);
  }
  $("#menuBtn").addEventListener("click", () => drawer(!document.body.classList.contains("open")));
  $("#closeSide").addEventListener("click", () => drawer(false));
  $("#scrim").addEventListener("click", () => drawer(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") drawer(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 1000) drawer(false); });

  count();
  checkServer();
})();