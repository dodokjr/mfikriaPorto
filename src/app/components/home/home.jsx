import React, { useEffect, useRef, useState } from 'react';
import { HiEye } from 'react-icons/hi';
import { FaJava } from 'react-icons/fa';
import {
  SiC,
  SiCplusplus,
  SiTypescript,
  SiJavascript,
  SiGo,
  SiPython,
} from 'react-icons/si';

/* ========================= DATA ========================= */

const TITLE = 'Penguasaan Bahasa Pemrograman';
const SUBTITLE = 'Berdasarkan project yang saya tangani';

// level = persen penguasaan.
// projects (opsional) = nama project yang memakai bahasa itu; kosongkan jika belum ingin ditampilkan.
const LANGS = [
  { name: 'C++', level: 89, Icon: SiCplusplus, color: '#659AD2', projects: [] },
  { name: 'JavaScript', level: 88, Icon: SiJavascript, color: '#F7DF1E', projects: [] },
  { name: 'TypeScript', level: 75, Icon: SiTypescript, color: '#3178C6', projects: [] },
  { name: 'Python', level: 69, Icon: SiPython, color: '#FFD43B', projects: [] },
  { name: 'Java', level: 60, Icon: FaJava, color: '#ED8B00', projects: [] }, // ganti level sesuai penguasaanmu
  { name: 'Go', level: 54, Icon: SiGo, color: '#00ADD8', projects: [] },
  { name: 'C', level: 35, Icon: SiC, color: '#A8B9CC', projects: [] },
];

/* ========================= LIVE VIEW ========================= */

const API_ORIGIN = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_ORIGIN) ||
  'https://api-mfikria.vercel.app'
).replace(/\/+$/, '');

const API_PATH = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TOKEN_PATH) ||
  '/mfikria/v1'
).replace(/\/+$/, '');

const GUEST_VIEW_URL = `${API_ORIGIN}${API_PATH}/guest-view`; // -> { status: 'success', view: 18 }
const POLL_MS = 60 * 1000; // perbarui tiap 1 menit (hemat request; backend + CDN juga cache 30 detik)

const LIVE_CSS = `
@keyframes b3d-pop { 0% { transform: scale(1.35); color: #6ee7b7; } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .b3d-anim { animation: none !important; } }
`;

// Ambil jumlah view. Berhenti saat tab tersembunyi, langsung segar saat tab dibuka lagi.
function useGuestView() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let alive = true;
    let controller = null;

    const load = async () => {
      if (document.hidden) return;
      if (controller) controller.abort();
      controller = new AbortController();
      try {
        const res = await fetch(GUEST_VIEW_URL, { signal: controller.signal });
        if (!res.ok) return;
        const body = await res.json();
        const n = Number(body && body.view);
        if (alive && Number.isFinite(n)) setCount(n);
      } catch (error) {
        /* jaringan gagal / dibatalkan: pertahankan angka terakhir */
      }
    };

    const onVisible = () => {
      if (!document.hidden) load();
    };

    load();
    const timer = setInterval(load, POLL_MS);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      alive = false;
      clearInterval(timer);
      if (controller) controller.abort();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return count;
}

function LiveViews() {
  const count = useGuestView();

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5"
      title="Jumlah pengunjung yang tercatat"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2">
        <span className="b3d-anim absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <HiEye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
        Live
      </span>
      {count === null ? (
        <span className="h-3 w-8 animate-pulse rounded bg-emerald-400/20" />
      ) : (
        <span
          key={count}
          className="b3d-anim text-xs font-bold tabular-nums text-dark dark:text-white"
          style={{ animation: 'b3d-pop 0.5s ease-out' }}
        >
          {count.toLocaleString('id-ID')}
          <span className="ml-1 font-medium text-gray-500 dark:text-gray-400">pengunjung</span>
        </span>
      )}
    </div>
  );
}

/* ========================= JUDUL INTERAKTIF ========================= */

// Huruf di dekat kursor / jari terangkat, membesar, berwarna,
// dan punya bayangan tebal sehingga terlihat 3D. Bekerja untuk mouse maupun sentuhan.
const NAME_RADIUS = 85; // jangkauan efek (px)

function InteractiveName({ name }) {
  const wrapRef = useRef(null);
  const timerRef = useRef(0);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reset = () => {
    if (!wrapRef.current) return;
    wrapRef.current.querySelectorAll('[data-l]').forEach((el) => {
      el.style.setProperty('--e', '0');
      el.style.transform = '';
    });
  };

  const apply = (e) => {
    if (!wrapRef.current || reducedMotion()) return;
    clearTimeout(timerRef.current);

    const box = wrapRef.current.getBoundingClientRect();
    const px = e.clientX - box.left;
    const py = e.clientY - box.top;

    wrapRef.current.querySelectorAll('[data-l]').forEach((el) => {
      // offsetLeft/Top tidak terpengaruh transform, jadi tidak bergetar
      const cx = el.offsetLeft + el.offsetWidth / 2;
      const cy = el.offsetTop + el.offsetHeight / 2;
      const k = Math.max(0, 1 - Math.hypot(px - cx, py - cy) / NAME_RADIUS);
      el.style.setProperty('--e', k.toFixed(3));
      el.style.transform = `translateY(${-k * 12}px) translateZ(${k * 40}px) scale(${1 + k * 0.2})`;
    });
  };

  const onLeave = (e) => {
    if (e.pointerType === 'mouse') reset();
  };

  // Sentuhan: biarkan efek bertahan sebentar setelah jari diangkat
  const onUp = (e) => {
    if (e.pointerType !== 'mouse') {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(reset, 600);
    }
  };

  const words = name.split(' ');
  const total = name.replace(/ /g, '').length || 1;
  let index = 0;

  return (
    <span
      ref={wrapRef}
      aria-label={name}
      onPointerMove={apply}
      onPointerDown={apply}
      onPointerUp={onUp}
      onPointerLeave={onLeave}
      onPointerCancel={reset}
      className="relative inline-block cursor-default select-none touch-pan-y [perspective:600px]"
    >
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          {wi > 0 && ' '}
          <span aria-hidden="true" className="inline-block whitespace-nowrap">
            {[...word].map((ch) => {
              const hue = 280 + (index++ / total) * 60; // ungu -> pink
              return (
                <span
                  key={index}
                  data-l=""
                  className="inline-block transition-[transform,color,text-shadow] duration-300 ease-out will-change-transform [text-shadow:0_calc(var(--e)*5px)_0_rgba(168,85,247,0.45)]"
                  style={{
                    '--e': 0,
                    color: `color-mix(in srgb, hsl(${hue} 85% 60%) calc(var(--e) * 100%), currentColor)`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        </React.Fragment>
      ))}
    </span>
  );
}

/* ========================= PERSENTASE ========================= */

const RING_R = 44;
const RING_C = 2 * Math.PI * RING_R;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Cincin terisi dan angka naik sekali saat kartu masuk layar.
function LangCard({ name, level, Icon, color, projects, delay }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(level);
      return undefined;
    }

    let raf = 0;
    let timer = 0;

    const run = () => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / 1300);
        setValue(Math.round(level * easeOut(t)));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(run, delay);
      },
      { threshold: 0.35 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [level, delay]);

  return (
    <li
      ref={ref}
      className="flex flex-col items-center p-5 text-center"
    >
      <div
        className="relative h-28 w-28"
        role="img"
        aria-label={`${name}: ${level} persen`}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={RING_R}
            fill="none"
            strokeWidth="7"
            className="stroke-slate-200 dark:stroke-slate-700"
          />
          <circle
            cx="50"
            cy="50"
            r={RING_R}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            stroke={color}
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - value / 100)}
            style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <Icon size={34} style={{ color }} />
        </div>
      </div>

      <p className="mt-3 text-3xl font-extrabold tabular-nums text-dark dark:text-white">
        {value}
        <span className="text-xl text-secondary">%</span>
      </p>
      <p className="mt-0.5 font-semibold text-dark dark:text-white">{name}</p>

      {projects && projects.length > 0 && (
        <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
          {projects.map((p) => (
            <li
              key={p}
              className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-secondary dark:border-slate-700"
            >
              {p}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/* ========================= HOME ========================= */

export default function Home({ data }) {
  if (!data) return null;

  return (
    <section id="home" className="overflow-x-clip pt-32 pb-16 transition-colors duration-300 dark:bg-dark">
      <style>{LIVE_CSS}</style>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-dark dark:text-white lg:text-5xl">
            <InteractiveName name={TITLE} />
          </h1>
          <p className="mt-3 text-base font-medium text-secondary lg:text-lg">{SUBTITLE}</p>

          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
            {LANGS.map((lang, i) => (
              <LangCard key={lang.name} {...lang} delay={i * 110} />
            ))}
          </ul>

          {/* Tombol & Badge */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="mailto:ffikri604@gmail.com"
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white shadow-[0_6px_0_0_rgba(88,28,135,0.9),0_18px_30px_-10px_rgba(168,85,247,0.55)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(88,28,135,0.9)]"
            >
              Contact Me
            </a>
            <img
              src="https://komarev.com/ghpvc/?username=dodokjr&label=Visitors&color=2836F0&style=flat"
              alt="Profile visitor"
              className="h-7"
            />
            <LiveViews />
          </div>

        </div>
      </div>
    </section>
  );
}