// Free-licence photo search for Weekend News Studio (no keys).
// 1) Openverse — only licences that allow commercial use. 2) Fallback: Wikimedia Commons (all files are freely licensed).
import { requireSession, json } from './_auth.js';
export const config = { runtime: 'edge' };

const UA = 'WeekendNewsStudio/1.0 (https://team3solutions.vercel.app/weekend/; newspaper layout tool)';
const strip = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim();

async function openverse(q) {
  const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&page_size=24&mature=false`,
    { headers: { 'user-agent': UA, accept: 'application/json' }, signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!r || !r.ok) return [];
  const d = await r.json().catch(() => ({}));
  return (d.results || []).filter((x) => x.url && /^https:/.test(x.url)).map((x) => ({
    url: x.url, thumb: x.thumbnail || x.url, title: x.title || q, creator: x.creator || 'Unknown', license: `${(x.license || '').toUpperCase()} ${x.license_version || ''}`.trim(),
    license_url: x.license_url, source_url: x.foreign_landing_url, provider: x.provider || 'Openverse', width: x.width, height: x.height,
  }));
}

async function commons(q) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=30'
    + `&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|size|extmetadata|mime&iiurlwidth=1600`;
  const r = await fetch(u, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(9000) }).catch(() => null);
  if (!r || !r.ok) return [];
  const d = await r.json().catch(() => ({}));
  return Object.values(d.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0)).map((p) => {
    const ii = (p.imageinfo || [])[0] || {}; const m = ii.extmetadata || {};
    if (!/image\/(jpeg|png|webp)/.test(ii.mime || '') || (ii.width || 0) < 800) return null;
    const lic = strip(m.LicenseShortName?.value) || 'Free licence';
    if (/non-?commercial|\bNC\b/i.test(lic)) return null;
    return { url: ii.thumburl || ii.url, thumb: (ii.thumburl || ii.url).replace(/\/\d+px-/, '/500px-'), title: strip(m.ObjectName?.value) || p.title.replace(/^File:/, ''),
      creator: strip(m.Artist?.value).slice(0, 80) || 'Wikimedia Commons contributor', license: lic, license_url: m.LicenseUrl?.value, source_url: ii.descriptionurl,
      provider: 'Wikimedia Commons', width: ii.thumbwidth || ii.width, height: ii.thumbheight || ii.height };
  }).filter(Boolean);
}

export default async function handler(request) {
  const denied = await requireSession(request);
  if (denied) return denied;
  const q = (new URL(request.url).searchParams.get('q') || '').replace(/[^\p{L}\p{N}\s-]/gu, ' ').trim().slice(0, 80);
  if (!q) return json({ items: [] });
  let items = await openverse(q);
  if (items.length < 6) items = items.concat(await commons(q));
  if (!items.length) return json({ q, items: [], error: 'No free-licence photos found — try other words or upload a photo.' });
  return json({ q, items: items.slice(0, 30) }, 200, { 'cache-control': 'private, max-age=600' });
}
