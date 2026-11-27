import { verifyPassword, makeSession, cookieHeader, json } from './_auth.js';
export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (new URL(request.url).origin !== request.headers.get('origin')) return json({ error: 'Bad origin' }, 403);
  const email = (process.env.WEEKEND_ADMIN_EMAIL || '').trim().toLowerCase();
  const hash = process.env.WEEKEND_ADMIN_HASH || '';
  if (!email || !hash || !process.env.WEEKEND_SESSION_SECRET) return json({ error: 'Admin sign-in is not set up yet — open /weekend/setup.html.' }, 503);
  let body = {};
  try { body = await request.json(); } catch { /* empty */ }
  const ok = String(body.email || '').trim().toLowerCase() === email && await verifyPassword(String(body.password || ''), hash);
  if (!ok) { await new Promise((r) => setTimeout(r, 700)); return json({ error: 'Incorrect email or password.' }, 401); }
  return json({ ok: true }, 200, { 'set-cookie': cookieHeader(await makeSession(email)) });
}
