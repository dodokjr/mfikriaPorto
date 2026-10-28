// Simpan di: src/app/components/feedback/feedbackApi.js
// Pemanggilan API: GET daftar (publik), POST kirim (butuh guest token), POST balasan (khusus admin).

import { ensureGuestToken } from './Mfikriaapi'; // folder "utilities" (sama dengan halaman video)
import { FEEDBACK_URL, PAGE_SIZE, ADMIN_STORAGE_KEY } from './Feedbackconfig';

export async function fetchList({ page, tipe, signal }) {
  const qs = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (tipe) qs.set('tipe', tipe);
  const res = await fetch(`${FEEDBACK_URL}?${qs.toString()}`, { signal });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.status !== 'success') {
    throw new Error((body && body.message) || `Gagal memuat (${res.status})`);
  }
  return body;
}

// Kirim dengan guest token. Kalau dibalas 401 (token kedaluwarsa), buang token lama lalu coba sekali lagi.
// Mengembalikan { res, body }.
export async function postFeedback(payload, retry = true) {
  const session = await ensureGuestToken();
  const token = session.token || session.Access_Token;
  const tgl = session.tgl || session.tanggal;
  const url = `${FEEDBACK_URL}?query=${encodeURIComponent(token)}&tgl=${encodeURIComponent(tgl)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);

  if (res.status === 401 && retry) {
    try {
      sessionStorage.removeItem('guest_auth'); // kunci penyimpanan token guest
    } catch (e) {
      /* abaikan */
    }
    return postFeedback(payload, false);
  }
  return { res, body };
}

/* ========================= Admin ========================= */

// Ambil sesi admin dari hasil login yang tersimpan di browser.
// Return { username, encryptedQueryToken } kalau profile.role "Admin" dan sedang login, selain itu null.
// Ini hanya untuk menampilkan tombol "Balas". Yang menentukan boleh atau tidak tetap backend
// (token diverifikasi ke sheet user).
export function getAdminSession() {
  for (const storageName of ['localStorage', 'sessionStorage']) {
    try {
      const raw = window[storageName].getItem(ADMIN_STORAGE_KEY);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const data = parsed && parsed.dashboardData ? parsed.dashboardData : parsed;
      const profile = data && data.profile;
      const tokens = data && data.sessionTokens;
      if (
        profile &&
        String(profile.role || '').toLowerCase() === 'admin' &&
        String(profile.statusLogin) === 'true' &&
        tokens &&
        tokens.encryptedQueryToken
      ) {
        return { username: profile.username, encryptedQueryToken: tokens.encryptedQueryToken };
      }
    } catch (e) {
      /* abaikan, coba penyimpanan berikutnya */
    }
  }
  return null;
}

// Balas komentar berdasarkan id-nya: POST /feedback/:id/reply. Tidak butuh guest token.
// Mengembalikan { res, body }.
export async function postReply(parentId, pesan) {
  const admin = getAdminSession();
  if (!admin) {
    return { res: { ok: false, status: 403 }, body: { status: 'error', message: 'Hanya admin yang bisa membalas. Silakan login.' } };
  }

  const res = await fetch(`${FEEDBACK_URL}/${encodeURIComponent(parentId)}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pesan,
      username: admin.username,
      encryptedQueryToken: admin.encryptedQueryToken,
    }),
  });
  const body = await res.json().catch(() => null);
  return { res, body };
}