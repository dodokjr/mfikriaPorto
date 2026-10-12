// libs/Mfikriaapi.js
// Klien API dengan guest token 24 jam.
// Alur: sessionStorage -> cek ke backend (/guest-token/status) -> kalau tidak valid / expired, buat token baru.
//
// Alamat di backend (lihat app.js):
//   token  : {ORIGIN}/mfikria/v1/guest-token  dan  /guest-token/status
//   github : {ORIGIN}/v2/github/...           (apiFetch('/v2/github/dodokjr/repos'))
//   home   : {ORIGIN}/v1/home

const STORAGE_KEY = 'guest_auth'; // { token, tgl, expiresAt, checkedAt }
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // sama dengan backend
const RENEW_BEFORE_MS = 5 * 60 * 1000; // perbarui token kalau sisa waktunya kurang dari 5 menit
const RECHECK_MS = 60 * 1000; // tanya backend paling cepat sekali per menit (bukan di setiap request)

// Origin API saja (tanpa path). Atur lewat .env: VITE_API_ORIGIN=https://api-mfikria.vercel.app
export const API_ORIGIN = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_ORIGIN) ||
  'https://api-mfikria.vercel.app'
).replace(/\/+$/, '');

// Tempat router token di-mount di backend (app.use('/mfikria/v1', authRoutes))
const TOKEN_BASE = `${API_ORIGIN}${(
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TOKEN_PATH) ||
  '/mfikria/v1'
).replace(/\/+$/, '')}`;

/* ========================= Penyimpanan (sessionStorage + cadangan memori) ========================= */

let memoryAuth = null; // dipakai kalau sessionStorage tidak tersedia / diblokir

function loadSaved() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && saved.token && saved.tgl) return saved;
  } catch (e) {
    /* jatuh ke memori */
  }
  return memoryAuth && memoryAuth.token && memoryAuth.tgl ? memoryAuth : null;
}

function save(auth) {
  memoryAuth = auth;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  } catch (e) {
    /* sessionStorage tidak tersedia, token hidup di memori saja */
  }
}

function clearSaved() {
  memoryAuth = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    /* abaikan */
  }
}

/* ========================= Token ========================= */

function withAuth(url, auth) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}query=${encodeURIComponent(auth.token)}&tgl=${encodeURIComponent(auth.tgl)}`;
}

// Tanya backend: token ini masih bisa dipakai atau tidak?
// state: 'valid' | 'invalid' | 'unknown' (server/jaringan bermasalah -> jangan buang token yang mungkin masih sah)
async function checkWithBackend(auth) {
  try {
    const res = await fetch(withAuth(`${TOKEN_BASE}/guest-token/status`, auth), { cache: 'no-store' });
    if (res.status >= 500) return { state: 'unknown' };
    if (!res.ok) return { state: 'invalid' };
    const body = await res.json().catch(() => null);
    const d = body && body.data;
    if (!d || !d.valid) return { state: 'invalid' };
    return { state: 'valid', remainingMs: Number(d.remainingMs) || 0 };
  } catch (e) {
    return { state: 'unknown' };
  }
}

async function requestNewToken(method) {
  const res = await fetch(`${TOKEN_BASE}/guest-token`, { method, cache: 'no-store' });
  const body = await res.json().catch(() => null);
  return { res, body };
}

// Buat token baru lewat POST /mfikria/v1/guest-token
async function createNewGuestToken() {
  let { res, body } = await requestNewToken('POST');
  // kalau route-nya ternyata GET, coba sekali dengan GET
  if (res.status === 404 || res.status === 405) ({ res, body } = await requestNewToken('GET'));

  if (!res.ok || !body) throw new Error((body && body.message) || `Gagal membuat guest token (${res.status})`);

  const d = body.data || body;
  const token = d.token || d.Access_Token || d.access_token;
  const tgl = d.tgl || d.tanggal || d.tgllogin;
  if (!token || !tgl) throw new Error('Respons /guest-token tidak berisi token dan tanggal');

  const now = Date.now();
  const auth = {
    token,
    tgl: String(tgl),
    expiresAt: Number(d.expiresAt) || now + TOKEN_TTL_MS,
    checkedAt: now,
  };
  save(auth);
  return auth;
}

// Cegah banyak request paralel membuat banyak token sekaligus
let pending = null;

export function ensureGuestToken() {
  if (pending) return pending;

  pending = (async () => {
    const saved = loadSaved();

    if (saved) {
      const now = Date.now();

      // baru dicek dan masih jauh dari kedaluwarsa -> pakai langsung, tanpa request tambahan
      if (saved.checkedAt && saved.expiresAt && now - saved.checkedAt < RECHECK_MS && saved.expiresAt - now > RENEW_BEFORE_MS) {
        return saved;
      }

      const status = await checkWithBackend(saved);

      if (status.state === 'valid' && status.remainingMs > RENEW_BEFORE_MS) {
        const updated = { ...saved, expiresAt: now + status.remainingMs, checkedAt: now };
        save(updated);
        return updated;
      }

      // server tidak bisa dihubungi: jangan buang token, biarkan request berikutnya yang menentukan
      if (status.state === 'unknown') return saved;

      // invalid / expired / sisa waktu hampir habis -> buat baru
      try {
        return await createNewGuestToken();
      } catch (err) {
        // token lama masih sah beberapa menit lagi? pakai dulu daripada gagal total
        if (status.state === 'valid' && status.remainingMs > 0) return saved;
        throw err;
      }
    }

    return createNewGuestToken();
  })().finally(() => {
    pending = null;
  });

  return pending;
}

/* ========================= apiFetch ========================= */
// Pakai seperti fetch biasa: apiFetch('/v2/github/dodokjr/repos')
// - path relatif ditambah API_ORIGIN
// - ?query=&tgl= ditempel otomatis (tidak memicu preflight CORS)
// - kalau dibalas 401 (expired / invalid), buat token baru lalu ulangi 1x

export async function apiFetch(path, options = {}, retry = true) {
  const url = /^https?:\/\//i.test(path) ? path : `${API_ORIGIN}${path}`;
  const auth = await ensureGuestToken();
  const res = await fetch(withAuth(url, auth), options);

  if (res.status === 401 && retry) {
    // hanya buang token kalau itu masih token yang sama (request lain mungkin sudah memperbaruinya)
    const current = loadSaved();
    if (current && current.token === auth.token) clearSaved();
    return apiFetch(path, options, false);
  }
  return res;
}

// Untuk <video src> / <iframe src>: URL lengkap dengan token. Contoh: guestUrl('/mfikria/v1/video/<token>')
export async function guestUrl(path) {
  const url = /^https?:\/\//i.test(path) ? path : `${API_ORIGIN}${path}`;
  const auth = await ensureGuestToken();
  return withAuth(url, auth);
}