// Simpan di: src/app/components/feedback/feedbackApi.js
// Pemanggilan API: GET daftar (publik) dan POST kirim (butuh guest token).

import { ensureGuestToken } from './Mfikriaapi'; // folder "utilities" (sama dengan halaman video)
import { FEEDBACK_URL, PAGE_SIZE } from './Feedbackconfig';

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