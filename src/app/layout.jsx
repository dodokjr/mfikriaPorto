import React, { Suspense, useEffect, useRef, useState } from 'react';
import Navbar from './components/utilities/navbar';
import Footer from './components/utilities/footer';
import Preload from './pre';

const MIN_PRELOAD_MS = 1200; // preloader tampil minimal sekian milidetik
const MAX_PRELOAD_MS = 4000; // batas atas supaya tidak menunggu selamanya

// Latar belakang sama seperti Link.jsx: grid halus + gumpalan gradient (pink, indigo, fuchsia)
// yang melayang pelan. Grid memudar ke tepi layar lewat mask radial.
const GRID_COLOR = 'rgba(255,255,255,0.04)';
const GRID_MASK = 'radial-gradient(ellipse at center, black 30%, transparent 75%)';

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes lay-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(24px, -30px) scale(1.08); }
        }
        @keyframes lay-float-alt {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-28px, 26px) scale(1.1); }
        }
        .lay-float { animation: lay-float 14s ease-in-out infinite; }
        .lay-float-alt { animation: lay-float-alt 17s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lay-float, .lay-float-alt { animation: none; }
        }
      `}</style>

      {/* Grid halus, memudar ke tepi */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${GRID_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_COLOR} 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
          maskImage: GRID_MASK,
          WebkitMaskImage: GRID_MASK,
        }}
      />

      {/* Gumpalan gradient yang melayang */}
      <div className="lay-float absolute -top-24 -left-24 h-80 w-80 rounded-full bg-pink-600/25 blur-3xl" />
      <div className="lay-float-alt absolute top-1/3 -right-28 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
      <div className="lay-float absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-3xl" />
    </div>
  );
}

// Garis loading di paling atas layar: bergerak selama preloader tampil
// atau selama halaman masih dirender (mis. komponen lazy belum selesai dimuat)
function TopBar({ busy }) {
  return (
    <div
      role="progressbar"
      aria-label="Memuat"
      aria-hidden={!busy}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] overflow-hidden transition-opacity duration-300 ${
        busy ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="lay-bar h-full w-2/5 rounded-full bg-gradient-to-r from-transparent via-pink-500 to-fuchsia-400 shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
    </div>
  );
}

// Tampilan sementara selagi halaman dirender: kotak-kotak pink berdenyut bergelombang,
// senada dengan latar. Melapor ke Layout lewat onToggle supaya TopBar ikut bergerak.
function PageLoader({ onToggle }) {
  useEffect(() => {
    onToggle(true);
    return () => onToggle(false);
  }, [onToggle]);

  return (
    <div role="status" aria-live="polite" className="flex min-h-[50vh] flex-col items-center justify-center gap-6">
      <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="lay-cell h-4 w-4 rounded-[4px] bg-pink-500 sm:h-5 sm:w-5"
            style={{ animationDelay: `${((i % 3) + Math.floor(i / 3)) * 120}ms` }}
          />
        ))}
      </div>
      <p className="text-xs font-semibold tracking-wide text-gray-400">Memuat halaman…</p>
    </div>
  );
}

export default function Layout({ children }) {
  const [load, setLoad] = useState(true);
  const [rendering, setRendering] = useState(false); // true selama fallback Suspense tampil
  const contentRef = useRef(null);

  // Preloader: tampil minimal MIN_PRELOAD_MS dan menunggu halaman selesai dimuat
  // (maksimal MAX_PRELOAD_MS). Efek ini hanya berjalan sekali.
  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        setLoad(false);
      }
    };

    const start = performance.now();
    let minTimer = 0;
    const onReady = () => {
      minTimer = setTimeout(finish, Math.max(0, MIN_PRELOAD_MS - (performance.now() - start)));
    };

    if (document.readyState === 'complete') onReady();
    else window.addEventListener('load', onReady, { once: true });
    const maxTimer = setTimeout(finish, MAX_PRELOAD_MS);

    return () => {
      finished = true;
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      window.removeEventListener('load', onReady);
    };
  }, []);

  // Cegah scroll saat preloader aktif, lalu kembalikan nilai awal (bukan dipaksa 'unset')
  useEffect(() => {
    if (!load) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [load]);

  // Konten tidak bisa difokus / diklik selama preloader tampil
  useEffect(() => {
    if (contentRef.current) contentRef.current.inert = load;
  }, [load]);

  return (
    <>
      <style>{`
        @keyframes lay-bar {
          from { transform: translateX(-100%); }
          to { transform: translateX(250%); }
        }
        @keyframes lay-cell {
          0%, 100% { opacity: .15; transform: scale(.7); }
          50% { opacity: 1; transform: scale(1); }
        }
        .lay-bar { animation: lay-bar 1.1s ease-in-out infinite; }
        .lay-cell { animation: lay-cell 1.1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lay-bar { animation: none; width: 100%; opacity: .6; }
          .lay-cell { animation: none; opacity: .6; transform: none; }
        }
      `}</style>

      <TopBar busy={load || rendering} />
      <Preload load={load} />

      <div className="relative min-h-screen bg-gray-950 font-sans text-gray-100 antialiased">
        <Backdrop />

        <div
          ref={contentRef}
          aria-hidden={load}
          className={`relative z-10 flex min-h-screen flex-col transition-opacity duration-500 ${
            load ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <a
            href="#main-content"
            className="sr-only fixed left-4 top-4 z-[60] rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white focus:not-sr-only"
          >
            Lewati ke konten
          </a>

          <Navbar />

          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-7xl flex-grow px-4 py-10 outline-none sm:px-6 sm:py-14 md:py-20 lg:px-8 lg:py-24"
          >
            <Suspense fallback={<PageLoader onToggle={setRendering} />}>{children}</Suspense>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}