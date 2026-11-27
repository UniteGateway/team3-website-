// Weekend News Studio — broadsheet editor (drag & drop, resize, inline text editing, news import, auto images, print to PDF).
import { pageEl, blockStyle, blockInner, uid, FONTS, PAGE_W, PAGE_H, MARGIN, longDate } from './render.js';
import { TEMPLATES, buildPage } from './templates.js';
import { getEdition, putEdition, api, download, fileToDataURL } from './store.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const PT = 4 / 3; // css px per point
const params = new URLSearchParams(location.search);

let ed, cur = 0, sel = null, editing = null, scale = 0.5, grid = false, clip = null;
let hist = [], hi = -1;
const stage = $('#stage'), wrap = $('#wrap'), props = $('#props');
let pg = null; // current page element

const page = () => ed.pages[cur];
const blk = (id = sel) => page().blocks.find((b) => b.id === id);
const toast = (t, ms = 2600) => { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), ms); };

/* ---------------------------------------------------------------- load */
ed = await getEdition(params.get('id'));
if (!ed) { document.body.innerHTML = '<p style="padding:40px">Edition not found in this browser. <a href="/weekend/app/">Back to dashboard</a></p>'; throw new Error('no edition'); }
api('/api/weekend-me').catch(() => {});
$('#title').value = ed.title; $('#date').value = ed.date;
$('#addTpl').innerHTML = TEMPLATES.map((t) => `<option value="${t.id}">${t.name}</option>`).join('');
hist = [snap()]; hi = 0;

/* ---------------------------------------------------------------- history & saving */
function snap() { return JSON.stringify({ pages: ed.pages, cur }); }
let saveT, thumbT;
function commit(rerender = false) {
  const s = snap(); if (s === hist[hi]) return;
  hist = hist.slice(0, hi + 1); hist.push(s); if (hist.length > 80) hist.shift(); hi = hist.length - 1;
  scheduleSave(); clearTimeout(thumbT); thumbT = setTimeout(renderPages, 700);
  if (rerender) renderStage();
  updUndo();
}
function scheduleSave() { $('#saved').textContent = 'Saving…'; clearTimeout(saveT); saveT = setTimeout(async () => { await putEdition(ed); $('#saved').textContent = 'Saved'; }, 500); }
function restore(i) { const s = JSON.parse(hist[i]); ed.pages = s.pages; cur = Math.min(s.cur, ed.pages.length - 1); hi = i; sel = null; editing = null; renderAll(); scheduleSave(); updUndo(); }
function updUndo() { $('#undo').disabled = hi <= 0; $('#redo').disabled = hi >= hist.length - 1; }
$('#undo').onclick = () => hi > 0 && restore(hi - 1);
$('#redo').onclick = () => hi < hist.length - 1 && restore(hi + 1);

/* ---------------------------------------------------------------- stage */
function fitScale() {
  const z = $('#zoom').value, w = stage.clientWidth - 60, h = stage.clientHeight - 60;
  if (z === 'fit') return Math.max(0.2, w / (PAGE_W * PT));
  if (z === 'page') return Math.max(0.15, Math.min(w / (PAGE_W * PT), h / (PAGE_H * PT)));
  return +z;
}
function renderStage() {
  scale = fitScale();
  wrap.style.width = PAGE_W * PT * scale + 'px'; wrap.style.height = PAGE_H * PT * scale + 'px';
  wrap.innerHTML = '';
  pg = pageEl(page(), { edit: true }); pg.style.transform = `scale(${scale})`; wrap.appendChild(pg);
  stage.classList.toggle('grid', grid);
  $$('.blk', pg).forEach(markOverflow);
  drawHandles(); renderProps();
}
function rerenderBlock(b) {
  const el = $(`.blk[data-id="${b.id}"]`, pg); if (!el) return renderStage();
  el.className = `blk b-${b.type}${b.lock ? ' locked' : ''}${b.id === sel ? ' sel' : ''}`;
  el.setAttribute('style', blockStyle(b));
  if (editing !== b.id) el.innerHTML = blockInner(b, { edit: true });
  markOverflow(el); drawHandles();
}
function markOverflow(el) {
  if (!el.classList.contains('b-text')) return;
  const t = el.firstElementChild; el.classList.toggle('over', !!t && (t.scrollHeight > el.clientHeight + 2 || t.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2));
}
function drawHandles() {
  $$('.hnd', wrap).forEach((h) => h.remove());
  $$('.blk.sel', pg).forEach((e) => e.classList.remove('sel'));
  const b = sel && blk(); if (!b) return;
  const el = $(`.blk[data-id="${b.id}"]`, pg); el && el.classList.add('sel');
  if (b.lock || editing) return;
  const k = PT * scale;
  for (const [h, fx, fy] of [['nw', 0, 0], ['n', .5, 0], ['ne', 1, 0], ['e', 1, .5], ['se', 1, 1], ['s', .5, 1], ['sw', 0, 1], ['w', 0, .5]]) {
    const d = document.createElement('div'); d.className = 'hnd'; d.dataset.h = h;
    d.style.left = (b.x + b.w * fx) * k + 'px'; d.style.top = (b.y + b.h * fy) * k + 'px';
    d.style.cursor = { n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize', nw: 'nwse-resize', se: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize' }[h];
    wrap.appendChild(d);
  }
}
function select(id) {
  if (editing && editing !== id) stopEdit();
  sel = id; drawHandles(); renderProps();
}
function guide(vertical, pos) {
  const g = document.createElement('div'); g.className = 'guide'; const k = PT * scale;
  if (vertical) Object.assign(g.style, { left: pos * k + 'px', top: 0, width: '1px', height: '100%' });
  else Object.assign(g.style, { top: pos * k + 'px', left: 0, height: '1px', width: '100%' });
  wrap.appendChild(g);
}

/* snapping: grid (3pt) plus page margins, centre and other blocks' edges */
function snapLines(skip) {
  const xs = [MARGIN, PAGE_W - MARGIN, PAGE_W / 2], ys = [MARGIN, PAGE_H - MARGIN, PAGE_H / 2];
  for (const o of page().blocks) if (o.id !== skip) { xs.push(o.x, o.x + o.w); ys.push(o.y, o.y + o.h); }
  return { xs, ys };
}
function snapVal(v, lines, tol) { let best = null; for (const l of lines) if (Math.abs(l - v) <= tol && (best === null || Math.abs(l - v) < Math.abs(best - v))) best = l; return best; }

/* ---------------------------------------------------------------- pointer: move & resize */
let drag = null;
wrap.addEventListener('pointerdown', (e) => {
  const h = e.target.closest('.hnd');
  const el = e.target.closest('.blk');
  if (!h && !el) { if (editing) stopEdit(); select(null); return; }
  if (el && editing === el.dataset.id) return; // typing inside the block
  if (e.button !== 0) return;
  const b = h ? blk() : page().blocks.find((x) => x.id === el.dataset.id);
  if (!h) select(b.id);
  if (b.lock) return;
  e.preventDefault();
  drag = { h: h && h.dataset.h, sx: e.clientX, sy: e.clientY, b, o: { x: b.x, y: b.y, w: b.w, h: b.h }, moved: false, pid: e.pointerId };
});
window.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const k = PT * scale, dx = (e.clientX - drag.sx) / k, dy = (e.clientY - drag.sy) / k;
  if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 2 / scale) return;
  // moves are tracked on window so dragging past the page edge keeps working
  drag.moved = true;
  const { b, o, h } = drag; const tol = 5 / scale / PT * 1.5; const L = snapLines(b.id);
  const g = (v) => (grid ? Math.round(v / 3) * 3 : Math.round(v * 2) / 2);
  $$('.guide', wrap).forEach((x) => x.remove());
  if (!h) {
    let x = g(o.x + dx), y = g(o.y + dy);
    const sx = snapVal(x, L.xs, tol), sx2 = snapVal(x + b.w, L.xs, tol), sxc = snapVal(x + b.w / 2, L.xs, tol);
    if (sx !== null) { x = sx; guide(true, sx); } else if (sx2 !== null) { x = sx2 - b.w; guide(true, sx2); } else if (sxc !== null) { x = sxc - b.w / 2; guide(true, sxc); }
    const sy = snapVal(y, L.ys, tol), sy2 = snapVal(y + b.h, L.ys, tol);
    if (sy !== null) { y = sy; guide(false, sy); } else if (sy2 !== null) { y = sy2 - b.h; guide(false, sy2); }
    b.x = x; b.y = y;
  } else {
    let { x, y, w, h: hh } = o;
    if (h.includes('e')) w = o.w + dx; if (h.includes('s')) hh = o.h + dy;
    if (h.includes('w')) { x = o.x + dx; w = o.w - dx; } if (h.includes('n')) { y = o.y + dy; hh = o.h - dy; }
    if (e.shiftKey && b.type === 'image' && h.length === 2) hh = w * (o.h / o.w);
    x = g(x); y = g(y); w = g(w); hh = g(hh);
    if (h.includes('e')) { const s = snapVal(x + w, L.xs, tol); if (s !== null) { w = s - x; guide(true, s); } }
    if (h.includes('s')) { const s = snapVal(y + hh, L.ys, tol); if (s !== null) { hh = s - y; guide(false, s); } }
    if (h.includes('w')) { const s = snapVal(x, L.xs, tol); if (s !== null) { w += x - s; x = s; guide(true, s); } }
    if (h.includes('n')) { const s = snapVal(y, L.ys, tol); if (s !== null) { hh += y - s; y = s; guide(false, s); } }
    b.x = x; b.y = y; b.w = Math.max(6, w); b.h = Math.max(b.type === 'rule' ? 0.25 : 6, hh);
  }
  const el = $(`.blk[data-id="${b.id}"]`, pg); el.setAttribute('style', blockStyle(b)); markOverflow(el);
  $$('.hnd', wrap).forEach((x) => x.remove()); drawHandles(); updatePos();
});
wrap.addEventListener('dragstart', (e) => { if (!editing) e.preventDefault(); });
wrap.addEventListener('pointercancel', () => { drag = null; clearGuides(); });
function clearGuides() { $$('.guide', wrap).forEach((x) => x.remove()); }
window.addEventListener('pointerup', () => { if (drag) { const m = drag.moved; drag = null; $$('.guide', wrap).forEach((x) => x.remove()); if (m) commit(); drawHandles(); } });

/* ---------------------------------------------------------------- text editing */
wrap.addEventListener('dblclick', (e) => {
  const hit = document.elementFromPoint(e.clientX, e.clientY) || e.target;
  if (editing && hit.closest(`.blk[data-id="${editing}"]`)) return;
  const el = hit.closest('.blk.b-text'); if (!el) { const im = hit.closest('.blk.b-image'); if (im) { select(im.dataset.id); $('#upRep').click(); } return; }
  const b = page().blocks.find((x) => x.id === el.dataset.id); if (b.lock) return;
  startEdit(b, el, e);
});
function startEdit(b, el, e) {
  editing = b.id; sel = b.id; el.classList.add('editing');
  const t = el.firstElementChild; t.contentEditable = 'true'; t.focus();
  if (e && document.caretRangeFromPoint) { const r = document.caretRangeFromPoint(e.clientX, e.clientY); if (r) { const s = getSelection(); s.removeAllRanges(); s.addRange(r); } }
  drawHandles(); renderProps();
  t.addEventListener('input', () => markOverflow(el));
  t.addEventListener('paste', (ev) => { ev.preventDefault(); const txt = (ev.clipboardData || window.clipboardData).getData('text/plain'); document.execCommand('insertText', false, txt); });
}
function stopEdit() {
  if (!editing) return;
  const el = $(`.blk[data-id="${editing}"]`, pg); const b = blk(editing);
  if (el && b) { const t = el.firstElementChild; t.contentEditable = 'false'; b.html = t.innerHTML; el.classList.remove('editing'); }
  editing = null; commit(); drawHandles(); renderProps();
}

/* ---------------------------------------------------------------- keyboard */
document.addEventListener('keydown', (e) => {
  const inField = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  const mod = e.ctrlKey || e.metaKey;
  if (editing) { if (e.key === 'Escape') { stopEdit(); } return; }
  if (inField) return;
  if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? $('#redo').click() : $('#undo').click(); return; }
  if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); $('#redo').click(); return; }
  if (mod && e.key.toLowerCase() === 'p') { e.preventDefault(); printEdition(); return; }
  const b = sel && blk(); if (!b) return;
  if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicate(); return; }
  if (mod && e.key.toLowerCase() === 'c') { clip = structuredClone(b); toast('Copied block — paste on any page with Ctrl+V'); return; }
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(); return; }
  if (e.key === 'Enter' && b.type === 'text') { e.preventDefault(); startEdit(b, $(`.blk[data-id="${b.id}"]`, pg)); return; }
  if (e.key === 'Escape') { select(null); return; }
  const step = e.shiftKey ? 10 : 1, mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
  if (mv && !b.lock) { e.preventDefault(); b.x += mv[0]; b.y += mv[1]; rerenderBlock(b); updatePos(); clearTimeout(b._t); b._t = setTimeout(() => { delete b._t; commit(); }, 400); }
});
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v' && clip && !editing && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
    const n = structuredClone(clip); n.id = uid(); n.x += 12; n.y += 12; n.z = topZ() + 1; page().blocks.push(n); sel = n.id; commit(true);
  }
});

/* ---------------------------------------------------------------- block actions */
const topZ = () => Math.max(1, ...page().blocks.map((b) => b.z || 1));
function duplicate() { const b = blk(); const n = structuredClone(b); n.id = uid(); n.x += 12; n.y += 12; n.z = topZ() + 1; page().blocks.push(n); sel = n.id; commit(true); }
function remove() { page().blocks = page().blocks.filter((b) => b.id !== sel); sel = null; commit(true); }
function addBlock(b, select = true) { b.id = uid(); b.z = topZ() + 1; page().blocks.push(b); if (select) sel = b.id; commit(true); return b; }
function centreOf(w, h) { const r = stage.getBoundingClientRect(), p = pg.getBoundingClientRect(); const k = PT * scale;
  const cx = ((r.left + r.width / 2) - p.left) / k, cy = ((r.top + Math.min(r.height, 900) / 2) - p.top) / k;
  return { x: Math.round(Math.min(Math.max(MARGIN, cx - w / 2), PAGE_W - MARGIN - w)), y: Math.round(Math.min(Math.max(MARGIN, cy - h / 2), PAGE_H - MARGIN - h)) }; }
const SERIF = FONTS[0][1], INTER = FONTS[3][1];
const INSERTS = {
  headline: () => ({ type: 'text', w: 560, h: 60, html: 'New headline', style: { font: SERIF, size: 30, weight: 700, lh: 1.08 } }),
  text: () => ({ type: 'text', w: 280, h: 260, html: '<p>Type your story here…</p>', style: { font: SERIF, size: 9.5, lh: 1.35 } }),
  text3: () => ({ type: 'text', w: 580, h: 240, html: '<p>Type your story here…</p>', style: { font: SERIF, size: 9.5, lh: 1.35, cols: 3, gap: 12, colRule: true } }),
  brief: () => ({ type: 'text', w: 220, h: 300, html: '<p><b>In brief</b></p><p><b>Headline</b><br>Two or three lines.</p>', style: { font: SERIF, size: 9, lh: 1.3, bg: '#FCEFD8', pad: 8 } }),
  image: () => ({ type: 'image', w: 360, h: 240, src: '', label: 'Photo', q: '', credit: '', style: { fit: 'cover' } }),
  ad: () => ({ type: 'image', w: 440, h: 300, src: '', label: 'Advertisement · 440 × 300 pt', q: '', credit: '', style: { fit: 'contain' } }),
  caption: () => ({ type: 'text', w: 300, h: 26, html: 'Caption — who, what, where. (Photo: credit)', style: { font: INTER, size: 7.5, italic: true, color: '#444', lh: 1.25 } }),
  label: () => ({ type: 'text', w: 160, h: 22, html: 'SECTION', style: { font: 'Manrope, Arial, sans-serif', size: 10, weight: 800, color: '#fff', bg: '#E11D2E', pad: 4, ls: 1, upper: true } }),
  box: () => ({ type: 'box', w: 300, h: 200, style: { bg: '#FFF6D6' } }),
  rule: () => ({ type: 'rule', w: 900, h: 1, style: { color: '#111' } }),
};
$$('[data-ins]').forEach((bt) => bt.onclick = () => { const b = INSERTS[bt.dataset.ins](); Object.assign(b, centreOf(b.w, b.h)); if (bt.dataset.ins === 'rule') b.x = MARGIN; addBlock(b); });

/* ---------------------------------------------------------------- images: upload, drop, search, auto */
const isAd = (b) => /^Advertisement/i.test(b.label || '');
function setImage(b, src, credit = '', alt = '') { b.src = src; b.credit = credit; if (alt) b.alt = alt; }
$('#upNew').onchange = async (e) => {
  for (const f of e.target.files) {
    try { const src = await fileToDataURL(f); const b = blk(); if (b && b.type === 'image' && !b.src) { setImage(b, src, '', f.name); commit(true); continue; }
      const dim = await imgSize(src); const w = 360, h = Math.round(w * dim.h / dim.w); addBlock({ type: 'image', ...centreOf(w, h), w, h, src, label: f.name, credit: '', style: { fit: 'cover' } });
    } catch { toast(`${f.name} is not an image`); }
  }
  e.target.value = '';
};
$('#upRep').onchange = async (e) => { const f = e.target.files[0]; const b = blk(); if (f && b) { setImage(b, await fileToDataURL(f), '', f.name); commit(true); } e.target.value = ''; };
const imgSize = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r({ w: i.naturalWidth || 4, h: i.naturalHeight || 3 }); i.onerror = () => r({ w: 4, h: 3 }); i.src = src; });

stage.addEventListener('dragover', (e) => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); $$('.blk.drop', pg).forEach((x) => x.classList.remove('drop')); const el = e.target.closest('.blk.b-image'); el && el.classList.add('drop'); } });
stage.addEventListener('dragleave', (e) => { if (!stage.contains(e.relatedTarget)) $$('.blk.drop', pg).forEach((x) => x.classList.remove('drop')); });
stage.addEventListener('drop', async (e) => {
  const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith('image/')); if (!files.length) return; e.preventDefault();
  $$('.blk.drop', pg).forEach((x) => x.classList.remove('drop'));
  const el = e.target.closest('.blk.b-image'); const src = await fileToDataURL(files[0]);
  if (el) { const b = page().blocks.find((x) => x.id === el.dataset.id); setImage(b, src, '', files[0].name); sel = b.id; commit(true); return; }
  const p = pg.getBoundingClientRect(), k = PT * scale, d = await imgSize(src), w = 360, h = Math.round(w * d.h / d.w);
  addBlock({ type: 'image', x: Math.round((e.clientX - p.left) / k - w / 2), y: Math.round((e.clientY - p.top) / k - h / 2), w, h, src, label: files[0].name, credit: '', style: { fit: 'cover' } });
});

const imgCache = new Map();
async function searchImages(q) {
  q = q.trim().toLowerCase(); if (!q) return [];
  if (!imgCache.has(q)) { const d = await api('/api/weekend-images?q=' + encodeURIComponent(q)); if (d.error) toast(d.error); imgCache.set(q, d.items || []); }
  return imgCache.get(q);
}
const creditOf = (it) => `Photo: ${it.creator} / ${it.provider || 'Openverse'} · ${it.license}`;
function applyFound(it) {
  const b = blk();
  if (b && b.type === 'image') { setImage(b, it.url, creditOf(it), it.title); b.source = it.source_url; commit(true); return; }
  const w = 360, h = it.width && it.height ? Math.round(w * it.height / it.width) : 240;
  const n = addBlock({ type: 'image', ...centreOf(w, h), w, h, src: it.url, label: it.title, credit: creditOf(it), style: { fit: 'cover' } }); n.source = it.source_url;
}
async function showImages(q) {
  const box = $('#imgs'); box.innerHTML = '<p class="muted">Searching…</p>';
  try {
    const items = await searchImages(q); box.innerHTML = items.length ? '' : '<p class="muted">No free-licence photos found — try other words.</p>';
    for (const it of items) { const bt = document.createElement('button'); bt.type = 'button'; bt.title = `${it.title} — ${creditOf(it)}`; bt.innerHTML = `<img src="${esc(it.thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer"><span>${esc(it.creator)} · ${esc(it.license)}</span>`; bt.onclick = () => applyFound(it); box.appendChild(bt); }
  } catch { box.innerHTML = '<p class="muted">Search failed.</p>'; }
}
$('#iGo').onclick = () => showImages($('#iq').value);
$('#iq').onkeydown = (e) => { if (e.key === 'Enter') showImages($('#iq').value); };
$('#iUrlGo').onclick = () => { const u = $('#iurl').value.trim(); if (!/^https:\/\//.test(u)) return toast('Use an https:// image link'); applyFound({ url: u, title: 'Image', creator: 'Supplied', provider: 'web', license: 'check rights' }); };

const STOP = new Set('the a an and or of to in on for with at by from is are was were be as its it this that new over after into says say will has have more than how why what who news'.split(' '));
function keywords(t) { return String(t).replace(/<[^>]+>/g, ' ').replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w.toLowerCase())).slice(0, 3).join(' '); }
function nearestHeadline(p, b) {
  let best = null, bd = 1e9;
  for (const o of p.blocks) if (o.type === 'text' && (o.style?.size || 0) >= 16 && !/goes here|headline/i.test(o.html)) { const d = Math.abs(o.x - b.x) + Math.abs(o.y + o.h - b.y); if (d < bd) { bd = d; best = o; } }
  return best && bd < 400 ? keywords(best.html) : '';
}
async function autoImages(pages = [page()]) {
  const targets = pages.flatMap((p) => p.blocks.filter((b) => b.type === 'image' && !b.src && !isAd(b)).map((b) => [p, b]));
  if (!targets.length) return toast('No empty photo boxes to fill.');
  toast(`Loading ${targets.length} free-licence photo${targets.length > 1 ? 's' : ''}…`);
  const used = new Set(pages.flatMap((p) => p.blocks.map((b) => b.src).filter(Boolean))); let n = 0;
  for (const [p, b] of targets) {
    const q = nearestHeadline(p, b) || b.q || 'newspaper';
    try { let items = await searchImages(q); if (!items.length && b.q && q !== b.q) items = await searchImages(b.q);
      const it = items.find((x) => !used.has(x.url)); if (it) { used.add(it.url); setImage(b, it.url, creditOf(it), it.title); b.source = it.source_url; n++; }
    } catch { /* keep going */ }
  }
  commit(true); toast(`${n} of ${targets.length} photos added. Credits are shown on each photo.`);
}
$('#autoImg').onclick = () => autoImages();

/* ---------------------------------------------------------------- news */
async function loadNews() {
  const box = $('#news'); box.innerHTML = '<p class="muted">Loading headlines…</p>';
  const q = $('#nq').value.trim();
  try {
    const d = await api(`/api/weekend-news?topic=${$('#topic').value}${q ? '&q=' + encodeURIComponent(q) : ''}`);
    box.innerHTML = d.items?.length ? '' : '<p class="muted">No headlines right now — try another topic.</p>';
    for (const it of d.items || []) {
      const c = document.createElement('div'); c.className = 'news-item';
      const when = it.published ? new Date(it.published).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
      c.innerHTML = `<b>${esc(it.title)}</b>${it.summary ? `<div>${esc(it.summary)}</div>` : ''}<small>${esc(it.source)}${when ? ' · ' + when : ''}</small>
<div class="row"><button class="btn sm" data-a="h">Use headline</button><button class="btn sm dark" data-a="s">Add story</button>${it.link ? `<a class="btn sm" href="${esc(it.link)}" target="_blank" rel="noopener noreferrer">Read source ↗</a>` : ''}</div>`;
      c.querySelector('[data-a=h]').onclick = () => useHeadline(it);
      c.querySelector('[data-a=s]').onclick = () => addStory(it);
      box.appendChild(c);
    }
  } catch { box.innerHTML = '<p class="muted">Could not load news.</p>'; }
}
function useHeadline(it) {
  const b = blk();
  if (b && b.type === 'text') { b.html = esc(it.title); commit(true); return toast('Headline placed — rewrite it in your own words.'); }
  const n = INSERTS.headline(); n.html = esc(it.title); Object.assign(n, centreOf(n.w, n.h)); addBlock(n);
}
function addStory(it) {
  const body = `<p>${esc(it.summary || 'Write the story here in your own words.')}</p><p><i>Source: ${esc(it.source)}. Rewrite and verify before printing.</i></p>`;
  const b = blk();
  if (b && b.type === 'text' && (b.style?.size || 10) < 16) { b.html = body; commit(true); return; }
  const pos = centreOf(580, 400);
  const h = addBlock({ type: 'text', x: pos.x, y: pos.y, w: 580, h: 60, html: esc(it.title), style: { font: SERIF, size: 26, weight: 700, lh: 1.08 } }, false);
  const im = addBlock({ type: 'image', x: pos.x, y: pos.y + 66, w: 220, h: 160, src: '', label: 'Story photo', q: keywords(it.title), credit: '', style: { fit: 'cover' } }, false);
  addBlock({ type: 'text', x: pos.x + 230, y: pos.y + 66, w: 350, h: 300, html: body, style: { font: SERIF, size: 9.5, lh: 1.35, cols: 2, gap: 12 } });
  void h; autoImages([page()]).then(() => {}); void im;
}
$('#nGo').onclick = loadNews; $('#topic').onchange = loadNews; $('#nq').onkeydown = (e) => { if (e.key === 'Enter') loadNews(); };

/* ---------------------------------------------------------------- pages panel */
function renderPages() {
  const box = $('#pages'); box.innerHTML = '';
  ed.pages.forEach((p, i) => {
    const d = document.createElement('div'); d.className = 'pg' + (i === cur ? ' cur' : ''); d.tabIndex = 0;
    const th = document.createElement('div'); th.className = 'th'; th.appendChild(pageEl(p));
    const m = document.createElement('div');
    m.innerHTML = `<b>Page ${i + 1}</b><small>${esc(p.name || '')}</small><div class="row"><button class="btn sm" data-a="up" title="Move up" ${i ? '' : 'disabled'}>↑</button><button class="btn sm" data-a="dn" title="Move down" ${i < ed.pages.length - 1 ? '' : 'disabled'}>↓</button><button class="btn sm" data-a="dup" title="Duplicate page">⧉</button><button class="btn sm" data-a="del" title="Delete page" ${ed.pages.length > 1 ? '' : 'disabled'}>✕</button></div>`;
    d.append(th, m);
    d.onclick = (e) => {
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'up') { [ed.pages[i - 1], ed.pages[i]] = [ed.pages[i], ed.pages[i - 1]]; cur = i - 1; }
      else if (a === 'dn') { [ed.pages[i + 1], ed.pages[i]] = [ed.pages[i], ed.pages[i + 1]]; cur = i + 1; }
      else if (a === 'dup') { const c = structuredClone(p); c.id = uid(); c.blocks.forEach((b) => (b.id = uid())); ed.pages.splice(i + 1, 0, c); cur = i + 1; }
      else if (a === 'del') { if (!confirm(`Delete page ${i + 1}?`)) return; ed.pages.splice(i, 1); cur = Math.min(cur, ed.pages.length - 1); }
      else { if (cur === i) return; cur = i; }
      sel = null; editing = null; commit(); renderAll();
    };
    d.onkeydown = (e) => { if (e.key === 'Enter') d.click(); };
    box.appendChild(d);
  });
}
$('#addPage').onclick = () => { const p = buildPage($('#addTpl').value, ed, ed.pages.length + 1); ed.pages.splice(cur + 1, 0, p); cur += 1; sel = null; commit(); renderAll(); };

/* ---------------------------------------------------------------- properties panel */
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
function field(label, html) { return `<label>${label}${html}</label>`; }
function inp(key, val, type = 'number', extra = '') { return `<input data-k="${key}" type="${type}" value="${esc(val ?? '')}" ${extra}>`; }
function sel_(key, val, opts) { return `<select data-k="${key}">${opts.map(([l, v]) => `<option value="${esc(v)}" ${String(v) === String(val ?? '') ? 'selected' : ''}>${l}</option>`).join('')}</select>`; }
function updatePos() { const b = blk(); if (!b) return; for (const k of ['x', 'y', 'w', 'h']) { const i = $(`[data-k="${k}"]`, props); if (i && document.activeElement !== i) i.value = Math.round(b[k] * 10) / 10; } }

function renderProps() {
  const b = sel && blk();
  if (!b) {
    const p = page();
    props.innerHTML = `<h3>Page ${cur + 1}</h3>
${field('Page name', `<input data-pg="name" value="${esc(p.name || '')}">`)}
${field('Page background', `<input data-pg="bg" type="color" value="${esc(p.bg || '#ffffff')}">`)}
<h3>Edition</h3>
${field('Masthead', `<input data-ed="masthead" value="${esc(ed.masthead || '')}">`)}
<div class="grid2">${field('City', `<input data-ed="city" value="${esc(ed.city || '')}">`)}${field('Issue', `<input data-ed="issue" type="number" min="1" value="${esc(ed.issue || 1)}">`)}</div>
<p class="muted">Changing the masthead, date, city or issue updates matching text on every page.</p>
<h3>Size</h3><p class="muted">Broadsheet 13.5 × 21 in (972 × 1512 pt). Blue dashed line = 0.5 in safe margin.</p>
<h3>Shortcuts</h3><p class="muted">Double-click text to type · Enter edits selected text · Esc finishes · Arrows nudge (Shift = 10 pt) · Ctrl+D duplicate · Ctrl+C / Ctrl+V copy between pages · Delete removes · Ctrl+Z undo · Shift-drag a photo corner keeps its shape.</p>`;
    $$('[data-pg]', props).forEach((i) => i.oninput = () => { p[i.dataset.pg] = i.value; if (i.dataset.pg === 'bg') pg.style.background = i.value; scheduleSave(); });
    $$('[data-pg]', props).forEach((i) => i.onchange = () => commit());
    $$('[data-ed]', props).forEach((i) => i.onchange = () => setEdition(i.dataset.ed, i.value));
    return;
  }
  const s = b.style || (b.style = {});
  let h = `<h3>${{ text: 'Text', image: isAd(b) ? 'Ad slot' : 'Photo', box: 'Colour box', rule: 'Line' }[b.type]}</h3>
<div class="grid4">${field('X', inp('x', b.x))}${field('Y', inp('y', b.y))}${field('W', inp('w', b.w))}${field('H', inp('h', b.h))}</div>
<div class="row"><button class="btn sm" data-a="front">Bring front</button><button class="btn sm" data-a="back">Send back</button><button class="btn sm" data-a="lock">${b.lock ? 'Unlock' : 'Lock'}</button></div>
<div class="row"><button class="btn sm" data-a="dup">Duplicate</button><button class="btn sm" data-a="full">Full width</button><button class="btn sm" data-a="del" style="color:#DA1220">Delete</button></div>`;
  if (b.type === 'text') {
    h += `<h3>Text</h3>
<div class="fmt">${editing ? '<button class="btn sm" data-x="bold"><b>B</b></button><button class="btn sm" data-x="italic"><i>I</i></button><button class="btn sm" data-x="underline"><u>U</u></button><button class="btn sm" data-x="insertUnorderedList">• List</button><button class="btn sm" data-x="removeFormat">Clear</button>' : `<button class="btn sm dark" data-a="edit">✎ Edit text</button><button class="btn sm" data-a="fit">Fit text to box</button>`}</div>
${editing ? '<p class="muted">Select words, then use the buttons. Press Esc when done.</p>' : ''}
${field('Font', sel_('style.font', s.font || FONTS[0][1], FONTS))}
<div class="grid2">${field('Size (pt)', inp('style.size', s.size || 10, 'number', 'step="0.5" min="4"'))}${field('Weight', sel_('style.weight', s.weight || 400, [['Regular', 400], ['Semibold', 600], ['Bold', 700], ['Black', 800]]))}</div>
<div class="grid2">${field('Colour', inp('style.color', s.color || '#111111', 'color'))}${field('Line height', inp('style.lh', s.lh || 1.3, 'number', 'step="0.05" min="0.8"'))}</div>
${field('Align', sel_('style.align', s.align || 'left', [['Left', 'left'], ['Centre', 'center'], ['Right', 'right'], ['Justify', 'justify']]))}
<div class="grid2">${field('Columns', sel_('style.cols', s.cols || 1, [1, 2, 3, 4, 5, 6].map((n) => [n, n])))}${field('Column gap', inp('style.gap', s.gap ?? 12))}</div>
<div class="grid2">${field('Letter spacing', inp('style.ls', s.ls || 0, 'number', 'step="0.25"'))}${field('Padding', inp('style.pad', s.pad || 0))}</div>
${field('Vertical align', sel_('style.valign', s.valign || '', [['Top', ''], ['Middle', 'center'], ['Bottom', 'flex-end']]))}
<div class="row"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-k="style.italic" ${s.italic ? 'checked' : ''} style="width:auto">Italic</label>
<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-k="style.upper" ${s.upper ? 'checked' : ''} style="width:auto">CAPS</label>
<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-k="style.colRule" ${s.colRule ? 'checked' : ''} style="width:auto">Column lines</label></div>`;
  }
  if (b.type === 'image') {
    h += `<h3>${isAd(b) ? 'Ad artwork' : 'Photo'}</h3>
<div class="row"><button class="btn sm dark" data-a="upload">⬆ Upload</button><button class="btn sm" data-a="search">Search free photos</button>${b.src ? '<button class="btn sm" data-a="clearimg">Remove</button>' : ''}</div>
${field('Label', inp('label', b.label || '', 'text'))}
${isAd(b) ? '' : field('Auto-image keywords', inp('q', b.q || '', 'text', 'placeholder="e.g. Hyderabad metro"'))}
${field('Fit', sel_('style.fit', s.fit || 'cover', [['Fill box (crop)', 'cover'], ['Show whole image', 'contain'], ['Stretch', 'fill']]))}
<div class="grid2">${field('Focus X %', inp('style.fx', s.fx ?? 50, 'range', 'min="0" max="100"'))}${field('Focus Y %', inp('style.fy', s.fy ?? 50, 'range', 'min="0" max="100"'))}</div>
${field('Credit', inp('credit', b.credit || '', 'text', 'placeholder="Photo: name / source"'))}
<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-k="style.showCredit" ${s.showCredit !== false ? 'checked' : ''} style="width:auto">Show credit on photo</label>
${b.source ? `<a class="muted" href="${esc(b.source)}" target="_blank" rel="noopener noreferrer">Licence & source ↗</a>` : ''}
${b.src && /^data:/.test(b.src) ? '<p class="muted">Uploaded photo — stored with this edition.</p>' : ''}`;
  }
  if (b.type !== 'rule') {
    h += `<h3>Box</h3><div class="grid2">${field('Background', inp('style.bg', s.bg || '#ffffff', 'color'))}${field('No background', `<input type="checkbox" data-a2="nobg" ${s.bg ? '' : 'checked'} style="width:auto">`)}</div>
<div class="grid2">${field('Border (pt)', inp('style.border', s.border || 0, 'number', 'step="0.25" min="0"'))}${field('Border colour', inp('style.borderColor', s.borderColor || '#111111', 'color'))}</div>
${field('Corner radius', inp('style.radius', s.radius || 0, 'number', 'min="0"'))}`;
  } else {
    h += `<h3>Line</h3>${field('Colour', inp('style.color', s.color || '#111111', 'color'))}`;
  }
  props.innerHTML = h;

  $$('[data-k]', props).forEach((i) => {
    const apply = () => {
      const k = i.dataset.k; let v = i.type === 'checkbox' ? i.checked : i.value;
      if (['x', 'y', 'w', 'h', 'style.size', 'style.lh', 'style.gap', 'style.ls', 'style.pad', 'style.border', 'style.radius', 'style.fx', 'style.fy', 'style.cols', 'style.weight'].includes(k)) v = num(v);
      if (k.startsWith('style.')) s[k.slice(6)] = v; else b[k] = v;
      rerenderBlock(b);
    };
    i.addEventListener('input', apply); i.addEventListener('change', () => { apply(); commit(); });
  });
  const nb = $('[data-a2=nobg]', props); if (nb) nb.onchange = () => { if (nb.checked) delete s.bg; else s.bg = '#ffffff'; rerenderBlock(b); commit(); renderProps(); };
  $$('[data-x]', props).forEach((bt) => bt.onmousedown = (e) => { e.preventDefault(); document.execCommand(bt.dataset.x); const el = $(`.blk[data-id="${b.id}"]`, pg); markOverflow(el); });
  $$('[data-a]', props).forEach((bt) => bt.onclick = () => {
    const a = bt.dataset.a;
    if (a === 'front') { b.z = topZ() + 1; commit(true); }
    if (a === 'back') { const m = Math.min(...page().blocks.map((x) => x.z || 1)); b.z = m - 1; commit(true); }
    if (a === 'lock') { b.lock = !b.lock; commit(true); }
    if (a === 'dup') duplicate();
    if (a === 'del') remove();
    if (a === 'full') { b.x = MARGIN; b.w = PAGE_W - 2 * MARGIN; commit(true); }
    if (a === 'edit') startEdit(b, $(`.blk[data-id="${b.id}"]`, pg));
    if (a === 'fit') fitText(b);
    if (a === 'upload') $('#upRep').click();
    if (a === 'search') { tab('images'); $('#iq').value = b.q || nearestHeadline(page(), b) || ''; if ($('#iq').value) showImages($('#iq').value); $('#iq').focus(); }
    if (a === 'clearimg') { b.src = ''; b.credit = ''; delete b.source; commit(true); }
  });
}
function fitText(b) {
  const el = $(`.blk[data-id="${b.id}"]`, pg); let size = b.style.size || 10; let guard = 0;
  const over = () => { markOverflow(el); return el.classList.contains('over'); };
  if (over()) { while (over() && size > 5 && guard++ < 60) { size -= 0.25; b.style.size = size; el.setAttribute('style', blockStyle(b)); } }
  else { while (!over() && size < 120 && guard++ < 200) { size += 0.25; b.style.size = size; el.setAttribute('style', blockStyle(b)); } if (over()) { size -= 0.25; b.style.size = size; } }
  rerenderBlock(b); commit(); renderProps();
}
function setEdition(key, val) {
  const old = { masthead: ed.masthead, date: longDate(ed.date), city: ed.city, issue: `ISSUE ${ed.issue}` }[key];
  if (key === 'date') { ed.date = val; } else ed[key] = key === 'issue' ? +val || 1 : val;
  const nw = { masthead: ed.masthead, date: longDate(ed.date), city: ed.city, issue: `ISSUE ${ed.issue}` }[key];
  if (old && nw && old !== nw) for (const p of ed.pages) for (const b of p.blocks) if (b.type === 'text' && b.html.includes(old)) b.html = b.html.split(old).join(esc(nw));
  scheduleSave(); commit(true); renderPages();
}
$('#title').onchange = () => { ed.title = $('#title').value.trim() || ed.title; scheduleSave(); };
$('#date').onchange = () => setEdition('date', $('#date').value);

/* ---------------------------------------------------------------- tabs, zoom, grid */
function tab(t) { $$('.tabs [role=tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.t === t))); $$('.side .pane[data-p]').forEach((p) => (p.hidden = p.dataset.p !== t)); if (t === 'news' && !$('#news').children.length) loadNews(); }
$$('.tabs [role=tab]').forEach((b) => (b.onclick = () => tab(b.dataset.t)));
$('#zoom').onchange = renderStage;
$('#gridBtn').onclick = () => { grid = !grid; $('#gridBtn').classList.toggle('on', grid); $('#gridBtn').setAttribute('aria-pressed', String(grid)); stage.classList.toggle('grid', grid); };
addEventListener('resize', () => { if (['fit', 'page'].includes($('#zoom').value)) renderStage(); });

/* ---------------------------------------------------------------- export & print */
$('#exportBtn').onclick = () => download(`${ed.title.replace(/[^\w-]+/g, '-')}.json`, JSON.stringify(ed));
async function printEdition() {
  if (editing) stopEdit();
  const root = $('#print-root'); root.innerHTML = '';
  ed.pages.forEach((p) => root.appendChild(pageEl(p)));
  await Promise.all($$('img', root).map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 15000); }))));
  const t = document.title; document.title = ed.title;
  toast('In the print dialog choose “Save as PDF”, paper 13.5 × 21 in (set automatically), margins: none, background graphics: on.', 6000);
  setTimeout(() => { window.print(); document.title = t; }, 300);
}
$('#printBtn').onclick = printEdition;
addEventListener('afterprint', () => { $('#print-root').innerHTML = ''; });

/* ---------------------------------------------------------------- start */
function renderAll() { renderStage(); renderPages(); }
renderAll(); updUndo();
if (params.get('auto') === '1') { history.replaceState(null, '', `?id=${ed.id}`); autoImages(ed.pages); }
