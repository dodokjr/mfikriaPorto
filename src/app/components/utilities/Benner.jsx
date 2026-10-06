import React, { useEffect, useRef, useState } from 'react';
import {
  HiCode,
  HiSparkles,
  HiHeart,
  HiFolder,
  HiNewspaper,
  HiShoppingBag,
  HiArrowRight,
  HiCube,
} from 'react-icons/hi';

// ---------------------------------------------------------------
// Banner 3D murni CSS + React (tanpa library tambahan).
// - Kubus utama berputar, ikon di tiap sisinya = menu situsmu
// - Dua cincin orbit dengan kubus satelit
// - Kubus melayang di kedalaman berbeda (efek parallax)
// - Seluruh adegan miring mengikuti kursor / sentuhan
// - Lantai grid yang bergerak ke arah penonton
// ---------------------------------------------------------------

const REST_TILT = 'rotateX(-8deg) rotateY(14deg)';
const MAX_TILT_X = 14; // derajat
const MAX_TILT_Y = 20; // derajat
const SCENE_SIZE = 448; // ukuran dasar adegan (px) = 28rem, diskalakan otomatis sesuai lebar layar

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const CSS = `
@keyframes b3d-spin   { from { transform: rotateX(-22deg) rotateY(0deg); } to { transform: rotateX(-22deg) rotateY(360deg); } }
@keyframes b3d-tumble { from { transform: rotateX(0deg) rotateY(0deg); } to { transform: rotateX(360deg) rotateY(360deg); } }
@keyframes b3d-roll   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes b3d-float  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes b3d-shadow { 0%, 100% { transform: scale(1); opacity: .55; } 50% { transform: scale(.78); opacity: .3; } }
@keyframes b3d-grid   { from { background-position: 0 0; } to { background-position: 0 56px; } }
@media (prefers-reduced-motion: reduce) { .b3d-anim { animation: none !important; } }
`;

// Posisi tiap sisi kubus (depan, belakang, kanan, kiri, atas, bawah)
const FACE_TRANSFORMS = [
  'rotateY(0deg)',
  'rotateY(180deg)',
  'rotateY(90deg)',
  'rotateY(-90deg)',
  'rotateX(90deg)',
  'rotateX(-90deg)',
].map((t) => `${t} translateZ(calc(var(--s) / 2))`);

const TONES = {
  pink: 'border-pink-300/40 bg-gradient-to-br from-pink-500/70 to-fuchsia-700/70',
  indigo: 'border-indigo-300/40 bg-gradient-to-br from-indigo-400/70 to-indigo-800/70',
  glass: 'border-pink-400/50 bg-pink-500/10',
};

function Cube({ size, tone = 'pink', icons, animation }) {
  return (
    <div
      className="b3d-anim relative [transform-style:preserve-3d]"
      style={{ width: size, height: size, '--s': `${size}px`, animation }}
    >
      {FACE_TRANSFORMS.map((transform, i) => {
        const Icon = icons?.[i];
        return (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-center border ${TONES[tone]}`}
            style={{ transform }}
          >
            {Icon && <Icon className="h-1/3 w-1/3 text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />}
          </div>
        );
      })}
    </div>
  );
}

// Kubus kecil yang melayang di berbagai kedalaman
const FLOATERS = [
  { size: 44, left: '6%', top: '14%', z: 90, tone: 'indigo', spin: 'b3d-tumble 11s linear infinite', float: 'b3d-float 6s ease-in-out infinite' },
  { size: 30, left: '84%', top: '16%', z: 130, tone: 'pink', spin: 'b3d-tumble 8s linear infinite reverse', float: 'b3d-float 5s ease-in-out -1.5s infinite' },
  { size: 58, left: '86%', top: '64%', z: 60, tone: 'glass', spin: 'b3d-tumble 16s linear infinite', float: 'b3d-float 7s ease-in-out -3s infinite' },
  { size: 26, left: '10%', top: '74%', z: 150, tone: 'pink', spin: 'b3d-tumble 9s linear infinite', float: 'b3d-float 5.5s ease-in-out -2s infinite' },
  { size: 36, left: '48%', top: '2%', z: -90, tone: 'glass', spin: 'b3d-tumble 13s linear infinite reverse', float: 'b3d-float 6.5s ease-in-out -4s infinite' },
];

function Ring({ size, tilt, dashed, duration, reverse, tone = 'pink' }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        transform: tilt,
      }}
    >
      <div
        className={`b3d-anim absolute inset-0 rounded-full border-2 [transform-style:preserve-3d] ${
          dashed ? 'border-dashed border-indigo-400/50' : 'border-pink-400/50'
        } shadow-[0_0_24px_rgba(236,72,153,0.25)]`}
        style={{ animation: `b3d-roll ${duration}s linear infinite ${reverse ? 'reverse' : ''}` }}
      >
        {/* Kubus satelit yang mengorbit di sepanjang cincin */}
        <div className="absolute left-1/2 top-0 -ml-2 -mt-2 [transform-style:preserve-3d]">
          <Cube size={16} tone={tone} animation="b3d-tumble 4s linear infinite" />
        </div>
      </div>
    </div>
  );
}

function Scene() {
  const tiltRef = useRef(null);

  useEffect(() => {
    const layer = tiltRef.current;
    if (!layer) return undefined;
    layer.style.transform = REST_TILT;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    // Dengarkan di level jendela supaya adegan tetap bereaksi walau kursor
    // ada di bagian teks.
    const onMove = (e) => {
      const nx = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1);
      const ny = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1);
      layer.style.transform = `rotateX(${-ny * MAX_TILT_X}deg) rotateY(${nx * MAX_TILT_Y}deg)`;
    };
    const onLeave = () => {
      layer.style.transform = REST_TILT;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Skala adegan mengikuti lebar kolom yang tersedia (HP, tablet, desktop)
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(0.7);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const fit = () => setScale(clamp(wrap.clientWidth / SCENE_SIZE, 0.4, 1));
    fit();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative order-1 w-full lg:order-2"
      style={{ height: SCENE_SIZE * scale }}
    >
      <div
        className="absolute left-1/2 top-0 select-none [perspective:1100px]"
        style={{
          width: SCENE_SIZE,
          height: SCENE_SIZE,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Cahaya di belakang adegan */}
        <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(236,72,153,0.3),transparent_62%)]" />

        {/* Bayangan di lantai */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div
            className="b3d-anim h-8 w-56 rounded-[50%] bg-pink-500/40 blur-xl"
            style={{ animation: 'b3d-shadow 6s ease-in-out infinite' }}
          />
        </div>

        {/* Lapisan yang miring mengikuti kursor */}
        <div
          ref={tiltRef}
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d]"
        >
          {/* Inti bercahaya (selalu menghadap layar) */}
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff,rgba(244,114,182,0.85)_35%,transparent_70%)] blur-[2px]" />

          {/* Kubus utama: ikon tiap sisi = menu situs */}
          <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
            <Cube
              size={150}
              tone="pink"
              icons={[HiCode, HiSparkles, HiFolder, HiHeart, HiNewspaper, HiShoppingBag]}
              animation="b3d-spin 16s linear infinite"
            />
          </div>

          {/* Cincin orbit */}
          <Ring size={300} tilt="rotateX(72deg) rotateY(-12deg)" duration={14} />
          <Ring size={390} tilt="rotateX(66deg) rotateY(20deg)" duration={22} reverse dashed tone="indigo" />

          {/* Kubus-kubus melayang */}
          {FLOATERS.map((f, i) => (
            <div
              key={i}
              className="absolute [transform-style:preserve-3d]"
              style={{ left: f.left, top: f.top, transform: `translateZ(${f.z}px)` }}
            >
              <div
                className="b3d-anim [transform-style:preserve-3d]"
                style={{ animation: f.float }}
              >
                <Cube size={f.size} tone={f.tone} animation={f.spin} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Banner3D() {
  return (
    <section className="relative -mt-36 flex min-h-screen items-center overflow-hidden border-b border-gray-900/60 bg-gray-950 py-12 pl-[4.5rem] pr-4 sm:py-16 sm:pl-24 sm:pr-8 xl:px-8">
      <style>{CSS}</style>

      {/* Latar: cahaya warna */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.16),transparent_55%)]" />
      </div>

      {/* Lantai grid perspektif yang bergerak ke arah penonton */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden [mask-image:linear-gradient(to_top,black_25%,transparent)]"
      >
        <div
          className="b3d-anim absolute -inset-x-1/2 bottom-0 h-[200%] origin-bottom [transform:perspective(420px)_rotateX(62deg)]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(236,72,153,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.3) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            animation: 'b3d-grid 3s linear infinite',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Teks */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5">
            <HiCube className="h-4 w-4 text-pink-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">
              Portofolio Interaktif 3D
            </span>
          </div>

          <h1 className="mb-5 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Jelajahi Dunia
            <br />
            Dalam{' '}
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
              Tiga Dimensi
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base lg:mx-0">
            Gerakkan kursor atau jarimu di sekitar kubus. Setiap sisinya mewakili bagian dari duniaku:
            project, tulisan, hobi, sampai toko. Seluruh adegan ini dibuat murni dengan CSS 3D dan
            React.
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="/project"
              className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-600/25 transition-all hover:bg-pink-500 active:scale-95"
            >
              Lihat Project
              <HiArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/hobbies"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/70 px-5 py-3 text-sm font-bold text-gray-200 transition-all hover:border-pink-500/50 hover:text-white active:scale-95"
            >
              My Hobbies
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {['React', 'Tailwind CSS', 'CSS 3D Transform'].map((t) => (
              <span
                key={t}
                className="rounded-full border border-gray-800 bg-gray-900/60 px-3 py-1 text-[11px] font-medium text-gray-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Adegan 3D: di HP tampil di atas teks, di desktop di sebelah kanan */}
        <Scene />
      </div>
    </section>
  );
}