// Simpan di: src/app/components/feedback/FeedbackForm.jsx
// Form kirim saran & kritik. onSubmitted(data) dipanggil dengan komentar yang tersimpan.

import { useState } from 'react';
import { HiPaperAirplane, HiCheckCircle, HiRefresh } from 'react-icons/hi';
import StarPicker from './Starpicker';
import { postFeedback } from '../../../libs/Feedbackapi';
import { MAX_MESSAGE, MAX_NAME, MIN_MESSAGE, TYPES } from '../../../libs/Feedbackconfig';

export default function FeedbackForm({ onSubmitted }) {
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('saran');
  const [rating, setRating] = useState(0);
  const [pesan, setPesan] = useState('');
  const [website, setWebsite] = useState(''); // honeypot: harus tetap kosong
  const [send, setSend] = useState({ state: 'idle', message: '' }); // idle | sending | success | error

  const messageLength = pesan.trim().length;
  const canSubmit = messageLength >= MIN_MESSAGE && messageLength <= MAX_MESSAGE && send.state !== 'sending';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSend({ state: 'sending', message: '' });
    try {
      const payload = { nama: nama.trim(), tipe, pesan: pesan.trim(), website };
      if (rating) payload.rating = rating;

      const { res, body } = await postFeedback(payload);

      if (res.ok && body && body.status === 'success') {
        setSend({ state: 'success', message: body.message || 'Terima kasih atas saran dan kritiknya.' });
        setPesan('');
        setRating(0);
        if (onSubmitted && body.data) onSubmitted(body.data);
        return;
      }

      let message = (body && body.message) || `Gagal mengirim (${res.status}).`;
      if (res.status === 401) message = 'Sesi tamu kedaluwarsa. Muat ulang halaman lalu coba lagi.';
      setSend({ state: 'error', message });
    } catch (error) {
      console.error('Kirim saran & kritik gagal:', error);
      setSend({ state: 'error', message: 'Tidak bisa terhubung ke server. Periksa koneksi lalu coba lagi.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5" noValidate>
      <h2 className="text-lg font-bold">Kirim masukan</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-nama" className="mb-1 block text-xs font-medium text-gray-400">
            Nama <span className="text-gray-600">(opsional)</span>
          </label>
          <input
            id="fb-nama"
            value={nama}
            maxLength={MAX_NAME}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Anonim"
            autoComplete="name"
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100 outline-none transition placeholder:text-gray-600 focus:border-cyan-500"
          />
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium text-gray-400">Jenis masukan</span>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Jenis masukan">
            {Object.entries(TYPES).map(([key, t]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={tipe === key}
                onClick={() => setTipe(key)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                  tipe === key
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                    : 'border-gray-700 bg-gray-950 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                <t.Icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <span className="mb-1 block text-xs font-medium text-gray-400">Penilaian website</span>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="mt-4">
        <label htmlFor="fb-pesan" className="mb-1 block text-xs font-medium text-gray-400">
          Pesan
        </label>
        <textarea
          id="fb-pesan"
          value={pesan}
          maxLength={MAX_MESSAGE}
          onChange={(e) => {
            setPesan(e.target.value);
            if (send.state !== 'sending') setSend({ state: 'idle', message: '' });
          }}
          rows={5}
          placeholder="Tulis saran atau kritikmu di sini..."
          className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm leading-relaxed text-gray-100 outline-none transition placeholder:text-gray-600 focus:border-cyan-500"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>{messageLength > 0 && messageLength < MIN_MESSAGE ? `Minimal ${MIN_MESSAGE} karakter` : ''}</span>
          <span className="tabular-nums">
            {pesan.length}/{MAX_MESSAGE}
          </span>
        </div>
      </div>

      {/* Honeypot: tersembunyi untuk manusia dan pembaca layar, bot biasanya mengisinya */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="fb-website">Website</label>
        <input
          id="fb-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-pink-600/25 transition hover:bg-pink-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-pink-600"
        >
          {send.state === 'sending' ? (
            <>
              <HiRefresh className="h-4 w-4 animate-spin" /> Mengirim...
            </>
          ) : (
            <>
              <HiPaperAirplane className="h-4 w-4 rotate-90" /> Kirim
            </>
          )}
        </button>

        <p aria-live="polite" className="min-w-0 flex-1 text-sm">
          {send.state === 'success' && (
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <HiCheckCircle className="h-4 w-4 shrink-0" /> {send.message}
            </span>
          )}
          {send.state === 'error' && <span className="text-pink-400">{send.message}</span>}
        </p>
      </div>
    </form>
  );
}