# TEAM3 WEBLOGICS — Website (Relaunch 2026)

Branding. Advertising. Technology. Artificial Intelligence. · *Step beyond imagination.*

A static, multi-page corporate website: no framework, no build server. Open `index.html` in a browser,
or deploy the repository root to any static host (GitHub Pages, Netlify, Vercel, cPanel).

## Pages
| File | Content |
|---|---|
| `index.html` | Hero, heritage stats, 12 services, three pillars, AI workforce, Why TEAM3, industries, clientele, insights |
| `about.html` | Story, meaning of TEAM3, vision & mission, values, founder, journey timeline |
| `branding.html` | Brand strategy & identity, product & corporate branding, advertising, creative studio, media & film |
| `technology.html` | Enterprise software, IT consulting, stack, web, apps & SaaS, cloud & security, smart tech & IoT |
| `ai.html` | AI consulting, BI, ecosystem, 14 AI agents, multi-agent orchestration, governance, service recommender |
| `marketing.html` | SEO, SEM, social, performance, influencer and AI-powered marketing |
| `academy.html` | TEAM3 Academy programmes and formats |
| `work.html` | Filterable portfolio, product initiatives, historical clientele |
| `industries.html` | 14 industries, business consulting, innovation as a service |
| `careers.html` | Talent communities, careers profile form, partner network + registration |
| `insights.html` + `insight-*.html` | Knowledge centre and four full articles |
| `contact.html` | Enquiry form, appointment booking, project scope estimator, engagement models |
| `legal.html` | Privacy, terms, cookies, responsible AI policies |
| `404.html` | Not-found page (configure your host to serve it) |

## Editing
All page HTML is generated from `build/build.py` (content + shared header/footer).
Edit content there, then run:

```bash
python3 build/build.py
```

Styles: `assets/css/site.css` · Interactions: `assets/js/site.js` · Logo assets: `assets/img/`.

## Site-wide features
- **TEAM3 Assistant** (bottom-right on every page): guided, rule-based enquiry helper that recommends services and pre-fills the enquiry form. It is not an LLM and stores nothing.
- **Forms** (enquiry, meeting request, careers profile, partner registration) with consent checkbox and spam honeypot.
- SEO: canonical URLs, Open Graph, Organization schema, `sitemap.xml`, `robots.txt`, web manifest.

## Go-live configuration
Edit the `SITE` block at the top of `build/build.py`, then run `python3 build/build.py`:

| Key | Effect |
|---|---|
| `email`, `phone`, `whatsapp` | Shown on the contact page and footer when filled in |
| `form_endpoint` | All forms POST here (e.g. a Formspree/Getform form URL or a CRM webhook) |

Without `form_endpoint`, forms open the visitor's email app addressed to `email`; with neither set, the details are copied to the clipboard.

## Before going live
- Fill in the `SITE` contact details and form endpoint (above).
- Confirm client permissions for the historical clientele list.
- Classify each product initiative (live / prototype / in development) on `work.html`.
- Have the policies on `legal.html` reviewed by your legal advisor.
- Add real photography (founder portrait, work thumbnails, article covers).
