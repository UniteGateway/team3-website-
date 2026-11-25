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
| `careers.html` | Talent communities, opportunities, partner network |
| `insights.html` | Knowledge centre |
| `contact.html` | Enquiry form (prototype), project scope estimator, engagement models |
| `legal.html` | Privacy, terms, cookies, responsible AI (draft placeholders) |

## Editing
All page HTML is generated from `build/build.py` (content + shared header/footer).
Edit content there, then run:

```bash
python3 build/build.py
```

Styles: `assets/css/site.css` · Interactions: `assets/js/site.js` · Logo assets: `assets/img/`.

## Before going live
- Confirm company registration, office address, phone and email (only Hyderabad and the domain are shown).
- Confirm client permissions for the historical clientele list.
- Classify each product initiative (live / prototype / in development) on `work.html`.
- Replace the draft legal text and connect the enquiry form to a backend/CRM.
- Add real photography (founder portrait, work thumbnails, article covers).
