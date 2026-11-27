// Ready-made broadsheet templates (all positions in points, page 972 × 1512 pt). Text is placeholder — replace before printing.
import { uid, longDate, PAGE_W, MARGIN } from './render.js';

const SERIF = 'Georgia, "Times New Roman", serif', SANS = 'Manrope, Arial, sans-serif', INTER = 'Inter, Arial, sans-serif', COND = '"Arial Narrow", "Roboto Condensed", "Helvetica Neue", Arial, sans-serif';
const W = PAGE_W - 2 * MARGIN; // 900
let z = 1;
const T = (x, y, w, h, html, style = {}) => { const { z: zz, ...st } = style; return { id: uid(), type: 'text', x, y, w, h, z: zz || z++, html, style: { font: SERIF, size: 9.5, lh: 1.35, ...st } }; };
const HL = (x, y, w, h, text, size = 30, style = {}) => T(x, y, w, h, text, { font: SERIF, size, weight: 700, lh: 1.08, ...style });
const IMG = (x, y, w, h, label, q = '', style = {}) => ({ id: uid(), type: 'image', x, y, w, h, z: z++, src: '', label, q, credit: '', style: { fit: 'cover', ...style } });
const BOX = (x, y, w, h, bg, style = {}) => ({ id: uid(), type: 'box', x, y, w, h, z: z++, style: { bg, ...style } });
const RULE = (x, y, w, h = 1, color = '#111') => ({ id: uid(), type: 'rule', x, y, w, h, z: z++, style: { color } });
const AD = (x, y, w, h, label) => IMG(x, y, w, h, `Advertisement · ${Math.round(w)} × ${Math.round(h)} pt`, '', { fit: 'contain' });

const BODY = '<p>Type or paste your story here. Double-click any text to edit it, drag blocks to move them and use the handles to resize. Use <b>News</b> on the left to import a headline from today’s free news feeds, then rewrite it in your own words.</p><p>Columns, font, size, spacing and colour are in the panel on the right. A red outline means the text is longer than its box.</p>';
const BRIEF = (t) => `<p><b>${t}</b><br>Short brief — two or three lines of news, edit me.</p>`;
const CITIES = 'HYDERABAD · BENGALURU · CHENNAI · MUMBAI · DELHI · VISAKHAPATNAM · VIJAYAWADA · PUNE · AHMEDABAD · KOLKATA · WARANGAL · GUNTUR · TIRUPATI';

function header(ed, n, section = '') {
  return [
    T(MARGIN, 22, 200, 16, `PAGE ${n}${section ? ' · ' + section.toUpperCase() : ''}`, { font: INTER, size: 8, weight: 700, ls: 1 }),
    T(336, 14, 300, 30, ed.masthead || 'Weekend', { font: SERIF, size: 22, weight: 800, align: 'center', color: '#2B1D6B', lh: 1.1 }),
    T(PAGE_W - MARGIN - 260, 22, 260, 16, longDate(ed.date), { font: INTER, size: 8, weight: 700, align: 'right', ls: 1 }),
    RULE(MARGIN, 46, W, 2),
  ];
}
const footer = (ed) => [RULE(MARGIN, 1482, W, 0.75), T(MARGIN, 1486, W, 16, `${ed.masthead || 'Weekend'} · Free weekly newspaper · For ads: 98490 98490 · ads@weekendtube.com`, { font: INTER, size: 7, align: 'center', color: '#555' })];

export const TEMPLATES = [
  { id: 'front', name: 'Front page', desc: 'Masthead, ears, teasers, lead story, second story and half-page ad', build: (ed) => [
    AD(MARGIN, 26, 180, 108, 'Left ear'),
    T(226, 18, 520, 96, ed.masthead || 'Weekend', { font: SERIF, size: 92, weight: 800, align: 'center', color: '#2B1D6B', lh: 1, ls: -2 }),
    T(226, 114, 520, 18, 'Free · Weekly · Your neighbourhood newspaper', { font: INTER, size: 9, weight: 600, align: 'center', upper: true, ls: 2, color: '#E11D2E' }),
    AD(PAGE_W - MARGIN - 180, 26, 180, 108, 'Right ear'),
    RULE(MARGIN, 142, W, 3),
    T(MARGIN, 148, W, 16, `VOL. 1 · ISSUE ${ed.issue || 1} &nbsp;|&nbsp; ${longDate(ed.date)} &nbsp;|&nbsp; ${ed.city || 'HYDERABAD'} &nbsp;|&nbsp; FREE`, { font: INTER, size: 8, weight: 700, align: 'center', ls: 1 }),
    RULE(MARGIN, 168, W, 0.75),
    ...[0, 1, 2, 3].flatMap((i) => [IMG(MARGIN + i * 227, 176, 72, 64, 'Teaser', ['city', 'technology', 'cinema', 'cricket'][i]),
      T(MARGIN + i * 227 + 78, 176, 140, 64, `<b>Teaser headline ${i + 1}</b><br>Inside: page ${i + 2}`, { font: INTER, size: 8.5, lh: 1.25, bg: '#FFF6D6', pad: 5 })]),
    BOX(MARGIN, 248, W, 18, '#111'),
    T(MARGIN, 250, W, 14, CITIES, { font: INTER, size: 7, weight: 700, color: '#fff', align: 'center', ls: 1.5, z: 50 }),
    T(MARGIN, 276, 170, 574, `<p style="background:#E11D2E;color:#fff;padding:3pt 5pt;display:inline-block"><b>In brief</b></p>${['City', 'Business', 'Tech', 'Health', 'Sport', 'Culture'].map(BRIEF).join('')}`, { size: 9, bg: '#FCEFD8', pad: 8 }),
    HL(220, 276, 716, 70, 'Lead headline goes here in two strong lines', 34),
    T(220, 348, 716, 22, 'A one-line deck that explains why this story matters to readers', { italic: true, size: 13, font: SERIF, color: '#333' }),
    IMG(220, 376, 440, 296, 'Lead photo', 'India'),
    T(670, 376, 266, 296, BODY, { size: 9.5 }),
    T(220, 680, 716, 170, BODY + BODY, { cols: 4, size: 9.5, colRule: true }),
    RULE(MARGIN, 860, W, 1.5),
    HL(MARGIN, 868, 580, 40, 'Second story headline', 24),
    T(MARGIN, 912, 580, 150, BODY + BODY, { cols: 3, colRule: true }),
    IMG(626, 868, 310, 194, 'Story photo', 'business'),
    AD(MARGIN, 1072, W, 404, 'Half-page'),
    ...footer(ed)] },
  { id: 'news', name: 'Inside news page', desc: 'Page header, lead story, side briefs, two stories and ad strip', build: (ed, n = 2) => [
    ...header(ed, n, 'News'),
    HL(MARGIN, 58, 580, 66, 'Inside-page lead headline over two lines', 30),
    IMG(MARGIN, 128, 580, 326, 'Lead photo', 'Hyderabad'),
    T(MARGIN, 460, 580, 262, BODY + BODY + BODY, { cols: 3, colRule: true }),
    T(630, 58, 306, 664, `<p style="background:#E11D2E;color:#fff;padding:3pt 5pt;display:inline-block"><b>Think beyond</b></p>${['Electric vehicles', 'Start-ups', 'Education', 'Real estate', 'Agriculture', 'Wellness', 'Events'].map(BRIEF).join('')}`, { size: 9.5, bg: '#F4F4F5', pad: 10 }),
    RULE(MARGIN, 732, W, 1.5),
    HL(MARGIN, 742, W, 36, 'Second story headline across the page', 24),
    IMG(MARGIN, 784, 290, 200, 'Photo', 'technology'),
    T(336, 784, 600, 200, BODY + BODY, { cols: 3, colRule: true }),
    RULE(MARGIN, 994, W, 1),
    AD(MARGIN, 1004, 440, 210, 'Quarter'),
    HL(490, 1004, 446, 30, 'Third story headline', 18),
    T(490, 1038, 446, 176, BODY + BODY, { cols: 2 }),
    AD(MARGIN, 1224, W, 252, 'Bottom strip'),
    ...footer(ed)] },
  { id: 'fullad', name: 'Full-page ad', desc: 'Page header and one full-bleed advertisement area', build: (ed, n = 3) => [
    ...header(ed, n, 'Advertisement'), AD(MARGIN, 58, W, 1418, 'Full page'), ...footer(ed)] },
  { id: 'classifieds', name: 'Classifieds', desc: 'Classified columns, tenders & notices and promo strip', build: (ed, n = 6) => {
    const cat = ['Real estate', 'Jobs', 'Services', 'Vehicles', 'Education', 'Matrimonial'];
    const ad = (k) => `<p><b>${cat[k].toUpperCase()} — Sample ad</b> 25-word classified. Contact number and area. Replace with the real advertisement.</p>`;
    return [...header(ed, n, 'Classifieds'),
      BOX(MARGIN, 58, W, 40, '#E9AC16'),
      T(MARGIN, 62, W, 34, 'CLASSIFIEDS', { font: SANS, size: 24, weight: 800, align: 'center', ls: 4, z: 60 }),
      ...cat.map((c, k) => [T(MARGIN + (k % 3) * 304, 108 + Math.floor(k / 3) * 452, 292, 22, c.toUpperCase(), { font: SANS, size: 11, weight: 800, color: '#fff', bg: '#2B1D6B', pad: 4, ls: 1 }),
        T(MARGIN + (k % 3) * 304, 134 + Math.floor(k / 3) * 452, 292, 418, Array.from({ length: 9 }, () => ad(k)).join(''), { font: COND, size: 8.5, cols: 2, gap: 8, colRule: true, lh: 1.25 })]).flat(),
      T(MARGIN, 1016, 440, 22, 'TENDERS & NOTICES', { font: SANS, size: 11, weight: 800, color: '#fff', bg: '#E11D2E', pad: 4, ls: 1 }),
      T(MARGIN, 1042, 440, 250, Array.from({ length: 6 }, () => '<p><b>Notice</b> — Public notice or tender summary. Reference number, last date and contact.</p>').join(''), { font: COND, size: 8.5, cols: 2, border: 0.75, pad: 6 }),
      AD(490, 1016, 446, 276, 'Display'),
      BOX(MARGIN, 1302, W, 174, '#FFF6D6'),
      HL(56, 1318, 520, 40, 'No more pamphlets.', 28, { z: 60 }),
      T(56, 1362, 520, 100, 'Get your business growth as simple as that. Cost-effective advertising solutions with Weekend. <b>For ads: 98490 98490 · ads@weekendtube.com</b>', { size: 12, z: 60 }),
      IMG(700, 1312, 220, 154, 'Promo photo', 'megaphone', { fit: 'contain' }),
      ...footer(ed)];
  } },
  { id: 'showcase', name: 'Business showcase', desc: 'Six colour blocks for start-ups, brands or offers', build: (ed, n = 7) => {
    const col = ['#F7CF63', '#AFC6CB', '#F4B9B2', '#A9CBEA', '#C7E3B4', '#E9545C'];
    return [...header(ed, n, 'Business'),
      HL(MARGIN, 60, W, 50, 'Invest in the best upcoming start-ups', 34, { font: SERIF }),
      ...col.map((c, k) => { const x = MARGIN + (k % 2) * 456, y = 122 + Math.floor(k / 2) * 450;
        return [BOX(x, y, 444, 438, c), IMG(x + 16, y + 16, 412, 230, `Brand ${k + 1} photo`, ['startup', 'solar', 'food', 'app', 'farm', 'scooter'][k]),
          T(x + 16, y + 256, 412, 166, `<p style="font-size:18pt"><b>Brand or start-up name</b></p><p>Two or three lines about the business, the offer and how readers can get in touch.</p>`, { font: INTER, size: 11, z: 80 })]; }).flat(),
      ...footer(ed)];
  } },
  { id: 'back', name: 'Back page · Why Weekend', desc: 'Promotional back page with benefits checklist and photo', build: (ed, n = 8) => [
    ...header(ed, n, 'Advertise with us'),
    HL(MARGIN, 64, 520, 120, `Why <span style="color:#2B1D6B">${ed.masthead || 'Weekend'}</span>?`, 64),
    T(MARGIN, 196, 520, 520, ['50% saving in advertising and promotion', '200% reach (largest circulation on demand)', 'Single-window promotional packages', '50 lakh+ online readers network', '10 lakh+ print circulation', 'Free promotional film making / interview', 'Promoting online', 'Free digital marketing', 'Low-cost mobile app development']
      .map((t) => `<p>✔ ${t}</p>`).join(''), { font: INTER, size: 15, lh: 1.5 }),
    IMG(570, 64, 366, 652, 'Promo photo', 'woman reading newspaper'),
    T(MARGIN, 724, W, 20, 'Figures shown are from the Weekend media kit — confirm before printing.', { font: INTER, size: 8, italic: true, color: '#666' }),
    BOX(MARGIN, 756, W, 720, '#2B1D6B'),
    HL(70, 800, 830, 80, 'Your business, in every home this weekend.', 44, { color: '#fff', z: 70 }),
    T(70, 900, 830, 120, 'Book print, digital and video promotion in one place. Call or WhatsApp <b>98490 98490</b> · ads@weekendtube.com', { font: INTER, size: 18, color: '#fff', z: 70 }),
    AD(70, 1060, 830, 380, 'Sponsor'),
    ...footer(ed)] },
];

export const EDITION_PLAN = ['front', 'news', 'news', 'fullad', 'showcase', 'classifieds', 'news', 'back'];

export function buildPage(tid, ed, n) {
  const t = TEMPLATES.find((x) => x.id === tid) || TEMPLATES[1];
  z = 1;
  return { id: uid(), name: t.name, template: t.id, bg: '#ffffff', blocks: t.build(ed, n) };
}

export function newEdition({ title, masthead = 'Weekend', date, city = 'HYDERABAD', issue = 1, plan = EDITION_PLAN }) {
  const ed = { id: uid(), title: title || `${masthead} — ${date}`, masthead, date, city, issue, created: Date.now(), updated: Date.now(), pages: [] };
  ed.pages = plan.map((tid, i) => buildPage(tid, ed, i + 1));
  return ed;
}
