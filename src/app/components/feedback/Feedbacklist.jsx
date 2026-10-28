// Simpan di: src/app/components/feedback/FeedbackList.jsx
// Filter jenis + daftar komentar + tombol "Muat lebih banyak".

import { HiRefresh } from 'react-icons/hi';
import FeedbackItem from './Feedbackitem';
import { TYPES } from '../../../libs/Feedbackconfig';

const FILTERS = [{ key: '', label: 'Semua' }, ...Object.entries(TYPES).map(([key, t]) => ({ key, label: t.label }))];

// compact = dipakai di beranda (tanpa jarak atas ekstra)
export default function FeedbackList({ items, status, hasMore, loadingMore, filter, onFilterChange, onLoadMore, onRetry, onReplied, compact = false }) {
  return (
    <>
      {/* Filter */}
      <div className={`mb-4 flex flex-wrap items-center gap-2 ${compact ? '' : 'mt-8'}`}>
        <h2 className="mr-2 text-lg font-bold">Masukan terbaru</h2>
        {FILTERS.map((f) => (
          <button
            key={f.key || 'all'}
            type="button"
            onClick={() => onFilterChange(f.key)}
            aria-pressed={filter === f.key}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              filter === f.key ? 'bg-cyan-500 text-gray-950' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-3 rounded-2xl border border-gray-800 bg-gray-900/40 p-4">
              <div className="h-10 w-10 rounded-full bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-gray-800" />
                <div className="h-3 w-full rounded bg-gray-800" />
                <div className="h-3 w-2/3 rounded bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 px-4 py-10 text-center">
          <p className="font-semibold">Masukan tidak bisa dimuat</p>
          <p className="mt-1 text-sm text-gray-400">Periksa koneksi lalu coba lagi.</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-gray-950 transition hover:bg-cyan-400"
          >
            <HiRefresh className="h-4 w-4" /> Coba lagi
          </button>
        </div>
      )}

      {status === 'ready' &&
        (items.length === 0 ? (
          <p className="rounded-2xl border border-gray-800 bg-gray-900/40 px-4 py-10 text-center text-sm text-gray-400">
            Belum ada masukan. Jadilah yang pertama!
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <FeedbackItem key={item.id} item={item} onReplied={onReplied} />
            ))}
            {hasMore && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className="rounded-full border border-gray-700 bg-gray-900 px-5 py-2 text-sm font-semibold text-gray-200 transition hover:border-cyan-500/60 hover:text-white disabled:opacity-50"
                >
                  {loadingMore ? 'Memuat...' : 'Muat lebih banyak'}
                </button>
              </div>
            )}
          </div>
        ))}
    </>
  );
}