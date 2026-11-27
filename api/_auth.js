// Shared helpers for Weekend News Studio (Vercel Edge runtime, Web Crypto only).
// Env: WEEKEND_ADMIN_EMAIL, WEEKEND_ADMIN_HASH ("pbkdf2$<iter>$<saltB64>$<hashB64>"), WEEKEND_SESSION_SECRET (32+ chars).
const enc = new TextEncoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const b64url = (s) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (s) => atob(s.replace(/-/g, '+').replace(/_/g, '/'));
export const COOKIE = 'wk_session';
const MAX_AGE = 12 * 3600;

function eq(a, b) { // constant-time string compare
  if (a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function hmac(data) {
  const secret = process.env.WEEKEND_SESSION_SECRET || '';
  if (secret.length < 32) throw new Error('WEEKEND_SESSION_SECRET missing');
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)))));
}

export async function verifyPassword(password, stored) {
  const [alg, iter, salt, hash] = (stored || '').split('$');
  if (alg !== 'pbkdf2' || !hash) return false;
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: Uint8Array.from(atob(salt), (c) => c.charCodeAt(0)), iterations: +iter }, key, 256);
  return eq(b64(bits), hash);
}

export async function makeSession(email) {
  const payload = b64url(JSON.stringify({ e: email, x: Math.floor(Date.now() / 1000) + MAX_AGE }));
  return `${payload}.${await hmac(payload)}`;
}

export function cookieHeader(value, maxAge = MAX_AGE) {
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export async function readSession(request) {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [payload, sig] = m[1].split('.');
  if (!payload || !sig) return null;
  try {
    if (!eq(await hmac(payload), sig)) return null;
    const data = JSON.parse(unb64url(payload));
    return data.x > Date.now() / 1000 ? data : null;
  } catch { return null; }
}

export const json = (obj, status = 200, headers = {}) => new Response(JSON.stringify(obj), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...headers },
});

export async function requireSession(request) {
  return (await readSession(request)) ? null : json({ error: 'Please sign in.' }, 401);
}
