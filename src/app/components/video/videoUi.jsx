// Simpan di: src/app/components/video/videoUi.jsx
// Dipakai bersama oleh VideoLibrary (/video) dan VideoWatch (/video/watch?id=...)

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiArrowLeft, HiPlay } from 'react-icons/hi';

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

// Pengaturan preview saat thumbnail disentuh / di-hover
const PREVIEW_DELAY_MS = 400; // tahan sebentar supaya tidak jalan saat mouse sekadar lewat
const PREVIEW_START = 0.5; // detik, sama dengan frame thumbnail (#t=0.5)
const PREVIEW_SECONDS = 6; // lama potongan preview; setelah itu diulang dari awal

// Thumbnail = frame video (tanpa endpoint thumbnail khusus).
// Mouse masuk / jari menyentuh -> preview diputar tanpa suara; keluar -> kembali ke frame awal.
export function Thumb({ url, duration, onDuration }) {
  const videoRef = useRef(null);
  const timer = useRef(null);
  const [previewing, setPreviewing] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100, bar tipis di bawah thumbnail

  const start = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = PREVIEW_START;
      v.play()
        .then(() => setPreviewing(true))
        .catch(() => setPreviewing(false)); // autoplay diblokir / video belum bisa diputar
    }, PREVIEW_DELAY_MS);
  };

  const stop = () => {
    clearTimeout(timer.current);
    const v = videoRef.current;
    setPreviewing(false);
    setProgress(0);
    if (v) {
      v.pause();
      v.currentTime = PREVIEW_START;
    }
  };

  useEffect(() => () => clearTimeout(timer.current), []);

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
      onMouseEnter={start}
      onMouseLeave={stop}
      onTouchStart={start}
      onTouchEnd={stop}
      onTouchMove={stop}
      onTouchCancel={stop}
      className="relative aspect-video overflow-hidden rounded-xl bg-gray-900"
    >
      <video
        ref={videoRef}
        src={`${url}#t=${PREVIEW_START}`}
        preload="metadata"
        muted
        playsInline
        disablePictureInPicture
        onLoadedMetadata={(e) => onDuration && onDuration(e.currentTarget.duration)}
        onTimeUpdate={onTimeUpdate}
        className="pointer-events-none h-full w-full object-cover"
      />

      {/* Tombol play saat hover, hilang begitu preview jalan */}
      {!previewing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-2xl text-gray-950">
            <HiPlay />
          </span>
        </div>
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

// Toolbar di atas konten (BUKAN navbar: navbar/footer sudah disediakan Layout).
// backTo = tampilkan tombol kembali ke path itu.
export function VideoToolbar({ value, onChange, onSubmit, backTo }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {backTo && (
        <Link
          to={backTo}
          aria-label="Kembali ke library"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-gray-300 transition hover:bg-gray-800 hover:text-white"
        >
          <HiArrowLeft className="h-5 w-5" />
        </Link>
      )}
      <Link to="/video" className="shrink-0 text-lg font-bold tracking-tight">
        <span className="text-cyan-400">Video</span> Library
      </Link>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit(value);
        }}
        className="mx-auto flex w-full max-w-xl items-center overflow-hidden rounded-full border border-gray-800 bg-gray-900 focus-within:border-cyan-500"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari video"
          className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 outline-none"
        />
        <button
          type="submit"
          aria-label="Cari"
          className="flex h-9 w-12 items-center justify-center border-l border-gray-800 bg-gray-800 text-gray-300 hover:text-white"
        >
          <HiSearch className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}