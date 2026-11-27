// Shared free-news helpers (keyless RSS + optional GNews) used by weekend-news and weekend-ai.
export const GN = (q) => `https://news.google.com/rss/${q}hl=en-IN&gl=IN&ceid=IN:en`;
export const FEEDS = {
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

export async function rss(url) {
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

export async function gnews(topic, q) {
  const key = process.env.GNEWS_API_KEY;
  if (!key) return [];
  const u = q ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&country=in&max=20&apikey=${key}`
    : `https://gnews.io/api/v4/top-headlines?category=${topic === 'india' ? 'nation' : topic}&lang=en&country=in&max=20&apikey=${key}`;
  const r = await fetch(u, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) return [];
  const d = await r.json();
  return (d.articles || []).map((a) => ({ title: a.title, summary: (a.description || '').slice(0, 400), link: a.url, source: a.source?.name || 'GNews', published: a.publishedAt }));
}


export async function loadNews(topic, q = '') {
  topic = FEEDS[topic] ? topic : 'india';
  const urls = q ? [GN(`search?q=${encodeURIComponent(q)}&`)] : FEEDS[topic];
  const lists = await Promise.allSettled([...urls.map(rss), gnews(topic, q)]);
  const seen = new Set(); const items = [];
  for (const l of lists) for (const it of (l.status === 'fulfilled' ? l.value : [])) {
    const k = it.title.toLowerCase().slice(0, 60);
    if (!seen.has(k)) { seen.add(k); items.push(it); }
  }
  return { topic, items };
}
