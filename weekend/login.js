const f = document.getElementById('f'), err = document.getElementById('err');
const next = new URLSearchParams(location.search).get('next');
const dest = next && /^\/weekend\/app\//.test(next) ? next : '/weekend/app/';
fetch('/api/weekend-me', { credentials: 'same-origin' }).then((r) => { if (r.ok) location.replace(dest); }).catch(() => {});
f.addEventListener('submit', async (e) => {
  e.preventDefault(); err.textContent = ''; const b = f.querySelector('button'); b.disabled = true; b.textContent = 'Signing in…';
  try {
    const r = await fetch('/api/weekend-login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: f.email.value, password: f.password.value }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok) location.replace(dest); else err.textContent = d.error || 'Sign-in failed.';
  } catch { err.textContent = 'Network error — try again.'; }
  b.disabled = false; b.textContent = 'Sign in';
});
