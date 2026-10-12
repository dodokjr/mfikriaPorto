// Simpan di: src/app/components/video/VideoComments.jsx
// Dipakai di VideoWatch: <VideoComments key={id} videoId={id} session={session} />

import { useCallback, useEffect, useState } from 'react';
import { fetchComments, postComment, removeComment } from '../../../libs/videoEngagement'

const MAX_LENGTH = 500;

function timeAgo(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const sec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (sec < 60) return 'baru saja';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} hari lalu`;
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

function Avatar({ name }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-cyan-400">
      {initial}
    </div>
  );
}

function CommentItem({ comment, onDelete, deleting }) {
  return (
    <li className="flex gap-3">
      <Avatar name={comment.author} />
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-semibold text-gray-100">{comment.author}</span>
          <span className="ml-2 text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
        </p>
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-200">
          {comment.text}
        </p>
        {comment.mine && (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            disabled={deleting}
            className="mt-1 text-xs text-gray-500 transition hover:text-red-400 disabled:opacity-50"
          >
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        )}
      </div>
    </li>
  );
}

export default function VideoComments({ videoId, session }) {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [loadingMore, setLoadingMore] = useState(false);

  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(() => {
    if (!videoId || !session) return undefined;
    let alive = true;
    setStatus('loading');
    fetchComments(videoId, session)
      .then((data) => {
        if (!alive) return;
        setComments(data.comments || []);
        setTotal(data.total ?? (data.comments || []).length);
        setCursor(data.nextCursor || null);
        setStatus('ready');
      })
      .catch((error) => {
        console.error('Komentar gagal dimuat:', error);
        if (alive) setStatus('error');
      });
    return () => {
      alive = false;
    };
  }, [videoId, session]);

  useEffect(() => load(), [load]);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchComments(videoId, session, cursor);
      setComments((prev) => [...prev, ...(data.comments || [])]);
      setCursor(data.nextCursor || null);
    } catch (error) {
      console.error('Komentar berikutnya gagal dimuat:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= MAX_LENGTH && !sending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    setSending(true);
    setSendError('');
    try {
      const created = await postComment(videoId, trimmed, session);
      setComments((prev) => [{ ...created, mine: true }, ...prev]);
      setTotal((n) => n + 1);
      setText('');
      setFocused(false);
    } catch (error) {
      console.error('Komentar gagal dikirim:', error);
      setSendError(
        error.status === 429
          ? 'Terlalu cepat. Tunggu sebentar sebelum berkomentar lagi.'
          : 'Komentar gagal dikirim. Coba lagi.'
      );
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId) => {
    setDeletingId(commentId);
    try {
      await removeComment(commentId, session);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setTotal((n) => Math.max(0, n - 1));
    } catch (error) {
      console.error('Komentar gagal dihapus:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-6" aria-label="Komentar">
      <h2 className="text-base font-bold">
        {total.toLocaleString('id-ID')} komentar
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <Avatar name="Saya" />
        <div className="min-w-0 flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            rows={focused || text ? 3 : 1}
            maxLength={MAX_LENGTH}
            placeholder="Tulis komentar..."
            disabled={!session}
            className="w-full resize-none border-0 border-b border-gray-700 bg-transparent px-0 py-2 text-sm text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-cyan-500 disabled:opacity-50"
          />
          {sendError && <p className="mt-1 text-xs text-red-400">{sendError}</p>}
          {(focused || text) && (
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                {text.length}/{MAX_LENGTH}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setText('');
                    setFocused(false);
                    setSendError('');
                  }}
                  className="rounded-full px-4 py-1.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!canSend}
                  className="rounded-full bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-gray-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
                >
                  {sending ? 'Mengirim...' : 'Kirim'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      <div className="mt-6">
        {status === 'loading' && (
          <ul className="space-y-5">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-gray-900" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/4 animate-pulse rounded bg-gray-900" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-gray-900" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {status === 'error' && (
          <div className="text-sm text-gray-400">
            Komentar gagal dimuat.{' '}
            <button type="button" onClick={load} className="font-semibold text-cyan-400 hover:underline">
              Coba lagi
            </button>
          </div>
        )}

        {status === 'ready' && comments.length === 0 && (
          <p className="text-sm text-gray-500">Belum ada komentar. Jadilah yang pertama.</p>
        )}

        {status === 'ready' && comments.length > 0 && (
          <>
            <ul className="space-y-5">
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  onDelete={handleDelete}
                  deleting={deletingId === c.id}
                />
              ))}
            </ul>
            {cursor && (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="mt-5 rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50"
              >
                {loadingMore ? 'Memuat...' : 'Tampilkan lebih banyak'}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}