/* TEAM3 Solutions — site interactions */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.remove('no-js');

  /* ---------- Header: mega menu, mobile nav, dark-on-hero ---------- */
  var header = d.querySelector('.site-header');
  var burger = d.querySelector('.burger');
  var items = d.querySelectorAll('.menu > li.has-mega');

  function closeAll(except) {
    items.forEach(function (li) {
      if (li !== except) { li.classList.remove('open'); var b = li.querySelector('button'); b && b.setAttribute('aria-expanded', 'false'); }
    });
  }
  function thumbs(li) {
    li.querySelectorAll('img[data-src]').forEach(function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); });
  }
  items.forEach(function (li) {
    var btn = li.querySelector('button'), t;
    li.addEventListener('mouseenter', function () { thumbs(li); }, { once: true });
    btn.addEventListener('focus', function () { thumbs(li); }, { once: true });
    btn.addEventListener('click', function () { thumbs(li); });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !li.classList.contains('open');
      closeAll(li); li.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open));
    });
    li.addEventListener('mouseenter', function () { if (window.innerWidth > 1300) { clearTimeout(t); closeAll(li); li.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); } });
    li.addEventListener('mouseleave', function () { if (window.innerWidth > 1300) { t = setTimeout(function () { li.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }, 120); } });
  });
  d.addEventListener('click', function (e) { if (!e.target.closest('.menu')) closeAll(); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); root.classList.remove('nav-open'); burger && burger.setAttribute('aria-expanded', 'false'); } });
  burger && burger.addEventListener('click', function () {
    var o = root.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', String(o));
    d.body.style.overflow = o ? 'hidden' : '';
  });

  // Header goes dark while over a dark hero
  var hero = d.querySelector('.hero');
  function onScroll() {
    if (!header) return;
    var dark = hero && hero.getBoundingClientRect().bottom > 72;
    header.classList.toggle('on-dark', !!dark);
  }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Reveal on scroll + counters ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (en.target.hasAttribute('data-count')) count(en.target);
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 }) : null;
  d.querySelectorAll('.rv,[data-count]').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  function count(el) {
    var end = parseInt(el.getAttribute('data-count'), 10), start = performance.now(), dur = 1600;
    var sup = el.querySelector('sup'); var supH = sup ? sup.outerHTML : '';
    (function f(now) {
      var p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.innerHTML = Math.round(end * e) + supH;
      if (p < 1) requestAnimationFrame(f);
    })(start);
  }

  /* ---------- In-page subnav highlight ---------- */
  var sub = d.querySelectorAll('.subnav a');
  if (sub.length && io) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) sub.forEach(function (a) { a.classList.toggle('act', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sub.forEach(function (a) { var t = d.querySelector(a.getAttribute('href')); t && so.observe(t); });
  }

  /* ---------- Portfolio / gallery filter ---------- */
  var fb = d.querySelectorAll('.filters button');
  fb.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f'), sel = b.getAttribute('data-target') || '.work';
      fb.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      d.querySelectorAll(sel).forEach(function (w) {
        w.classList.toggle('hide', f !== 'all' && (w.getAttribute('data-cat') || '').split(' ').indexOf(f) < 0);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = d.getElementById('lb');
  if (lb) {
    var lbImg = lb.querySelector('img'), lbT = lb.querySelector('figcaption b'), lbC = lb.querySelector('figcaption span'), cur = 0, list = [], last = null;
    var show = function (i) {
      cur = (i + list.length) % list.length; var g = list[cur];
      lbImg.src = g.getAttribute('data-full'); lbImg.alt = g.getAttribute('data-title').replace(/&amp;/g, '&');
      lbT.innerHTML = g.getAttribute('data-title'); lbC.innerHTML = g.getAttribute('data-cap');
    };
    var openLb = function (btn) {
      list = Array.prototype.filter.call(d.querySelectorAll('.gopen'), function (x) { return !x.closest('.hide'); });
      last = btn; show(list.indexOf(btn)); lb.hidden = false; d.body.style.overflow = 'hidden'; lb.querySelector('.lb-x').focus();
    };
    var closeLb = function () { lb.hidden = true; d.body.style.overflow = ''; lbImg.removeAttribute('src'); last && last.focus(); };
    d.querySelectorAll('.gopen').forEach(function (b) { b.addEventListener('click', function () { openLb(b); }); });
    lb.querySelector('.lb-x').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    d.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* ---------- Toggle option groups ---------- */
  d.querySelectorAll('.opts').forEach(function (g) {
    var multi = g.hasAttribute('data-multi');
    g.addEventListener('click', function (e) {
      var o = e.target.closest('.opt'); if (!o) return;
      if (!multi) g.querySelectorAll('.opt').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      o.setAttribute('aria-pressed', String(multi ? o.getAttribute('aria-pressed') !== 'true' : true));
      g.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    });
  });
  function picked(id) { return Array.prototype.map.call(d.querySelectorAll('#' + id + ' .opt[aria-pressed="true"]'), function (o) { return o.getAttribute('data-v'); }); }

  /* ---------- AI service recommendation engine ---------- */
  var rec = d.getElementById('recommender');
  if (rec) {
    var MAP = {
      launch: ['Brand Strategy & Identity', 'Website Development', 'Digital Marketing', 'Brand Launch Programme'],
      grow: ['Performance Marketing', 'SEO & Search Marketing', 'Advertising & Creative', 'AI-Powered Marketing'],
      automate: ['AI Agents & Automation', 'Workflow Automation', 'CRM Integration', 'AI Readiness Assessment'],
      product: ['Product Strategy', 'UI/UX Design', 'Mobile App Development', 'SaaS Engineering'],
      modernise: ['IT Consulting', 'Enterprise Software / ERP', 'Cloud Migration', 'Cybersecurity'],
      skill: ['TEAM3 Academy', 'Corporate AI Workshops', 'Prompt Engineering', 'AI for Business'],
      story: ['Corporate Films', 'Motion Graphics', 'AI Video Production', 'Brand Storytelling']
    };
    var LINK = { launch: 'branding.html', grow: 'marketing.html', automate: 'ai.html#agents', product: 'technology.html#apps', modernise: 'technology.html', skill: 'academy.html', story: 'branding.html#media' };
    rec.addEventListener('change', function () {
      var g = picked('rq-goal'), s = picked('rq-stage');
      if (!g.length) return;
      var out = [];
      g.forEach(function (k) { (MAP[k] || []).forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); }); });
      if (s[0] === 'idea') out.unshift('Business Concept & Feasibility');
      if (s[0] === 'enterprise') out.push('Business Transformation Partnership');
      var r = d.getElementById('rq-result');
      r.querySelector('.chips').innerHTML = out.slice(0, 9).map(function (x) { return '<span class="chip"><i></i>' + x + '</span>'; }).join('');
      r.querySelector('a').setAttribute('href', LINK[g[0]] || 'contact.html');
      r.classList.add('show');
    });
  }

  /* ---------- Project scope estimator (indicative, no pricing) ---------- */
  var est = d.getElementById('estimator');
  if (est) {
    var W = { brand: 2, web: 2, app: 4, ai: 4, erp: 5, mkt: 1, film: 2, academy: 1 };
    function calc() {
      var svc = picked('es-svc'), size = parseInt(d.getElementById('es-size').value, 10), urg = picked('es-time')[0] || 'std';
      d.getElementById('es-size-l').textContent = ['Focused', 'Standard', 'Extended', 'Enterprise'][size - 1];
      if (!svc.length) { d.getElementById('es-result').classList.remove('show'); return; }
      var pts = svc.reduce(function (a, s) { return a + (W[s] || 1); }, 0) * size;
      var tier = pts <= 4 ? ['Essential', '3 – 6 weeks', 25] : pts <= 10 ? ['Professional', '6 – 12 weeks', 50] : pts <= 20 ? ['Advanced', '3 – 6 months', 75] : ['Enterprise', '6 months +', 96];
      var r = d.getElementById('es-result');
      r.querySelector('h4').textContent = tier[0] + ' engagement';
      d.getElementById('es-time-o').textContent = urg === 'fast' ? tier[1] + ' (accelerated team available)' : tier[1];
      d.getElementById('es-model').textContent = svc.length > 2 || size > 2 ? 'Business Transformation Partnership or Dedicated Team' : svc.indexOf('mkt') > -1 ? 'Monthly Retainership' : 'Project-Based Engagement';
      r.classList.add('show');
      requestAnimationFrame(function () { r.querySelector('.meter i').style.width = tier[2] + '%'; });
    }
    est.addEventListener('change', calc); est.addEventListener('input', calc);
  }

  /* ---------- Forms: enquiry, meeting, partner, career ----------
     Delivery order: POST to data-endpoint (if configured) → mailto (if data-email) → copy to clipboard. */
  var cfg = d.body.dataset || {};
  var LABELS = { name: 'Full name', company: 'Company', email: 'Email', phone: 'Phone / WhatsApp', service: 'Service required', budget: 'Estimated budget',
    message: 'Message', topic: 'Topic', date: 'Preferred date', time: 'Preferred time (IST)', mode: 'Meeting mode', location: 'City / country',
    role: 'Role', opportunity: 'Opportunity type', experience: 'Experience', portfolio: 'Portfolio / profile', partner_type: 'Partner type' };
  var SVC = {};
  var svcSel = d.getElementById('f-service');
  if (svcSel) Array.prototype.forEach.call(svcSel.options, function (o) { SVC[o.value] = o.text; });

  function compose(form, kind) {
    var f = new FormData(form), lines = ['TEAM3 Solutions — ' + kind, ''];
    f.forEach(function (v, k) {
      if (k === '_gotcha' || k === 'consent' || !String(v).trim()) return;
      lines.push((LABELS[k] || k) + ': ' + (k === 'service' && SVC[v] ? SVC[v] : v));
    });
    lines.push('', 'Sent from ' + location.href.split('?')[0]);
    return lines.join('\n');
  }
  function success(form, msg) {
    var box = d.createElement('div'); box.className = 'form-ok'; box.setAttribute('role', 'status'); box.tabIndex = -1;
    box.innerHTML = '<span class="tick"></span><h3>Thank you.</h3><p></p><button type="button" class="btn ghost sm">Send another</button>';
    box.querySelector('p').textContent = msg;
    box.querySelector('button').addEventListener('click', function () { box.remove(); form.reset(); form.hidden = false; minToday(); });
    form.hidden = true; form.parentNode.insertBefore(box, form.nextSibling); box.focus();
  }
  d.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (form._gotcha && form._gotcha.value) return; // spam trap
      var kind = form.getAttribute('data-form'), txt = compose(form, kind), btn = form.querySelector('[type=submit]');
      if (cfg.endpoint) {
        btn.disabled = true; btn.style.opacity = '.6';
        var fd = new FormData(form); fd.append('_subject', 'TEAM3 website — ' + kind); fd.append('form', kind);
        fetch(cfg.endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); success(form, 'Your ' + kind.toLowerCase() + ' has reached TEAM3. We’ll reply within one business day.'); })
          .catch(function () { toast('Couldn’t send just now — your details were copied instead.'); copy(txt); })
          .then(function () { btn.disabled = false; btn.style.opacity = ''; });
      } else if (cfg.email) {
        location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent('TEAM3 website — ' + kind) + '&body=' + encodeURIComponent(txt);
        success(form, 'Your email app should now open with your ' + kind.toLowerCase() + ' ready to send.');
      } else {
        copy(txt);
        success(form, 'Your ' + kind.toLowerCase() + ' has been copied. Paste it into an email or WhatsApp message to TEAM3 and we’ll take it from there.');
      }
    });
  });
  function copy(txt) {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).catch(function () { fallback(txt); });
    else fallback(txt);
  }
  function minToday() {
    d.querySelectorAll('input[data-min-today]').forEach(function (i) {
      var t = new Date(); t.setDate(t.getDate() + 1); i.min = t.toISOString().slice(0, 10);
    });
  }
  minToday();
  function fallback(t) { var a = d.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; d.body.appendChild(a); a.select(); try { d.execCommand('copy'); } catch (e) {} a.remove(); }
  function toast(msg) {
    var t = d.querySelector('.toast'); if (!t) { t = d.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); d.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  // Preselect service from ?service=
  var q = new URLSearchParams(location.search).get('service'), sel = d.getElementById('f-service');
  if (q && sel) Array.prototype.forEach.call(sel.options, function (o) { if (o.value === q) sel.value = q; });
  var qm = new URLSearchParams(location.search).get('msg'), ta = d.getElementById('f-msg');
  if (qm && ta && !ta.value) ta.value = qm.slice(0, 1000);

  /* ---------- TEAM3 Assistant: guided, rule-based enquiry helper ---------- */
  var asst = d.getElementById('asst');
  if (asst) {
    var fab = asst.querySelector('.asst-fab'), panel = asst.querySelector('.asst-panel'), log = asst.querySelector('.asst-log'),
        inForm = asst.querySelector('.asst-in'), input = inForm.querySelector('input'), started = false, topic = null;
    var T = {
      brand: { l: 'Build or refresh a brand', svc: 'Branding', page: 'branding.html', say: 'We cover the whole journey: research and positioning, naming, identity design, packaging and brand guidelines, then the website and launch campaign.' },
      web: { l: 'A website or online store', svc: 'Web', page: 'technology.html#web', say: 'We design and build corporate websites, e-commerce, portals, marketplaces and progressive web apps. Every site is mobile-first, accessible, secure and SEO-ready.' },
      app: { l: 'A mobile app or SaaS product', svc: 'Apps', page: 'technology.html#apps', say: 'We take products from idea and feasibility through UI/UX, architecture, development, QA and launch, then keep improving them. iOS, Android, cross-platform and SaaS.' },
      ai: { l: 'AI, agents & automation', svc: 'AI', page: 'ai.html', say: 'We start with an AI readiness assessment, then build generative AI, RAG knowledge systems and AI agents. Human approval and audit trails are built in.' },
      mkt: { l: 'More customers & leads', svc: 'Marketing', page: 'marketing.html', say: 'Our digital marketing covers SEO, Google Ads, social media, performance campaigns, influencer marketing and AI-powered automation, all measured against real conversions.' },
      it: { l: 'ERP, CRM or IT modernisation', svc: 'Technology', page: 'technology.html#enterprise', say: 'We build custom enterprise software (ERP, CRM, HRMS, inventory, workflow) and help with architecture, integration, cloud migration and cybersecurity.' },
      film: { l: 'Corporate film or video', svc: 'Media', page: 'branding.html#media', say: 'We produce corporate films, ad films, product videos, animation, motion graphics and AI-assisted video, from script and storyboard to final edit.' },
      learn: { l: 'AI training for my team', svc: 'Academy', page: 'academy.html', say: 'TEAM3 Academy offers AI Foundation, Prompt Engineering, Generative AI, AI Agent Development and more, delivered online, in the classroom or as corporate workshops.' },
      consulting: { l: 'Consulting & strategy', svc: 'Strategy', page: 'consulting.html', say: 'TEAM3 Consulting covers 15 practices, including business strategy, digital transformation, AI and data strategy, go-to-market, finance and investor readiness, operations, ESG and international expansion. We can also design and build what we recommend.' },
      interior: { l: 'Interior design', svc: 'Interior', page: 'consulting.html#interior-design', say: 'We design offices, showrooms, experience centres, cafés and homes, from space planning and 3D visualisation to branded environments and turnkey delivery with partner contractors.' },
      campaign: { l: 'Campaign design', svc: 'Campaigns', page: 'consulting.html#campaign-design', say: 'We design integrated campaigns: the big idea, creative concepts and key visuals, media planning, launch campaigns and performance optimisation across every channel.' },
      products: { l: 'TEAM3 products & demos', svc: 'Apps', page: 'products.html', say: 'TEAM3 builds ten platforms, including COLLABIZ (collaboration), LeadDNA (lead intelligence), SOLBID (solar bidding), UNITE EXIM (global trade) and BIZO (AI business intelligence). You can request a demo of any of them.' },
      partner: { l: 'Partner with TEAM3', svc: 'Partnership', page: 'partners.html#register', say: 'The TEAM3 Partner Network is open to creative, technology and AI partners, agencies, consultants, trainers and international representatives.' },
      job: { l: 'Careers at TEAM3', svc: 'Careers', page: 'careers.html#apply', say: 'We welcome designers, developers, AI engineers, marketers and strategists, for full-time roles, internships and freelance projects.' }
    };
    var KW = [['interior', /interior|office design|showroom|fit.?out|space planning|décor|decor|3d visuali/i], ['campaign', /campaign|launch|creative concept|big idea/i], ['consulting', /consult|strategy|strategic|transformation|esg|sustainab|investor|pitch deck|business plan|go.to.market|process improvement|tcs/i], ['products', /product|demo|collabiz|leaddna|solbid|adbuz|unite exim|exim|bizo|sungate|prizo|\bhnw\b|beyou|platform list/i], ['job', /career|job|hiring|vacanc|intern|resume|cv\b|work for/i], ['partner', /partner|franchise|reseller|white.?label|collaborat/i],
      ['learn', /train|course|learn|academy|workshop|class|student|college/i], ['ai', /\bai\b|artificial|agent|automat|chatbot|gpt|llm|rag|machine learning/i],
      ['app', /\bapp\b|mobile|android|ios|saas|product|marketplace|platform/i], ['web', /website|web ?site|e-?commerce|online store|portal|landing/i],
      ['it', /erp|crm|software|cloud|security|cyber|server|it\b|hrms|inventory|iot|rfid/i], ['mkt', /seo|marketing|ads|lead|social|instagram|google|customer|sales|grow/i],
      ['film', /film|video|animation|shoot|photo|commercial|motion/i], ['brand', /brand|logo|identity|packag|name|design|rebrand|advertis|campaign/i]];
    function add(html, who) { var m = d.createElement('div'); m.className = 'msg ' + (who || 'bot'); m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
    function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function choices(list) {
      var w = add('', 'opts-row');
      list.forEach(function (c) { var b = d.createElement('button'); b.type = 'button'; b.className = 'qr'; b.textContent = c[1]; b.addEventListener('click', function () { w.remove(); add(esc(c[1]), 'me'); c[0](); }); w.appendChild(b); });
    }
    function menu() {
      choices(Object.keys(T).map(function (k) { return [function () { pick(k); }, T[k].l]; }).concat([[other, 'Something else']]));
    }
    function pick(k, text) {
      topic = k; var t = T[k];
      setTimeout(function () {
        add(esc(t.say));
        add('<a class="asst-link" href="' + t.page + '">See how we do it →</a>');
        choices([[function () { go(k, text); }, k === 'job' ? 'Submit my profile' : k === 'partner' ? 'Register as a partner' : 'Send an enquiry'],
                 [function () { location.href = 'contact.html#meeting'; }, 'Book a discovery call'],
                 [function () { add('Sure. What else can I help with?'); menu(); }, 'Ask about something else']]);
      }, 350);
    }
    function go(k, text) {
      var t = T[k];
      if (k === 'job' || k === 'partner') { location.href = t.page; return; }
      location.href = 'contact.html?service=' + encodeURIComponent(t.svc) + (text ? '&msg=' + encodeURIComponent(text) : '') + '#enquiry';
    }
    function other() { setTimeout(function () { add('Tell me in a sentence what you’re looking for, and I’ll point you to the right team.'); input.focus(); }, 300); }
    function open(o) {
      panel.hidden = !o; fab.setAttribute('aria-expanded', String(o)); asst.classList.toggle('open', o);
      if (o && !started) { started = true; add('Hi! I’m the TEAM3 assistant. 👋<br>What would you like to build?'); menu(); }
      if (o) setTimeout(function () { input.focus(); }, 50);
    }
    fab.addEventListener('click', function () { open(panel.hidden); });
    asst.querySelector('.asst-x').addEventListener('click', function () { open(false); fab.focus(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) open(false); });
    inForm.addEventListener('submit', function (e) {
      e.preventDefault(); var v = input.value.trim(); if (!v) return; input.value = '';
      add(esc(v), 'me'); log.querySelectorAll('.opts-row').forEach(function (r) { r.remove(); });
      var hit = null; KW.some(function (k) { if (k[1].test(v)) { hit = k[0]; return true; } });
      if (/price|cost|budget|quote|how much/i.test(v)) {
        setTimeout(function () { add('Every project is scoped individually. Our <a class="asst-link" href="contact.html#estimate">project scope estimator</a> gives you an indicative tier and timeline in seconds, and we confirm commercials after a short discovery call.'); choices([[function () { location.href = 'contact.html#meeting'; }, 'Book a discovery call'], [menu2, 'Explore services']]); }, 350);
      } else if (/contact|call|phone|email|address|where|location|office|meet/i.test(v)) {
        setTimeout(function () { add('TEAM3 Solutions is based in Hyderabad, India, and works with clients across India and international markets. You can <a class="asst-link" href="contact.html#enquiry">send an enquiry</a> or <a class="asst-link" href="contact.html#meeting">book a discovery call</a>.'); }, 350);
      } else if (hit) { pick(hit, v); }
      else { setTimeout(function () { add('Thanks! I’ll pass that to our team. Choose the closest area so it reaches the right people:'); choices(Object.keys(T).map(function (k) { return [function () { pick(k, v); }, T[k].l]; })); }, 350); }
    });
    function menu2() { add('Here’s what we do:'); menu(); }
  }

  d.querySelectorAll('.menu a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('nav-open'); d.body.style.overflow = ''; burger && burger.setAttribute('aria-expanded', 'false'); closeAll(); }); });

  /* ---------- Time zones (international visitors) ---------- */
  var clocks = d.querySelectorAll('.t[data-tz]');
  if (clocks.length && window.Intl) {
    var localTz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || '';
    var fmt = function (tz) { return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', timeZone: tz === 'local' ? undefined : tz }); };
    var tick = function () { var now = new Date(); clocks.forEach(function (c) { try { c.textContent = fmt(c.getAttribute('data-tz')).format(now); } catch (e) {} }); };
    tick(); setInterval(tick, 30000);
    if (localTz && localTz !== 'Asia/Kolkata' && localTz !== 'Asia/Calcutta') {
      var off = 330 + new Date().getTimezoneOffset(), h = Math.floor(Math.abs(off) / 60), m = Math.abs(off) % 60;
      var diff = off === 0 ? 'Hyderabad is on the same time as you.' : 'Hyderabad is ' + h + (m ? 'h ' + m + 'm' : 'h') + (off > 0 ? ' ahead of' : ' behind') + ' you.';
      d.querySelectorAll('.yourtime').forEach(function (p) { p.hidden = false; var o = p.querySelector('.ovl'); if (o) o.textContent = '(' + localTz.replace(/_/g, ' ') + ') · ' + diff; });
    }
  }

  var y = d.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
