import { cookieHeader, json } from './_auth.js';
export const config = { runtime: 'edge' };
export default function handler() { return json({ ok: true }, 200, { 'set-cookie': cookieHeader('', 0) }); }
