import { readSession, json } from './_auth.js';
export const config = { runtime: 'edge' };
export default async function handler(request) {
  const s = await readSession(request);
  return s ? json({ email: s.e }) : json({ error: 'Please sign in.' }, 401);
}
