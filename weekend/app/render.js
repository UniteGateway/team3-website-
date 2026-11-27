// Shared renderer: turns edition JSON into newspaper page DOM (units: points; page = 972 × 1512 pt = 13.5 × 21 in broadsheet).
export const PAGE_W = 972, PAGE_H = 1512, MARGIN = 36;
export const FONTS = [
  ['Newspaper serif', 'Georgia, "Times New Roman", serif'],
  ['Classic Times', '"Times New Roman", Times, serif'],
  ['Manrope (headline sans)', 'Manrope, Arial, sans-serif'],
  ['Inter (clean sans)', 'Inter, Arial, sans-serif'],
  ['Condensed', '"Arial Narrow", "Roboto Condensed", "Helvetica Neue", Arial, sans-serif'],
  ['Impact', 'Impact, "Arial Black", sans-serif'],
];
export const uid = () => Math.random().toString(36).slice(2, 10);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function blockStyle(b) {
  const s = b.style || {};
  const css = [`left:${b.x}pt`, `top:${b.y}pt`, `width:${b.w}pt`, `height:${b.h}pt`, `z-index:${b.z || 1}`];
  if (s.bg) css.push(`background:${s.bg}`);
  if (s.border) css.push(`border:${s.border}pt solid ${s.borderColor || '#111'}`);
  if (s.radius) css.push(`border-radius:${s.radius}pt`);
  if (b.type === 'text') {
    css.push(`font-family:${s.font || FONTS[0][1]}`, `font-size:${s.size || 10}pt`, `font-weight:${s.weight || 400}`, `color:${s.color || '#111'}`,
      `text-align:${s.align || 'left'}`, `line-height:${s.lh || 1.3}`, `padding:${s.pad ?? 0}pt`);
    if (s.italic) css.push('font-style:italic');
    if (s.upper) css.push('text-transform:uppercase');
    if (s.ls) css.push(`letter-spacing:${s.ls}pt`);
    if ((s.cols || 1) > 1) css.push(`column-count:${s.cols}`, `column-gap:${s.gap ?? 12}pt`, s.colRule ? 'column-rule:0.5pt solid #999' : '');
    if (s.valign) css.push('display:flex', 'flex-direction:column', `justify-content:${s.valign}`);
  }
  if (b.type === 'rule') css.push(`background:${s.color || '#111'}`);
  return css.filter(Boolean).join(';');
}

export function blockInner(b, { edit = false } = {}) {
  if (b.type === 'text') return `<div class="t-body">${b.html || ''}</div>`;
  if (b.type === 'image') {
    const s = b.style || {};
    if (!b.src) return `<div class="img-ph"><b>${esc(b.label || 'Photo')}</b>${edit ? `<span>${b.q ? `Auto image: “${esc(b.q)}”` : 'Drop a photo, upload or search'}</span>` : ''}</div>`;
    const credit = b.credit && s.showCredit !== false ? `<span class="credit">${esc(b.credit)}</span>` : '';
    return `<img src="${esc(b.src)}" alt="${esc(b.alt || b.label || '')}" draggable="false" style="object-fit:${s.fit || 'cover'};object-position:${s.fx ?? 50}% ${s.fy ?? 50}%">${credit}`;
  }
  return '';
}

export function pageEl(page, opts = {}) {
  const el = document.createElement('div');
  el.className = 'np-page';
  el.style.background = page.bg || '#fff';
  el.innerHTML = page.blocks.map((b) => `<div class="blk b-${b.type}${b.lock ? ' locked' : ''}" data-id="${b.id}" style="${blockStyle(b).replace(/"/g, '&quot;')}">${blockInner(b, opts)}</div>`).join('');
  return el;
}

export function nextSaturday(d = new Date()) {
  const x = new Date(d); x.setDate(x.getDate() + ((6 - x.getDay() + 7) % 7)); return x.toISOString().slice(0, 10);
}
export function longDate(iso) {
  try { return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(); } catch { return iso; }
}
