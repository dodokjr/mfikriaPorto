// Simpan di: src/utils/guestToken.js (sesuaikan path import di App.jsx)

const API_ORIGIN = 'https://api-mfikria.vercel.app';
const API_BASE = `${API_ORIGIN}`;
const STORAGE_KEY = 'guest_session_mfikria';
// Token backend berlaku 24 jam (GUEST_TOKEN_TTL_MS), minta ulang sedikit lebih awal
const MAX_AGE_MS = 23 * 60 * 60 * 1000;

// Baca sesi guest dari sessionStorage. null jika belum ada / sudah terlalu lama.
export function getGuestSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || !s.Access_Token || !s.tanggal) return null;
    if (Date.now() - s.savedAt > MAX_AGE_MS) return null;
    return s;
  } catch (error) {
    return null;
  }
}

// Minta guest token ke backend (tanpa login). Dipanggil berkali-kali pun hanya 1 request:
// kalau sudah ada, pakai yang tersimpan; kalau sedang berjalan, tunggu request yang sama.
let inflight = null;
export function ensureGuestToken() {
  const existing = getGuestSession();
  if (existing) return Promise.resolve(existing);
  if (inflight) return inflight;

  inflight = fetch(`${API_BASE}/mfikria/v1/guest-token`, { method: 'POST' })
    .then((res) => {
      if (!res.ok) throw new Error(`guest-token gagal (${res.status})`);
      return res.json();
    })
    .then((body) => {
      const d = body.data;
      // Struktur dari backend: { userId, Access_Token, pukul, tanggal }
      const session = {
        userId: d.userId,
        Access_Token: d.Access_Token,
        pukul: d.pukul,
        tanggal: d.tanggal,
        savedAt: Date.now(),
      };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch (error) {
        // storage penuh / diblokir: token tetap dipakai untuk sesi halaman ini
      }
      return session;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

// Query string untuk endpoint video: query=<Access_Token>&tgl=<tanggal>
export function guestQuery(session) {
  return `query=${encodeURIComponent(session.Access_Token)}&tgl=${encodeURIComponent(session.tanggal)}`;
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