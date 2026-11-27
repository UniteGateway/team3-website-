import { pageEl, nextSaturday, uid, longDate } from './render.js';
import { TEMPLATES, newEdition, buildPage } from './templates.js';
import { listEditions, putEdition, deleteEdition, getEdition, api, signOut, download } from './store.js';

const $ = (s) => document.querySelector(s);
const nf = $('#nf'); nf.date.value = nextSaturday();
api('/api/weekend-me').then((d) => { $('#who').textContent = d.email || ''; }).catch(() => {});
$('#out').onclick = signOut;
nf.ai.checked = true;

function mini(page) { const w = document.createElement('div'); w.className = 'mini'; w.appendChild(pageEl(page)); return w; }
const fmt = (t) => new Date(t).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function renderEditions() {
  const eds = await listEditions(); const box = $('#eds'); box.innerHTML = '';
  if (!eds.length) { box.innerHTML = '<div class="empty">No editions yet — create one above.</div>'; return; }
  for (const ed of eds) {
    const c = document.createElement('article'); c.className = 'tcard';
    c.innerHTML = `<div class="pv"></div><div class="meta"><b>${esc(ed.title)}</b><span>${esc(longDate(ed.date))} · ${ed.pages.length} page${ed.pages.length > 1 ? 's' : ''}<br>Edited ${fmt(ed.updated)}</span>
<div class="acts"><a class="btn sm red" href="/weekend/app/editor.html?id=${ed.id}">Open</a><button class="btn sm" data-a="dup">Duplicate</button><button class="btn sm" data-a="exp">Export</button><button class="btn sm" data-a="del">Delete</button></div></div>`;
    c.querySelector('.pv').appendChild(mini(ed.pages[0]));
    c.querySelector('[data-a=dup]').onclick = async () => { const x = structuredClone(ed); x.id = uid(); x.title += ' (copy)'; x.created = Date.now(); await putEdition(x); renderEditions(); };
    c.querySelector('[data-a=exp]').onclick = async () => download(`${ed.title.replace(/[^\w-]+/g, '-')}.json`, JSON.stringify(await getEdition(ed.id)));
    c.querySelector('[data-a=del]').onclick = async () => { if (confirm(`Delete “${ed.title}”? This cannot be undone.`)) { await deleteEdition(ed.id); renderEditions(); } };
    box.appendChild(c);
  }
}

function renderTemplates() {
  const ed = { masthead: 'Weekend', date: nextSaturday(), city: 'HYDERABAD', issue: 1 };
  const box = $('#tpls');
  TEMPLATES.forEach((t, i) => {
    const c = document.createElement('article'); c.className = 'tcard';
    c.innerHTML = `<div class="pv"></div><div class="meta"><b>${t.name}</b><span>${t.desc}</span><div class="acts"><button class="btn sm red">Use template</button></div></div>`;
    c.querySelector('.pv').appendChild(mini(buildPage(t.id, ed, i + 1)));
    c.querySelector('button').onclick = () => create([t.id]);
    box.appendChild(c);
  });
}

async function create(plan) {
  const f = nf; const ed = newEdition({ masthead: f.masthead.value.trim() || 'Weekend', date: f.date.value || nextSaturday(), city: f.city.value.trim().toUpperCase() || 'HYDERABAD', issue: +f.issue.value || 1, plan });
  ed.autoAI = !!f.ai?.checked; await putEdition(ed); location.href = `/weekend/app/editor.html?id=${ed.id}&auto=1`;
}
nf.onsubmit = (e) => { e.preventDefault(); const p = nf.plan.value; create(p === 'front' ? ['front'] : p === '4' ? ['front', 'news', 'fullad', 'back'] : undefined); };

$('#imp').onchange = async (e) => {
  const f = e.target.files[0]; if (!f) return;
  try { const ed = JSON.parse(await f.text()); if (!ed.pages) throw 0; ed.id = uid(); await putEdition(ed); renderEditions(); } catch { alert('That file is not a Weekend edition.'); }
  e.target.value = '';
};
renderEditions(); renderTemplates();
