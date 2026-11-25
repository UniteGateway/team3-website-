// Renders illustrative product interface images for products.html.
// Usage (from repo root): node build/mockups.js  -> writes build/.mockups/<slug>.png
// then `python3 build/build.py` converts them to WebP in assets/img/products/.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const P = [
  { slug: 'collabiz', ins: '3 partners match the ERP rollout — suggest forming a delivery team.', name: 'COLLABIZ', c: '#ED1726', nav: ['Dashboard', 'Opportunities', 'Partners', 'Projects', 'Commissions', 'Messages'], title: 'Opportunities',
    k: [['Open opportunities', '128', '+12%'], ['Active partners', '342', '+8%'], ['Projects in delivery', '46', '+5'], ['Commissions (month)', '₹4.8L', '+18%']],
    chart: 'Opportunities by stage', bars: [42, 31, 24, 18, 13], labels: ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won'],
    list: 'Latest opportunities', rows: [['ERP rollout · Manufacturing', 'Hyderabad · 3 partners', 'Qualified'], ['Brand refresh · Retail chain', 'Bengaluru · 2 partners', 'Proposal'], ['AI support agent · Fintech', 'Remote · 4 partners', 'New'], ['Solar portal · EPC firm', 'Pune · 1 partner', 'Won']] },
  { slug: 'leaddna', ins: 'Bluepeak Energy visited pricing pages 4× this week — high buying intent.', name: 'LeadDNA', c: '#2563EB', nav: ['Discover', 'Leads', 'Lists', 'Signals', 'Integrations', 'Reports'], title: 'Lead intelligence',
    k: [['New leads (7 days)', '1,284', '+22%'], ['High-intent leads', '186', '+9%'], ['Avg. lead score', '72', '+4'], ['Synced to CRM', '948', '+15%']],
    chart: 'Lead score distribution', bars: [8, 14, 22, 31, 38, 27, 16], labels: ['30', '40', '50', '60', '70', '80', '90'],
    list: 'Top scored leads', rows: [['Northwind Logistics', 'Logistics · 250–500 staff', 'Score 94'], ['Bluepeak Energy', 'Renewables · 50–200 staff', 'Score 91'], ['Crestline Retail', 'Retail · 1,000+ staff', 'Score 88'], ['Orbit Health', 'Healthcare · 200–500 staff', 'Score 85']] },
  { slug: 'solbid', ins: 'V6 offers the lowest ₹/W with a 25-year warranty — best value overall.', name: 'SOLBID', c: '#F59E0B', nav: ['Projects', 'Bids', 'Vendors', 'Compare', 'Documents', 'Settings'], title: 'Bid comparison',
    k: [['Live projects', '64', '+6'], ['Bids received', '412', '+31%'], ['Avg. bids / project', '6.4', '+0.8'], ['Capacity requested', '3.2 MW', '+12%']],
    chart: 'Quotes for 50 kW rooftop project (₹/W)', bars: [38, 41, 36, 44, 39, 35], labels: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'],
    list: 'Shortlisted bids', rows: [['SunCrest Installers', 'Tier-1 panels · 25-yr warranty', 'Best value'], ['GreenGrid EPC', 'Hybrid inverter · 10-yr AMC', 'Shortlisted'], ['Helios Power', 'Bifacial panels · 30-yr warranty', 'Shortlisted'], ['Brightway Solar', 'Mono PERC · 25-yr warranty', 'Review']] },
  { slug: 'adbuz', ins: 'Reels outperform static posts by 2.3× for this audience — shift budget.', name: 'ADBUZ', c: '#DB2777', nav: ['Campaigns', 'Creators', 'Media', 'Briefs', 'Approvals', 'Analytics'], title: 'Campaign overview',
    k: [['Active campaigns', '18', '+3'], ['Creators engaged', '264', '+40'], ['Reach', '4.6M', '+27%'], ['Engagement rate', '5.8%', '+0.6']],
    chart: 'Weekly reach (thousands)', bars: [320, 410, 380, 520, 610, 700, 840], labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    list: 'Content awaiting approval', rows: [['Festive launch reel', '@urbanstyle · Instagram', 'Pending'], ['Product unboxing', '@techwithriya · YouTube', 'Approved'], ['Store opening story', '@foodtrails · Instagram', 'Pending'], ['Review thread', '@gadgetguru · X', 'Revision']] },
  { slug: 'unite-exim', ins: 'Demand for basmati from the Middle East is up 18% month on month.', name: 'UNITE EXIM', c: '#0EA5E9', nav: ['Marketplace', 'Buyers', 'Suppliers', 'RFQs', 'Markets', 'Shipments'], title: 'Trade desk',
    k: [['Open RFQs', '57', '+9'], ['Verified buyers', '1,120', '+6%'], ['Supplier matches', '389', '+14%'], ['Markets tracked', '42', '+3']],
    chart: 'Enquiries by region', bars: [34, 26, 21, 17, 12], labels: ['Middle East', 'Europe', 'Africa', 'Americas', 'APAC'],
    list: 'Recent RFQs', rows: [['Basmati rice · 200 MT', 'Buyer · Dubai, UAE', 'Quoted'], ['Cotton yarn · 40 MT', 'Buyer · Dhaka', 'Matching'], ['Granite slabs · 12 containers', 'Buyer · Rotterdam', 'New'], ['Spices assortment · 8 MT', 'Buyer · London', 'Quoted']] },
  { slug: 'bizo', ins: 'South region drove 41% of growth — consider increasing inventory there.', name: 'BIZO', c: '#10B981', nav: ['Overview', 'Sales', 'Finance', 'Operations', 'Forecasts', 'Ask BIZO'], title: 'Business overview',
    k: [['Revenue (month)', '₹2.4Cr', '+11%'], ['Gross margin', '38.2%', '+1.4'], ['Orders', '6,412', '+7%'], ['Forecast accuracy', '94%', '+2']],
    chart: 'Revenue vs forecast (₹ lakh)', bars: [180, 195, 210, 205, 228, 240, 252], labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec*'],
    list: 'Ask BIZO', rows: [['“Which region grew fastest this quarter?”', 'South · +18% QoQ', 'Answered'], ['“Forecast demand for December”', '₹2.52Cr · ±4%', 'Answered'], ['“Top 5 products by margin”', 'Report generated', 'Ready'], ['“Overdue receivables > 60 days”', '23 invoices', 'Alert']] },
  { slug: 'sungate', ins: 'Clubhouse carport output is 9% below expected — panel cleaning advised.', name: 'SUNGATE', c: '#EAB308', nav: ['Live', 'Generation', 'Consumption', 'Members', 'Maintenance', 'Reports'], title: 'Community energy',
    k: [['Generating now', '412 kW', '+6%'], ['Today’s generation', '2.9 MWh', '+9%'], ['Self-consumption', '81%', '+3'], ['CO₂ avoided (month)', '64 t', '+11%']],
    chart: 'Generation today (kW)', bars: [20, 90, 210, 340, 412, 380, 260, 120], labels: ['7', '9', '11', '13', '15', '17', '19', '21'],
    list: 'Sites', rows: [['Block A rooftop', '120 kWp · Online', 'Normal'], ['Block B rooftop', '96 kWp · Online', 'Normal'], ['Clubhouse carport', '60 kWp · Online', 'Cleaning due'], ['Block C rooftop', '110 kWp · Online', 'Normal']] },
  { slug: 'prizo', ins: 'Bundling laptops with accessories could unlock an extra 4% discount.', name: 'PRIZO', c: '#6366F1', nav: ['Requests', 'Quotes', 'Benchmarks', 'Negotiate', 'Approvals', 'Savings'], title: 'Negotiation desk',
    k: [['Open requests', '23', '+4'], ['Quotes received', '148', '+19%'], ['Avg. savings', '11.6%', '+1.2'], ['Savings (quarter)', '₹38L', '+24%']],
    chart: 'Quoted vs negotiated price (₹ lakh)', bars: [42, 37, 28, 25, 19, 17], labels: ['Laptops', '', 'Furniture', '', 'Printing', ''],
    list: 'AI negotiation suggestions', rows: [['Office laptops · 60 units', 'Benchmark 7% below quote', 'Counter'], ['Workstation chairs · 120', 'Volume discount available', 'Counter'], ['Annual print contract', 'Within benchmark', 'Approve'], ['Cloud storage renewal', 'Multi-year option −9%', 'Review']] },
  { slug: 'hnw', ins: 'Family plan renewals peak in March — schedule reminders 30 days ahead.', name: 'HNW', c: '#14B8A6', nav: ['Members', 'Plans', 'Benefits', 'Partners', 'Renewals', 'Support'], title: 'Membership',
    k: [['Active members', '8,420', '+9%'], ['Family members covered', '21,300', '+11%'], ['Partner services', '146', '+12'], ['Renewal rate', '87%', '+3']],
    chart: 'New members by plan', bars: [46, 31, 18, 9], labels: ['Essential', 'Family', 'Premium', 'Corporate'],
    list: 'Benefit usage this week', rows: [['Health check-ups', '312 bookings', 'Health'], ['Financial planning sessions', '86 sessions', 'Wealth'], ['Pharmacy discounts', '1,040 orders', 'Health'], ['Insurance advisory', '54 consultations', 'Wealth']] },
  { slug: 'beyou', ins: 'Online events see 2× attendance on weekends — plan more Saturday sessions.', name: 'BEYOU', c: '#F97316', nav: ['Home', 'Communities', 'Resources', 'Events', 'Support', 'Safety'], title: 'Community',
    k: [['Members', '12,800', '+14%'], ['Active groups', '96', '+8'], ['Resources shared', '1,430', '+21%'], ['Upcoming events', '18', '+5']],
    chart: 'Weekly active members', bars: [3.1, 3.4, 3.6, 4.0, 4.3, 4.8, 5.2], labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    list: 'Upcoming events', rows: [['Career readiness workshop', 'Sat · Online', 'Open'], ['Wellbeing circle', 'Sun · Hyderabad', 'Open'], ['Parents’ support meet-up', 'Wed · Online', 'Full'], ['Volunteer orientation', 'Fri · Online', 'Open']] },
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function chart(p) {
  const W = 640, H = 330, max = Math.max(...p.bars), n = p.bars.length, bw = W / n;
  return `<svg viewBox="0 0 ${W} ${H + 26}" width="100%" height="100%">` +
    [0.25, 0.5, 0.75, 1].map(f => `<line x1="0" x2="${W}" y1="${H - H * f}" y2="${H - H * f}" stroke="#eceef2"/>`).join('') +
    p.bars.map((v, i) => { const h = (v / max) * (H - 16); return `<rect x="${i * bw + bw * 0.22}" y="${H - h}" width="${bw * 0.56}" height="${h}" rx="7" fill="${i === n - 1 ? p.c : p.c + '55'}"/>` +
      `<text x="${i * bw + bw / 2}" y="${H + 20}" text-anchor="middle" font-size="12" fill="#8a8f98">${esc(p.labels[i] || '')}</text>`; }).join('') + '</svg>';
}
function page(p) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:I;src:url(${'file://' + path.resolve('assets/fonts/inter-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900}
  *{box-sizing:border-box;margin:0}body{font:14px/1.4 I,system-ui;background:#f4f5f8;color:#14161a;width:1440px;height:860px;display:grid;grid-template-columns:248px 1fr}
  .sb{background:#0d0e11;color:#c9ccd3;padding:26px 18px;display:flex;flex-direction:column;gap:4px}
  .lg{display:flex;align-items:center;gap:12px;margin:0 8px 30px}.lg i{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,${p.c},${p.c}99);display:grid;place-items:center;color:#fff;font:800 17px I;font-style:normal}
  .lg b{color:#fff;font:800 18px I;letter-spacing:-.02em}
  .nv{padding:11px 14px;border-radius:10px;font-weight:500;display:flex;gap:12px;align-items:center}.nv:before{content:"";width:16px;height:16px;border-radius:5px;border:2px solid #4a4e57}
  .nv.on{background:#1c1e24;color:#fff}.nv.on:before{border-color:${p.c};background:${p.c}}
  .sb .sp{margin-top:auto;padding:16px;border-radius:14px;background:#17191e;font-size:12.5px;color:#9aa0aa}.sb .sp b{display:block;color:#fff;font-size:13.5px;margin-bottom:4px}
  .mn{padding:28px 36px;display:flex;flex-direction:column;gap:22px}
  .tp{display:flex;align-items:center;gap:16px}.tp h1{font:800 26px I;letter-spacing:-.03em}.tp .s{margin-left:auto;width:320px;height:42px;border-radius:12px;background:#fff;border:1px solid #e6e8ee;padding:0 16px;display:flex;align-items:center;color:#9aa0aa}
  .tp .bt{height:42px;padding:0 18px;border-radius:12px;background:${p.c};color:#fff;display:flex;align-items:center;font-weight:600}.tp .av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#d9dce3,#b8bcc6)}
  .ks{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.kc{background:#fff;border-radius:16px;padding:20px;border:1px solid #eceef2}.kc span{color:#7a808a;font-size:13px}
  .kc b{display:block;font:800 28px I;letter-spacing:-.03em;margin-top:8px}.kc em{font-style:normal;color:#0f9d58;font-weight:600;font-size:12.5px;background:#e8f6ee;padding:3px 8px;border-radius:20px;display:inline-block;margin-top:8px}
  .gr{display:grid;grid-template-columns:1.35fr 1fr;gap:16px;flex:1;min-height:0}.cd{background:#fff;border-radius:16px;padding:22px;border:1px solid #eceef2;display:flex;flex-direction:column;min-height:0}
  .cd h3{font:700 15px I;margin-bottom:16px;display:flex;justify-content:space-between}.cd h3 small{color:#9aa0aa;font-weight:500}.ch{flex:1;min-height:0}
  .rw{display:flex;align-items:center;gap:14px;padding:14px 0;border-top:1px solid #f0f1f4}.rw:first-of-type{border-top:0}.rw i{width:36px;height:36px;border-radius:10px;background:${p.c}18;flex:none}
  .ai{margin-top:auto;padding:16px 18px;border-radius:14px;background:linear-gradient(135deg,${p.c}14,${p.c}05);border:1px solid ${p.c}30;font-size:13px;color:#30343b}.ai b{color:${p.c};margin-right:6px}
  .rw b{display:block;font-weight:600}.rw span{color:#8a8f98;font-size:12.5px}.rw em{margin-left:auto;font-style:normal;font-size:12px;font-weight:600;padding:5px 10px;border-radius:20px;background:${p.c}18;color:${p.c};white-space:nowrap}
  </style></head><body>
  <aside class="sb"><div class="lg"><i>${esc(p.name[0])}</i><b>${esc(p.name)}</b></div>
  ${p.nav.map((n, i) => `<div class="nv${i === 1 || (i === 0 && p.nav.length < 2) ? ' on' : ''}">${esc(n)}</div>`).join('')}
  <div class="sp"><b>Powered by TEAM3</b>AI-assisted insights enabled</div></aside>
  <main class="mn"><div class="tp"><h1>${esc(p.title)}</h1><div class="s">Search…</div><div class="bt">+ New</div><div class="av"></div></div>
  <div class="ks">${p.k.map(k => `<div class="kc"><span>${esc(k[0])}</span><b>${esc(k[1])}</b><em>${esc(k[2])}</em></div>`).join('')}</div>
  <div class="gr"><div class="cd"><h3>${esc(p.chart)}<small>Last 30 days</small></h3><div class="ch">${chart(p)}</div></div>
  <div class="cd"><h3>${esc(p.list)}<small>View all</small></h3>${p.rows.map(r => `<div class="rw"><i></i><div><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div><em>${esc(r[2])}</em></div>`).join('')}<div class="ai"><b>✦ AI insight</b>${esc(p.ins)}</div></div></div>
  </main></body></html>`;
}
(async () => {
  const out = path.join('build', '.mockups'); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 1 });
  for (const p of P) {
    const f = path.join(out, p.slug + '.html'); fs.writeFileSync(f, page(p));
    await pg.goto('file://' + path.resolve(f)); await pg.waitForTimeout(150);
    await pg.screenshot({ path: path.join(out, p.slug + '.png') }); console.log('rendered', p.slug);
  }
  await b.close();
})();
