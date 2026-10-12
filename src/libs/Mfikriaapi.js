// Helper API Mfikria: mengurus Access_Token guest (/mfikria/v1/guest-token) supaya
// semua endpoint yang butuh ?query=<Access_Token>&tgl=<tanggal> tinggal dipanggil lewat apiFetch().

const API_BASE = 'https://api-mfikria.vercel.app';
const SESSION_KEY = 'mfikria_guest_session';
// Token guest berlaku 24 jam di server; dipakai ulang maksimal 23 jam supaya tidak kedaluwarsa di tengah jalan.
// Penting: /guest-token dibatasi 10 permintaan per IP per jam, jadi token HARUS dipakai ulang, jangan dibuat tiap request.
const SESSION_MAX_AGE_MS = 23 * 60 * 60 * 1000;

let pending = null; // permintaan token yang sedang berjalan (mencegah dobel di React StrictMode / banyak komponen)

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || !s.token || !s.tanggal || Date.now() - s.savedAt > SESSION_MAX_AGE_MS) return null;
    return s;
  } catch {
    return null;
  }
}

function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // storage penuh / diblokir: abaikan, token tetap dipakai untuk sesi ini
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // abaikan
  }
}

async function requestSession() {
  const res = await fetch(`${API_BASE}/mfikria/v1/guest-token`, { method: 'POST' });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || !body.data || !body.data.Access_Token) {
    throw new Error((body && body.message) || 'Gagal membuat guest token');
  }
  const session = {
    userId: body.data.userId,
    token: body.data.Access_Token,
    tanggal: body.data.tanggal, // format DDMMYY dari server
    savedAt: Date.now(),
  };
  saveSession(session);
  return session;
}

// Ambil token guest yang tersimpan; kalau belum ada / sudah lama, minta yang baru.
export function getGuestSession(forceNew = false) {
  if (!forceNew) {
    const saved = readSession();
    if (saved) return Promise.resolve(saved);
  }
  if (!pending) {
    pending = requestSession().finally(() => {
      pending = null;
    });
  }
  return pending;
}

function withGuest(path, session) {
  const sep = path.includes('?') ? '&' : '?';
  return `${API_BASE}${path}${sep}query=${encodeURIComponent(session.token)}&tgl=${encodeURIComponent(session.tanggal)}`;
}

// fetch ke endpoint API yang butuh guest token. `path` diawali "/", contoh: "/v2/github/dodokjr/repos".
// Kalau server membalas 401 (token kedaluwarsa), token dibuat ulang dan request diulang satu kali.
export async function apiFetch(path, init) {
  let session = await getGuestSession();
  let res = await fetch(withGuest(path, session), init);

  if (res.status === 401) {
    clearSession();
    session = await getGuestSession(true);
    res = await fetch(withGuest(path, session), init);
  }
  return res;
}