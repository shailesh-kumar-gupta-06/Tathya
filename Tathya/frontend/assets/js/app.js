(function () {
  const C = window.TATHYA_CONFIG, API = window.TathyaAPI;
  const $ = (s) => document.querySelector(s);
  let docs = [], selected = new Set();

  /* tiny DOM helper: all text goes through textContent, so document quotes can never inject HTML */
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

  /* ---------- mode pill ---------- */
  const pill = $("#modePill");
  pill.textContent = C.USE_MOCK ? "Demo mode: sample data, no AI running" : "Connected to Tathya server";
  pill.classList.toggle("live", !C.USE_MOCK);

  /* ---------- documents ---------- */
  function renderDocs() {
    const ul = $("#docList"); ul.replaceChildren();
    docs.forEach((d) => {
      const cb = h("input", { type: "checkbox", "aria-label": "Use " + d.name, onchange: (e) => {
        e.target.checked ? selected.add(d.id) : selected.delete(d.id); count();
      } });
      cb.checked = selected.has(d.id);
      ul.append(h("li", {},
        cb,
        h("div", {}, h("div", { class: "nm" }, d.name),
          h("div", { class: "st" + (d.status !== "ready" ? " proc" : "") },
            d.status === "ready" ? (d.pages ? d.pages + " pages · ready" : "Ready") : "Processing…")),
        h("button", { class: "x", type: "button", "aria-label": "Remove " + d.name, onclick: () => removeDoc(d.id) }, "×")));
    });
    $("#docEmpty").hidden = docs.length > 0; count();
  }
  function count() { $("#docCount").textContent = docs.length ? selected.size + " of " + docs.length + " selected for questions" : ""; }
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
    const files = [...fileList], ok = [];
    files.forEach((f) => {
      if (!/\.pdf$/i.test(f.name)) toast(f.name + " is not a PDF.");
      else if (f.size > C.MAX_MB * 1048576) toast(f.name + " is larger than " + C.MAX_MB + " MB.");
      else ok.push(f);
    });
    if (!ok.length) return;
    $("#docEmpty").textContent = "Reading " + ok.length + " file(s)…"; $("#docEmpty").hidden = false;
    try { setDocs(await API.upload(ok)); } catch (e) { toast(e.message); }
    $("#docEmpty").textContent = "No documents yet. Add at least one PDF to start asking.";
    renderDocs();
  }
  const drop = $("#drop");
  $("#fileInput").addEventListener("change", (e) => { addFiles(e.target.files); e.target.value = ""; });
  ["dragover", "dragenter"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

  if (C.USE_MOCK) {
    const b = $("#sampleBtn"); b.hidden = false;
    b.addEventListener("click", async () => { setDocs(await API.loadSamples()); });
  }

  /* ---------- renderers ---------- */
  const STATUS = { verified: "Verified", conflict_detected: "Conflict detected", insufficient_evidence: "Insufficient evidence" };
  const CLAIM = { supported: "Supported", unsupported: "Blocked: no proof", contradicted: "Contradicted" };

  const slip = (c, label) => h("div", { class: "slip" },
    label ? h("div", { class: "side" }, label) : null,
    h("blockquote", {}, "“" + c.quote + "”"),
    h("div", { class: "src" }, h("b", {}, c.document), " · page " + c.page + (c.evidence_id ? " · " + c.evidence_id : "")));

  function faith(f, claims) {
    if (!f) return null;
    const segs = (claims && claims.length ? claims : []).map((c) => h("span", { class: "seg " + c.status, title: c.text }));
    return h("div", { class: "faith" },
      h("div", { class: "lab" }, h("span", {}, f.supported + " of " + f.total + " claims backed by a quote"), h("b", {}, f.score + "%")),
      h("div", { class: "segs", role: "img", "aria-label": "Faithfulness " + f.score + " percent" }, segs));
  }
  function conflictBlock(c) {
    const resolved = c.verdict === "resolved_by_amendment";
    const label = resolved ? "Values differ, amendment applies" : c.verdict === "potential_conflict" ? "Potential conflict" : "Conflict";
    return h("div", { class: "confl" },
      h("h3", {}, c.subject, h("span", { class: "tag " + (resolved ? "supported" : "contradicted") }, label)),
      h("div", { class: "pair" }, slip(c.a, "Document A"), slip(c.b, "Document B")),
      h("p", { class: "verdict muted" }, c.note));
  }
  function chainBlock(chain, ap) {
    return h("div", {},
      h("ol", { class: "chain" }, chain.map((s) => h("li", {},
        h("div", { class: "role" }, s.role + ": " + s.document),
        h("div", { class: "meta" }, "page " + s.page + " · " + s.date),
        h("div", {}, s.text)))),
      ap ? h("p", { class: "applies" + (ap.resolved ? "" : " unsure") }, (ap.resolved ? "Applies today: " : "Not established: ") + ap.text) : null);
  }
  function resultCard(r) {
    const body = [];
    if (r.answer) body.push(h("p", { class: "answer" }, r.answer));
    if (r.message) body.push(h("p", { class: "msg" }, r.message));
    if (r.missing) body.push(h("p", { class: "msg muted" }, r.missing));
    if (r.note) body.push(h("p", { class: "msg muted" }, r.note));
    if (r.claims && r.claims.length) body.push(h("div", {}, h("h3", {}, "Claim check"),
      h("ul", { class: "claims" }, r.claims.map((c) => h("li", {},
        h("span", { class: "tag " + c.status }, CLAIM[c.status] || c.status),
        h("div", {}, c.text, c.evidence_ids.length ? h("div", { class: "ev" }, "Evidence: " + c.evidence_ids.join(", ")) : null))))));
    if (r.citations && r.citations.length) body.push(h("div", {}, h("h3", {}, "Sources"), h("div", { class: "cites" }, r.citations.map((c) => slip(c)))));
    if (r.conflicts && r.conflicts.length) body.push(h("div", {}, h("h3", {}, "Documents compared"), r.conflicts.map(conflictBlock)));
    if (r.amendment_chain) body.push(h("div", {}, h("h3", {}, "Amendment chain"), chainBlock(r.amendment_chain, r.applicability)));
    return h("article", { class: "card" },
      h("div", { class: "card-head" }, h("span", { class: "stamp " + r.status }, STATUS[r.status] || r.status), faith(r.faithfulness, r.claims)),
      h("div", { class: "card-body" }, body));
  }

  /* ---------- ask ---------- */
  const thread = $("#thread");
  async function ask(q) {
    if (!selected.size) { toast(docs.length ? "Tick at least one document to search." : "Add a PDF first."); return; }
    $("#intro").hidden = true;
    thread.append(h("div", { class: "qbubble" }, q));
    const wait = h("div", { class: "card" }, h("div", { class: "card-body dots", "aria-label": "Checking the documents" }, h("span"), h("span"), h("span")));
    thread.append(wait); $("#askBtn").disabled = true;
    wait.scrollIntoView({ behavior: "smooth", block: "center" });
    try { const r = await API.ask(q, [...selected]); wait.replaceWith(resultCard(r)); }
    catch (e) { wait.remove(); toast(e.message); }
    $("#askBtn").disabled = false;
    thread.lastElementChild.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $("#askForm").addEventListener("submit", (e) => { e.preventDefault(); const i = $("#q"), q = i.value.trim(); if (q) { i.value = ""; ask(q); } });
  [["What is the applicable interest rate?"], ["What is the minimum age to apply?"], ["What is the processing fee?"], ["What is the loan tenure?"]]
    .forEach(([q]) => $("#chips").append(h("button", { class: "chip", type: "button", onclick: () => ask(q) }, q)));

  /* ---------- tabs ---------- */
  async function fill(box, loader, render, emptyMsg) {
    box.replaceChildren(h("div", { class: "empty" }, "Loading…"));
    try { const d = await loader(); box.replaceChildren(...(d.length ? d.map(render) : [h("div", { class: "empty" }, emptyMsg)])); }
    catch (e) { box.replaceChildren(h("div", { class: "empty" }, e.message)); }
  }
  document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
    ["ask", "conflicts", "amendments"].forEach((v) => ($("#view-" + v).hidden = v !== b.dataset.view));
    $(".ask").hidden = b.dataset.view !== "ask";
    if (b.dataset.view === "conflicts") fill($("#conflictsBox"), API.conflicts, (c) => h("div", { class: "card" }, h("div", { class: "card-body" }, conflictBlock(c))), "No conflicts found in the uploaded documents.");
    if (b.dataset.view === "amendments") fill($("#amendBox"), API.amendments, (a) => h("div", { class: "card" }, h("div", { class: "card-body" }, h("h3", {}, a.subject), chainBlock(a.chain, a.applicability))), "No amendment chains found.");
  }));

  API.listDocuments().then(setDocs).catch((e) => { toast(e.message); renderDocs(); });
})();
