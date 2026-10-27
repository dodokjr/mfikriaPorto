import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  HiExternalLink,
  HiArrowRight,
  HiPhotograph,
  HiChevronLeft,
  HiChevronRight,
  HiX,
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

// ------------------------------------------------------------
// Normalisasi data: baca skema baru (gambar, deskripsi, teknologi, tautan)
// dan tetap mengerti skema lama supaya data lama tidak rusak.
// ------------------------------------------------------------
const normalize = (p, i) => {
  const gambar = Array.isArray(p.gambar)
    ? p.gambar
    : Array.isArray(p.images)
      ? p.images
      : p.img_url
        ? [p.img_url]
        : [];

  return {
    id: p.id ?? p.slug ?? i,
    title: p.title,
    kategori: p.kategori,
    deskripsi: p.deskripsi ?? p.keterangan ?? p.descriptions ?? '',
    teknologi: Array.isArray(p.teknologi) ? p.teknologi : Array.isArray(p.code) ? p.code : [],
    github: p.tautan?.github ?? p.url_github,
    demo: p.tautan?.demo ?? p.url_demo,
    gambar: gambar.filter(Boolean),
  };
};

// Blok abu-abu dengan kilau yang bergerak (efek skeleton)
const Sk = ({ className = '' }) => <div aria-hidden="true" className={`sk ${className}`} />;

// Kerangka kartu: ukurannya sama dengan kartu asli supaya layout tidak melompat
function SkeletonCard() {
  return <Sk className="aspect-[16/10] w-full rounded-2xl" />;
}

// ------------------------------------------------------------
// Kartu proyek (cover = gambar pertama)
// ------------------------------------------------------------
function ProjectCard({ project: r, onOpen }) {
  const cover = r.gambar[0];
  const imgRef = useRef(null);
  const cardRef = useRef(null);
  const pointerType = useRef('mouse');
  const wasActive = useRef(false);
  const [imgState, setImgState] = useState(cover ? 'loading' : 'error'); // loading | loaded | error
  const [active, setActive] = useState(false); // dipakai untuk sentuhan (touch)

  // Gambar yang sudah ada di cache bisa selesai sebelum onLoad terpasang
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setImgState(img.naturalWidth ? 'loaded' : 'error');
  }, []);

  // Sentuh di luar kartu -> sembunyikan info
  useEffect(() => {
    if (!active) return undefined;
    const onDown = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setActive(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [active]);

  // Di layar sentuh: begitu disentuh langsung tampil semua info,
  // ketukan berikutnya pada gambar membuka detail
  const handlePointerDown = (e) => {
    pointerType.current = e.pointerType;
    wasActive.current = active;
    if (e.pointerType !== 'mouse') setActive(true);
  };

  // Layar digeser (scroll) -> sentuhan dibatalkan, info tidak ikut muncul
  const handlePointerCancel = (e) => {
    if (e.pointerType !== 'mouse' && !wasActive.current) setActive(false);
  };

  const handleClick = (e) => {
    // e.detail === 0 berarti klik dari keyboard: langsung buka detail
    const fromTouch = e.detail !== 0 && pointerType.current !== 'mouse';
    if (fromTouch && !wasActive.current) return;
    onOpen();
  };

  const loaded = imgState === 'loaded';
  // Hover hanya untuk perangkat yang punya kursor, supaya di HP info tidak menempel
  const show = active
    ? 'opacity-100'
    : 'opacity-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-within:opacity-100';
  const linkPointer = active
    ? 'pointer-events-auto'
    : '[@media(hover:hover)]:group-hover:pointer-events-auto group-focus-within:pointer-events-auto';

  return (
    <article ref={cardRef} className="group relative">
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerCancel={handlePointerCancel}
        onClick={handleClick}
        aria-label={`Lihat detail ${r.title}`}
        className="relative block aspect-[16/10] w-full overflow-hidden rounded-2xl text-left outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-pink-500/60"
      >
        {/* Skeleton tampil selama gambar belum selesai dimuat */}
        {imgState === 'loading' && <Sk className="absolute inset-0" />}

        {imgState === 'error' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-600">
            <HiPhotograph className="h-8 w-8" />
            <span className="text-[11px] font-medium">Gambar tidak tersedia</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={cover}
            alt={r.title}
            loading="lazy"
            draggable={false}
            onLoad={() => setImgState('loaded')}
            onError={() => setImgState('error')}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 [@media(hover:hover)]:group-hover:scale-105 ${
              active ? 'scale-105' : ''
            } ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Penanda: proyek ini punya lebih dari satu gambar */}
        {r.gambar.length > 1 && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gray-950/70 px-2 py-1 text-[11px] font-semibold text-gray-200 backdrop-blur">
            <HiPhotograph className="h-3.5 w-3.5" />
            {r.gambar.length}
          </span>
        )}
      </button>

      {/* Info muncul saat hover / disentuh: title, deskripsi, GitHub, dan URL demo */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pb-4 pt-14 transition-opacity duration-300 ${show}`}
      >
        <h3 className="text-sm font-semibold capitalize tracking-tight text-white">{r.title}</h3>
        {r.deskripsi && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-300">{r.deskripsi}</p>
        )}

        {(r.github || r.demo) && (
          <div className="mt-3 flex items-center gap-4">
            {r.github && (
              <a
                href={r.github}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1.5 py-1 text-xs font-semibold text-gray-200 transition-colors hover:text-white ${linkPointer}`}
              >
                <FaGithub className="h-4 w-4" /> Code
              </a>
            )}
            {r.demo && (
              <a
                href={r.demo}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1.5 py-1 text-xs font-semibold text-pink-400 transition-colors hover:text-pink-300 ${linkPointer}`}
              >
                Live Demo <HiExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function MoreCard() {
  return (
    <a
      href="/project"
      className="group flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl text-gray-400 transition-colors hover:text-white"
    >
      <span className="text-sm font-semibold">Lihat Semua Proyek</span>
      <HiArrowRight className="h-5 w-5 text-pink-400 transition-transform group-hover:translate-x-1" />
    </a>
  );
}

// ------------------------------------------------------------
// Satu slide gambar di dalam galeri modal
// ------------------------------------------------------------
function Slide({ src, alt, hidden }) {
  const ref = useRef(null);
  const [state, setState] = useState(src ? 'loading' : 'error'); // loading | loaded | error

  // Gambar yang sudah ada di cache bisa selesai sebelum onLoad terpasang
  useEffect(() => {
    const img = ref.current;
    if (img?.complete) setState(img.naturalWidth ? 'loaded' : 'error');
  }, []);

  return (
    <div aria-hidden={hidden} className="relative flex h-full w-full shrink-0 items-center justify-center p-2">
      {state === 'loading' && <Sk className="absolute inset-2 rounded-xl" />}

      {state === 'error' ? (
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <HiPhotograph className="h-8 w-8" />
          <span className="text-[11px] font-medium">Gambar tidak tersedia</span>
        </div>
      ) : (
        <img
          ref={ref}
          src={src}
          alt={alt}
          draggable={false}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`max-h-full max-w-full rounded-xl object-contain transition-opacity duration-500 ${
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Galeri: geser kiri/kanan (swipe / drag), tombol panah, titik penanda
// ------------------------------------------------------------
function Gallery({ images, title, index, onChange }) {
  const last = images.length - 1;
  const many = images.length > 1;

  const viewportRef = useRef(null);
  const startRef = useRef(null); // { x, t } saat jari/kursor turun
  const dxRef = useRef(0); // jarak geser mentah
  const widthRef = useRef(0);
  const [drag, setDrag] = useState(0); // jarak geser yang ditampilkan (dengan efek "tarik karet" di ujung)
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = (e) => {
    if (!many || (e.pointerType === 'mouse' && e.button !== 0)) return;
    startRef.current = { x: e.clientX, t: Date.now() };
    widthRef.current = viewportRef.current?.offsetWidth || 1;
    dxRef.current = 0;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    dxRef.current = dx;
    // Di gambar pertama/terakhir, geseran terasa berat supaya jelas sudah di ujung
    const atEdge = (index === 0 && dx > 0) || (index === last && dx < 0);
    setDrag(atEdge ? dx / 3 : dx);
  };

  const finish = (cancelled) => {
    const s = startRef.current;
    if (!s) return;
    startRef.current = null;
    const dx = dxRef.current;
    dxRef.current = 0;
    setDragging(false);
    setDrag(0);
    if (cancelled) return; // browser mengambil alih (mis. scroll vertikal)

    const far = Math.abs(dx) > widthRef.current * 0.2;
    const fast = Math.abs(dx) > 30 && Date.now() - s.t < 300;
    if (!far && !fast) return;
    if (dx < 0) onChange(Math.min(last, index + 1));
    else if (dx > 0) onChange(Math.max(0, index - 1));
  };

  return (
    <div role="group" aria-roledescription="carousel" aria-label={`Gambar ${title}`}>
      <div
        ref={viewportRef}
        className="relative h-[42vh] min-h-[12rem] w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 sm:h-[52vh]"
      >
        {/* Jalur slide: digeser lewat transform */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={() => finish(false)}
          onPointerCancel={() => finish(true)}
          className={`flex h-full w-full select-none touch-pan-y ${
            many ? 'cursor-grab active:cursor-grabbing' : ''
          } ${dragging ? '' : 'transition-transform duration-300 ease-out motion-reduce:transition-none'}`}
          style={{ transform: `translateX(calc(${-index * 100}% + ${drag}px))` }}
        >
          {images.map((src, i) => (
            <Slide
              key={src ?? i}
              src={src}
              alt={`${title} (${i + 1} dari ${images.length})`}
              hidden={i !== index}
            />
          ))}
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={() => onChange(Math.max(0, index - 1))}
              disabled={index === 0}
              aria-label="Gambar sebelumnya"
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-950/70 text-white backdrop-blur transition-opacity hover:bg-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60 disabled:pointer-events-none disabled:opacity-0"
            >
              <HiChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onChange(Math.min(last, index + 1))}
              disabled={index === last}
              aria-label="Gambar berikutnya"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-950/70 text-white backdrop-blur transition-opacity hover:bg-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60 disabled:pointer-events-none disabled:opacity-0"
            >
              <HiChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {many && (
        <div className="mt-2 flex justify-center">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              aria-label={`Lihat gambar ${i + 1} dari ${images.length}`}
              aria-current={i === index}
              className="flex h-5 items-center px-1 focus-visible:outline-none"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-pink-500' : 'w-1.5 bg-gray-600 hover:bg-gray-500'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Modal detail proyek
// ------------------------------------------------------------
function ProjectModal({ project: p, onClose }) {
  const images = p.gambar.length ? p.gambar : [null];
  const last = images.length - 1;
  const [index, setIndex] = useState(0);
  const closeRef = useRef(null);
  const downOnBackdrop = useRef(false);

  // Keyboard: Esc menutup, panah kiri/kanan berpindah gambar. Scroll halaman dikunci selama modal terbuka.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') setIndex((i) => Math.min(last, i + 1));
      else if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [last, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 p-4 backdrop-blur-md"
      // Tutup hanya jika tekan DAN lepas di latar belakang (geser gambar yang berakhir di luar tidak menutup modal)
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (downOnBackdrop.current && e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-y-auto rounded-3xl border border-gray-800 bg-gray-900 p-5 shadow-2xl sm:p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h4 className="text-base font-bold capitalize text-white">{p.title}</h4>
            {p.kategori && (
              <span className="mt-1.5 inline-block rounded-full border border-pink-500/20 bg-pink-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-pink-400">
                {p.kategori}
              </span>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60"
          >
            <HiX className="h-4 w-4" />
          </button>
        </div>

        <Gallery images={images} title={p.title} index={index} onChange={setIndex} />

        {p.deskripsi && (
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-300">{p.deskripsi}</p>
        )}

        {p.teknologi.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Teknologi">
            {p.teknologi.map((t) => (
              <li
                key={t}
                className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-[11px] font-medium text-gray-300"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        {(p.github || p.demo) && (
          <div className="mt-6 flex w-full flex-col items-center justify-end gap-3 border-t border-gray-800 pt-4 sm:flex-row">
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-700 bg-gray-800 px-6 py-3 text-xs font-bold text-white transition-all hover:bg-gray-700 active:scale-95 sm:w-auto"
              >
                <FaGithub className="h-4 w-4" />
                <span>Lihat Kode GitHub</span>
              </a>
            )}
            {p.demo && (
              <a
                href={p.demo}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-pink-600/20 transition-all hover:bg-pink-500 active:scale-95 sm:w-auto"
              >
                <span>Kunjungi Live Demo</span>
                <HiExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Section utama
// ------------------------------------------------------------
export default function HomeProject({ api }) {
  const [selected, setSelected] = useState(null);

  const isLoading = !api;
  const projects = useMemo(() => (api?.data?.project || []).map(normalize), [api]);
  const skeletonCount = projects.length ? Math.min(projects.length + 1, 6) : 3;

  const closeModal = useCallback(() => setSelected(null), []);

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

      <section className="bg-gray-950 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Header Section Minimalis */}
          <div className="mx-auto max-w-xl text-center mb-12">
            <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
              Portfolio
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">
              Featured Projects
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-400">
              Kumpulan proyek pilihan yang pernah saya kerjakan.
            </p>
          </div>

          {/* Grid Projects */}
          <div aria-busy={isLoading} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <>
                <span role="status" className="sr-only">Memuat proyek…</span>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </>
            ) : (
              <>
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} onOpen={() => setSelected(p)} />
                ))}
                <MoreCard />
              </>
            )}
          </div>
        </div>
      </section>

      {selected && <ProjectModal key={selected.id} project={selected} onClose={closeModal} />}
    </>
  );
}