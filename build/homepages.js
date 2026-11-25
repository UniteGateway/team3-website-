// Renders home-page designs for TEAM3 products that have no live, screenshot-able site.
// Logos, brand colours, taglines and features come from the COLLABIZ app-brand data
// (UniteGateway/collobiz packages/types/src/app-brands*.ts and api ventures-data.ts).
// Usage: node build/homepages.js <logoDir> <outDir>
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [LOGOS, OUT] = process.argv.slice(2);
const PH = f => 'file://' + path.resolve('assets/img/photos/' + f + '.webp');
const FONT = 'file://' + path.resolve('assets/fonts/inter-latin-wght-normal.woff2');

const P = [
  { slug: 'prizo', logo: 'prizo.png', a: ['#1E3A8A', '#F97316'], nav: ['How it works', 'For buyers', 'For sellers', 'Pricing'], eyebrow: 'Commerce · AI Assistant',
    h: 'Your buyer-side AI deal assistant', sub: 'Request quotes, compare landed prices and let AI negotiate within your limits — you approve every purchase.', photo: 'pos_retail',
    f: [['Comparable landed prices', 'Compare quotes on the full delivered price.'], ['Seller response deadlines', 'Sellers reply within a set time.'], ['Warranty comparison', 'Warranty terms side by side.'], ['You approve every purchase', 'AI negotiates within limits you set.']] },
  { slug: 'bizo', logo: 'bizo.png', a: ['#0E7BF0', '#19D3C5'], nav: ['Solutions', 'Industries', 'Pricing', 'Resources'], eyebrow: 'Business Operating System', url: 'bizo.one',
    h: 'Business intelligence that adapts', sub: 'Find opportunities, research global buyers, manage deals and grow with a personal AI Growth Agent — in one workspace.', photo: 'analytics_laptop',
    f: [['Opportunity discovery', 'Tenders, buyers and projects that match your Business DNA.'], ['Global buyer intelligence', 'Importers and distributors by country.'], ['Personal AI Growth Agent', 'Briefs, alerts and recommended actions.'], ['CRM & deal management', 'Leads, pipeline, quotations and reports.']] },
  { slug: 'leaddna', logo: 'leaddna.png', a: ['#0F2A4A', '#14B8A6'], nav: ['Product', 'How it works', 'Integrations', 'Pricing'], eyebrow: 'Sales · Business Intelligence',
    h: 'AI opportunity discovery to deal execution', sub: 'Fresh, sourced and de-duplicated leads — scored at account level and handed straight to your pipeline.', photo: 'consult_meeting',
    f: [['Source & freshness labels', 'Know where every lead came from, and when.'], ['Duplicate detection', 'One record per company and contact.'], ['Account-level scoring', 'Prioritise accounts most likely to convert.'], ['Outreach approval queue', 'People approve outreach before it is sent.']] },
  { slug: 'sungate', logo: 'sungate.png', a: ['#9E4A08', '#0C2454'], nav: ['How it works', 'For societies', 'Savings', 'FAQs'], eyebrow: 'Energy · Community',
    h: 'Clean Power Together', sub: 'Community solar for housing societies and campuses — from bill-upload assessment to committee approval and verified savings.', photo: 'solar',
    f: [['Bill-upload assessment', 'Upload a bill, see your solar potential.'], ['Committee approval records', 'Every society decision documented.'], ['Scenario comparison', 'Compare ownership and savings options.'], ['Savings reconciliation', 'Promised versus actual savings, tracked.']] },
  { slug: 'hnw', logo: 'hnw-club.png', a: ['#9E7034', '#0C3C54'], nav: ['Membership', 'Benefits', 'Partners', 'Support'], eyebrow: 'Membership · Partner Services',
    h: 'Health and wealth membership', sub: 'One membership for health check-ups, partner services and financial-wellbeing benefits — for you and your family.', photo: 'doctor_phone',
    f: [['Benefit directory', 'Every partner benefit in one place.'], ['Eligibility display', 'See exactly what your plan covers.'], ['Booking & redemption', 'Book and redeem benefits with records.'], ['Member support', 'Help when you need it.']] },
  { slug: 'adbuz', mark: 'A', a: ['#DB2777', '#7C3AED'], nav: ['For brands', 'For creators', 'Media', 'Pricing'], eyebrow: 'Marketing · Marketplace',
    h: 'Where brands meet creators and media', sub: 'Plan, buy and measure influencer and advertising campaigns — with approvals and reporting built in.', photo: 'photographer',
    f: [['Creator discovery', 'Find creators by audience and reach.'], ['Campaign briefs & bids', 'Creators and media respond to your brief.'], ['Content approvals', 'Review content before it goes live.'], ['Performance reporting', 'Reach, engagement and results.']] },
  { slug: 'unite-exim', mark: 'U', a: ['#0369A1', '#0EA5E9'], nav: ['Buyers', 'Suppliers', 'Markets', 'RFQs'], eyebrow: 'Global Trade',
    h: 'Trade without borders', sub: 'Find verified buyers and suppliers, research markets and manage export enquiries — powered by Unite Exim.', photo: 'port',
    f: [['Buyer & supplier discovery', 'Verified trade partners worldwide.'], ['Product sourcing requests', 'Post what you need, get matched.'], ['Market research', 'Demand and trade data by country.'], ['RFQ management', 'Every enquiry tracked to close.']] },
  { slug: 'beyou', mark: 'B', a: ['#F97316', '#DB2777'], nav: ['Communities', 'Resources', 'Events', 'Safety'], eyebrow: 'Community',
    h: 'A safe space to be you', sub: 'An inclusive community platform to find support, resources and people who understand.', photo: 'people_group',
    f: [['Community groups', 'Find your people.'], ['Support directory', 'Trusted resources and services.'], ['Privacy-first & moderated', 'Safe by design.'], ['Events & programmes', 'Meet, learn and grow together.']] },
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const logoTag = (p, h) => p.logo
  ? `<img src="data:image/png;base64,${fs.readFileSync(path.join(LOGOS, p.logo)).toString('base64')}" style="height:${h}px;mix-blend-mode:multiply">`
  : `<span style="display:inline-flex;align-items:center;gap:10px"><i style="width:${h}px;height:${h}px;border-radius:${h / 3.5}px;background:linear-gradient(135deg,${p.a[0]},${p.a[1]});color:#fff;display:grid;place-items:center;font:800 ${h * .5}px I;font-style:normal">${p.mark}</i><b style="font:800 ${h * .55}px I;letter-spacing:-.02em;color:#0f172a">${esc(p.slug === 'unite-exim' ? 'UNITE EXIM' : p.slug.toUpperCase())}</b></span>`;

function page(p) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:I;src:url(${FONT}) format('woff2');font-weight:100 900}
  *{box-sizing:border-box;margin:0}body{width:1440px;height:860px;font:16px/1.5 I,system-ui;color:#0f172a;background:#fff;overflow:hidden}
  nav{height:76px;display:flex;align-items:center;gap:36px;padding:0 64px;border-bottom:1px solid #eef0f3}
  nav .ln{display:flex;gap:30px;margin-left:24px;font-weight:500;color:#334155;font-size:15px}
  nav .r{margin-left:auto;display:flex;gap:14px;align-items:center;font-weight:600;font-size:15px}
  .btn{padding:12px 22px;border-radius:999px;font-weight:600;font-size:15px}
  .p{background:${p.a[0]};color:#fff}.g{border:1.5px solid #cbd5e1;color:#0f172a}
  .hero{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;padding:56px 64px 0;align-items:center}
  .eb{display:inline-block;padding:7px 14px;border-radius:999px;background:${p.a[1]}1f;color:${p.a[0]};font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase}
  h1{font:800 60px/1.04 I;letter-spacing:-.045em;margin:20px 0 18px}
  h1 span{background:linear-gradient(90deg,${p.a[0]},${p.a[1]});-webkit-background-clip:text;color:transparent}
  .sub{font-size:19px;color:#475569;max-width:560px}
  .acts{display:flex;gap:12px;margin-top:30px}
  .ph{height:420px;border-radius:28px;overflow:hidden;position:relative;box-shadow:0 30px 60px -30px rgba(15,23,42,.45)}
  .ph img{width:100%;height:100%;object-fit:cover}
  .ph::after{content:"";position:absolute;inset:0;background:linear-gradient(140deg,${p.a[0]}55,transparent 55%)}
  .tag{position:absolute;left:22px;bottom:22px;z-index:1;background:#fff;border-radius:16px;padding:12px 16px;display:flex;gap:10px;align-items:center;font-weight:600;font-size:14px;box-shadow:0 10px 30px -10px rgba(0,0,0,.3)}
  .tag i{width:10px;height:10px;border-radius:50%;background:${p.a[1]}}
  .feats{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;padding:40px 64px 0}
  .fc{border:1px solid #eef0f3;border-radius:18px;padding:20px}
  .fc b{display:block;font-size:16px;margin-bottom:4px}.fc span{font-size:14px;color:#64748b}
  .fc i{display:block;width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,${p.a[0]},${p.a[1]});margin-bottom:12px;opacity:.9}
  </style></head><body>
  <nav>${logoTag(p, p.logo ? 40 : 38)}<div class="ln">${p.nav.map(n => `<span>${esc(n)}</span>`).join('')}</div><div class="r"><span>Sign in</span><span class="btn p">Get started</span></div></nav>
  <section class="hero"><div><span class="eb">${esc(p.eyebrow)}</span>
  <h1>${esc(p.h.split(' ').slice(0, -2).join(' '))} <span>${esc(p.h.split(' ').slice(-2).join(' '))}</span></h1>
  <p class="sub">${esc(p.sub)}</p><div class="acts"><span class="btn p">Get started free</span><span class="btn g">Book a demo</span></div></div>
  <div class="ph"><img src="${PH(p.photo)}"><div class="tag"><i></i>Powered by Unite · Built by TEAM3</div></div></section>
  <section class="feats">${p.f.map(([t, d]) => `<div class="fc"><i></i><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</section>
  </body></html>`;
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1440, height: 860 } });
  for (const p of P) {
    const f = path.join(OUT, p.slug + '.html'); fs.writeFileSync(f, page(p));
    await pg.goto('file://' + path.resolve(f)); await pg.waitForTimeout(400);
    await pg.screenshot({ path: path.join(OUT, p.slug + '.png') }); console.log('rendered', p.slug);
  }
  await b.close();
})();
