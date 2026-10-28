// Simpan di: src/app/components/blog/blogCard.jsx
//
// Komponen kartu blog:
//   FeaturedPost   : artikel terbaru, kartu lebar (gambar + teks bersebelahan)
//   BlogCardItem   : kartu artikel biasa untuk grid
//   BlogSkeleton   : kerangka saat data dimuat (susunan sama dengan kartu asli, supaya layout tidak melompat)
//   default export : grid sederhana <BlogCard api={data} /> (tetap kompatibel dengan pemakaian lama)

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiCalendar, HiPhotograph } from 'react-icons/hi';

const blurb = (item) => item.subtitle || item.descriptions || '';

// Gambar sampul dengan 3 keadaan: memuat (kilau), tampil (fade), gagal (ikon)
function Cover({ src, className = '' }) {
  const ref = useRef(null);
  const [state, setState] = useState(src ? 'loading' : 'error'); // loading | loaded | error

  useEffect(() => {
    setState(src ? 'loading' : 'error');
  }, [src]);

  // Gambar yang sudah ada di cache bisa selesai sebelum onLoad terpasang
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete) setState(img.naturalWidth ? 'loaded' : 'error');
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-gray-900 ${className}`}>
      {state === 'loading' && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-gray-800 motion-reduce:animate-none" />}

      {state === 'error' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-600">
          <HiPhotograph className="h-8 w-8" aria-hidden="true" />
          <span className="text-xs">Gambar tidak tersedia</span>
        </div>
      ) : (
        <img
          ref={ref}
          src={src}
          alt=""
          loading="lazy"
          draggable={false}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

function PostTime({ item }) {
  const time = item.postBy && item.postBy.time;
  if (!time) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
      <HiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
      {time}
    </span>
  );
}

// Seluruh kartu bisa diklik lewat link judul (after:absolute memperluas area klik)
const STRETCHED_LINK =
  "outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-pink-500/60";

export function FeaturedPost({ item }) {
  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-gray-800/80 bg-gray-900/50 transition-colors duration-300 hover:border-pink-500/50 md:grid-cols-5">
      <Cover src={item.img_src} className="aspect-[16/10] w-full md:col-span-3 md:aspect-auto md:min-h-[22rem]" />

      <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 md:col-span-2">
        <span className="inline-flex w-fit rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400">
          Artikel terbaru
        </span>
        <PostTime item={item} />
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
          <Link to={`/blog/${item.slug}`} className={STRETCHED_LINK}>
            {item.title}
          </Link>
        </h2>
        <p className="line-clamp-4 text-sm leading-relaxed text-gray-400 sm:text-base">{blurb(item)}</p>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-pink-500">
          Baca artikel
          <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

export function BlogCardItem({ item }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-800/80 bg-gray-900/50 transition-colors duration-300 hover:border-pink-500/50">
      <Cover src={item.img_src} className="aspect-[16/10] w-full" />

      <div className="flex flex-1 flex-col p-5">
        <PostTime item={item} />
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-pink-400">
          <Link to={`/blog/${item.slug}`} className={STRETCHED_LINK}>
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-400">{blurb(item)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-pink-400">
          Baca artikel
          <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

const Sk = ({ className = '' }) => (
  <div aria-hidden="true" className={`animate-pulse bg-gray-800 motion-reduce:animate-none ${className}`} />
);

export function BlogSkeleton({ featured = true, count = 3 }) {
  return (
    <div aria-busy="true">
      <span role="status" className="sr-only">Memuat artikel…</span>

      {featured && (
        <div className="grid overflow-hidden rounded-3xl border border-gray-800/80 bg-gray-900/50 md:grid-cols-5">
          <Sk className="aspect-[16/10] w-full md:col-span-3 md:aspect-auto md:min-h-[22rem]" />
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 md:col-span-2">
            <Sk className="h-6 w-28 rounded-full" />
            <Sk className="h-3 w-24 rounded-md" />
            <Sk className="h-8 w-full rounded-md" />
            <Sk className="h-8 w-2/3 rounded-md" />
            <Sk className="h-3 w-full rounded-md" />
            <Sk className="h-3 w-4/5 rounded-md" />
            <Sk className="h-10 w-36 rounded-full" />
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${featured ? 'mt-8' : ''}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-gray-800/80 bg-gray-900/50">
            <Sk className="aspect-[16/10] w-full" />
            <div className="space-y-3 p-5">
              <Sk className="h-3 w-24 rounded-md" />
              <Sk className="h-5 w-4/5 rounded-md" />
              <Sk className="h-3 w-full rounded-md" />
              <Sk className="h-3 w-2/3 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Grid sederhana (pemakaian lama): <BlogCard api={data} />
export default function BlogCard({ api }) {
  if (!api || !Array.isArray(api.data)) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {api.data.filter(Boolean).map((r, i) => (
        <BlogCardItem key={r.id || r.slug || i} item={r} />
      ))}
    </div>
  );
}