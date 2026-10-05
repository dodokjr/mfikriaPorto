import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight, HiCode, HiDeviceMobile, HiServer, HiTemplate } from 'react-icons/hi';

const STATS_DATA = [
  { value: 10, suffix: '+', decimals: 0, label: 'Projects Completed', hint: 'Web & mobile' },
  { value: 100, suffix: '%', decimals: 0, label: 'Client Satisfaction', hint: 'Revisi sampai puas' },
  { value: 2, suffix: '+', decimals: 0, label: 'Years Experience', hint: 'Membangun produk nyata' },
  { value: 99.9, suffix: '%', decimals: 1, label: 'Service Uptime', hint: 'Terpantau 24/7', isLive: true },
];

const SERVICES = [
  { icon: HiCode, label: 'Web App' },
  { icon: HiDeviceMobile, label: 'Mobile App' },
  { icon: HiServer, label: 'API & Backend' },
  { icon: HiTemplate, label: 'UI Responsif' },
];

// Angka naik dari 0 ke target begitu section terlihat
function useCountUp(target, decimals, start, duration = 1400) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setN(target);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - (1 - p) ** 3; // ease-out cubic
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);

  return n.toFixed(decimals);
}

function StatCard({ item, index, inView }) {
  const ref = useRef(null);
  const number = useCountUp(item.value, item.decimals, inView);

  // Cahaya lembut yang mengikuti kursor
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - box.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - box.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      style={{ transitionDelay: `${index * 90}ms` }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-700 hover:border-pink-500/30 sm:p-7 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), rgba(236,72,153,0.14), transparent 60%)',
        }}
      />

      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          0{index + 1}
        </span>
        {item.isLive && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
        )}
      </div>

      <div className="relative mt-6 flex items-baseline gap-0.5 tabular-nums">
        <span className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
          {number}
        </span>
        <span className="text-2xl font-black text-pink-500 sm:text-3xl">{item.suffix}</span>
      </div>

      <p className="relative mt-3 text-sm font-semibold text-white">{item.label}</p>
      <p className="relative mt-0.5 text-xs text-gray-500">{item.hint}</p>
    </div>
  );
}

export default function SectionStar() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-950 px-6 py-24 transition-colors duration-300"
    >
      {/* Dekorasi latar: grid tipis + cahaya warna */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-pink-600/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        {/* Teks & Call to Action */}
        <div
          className={`space-y-6 transition-all duration-700 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-400">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
            Services &amp; Expertise
          </span>

          <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Full-Stack &amp; Mobile{' '}
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Development
            </span>{' '}
            Solutions
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Saya menerima proyek pengembangan aplikasi web dan mobile secara <em className="not-italic text-gray-200">end-to-end</em>.
            Berfokus pada performa tinggi, desain responsif, dan arsitektur kode yang bersih.
          </p>

          <ul className="flex flex-wrap gap-2.5">
            {SERVICES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-pink-500/30 hover:text-white"
              >
                <Icon className="h-4 w-4 text-pink-400" />
                {label}
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/project')}
              className="group inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-500 hover:shadow-pink-500/40 active:scale-95"
            >
              Lihat Semua Proyek
              <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Grid Statistik */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {STATS_DATA.map((item, idx) => (
            <StatCard key={item.label} item={item} index={idx} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}