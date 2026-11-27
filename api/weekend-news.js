// Free news headlines for Weekend News Studio. Keyless RSS feeds by default; optional GNews key (GNEWS_API_KEY).
// Returns headline, short summary, source and link only — publisher text and photos are copyright: rewrite and credit before printing.
import { requireSession, json } from './_auth.js';
export const config = { runtime: 'edge' };

const GN = (q) => `https://news.google.com/rss/${q}hl=en-IN&gl=IN&ceid=IN:en`;
const FEEDS = {
  india: [GN('headlines/section/geo/India?'), 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml'],
  hyderabad: [GN('search?q=Hyderabad&'), GN('search?q=Telangana&')],
  world: ['https://feeds.bbci.co.uk/news/world/rss.xml', GN('headlines/section/topic/WORLD?')],
  business: ['https://feeds.bbci.co.uk/news/business/rss.xml', GN('headlines/section/topic/BUSINESS?')],
  technology: ['https://feeds.bbci.co.uk/news/technology/rss.xml', GN('headlines/section/topic/TECHNOLOGY?')],
  sport: ['https://feeds.bbci.co.uk/sport/rss.xml', GN('headlines/section/topic/SPORTS?')],
  entertainment: ['https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', GN('headlines/section/topic/ENTERTAINMENT?')],
  science: ['https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', GN('headlines/section/topic/SCIENCE?')],
  health: ['https://feeds.bbci.co.uk/news/health/rss.xml', GN('headlines/section/topic/HEALTH?')],
};

const decode = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#039;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/\s+/g, ' ').trim();
const tag = (x, t) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };

async function rss(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'WeekendNewsStudio/1.0 (+https://team3solutions.vercel.app)' }, signal: AbortSignal.timeout(8000) });
  if (!r.ok) return [];
  const xml = await r.text();
  const feedSource = url.includes('bbc') ? 'BBC News' : 'Google News';
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 25).map(([, it]) => {
    let title = tag(it, 'title'); let source = tag(it, 'source') || feedSource;
    if (feedSource === 'Google News' && title.includes(' - ')) { const i = title.lastIndexOf(' - '); source = title.slice(i + 3); title = title.slice(0, i); }
    let summary = tag(it, 'description');
    if (feedSource === 'Google News') summary = '';
    return { title, summary: summary.slice(0, 400), link: tag(it, 'link'), source, published: tag(it, 'pubDate') };
  }).filter((x) => x.title);
}

async function gnews(topic, q) {
  const key = process.env.GNEWS_API_KEY;
  if (!key) return [];
  const u = q ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&country=in&max=20&apikey=${key}`
    : `https://gnews.io/api/v4/top-headlines?category=${topic === 'india' ? 'nation' : topic}&lang=en&country=in&max=20&apikey=${key}`;
  const r = await fetch(u, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) return [];
  const d = await r.json();
  return (d.articles || []).map((a) => ({ title: a.title, summary: (a.description || '').slice(0, 400), link: a.url, source: a.source?.name || 'GNews', published: a.publishedAt }));
}

export default async function handler(request) {
  const denied = await requireSession(request);
  if (denied) return denied;
  const u = new URL(request.url);
  const topic = FEEDS[u.searchParams.get('topic')] ? u.searchParams.get('topic') : 'india';
  const q = (u.searchParams.get('q') || '').slice(0, 80).trim();
  const urls = q ? [GN(`search?q=${encodeURIComponent(q)}&`)] : FEEDS[topic];
  const lists = await Promise.allSettled([...urls.map(rss), gnews(topic, q)]);
  const seen = new Set(); const items = [];
  for (const l of lists) for (const it of (l.status === 'fulfilled' ? l.value : [])) {
    const k = it.title.toLowerCase().slice(0, 60);
    if (!seen.has(k)) { seen.add(k); items.push(it); }
  }
  return json({ topic, q, count: items.length, items: items.slice(0, 40), note: 'Headlines from public feeds. Rewrite in your own words and credit the source before printing.' }, 200, { 'cache-control': 'private, max-age=300' });
}
