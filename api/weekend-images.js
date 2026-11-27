// Free-licence photo search for Weekend News Studio via Openverse (no key). Only licences that allow commercial use.
import { requireSession, json } from './_auth.js';
export const config = { runtime: 'edge' };

export default async function handler(request) {
  const denied = await requireSession(request);
  if (denied) return denied;
  const q = (new URL(request.url).searchParams.get('q') || '').replace(/[^\p{L}\p{N}\s-]/gu, ' ').trim().slice(0, 80);
  if (!q) return json({ items: [] });
  const api = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&page_size=24&mature=false`;
  const r = await fetch(api, { headers: { 'user-agent': 'WeekendNewsStudio/1.0' }, signal: AbortSignal.timeout(9000) }).catch(() => null);
  if (!r || !r.ok) return json({ items: [], error: 'Image search is unavailable right now — upload a photo instead.' }, 200);
  const d = await r.json();
  const items = (d.results || []).filter((x) => x.url && /^https:/.test(x.url)).map((x) => ({
    url: x.url, thumb: x.thumbnail || x.url, title: x.title || q, creator: x.creator || 'Unknown', license: `${(x.license || '').toUpperCase()} ${x.license_version || ''}`.trim(),
    license_url: x.license_url, source_url: x.foreign_landing_url, provider: x.provider, width: x.width, height: x.height,
  }));
  return json({ q, items }, 200, { 'cache-control': 'private, max-age=600' });
}
