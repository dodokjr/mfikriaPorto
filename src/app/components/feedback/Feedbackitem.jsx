// Simpan di: src/app/components/feedback/FeedbackItem.jsx
// Satu komentar saran / kritik + balasan admin. Tombol "Balas" hanya muncul untuk admin yang sedang login.

import { useMemo, useState } from 'react';
import { HiReply, HiRefresh, HiShieldCheck } from 'react-icons/hi';
import Stars from './Stars';
import { TYPES, MIN_MESSAGE, MAX_MESSAGE } from '../../../libs/Feedbackconfig';
import { getAdminSession, postReply } from '../../../libs/Feedbackapi';

function ReplyForm({ parentId, onReplied, onClose }) {
  const [pesan, setPesan] = useState('');
  const [send, setSend] = useState({ state: 'idle', message: '' }); // idle | sending | error

  const length = pesan.trim().length;
  const canSubmit = length >= MIN_MESSAGE && length <= MAX_MESSAGE && send.state !== 'sending';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSend({ state: 'sending', message: '' });
    try {
      const { res, body } = await postReply(parentId, pesan.trim());
      if (res.ok && body && body.status === 'success' && body.data) {
        if (onReplied) onReplied(parentId, body.data);
        onClose();
        return;
      }
      let message = (body && body.message) || `Gagal membalas (${res.status}).`;
      if (res.status === 403) message = 'Sesi admin tidak valid atau sudah berakhir. Silakan login ulang.';
      setSend({ state: 'error', message });
    } catch (error) {
      console.error('Balasan gagal dikirim:', error);
      setSend({ state: 'error', message: 'Tidak bisa terhubung ke server. Periksa koneksi lalu coba lagi.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3" noValidate>
      <label htmlFor={`reply-${parentId}`} className="sr-only">
        Balasan admin
      </label>
      <textarea
        id={`reply-${parentId}`}
        value={pesan}
        maxLength={MAX_MESSAGE}
        onChange={(e) => {
          setPesan(e.target.value);
          if (send.state !== 'sending') setSend({ state: 'idle', message: '' });
        }}
        rows={3}
        placeholder="Tulis balasan sebagai admin..."
        className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm leading-relaxed text-gray-100 outline-none transition placeholder:text-gray-600 focus:border-cyan-500"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-gray-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {send.state === 'sending' ? (
            <>
              <HiRefresh className="h-3.5 w-3.5 animate-spin" /> Mengirim...
            </>
          ) : (
            'Kirim balasan'
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-400 transition hover:text-white"
        >
          Batal
        </button>
        <span className="ml-auto text-xs tabular-nums text-gray-500">
          {pesan.length}/{MAX_MESSAGE}
        </span>
      </div>
      {send.state === 'error' && (
        <p aria-live="polite" className="mt-2 text-xs text-pink-400">
          {send.message}
        </p>
      )}
    </form>
  );
}

function ReplyBubble({ reply }) {
  return (
    <div className="flex gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-300">
        <HiShieldCheck className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h4 className="max-w-full truncate text-sm font-semibold text-white">{reply.nama}</h4>
          <span className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-[11px] font-semibold text-fuchsia-300 ring-1 ring-fuchsia-500/30">
            Admin
          </span>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-300">{reply.pesan}</p>
        <p className="mt-1 text-xs text-gray-500">
          {reply.tanggal}
          {reply.pukul && ` • ${reply.pukul} WIB`}
        </p>
      </div>
    </div>
  );
}

export default function FeedbackItem({ item, onReplied }) {
  const type = TYPES[item.tipe] || TYPES.lainnya;
  const initial = (item.nama || '?').trim().charAt(0).toUpperCase();
  const admin = useMemo(() => getAdminSession(), []); // hanya untuk menampilkan tombol; backend yang memverifikasi
  const [replying, setReplying] = useState(false);
  const replies = item.replies || [];

  return (
    <article className="flex gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${type.avatar}`}>
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="max-w-full truncate text-sm font-semibold text-white">{item.nama}</h3>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${type.chip}`}>
            <type.Icon className="h-3 w-3" />
            {type.label}
          </span>
          {item.rating ? <Stars value={item.rating} size="h-3.5 w-3.5" /> : null}
        </div>
        {/* React otomatis meng-escape teks, aman dari XSS. whitespace-pre-wrap menjaga baris baru. */}
        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-300">{item.pesan}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span>
            {item.tanggal}
            {item.pukul && ` • ${item.pukul} WIB`}
          </span>
          {admin && !replying && (
            <button
              type="button"
              onClick={() => setReplying(true)}
              className="inline-flex items-center gap-1 font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              <HiReply className="h-3.5 w-3.5" /> Balas
            </button>
          )}
        </div>

        {replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-gray-800 pl-3">
            {replies.map((reply) => (
              <ReplyBubble key={reply.id} reply={reply} />
            ))}
          </div>
        )}

        {admin && replying && <ReplyForm parentId={item.id} onReplied={onReplied} onClose={() => setReplying(false)} />}
      </div>
    </article>
  );
}