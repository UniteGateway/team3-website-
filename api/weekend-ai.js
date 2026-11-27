// AI page editor for Weekend News Studio.
// GET  -> { enabled } (is ANTHROPIC_API_KEY set on the server)
// POST -> streams NDJSON: {type:"progress",chars} … then {type:"result",data} or {type:"error",error}
// Claude writes ORIGINAL copy for the page's story boxes, using only facts from today's free news feeds,
// and suggests photo search words. Photos are then found by the editor from free-licence sources.
import Anthropic from '@anthropic-ai/sdk';
import { requireSession, json } from './_auth.js';
import { loadNews } from './_news.js';
// Node.js runtime (the Anthropic SDK needs it); Web-standard GET/POST handlers. maxDuration is set in vercel.json.

const MODEL = 'claude-opus-5-5';

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['slots', 'images'],
  properties: {
    slots: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'paragraphs', 'sources'],
        properties: {
          id: { type: 'string' },
          paragraphs: { type: 'array', items: { type: 'string' } },
          sources: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    images: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'query'],
        properties: { id: { type: 'string' }, query: { type: 'string' } },
      },
    },
  },
};

const SYSTEM = `You are the chief sub-editor of "Weekend", a free weekly broadsheet newspaper published in India by TEAM3 Solutions.
You fill one newspaper page at a time. You receive (1) the page's text boxes with their position, kind and size, (2) the page's photo boxes, and (3) today's news items from public feeds.

How to work:
- Group boxes into stories by position: a headline sits above its deck, body boxes and photo, normally in the same column range. The largest headline is the lead story.
- Give each story a different news item; put the most important item in the lead. Prefer items relevant to the page topic and city.
- Write ORIGINAL copy in clear Indian English, neutral and factual. Never copy sentences from the feed; rephrase.
- Use ONLY facts present in the news items. Never invent names, quotes, numbers, dates, places or events. If an item has little detail, write less rather than adding detail.
- Fit the space: keep each body within the given word count (aim for 85-100% of it), each headline within its character limit, decks to one sentence.
- Body boxes: 2-5 short paragraphs. List the source names you used in "sources" (e.g. "BBC News", "The Hindu").
- Briefs boxes: 4-7 items, each paragraph written as "Short title — one or two sentences", each from a different news item.
- Teaser boxes: paragraph 1 = a 3-6 word teaser title; paragraph 2 = "Inside: page N" when known, else omit.
- Captions: one sentence describing the subject of the photo in general terms (the photo is a stock image, not of the event).
- For every photo box give a 2-4 word photo search query for a free photo library: a concrete, photographable subject (place, object, activity), never a person's name.
- Return every text box id you were given exactly once, and every photo box id exactly once.`;

const enc = new TextEncoder();
const line = (o) => enc.encode(JSON.stringify(o) + '\n');

export async function GET(request) {
  const denied = await requireSession(request);
  if (denied) return denied;
  return json({ enabled: !!process.env.ANTHROPIC_API_KEY, model: MODEL });
}

export async function POST(request) {
  const denied = await requireSession(request);
  if (denied) return denied;
  const enabled = !!process.env.ANTHROPIC_API_KEY;
  if (!enabled) return json({ error: 'AI is not set up yet: add ANTHROPIC_API_KEY in Vercel and redeploy.' }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }
  const slots = (body.slots || []).slice(0, 60);
  const images = (body.images || []).slice(0, 30);
  if (!slots.length) return json({ error: 'This page has no story boxes to fill.' }, 400);

  const topic = String(body.topic || 'india');
  const { items } = await loadNews(topic, String(body.q || '').slice(0, 80));
  if (!items.length) return json({ error: 'No news could be loaded right now. Try another topic.' }, 502);

  const news = items.slice(0, 30).map((it, i) => `[${i + 1}] ${it.title}\nSource: ${it.source}${it.published ? ` · ${it.published}` : ''}${it.summary ? `\nSummary: ${it.summary}` : ''}`).join('\n\n');
  const user = `Page: ${String(body.pageName || 'News page').slice(0, 60)} (page ${+body.pageNo || 1})
Edition date: ${String(body.date || '').slice(0, 40)} · City: ${String(body.city || 'Hyderabad').slice(0, 40)} · Topic: ${topic}
${body.instructions ? `Editor's instructions: ${String(body.instructions).slice(0, 500)}\n` : ''}
TEXT BOXES (positions in points on a 972 × 1512 pt page):
${JSON.stringify(slots.map((s) => ({ id: String(s.id), kind: s.kind, x: Math.round(s.x), y: Math.round(s.y), w: Math.round(s.w), h: Math.round(s.h), ...(s.words ? { words: s.words } : {}), ...(s.chars ? { max_chars: s.chars } : {}) })))}

PHOTO BOXES:
${JSON.stringify(images.map((s) => ({ id: String(s.id), x: Math.round(s.x), y: Math.round(s.y), w: Math.round(s.w), h: Math.round(s.h) })))}

TODAY'S NEWS ITEMS:
${news}`;

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY
  const out = new ReadableStream({
    async start(controller) {
      controller.enqueue(line({ type: 'progress', chars: 0, items: items.length }));
      try {
        const stream = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 16000,
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
          output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
          system: SYSTEM,
          messages: [{ role: 'user', content: user }],
        });
        let chars = 0, last = 0;
        stream.on('text', (t) => { chars += t.length; if (chars - last > 400) { last = chars; controller.enqueue(line({ type: 'progress', chars })); } });
        const msg = await stream.finalMessage();
        if (msg.stop_reason === 'refusal') throw new Error('The AI declined this request. Try another topic.');
        if (msg.stop_reason === 'max_tokens') throw new Error('The page was too large for one AI pass. Try fewer boxes.');
        const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
        const data = JSON.parse(text);
        data.feed = items.slice(0, 30).map((it) => ({ title: it.title, source: it.source, link: it.link }));
        controller.enqueue(line({ type: 'result', data }));
      } catch (e) {
        let msg = e instanceof Error ? e.message : 'AI request failed';
        if (e instanceof Anthropic.AuthenticationError) msg = 'The Anthropic API key is not valid.';
        else if (e instanceof Anthropic.RateLimitError) msg = 'AI is busy (rate limit). Wait a minute and try again.';
        else if (e instanceof Anthropic.APIError) msg = `AI service error ${e.status ?? ''}`.trim();
        controller.enqueue(line({ type: 'error', error: msg }));
      }
      controller.close();
    },
  });
  return new Response(out, { headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
}
