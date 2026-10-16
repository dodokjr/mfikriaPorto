import { lazy, Suspense, useEffect, useState } from 'react';
import '../assets/App.css';
import Layout from './layout';
import Loading from './components/utilities/Loading';
import Benner from './components/utilities/Benner.jsx';
import Home from './components/home/home';
import { HiSparkles, HiX } from 'react-icons/hi';
import { ensureGuestToken } from './components/utilities/guestToken.js'; // sesuaikan path dengan lokasi file guestToken.js

// Bagian di bawah layar pertama dimuat belakangan (code splitting),
// jadi bundle awal lebih kecil dan halaman cepat tampil.
const TimeLine = lazy(() => import('./components/home/timeLine'));
const HomeProject = lazy(() => import('./components/project/homeProject'));
const SectionStar = lazy(() => import('./components/home/SectionStar'));
const BlogHome = lazy(() => import('./components/blog/blogHome'));
const FeedbackSection = lazy(() => import('./components/feedback/Feedbacksection.jsx')); // saran & kritik
const Contac = lazy(() => import('./components/utilities/contac'));

// Endpoint data beranda. Bisa diganti lewat .env (VITE_HOME_URL).
const HOME_URL = import.meta.env.VITE_HOME_URL || 'https://api-mfikria.vercel.app/v1/home';
const FETCH_TIMEOUT = 10000; // ms: kalau API lambat, halaman tetap tampil
const WELCOME_SECONDS = 6;

// Placeholder tipis saat bagian lazy masih dimuat
const Fallback = () => <div className="h-32" aria-hidden="true" />;

function Welcome({ onClose }) {
  // Tutup otomatis supaya tidak menghalangi layar
  useEffect(() => {
    const t = setTimeout(onClose, WELCOME_SECONDS * 1000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:top-5 sm:px-4"
    >
      <div className="flex w-full max-w-lg items-center gap-3 rounded-2xl border border-pink-500/20 bg-gray-900/95 p-3 shadow-2xl backdrop-blur sm:p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pink-500/10 text-lg text-pink-400">
          <HiSparkles />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-white">Selamat datang!</h4>
          <p className="text-xs text-gray-400">
            Terima kasih sudah berkunjung ke portofolio <span className="font-medium text-pink-400">mfikria</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          <HiX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    // Guest token tidak memblokir halaman; kalau gagal, website tetap jalan.
    ensureGuestToken().catch((e) => console.error('Guest token gagal diambil:', e));

    fetch(HOME_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`home gagal (${res.status})`);
        return res.json();
      })
      .then((body) => {
        setData(body);
        try {
          if (!sessionStorage.getItem('hasVisited_mfikria')) {
            sessionStorage.setItem('hasVisited_mfikria', 'true');
            setShowWelcome(true);
          }
        } catch {
          /* sessionStorage tidak tersedia */
        }
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          console.error('API not responding, please call me: ffikri604@gmail.com', e);
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        setIsLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  if (isLoading) return <Loading />;

  return (
    <Layout>
      <main className="relative min-h-screen bg-gray-950 text-white">
        {showWelcome && <Welcome onClose={() => setShowWelcome(false)} />}

        <Benner data={data} />

        <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6">
          <Home data={data} />
          <Suspense fallback={<Fallback />}>
            <TimeLine />
            <HomeProject api={data} />
            <SectionStar />
            <BlogHome api={data} />
            <FeedbackSection />
            <Contac api={data} />
          </Suspense>
        </div>
      </main>
    </Layout>
  );
}

export default App;