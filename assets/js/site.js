/* TEAM3 WEBLOGICS — site interactions */
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
  items.forEach(function (li) {
    var btn = li.querySelector('button'), t;
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

  /* ---------- Portfolio filter ---------- */
  var fb = d.querySelectorAll('.filters button');
  fb.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      fb.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      d.querySelectorAll('.work').forEach(function (w) {
        w.classList.toggle('hide', f !== 'all' && (w.getAttribute('data-cat') || '').split(' ').indexOf(f) < 0);
      });
    });
  });

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

  /* ---------- Enquiry form (prototype: compose + copy) ---------- */
  var form = d.getElementById('enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var f = new FormData(form), lines = ['TEAM3 WEBLOGICS — Project Enquiry', ''];
      [['name', 'Full name'], ['company', 'Company'], ['email', 'Email'], ['phone', 'Phone / WhatsApp'], ['service', 'Service required'], ['budget', 'Estimated budget'], ['message', 'Requirements']].forEach(function (p) { lines.push(p[1] + ': ' + (f.get(p[0]) || '—')); });
      var txt = lines.join('\n');
      var done = function () { toast('Enquiry copied — paste it into your email or WhatsApp.'); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, function () { fallback(txt); done(); });
      else { fallback(txt); done(); }
    });
  }
  function fallback(t) { var a = d.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; d.body.appendChild(a); a.select(); try { d.execCommand('copy'); } catch (e) {} a.remove(); }
  function toast(msg) {
    var t = d.querySelector('.toast'); if (!t) { t = d.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); d.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  // Preselect service from ?service=
  var q = new URLSearchParams(location.search).get('service'), sel = d.getElementById('f-service');
  if (q && sel) Array.prototype.forEach.call(sel.options, function (o) { if (o.value === q) sel.value = q; });

  d.querySelectorAll('.menu a').forEach(function (a) { a.addEventListener('click', function () { root.classList.remove('nav-open'); d.body.style.overflow = ''; burger && burger.setAttribute('aria-expanded', 'false'); closeAll(); }); });

  var y = d.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
