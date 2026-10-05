import React, { useEffect, useRef, useState } from 'react';
import { HiArrowRight, HiPhotograph } from 'react-icons/hi';
import { FaRegCalendarAlt } from 'react-icons/fa';

// Blok abu-abu dengan kilau yang bergerak (efek skeleton)
const Sk = ({ className = '' }) => <div aria-hidden="true" className={`sk ${className}`} />;

// Kerangka kartu: susunannya sama dengan kartu asli supaya layout tidak melompat
function SkeletonCard() {
  return (
    <div>
      <Sk className="aspect-[16/10] w-full rounded-2xl" />
      <div className="mt-5 px-1">
        <Sk className="h-3 w-24 rounded-md" />
        <Sk className="mt-4 h-5 w-4/5 rounded-md" />
        <Sk className="mt-3 h-3 w-full rounded-md" />
        <Sk className="mt-2 h-3 w-2/3 rounded-md" />
        <Sk className="mt-5 h-4 w-28 rounded-md" />
      </div>
    </div>
  );
}

function BlogCard({ post: r, index }) {
  const imgRef = useRef(null);
  const [imgState, setImgState] = useState(r.img_src ? 'loading' : 'error'); // loading | loaded | error
  const [visible, setVisible] = useState(false);
  const href = `/blog/${r.slug}`;

  // Gambar yang sudah ada di cache bisa selesai sebelum onLoad terpasang
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setImgState(img.naturalWidth ? 'loaded' : 'error');
  }, []);

  // Kartu muncul bergantian (fade + naik sedikit)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40 + index * 90);
    return () => clearTimeout(t);
  }, [index]);

  const loaded = imgState === 'loaded';

  return (
    <article
      className={`group relative transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
        {imgState === 'loading' && <Sk className="absolute inset-0" />}

        {imgState === 'error' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-600">
            <HiPhotograph className="h-8 w-8" />
            <span className="text-[11px] font-medium">Gambar tidak tersedia</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={r.img_src}
            alt={r.title}
            loading="lazy"
            draggable={false}
            onLoad={() => setImgState('loaded')}
            onError={() => setImgState('error')}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 group-hover:scale-105 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Tanggal di atas gambar */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-gray-950/70 px-2.5 py-1 text-[11px] font-semibold text-pink-300 backdrop-blur-md">
          <FaRegCalendarAlt className="h-3 w-3" />
          {r.postBy?.time || 'Recent'}
        </span>
      </div>

      {/* Konten */}
      <div className="mt-5 px-1">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-pink-400">
          {/* Seluruh kartu bisa diklik lewat link ini */}
          <a
            href={href}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-pink-500/60"
          >
            {r.title}
          </a>
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-400">{r.descriptions}</p>

        <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white transition-colors group-hover:text-pink-400">
          Read Article
          <HiArrowRight className="h-4 w-4 text-pink-400 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

export default function BlogHome({ api }) {
  const isLoading = !api;
  const blogs = api?.data?.blog || [];
  const skeletonCount = blogs.length ? Math.min(blogs.length, 6) : 3;

  return (
    <>
      <style>{`
        .sk {
          background: linear-gradient(100deg, #1f2937 30%, #374151 50%, #1f2937 70%);
          background-size: 200% 100%;
          animation: sk-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes sk-shimmer {
          0% { background-position: 150% 0; }
          100% { background-position: -50% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sk { animation: none; }
        }
      `}</style>

      <section className="relative overflow-hidden bg-gray-950 py-20 transition-colors duration-300">
        {/* Cahaya latar yang lembut */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-pink-600/10 blur-3xl"
        />

        <div className="container relative mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="mx-auto mb-14 max-w-xl text-center">
            <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink-500">
              Articles &amp; News
            </span>
            <h2 className="mt-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
              Latest Blog Posts
            </h2>
            <p className="mt-2 text-xs text-gray-400 sm:text-sm">
              Berbagi pemikiran, tutorial, serta wawasan seputar teknologi dan pengembangan aplikasi.
            </p>
          </div>

          {/* Grid Artikel */}
          <div
            aria-busy={isLoading}
            className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
          >
            {isLoading ? (
              <>
                <span role="status" className="sr-only">Memuat artikel…</span>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </>
            ) : blogs.length ? (
              blogs.map((r, i) => <BlogCard key={r.id || r.slug || i} post={r} index={i} />)
            ) : (
              <p className="col-span-full py-10 text-center text-sm text-gray-500">
                Belum ada artikel untuk ditampilkan.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}