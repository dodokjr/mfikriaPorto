// Simpan di: src/app/components/video/VideoReactions.jsx
// Dipakai di VideoWatch: <VideoReactions key={id} videoId={id} session={session} />

import { useEffect, useRef, useState } from 'react';
import { fetchReactions, sendReaction } from '../../../libs/videoEngagement';

function compact(n) {
  return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(n || 0);
}

function ThumbIcon({ down = false, filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {down ? (
        <>
          <path d="M17 14V2" />
          <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
        </>
      ) : (
        <>
          <path d="M7 10v12" />
          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
        </>
      )}
    </svg>
  );
}

export default function VideoReactions({ videoId, session }) {
  const [state, setState] = useState({ likes: 0, dislikes: 0, myReaction: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    if (!videoId || !session) return undefined;
    let alive = true;
    fetchReactions(videoId, session)
      .then((data) => alive && setState(data))
      .catch((err) => console.error('Reaksi gagal dimuat:', err));
    return () => {
      alive = false;
      clearTimeout(timer.current);
    };
  }, [videoId, session]);

  const react = async (kind) => {
    if (busy || !session) return;
    const prev = state;
    const next = prev.myReaction === kind ? null : kind; // klik lagi = batalkan

    // Update optimistis
    const likes = prev.likes - (prev.myReaction === 'like' ? 1 : 0) + (next === 'like' ? 1 : 0);
    const dislikes = prev.dislikes - (prev.myReaction === 'dislike' ? 1 : 0) + (next === 'dislike' ? 1 : 0);
    setState({ likes, dislikes, myReaction: next });
    setBusy(true);
    setError('');

    try {
      const server = await sendReaction(videoId, next, session);
      if (server && typeof server.likes === 'number') setState(server);
    } catch (err) {
      console.error('Reaksi gagal dikirim:', err);
      setState(prev); // kembalikan
      setError('Gagal menyimpan. Coba lagi.');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setError(''), 3000);
    } finally {
      setBusy(false);
    }
  };

  const base = 'inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition disabled:opacity-60';
  const idle = 'bg-gray-800 text-white hover:bg-gray-700';
  const active = 'bg-cyan-500 text-gray-950 hover:bg-cyan-400';

  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex overflow-hidden rounded-full">
        <button
          type="button"
          onClick={() => react('like')}
          disabled={!session}
          aria-pressed={state.myReaction === 'like'}
          aria-label="Suka"
          className={`${base} ${state.myReaction === 'like' ? active : idle}`}
        >
          <ThumbIcon filled={state.myReaction === 'like'} />
          {compact(state.likes)}
        </button>
        <button
          type="button"
          onClick={() => react('dislike')}
          disabled={!session}
          aria-pressed={state.myReaction === 'dislike'}
          aria-label="Tidak suka"
          className={`${base} border-l border-gray-950/40 ${state.myReaction === 'dislike' ? active : idle}`}
        >
          <ThumbIcon down filled={state.myReaction === 'dislike'} />
          {compact(state.dislikes)}
        </button>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}