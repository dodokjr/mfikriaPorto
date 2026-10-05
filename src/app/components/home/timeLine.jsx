import React, { useEffect, useRef } from 'react';

// ---------------------------------------------------------------
// Pengaturan animasi scroll (posisi vertikal pusat item di layar:
// 0 = tepi atas, 1 = tepi bawah)
// ---------------------------------------------------------------
const ENTER_START = 0.92; // item mulai muncul dari bawah
const ENTER_END = 0.68; //   item sudah penuh terlihat
const EXIT_START = 0.32; //  item mulai bergeser ke kanan
const EXIT_END = -0.1; //    item sudah hilang di sisi kanan

const TIMELINE_DATA = [
  {
    id: 'elementary',
    year: '2017',
    title: 'Sekolah Dasar',
    description: 'Mulai mempelajari dasar-dasar pendidikan.',
  },
  {
    id: 'junior-high',
    year: '2021',
    title: 'SMP',
    description: 'Menemukan ketertarikan pada teknologi lewat video game di warnet.',
  },
  {
    id: 'senior-high',
    year: '2024',
    title: 'SMA',
    description: 'Menemukan passion di game development dan belajar secara otodidak untuk mengasah skill.',
  },
  {
    id: 'freelance-frontend',
    year: '2024 - Sekarang',
    title: 'Freelance Frontend Developer',
    description: 'Membangun aplikasi web modern dan terintegrasi untuk berbagai klien.',
    tags: ['React', 'Tailwind CSS'],
    current: true,
  },
];

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t * t;

function Marker({ current }) {
  // Penanda berbentuk "=" (dua batang) di atas garis tengah
  const bar = current
    ? 'bg-pink-400 shadow-[0_0_10px_2px_rgba(236,72,153,0.7)]'
    : 'bg-pink-500/80';

  return (
    <span className="absolute left-2.5 top-5 flex h-4 w-7 -translate-x-1/2 items-center justify-center md:left-1/2">
      {current && (
        <span
          aria-hidden="true"
          className="absolute h-full w-full rounded-md bg-pink-500/30 motion-safe:animate-ping"
        />
      )}
      {/* Latar hitam supaya garis tidak tembus di sela batang */}
      <span className="relative flex flex-col items-center gap-[3px] rounded-sm bg-black px-0.5 py-[3px]">
        <span className={`block h-[3px] w-5 rounded-full ${bar}`} />
        <span className={`block h-[3px] w-5 rounded-full ${bar}`} />
      </span>
    </span>
  );
}

function Card({ item, alignRight }) {
  return (
    <div
      className={`relative ${
        alignRight ? 'md:col-start-1 md:pr-10' : 'md:col-start-2 md:pl-10'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-[28px] hidden h-px w-10 bg-pink-500/40 md:block ${
          alignRight ? 'right-0' : 'left-0'
        }`}
      />

      <article
        className={`rounded-2xl border p-5 transition-colors ${
          alignRight ? 'md:text-right' : ''
        } ${
          item.current
            ? 'border-pink-500/50 bg-pink-500/[0.08] shadow-[0_0_48px_-14px_rgba(236,72,153,0.65)]'
            : 'border-white/10 bg-neutral-900/70 hover:border-pink-500/40'
        }`}
      >
        <div className={`flex items-center gap-2 ${alignRight ? 'md:justify-end' : ''}`}>
          <time className="font-mono text-xs text-pink-300">{item.year}</time>
          {item.current && (
            <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              Saat ini
            </span>
          )}
        </div>

        <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">{item.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.description}</p>

        {item.tags?.length > 0 && (
          <ul className={`mt-4 flex flex-wrap gap-2 ${alignRight ? 'md:justify-end' : ''}`}>
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}

export default function TimeLine() {
  const itemRefs = useRef([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;

      itemRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const t = (rect.top + rect.height / 2) / vh;

        // e: 0 → 1 saat item masuk dari bawah
        const e = easeOut(clamp((ENTER_START - t) / (ENTER_START - ENTER_END)));
        // x: 0 → 1 saat item keluar ke kanan (atas layar)
        const x = easeIn(clamp((EXIT_START - t) / (EXIT_START - EXIT_END)));

        const rest = 1 - e;
        el.style.opacity = String(e * (1 - x));
        el.style.transform =
          `translate3d(${x * 110}%, ${rest * 70}px, ${-rest * 200}px) ` +
          `rotateX(${rest * 28}deg) rotateY(${x * 50}deg)`;
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      className="flex justify-center overflow-x-clip bg-black px-4 pb-48 pt-10"
      aria-label="Perjalanan karier"
    >
      <ol className="relative w-full max-w-4xl [perspective:1200px]">
        {/* Garis tunggal, lurus, menyambung dari atas sampai bawah */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-2.5 top-5 w-[2px] -translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.4)] [-webkit-mask-image:linear-gradient(to_bottom,#000_80%,transparent)] [mask-image:linear-gradient(to_bottom,#000_80%,transparent)] md:left-1/2"
          style={{
            background:
              'linear-gradient(to right, #f9a8d4 0%, #ec4899 50%, #9d174d 100%)',
          }}
        />

        {TIMELINE_DATA.map((item, index) => {
          return (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="relative pb-8 pl-10 will-change-transform md:grid md:grid-cols-2 md:pl-0"
            >
              <Marker current={item.current} />
              <Card item={item} alignRight={index % 2 === 0} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}