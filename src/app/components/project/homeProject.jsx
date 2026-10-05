import React, { useEffect, useRef, useState } from 'react';
import { HiExternalLink, HiArrowRight, HiPhotograph } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

// Blok abu-abu dengan kilau yang bergerak (efek skeleton)
const Sk = ({ className = '' }) => <div aria-hidden="true" className={`sk ${className}`} />;

// Kerangka kartu: ukurannya sama dengan kartu asli supaya layout tidak melompat
function SkeletonCard() {
  return <Sk className="aspect-[16/10] w-full rounded-2xl" />;
}

function ProjectCard({ project: r, onOpen }) {
  const imgRef = useRef(null);
  const cardRef = useRef(null);
  const pointerType = useRef('mouse');
  const wasActive = useRef(false);
  const [imgState, setImgState] = useState(r.img_url ? 'loading' : 'error'); // loading | loaded | error
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
            src={r.img_url}
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
      </button>

      {/* Info muncul saat hover / disentuh: title, deskripsi, GitHub, dan URL demo */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pb-4 pt-14 transition-opacity duration-300 ${show}`}
      >
        <h3 className="text-sm font-semibold capitalize tracking-tight text-white">{r.title}</h3>
        {r.descriptions && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-300">{r.descriptions}</p>
        )}

        {(r.url_github || r.url_demo) && (
          <div className="mt-3 flex items-center gap-4">
            {r.url_github && (
              <a
                href={r.url_github}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1.5 py-1 text-xs font-semibold text-gray-200 transition-colors hover:text-white ${linkPointer}`}
              >
                <FaGithub className="h-4 w-4" /> Code
              </a>
            )}
            {r.url_demo && (
              <a
                href={r.url_demo}
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

export default function HomeProject({ api }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const [modalImgLoaded, setModalImgLoaded] = useState(false);
  const modalImgRef = useRef(null);

  const isLoading = !api;
  const projects = api?.data?.project || [];
  const skeletonCount = projects.length ? Math.min(projects.length + 1, 6) : 3;

  const openModal = (item) => {
    setModalImgLoaded(false);
    setSelectedImg(item);
  };

  // Gambar modal yang sudah ada di cache bisa selesai sebelum onLoad terpasang
  useEffect(() => {
    if (selectedImg && modalImgRef.current?.complete && modalImgRef.current.naturalWidth) {
      setModalImgLoaded(true);
    }
  }, [selectedImg]);

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
                {projects.map((r, i) => (
                  <ProjectCard
                    key={r.title ?? i}
                    project={r}
                    onOpen={() =>
                      openModal({ url: r.img_url, title: r.title, github: r.url_github, demo: r.url_demo })
                    }
                  />
                ))}
                <MoreCard />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Modern Modal Fullscreen dengan Tombol Aksi */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white capitalize">{selectedImg.title}</h4>
              <button
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
                onClick={() => setSelectedImg(null)}
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Gambar Fullscreen / Preview */}
            <div className="relative w-full min-h-[12rem] max-h-[55vh] overflow-hidden rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-center mb-6 p-2">
              {!modalImgLoaded && <Sk className="absolute inset-0" />}
              <img
                ref={modalImgRef}
                src={selectedImg.url}
                alt={selectedImg.title}
                onLoad={() => setModalImgLoaded(true)}
                onError={() => setModalImgLoaded(true)}
                className={`max-h-[50vh] w-auto object-contain rounded-xl transition-opacity duration-500 ${
                  modalImgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            {/* Tombol Aksi di dalam Modal */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-800">
              {selectedImg.github && (
                <a
                  href={selectedImg.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>Lihat Kode GitHub</span>
                </a>
              )}
              {selectedImg.demo && (
                <a
                  href={selectedImg.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-all shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Kunjungi Live Demo</span>
                  <HiExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}