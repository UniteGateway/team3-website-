# Weekend News Studio

Admin-only module for designing the **Weekend** newspaper at full broadsheet size (13.5 × 21 in = 972 × 1512 pt) and printing it to PDF.

- `/weekend/` admin sign-in · `/weekend/app/` dashboard (templates, editions) · `/weekend/app/editor.html` page editor
- `/weekend/setup.html` creates the password hash in the browser
- `middleware.js` blocks `/weekend/app/*` unless signed in; `api/weekend-*.js` are Vercel Edge functions

## Set up sign-in (once)
1. Open `/weekend/setup.html`, choose a password (12+ characters), copy the codes.
2. Vercel → Project → Settings → Environment Variables (Production): `WEEKEND_ADMIN_EMAIL`, `WEEKEND_ADMIN_HASH`, `WEEKEND_SESSION_SECRET`.
3. Redeploy. Optional: `GNEWS_API_KEY` (free tier at gnews.io) adds more headlines.

## Editor
Drag blocks to move, handles to resize (Shift keeps photo shape), double-click text to type, Esc to finish.
Insert headlines, stories (1–6 columns), photos, ad slots, captions, boxes and lines. Snap to margins and other blocks; Grid toggles a 3 pt grid.
News tab: free headlines (BBC, Google News RSS) — rewrite in your own words and credit sources.
Images tab / ✨ Auto images: free-licence photos from Openverse (commercial use allowed) with credits; or upload / drag files in.
Print / PDF: browser print → Save as PDF; the page size is set to 13.5 × 21 in automatically (margins none, background graphics on).

Editions are saved in the browser (IndexedDB). Use Export/Import (.json) to back up or move them between computers.
