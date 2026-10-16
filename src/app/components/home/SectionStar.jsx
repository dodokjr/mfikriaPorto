import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiArrowRight,
  HiDeviceMobile,
  HiSparkles,
  HiLightningBolt,
  HiSearch,
  HiEye,
} from 'react-icons/hi';
import {
  SiReact,
  SiJavascript,
  SiTailwindcss,
  SiVercel,
  SiReactrouter,
  SiHtml5,
} from 'react-icons/si';

// Teknologi & bahasa yang dipakai website ini
const TECH_DATA = [
  {
    icon: SiJavascript,
    color: '#F7DF1E',
    label: 'JavaScript (JSX)',
    hint: 'Bahasa utama. Seluruh tampilan ditulis dalam komponen React.',
  },
  {
    icon: SiReact,
    color: '#61DAFB',
    label: 'React',
    hint: 'Library UI untuk komponen yang bisa dipakai ulang.',
  },
  {
    icon: SiReactrouter,
    color: '#F44250',
    label: 'React Router',
    hint: 'Pindah halaman tanpa reload: Home, Project, Blog, Hobbies, Store.',
  },
  {
    icon: SiTailwindcss,
    color: '#38BDF8',
    label: 'Tailwind CSS',
    hint: 'Styling utility-first untuk tema hitam-pink yang konsisten.',
  },
  {
    icon: SiHtml5,
    color: '#E34F26',
    label: 'HTML & CSS',
    hint: 'Markup semantik, ditambah animasi CSS keyframes.',
  },
  {
    icon: SiVercel,
    color: '#FFFFFF',
    label: 'Vercel',
    hint: 'Hosting dan deployment otomatis.',
  },
];

// Fitur yang ada di website ini
const FEATURES = [
  { icon: HiDeviceMobile, label: 'Responsif di HP & desktop' },
  { icon: HiSparkles, label: 'Animasi scroll & efek ketik' },
  { icon: HiLightningBolt, label: 'Notifikasi realtime' },
  { icon: HiSearch, label: 'Meta SEO & preview link' },
  { icon: HiEye, label: 'Mendukung reduced motion' },
];

function TechCard({ item, index, inView }) {
  const { icon: Icon, color, label, hint } = item;
  return (
    <div
      style={{ transitionDelay: `${index * 80}ms` }}
      className={`group relative overflow-hidden rounded-2xl border border-pink-500/15 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-700 hover:border-pink-500/40 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <div
        className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-gray-900"
        style={{ boxShadow: `0 0 22px ${color}33` }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <p className="mt-4 text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-400">{hint}</p>
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-site-title"
      className="relative overflow-hidden bg-gray-950 px-4 py-20 sm:px-6 sm:py-24"
    >
      {/* Dekorasi latar */}
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

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-14">
        {/* Penjelasan website */}
        <div
          className={`space-y-6 text-center transition-all duration-700 lg:text-left ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold text-pink-400">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
            Tentang website ini
          </span>

          <h2
            id="about-site-title"
            className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Portofolio yang dibangun dengan React dan Tailwind CSS
          </h2>

          <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0">
            mfikria.vercel.app adalah website portofolio saya yang berisi proyek, blog, hobi,
            dan store. Website ini ditulis dengan JavaScript (JSX), berjalan sebagai single-page
            app, dan di-deploy lewat Vercel.
          </p>

          <ul className="flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-xl border border-pink-500/15 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-pink-500/40 hover:text-white"
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
              className="group inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-500 hover:shadow-pink-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 active:scale-95"
            >
              Lihat project
              <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Bahasa & teknologi */}
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
          {TECH_DATA.map((item, idx) => (
            <TechCard key={item.label} item={item} index={idx} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}