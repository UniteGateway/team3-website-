#!/usr/bin/env python3
"""TEAM3 WEBLOGICS static site generator.

Shared header/footer + page content live here; run `python3 build/build.py`
from the repo root to regenerate every *.html page in the repository root.
"""
import os
import sys
import html

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import ARTICLES, LEGAL  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
E = html.escape

# --------------------------------------------------------------------------- site config
# Fill these in before going live. Empty values are simply not shown on the site.
SITE = {
    'url': 'https://www.team3weblogics.com',
    'company': 'TEAM3 WEBLOGICS PVT. LTD.',
    'address': '6-3-569, 3rd Floor, Above BMW Showroom, Khairatabad Road, Hyderabad, India',
    'email': '',            # e.g. 'hello@team3weblogics.com'
    'phone': '+91 905 227 0203',
    'whatsapp': '',         # digits only with country code, e.g. '919800000000'
    # Form backend: any endpoint that accepts a POST of form fields (Formspree, Getform,
    # Basin, a CRM webhook, or your own API). Leave empty to use the offline fallback
    # (opens an email if 'email' is set, otherwise copies the enquiry to the clipboard).
    'form_endpoint': '',
}

# --------------------------------------------------------------------------- icons
_P = {
    'brand': '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    'megaphone': '<path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1z"/><path d="M15 9a4 4 0 010 6M18 6a8 8 0 010 12"/>',
    'code': '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    'phone': '<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18h2"/>',
    'ai': '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 9h6v6H9zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    'agent': '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/><path d="M18 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>',
    'chart': '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/>',
    'cap': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5M22 9v6"/>',
    'film': '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z"/>',
    'compass': '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    'cloud': '<path d="M7 18a5 5 0 01-.5-10A6 6 0 0118 9a4.5 4.5 0 01-.5 9z"/><path d="M12 12v4M10 14h4"/>',
    'bulb': '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0012 3z"/>',
    'factory': '<path d="M3 21V10l5 3V10l5 3V6h4l1 15z"/><path d="M3 21h18"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'heart': '<path d="M12 20s-7-4.4-9-9a4.8 4.8 0 019-2.6A4.8 4.8 0 0121 11c-2 4.6-9 9-9 9z"/><path d="M8 12h2l1-2 2 4 1-2h2"/>',
    'home': '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-5h4v5"/>',
    'cart': '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11L21 7H6.5"/>',
    'gov': '<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-6 10 6z"/>',
    'bank': '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
    'truck': '<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    'bed': '<path d="M3 18V7M3 13h18v5M21 13a3 3 0 00-3-3h-7v3"/><circle cx="7" cy="10.5" r="1.6"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    'rocket': '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c1-4 5-9 13-9 0 8-5 12-9 13z"/><circle cx="15" cy="9" r="1.6"/>',
    'leaf': '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l8-8"/>',
    'car': '<path d="M3 16v-3l2-5h14l2 5v3z"/><circle cx="7" cy="16.5" r="1.8"/><circle cx="17" cy="16.5" r="1.8"/><path d="M13 3l-2 3h3l-2 3"/>',
    'shield': '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    'chip': '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>',
    'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 015.5 5"/>',
    'arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'chev': '<path d="M6 9l6 6 6-6"/>',
    'layers': '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    'pen': '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    'search': '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
}


def ic(name, cls=''):
    return f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{_P[name]}</svg>'


ARROW = ic('arrow')


def btn(label, href, cls='red', arrow=True):
    return f'<a class="btn {cls}" href="{href}">{E(label)}{ARROW if arrow else ""}</a>'


def link(label, href):
    return f'<a class="link" href="{href}">{E(label)}{ARROW}</a>'


HONEYPOT = '<div class="hp" aria-hidden="true"><label>Leave this empty<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>'


def consent_field(prefix):
    return (f'<div class="field full"><label class="consent"><input type="checkbox" name="consent" value="yes" required>'
            f'<span>I agree that TEAM3 may use these details to respond to my request, as described in the <a href="legal.html#privacy">Privacy Policy</a>.</span></label></div>')


def form_note():
    if SITE['form_endpoint']:
        return '<p class="note">We reply within one business day.</p>'
    if SITE['email']:
        return f'<p class="note">This opens your email app with your details filled in, addressed to {E(SITE["email"])}.</p>'
    return '<p class="note">Your details are copied so you can paste them into an email or WhatsApp message to TEAM3.</p>'


def footer_contact():
    bits = [E(SITE['company']), E(SITE['address'])]
    if SITE['email']:
        bits.append(f'<a href="mailto:{E(SITE["email"])}" style="color:#fff">{E(SITE["email"])}</a>')
    if SITE['phone']:
        bits.append(E(SITE['phone']))
    bits.append(f'<a href="{SITE["url"]}" style="color:#fff">{E(SITE["url"].split("//")[1])}</a>')
    return '<br>'.join(bits)


def contact_lines(dark=False):
    out = [f'<p class="muted">{E(SITE["address"])}</p>']
    if SITE['email']:
        out.append(f'<p><a class="link" href="mailto:{E(SITE["email"])}">{E(SITE["email"])}</a></p>')
    if SITE['phone']:
        out.append(f'<p><a class="link" href="tel:{E(SITE["phone"].replace(" ", ""))}">{E(SITE["phone"])}</a></p>')
    if SITE['whatsapp']:
        out.append(f'<p><a class="link" href="https://wa.me/{E(SITE["whatsapp"])}" rel="noopener">WhatsApp us</a></p>')
    out.append(f'<p><a class="link" href="{SITE["url"]}">{E(SITE["url"].split("//")[1])}{ARROW}</a></p>')
    return ''.join(out)


def checks(items, two=False):
    return f'<ul class="checks{" two" if two else ""}">' + ''.join(f'<li>{E(i)}</li>' for i in items) + '</ul>'


def rows(pairs, numbered=True):
    out = '<div class="rows">'
    for n, (a, b) in enumerate(pairs, 1):
        out += f'<div class="row rv"><b>{E(a)}</b><span>{E(b)}</span><i>{"%02d" % n if numbered else ""}</i></div>'
    return out + '</div>'


def chips(items):
    return '<div class="chips">' + ''.join(f'<span class="chip"><i></i>{E(i)}</span>' for i in items) + '</div>'


def head(eyebrow, title, lead='', cls='', gold=False):
    lead_html = f'<p class="lead">{lead}</p>' if lead else ''
    return f'<div class="head {cls} rv"><span class="eyebrow{" gold" if gold else ""}">{E(eyebrow)}</span><h2>{title}</h2>{lead_html}</div>'


def cap(title, intro, body):
    intro_html = f'<p class="muted">{intro}</p>' if intro else ''
    return f'<div class="cap rv"><div><h3>{title}</h3>{intro_html}</div><div>{body}</div></div>'


def cta_band(title, lead, buttons):
    return f'''<section class="section tight"><div class="wrap"><div class="cta-band rv">
<img class="sym" src="assets/img/symbol.png" alt="" width="382" height="540" loading="lazy">
<span class="eyebrow gold">Step beyond imagination.</span>
<h2 style="margin-top:18px">{title}</h2><p class="lead">{lead}</p>
<div class="actions">{buttons}</div></div></div></section>'''


def page_hero(crumb, eyebrow, title, lead, buttons=''):
    acts = f'<div class="actions">{buttons}</div>' if buttons else ''
    return f'''<section class="hero page-hero"><div class="hero-glow"><i></i><i></i></div><div class="hero-grid-lines"></div>
<img class="sym-bg" src="assets/img/symbol.png" alt="" width="382" height="540">
<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span>{E(crumb)}</span></nav>
<span class="eyebrow gold rv">{E(eyebrow)}</span><h1 class="rv d1">{title}</h1><p class="lead rv d2">{lead}</p>{acts}</div></section>'''


def subnav(items):
    return '<nav class="subnav" aria-label="On this page"><div class="wrap">' + ''.join(f'<a href="#{i}">{E(l)}</a>' for i, l in items) + '</div></nav>'


# --------------------------------------------------------------------------- chrome
NAV = [
    ('about.html', 'About Us', None),
    ('branding.html', 'Branding', 'branding'),
    ('technology.html', 'Technology', 'technology'),
    ('ai.html', 'Artificial Intelligence', 'ai'),
    ('marketing.html', 'Marketing', None),
    ('academy.html', 'Academy', None),
    ('work.html', 'Our Work', 'work'),
    ('industries.html', 'Industries', None),
    ('careers.html', 'Careers', None),
]

MEGA = {
    'branding': ([
        ('Brand', [('branding.html#strategy', 'Brand Strategy', 'Positioning, naming, architecture'),
                   ('branding.html#identity', 'Brand Identity', 'Logos, systems, guidelines'),
                   ('branding.html#product', 'Product Branding', 'Packaging, labels, launch')]),
        ('Creative', [('branding.html#corporate', 'Corporate Branding', 'Identity programmes, reports'),
                      ('branding.html#advertising', 'Advertising', 'Print, outdoor, electronic, digital'),
                      ('branding.html#studio', 'Creative Studio', 'Motion, 3D, illustration')]),
        ('Media', [('branding.html#media', 'Media & Film Production', 'Corporate, ad and product films'),
                   ('branding.html#launch', 'Brand Launch Programmes', 'Complete brand-to-market'),
                   ('contact.html?service=Branding', 'Start a brand project', 'Talk to our strategists')]),
    ], ('We don’t just design logos.', 'We build brands — from name to market.', 'branding.html')),
    'technology': ([
        ('Build', [('technology.html#enterprise', 'Enterprise Software', 'ERP, CRM, HRMS, workflow'),
                   ('technology.html#web', 'Web Design & Development', 'Corporate, commerce, portals'),
                   ('technology.html#apps', 'Mobile Apps & Products', 'iOS, Android, SaaS, UI/UX')]),
        ('Run', [('technology.html#consulting', 'IT Consulting', 'Architecture & modernisation'),
                 ('technology.html#cloud', 'Cloud, Data & Security', 'DevOps, BI, cybersecurity'),
                 ('technology.html#iot', 'Smart Technology & IoT', 'Access, RFID, energy, IIoT')]),
        ('Grow', [('industries.html#consulting', 'Business Consulting', 'Feasibility to go-to-market'),
                  ('industries.html#innovation', 'Product Innovation', 'Innovation as a service'),
                  ('technology.html#stack', 'Engineering Stack', 'React to PostgreSQL')]),
    ], ('Technology engineered around your business.', 'Scalable systems, built to last.', 'technology.html')),
    'ai': ([
        ('Intelligence', [('ai.html#consulting', 'AI Consulting', 'Readiness, roadmap, GenAI'),
                          ('ai.html#bi', 'AI Business Intelligence', 'Forecasting, insights, reporting'),
                          ('ai.html#ecosystem', 'AI Integration Ecosystem', 'Model-agnostic delivery')]),
        ('Agents', [('ai.html#agents', 'AI Agents', 'Your intelligent digital workforce'),
                    ('ai.html#orchestration', 'Multi-agent Orchestration', 'Agents that collaborate'),
                    ('ai.html#governance', 'Governance & Security', 'Human-in-the-loop by design')]),
        ('Learn', [('academy.html', 'TEAM3 Academy', 'AI learning programmes'),
                   ('ai.html#recommend', 'Service Recommender', 'Find the right AI solution'),
                   ('legal.html#responsible-ai', 'Responsible AI', 'Our principles')]),
    ], ('Human imagination. Artificial intelligence.', 'Extraordinary possibilities.', 'ai.html')),
    'work': ([
        ('Work', [('work.html', 'Portfolio', 'Branding, software, films, AI'),
                  ('gallery.html', 'Gallery', 'Events, publications, print, films'),
                  ('work.html#heritage', 'Heritage projects', 'Two decades of work')]),
        ('Clients', [('clients.html', 'Our Clients', 'National and international'),
                     ('clients.html#group', 'Collabiz & Unite Group', 'Group businesses we build for'),
                     ('clients.html#heritage', 'Heritage clientele', '100+ organisations since 2004')]),
        ('Partners', [('partners.html', 'Partner Network', 'Connect. Collaborate. Create.'),
                      ('partners.html#register', 'Become a Partner', 'Register in minutes'),
                      ('careers.html', 'Careers', 'Join the TEAM3 team')]),
    ], ('Our imagination. Your success.', 'See the work, the clients and the moments.', 'gallery.html')),
}


def header(active):
    lis = ''
    for href, label, mega in NAV:
        cur = ' aria-current="page"' if href == active else ''
        if mega:
            cols, feat = MEGA[mega]
            colhtml = ''.join(
                f'<div><h5>{E(t)}</h5>' + ''.join(f'<a class="mi" href="{h}">{E(a)}<span>{E(s)}</span></a>' for h, a, s in links) + '</div>'
                for t, links in cols)
            fh = f'<a class="mega-feature" href="{feat[2]}"><b>{E(feat[0])}</b><p>{E(feat[1])}</p></a>'
            curcls = ' style="opacity:1;box-shadow:inset 0 -2px 0 var(--red)"' if active in [href] + [h.split('#')[0] for _, ls in cols for h, _, _ in ls if not h.startswith('careers') and not h.startswith('partners')] else ''
            lis += (f'<li class="has-mega"><button type="button" aria-expanded="false"{curcls}>{E(label if label != "Artificial Intelligence" else "AI")}{ic("chev","chev")}</button>'
                    f'<div class="mega"><div class="wrap mega-in">{colhtml}{fh}</div></div></li>')
        else:
            lis += f'<li><a href="{href}"{cur}>{E(label)}</a></li>'
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap nav">
<a class="logo" href="index.html" aria-label="TEAM3 WEBLOGICS home"><img class="sym" src="assets/img/symbol.png" alt="" width="382" height="540"><span><img class="wm wm-d" src="assets/img/wordmark-dark.png" alt="TEAM3" width="891" height="130"><img class="wm wm-l" src="assets/img/wordmark-light.png" alt="TEAM3" width="891" height="130"><span class="tag">WEBLOGICS</span></span></a>
<ul class="menu" id="menu">{lis}<li class="nav-btns"><a class="btn sm nav-partner" href="partners.html"{' aria-current="page"' if active == 'partners.html' else ''}>Partners</a><a class="btn red sm nav-cta" href="contact.html">Let’s Build Something</a></li></ul>
<button class="burger" type="button" aria-label="Menu" aria-controls="menu" aria-expanded="false"><span></span><span></span></button>
</div></header>'''


FOOTER = '''<footer class="site-footer"><div class="wrap">
<div class="f-top">
<div class="f-brand"><img class="f-logo" src="assets/img/wordmark-light.png" alt="TEAM3" width="891" height="130" loading="lazy">
<p class="claim">Branding. Technology.<br><span class="gold-t">Intelligence.</span></p>
<p>An integrated creative and technology company. Established in 2004. Building intelligent solutions for the future.</p>
<p style="margin-top:18px">__FOOTCONTACT__</p></div>
<div class="f-col"><h5>Company</h5><a href="about.html">About Us</a><a href="about.html#journey">Our Journey</a><a href="work.html">Our Work</a><a href="gallery.html">Gallery</a><a href="clients.html">Clients</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></div>
<div class="f-col"><h5>Services</h5><a href="branding.html">Branding</a><a href="branding.html#advertising">Advertising</a><a href="technology.html">IT &amp; Apps</a><a href="ai.html#agents">AI Agents</a><a href="marketing.html">Digital Marketing</a></div>
<div class="f-col"><h5>Explore</h5><a href="academy.html">AI Academy</a><a href="partners.html">Partner Network</a><a href="industries.html">Industries</a><a href="insights.html">Insights</a><a href="industries.html#innovation">Innovation</a></div>
<div class="f-col"><h5>Legal</h5><a href="legal.html#privacy">Privacy Policy</a><a href="legal.html#terms">Terms of Use</a><a href="legal.html#cookies">Cookie Policy</a><a href="legal.html#responsible-ai">Responsible AI Policy</a></div>
</div>
<div class="f-bot"><span>© <span id="yr">2026</span> TEAM3 WEBLOGICS. All rights reserved.</span><span class="tag">Step beyond imagination. · Established 2004</span></div>
<div class="f-big" aria-hidden="true">TEAM<b>3</b></div>
</div></footer>'''


ASSISTANT = '''<div class="asst" id="asst">
<button class="asst-fab" type="button" aria-expanded="false" aria-controls="asst-panel"><img src="assets/img/symbol.png" alt="" width="382" height="540"><span>Ask TEAM3</span></button>
<div class="asst-panel" id="asst-panel" role="dialog" aria-label="TEAM3 enquiry assistant" hidden>
<div class="asst-top"><img src="assets/img/symbol.png" alt="" width="382" height="540"><div><b>TEAM3 Assistant</b><span>Guided enquiry · usually replies instantly</span></div><button type="button" class="asst-x" aria-label="Close assistant">&times;</button></div>
<div class="asst-log" aria-live="polite"></div>
<form class="asst-in"><input type="text" placeholder="Type your question…" aria-label="Your message" autocomplete="off"><button type="submit" aria-label="Send">''' + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' + '''</button></form>
</div></div>'''


def layout(fname, title, desc, body, og_type='website'):
    full_title = 'TEAM3 WEBLOGICS — Branding, Technology & Artificial Intelligence' if fname == 'index.html' else f'{title} | TEAM3 WEBLOGICS'
    canon = SITE['url'] + '/' + ('' if fname == 'index.html' else fname)
    data = f' data-endpoint="{E(SITE["form_endpoint"])}" data-email="{E(SITE["email"])}" data-wa="{E(SITE["whatsapp"])}"'
    return f'''<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(full_title)}</title>
<meta name="description" content="{E(desc)}">
<meta name="theme-color" content="#000000">
<link rel="canonical" href="{canon}">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="TEAM3 WEBLOGICS">
<meta property="og:url" content="{canon}">
<meta property="og:title" content="{E(full_title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{SITE['url']}/assets/img/logo-full.jpg">
<link rel="manifest" href="site.webmanifest">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="assets/img/favicon.png">
<link rel="apple-touch-icon" href="assets/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap">
<link rel="stylesheet" href="assets/css/site.css">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Organization","name":"TEAM3 WEBLOGICS PVT. LTD.","url":"https://www.team3weblogics.com","logo":"https://www.team3weblogics.com/assets/img/logo-full.jpg","foundingDate":"2004","slogan":"Step beyond imagination.","address":{{"@type":"PostalAddress","addressLocality":"Hyderabad","addressCountry":"IN"}}}}</script>
</head>
<body{data}>
{header(fname)}
<main id="main">
{body}
</main>
{FOOTER.replace("__FOOTCONTACT__", footer_contact())}
{LIGHTBOX if ('class="gopen"' in body and 'id="lb"' not in body) else ''}
{ASSISTANT}
<script src="assets/js/site.js" defer></script>
</body>
</html>
'''


# --------------------------------------------------------------------------- data
SERVICES = [
    ('brand', 'Brand Strategy & Identity', 'Positioning, naming and identity systems that build lasting market value.', 'branding.html'),
    ('megaphone', 'Advertising & Creative', 'Integrated campaigns across print, outdoor, electronic and digital media.', 'branding.html#advertising'),
    ('code', 'Information Technology', 'Enterprise software, ERP, CRM and IT consulting engineered around you.', 'technology.html'),
    ('phone', 'Mobile App Development', 'iOS, Android, cross-platform apps and SaaS products that scale.', 'technology.html#apps'),
    ('ai', 'Artificial Intelligence', 'Generative AI, LLM integrations, RAG and AI-powered intelligence.', 'ai.html'),
    ('agent', 'AI Agents & Automation', 'An intelligent digital workforce that researches, analyses and executes.', 'ai.html#agents'),
    ('chart', 'Digital Marketing', 'SEO, performance, social and AI-powered marketing that converts.', 'marketing.html'),
    ('cap', 'AI Learning & Training', 'TEAM3 Academy programmes for people and enterprises.', 'academy.html'),
    ('film', 'Media & Film Production', 'Corporate films, commercials, animation and AI video.', 'branding.html#media'),
    ('compass', 'Business Consulting', 'Feasibility, business models and go-to-market strategy.', 'industries.html#consulting'),
    ('cloud', 'Cloud & Cybersecurity', 'Cloud architecture, DevOps, data and protective security.', 'technology.html#cloud'),
    ('bulb', 'Product Innovation', 'Research, design and engineering to bring new products to market.', 'industries.html#innovation'),
]

INDUSTRIES = [
    ('factory', 'Manufacturing', 'ERP, industrial automation and B2B branding'),
    ('sun', 'Renewable Energy', 'Energy platforms, monitoring and lead generation'),
    ('heart', 'Healthcare', 'Healthcare applications and digital engagement'),
    ('cap', 'Education', 'Learning platforms and AI training'),
    ('home', 'Real Estate', 'Project branding, portals and CRM'),
    ('cart', 'Retail & FMCG', 'Packaging, commerce and retail technology'),
    ('gov', 'Government', 'Digital services and public communication'),
    ('bank', 'Banking & Finance', 'Financial platforms and workflow systems'),
    ('truck', 'Logistics', 'Tracking and supply chain applications'),
    ('bed', 'Hospitality', 'Booking systems and hospitality branding'),
    ('globe', 'Import & Export', 'Trade platforms and international marketing'),
    ('rocket', 'Startups', 'Idea-to-market product development'),
    ('leaf', 'Agriculture', 'Agritech and procurement platforms'),
    ('car', 'Automotive & EV', 'Mobility platforms and connected solutions'),
]

GROUP = [('COLLABIZ', 'Intelligent business collaboration platform', 'software ai'), ('LeadDNA', 'Business opportunity and lead intelligence', 'ai marketing'),
         ('SOLBID', 'Solar procurement and bidding marketplace', 'apps software'), ('ADBUZ', 'Influencer and advertising marketplace', 'marketing apps'),
         ('UNITE EXIM', 'International trade and sourcing platform', 'software websites'), ('BIZO', 'AI-powered business intelligence', 'ai software'),
         ('SUNGATE', 'Community energy management platform', 'apps software'), ('PRIZO', 'Intelligent buyer-side negotiation platform', 'ai apps'),
         ('HNW', 'Health and wealth membership ecosystem', 'apps'), ('BEYOU', 'Inclusive community support platform', 'apps')]

FILM_CLIENTS = [('Vibha Seeds', 'Corporate film', 'film-vibha-seeds.jpg'), ('Rachem Pharma', 'Corporate film', 'film-rachem-pharma.jpg'),
                ('Ethames Graduate School', 'Corporate film', 'film-ethames.jpg'),
                ('CRIDA, Hyderabad', 'Central Research Institute for Dryland Agriculture (ICAR) — corporate film', 'film-crida.jpg')]

GALLERY = [
    ('nird-technology-bank-2008.jpg', 'events', 'Events', 'NIRD Technology Bank, 2008', 'Inaugurated by former President of India Shri A.P.J. Abdul Kalam. Designed by TEAM3.', 1600, 1068),
    ('nird-vision-souvenir-2009.jpg', 'events', 'Events', 'NIRD Vision &amp; Souvenir, 2009', 'Inaugurated by Hon’ble President of India Smt. Pratibha Patil and Hon’ble Governor of Andhra Pradesh Shri N.D. Tiwari. Designed by TEAM3.', 1600, 1068),
    ('print-works.jpg', 'print', 'Print &amp; Design', 'Selected print works', 'Brochures, menus, catalogues, identities and corporate collateral.', 1600, 1200),
    ('nird-rdm-brochure.jpg', 'publications', 'Publications', 'NIRD — Rural Development Management', 'Programme literature for the National Institute of Rural Development.', 508, 352),
    ('nird-pgdrdm-fieldwork.jpg', 'publications', 'Publications', 'NIRD — PGDRDM Field Work handbook', 'Publication design for the National Institute of Rural Development.', 508, 352),
    ('swachh-bharat.jpg', 'campaigns', 'Campaigns', 'Swachh Bharat Abhiyan', 'Campaign creative — one of our prestigious projects.', 1297, 1265),
    ('home-cafe-publication.jpg', 'publications', 'Publications', 'Home Café', 'TEAM3’s own publication — editorial, layout and advertising.', 938, 1235),
    ('film-vibha-seeds.jpg', 'films', 'Corporate Films', 'Vibha Seeds', 'Corporate film.', 631, 277),
    ('film-rachem-pharma.jpg', 'films', 'Corporate Films', 'Rachem Pharma', 'Corporate film — “Different thought process”.', 848, 444),
    ('film-ethames.jpg', 'films', 'Corporate Films', 'Ethames Graduate School', 'Corporate film.', 833, 357),
    ('film-crida.jpg', 'films', 'Corporate Films', 'CRIDA, Hyderabad', 'Central Research Institute for Dryland Agriculture (ICAR) — corporate film.', 634, 356),
    ('brand-mug.jpg', 'campaigns', 'Campaigns', 'Step beyond imagination.', 'TEAM3 brand campaign.', 720, 540),
]

CLIENTS = [('Madhucon Projects Limited', 'India'), ('Pi Metrics Inc.', 'USA'), ('Impress International LLC', 'Canada'),
           ('Accenture', 'USA'), ('NIRD', 'India'), ('Maxivision Hospitals', 'India'), ('Vanguard', 'India'),
           ("Dr. Reddy’s", 'India'), ('Air India', 'India'), ('Hetero Drugs', 'India'), ('Voris Life Sciences', 'India')]

AGENTS = [('Research Agent', 'Market and competitor research'), ('Lead Generation Agent', 'Identify relevant business opportunities'),
          ('Sales Agent', 'Lead qualification and follow-up assistance'), ('Marketing Agent', 'Campaign planning and content generation'),
          ('Customer Support Agent', 'Customer queries and service assistance'), ('Procurement Agent', 'Supplier discovery and quotation comparison'),
          ('Finance Agent', 'Financial analysis and reporting assistance'), ('HR Agent', 'Recruitment and employee workflow support'),
          ('Legal Assistant', 'Document review and drafting assistance'), ('Export Agent', 'International market and trade research'),
          ('Project Agent', 'Task coordination and progress monitoring'), ('Innovation Agent', 'Product research and concept generation'),
          ('Branding Agent', 'Brand concepts and campaign creation'), ('Executive Agent', 'Management reporting and decision support')]


def svc_cards(items, dark=False):
    out = ''
    for n, (i, t, p, h) in enumerate(items, 1):
        out += f'<a class="card svc rv d{(n-1)%4}" href="{h}"><span class="num">{n:02d}</span><span class="ic">{ic(i)}</span><h3>{E(t)}</h3><p>{E(p)}</p><span class="link">Explore solutions{ARROW}</span></a>'
    return out


def ind_cards(items):
    return '<div class="ind">' + ''.join(f'<div class="it rv"><span class="ic">{ic(i)}</span><b>{E(t)}</b><span>{E(s)}</span></div>' for i, t, s in items) + '</div>'


def insight_cards(exclude=None):
    return ''.join(f'<a class="post rv d{n}" href="{a["slug"]}.html"><div class="cover"><span class="{a["cover"]}"></span></div><div class="body"><small>{E(a["cat"])} · {a["mins"]} MIN READ</small><h3>{E(a["title"])}</h3><span class="link">Read article{ARROW}</span></div></a>'
                   for n, a in enumerate(x for x in ARTICLES if x['slug'] != exclude))


def render_blocks(paras):
    out = ''
    for p in paras:
        if isinstance(p, list):
            out += '<ul class="checks">' + ''.join(f'<li>{i}</li>' for i in p) + '</ul>'
        else:
            out += f'<p>{p}</p>'
    return out


def page_article(a):
    secs = ''.join(f'<h2>{E(h)}</h2>{render_blocks(ps)}' for h, ps in a['body'])
    body = f'''
{page_hero("Insights", a["cat"].title() + " · " + str(a["mins"]) + " min read", E(a["title"]), E(a["lead"]))}
<article class="section prose-wrap"><div class="wrap"><div class="prose rv">{secs}
<div class="byline"><img src="assets/img/symbol.png" alt="" width="382" height="540"><div><b>TEAM3 Insights</b><span>TEAM3 WEBLOGICS · Hyderabad</span></div></div>
</div></div></article>
<section class="section bg-grey"><div class="wrap">{head("Keep reading", "More ideas worth exploring.")}<div class="grid g3">{insight_cards(a["slug"])}</div></div></section>
{cta_band("Turn insight into action.", "Talk to our strategists and engineers about what this means for your business.", btn("Start a conversation", "contact.html", "red"))}
'''
    return layout(a['slug'] + '.html', a['title'], a['lead'], body, 'article')


def client_marquee():
    items = ''.join(f'<div class="client"><b>{E(n)}</b><span>{E(m)}</span></div>' for n, m in [(g[0], 'Group') for g in GROUP] + CLIENTS + [(f[0], 'Film') for f in FILM_CLIENTS])
    dup = items.replace('<div class="client">', '<div class="client" aria-hidden="true">')
    return f'<div class="marquee" aria-label="Selected historical clientele"><div class="marquee-track">{items}{dup}</div></div>'


COMPARE = [('Separate creative agency', 'Integrated creative and technology'), ('Multiple software vendors', 'End-to-end product development'),
           ('Fragmented marketing', 'Unified brand communication'), ('Manual business processes', 'Intelligent automation'),
           ('Isolated business systems', 'Connected digital ecosystems'), ('Short-term project delivery', 'Long-term growth partnership')]


def compare_block():
    old = ''.join(f'<li>{E(a)}</li>' for a, _ in COMPARE)
    new = ''.join(f'<li>{E(b)}</li>' for _, b in COMPARE)
    return f'<div class="compare rv"><div class="old"><h4>Conventional approach</h4><ul>{old}</ul></div><div class="new"><h4>The TEAM3 approach</h4><ul>{new}</ul></div></div>'


PILLARS = [('Our Clients', 'Every engagement starts and ends with the client. We build relationships that last — many for well over a decade.'),
           ('Our Team', 'Designers, engineers, strategists and AI specialists — a strong technical team with deep domain knowledge.'),
           ('Our Management', 'Leadership that believes in teamwork, good client relationships and good employee relationships.')]


def pillars_block():
    return '<div class="pillars">' + ''.join(
        f'<div class="pillar rv d{n}"><span class="dot"></span><span class="big">{n+1}</span><h3>{E(t)}</h3><p>{E(p)}</p></div>' for n, (t, p) in enumerate(PILLARS)) + '</div>'


# --------------------------------------------------------------------------- pages
def page_index():
    body = f'''
<section class="hero hero-home"><div class="hero-glow"><i></i><i></i></div><div class="hero-grid-lines"></div>
<div class="wrap hero-layout"><div>
<span class="eyebrow gold rv">Established 2004. Reimagined for the future.</span>
<h1 class="display rv d1" style="margin-top:26px"><span class="l">We build brands.</span><span class="l">We build technology.</span><span class="l grad">We build the future.</span></h1>
<p class="lead rv d2" style="margin-top:30px">From powerful brand identities to intelligent software, from creative advertising to autonomous AI agents, TEAM3 brings strategy, creativity and technology together to transform businesses.</p>
<p class="hero-tagline rv d3">One partner. <span class="gold-t">Infinite possibilities.</span></p>
<div class="actions rv d3">{btn("Explore Our Services", "#services", "light")}{btn("Start a Project", "contact.html", "ghost", False)}</div>
</div>
<div class="hero-sym rv d2"><span class="dot-ring"></span><span class="dot-ring r2"></span><img src="assets/img/symbol.png" alt="TEAM3 footprint symbol" width="382" height="540"></div>
</div><span class="scroll-cue" aria-hidden="true"></span></section>

<section class="section tight"><div class="wrap">
<div class="head split"><div class="rv"><span class="eyebrow">Our heritage</span><h2 style="margin-top:16px">More than two decades of imagination.</h2></div>
<p class="lead rv d1">Since 2004, TEAM3 has brought creative communication and information technology together under one roof — now reimagined for the age of artificial intelligence.</p></div>
<div class="stats">
<div class="stat"><b data-count="2004">2004</b><span>Established</span></div>
<div class="stat"><b data-count="22">22<sup>+</sup></b><span>Years of brand heritage</span></div>
<div class="stat"><b data-count="100">100<sup>+</sup></b><span>Historically served clients</span></div>
<div class="stat"><b>360<sup>°</sup></b><span>Creative &amp; technology solutions</span></div>
</div></div></section>

<section class="section bg-grey" id="services"><div class="wrap">
{head("What we do", "Everything your business needs to move forward.", "From an idea on paper to a globally scalable business, we help organisations imagine, create, launch, automate and grow.")}
<div class="grid g4">{svc_cards(SERVICES)}</div></div></section>

<section class="section bg-black"><div class="wrap">
{head("The meaning behind TEAM3", "TEAM stands for teamwork. <span class='grad'>3 for the people behind it.</span>", "The number three represents the three pillars of our organisation: our clients, our team members and our management. This philosophy from the original TEAM3 corporate presentation still forms our foundation.", gold=True)}
{pillars_block()}</div></section>

<section class="section"><div class="wrap">
<div class="grid g2" style="gap:20px">
<a class="panel rv" href="branding.html"><div class="art art-red"></div><div class="art art-lines"></div><span class="eyebrow gold plain">Branding &amp; Advertising</span><h3 style="margin-top:14px">We don’t just design logos.<br>We build brands.</h3><p>Strategy, identity, packaging, campaigns and films — a complete brand-to-market solution.</p><span class="link" style="color:#fff;margin-top:22px">Build your brand{ARROW}</span></a>
<a class="panel rv d1" href="technology.html"><div class="art art-mesh"></div><div class="art art-dots"></div><span class="eyebrow gold plain">Technology</span><h3 style="margin-top:14px">From imagination<br>to application.</h3><p>Enterprise software, websites, mobile apps, SaaS and secure cloud infrastructure.</p><span class="link" style="color:#fff;margin-top:22px">Discuss your requirements{ARROW}</span></a>
</div></div></section>

<section class="section bg-black"><div class="wrap">
<div class="head split"><div class="rv"><span class="eyebrow gold">AI agents &amp; automation</span><h2 style="margin-top:16px">Build your intelligent <span class="grad">digital workforce.</span></h2></div>
<p class="lead rv d1">Agents that research, analyse, communicate, coordinate and execute approved business tasks around the clock — with human approval for anything sensitive.</p></div>
<div class="agents">{"".join(f'<div class="agent rv"><span class="av">{E(a[0])}{E(a.split()[1][0]) if len(a.split())>1 else ""}</span><div><b>{E(a)}<span class="live" aria-hidden="true"></span></b><span>{E(b)}</span></div></div>' for a, b in AGENTS[:8])}</div>
<div class="actions">{btn("Build Your AI Workforce", "ai.html#agents", "red")}{btn("See all 14 agents", "ai.html#agents", "ghost", False)}</div>
</div></section>

<section class="section"><div class="wrap">
{head("Why TEAM3", "One partner. Complete business transformation.", "Most businesses require multiple vendors for branding, software, marketing and technology consulting. TEAM3 brings these capabilities together within one integrated service ecosystem.")}
{compare_block()}
<div class="grid g3" style="margin-top:20px">
{"".join(f'<div class="card rv d{n%3}"><span class="num">{n+1:02d}</span><h4 style="margin-top:16px;font-size:19px">{E(t)}</h4></div>' for n, t in enumerate(["Brand heritage dating back to 2004", "Creative and technical capabilities under one roof", "Business-first approach to technology", "AI-enabled solution development", "Cross-industry perspective", "Flexible engagement models", "Scalable product architecture", "Long-term customer relationships", "Focus on measurable business outcomes"]))}
</div></div></section>

<section class="section bg-grey"><div class="wrap">
<div class="head split"><div class="rv"><span class="eyebrow">Industries</span><h2 style="margin-top:16px">Industry knowledge. Technology without boundaries.</h2></div>
<div class="rv d1"><p class="lead">Every industry has unique challenges. We combine creative thinking and technology to build relevant solutions.</p><div style="margin-top:22px">{link("All industries", "industries.html")}</div></div></div>
{ind_cards(INDUSTRIES[:8])}</div></section>

<section class="section tight"><div class="wrap">
<div class="head center rv"><span class="eyebrow">Our clients</span><h2>Trusted by more than 100 organisations.</h2><p class="lead">From the Collabiz and Unite Group businesses to national institutions and international companies.</p></div>
</div>{client_marquee()}<div class="wrap center" style="margin-top:36px">{link("Meet our clients", "clients.html")}</div></section>

<section class="section bg-black"><div class="wrap">
<div class="head split"><div class="rv"><span class="eyebrow gold">From the archive</span><h2 style="margin-top:16px">Moments that <span class="grad">shaped us.</span></h2></div>
<div class="rv d1"><p class="lead">Landmark launches, publications and films from two decades of TEAM3.</p><div style="margin-top:22px">{link("Open the gallery", "gallery.html")}</div></div></div>
<div class="arch">{"".join(gallery_tile(g, n, True) for n, g in enumerate(GALLERY[:4]))}</div>
</div></section>

<section class="section bg-grey"><div class="wrap">
<div class="head split"><div class="rv"><span class="eyebrow">Insights</span><h2 style="margin-top:16px">Ideas worth exploring.</h2></div>
<div class="rv d1"><p class="lead">Perspectives on branding, artificial intelligence, technology, marketing and the future of business.</p><div style="margin-top:22px">{link("Knowledge centre", "insights.html")}</div></div></div>
<div class="grid g4">{insight_cards()}</div></div></section>

{cta_band("Great things begin with a conversation.", "Launching a brand, building an app, modernising your business or exploring AI — we are ready to understand your vision.", btn("Let’s Build Something", "contact.html", "red") + btn("Find your engagement model", "contact.html#engage", "ghost", False))}
'''
    return layout('index.html', 'Home', 'TEAM3 WEBLOGICS — established 2004. An integrated branding, advertising, technology and artificial intelligence company. Step beyond imagination.', body)


def page_about():
    values = [('Creativity', 'Thinking beyond conventional boundaries'), ('Innovation', 'Turning imagination into practical solutions'),
              ('Integrity', 'Building transparent and trustworthy relationships'), ('Collaboration', 'Growing together with clients and partners'),
              ('Excellence', 'Delivering quality across every engagement'), ('Intelligence', 'Using data and AI to create better outcomes'),
              ('Responsibility', 'Developing sustainable and ethical solutions')]
    journey = [('2004', 'The beginning', 'TEAM3 is established with a focus on creative services and technology.'),
               ('Growth', 'Creative expansion', 'Advertising, graphic design, corporate branding, multimedia and communication services.'),
               ('Scale', 'Technology expansion', 'Web applications, business portals, enterprise software and ERP solutions.'),
               ('Digital', 'Digital evolution', 'Digital marketing, internet technologies, interactive media and smart systems.'),
               ('2026', 'TEAM3 Reimagined', 'A relaunch combining branding, software engineering, artificial intelligence, AI learning and business automation.'),
               ('Next', 'The future', 'Building intelligent digital products and globally scalable business solutions.')]
    body = f'''
{page_hero("About Us", "About TEAM3", "Imagination is where <span class='grad'>everything begins.</span>", "Founded in 2004, TEAM3 began with a vision to bring creative communication and information technology together under one roof.")}
{subnav([("story","Our story"),("meaning","The meaning of 3"),("vision","Vision & mission"),("values","Values"),("founder","Founder"),("journey","Journey")])}
<section class="section" id="story"><div class="wrap"><div class="cap" style="border:0;padding:0">
<div class="rv"><span class="eyebrow">Our story</span><h2 style="margin-top:16px">Two decades of creativity and code.</h2></div>
<div class="stack rv d1" style="gap:22px;font-size:19px;line-height:1.6">
<p>Over the years, TEAM3 developed capabilities across advertising, branding, software development, web technologies, corporate communication, digital marketing and smart systems.</p>
<p class="muted">Today, TEAM3 is being reimagined for a new generation of businesses, where artificial intelligence, human creativity, data and technology work together to create meaningful impact.</p>
<p style="font:700 24px/1.35 var(--h);letter-spacing:-.025em">We believe technology should simplify complexity, creativity should create value, and innovation should deliver measurable business outcomes.</p>
</div></div></div></section>

<section class="section bg-black" id="meaning"><div class="wrap">
{head("The meaning behind TEAM3", "The name TEAM3 itself <span class='grad'>represents teamwork.</span>", "The number “3” represents our clients, our team members and the management. We believe in maintaining good client relationships and employee relationships — a philosophy from the original TEAM3 corporate presentation that continues to form our foundation.", gold=True)}
{pillars_block()}</div></section>

<section class="section" id="vision"><div class="wrap"><div class="grid g2">
<div class="panel rv"><div class="art art-red"></div><div class="art art-lines"></div><span class="eyebrow gold plain">Our vision</span><h3 style="margin-top:16px">To become a globally recognised creative and technology organisation that empowers businesses through intelligent innovation, powerful branding and transformative digital solutions.</h3></div>
<div class="panel light rv d1"><span class="eyebrow plain">Our mission</span><h3 style="margin-top:16px">To provide end-to-end creative, technology and business solutions through innovation, collaboration, technical excellence and customer-focused delivery.</h3></div>
</div></div></section>

<section class="section bg-grey" id="values"><div class="wrap">
{head("Our values", "Seven values. One standard.")}
<div class="values">{"".join(f'<div class="value rv"><span class="n">{n+1:02d}</span><b>{E(v)}</b><p>{E(p)}</p></div>' for n, (v, p) in enumerate(values))}</div>
</div></section>

<section class="section" id="founder"><div class="wrap founder">
<figure class="portrait rv"><img src="assets/img/symbol.png" alt="" width="382" height="540" loading="lazy"><figcaption><span>Founder &amp; Managing Director</span><b>Dr. Ravi Chandra</b></figcaption></figure>
<div class="rv d1"><span class="eyebrow">Our founder</span>
<blockquote style="margin-top:24px">TEAM3 was founded with an entrepreneurial vision to integrate creative design, advertising, information technology and business innovation.</blockquote>
<p class="lead" style="margin-top:26px">With experience spanning creative communication, technology architecture, digital platforms and business development, the founder’s vision is to transform TEAM3 into a next-generation global creative and technology enterprise.</p>
<p style="margin-top:24px;font-weight:700">Dr. Ravi Chandra <span class="muted" style="font-weight:500">— Founder &amp; Managing Director, TEAM3</span></p></div>
</div></section>

<section class="section bg-black" id="journey"><div class="wrap">
{head("Our journey", "From 2004 to the <span class='grad'>intelligent era.</span>", gold=True)}
<div class="timeline">{"".join(f'<div class="tl rv"><span class="yr">{E(y)}</span><div><h3>{E(t)}</h3><p>{E(p)}</p></div></div>' for y, t, p in journey)}</div>
</div></section>

<section class="section"><div class="wrap center">
<span class="eyebrow rv">Final brand communication</span>
<p class="statement rv d1" style="margin-top:24px"><span>Step beyond</span><span class="grad">imagination.</span></p>
<p class="lead rv d2" style="margin-top:28px">Imagine. Create. Innovate. Transform. Your complete branding, creative, technology and artificial intelligence partner.</p>
<div class="actions rv d3" style="justify-content:center">{btn("Let’s Build Something", "contact.html", "red")}{btn("Join our team", "careers.html", "ghost", False)}</div>
</div></section>
'''
    return layout('about.html', 'About Us', 'Founded in 2004, TEAM3 brings creative communication and information technology together — now reimagined with artificial intelligence.', body)


def page_branding():
    adv = [('Print advertising', 'Newspaper, magazine and print campaigns'), ('Outdoor advertising', 'Hoardings, billboards, transit media and signage'),
           ('Electronic media', 'Television, radio and digital commercials'), ('Interactive media', 'Interactive presentations and digital experiences'),
           ('Campaign strategy', 'Creative concepts, copywriting and media planning'), ('Graphic design', 'Brochures, catalogues, posters and marketing collateral'),
           ('Exhibition design', 'Exhibition stalls, product displays and event branding'), ('Corporate communication', 'Internal and external communication programmes')]
    media = [('Corporate films', 'Company profile and corporate storytelling'), ('Advertising films', 'Commercials and promotional campaigns'),
             ('Product films', 'Product demonstrations and launch videos'), ('Documentaries', 'Institutional and impact storytelling'),
             ('Animation', '2D and 3D animated content'), ('Motion graphics', 'Brand animation and explainers'),
             ('Photography', 'Corporate, industrial and product photography'), ('AI video production', 'AI-assisted visual storytelling'),
             ('Training films', 'Educational and employee learning content'), ('Event coverage', 'Corporate events and exhibitions')]
    body = f'''
{page_hero("Branding", "Branding & Brand Strategy", "We don’t just design logos. <span class='grad'>We build brands.</span>", "A brand is more than a name, symbol or colour. It is the experience, trust and perception that a business creates in the minds of its customers.", btn("Build Your Brand", "contact.html?service=Branding", "red") + btn("Create a campaign", "#advertising", "ghost", False))}
{subnav([("strategy","Brand strategy"),("identity","Identity"),("product","Product branding"),("corporate","Corporate"),("launch","Launch"),("advertising","Advertising"),("studio","Creative studio"),("media","Media & film")])}
<section class="section"><div class="wrap">
{head("Branding", "Distinctive identities. Lasting market value.", "TEAM3 helps businesses establish distinctive identities, communicate their purpose and build lasting market value.")}
<div id="strategy">{cap("Brand strategy", "Clarity before creativity — research, positioning and narrative.", checks(["Market research and competitor analysis","Brand positioning and differentiation","Brand architecture","Target audience identification","Brand naming and nomenclature","Brand storytelling","Tagline development","Brand communication strategy","Rebranding and brand transformation"], True))}</div>
<div id="identity">{cap("Brand identity design", "Visual systems that are consistent, recognisable and built to last.", checks(["Corporate logo design","Brand symbols and typography","Colour systems","Corporate stationery","Brand guidelines and identity manuals","Business cards and letterheads","Corporate presentations","Brand merchandise","Digital brand identity"], True))}</div>
<div id="product">{cap("Product branding", "From concept and name to the shelf and the launch.", checks(["New product conceptualisation","Product naming","Packaging design","Label design","Consumer research","Product positioning","Product launch strategy","Retail display design","Private-label and OEM brand development"], True))}</div>
<div id="corporate">{cap("Corporate branding", "Programmes that align people, spaces and stakeholders.", checks(["Corporate identity programmes","Employer branding","Investor presentations","Annual reports","Corporate profiles","Environmental branding","Office and showroom branding","Signage and wayfinding"], True))}</div>
</div></section>

<section class="section tight" id="launch"><div class="wrap"><div class="panel rv" style="min-height:420px"><div class="art art-mesh"></div><div class="art art-dots"></div>
<span class="eyebrow gold plain">Brand launch programmes</span><h3 style="margin-top:16px;max-width:820px;font-size:clamp(28px,3.4vw,46px)">A complete brand-to-market solution.</h3>
<p style="max-width:640px">From naming a business to designing its identity, creating its website, developing its applications and launching its marketing campaigns — one partner, end to end.</p>
<div class="actions">{btn("Build Your Brand", "contact.html?service=Branding", "light")}</div></div></div></section>

<section class="section bg-grey" id="advertising"><div class="wrap">
{head("Advertising & creative communication", "Creativity that communicates. <span class='grad'>Advertising that converts.</span>", "Integrated communication strategies that connect businesses with their audiences across traditional, digital and emerging media.")}
{rows(adv)}
<div class="actions">{btn("Create Your Next Campaign", "contact.html?service=Advertising", "red")}</div>
</div></section>

<section class="section bg-black" id="studio"><div class="wrap"><div class="cap" style="border:0;padding:0">
<div class="rv"><span class="eyebrow gold">Creative studio</span><h2 style="margin-top:16px">Where strategy meets craft.</h2></div>
<div class="rv d1"><p class="lead">Our creative studio brings together strategic thinking, visual design, storytelling and modern production technologies to develop compelling brand experiences.</p>
<div style="margin-top:30px">{chips(["Illustration","Infographics","Motion graphics","3D visualisation","Presentation design","AI-assisted content creation","Multilingual communication"])}</div></div>
</div></div></section>

<section class="section" id="media"><div class="wrap">
{head("Media & film production", "Stories that move people.", "We combine creativity, storytelling, cinematography and digital production to communicate brands and businesses through compelling visual experiences.")}
{rows(media)}
<div style="margin-top:56px" class="rv"><h3>Our production process</h3></div>
<div class="steps" style="margin-top:24px;grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">{"".join(f'<div class="step rv"><h4>{E(s)}</h4></div>' for s in ["Conceptualisation","Scriptwriting","Storyboarding","Production","Editing","Sound design","Distribution planning"])}</div>
<div class="actions">{btn("Tell Your Story", "contact.html?service=Media", "red")}</div>
</div></section>
{cta_band("Ready to build a brand people remember?", "Let’s shape your positioning, identity and launch — together.", btn("Build Your Brand", "contact.html?service=Branding", "red"))}
'''
    return layout('branding.html', 'Branding, Advertising & Media', 'Brand strategy, identity design, product and corporate branding, advertising, creative studio and media & film production by TEAM3.', body)


def page_technology():
    stack = ['React', 'Next.js', 'Angular', 'Flutter', 'React Native', 'Node.js', 'Python', 'Java', 'TypeScript', '.NET', 'PostgreSQL', 'MongoDB', 'MySQL', 'Firebase', 'Supabase']
    web = [('Corporate websites', 'Professional business websites'), ('E-commerce', 'Online stores and digital commerce'), ('Business portals', 'B2B and B2C platforms'),
           ('Marketplaces', 'Multi-vendor commerce platforms'), ('Educational portals', 'Learning and institutional websites'), ('Government portals', 'Public information and service platforms'),
           ('Real estate portals', 'Property listings and customer management'), ('Financial platforms', 'Financial service interfaces'), ('Booking platforms', 'Reservations and appointment systems'),
           ('Membership platforms', 'Subscription and member management'), ('Progressive web apps', 'App-like browser experiences')]
    proc = [('Idea & feasibility', 'Validate the business opportunity.'), ('Product strategy', 'Define features and commercial models.'), ('UI/UX design', 'Create intuitive user experiences.'),
            ('Architecture', 'Design scalable technical systems.'), ('Development', 'Build the application and integrations.'), ('Quality assurance', 'Test performance, security and usability.'),
            ('Deployment', 'Launch across selected platforms.'), ('Growth & maintenance', 'Improve and scale continuously.')]
    cloud = [('Cloud computing', 'Cloud architecture, deployment and migration'), ('DevOps', 'CI/CD, containers and infrastructure automation'), ('Data engineering', 'Data pipelines and database architecture'),
             ('Business intelligence', 'Dashboards and analytical reporting'), ('Cybersecurity', 'Security assessments and protective controls'), ('Application security', 'Secure development and vulnerability management'),
             ('Disaster recovery', 'Backup and recovery planning'), ('Managed IT', 'Monitoring and ongoing infrastructure support')]
    body = f'''
{page_hero("Technology", "Information Technology", "Technology engineered <span class='grad'>around your business.</span>", "From customised applications to enterprise platforms, we help organisations transform complex requirements into practical and scalable digital systems.", btn("Discuss Your IT Requirements", "contact.html?service=Technology", "red") + btn("Turn your idea into an app", "#apps", "ghost", False))}
{subnav([("enterprise","Enterprise software"),("consulting","IT consulting"),("stack","Stack"),("web","Web"),("apps","Apps & products"),("cloud","Cloud & security"),("iot","Smart tech & IoT")])}
<section class="section"><div class="wrap">
<div id="enterprise">{cap("Enterprise software development", "Systems that improve efficiency, enhance customer experiences and support long-term growth.", checks(["Custom software development","Enterprise resource planning (ERP)","Customer relationship management (CRM)","Human resource management systems","Inventory and warehouse management","Procurement management","Manufacturing management","Financial management platforms","Project management systems","Business workflow automation"], True))}</div>
<div id="consulting">{cap("IT consulting", "Architecture and strategy before a single line of code.", checks(["Technology architecture","Digital transformation consulting","Software requirement analysis","Technology modernisation","System integration","IT infrastructure planning","Technology feasibility studies","Product engineering consulting"], True))}</div>
{cap("IT support and maintenance", "", '<p class="lead" style="color:var(--ink)">Application maintenance, performance optimisation, system monitoring, version upgrades, technical support and dedicated development resources.</p>')}
</div></section>

<section class="section bg-black" id="stack"><div class="wrap">
{head("Software engineering capabilities", "Modern stack. <span class='grad'>Proven engineering.</span>", gold=True)}
<div class="rv">{chips(stack)}</div></div></section>

<section class="section" id="web"><div class="wrap">
{head("Web design & development", "Your digital presence. Designed for performance.", "Websites that combine compelling visual experiences, reliable technology and measurable business objectives.")}
{rows(web)}
<div class="grid g3" style="margin-top:40px">{"".join(f'<div class="card rv"><span class="ic">{ic(i)}</span><h4 style="font-size:19px">{t}</h4></div>' for i, t in [("phone","Mobile responsive"),("users","Accessible"),("shield","Secure"),("search","SEO-ready"),("rocket","High performance"),("layers","Future scalable")])}</div>
<div class="actions">{btn("Build Your Website", "contact.html?service=Web", "red")}</div>
</div></section>

<section class="section bg-grey" id="apps"><div class="wrap">
{head("Mobile app & digital product development", "From imagination <span class='grad'>to application.</span>", "We transform business ideas into intuitive, scalable and commercially viable digital products — combining business strategy, user experience, product architecture, software engineering and ongoing optimisation.")}
<div class="grid g2">
<div class="card rv"><span class="ic">{ic("phone")}</span><h3>App development services</h3><div style="margin-top:20px">{checks(["Android applications","iOS applications","Cross-platform mobile applications","Progressive web applications","Enterprise mobility solutions","Consumer applications","Subscription-based applications","AI-powered applications","Super apps and multi-service platforms"])}</div></div>
<div class="stack">
<div class="card rv d1"><span class="ic">{ic("cart")}</span><h3>Marketplace development</h3><p>B2B, B2C and C2C marketplaces, service aggregation, bidding platforms, e-commerce, franchise platforms, lead exchanges and business collaboration applications.</p></div>
<div class="card rv d2"><span class="ic">{ic("layers")}</span><h3>SaaS product development</h3><p>Multi-tenant architecture, subscription management, user onboarding, role-based access, billing integrations, dashboards, API ecosystems and white-label platforms.</p></div>
<div class="card rv d3"><span class="ic">{ic("pen")}</span><h3>UI/UX design</h3><p>User research, customer journey mapping, information architecture, wireframes, interactive prototypes, design systems, interface design and usability testing.</p></div>
</div></div>
<div class="rv" style="margin-top:72px"><h3 style="font-size:clamp(26px,2.8vw,36px);font-weight:800;letter-spacing:-.04em">Our product development process</h3></div>
<div class="steps" style="margin-top:28px">{"".join(f'<div class="step rv d{n%4}"><h4>{E(t)}</h4><p>{E(p)}</p></div>' for n, (t, p) in enumerate(proc))}</div>
<div class="actions">{btn("Turn Your Idea into an App", "contact.html?service=Apps", "red")}</div>
</div></section>

<section class="section" id="cloud"><div class="wrap">
{head("Cloud, data & cybersecurity", "Reliable technology. Secure infrastructure.", "Dependable digital infrastructure that supports business continuity, growth and secure technology adoption.")}
{rows(cloud)}
<div class="actions">{btn("Modernise Your Infrastructure", "contact.html?service=Cloud", "red")}</div>
</div></section>

<section class="section bg-black" id="iot"><div class="wrap">
{head("Smart technology & IoT", "Connecting people, devices <span class='grad'>and businesses.</span>", "Building upon TEAM3’s earlier smart-card and security systems capabilities, this division delivers connected technology solutions for modern organisations.", gold=True)}
<div class="grid g4">{"".join(f'<div class="card rv d{n}"><span class="ic">{ic(i)}</span><h3 style="font-size:21px">{t}</h3></div>' for n, (i, t) in enumerate([("shield","Smart access control"),("factory","Industrial IoT"),("sun","Energy monitoring"),("chip","Security systems")]))}</div>
<p class="lead rv" style="margin-top:40px">Solutions include RFID, smart cards, biometric systems, attendance management, connected devices, industrial monitoring, energy management dashboards, asset tracking and building automation.</p>
<div class="actions">{btn("Explore Smart Solutions", "contact.html?service=IoT", "red")}</div>
</div></section>
{cta_band("Let’s engineer what’s next.", "Share your requirements — we’ll design a practical, scalable path forward.", btn("Discuss Your IT Requirements", "contact.html?service=Technology", "red") + btn("Estimate your project", "contact.html#estimate", "ghost", False))}
'''
    return layout('technology.html', 'Technology', 'Enterprise software, IT consulting, web and mobile app development, SaaS, cloud, data, cybersecurity and smart IoT solutions by TEAM3.', body)


def orchestration_svg():
    # Hub-and-spoke orchestration with human approval gate
    nodes = [('Research', 'Agent', 120, 90), ('Sales', 'Agent', 120, 230), ('Finance', 'Agent', 120, 370),
             ('Marketing', 'Agent', 880, 90), ('Support', 'Agent', 880, 230), ('Procurement', 'Agent', 880, 370)]
    g = ''
    for t, s, x, y in nodes:
        cx = 500
        sx = x + (90 if x < cx else -90)
        ex = cx + (-110 if x < cx else 110)
        mx = (sx + ex) / 2
        dpath = f'M{sx} {y} C {mx} {y}, {mx} 230, {ex} 230'
        g += f'<path class="edge" d="{dpath}"/><path class="flow" d="{dpath}"/>'
    for t, s, x, y in nodes:
        g += f'<rect class="node" x="{x-90}" y="{y-32}" width="180" height="64" rx="16"/><text x="{x}" y="{y-2}" text-anchor="middle">{t}</text><text class="sub" x="{x}" y="{y+17}" text-anchor="middle">{s}</text>'
    return f'''<svg class="orch" viewBox="0 0 1000 560" role="img" aria-label="Diagram: an Executive orchestrator agent coordinates research, sales, finance, marketing, support and procurement agents, with a human approval gate before sensitive actions reach business systems.">
<defs><linearGradient id="coreG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ED1726"/><stop offset="1" stop-color="#7a0a12"/></linearGradient></defs>
{g}
<rect class="core" x="390" y="180" width="220" height="100" rx="22"/><text x="500" y="224" text-anchor="middle" style="font-size:18px">Executive Agent</text><text class="sub" x="500" y="248" text-anchor="middle" style="fill:#ffd0d3">Orchestrator · shared memory</text>
<path class="edge" d="M500 280 V 360"/><path class="flow" d="M500 280 V 360"/>
<rect x="390" y="360" width="220" height="64" rx="16" fill="#1a1405" stroke="#E9AC16"/><text x="500" y="389" text-anchor="middle" style="fill:#F7C948">Human approval</text><text class="sub" x="500" y="408" text-anchor="middle">for sensitive actions</text>
<path class="edge" d="M500 424 V 476"/><path class="flow" d="M500 424 V 476"/>
<rect class="node" x="300" y="476" width="400" height="60" rx="16"/><text x="500" y="503" text-anchor="middle">Business systems</text><text class="sub" x="500" y="522" text-anchor="middle">CRM · ERP · Email · Docs · APIs — with audit trail</text>
</svg>'''


def page_ai():
    eco = ['OpenAI', 'Claude', 'Google Gemini', 'Microsoft Azure AI', 'AWS Bedrock', 'Hugging Face', 'Open-source LLMs', 'Vector Databases', 'Custom AI Models']
    goal_opts = [('launch', 'Launch a new brand or business'), ('grow', 'Grow sales & visibility'), ('automate', 'Automate operations with AI'),
                 ('product', 'Build an app or SaaS product'), ('modernise', 'Modernise IT systems'), ('skill', 'Upskill my team in AI'), ('story', 'Tell our story on video')]
    body = f'''
{page_hero("Artificial Intelligence", "Artificial Intelligence", "Human imagination. Artificial intelligence. <span class='grad'>Extraordinary possibilities.</span>", "TEAM3 helps organisations adopt artificial intelligence to improve decision-making, automate repetitive operations, accelerate innovation and create new business opportunities.", btn("Transform Your Business with AI", "contact.html?service=AI", "red") + btn("Find the right AI solution", "#recommend", "ghost", False))}
{subnav([("consulting","AI consulting"),("bi","Business intelligence"),("ecosystem","Ecosystem"),("agents","AI agents"),("orchestration","Orchestration"),("governance","Governance"),("recommend","Recommender")])}
<section class="section" id="consulting"><div class="wrap">
{cap("AI consulting and implementation", "From readiness assessment to production-grade AI applications.", checks(["Enterprise AI readiness assessment","AI adoption roadmap","Generative AI solutions","Large language model integrations","Custom AI applications","AI-powered knowledge management","Retrieval-augmented generation (RAG)","Intelligent document processing","Multimodal AI","Responsible AI implementation"], True))}
<div id="bi">{cap("AI-powered business intelligence", "", '<p class="lead" style="color:var(--ink)">Transform complex business information into actionable intelligence through predictive analytics, demand forecasting, customer insights, competitive intelligence and automated reporting.</p>' + '<div style="margin-top:26px">' + chips(["Predictive analytics","Demand forecasting","Customer insights","Competitive intelligence","Automated reporting"]) + '</div>')}</div>
</div></section>

<section class="section bg-grey" id="ecosystem"><div class="wrap">
{head("AI integration ecosystem", "Model-agnostic. <span class='grad'>Outcome-obsessed.</span>", "We select AI technologies based on each customer’s business requirements, security needs, budget and operational objectives.")}
<div class="rv">{chips(eco)}</div></div></section>

<section class="section bg-black" id="agents"><div class="wrap">
{head("AI agents & business automation", "Build your intelligent <span class='grad'>digital workforce.</span>", "Imagine a workforce that can research, analyse, communicate, coordinate and execute approved business tasks around the clock. TEAM3 designs AI agents that integrate with business applications and assist teams in managing complex workflows.", gold=True)}
<div class="agents">{"".join(f'<div class="agent rv"><span class="av">{E(a[0])}{E(a.split()[1][0]) if len(a.split())>1 else ""}</span><div><b>{E(a)}</b><span>{E(b)}</span></div></div>' for a, b in AGENTS)}</div>
</div></section>

<section class="section bg-black" id="orchestration" style="padding-top:0"><div class="wrap">
<div class="head split"><div class="rv"><span class="eyebrow gold">Multi-agent orchestration</span><h2 style="margin-top:16px">Agents that work as a team.</h2></div>
<p class="lead rv d1">Specialist agents collaborate through an orchestrator that plans, delegates and reports — while sensitive actions always pass through human approval.</p></div>
<div class="rv" style="border:1px solid #222;border-radius:var(--r-lg);padding:clamp(16px,3vw,40px);background:#08080a">{orchestration_svg()}</div>
<div class="grid g2" style="margin-top:20px">
<div class="card rv"><span class="ic">{ic("layers")}</span><h3>Automation capabilities</h3><p>Automated workflows, customer communications, document generation, meeting scheduling, business intelligence reports, API integrations and task management.</p></div>
<div class="card rv d1" id="governance"><span class="ic">{ic("shield")}</span><h3>Governance and security</h3><p>Human approval for sensitive actions, role-based permissions, audit trails, data protection, agent performance monitoring and controlled automation.</p></div>
</div>
<div class="actions">{btn("Build Your AI Workforce", "contact.html?service=AI", "red")}</div>
</div></section>

<section class="section" id="recommend"><div class="wrap">
{head("AI service recommendation engine", "What should you build next?", "Answer two quick questions and we’ll suggest the TEAM3 services that fit your goals.")}
<div class="tool rv" id="recommender">
<div class="q"><b>1. What are you trying to achieve? <span class="muted small" style="font-weight:500">(choose any)</span></b><div class="opts" id="rq-goal" data-multi>{"".join(f'<button type="button" class="opt" aria-pressed="false" data-v="{k}">{E(v)}</button>' for k, v in goal_opts)}</div></div>
<div class="q"><b>2. Where is your business today?</b><div class="opts" id="rq-stage">{"".join(f'<button type="button" class="opt" aria-pressed="false" data-v="{k}">{E(v)}</button>' for k, v in [("idea","An idea"),("startup","Startup / SME"),("growth","Growing business"),("enterprise","Enterprise")])}</div></div>
<div class="result" id="rq-result" aria-live="polite"><h4>Recommended for you</h4><div class="chips"></div><div class="actions" style="margin-top:22px"><a class="btn red" href="contact.html">Explore these services{ARROW}</a><a class="btn ghost" href="contact.html">Talk to an expert</a></div></div>
</div></div></section>
{cta_band("Transform your business with AI.", "Start with a readiness assessment and a practical roadmap — then build with confidence.", btn("Transform Your Business with AI", "contact.html?service=AI", "red") + btn("Learn AI with TEAM3 Academy", "academy.html", "ghost", False))}
'''
    return layout('ai.html', 'Artificial Intelligence & AI Agents', 'AI consulting, generative AI, RAG, AI business intelligence, AI agents and multi-agent business automation with human-in-the-loop governance.', body)


def page_marketing():
    body = f'''
{page_hero("Digital Marketing", "Digital Marketing", "Visibility. Engagement. <span class='grad'>Conversion. Growth.</span>", "TEAM3 develops integrated digital marketing strategies that connect businesses with the right customers through data, creativity and technology.", btn("Grow Your Business", "contact.html?service=Marketing", "red"))}
<section class="section"><div class="wrap">
<div class="grid g4" style="margin-bottom:80px">{"".join(f'<div class="card rv d{n}"><span class="num">{n+1:02d}</span><h3 style="margin-top:40px;font-size:30px;font-weight:800">{w}</h3></div>' for n, w in enumerate(["Visibility","Engagement","Conversion","Growth"]))}</div>
{cap("Search engine optimisation", "", checks(["Technical SEO","On-page optimisation","Content strategy","Local SEO","Keyword research","Competitor analysis","Search performance tracking"], True))}
{cap("Search engine marketing", "", checks(["Google Ads","Search campaigns","Display advertising","Shopping campaigns","Remarketing","Conversion optimisation"], True))}
{cap("Social media marketing", "Instagram, Facebook, LinkedIn, YouTube, X and other relevant platforms.", checks(["Account management","Content calendars","Creative campaigns","Community engagement","Social advertising","Performance reporting"], True))}
{cap("Performance marketing", "", checks(["Lead generation campaigns","Customer acquisition","Conversion rate optimisation","Landing page design","Sales funnel development","Campaign analytics","Marketing automation"], True))}
</div></section>
<section class="section bg-black"><div class="wrap"><div class="grid g3">
<div class="card rv"><span class="ic">{ic("users")}</span><h3>Influencer marketing</h3><p>Creator identification, influencer partnerships, campaign management, branded content, audience analysis and campaign performance measurement.</p></div>
<div class="card rv d1"><span class="ic">{ic("ai")}</span><h3>AI-powered marketing</h3><p>AI-assisted content creation, personalised communication, automated campaign workflows, audience segmentation and customer journey optimisation.</p></div>
<div class="card rv d2"><span class="ic">{ic("megaphone")}</span><h3>Other marketing services</h3><p>Email marketing, WhatsApp Business campaigns with appropriate consent, online reputation management, content marketing, video marketing and digital public relations.</p></div>
</div></div></section>
{cta_band("Grow your business.", "Data, creativity and technology — working together to win the right customers.", btn("Grow Your Business", "contact.html?service=Marketing", "red"))}
'''
    return layout('marketing.html', 'Digital Marketing', 'SEO, search engine marketing, social media, performance, influencer and AI-powered marketing by TEAM3.', body)


def page_academy():
    progs = [('AI Foundation', 'AI concepts and productivity tools'), ('Prompt Engineering', 'Effective communication with AI models'), ('Generative AI', 'Text, image, video and content generation'),
             ('AI Agent Development', 'Building intelligent autonomous workflows'), ('No-Code AI', 'Applications without extensive coding'), ('AI for Business', 'Business planning and automation'),
             ('AI for Marketing', 'Campaigns, content and analytics'), ('Full-Stack Development', 'Frontend, backend and databases'), ('Mobile App Development', 'Cross-platform application engineering'),
             ('UI/UX Design', 'Product design and user experience'), ('Digital Marketing', 'Practical digital growth strategies'), ('Entrepreneurship', 'Idea validation and business development')]
    body = f'''
{page_hero("Academy", "TEAM3 Academy — AI Learning", "Learn today. <span class='grad'>Lead tomorrow.</span>", "TEAM3 Academy is envisioned as a practical learning platform for students, entrepreneurs, working professionals and organisations seeking to develop skills for the AI-powered economy.", btn("Explore Learning Programmes", "#programmes", "red") + btn("Become a Training Partner", "contact.html?service=Academy", "ghost", False))}
<section class="section" id="programmes"><div class="wrap">
{head("Proposed learning programmes", "Twelve programmes for the AI-powered economy.")}
<div class="grid g3">{"".join(f'<div class="card rv d{n%3}"><span class="num">{n+1:02d}</span><h3 style="margin-top:34px">{E(t)}</h3><p>{E(p)}</p></div>' for n, (t, p) in enumerate(progs))}</div>
</div></section>
<section class="section bg-grey"><div class="wrap">
{head("Learning formats", "Learn the way that works for you.")}
<div class="rv">{chips(["Online Learning","Classroom Training","Corporate Workshops","College Programmes","Live Projects","Skill Assessments"])}</div>
<div class="grid g2" style="margin-top:56px">
<div class="panel rv"><div class="art art-red"></div><div class="art art-dots"></div><span class="eyebrow gold plain">AI for enterprises</span><h3 style="margin-top:14px">Customised corporate training.</h3><p>For management teams, marketing departments, software developers, finance teams, HR professionals and operational staff.</p></div>
<div class="panel rv d1"><div class="art art-gold"></div><div class="art art-lines"></div><span class="eyebrow gold plain">AI for educational institutions</span><h3 style="margin-top:14px">Industry-ready graduates.</h3><p>Industry-oriented workshops, practical projects, innovation challenges, faculty development programmes and entrepreneurship training.</p></div>
</div></div></section>
{cta_band("Build skills for the AI-powered economy.", "Join a programme — or partner with TEAM3 Academy to bring AI learning to your organisation.", btn("Explore Learning Programmes", "#programmes", "red") + btn("Become a Training Partner", "contact.html?service=Academy", "ghost", False))}
'''
    return layout('academy.html', 'TEAM3 Academy — AI Learning', 'TEAM3 Academy: AI foundation, prompt engineering, generative AI, AI agents, full-stack, UI/UX and digital marketing programmes for people and enterprises.', body)


def page_work():
    heritage = [('Publications &amp; Events', 'branding advertising', 'Heritage', 'NIRD Technology Bank', 'Designed by TEAM3 — inaugurated by former President of India Shri A.P.J. Abdul Kalam, 2008.', 'nird-technology-bank-2008.jpg'),
                ('Publications &amp; Events', 'branding advertising', 'Heritage', 'NIRD Vision &amp; Souvenir', 'Designed by TEAM3 — inaugurated by President of India Smt. Pratibha Patil, 2009.', 'nird-vision-souvenir-2009.jpg'),
                ('Print &amp; Design', 'branding advertising', 'Heritage', 'Selected print works', 'Brochures, menus, catalogues, identities and corporate collateral.', 'print-works.jpg'),
                ('Campaigns', 'advertising', 'Heritage', 'Swachh Bharat Abhiyan', 'Campaign creative — one of our prestigious projects.', 'swachh-bharat.jpg')]
    heritage += [('Corporate Films', 'films', 'Heritage', E(n), E(d), img) for n, d, img in FILM_CLIENTS]
    heritage += [('Software', 'software websites', 'Heritage', 'Enterprise portals &amp; ERP', 'Web applications, business portals, ERP and smart-card security systems.', None)]
    products = GROUP
    filters = [('all', 'All Projects'), ('branding', 'Branding'), ('advertising', 'Advertising'), ('websites', 'Websites'), ('apps', 'Mobile Apps'), ('software', 'Software'),
               ('films', 'Corporate Films'), ('ai', 'AI Solutions'), ('marketing', 'Digital Marketing')]
    th = ['t1', 't2', 't3', 't4', 't5', 't6']
    def thumb(n, img, i):
        if img:
            return f'<div class="thumb photo"><img src="assets/img/gallery/{img}" alt="{n}" loading="lazy"></div>'
        return f'<div class="thumb {th[i%6]}"><b>{n}</b></div>'
    cards = ''.join(f'<article class="work rv" data-cat="{c}">{thumb(n, img, i)}<div class="meta"><small>{k}</small><h4>{n}</h4><p>{p}</p><span class="badge">{s}</span></div></article>' for i, (k, c, s, n, p, img) in enumerate(heritage))
    cards += ''.join(f'<article class="work rv" data-cat="{c}"><div class="thumb {th[i%6]}"><b>{E(n)}</b></div><div class="meta"><small>Collabiz &amp; Unite Group</small><h4>{E(n)}</h4><p>{E(p)}</p><span class="badge">Group client</span></div></article>' for i, (n, p, c) in enumerate(products))
    body = f'''
{page_hero("Our Work", "Our Work & Portfolio", "Our imagination. <span class='grad'>Your success.</span>", "Explore our creative and technology heritage — from corporate communication and print advertising to enterprise software, digital platforms and next-generation intelligent applications.")}
<section class="section"><div class="wrap">
<div class="filters rv" role="group" aria-label="Filter projects">{"".join(f'<button type="button" data-f="{k}" aria-pressed="{str(k=="all").lower()}">{E(v)}</button>' for k, v in filters)}</div>
<div class="works">{cards}</div>
</div></section>
<section class="section bg-grey" id="heritage"><div class="wrap">
<div class="head split"><div class="rv"><span class="eyebrow">Heritage &amp; clientele</span><h2 style="margin-top:16px">More than 100 clients across India and international markets.</h2></div>
<div class="rv d1"><p class="lead">From the Collabiz and Unite Group businesses to national institutions and global companies.</p><div class="actions" style="margin-top:22px">{btn("Meet our clients", "clients.html", "red")}{btn("Open the gallery", "gallery.html", "ghost", False)}</div></div></div>
</div></section>
{cta_band("Your project could be next.", "Let’s create the work you’ll be proud to show.", btn("Start a Project", "contact.html", "red"))}
'''
    return layout('work.html', 'Our Work & Portfolio', 'TEAM3 portfolio: heritage branding, advertising, corporate films and software — plus next-generation AI and platform product initiatives.', body)


def page_industries():
    body = f'''
{page_hero("Industries", "Industries we serve", "Industry knowledge. <span class='grad'>Technology without boundaries.</span>", "Every industry has unique challenges. TEAM3 combines creative thinking and technology capabilities to develop relevant solutions across different business sectors.")}
<section class="section bg-grey"><div class="wrap">{ind_cards(INDUSTRIES)}</div></section>
<section class="section" id="consulting"><div class="wrap">
{head("Business consulting & product innovation", "Turning ideas <span class='grad'>into enterprises.</span>", "TEAM3 helps entrepreneurs and established businesses identify new opportunities, develop innovative products and bring commercially viable solutions to market.")}
{cap("Business consulting services", "", checks(["Business concept development","Market feasibility studies","Business model design","Competitive intelligence","Commercial strategy","Go-to-market planning","Franchise model development","Investor presentation design","Business process transformation","Technology adoption strategy","International market development"], True))}
</div></section>
<section class="section tight" id="innovation"><div class="wrap"><div class="panel rv" style="min-height:460px"><div class="art art-gold"></div><div class="art art-lines"></div>
<span class="eyebrow gold plain">Innovation as a service</span><h3 style="margin-top:16px;max-width:860px;font-size:clamp(28px,3.4vw,46px)">Research, design, engineering, AI, manufacturing partners and marketing — together.</h3>
<p style="max-width:640px">We bring the capabilities together to help you develop and launch new products and services.</p>
<div class="actions">{btn("Develop Your Business Idea", "contact.html?service=Consulting", "light")}</div></div></div></section>
{cta_band("Solutions shaped for your sector.", "Tell us about your industry and the challenge you’re solving.", btn("Let’s Build Something", "contact.html", "red"))}
'''
    return layout('industries.html', 'Industries & Consulting', 'TEAM3 serves manufacturing, energy, healthcare, education, real estate, retail, government, finance, logistics and more — plus business consulting and product innovation.', body)


def page_careers():
    creative = ['Brand strategists', 'Graphic designers', 'UI/UX designers', 'Creative directors', 'Content writers', 'Digital marketers', 'Video editors', 'Business consultants']
    tech = ['Full-stack developers', 'Mobile app developers', 'AI engineers', 'AI agent developers', 'Cloud engineers', 'Data engineers', 'Software architects', 'QA engineers']
    body = f'''
{page_hero("Careers", "Careers", "Come imagine <span class='grad'>the future with us.</span>", "At TEAM3, creativity and technology come together to solve meaningful challenges. We are building a culture where designers, developers, AI engineers, strategists and entrepreneurs can collaborate, learn and create.", btn("Submit Your Profile", "#apply", "red") + btn("Partner with us", "partners.html", "ghost", False))}
<section class="section"><div class="wrap">
{head("Talent communities", "Two communities. One team.")}
<div class="grid g2">
<div class="card rv"><span class="ic">{ic("pen")}</span><h3>Creative &amp; marketing</h3><ul class="bullets" style="margin-top:18px">{"".join(f"<li>{E(r)}</li>" for r in creative)}</ul></div>
<div class="card rv d1"><span class="ic">{ic("code")}</span><h3>Technology &amp; AI</h3><ul class="bullets" style="margin-top:18px">{"".join(f"<li>{E(r)}</li>" for r in tech)}</ul></div>
</div>
<div class="rv" style="margin-top:56px"><h3>Work opportunities</h3><div style="margin-top:20px">{chips(["Full-time employment","Internships","Freelance projects","Remote collaboration","Consulting assignments","Project-based partnerships"])}</div>
<p class="muted" style="margin-top:22px">Specific vacancies will be published when recruitment requirements are confirmed.</p></div>
</div></section>

<section class="section bg-grey" id="apply"><div class="wrap"><div class="cap contact-grid" style="border:0;padding:0">
<div class="rv"><span class="eyebrow">Careers portal</span><h2 style="margin-top:16px">Submit your profile.</h2>
<p class="lead" style="margin-top:20px">Join a TEAM3 talent community. When a role, internship or project matches your profile, we’ll be in touch.</p></div>
<div class="tool rv d1">
<form class="form" id="career-form" data-form="Career Profile" novalidate>
{HONEYPOT}
<div class="field"><label for="c-name">Full name</label><input id="c-name" name="name" autocomplete="name" required></div>
<div class="field"><label for="c-email">Email address</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
<div class="field"><label for="c-phone">Phone / WhatsApp</label><input id="c-phone" name="phone" type="tel" autocomplete="tel"></div>
<div class="field"><label for="c-city">City / country</label><input id="c-city" name="location" autocomplete="address-level2"></div>
<div class="field"><label for="c-role">Role you’re interested in</label><select id="c-role" name="role">{"".join(f"<option>{E(r[:-1] if r.endswith('s') else r)}</option>" for r in creative + tech)}<option>Other</option></select></div>
<div class="field"><label for="c-type">Opportunity type</label><select id="c-type" name="opportunity">{"".join(f"<option>{E(o)}</option>" for o in ["Full-time employment","Internship","Freelance project","Remote collaboration","Consulting assignment","Project-based partnership"])}</select></div>
<div class="field"><label for="c-exp">Years of experience</label><select id="c-exp" name="experience"><option>Student / fresher</option><option>1 – 3 years</option><option>3 – 6 years</option><option>6 – 10 years</option><option>10+ years</option></select></div>
<div class="field"><label for="c-link">Portfolio / LinkedIn / CV link</label><input id="c-link" name="portfolio" type="url" placeholder="https://"></div>
<div class="field full"><label for="c-msg">Tell us about yourself</label><textarea id="c-msg" name="message" required></textarea></div>
{consent_field("c")}
<div class="field full"><button class="btn red" type="submit">Submit Your Profile{ARROW}</button>{form_note()}</div>
</form></div>
</div></div></section>
{cta_band("Prefer to collaborate as a partner?", "Freelancers, agencies, consultants and technology companies can join the TEAM3 Partner Network.", btn("Become a TEAM3 Partner", "partners.html#register", "red"))}
'''
    return layout('careers.html', 'Careers', 'Careers at TEAM3 across creative, marketing, technology and AI.', body)




def gallery_tile(g, n, compact=False):
    img, cat, catl, title, cap, w, h = g
    return (f'<figure class="gtile rv d{n%4}" data-cat="{cat}"><button type="button" class="gopen" data-full="assets/img/gallery/{img}" data-title="{title}" data-cap="{cap}" aria-label="Open image: {title}">'
            f'<img src="assets/img/gallery/{img}" alt="{title}" width="{w}" height="{h}" loading="lazy"></button>'
            f'<figcaption><small>{catl}</small><b>{title}</b>{"" if compact else f"<span>{cap}</span>"}</figcaption></figure>')


LIGHTBOX = """<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>
<button type="button" class="lb-x" aria-label="Close">&times;</button>
<button type="button" class="lb-nav lb-prev" aria-label="Previous image">&#8249;</button>
<figure><img alt=""><figcaption><b></b><span></span></figcaption></figure>
<button type="button" class="lb-nav lb-next" aria-label="Next image">&#8250;</button></div>"""


def page_gallery():
    cats = [('all', 'All'), ('events', 'Events'), ('publications', 'Publications'), ('print', 'Print &amp; Design'), ('films', 'Corporate Films'), ('campaigns', 'Campaigns')]
    body = f"""
{page_hero("Gallery", "Gallery", "Moments that <span class='grad'>shaped us.</span>", "Landmark launches, publications, print work and films from two decades of TEAM3 — from the TEAM3 company archive.")}
<section class="section"><div class="wrap">
<div class="filters rv" role="group" aria-label="Filter gallery">{"".join(f'<button type="button" data-f="{k}" data-target=".gtile" aria-pressed="{str(k=="all").lower()}">{v}</button>' for k, v in cats)}</div>
<div class="gallery">{"".join(gallery_tile(g, n) for n, g in enumerate(GALLERY))}</div>
</div></section>
{cta_band("Let’s create your next landmark.", "Publications, campaigns, films and launches — designed by TEAM3.", btn("Start a Project", "contact.html", "red") + btn("Meet our clients", "clients.html", "ghost", False))}
{LIGHTBOX}
"""
    return layout('gallery.html', 'Gallery', 'TEAM3 gallery: NIRD launches with the President of India, publications, print works, campaigns and corporate films.', body)


def page_clients():
    group = ''.join(f'<div class="gclient rv d{n%4}"><span class="mono">{E(nm[:1])}</span><b>{E(nm)}</b><span class="d">{E(ds)}</span><span class="tag">Group client</span></div>' for n, (nm, ds, _) in enumerate(GROUP))
    heritage = ''.join(f'<div class="row rv"><b>{E(n)}</b><span>{E(m)}</span><i>{i+1:02d}</i></div>' for i, (n, m) in enumerate(CLIENTS))
    films = ''.join(gallery_tile(g, n) for n, g in enumerate(x for x in GALLERY if x[1] == 'films'))
    body = f"""
{page_hero("Clients", "Our Clients", "Trusted by more than <span class='grad'>100 organisations.</span>", "Our clientele spans sectors from national to international level — from the Collabiz and Unite Group businesses to government institutions, healthcare, pharma, aviation and global technology companies.")}
{subnav([("group","Collabiz & Unite Group"),("institutions","Institutions"),("heritage","Heritage clientele"),("films","Film clients")])}
<section class="section" id="group"><div class="wrap">
{head("Collabiz & Unite Group", "Group businesses <span class='grad'>we build for.</span>", "TEAM3 is the branding, technology and AI partner to the Collabiz and Unite Group businesses — from strategy and identity to platforms, apps and intelligent automation.")}
<div class="gclients">{group}</div>
</div></section>
<section class="section bg-black" id="institutions"><div class="wrap">
<div class="head split"><div class="rv"><span class="eyebrow gold">Institutions</span><h2 style="margin-top:16px">National Institute of <span class="grad">Rural Development.</span></h2></div>
<p class="lead rv d1">TEAM3 designed NIRD’s Technology Bank — inaugurated by former President of India Shri A.P.J. Abdul Kalam in 2008 — and NIRD’s Vision and Souvenir, inaugurated by President Smt. Pratibha Patil in 2009, along with programme literature and publications.</p></div>
<div class="arch two">{"".join(gallery_tile(g, n, True) for n, g in enumerate(GALLERY[:2]))}</div>
<div class="actions">{btn("Open the gallery", "gallery.html", "light")}</div>
</div></section>
<section class="section bg-grey" id="heritage"><div class="wrap">
<div class="head split"><div class="rv"><span class="eyebrow">Heritage clientele</span><h2 style="margin-top:16px">National to international.</h2></div>
<p class="lead rv d1">A few of our prestigious clients from a database of more than 100, as listed in the TEAM3 company presentation.</p></div>
<div class="rows">{heritage}</div>
</div></section>
<section class="section" id="films"><div class="wrap">
{head("Film clients", "Few of our corporate films.")}
<div class="gallery four">{films}</div>
</div></section>
{cta_band("Join our clients.", "Let’s build your brand, technology and intelligence — together.", btn("Start a Project", "contact.html", "red") + btn("Become a partner", "partners.html", "ghost", False))}
{LIGHTBOX}
"""
    return layout('clients.html', 'Our Clients', 'TEAM3 clients: Collabiz and Unite Group businesses, NIRD, Accenture, Air India, Dr. Reddy’s, Madhucon and 100+ organisations since 2004.', body)


def page_partners():
    types = ["Creative partner", "Software development partner", "AI technology partner", "Marketing agency", "Business consultant", "Training institution", "Freelance professional", "International representative", "Manufacturing partner", "Franchise partner"]
    tiles = [("pen", "Creative partners"), ("code", "Software development partners"), ("ai", "AI technology partners"), ("megaphone", "Marketing agencies"), ("compass", "Business consultants"), ("cap", "Training institutions"), ("users", "Freelance professionals"), ("globe", "International representatives"), ("factory", "Manufacturing partners"), ("rocket", "Franchise partners")]
    benefits = [("Access to business opportunities", "Qualified projects from TEAM3 and the Collabiz network."), ("Collaborative project development", "Deliver together, with clear roles and shared tools."), ("Technology resources", "Platforms, AI tooling and engineering support."), ("Marketing support", "Co-branded campaigns and visibility across our channels."), ("Shared expertise", "Branding, technology and AI know-how under one roof."), ("Agreed commercial incentives", "Transparent commissions and revenue share.")]
    body = f"""
{page_hero("Partners", "TEAM3 Partner Network", "Connect. Collaborate. <span class='grad'>Create opportunities.</span>", "TEAM3 believes that the future of business lies in collaboration. Our partner ecosystem brings together creative professionals, technology companies, consultants, entrepreneurs, investors and industry specialists.", btn("Become a TEAM3 Partner", "#register", "red") + btn("See partner benefits", "#benefits", "ghost", False))}
<section class="section"><div class="wrap">
{head("Partnership opportunities", "Ten ways to partner.")}
<div class="grid g4 ptypes">{"".join(f'<div class="card rv d{n%4}"><span class="ic">{ic(i)}</span><h4 style="font-size:18px">{E(t)}</h4></div>' for n, (i, t) in enumerate(tiles))}</div>
</div></section>
<section class="section bg-black" id="benefits"><div class="wrap">
{head("Partner benefits", "Grow together. <span class='grad'>Win together.</span>", gold=True)}
<div class="grid g3">{"".join(f'<div class="card rv d{n%3}"><span class="num">{n+1:02d}</span><h3 style="margin-top:28px;font-size:21px">{E(t)}</h3><p>{E(d)}</p></div>' for n, (t, d) in enumerate(benefits))}</div>
<p class="lead rv" style="margin-top:40px">The partner network integrates with <b style="color:#fff">COLLABIZ</b> for opportunity discovery, protected leads, project collaboration, partner onboarding and commission tracking.</p>
</div></section>
<section class="section bg-grey" id="register"><div class="wrap"><div class="cap contact-grid" style="border:0;padding:0">
<div class="rv"><span class="eyebrow">Partner registration</span><h2 style="margin-top:16px">Become a TEAM3 partner.</h2>
<p class="lead" style="margin-top:20px">Tell us about you and how you’d like to collaborate. Our partnerships team will get back to you to discuss the next steps.</p>
{steps_mini(["Register your interest", "Discovery call with TEAM3", "Partner agreement & onboarding", "Collaborate on opportunities"])}</div>
<div class="tool rv d1">
<form class="form" id="partner-form" data-form="Partner Registration" novalidate>
{HONEYPOT}
<div class="field"><label for="p-name">Full name</label><input id="p-name" name="name" autocomplete="name" required></div>
<div class="field"><label for="p-company">Company / practice</label><input id="p-company" name="company" autocomplete="organization"></div>
<div class="field"><label for="p-email">Email address</label><input id="p-email" name="email" type="email" autocomplete="email" required></div>
<div class="field"><label for="p-phone">Phone / WhatsApp</label><input id="p-phone" name="phone" type="tel" autocomplete="tel"></div>
<div class="field"><label for="p-type">Partner type</label><select id="p-type" name="partner_type">{"".join(f"<option>{E(o)}</option>" for o in types)}</select></div>
<div class="field"><label for="p-loc">City / country</label><input id="p-loc" name="location"></div>
<div class="field full"><label for="p-msg">How would you like to collaborate?</label><textarea id="p-msg" name="message" required></textarea></div>
{consent_field("p")}
<div class="field full"><button class="btn red" type="submit">Become a TEAM3 Partner{ARROW}</button>{form_note()}</div>
</form></div>
</div></div></section>
"""
    return layout('partners.html', 'Partner Network', 'Join the TEAM3 Partner Network: creative, technology, AI, marketing, consulting, training, international and franchise partners.', body)


def steps_mini(items):
    return '<ol class="msteps">' + ''.join(f'<li><span>{n+1}</span>{E(t)}</li>' for n, t in enumerate(items)) + '</ol>'


def page_insights():
    cats = ['Product innovation', 'Entrepreneurship', 'Software engineering', 'Business intelligence', 'Cybersecurity', 'AI learning', 'International business']
    body = f'''
{page_hero("Insights", "Insights & Knowledge Centre", "Ideas worth <span class='grad'>exploring.</span>", "Discover perspectives on branding, artificial intelligence, technology, marketing and the future of business.")}
<section class="section"><div class="wrap">
<div class="grid g2">{insight_cards()}</div>
<div class="rv" style="margin-top:64px"><h3>More topics coming soon</h3><div style="margin-top:18px">{chips(cats)}</div></div>
</div></section>
{cta_band("Have a question worth exploring?", "Our strategists and engineers are happy to talk.", btn("Start a conversation", "contact.html", "red"))}
'''
    return layout('insights.html', 'Insights', 'TEAM3 insights on AI agents, brand strategy, digital products and AI-powered marketing.', body)


def page_contact():
    services = ['Branding', 'Advertising', 'Media', 'Technology', 'Web', 'Apps', 'AI', 'Marketing', 'Cloud', 'IoT', 'Consulting', 'Academy', 'Partnership', 'Careers']
    labels = {'Branding': 'Branding & Strategy', 'Advertising': 'Advertising & Creative', 'Media': 'Media & Film Production', 'Technology': 'Information Technology',
              'Web': 'Web Design & Development', 'Apps': 'Mobile App & Product Development', 'AI': 'Artificial Intelligence & AI Agents', 'Marketing': 'Digital Marketing',
              'Cloud': 'Cloud, Data & Cybersecurity', 'IoT': 'Smart Technology & IoT', 'Consulting': 'Business Consulting & Innovation', 'Academy': 'TEAM3 Academy / Training',
              'Partnership': 'Partnership opportunity', 'Careers': 'Careers / Profile submission'}
    eng = [('Project-Based Engagement', 'Defined scope, agreed deliverables and milestone-based execution.'), ('Monthly Retainership', 'Continuous creative, marketing, consulting or technical support.'),
           ('Dedicated Development Team', 'Specialised technology resources aligned with your business.'), ('AI as a Service', 'Managed AI agents, integrations and ongoing optimisation.'),
           ('SaaS Subscription', 'Access to digital products through subscription plans.'), ('Business Transformation Partnership', 'Integrated branding, technology and growth engagement.'),
           ('Product Development Partnership', 'Joint product innovation under mutually agreed commercial terms.'), ('White-Label Solutions', 'Customisable software and creative solutions under your brand.')]
    es = [('brand', 'Branding'), ('web', 'Website'), ('app', 'Mobile app / SaaS'), ('ai', 'AI / Agents'), ('erp', 'Enterprise software'), ('mkt', 'Digital marketing'), ('film', 'Film / video'), ('academy', 'Training')]
    body = f'''
{page_hero("Contact", "Contact Us", "Great things begin <span class='grad'>with a conversation.</span>", "Whether you are launching a new brand, developing a mobile application, modernising your business or exploring artificial intelligence, we are ready to understand your vision.")}
<section class="section"><div class="wrap"><div class="cap contact-grid" style="border:0;padding:0">
<div class="rv">
<span class="eyebrow">Get in touch</span>
<h3 style="margin-top:18px">{E(SITE['company'])}</h3>
<div class="contact-lines" style="margin-top:14px">{contact_lines()}</div>
<ul class="bullets" style="margin-top:30px">{"".join(f"<li>{E(x)}</li>" for x in ["Global business enquiries","Technology consulting","Branding projects","Partnership opportunities","Training programmes"])}</ul>
<div class="actions" style="margin-top:28px">{btn("Book a meeting", "#meeting", "ghost", False)}</div>
</div>
<div class="tool rv d1">
<h3>Tell us about your project</h3>
<form class="form" id="enquiry" data-form="Project Enquiry" style="margin-top:26px" novalidate>
{HONEYPOT}
<div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" autocomplete="name" required></div>
<div class="field"><label for="f-company">Company name</label><input id="f-company" name="company" autocomplete="organization"></div>
<div class="field"><label for="f-email">Email address</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
<div class="field"><label for="f-phone">Phone / WhatsApp</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
<div class="field"><label for="f-service">Service required</label><select id="f-service" name="service">{"".join(f'<option value="{k}">{E(labels[k])}</option>' for k in services)}</select></div>
<div class="field"><label for="f-budget">Estimated project budget</label><select id="f-budget" name="budget"><option>To be discussed</option><option>Small project</option><option>Mid-size project</option><option>Large / enterprise programme</option><option>Ongoing retainer</option></select></div>
<div class="field full"><label for="f-msg">Tell us about your requirements</label><textarea id="f-msg" name="message" required></textarea></div>
{consent_field("f")}
<div class="field full"><button class="btn red" type="submit">Send Project Enquiry{ARROW}</button>{form_note()}</div>
</form></div>
</div></div></section>

<section class="section bg-black" id="meeting"><div class="wrap"><div class="cap contact-grid" style="border:0;padding:0">
<div class="rv"><span class="eyebrow gold">Online appointment scheduling</span><h2 style="margin-top:16px">Book a discovery call.</h2>
<p class="lead" style="margin-top:20px">Pick a topic and a preferred slot. We’ll confirm the meeting by email — usually within one business day.</p>
<ul class="bullets" style="margin-top:28px">{"".join(f"<li>{E(x)}</li>" for x in ["30-minute discovery call","Video call, phone or in person in Hyderabad","Times shown in India Standard Time (IST)"])}</ul></div>
<div class="tool rv d1">
<form class="form" id="meeting-form" data-form="Meeting Request" novalidate>
{HONEYPOT}
<div class="field"><label for="m-name">Full name</label><input id="m-name" name="name" autocomplete="name" required></div>
<div class="field"><label for="m-email">Email address</label><input id="m-email" name="email" type="email" autocomplete="email" required></div>
<div class="field"><label for="m-phone">Phone / WhatsApp</label><input id="m-phone" name="phone" type="tel" autocomplete="tel"></div>
<div class="field"><label for="m-topic">Topic</label><select id="m-topic" name="topic">{"".join(f"<option>{E(labels[k])}</option>" for k in services)}</select></div>
<div class="field"><label for="m-date">Preferred date</label><input id="m-date" name="date" type="date" required data-min-today></div>
<div class="field"><label for="m-slot">Preferred time (IST)</label><select id="m-slot" name="time"><option>10:00 – 12:00</option><option>12:00 – 14:00</option><option>14:00 – 16:00</option><option>16:00 – 18:00</option></select></div>
<div class="field full"><label for="m-mode">Meeting mode</label><div class="seg" id="m-mode"><label><input type="radio" name="mode" value="Video call" checked><span>Video call</span></label><label><input type="radio" name="mode" value="Phone"><span>Phone</span></label><label><input type="radio" name="mode" value="In person (Hyderabad)"><span>In person</span></label></div></div>
{consent_field("m")}
<div class="field full"><button class="btn red" type="submit">Request Meeting{ARROW}</button>{form_note()}</div>
</form></div>
</div></div></section>

<section class="section bg-grey" id="estimate"><div class="wrap">
{head("Project scope estimator", "Get an indicative scope in seconds.", "Select what you need — we’ll suggest an engagement tier, typical timeline and the best-fit engagement model. Final scope and commercials are confirmed after a discovery call.")}
<div class="tool rv" id="estimator">
<div class="q"><b>Services needed</b><div class="opts" id="es-svc" data-multi>{"".join(f'<button type="button" class="opt" aria-pressed="false" data-v="{k}">{E(v)}</button>' for k, v in es)}</div></div>
<div class="q"><b>Project size: <span id="es-size-l" class="red">Standard</span></b><input id="es-size" type="range" min="1" max="4" value="2" style="margin-top:16px" aria-label="Project size"></div>
<div class="q"><b>Timeline preference</b><div class="opts" id="es-time"><button type="button" class="opt" aria-pressed="true" data-v="std">Standard</button><button type="button" class="opt" aria-pressed="false" data-v="fast">Accelerated</button></div></div>
<div class="result" id="es-result" aria-live="polite"><span class="eyebrow plain">Indicative result</span><h4 style="margin-top:12px">—</h4><div class="meter"><i></i></div>
<div class="grid g2" style="margin-top:22px;gap:14px"><div><span class="muted small">Typical timeline</span><p style="font-weight:700;margin-top:4px" id="es-time-o">—</p></div><div><span class="muted small">Suggested engagement model</span><p style="font-weight:700;margin-top:4px" id="es-model">—</p></div></div>
<div class="actions" style="margin-top:22px"><a class="btn red" href="#enquiry">Request a detailed proposal{ARROW}</a></div></div>
</div></div></section>

<section class="section" id="engage"><div class="wrap">
{head("Engagement models", "Work with us. <span class='grad'>Your way.</span>", "Flexible engagement structures designed around different business needs, project sizes and stages of growth.")}
<div class="eng">{"".join(f'<div class="card rv d{n%4}"><span class="num">{n+1:02d}</span><h3>{E(t)}</h3><p>{E(p)}</p></div>' for n, (t, p) in enumerate(eng))}</div>
</div></section>
'''
    return layout('contact.html', 'Contact', 'Contact TEAM3 WEBLOGICS, Hyderabad — branding, technology, AI, marketing and training enquiries. Project scope estimator and engagement models.', body)


def page_legal():
    toc = ''.join(f'<a href="#{i}">{E(t)}</a>' for i, t, _ in LEGAL)
    secs = ''
    for i, t, parts in LEGAL:
        secs += f'<section class="legal-sec" id="{i}"><h2>{E(t)}</h2>' + ''.join(f'<h3>{E(h)}</h3>{render_blocks(ps)}' for h, ps in parts) + '</section>'
    body = f'''
{page_hero("Legal", "Legal", "Policies &amp; <span class='grad'>principles.</span>", "Our commitments on privacy, terms of use, cookies and the responsible use of artificial intelligence.")}
{subnav([(i, t) for i, t, _ in LEGAL])}
<section class="section"><div class="wrap prose legal">
<p class="muted small">Last updated: November 2026</p>
{secs}
</div></section>
'''
    return layout('legal.html', 'Legal & Policies', 'TEAM3 privacy, terms, cookie and responsible AI policies.', body)


def page_404():
    body = f'''<section class="hero page-hero" style="min-height:70vh"><div class="hero-glow"><i></i><i></i></div><div class="hero-grid-lines"></div>
<div class="wrap"><span class="eyebrow gold">Error 404</span><h1 style="margin-top:22px">This step goes <span class="grad">beyond imagination.</span></h1>
<p class="lead" style="margin-top:24px">The page you’re looking for has moved or doesn’t exist.</p>
<div class="actions">{btn("Back to home", "index.html", "light")}{btn("Contact us", "contact.html", "ghost", False)}</div></div></section>'''
    return layout('404.html', 'Page not found', 'Page not found.', body).replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n<meta name="viewport"', 1)


def write_extras(names):
    urls = ''.join(f'<url><loc>{SITE["url"]}/{"" if n == "index.html" else n}</loc></url>' for n in names if n != '404.html')
    files = {
        'sitemap.xml': f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n',
        'robots.txt': f'User-agent: *\nAllow: /\nSitemap: {SITE["url"]}/sitemap.xml\n',
        'site.webmanifest': '{"name":"TEAM3 WEBLOGICS","short_name":"TEAM3","start_url":"index.html","display":"standalone","background_color":"#000000","theme_color":"#000000","icons":[{"src":"assets/img/favicon.png","sizes":"192x192","type":"image/png"}]}\n',
    }
    for n, c in files.items():
        with open(os.path.join(ROOT, n), 'w', encoding='utf-8') as f:
            f.write(c)


PAGES = {
    'index.html': page_index, 'about.html': page_about, 'branding.html': page_branding, 'technology.html': page_technology,
    'ai.html': page_ai, 'marketing.html': page_marketing, 'academy.html': page_academy, 'work.html': page_work,
    'industries.html': page_industries, 'careers.html': page_careers, 'insights.html': page_insights,
    'contact.html': page_contact, 'legal.html': page_legal, '404.html': page_404,
    'gallery.html': page_gallery, 'clients.html': page_clients, 'partners.html': page_partners,
}
for _a in ARTICLES:
    PAGES[_a['slug'] + '.html'] = (lambda a=_a: page_article(a))

if __name__ == '__main__':
    for name, fn in PAGES.items():
        with open(os.path.join(ROOT, name), 'w', encoding='utf-8') as f:
            f.write(fn())
        print('wrote', name)
    write_extras(PAGES)
    print('wrote sitemap.xml, robots.txt, site.webmanifest')
