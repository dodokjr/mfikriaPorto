import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Navbar from './components/utilities/navbar';
import Footer from './components/utilities/footer';
import Preload from './pre';
import { useLocation } from 'react-router-dom';
import { ensureGuestToken, trackGuestPage } from './components/utilities/guestToken';

const MIN_PRELOAD_MS = 1200; // preloader tampil minimal sekian milidetik
const MAX_PRELOAD_MS = 4000; // batas atas supaya tidak menunggu selamanya

// Latar belakang sama seperti Link.jsx: grid halus + gumpalan gradient (pink, indigo, fuchsia)
// yang melayang pelan. Grid memudar ke tepi layar lewat mask radial.
const GRID_COLOR = 'rgba(255,255,255,0.04)';
const GRID_MASK = 'radial-gradient(ellipse at center, black 30%, transparent 75%)';

// ---------------------------------------------------------------
// Tema warna
// Seluruh halaman diputar warnanya (hue-rotate) dari warna dasar pink.
// Pilihan "Putih" dan "Hitam" = mode monokrom: semua warna dijadikan skala
// abu-abu (Putih: aksen terang, Hitam: aksen gelap); putih tetap putih.
// deg     = besar putaran hue
// color   = warna aksen hasil putaran
// swatch  = tampilan bulatan kecil di panel (default sama dengan color)
// filter  = (opsional) filter khusus untuk <html>, menggantikan hue-rotate
// counter = (opsional) kebalikan filter, dipakai untuk gambar & panel pemilih
// ---------------------------------------------------------------
const THEMES = [
  { id: 'pink', name: 'Pink', deg: 0, color: '#ec4899' }, // bawaan
  { id: 'merah', name: 'Merah', deg: 30, color: '#f04e56' },
  { id: 'oranye', name: 'Oranye', deg: 60, color: '#d15d1a' },
  { id: 'amber', name: 'Amber', deg: 75, color: '#b86704' },
  { id: 'hijau', name: 'Hijau', deg: 150, color: '#1a9410' },
  { id: 'zamrud', name: 'Zamrud', deg: 180, color: '#009a49' },
  { id: 'tosca', name: 'Tosca', deg: 210, color: '#00948c' },
  { id: 'langit', name: 'Langit', deg: 225, color: '#008dab' },
  { id: 'biru', name: 'Biru', deg: 255, color: '#2a7bdd' },
  { id: 'indigo', name: 'Indigo', deg: 285, color: '#6a66f2' },
  { id: 'ungu', name: 'Ungu', deg: 300, color: '#8c5cf0' },
  { id: 'violet', name: 'Violet', deg: 315, color: '#ab54e4' },
  { id: 'fuchsia', name: 'Fuchsia', deg: 330, color: '#c74dd1' },
  { id: 'magenta', name: 'Magenta', deg: 345, color: '#dd49b8' },
  {
    id: 'putih',
    name: 'Putih',
    deg: 0,
    color: '#ffffff',
    swatch: 'linear-gradient(90deg, #ffffff 50%, #111111 50%)',
    filter: 'grayscale(1) brightness(1.4)',
    counter: 'brightness(0.714)',
  },
  {
    id: 'hitam',
    name: 'Hitam',
    deg: 0,
    color: '#1a1a1a',
    filter: 'grayscale(1) contrast(1.3)',
    counter: 'contrast(0.769)',
  },
];
const DEFAULT_THEME_ID = 'pink';

// Filter yang dipasang di <html>, dan kebalikannya untuk gambar / panel pemilih
const filterFor = (t) => t.filter || (t.deg ? `hue-rotate(${t.deg}deg)` : 'none');
const counterFor = (t) => t.counter || (t.deg ? `hue-rotate(${-t.deg}deg)` : 'none');
const isDefaultTheme = (t) => !t.filter && t.deg === 0;
const THEME_KEY = 'theme:accent';
const THEME_STORAGE = 'local'; // 'local' = tetap tersimpan, 'session' = hanya selama tab terbuka

const getStorage = () =>
  THEME_STORAGE === 'session' ? window.sessionStorage : window.localStorage;

// Tema aktif: dibaca dari storage, diterapkan ke <html>, lalu disimpan lagi.
function useAccentTheme() {
  const [id, setId] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME_ID;
    try {
      const saved = getStorage().getItem(THEME_KEY);
      return THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME_ID;
    } catch {
      return DEFAULT_THEME_ID;
    }
  });

  const theme = THEMES.find((t) => t.id === id) || THEMES[0];

  // Terapkan sebelum browser menggambar supaya tidak berkedip pink dulu
  useLayoutEffect(() => {
    const root = document.documentElement;
    const clear = () => {
      root.style.removeProperty('filter');
      root.style.removeProperty('--accent-counter');
      root.removeAttribute('data-accent');
    };

    if (isDefaultTheme(theme)) {
      clear();
    } else {
      root.style.filter = filterFor(theme);
      root.style.setProperty('--accent-counter', counterFor(theme));
      root.setAttribute('data-accent', theme.id);
    }
    return clear;
  }, [theme]);

  useEffect(() => {
    try {
      getStorage().setItem(THEME_KEY, theme.id);
    } catch {
      /* abaikan: tema tetap berfungsi tanpa penyimpanan */
    }
  }, [theme.id]);

  return [theme, setId];
}

// Tombol bulat di pojok kanan bawah untuk memilih warna tema
function ThemePicker({ theme, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // Tutup saat klik di luar atau tekan Escape
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      // Batalkan filter halaman supaya panel tampil normal
      // (pada mode putih-hitam, bulatan warna tetap abu-abu, jadi pilih lewat namanya)
      style={isDefaultTheme(theme) ? undefined : { filter: counterFor(theme) }}
      className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2"
    >
      {open && (
        <div
          role="radiogroup"
          aria-label="Warna tema"
          className="grid w-[min(21rem,calc(100vw-2rem))] grid-cols-3 gap-2 rounded-2xl border border-gray-800 bg-gray-950/90 p-3 shadow-2xl backdrop-blur-xl"
        >
          {THEMES.map((t) => {
            const selected = t.id === theme.id;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  onChange(t.id);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  selected
                    ? 'border-white/70 bg-white/10 text-white'
                    : 'border-gray-800 text-gray-300 hover:border-white/30 hover:text-white'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-white/25"
                  style={{ background: t.swatch || t.color }}
                />
                {t.name}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Ganti warna tema (sekarang ${theme.name})`}
        title="Ganti warna tema"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-800 bg-gray-950/90 shadow-xl backdrop-blur-xl transition-colors hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span
          className="h-5 w-5 rounded-full ring-1 ring-white/25"
          style={{ background: theme.swatch || theme.color }}
        />
      </button>
    </div>
  );
}

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

// Guest token: satu token & userId per sesi (POST /guest-token).
// Tiap pindah halaman dicatat lewat POST /guest-token/:scope (tab GuestTokens_Params),
// supaya tahu guest itu membuka halaman apa saja.
export default function Layout({ children }) {
  const { pathname } = useLocation();
  const [load, setLoad] = useState(true);
  const [rendering, setRendering] = useState(false); // true selama fallback Suspense tampil
  const [theme, setThemeId] = useAccentTheme();
  const contentRef = useRef(null);

  // Preloader: tampil minimal MIN_PRELOAD_MS, menunggu halaman selesai dimuat
  // DAN guest token siap (berhasil atau gagal), maksimal MAX_PRELOAD_MS.
  // Efek ini hanya berjalan sekali.
  useEffect(() => {
    let finished = false;
    let cancelled = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        setLoad(false);
      }
    };

    const start = performance.now();
    let minTimer = 0;
    let onLoad = null;

    const pageLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else {
        onLoad = resolve;
        window.addEventListener('load', onLoad, { once: true });
      }
    });

    const tokenReady = ensureGuestToken().catch((error) => {
      console.error('guest-token:', error.message);
      return null; // gagal: halaman tetap tampil
    });

    Promise.all([pageLoaded, tokenReady]).then(() => {
      if (cancelled) return;
      minTimer = setTimeout(finish, Math.max(0, MIN_PRELOAD_MS - (performance.now() - start)));
    });
    const maxTimer = setTimeout(finish, MAX_PRELOAD_MS);

    return () => {
      cancelled = true;
      finished = true;
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      if (onLoad) window.removeEventListener('load', onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Catat halaman yang dibuka (jalan lagi setiap pathname berubah; halaman di luar daftar scope diabaikan)
  useEffect(() => {
    trackGuestPage(pathname);
  }, [pathname]);

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
        /* Foto/gambar/video tetap berwarna asli saat tema warna diganti
           (pada mode putih-hitam gambar ikut menjadi hitam-putih) */
        :where([data-accent]) :where(img, video, canvas) {
          filter: var(--accent-counter);
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

        {!load && <ThemePicker theme={theme} onChange={setThemeId} />}
      </div>
    </>
  );
}