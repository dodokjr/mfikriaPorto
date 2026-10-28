const API_ORIGIN = 'https://api-mfikria.vercel.app';
const API_BASE = `${API_ORIGIN}`;
const STORAGE_KEY = 'guest_session_mfikria';
const MAX_AGE_MS = 23 * 60 * 60 * 1000; // dipakai kalau data tersimpan tidak punya expiresAt
const EXPIRY_SKEW_MS = 60 * 1000; // dianggap kedaluwarsa 1 menit lebih awal
const VERIFY_CACHE_MS = 5 * 60 * 1000;

// Token dicari di sessionStorage DAN localStorage, dengan salah satu key ini.
// Kalau ada dan belum kedaluwarsa -> dipakai (tidak membuat token baru). Kalau sudah -> dibuat baru.
const SOURCE_KEYS = [STORAGE_KEY, 'guest_auth'];

// Harus sama dengan ALLOWED_SCOPES di guestTokenParamsController.js (backend).
// = segmen pertama route di main.jsx. /auth/ff (admin) tidak ikut: bukan halaman guest.
export const GUEST_SCOPES = ['app', 'project', 'blog', 'contact', 'hobbies', 'me', 'store', 'video', 'jasa'];

// /blog/abc -> 'blog'; /auth/ff atau halaman lain -> '' (tidak dilacak)
export function scopeFromPath(pathname = '') {
  const first = String(pathname).split('/').filter(Boolean)[0];
  const sc = first ? first.toLowerCase() : '';
  return GUEST_SCOPES.includes(sc) ? sc : '';
}

/* ========================= Baca token tersimpan ========================= */

function getStores() {
  const list = [];
  try { list.push(window.sessionStorage); } catch (error) { /* diblokir */ }
  try { list.push(window.localStorage); } catch (error) { /* diblokir */ }
  return list;
}

// angka < 1e12 dianggap detik (gaya "exp"), selain itu milidetik; string ISO juga boleh
function toMs(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isFinite(n)) return n < 1e12 ? n * 1000 : n;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? null : t;
}

// Ubah isi storage (format guest_session_mfikria maupun guest_auth) ke satu bentuk baku.
// Wajib punya token dan tanggal (dipakai sebagai ?query=&tgl=).
function normalize(raw) {
  let obj = null;
  try {
    obj = JSON.parse(raw);
  } catch (error) {
    return null;
  }
  if (!obj || typeof obj !== 'object') return null;
  const token = obj.Access_Token || obj.accessToken || obj.token;
  const tanggal = obj.tanggal || obj.tgl;
  if (!token || !tanggal) return null;
  return {
    userId: obj.userId,
    Access_Token: token,
    pukul: obj.pukul,
    tanggal,
    expiresAt: toMs(obj.expiresAt !== undefined ? obj.expiresAt : obj.exp),
    savedAt: toMs(obj.savedAt),
  };
}

// 'valid' | 'expired' | 'unknown' (tidak ada info masa berlaku -> tanya backend)
function freshness(s) {
  const now = Date.now();
  if (s.expiresAt) return now < s.expiresAt - EXPIRY_SKEW_MS ? 'valid' : 'expired';
  if (s.savedAt) return now - s.savedAt < MAX_AGE_MS ? 'valid' : 'expired';
  return 'unknown';
}

function readCandidates() {
  const out = [];
  for (const store of getStores()) {
    for (const key of SOURCE_KEYS) {
      let raw = null;
      try {
        raw = store.getItem(key);
      } catch (error) {
        continue;
      }
      if (!raw) continue;
      const session = normalize(raw);
      if (session) out.push({ store, key, session, state: freshness(session) });
    }
  }
  return out;
}

function removeEntries(list) {
  for (const c of list) {
    try {
      c.store.removeItem(c.key);
    } catch (error) {
      /* abaikan */
    }
  }
}

// Salin token yang dipertahankan ke sessionStorage[guest_session_mfikria] supaya bagian lain
// aplikasi (apiFetch, dll.) membaca dari satu tempat. Sumber aslinya tidak dihapus.
function adopt(session) {
  try {
    const current = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = current ? normalize(current) : null;
    if (parsed && parsed.Access_Token === session.Access_Token && parsed.tanggal === session.tanggal) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    // storage penuh / diblokir: token tetap dipakai untuk sesi halaman ini
  }
}

// Hapus SEMUA token tersimpan (dipanggil saat backend menolak token dengan 401)
export function clearGuestSession() {
  const all = [];
  for (const store of getStores()) for (const key of SOURCE_KEYS) all.push({ store, key });
  removeEntries(all);
}

// Sinkron: token tersimpan yang belum kedaluwarsa (atau null). Tidak membuat token baru.
export function getGuestSession() {
  const cands = readCandidates();
  const found = cands.find((c) => c.state === 'valid') || cands.find((c) => c.state === 'unknown');
  if (!found) return null;
  adopt(found.session);
  return found.session;
}

/* ========================= Tanya backend ========================= */

const verified = new Map(); // token -> waktu terakhir dinyatakan valid backend

async function isServerValid(session) {
  const last = verified.get(session.Access_Token);
  if (last && Date.now() - last < VERIFY_CACHE_MS) return true;
  try {
    const qs = new URLSearchParams({ query: session.Access_Token, tgl: session.tanggal });
    const res = await fetch(`${API_BASE}/mfikria/v1/guest-token/status?${qs}`, { cache: 'no-store' });
    if (!res.ok) return true; // backend bermasalah: pertahankan token, jangan buat token berlebihan
    const body = await res.json();
    const ok = Boolean(body && body.data && body.data.valid);
    if (ok) verified.set(session.Access_Token, Date.now());
    return ok;
  } catch (error) {
    return true; // offline: pertahankan token
  }
}

function issueNewToken() {
  return fetch(`${API_BASE}/mfikria/v1/guest-token`, { method: 'POST' })
    .then((res) => {
      if (!res.ok) throw new Error(`guest-token gagal (${res.status})`);
      return res.json();
    })
    .then((body) => {
      const d = body.data;
      // Struktur dari backend: { userId, Access_Token, pukul, tanggal, expiresAt }
      const session = {
        userId: d.userId,
        Access_Token: d.Access_Token,
        pukul: d.pukul,
        tanggal: d.tanggal,
        expiresAt: toMs(d.expiresAt),
        savedAt: Date.now(),
      };
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch (error) {
        // storage penuh / diblokir: token tetap dipakai untuk sesi halaman ini
      }
      return session;
    });
}

/* ========================= Pastikan ada token ========================= */
// 1) Cari di sessionStorage & localStorage (guest_session_mfikria, guest_auth).
// 2) Belum kedaluwarsa -> pertahankan (tidak membuat token baru).
//    Tanpa info masa berlaku -> tanya backend (/guest-token/status).
// 3) Sudah kedaluwarsa / ditolak backend / tidak ada -> hapus yang lama, buat baru lewat POST /guest-token.

let inflight = null;
export function ensureGuestToken() {
  if (inflight) return inflight;

  inflight = (async () => {
    const cands = readCandidates();

    let keep = cands.find((c) => c.state === 'valid') || null;
    if (!keep) {
      const unknown = cands.find((c) => c.state === 'unknown');
      if (unknown && (await isServerValid(unknown.session))) keep = unknown;
    }
    if (keep) {
      adopt(keep.session);
      return keep.session;
    }

    removeEntries(cands); // yang tersisa hanya yang kedaluwarsa / ditolak backend
    return issueNewToken();
  })().finally(() => {
    inflight = null;
  });

  return inflight;
}

// Query string untuk endpoint video: query=<Access_Token>&tgl=<tanggal>
export function guestQuery(session) {
  return `query=${encodeURIComponent(session.Access_Token)}&tgl=${encodeURIComponent(session.tanggal)}`;
}

// Catat halaman yang dibuka guest (token & userId SAMA dengan ensureGuestToken).
// POST /guest-token/:scope. Kalau token ditolak (401), semua token tersimpan dibuang, dibuat ulang, lalu dicoba sekali lagi.
// Tidak pernah melempar error: pelacakan gagal tidak boleh mengganggu halaman.
export async function trackGuestPage(pathname) {
  const scope = scopeFromPath(pathname);
  if (!scope) return null;

  const send = (session) =>
    fetch(`${API_BASE}/mfikria/v1/guest-token/p/${scope}?${guestQuery(session)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname }), // userId dibaca server dari token
    });

  try {
    let session = await ensureGuestToken();
    let res = await send(session);
    if (res.status === 401) {
      clearGuestSession();
      session = await ensureGuestToken();
      res = await send(session);
    }
    return res.ok ? true : null;
  } catch (error) {
    console.error('track page:', error.message);
    return null;
  }
}

// Ambil library video. Setiap item: { title, mimeType, size, videoToken, videoUrl, expiresAt }
// videoUrl sudah lengkap dengan origin + query/tgl, jadi bisa langsung dipakai di <video src>.
export async function fetchVideoLibrary() {
  const session = await ensureGuestToken();
  const res = await fetch(`${API_BASE}/mfikria/v1/videos?${guestQuery(session)}`);
  if (!res.ok) throw new Error(`videos gagal (${res.status})`);
  const body = await res.json();
  return (body.data || []).map((v) => ({
    ...v,
    videoUrl: v.videoUrl.startsWith('http') ? v.videoUrl : `${API_ORIGIN}${v.videoUrl}`,
  }));
}

// Info satu video (judul, ukuran) dari token-nya, untuk halaman /video/watch?id={videoToken}
export async function fetchVideoInfo(id) {
  const session = await ensureGuestToken();
  const res = await fetch(`${API_BASE}/mfikria/v1/video-info/${encodeURIComponent(id)}?${guestQuery(session)}`);
  if (!res.ok) throw new Error(`video-info gagal (${res.status})`);
  const body = await res.json();
  return body.data;
}

// URL stream video untuk <video src>, dibentuk langsung dari token di URL halaman
export function videoStreamUrl(id, session) {
  return `${API_BASE}/mfikria/v1/video/${encodeURIComponent(id)}?${guestQuery(session)}`;
}