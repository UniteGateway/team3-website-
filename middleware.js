// Protect the Weekend News Studio app pages: only signed-in admins can load /weekend/app/*.
import { readSession } from './api/_auth.js';
export const config = { matcher: ['/weekend/app/:path*'] };

export default async function middleware(request) {
  if (await readSession(request)) return undefined; // continue to the page
  const login = new URL('/weekend/', request.url);
  const u = new URL(request.url);
  login.searchParams.set('next', u.pathname + u.search);
  return Response.redirect(login, 302);
}
