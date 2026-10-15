// Simpan di: src/app/components/feedback/FeedbackSection.jsx
// Bagian saran & kritik untuk beranda (tanpa Layout). Dipasang di App.jsx di atas <Contac />.
// Data baru diminta saat bagian ini mendekati layar (lazy), jadi tidak menambah request saat halaman dibuka.

import { useEffect, useRef, useState } from 'react';
import { HiStar } from 'react-icons/hi';
import useFeedbackList from './Usefeedbacklist';
import StatTile from './Stattile';
import FeedbackForm from './Feedbackform';
import FeedbackList from './Feedbacklist';

export function FeedbackContent() {
  const list = useFeedbackList();
  const { summary } = list;

  return (
    <>
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

      {/* Desktop: form di kiri, daftar di kanan (daftar bisa di-scroll). HP: bertumpuk. */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <FeedbackForm onSubmitted={list.addLocal} />
        <div className="lg:max-h-[680px] lg:overflow-y-auto lg:pr-1">
          <FeedbackList
            compact
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
      </div>
    </>
  );
}

export default function FeedbackSection() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  // Muat isi hanya saat bagian ini mendekati layar (300px sebelum terlihat)
  useEffect(() => {
    if (show) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [show]);

  return (
    <section id="feedback" ref={ref} aria-labelledby="feedback-title" className="scroll-mt-24">
      <header className="mb-6">
        <h2 id="feedback-title" className="text-2xl font-black tracking-tight sm:text-3xl">
          Saran &amp;{' '}
          <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
            Kritik
          </span>
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Ada yang bisa diperbaiki dari website ini? Tulis di sini, semua masukan dibaca.
        </p>
      </header>

      {show ? <FeedbackContent /> : <div className="h-72 animate-pulse rounded-2xl border border-gray-800 bg-gray-900/40" />}
    </section>
  );
}