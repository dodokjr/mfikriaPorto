// Simpan di: src/app/components/video/VideoThumb.jsx
// Gambar cuplikan video (hanya gambar kecil dari backend, TIDAK memuat video).
// Kalau gambar belum ada / gagal dimuat, tampil placeholder.

import { useState } from 'react';
import { HiPlay } from 'react-icons/hi';
import { thumbUrl } from './Thumburl';

export default function VideoThumb({ token, title, small = false }) {
  const [failed, setFailed] = useState(false);
  const initial = (title || '?').trim().charAt(0).toUpperCase();

  return (
    <div
      className={`relative aspect-video overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 ring-1 ring-white/5 transition group-hover:ring-cyan-400/40 ${
        small ? 'rounded-lg' : 'rounded-xl'
      }`}
    >
      <span
        className={`absolute inset-0 flex select-none items-center justify-center font-bold text-white/10 ${
          small ? 'text-3xl' : 'text-5xl'
        }`}
      >
        {initial}
      </span>
      {!failed && (
        <img
          src={thumbUrl(token)}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <span
        className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-80 transition group-hover:bg-cyan-500 group-hover:text-gray-950 group-hover:opacity-100 ${
          small ? 'h-8 w-8' : 'h-12 w-12'
        }`}
      >
        <HiPlay className={small ? 'h-4 w-4' : 'h-6 w-6'} />
      </span>
    </div>
  );
}