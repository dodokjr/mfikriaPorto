// Simpan di: src/app/components/utilities/videoEngagement.js
//
// PENTING: sesuaikan API_BASE dan fungsi authHeaders() dengan cara
// guestToken.js kamu memanggil backend (saya tidak melihat isi file itu).

const API_BASE = ''; // contoh: 'https://api.domainmu.com' atau '' kalau satu origin

function authHeaders(session) {
  // Asumsi: session.token berisi guest token. Ganti kalau berbeda.
  return session && session.token ? { Authorization: `Bearer ${session.token}` } : {};
}

async function request(session, path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(session),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = new Error(`Request gagal (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

/* ---------- Like / Dislike ---------- */

// -> { likes: number, dislikes: number, myReaction: 'like' | 'dislike' | null }
export function fetchReactions(videoId, session) {
  return request(session, `/api/video/reactions?id=${encodeURIComponent(videoId)}`);
}

// reaction: 'like' | 'dislike' | null (null = batalkan)
export function sendReaction(videoId, reaction, session) {
  return request(session, '/api/video/reactions', {
    method: 'POST',
    body: JSON.stringify({ id: videoId, reaction }),
  });
}

/* ---------- Komentar ---------- */

// -> { comments: [{ id, author, text, createdAt, mine }], total, nextCursor }
export function fetchComments(videoId, session, cursor) {
  const q = new URLSearchParams({ id: videoId });
  if (cursor) q.set('cursor', cursor);
  return request(session, `/api/video/comments?${q.toString()}`);
}

// -> { id, author, text, createdAt, mine: true }
export function postComment(videoId, text, session) {
  return request(session, '/api/video/comments', {
    method: 'POST',
    body: JSON.stringify({ id: videoId, text }),
  });
}

export function removeComment(commentId, session) {
  return request(session, `/api/video/comments/${encodeURIComponent(commentId)}`, {
    method: 'DELETE',
  });
}