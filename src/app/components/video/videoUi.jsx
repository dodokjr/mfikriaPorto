// Simpan di: src/app/components/video/videoUi.jsx
// Dipakai bersama oleh VideoLibrary (/video) dan VideoWatch (/video/watch?id=...)

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiArrowLeft, HiPlay, HiX, HiClock } from 'react-icons/hi';

export function formatDuration(sec) {
  if (!Number.isFinite(sec) || sec <= 0) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  return `${h > 0 ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
}

export function formatSize(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
}

// Link ke halaman tonton: /video/watch?id={videoToken}
export function watchPath(videoToken) {
  return `/video/watch?id=${encodeURIComponent(videoToken)}`;
}

/* ========================= THUMBNAIL ========================= */

// Pengaturan preview
const PREVIEW_DELAY_MS = 400; // tahan sebentar supaya tidak jalan saat mouse sekadar lewat
const PREVIEW_START = 0.5; // detik, sama dengan frame thumbnail (#t=0.5)
const PREVIEW_SECONDS = 6; // lama potongan preview; setelah itu diulang dari awal

// Hanya satu preview yang boleh jalan dalam satu waktu
let stopActivePreview = null;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

// Thumbnail = frame video (tanpa endpoint thumbnail khusus).
// Cara memicu preview (tanpa suara), semuanya pada seluruh kartu <Link> di sekitarnya:
//  - Mouse   : arahkan kursor ke kartu
//  - Keyboard: fokus dengan Tab (Esc untuk menghentikan)
//  - Layar HP: tahan jari pada kartu, lepas untuk berhenti (tap singkat tetap membuka video)
export function Thumb({ url, duration, onDuration }) {
  const boxRef = useRef(null);
  const videoRef = useRef(null);
  const timer = useRef(null);
  const touchMode = useRef(false);
  const previewStarted = useRef(false);
  const suppressClick = useRef(false);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(false); // kursor / fokus / sentuhan ada di kartu
  const [previewing, setPreviewing] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100

  const stop = useCallback(() => {
    clearTimeout(timer.current);
    previewStarted.current = false;
    setActive(false);
    setPreviewing(false);
    setBuffering(false);
    setProgress(0);
    const v = videoRef.current;
    if (v) {
      v.pause();
      try {
        v.currentTime = PREVIEW_START;
      } catch (_) {
        /* video belum siap */
      }
    }
    if (stopActivePreview === stop) stopActivePreview = null;
  }, []);

  const start = useCallback(
    (delay = PREVIEW_DELAY_MS) => {
      if (prefersReducedMotion()) return;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const v = videoRef.current;
        if (!v) return;
        if (stopActivePreview && stopActivePreview !== stop) stopActivePreview();
        stopActivePreview = stop;
        previewStarted.current = true;
        v.currentTime = PREVIEW_START;
        setBuffering(true);
        v.play()
          .then(() => setPreviewing(true))
          .catch(() => {
            setPreviewing(false);
            setBuffering(false);
          });
      }, delay);
    },
    [stop]
  );

  // Pasang pendengar pada <a> terdekat supaya hover/fokus/sentuh di mana pun pada kartu berlaku
  useEffect(() => {
    const host = (boxRef.current && boxRef.current.closest('a')) || boxRef.current;
    if (!host) return undefined;
    let touchTimer = null;
    host.style.setProperty('-webkit-touch-callout', 'none');

    const onEnter = () => {
      if (touchMode.current) return; // abaikan mouse emulasi setelah sentuhan
      setActive(true);
      start();
    };
    const onLeave = () => {
      if (touchMode.current) return;
      stop();
    };
    const onFocus = () => {
      let visible = false;
      try {
        visible = host.matches(':focus-visible');
      } catch (_) {
        visible = false;
      }
      if (!visible) return; // klik mouse tidak dihitung sebagai fokus keyboard
      setFocused(true);
      setActive(true);
      start(250);
    };
    const onBlur = () => {
      setFocused(false);
      stop();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') stop();
    };
    const onTouchStart = () => {
      touchMode.current = true;
      clearTimeout(touchTimer);
      setActive(true);
      start();
    };
    const onTouchEnd = () => {
      // Tahan lama lalu lepas = hanya preview, jangan ikut membuka video
      if (previewStarted.current) {
        suppressClick.current = true;
        setTimeout(() => {
          suppressClick.current = false;
        }, 600);
      }
      stop();
      touchTimer = setTimeout(() => {
        touchMode.current = false;
      }, 700);
    };
    const onTouchMove = () => stop(); // sedang scroll
    const onContextMenu = (e) => {
      if (touchMode.current) e.preventDefault(); // cegah menu tahan-lama di HP
    };
    const onClickCapture = (e) => {
      if (suppressClick.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    host.addEventListener('mouseenter', onEnter);
    host.addEventListener('mouseleave', onLeave);
    host.addEventListener('focus', onFocus);
    host.addEventListener('blur', onBlur);
    host.addEventListener('keydown', onKey);
    host.addEventListener('touchstart', onTouchStart, { passive: true });
    host.addEventListener('touchend', onTouchEnd);
    host.addEventListener('touchmove', onTouchMove, { passive: true });
    host.addEventListener('touchcancel', onTouchEnd);
    host.addEventListener('contextmenu', onContextMenu);
    host.addEventListener('click', onClickCapture, true);

    return () => {
      clearTimeout(touchTimer);
      clearTimeout(timer.current);
      host.removeEventListener('mouseenter', onEnter);
      host.removeEventListener('mouseleave', onLeave);
      host.removeEventListener('focus', onFocus);
      host.removeEventListener('blur', onBlur);
      host.removeEventListener('keydown', onKey);
      host.removeEventListener('touchstart', onTouchStart);
      host.removeEventListener('touchend', onTouchEnd);
      host.removeEventListener('touchmove', onTouchMove);
      host.removeEventListener('touchcancel', onTouchEnd);
      host.removeEventListener('contextmenu', onContextMenu);
      host.removeEventListener('click', onClickCapture, true);
      if (stopActivePreview === stop) stopActivePreview = null;
    };
  }, [start, stop]);

  // Ulang dari awal setelah PREVIEW_SECONDS, dan gerakkan bar progress
  const onTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (v.paused) return;
    const end = Math.min(PREVIEW_START + PREVIEW_SECONDS, v.duration || Infinity);
    if (v.currentTime >= end) {
      v.currentTime = PREVIEW_START;
      return;
    }
    setProgress(((v.currentTime - PREVIEW_START) / (end - PREVIEW_START)) * 100);
  };

  return (
    <div
      ref={boxRef}
      className={`relative aspect-video overflow-hidden rounded-xl bg-gray-900 transition duration-300 ${
        focused ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-950' : ''
      } ${active ? 'shadow-lg shadow-cyan-500/10' : ''}`}
    >
      <video
        ref={videoRef}
        src={`${url}#t=${PREVIEW_START}`}
        preload="metadata"
        muted
        playsInline
        disablePictureInPicture
        onLoadedMetadata={(e) => {
          setReady(true);
          if (onDuration) onDuration(e.currentTarget.duration);
        }}
        onTimeUpdate={onTimeUpdate}
        onWaiting={() => previewStarted.current && setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onError={() => setFailed(true)}
        className={`pointer-events-none h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none ${
          active ? 'scale-105' : 'scale-100'
        }`}
      />

      {/* Placeholder saat memuat */}
      {!ready && !failed && <div className="absolute inset-0 animate-pulse bg-gray-800/60" />}

      {/* Gagal dimuat */}
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gray-900 text-gray-500">
          <HiPlay className="h-8 w-8 opacity-40" />
          <span className="text-xs">Pratinjau tidak tersedia</span>
        </div>
      )}

      {/* Tombol play saat kartu aktif, sebelum preview jalan */}
      {active && !previewing && !buffering && !failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-2xl text-gray-950 shadow-lg">
            <HiPlay />
          </span>
        </div>
      )}

      {/* Spinner saat preview menunggu data */}
      {buffering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/20 border-t-cyan-400" />
        </div>
      )}

      {/* Penanda preview */}
      {previewing && (
        <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-cyan-300">
          Pratinjau
        </span>
      )}

      {/* Durasi disembunyikan saat preview (seperti YouTube) */}
      {duration && !previewing ? (
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(duration)}
        </span>
      ) : null}

      {/* Bar progress preview */}
      {previewing && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
          <div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

/* ========================= TOOLBAR PENCARIAN ========================= */

const RECENT_KEY = 'video:recent-searches';
const RECENT_MAX = 6;

function loadRecent() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY));
    return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string').slice(0, RECENT_MAX) : [];
  } catch (_) {
    return [];
  }
}

function saveRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch (_) {
    /* penyimpanan dinonaktifkan: abaikan */
  }
}

// Toolbar di atas konten (BUKAN navbar: navbar/footer sudah disediakan Layout).
// backTo = tampilkan tombol kembali ke path itu.
//  - Mouse   : klik kolom -> riwayat pencarian muncul, klik untuk memilih, X untuk menghapus
//  - Keyboard: tekan "/" di mana saja untuk mencari; panah atas/bawah memilih riwayat,
//              Enter mencari, Esc menghapus teks / menutup daftar
//  - Layar HP: ikon cari membuka kolom penuh, tombol "Batal" untuk menutup
export function VideoToolbar({ value, onChange, onSubmit, backTo }) {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [recent, setRecent] = useState(() => loadRecent());
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const [mobileSearch, setMobileSearch] = useState(false);

  const query = (value || '').trim().toLowerCase();
  const items = recent.filter((r) => !query || (r.toLowerCase().includes(query) && r.toLowerCase() !== query));

  const submit = (text) => {
    const q = (text || '').trim();
    if (q) {
      const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, RECENT_MAX);
      setRecent(next);
      saveRecent(next);
    }
    setOpen(false);
    setCursor(-1);
    if (inputRef.current) inputRef.current.blur(); // tutup keyboard HP
    if (onSubmit) onSubmit(q);
  };

  const choose = (q) => {
    onChange(q);
    submit(q);
  };

  const removeRecent = (q) => {
    const next = recent.filter((r) => r !== q);
    setRecent(next);
    saveRecent(next);
    setCursor(-1);
  };

  const clearAll = () => {
    setRecent([]);
    saveRecent([]);
    setCursor(-1);
    setOpen(false);
  };

  const closeMobile = () => {
    setMobileSearch(false);
    setOpen(false);
    if (inputRef.current) inputRef.current.blur();
  };

  // Fokus otomatis ke kolom saat dibuka di HP
  useEffect(() => {
    if (mobileSearch && inputRef.current) inputRef.current.focus();
  }, [mobileSearch]);

  // Pintasan "/" untuk mencari (seperti YouTube / GitHub)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      const tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
      e.preventDefault();
      setMobileSearch(true);
      if (inputRef.current) inputRef.current.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Tutup daftar saat klik / sentuh di luar toolbar
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onInputKeyDown = (e) => {
    const n = items.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      if (n) setCursor((c) => (c + 1) % n);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      if (n) setCursor((c) => (c <= 0 ? n - 1 : c - 1));
    } else if (e.key === 'Enter' && open && cursor >= 0 && items[cursor]) {
      e.preventDefault();
      choose(items[cursor]);
    } else if (e.key === 'Escape') {
      if (open && n) {
        setOpen(false);
        setCursor(-1);
      } else if (value) {
        onChange('');
      } else {
        e.currentTarget.blur();
        setMobileSearch(false);
      }
    }
  };

  const listVisible = open && items.length > 0;

  return (
    <div ref={rootRef} className="relative mb-6 flex items-center gap-2 sm:gap-3">
      {backTo && (
        <Link
          to={backTo}
          aria-label="Kembali ke library"
          className={`h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-gray-300 transition hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 ${
            mobileSearch ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <HiArrowLeft className="h-5 w-5" />
        </Link>
      )}

      <Link
        to="/video"
        className={`shrink-0 rounded text-lg font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
          mobileSearch ? 'hidden sm:block' : ''
        }`}
      >
        <span className="text-cyan-400">Video</span> Library
      </Link>

      {/* Kolom cari: selalu tampil di layar lebar, di HP hanya saat dibuka */}
      <div className={`relative min-w-0 flex-1 justify-center ${mobileSearch ? 'flex' : 'hidden sm:flex'}`}>
        <div className="relative w-full max-w-xl">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
            className="flex w-full items-center overflow-hidden rounded-full border border-gray-800 bg-gray-900 transition focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20"
          >
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-label="Cari video"
              aria-expanded={listVisible}
              aria-controls="video-search-list"
              aria-autocomplete="list"
              aria-activedescendant={cursor >= 0 ? `video-search-opt-${cursor}` : undefined}
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setCursor(-1);
                setOpen(true);
              }}
              onFocus={() => {
                setRecent(loadRecent());
                setOpen(true);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="Cari video"
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-base text-white placeholder-gray-500 outline-none sm:text-sm"
            />

            {value ? (
              <button
                type="button"
                aria-label="Hapus pencarian"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange('');
                  if (inputRef.current) inputRef.current.focus();
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-gray-400 transition hover:text-white active:scale-90"
              >
                <HiX className="h-5 w-5" />
              </button>
            ) : (
              <kbd
                aria-hidden="true"
                className="mr-3 hidden h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-700 text-[11px] text-gray-500 sm:inline-flex"
              >
                /
              </kbd>
            )}

            <button
              type="submit"
              aria-label="Cari"
              className="flex h-10 w-12 shrink-0 items-center justify-center border-l border-gray-800 bg-gray-800 text-gray-300 transition hover:bg-gray-700 hover:text-white active:bg-gray-700 sm:h-9"
            >
              <HiSearch className="h-5 w-5" />
            </button>
          </form>

          {/* Riwayat pencarian */}
          {listVisible && (
            <ul
              id="video-search-list"
              role="listbox"
              aria-label="Pencarian terakhir"
              className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 py-1 shadow-xl shadow-black/40"
            >
              <li role="presentation" className="flex items-center justify-between px-4 py-1.5 text-xs text-gray-500">
                <span>Pencarian terakhir</span>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={clearAll}
                  className="rounded px-1 font-medium text-gray-400 transition hover:text-cyan-400"
                >
                  Hapus semua
                </button>
              </li>
              {items.map((q, i) => (
                <li
                  key={q}
                  id={`video-search-opt-${i}`}
                  role="option"
                  aria-selected={i === cursor}
                  className={`flex items-center ${i === cursor ? 'bg-gray-800' : ''}`}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(q)}
                    onMouseEnter={() => setCursor(i)}
                    className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left text-sm text-gray-200 transition hover:bg-gray-800 sm:py-2.5"
                  >
                    <HiClock className="h-4 w-4 shrink-0 text-gray-500" />
                    <span className="truncate">{q}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus "${q}" dari riwayat`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => removeRecent(q)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center text-gray-500 transition hover:text-red-400 sm:h-10 sm:w-10"
                  >
                    <HiX className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* HP: ikon cari / tombol batal */}
      {mobileSearch ? (
        <button
          type="button"
          onClick={closeMobile}
          className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold text-cyan-400 transition active:bg-gray-900 sm:hidden"
        >
          Batal
        </button>
      ) : (
        <button
          type="button"
          aria-label="Buka pencarian"
          onClick={() => setMobileSearch(true)}
          className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-gray-300 transition hover:bg-gray-800 hover:text-white active:scale-95 sm:hidden"
        >
          <HiSearch className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}