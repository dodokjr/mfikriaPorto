// Simpan di: src/app/components/feedback/Feedback.jsx   -> route: /feedback
// Halaman saran & kritik: menggabungkan ringkasan, form, dan daftar.

import { HiStar } from 'react-icons/hi';
import useFeedbackList from './Usefeedbacklist';
import StatTile from './Stattile';
import FeedbackForm from './Feedbackform';
import FeedbackList from './Feedbacklist';

export default function Feedback() {
  const list = useFeedbackList();
  const { summary } = list;

  return (
      <section className="min-h-screen bg-gray-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Judul */}
          <header className="mb-6">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Saran &amp;{' '}
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
                Kritik
              </span>
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Ada yang bisa diperbaiki dari website ini? Tulis di sini, semua masukan dibaca.
            </p>
          </header>

          {/* Ringkasan */}
          {summary && (
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Total masukan" value={summary.total.toLocaleString('id-ID')} />
              <StatTile label="Saran" value={summary.saran.toLocaleString('id-ID')} />
              <StatTile label="Kritik" value={summary.kritik.toLocaleString('id-ID')} />
              <StatTile label="Rating rata-rata">
                {summary.avgRating ? (
                  <>
                    <HiStar className="h-5 w-5 text-amber-400" />
                    {summary.avgRating}
                  </>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </StatTile>
            </div>
          )}

          <FeedbackForm onSubmitted={list.addLocal} />

          <FeedbackList
            items={list.items}
            status={list.status}
            hasMore={list.hasMore}
            loadingMore={list.loadingMore}
            filter={list.filter}
            onFilterChange={list.setFilter}
            onLoadMore={list.loadMore}
            onRetry={list.reload}
          />
        </div>
      </section>
  );
}