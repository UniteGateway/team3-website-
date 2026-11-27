// Editions are stored in this browser (IndexedDB). Export JSON regularly to back up or move to another computer.
const DB = 'weekend-studio', STORE = 'editions';
function open() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
async function tx(mode, fn) {
  const db = await open();
  return new Promise((res, rej) => { const t = db.transaction(STORE, mode); const r = fn(t.objectStore(STORE)); t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error); });
}
export const listEditions = async () => ((await tx('readonly', (s) => s.getAll())) || []).sort((a, b) => b.updated - a.updated);
export const getEdition = (id) => tx('readonly', (s) => s.get(id));
export const putEdition = (ed) => { ed.updated = Date.now(); return tx('readwrite', (s) => s.put(ed)); };
export const deleteEdition = (id) => tx('readwrite', (s) => s.delete(id));

export async function api(path, opts = {}) {
  const r = await fetch(path, { credentials: 'same-origin', ...opts });
  if (r.status === 401) { location.href = '/weekend/?next=' + encodeURIComponent(location.pathname + location.search); throw new Error('signed out'); }
  return r.json();
}
export async function signOut() { await fetch('/api/weekend-logout', { method: 'POST' }); location.href = '/weekend/'; }

export function download(name, text, type = 'application/json') {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// Resize an uploaded photo for print (max 2400 px long side, JPEG 0.9) and return a data URL.
export function fileToDataURL(file, max = 2400) {
  return new Promise((res, rej) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      const g = c.getContext('2d'); if (file.type !== 'image/png') { g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); } g.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(file.type === 'image/png' ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Not an image')); }; img.src = url;
  });
}
