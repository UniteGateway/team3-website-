// Creates WEEKEND_ADMIN_HASH and WEEKEND_SESSION_SECRET in the browser (PBKDF2-SHA256, same format as api/_auth.js).
const f = document.getElementById('f'), err = document.getElementById('err');
const b64 = (u8) => btoa(String.fromCharCode(...u8));
f.addEventListener('submit', async (e) => {
  e.preventDefault(); err.textContent = '';
  const p = f.p1.value;
  if (p.length < 12 || p !== f.p2.value) { err.textContent = 'Passwords must match and be at least 12 characters.'; return; }
  const salt = crypto.getRandomValues(new Uint8Array(16)), iter = 210000;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(p), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, key, 256));
  document.getElementById('o2').value = `pbkdf2$${iter}$${b64(salt)}$${b64(bits)}`;
  document.getElementById('o3').value = b64(crypto.getRandomValues(new Uint8Array(36))).replace(/[+/=]/g, '');
  document.getElementById('out').hidden = false; f.p1.value = ''; f.p2.value = '';
});
document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  const i = document.getElementById(b.dataset.copy);
  try { await navigator.clipboard.writeText(i.value); } catch { i.select(); document.execCommand('copy'); }
  b.textContent = 'Copied ✓'; setTimeout(() => { b.textContent = 'Copy'; }, 1800);
}));
