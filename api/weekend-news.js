// Free news headlines for Weekend News Studio. Keyless RSS feeds by default; optional GNews key (GNEWS_API_KEY).
// Returns headline, short summary, source and link only — publisher text and photos are copyright: rewrite and credit before printing.
import { requireSession, json } from './_auth.js';
import { loadNews } from './_news.js';
export const config = { runtime: 'edge' };

export default async function handler(request) {
  const denied = await requireSession(request);
  if (denied) return denied;
  const u = new URL(request.url);
  const q = (u.searchParams.get('q') || '').slice(0, 80).trim();
  const { topic, items } = await loadNews(u.searchParams.get('topic'), q);
  return json({ topic, q, count: items.length, items: items.slice(0, 40), note: 'Headlines from public feeds. Rewrite in your own words and credit the source before printing.' }, 200, { 'cache-control': 'private, max-age=300' });
}
