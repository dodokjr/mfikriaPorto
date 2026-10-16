import React, { useEffect, useState } from 'react';
import { HiArrowRight, HiMail } from 'react-icons/hi';
import {
  FaJava,
  FaGithub,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaSteam,
  FaDiscord,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import {
  SiTypescript,
  SiJavascript,
  SiGo,
  SiPython,
  SiC,
  SiCplusplus,
  SiReact,
} from 'react-icons/si';

/* ========================= DATA ========================= */

const NAME = 'M. Fikri Ardiyansah';
const ROLES = ['Frontend Developer', 'Backend Developer', 'UI Builder', 'Gamers', 'Photographer'];

const LANGS = [
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
  { name: 'Go', Icon: SiGo, color: '#00ADD8' },
  { name: 'Python', Icon: SiPython, color: '#FFD43B' },
  { name: 'Java', Icon: FaJava, color: '#ED8B00' },
  { name: 'C', Icon: SiC, color: '#A8B9CC' },
  { name: 'C++', Icon: SiCplusplus, color: '#659AD2' },
];

const SOCIALS = [
  { key: 'github', label: 'GitHub', Icon: FaGithub, hover: 'hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram, hover: 'hover:text-[#E4405F] hover:drop-shadow-[0_0_8px_rgba(228,64,95,0.6)]' },
  { key: 'youtube', label: 'YouTube', Icon: FaYoutube, hover: 'hover:text-[#FF0000] hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.55)]' },
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedin, hover: 'hover:text-[#0A66C2] hover:drop-shadow-[0_0_8px_rgba(10,102,194,0.6)]' },
  { key: 'discord', label: 'Discord', Icon: FaDiscord, hover: 'hover:text-[#5865F2] hover:drop-shadow-[0_0_8px_rgba(88,101,242,0.6)]' },
  { key: 'steam', label: 'Steam', Icon: FaSteam, hover: 'hover:text-[#66C0F4] hover:drop-shadow-[0_0_8px_rgba(102,192,244,0.6)]' },
  { key: 'twitter', label: 'X (Twitter)', Icon: FaXTwitter, hover: 'hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' },
];

const ORBIT_SECONDS = 36;
const RADIUS = 40; // persen dari lebar kotak orbit (sedikit dikecilkan agar ikon tidak keluar di HP kecil)

const CSS = `
@keyframes fe-orbit   { to { transform: rotate(360deg); } }
@keyframes fe-counter { to { transform: rotate(-360deg); } }
@keyframes fe-blink   { 50% { opacity: 0; } }
@keyframes fe-rise    { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes fe-pulse   { 0%, 100% { opacity: .55; transform: scale(1); } 50% { opacity: .9; transform: scale(1.06); } }
.fe-orbit:hover, .fe-orbit:hover .fe-counter { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .fe-anim { animation: none !important; } }
`;

/* ========================= HOOK ========================= */

function useTypewriter(words, { type = 70, erase = 40, hold = 1600 } = {}) {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let i = 0;
    let n = words[0].length;
    let deleting = true;
    let timer;

    const tick = () => {
      const word = words[i];
      if (deleting) {
        n -= 1;
        setText(word.slice(0, n));
        if (n === 0) {
          deleting = false;
          i = (i + 1) % words.length;
        }
        timer = setTimeout(tick, erase);
      } else {
        const next = words[i];
        n += 1;
        setText(next.slice(0, n));
        if (n === next.length) {
          deleting = true;
          timer = setTimeout(tick, hold);
        } else {
          timer = setTimeout(tick, type);
        }
      }
    };

    timer = setTimeout(tick, hold);
    return () => clearTimeout(timer);
  }, [words, type, erase, hold]);

  return text;
}

/* ========================= ORBIT ========================= */

function LanguageOrbit() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[18rem] min-[400px]:max-w-[22rem] sm:max-w-[26rem]"
      role="img"
      aria-label={`Bahasa pemrograman: ${LANGS.map((l) => l.name).join(', ')}`}
    >
      {/* Cahaya latar */}
      <div className="fe-anim absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.35),transparent_65%)] [animation:fe-pulse_5s_ease-in-out_infinite]" />

      {/* Garis lintasan */}
      <div
        className="absolute rounded-full border border-dashed border-pink-400/30"
        style={{ inset: `${50 - RADIUS}%` }}
      />
      <div className="absolute inset-[24%] rounded-full border border-indigo-400/20" />

      {/* Kartu tengah */}
      <div className="absolute left-1/2 top-1/2 w-[50%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-gray-900/80 shadow-2xl shadow-pink-600/20 backdrop-blur sm:w-[46%]">
        <div className="flex items-center gap-1.5 border-b border-white/5 px-2.5 py-1.5 sm:px-3 sm:py-2">
          <span className="h-2 w-2 rounded-full bg-pink-500/80" />
          <span className="h-2 w-2 rounded-full bg-indigo-400/80" />
          <span className="h-2 w-2 rounded-full bg-gray-600" />
        </div>
        <pre className="m-0 overflow-hidden px-2.5 py-2.5 font-mono text-[9px] leading-relaxed text-gray-300 min-[400px]:text-[10px] sm:px-3 sm:py-3 sm:text-[11px]">
          <span className="text-indigo-300">const</span> <span className="text-pink-300">dev</span> = {'{'}
          {'\n'}  role: <span className="text-emerald-300">'frontend'</span>,
          {'\n'}  loves: <span className="text-emerald-300">'UI'</span>,
          {'\n'}{'}'}
        </pre>
        <div className="flex items-center gap-1.5 border-t border-white/5 px-2.5 py-1.5 text-[9px] text-gray-400 sm:gap-2 sm:px-3 sm:py-2 sm:text-[10px]">
          <SiReact className="h-3 w-3 shrink-0 text-sky-400 sm:h-3.5 sm:w-3.5" />
          <span className="truncate">Dibangun dengan React</span>
        </div>
      </div>

      {/* Ikon bahasa yang mengorbit */}
      <div
        className="fe-anim fe-orbit absolute inset-0"
        style={{ animation: `fe-orbit ${ORBIT_SECONDS}s linear infinite` }}
      >
        {LANGS.map(({ name, Icon, color }, i) => {
          const angle = (i / LANGS.length) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + RADIUS * Math.cos(angle);
          const top = 50 + RADIUS * Math.sin(angle);
          return (
            <div
              key={name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div
                className="fe-anim fe-counter group relative"
                style={{ animation: `fe-counter ${ORBIT_SECONDS}s linear infinite` }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gray-900/90 shadow-lg transition-transform duration-200 hover:scale-110 min-[400px]:h-11 min-[400px]:w-11 sm:h-14 sm:w-14"
                  style={{ boxShadow: `0 0 22px ${color}33` }}
                  title={name}
                >
                  <Icon className="h-5 w-5 sm:h-7 sm:w-7" style={{ color }} />
                </div>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-0.5 text-[10px] font-medium text-gray-200 opacity-0 transition-opacity group-hover:opacity-100">
                  {name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ========================= BANNER ========================= */

export default function BannerFrontend({ data }) {
  const role = useTypewriter(ROLES);
  const sosial = (data && data.data && data.data.media_sosial) || {};

  return (
    // Mobile: padding kiri & kanan SAMA (px-4) supaya konten presisi di tengah.
    // Offset kiri untuk sidebar (pl-24) baru dipakai mulai layar sm ke atas.
    <section className="relative mx-3 mb-6 mt-6 overflow-hidden rounded-3xl border border-gray-800/80 bg-gray-950 px-4 py-10 sm:mx-4 sm:mt-8 sm:py-16 sm:pl-24 sm:pr-8 xl:mx-6 xl:px-10">
      <style>{CSS}</style>

      {/* Latar */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.18),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center justify-items-center gap-8 sm:gap-10 lg:grid-cols-[1.1fr_1fr] lg:justify-items-stretch lg:gap-12">
        {/* Teks */}
        <div className="fe-anim order-2 flex w-full min-w-0 flex-col items-center text-center [animation:fe-rise_0.7s_ease-out_both] lg:order-1 lg:items-start lg:text-left">
          <p className="mb-3 text-sm font-medium text-pink-400 sm:text-base">Halo, saya {NAME}</p>

          <h1 className="mb-3 text-[2rem] font-black leading-[1.1] tracking-tight text-white min-[400px]:text-4xl sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Saya membangun
            <br />
            antarmuka web
          </h1>

          <p className="mb-5 flex h-9 items-center justify-center text-xl font-bold sm:text-2xl lg:h-10 lg:justify-start lg:text-3xl">
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
              {role}
            </span>
            <span className="fe-anim ml-0.5 inline-block h-[0.9em] w-[3px] bg-pink-400 [animation:fe-blink_1s_steps(1)_infinite]" />
          </p>

          <p className="mb-8 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
            Saya mengubah desain menjadi halaman yang cepat, rapi, dan nyaman dipakai di HP maupun
            desktop. Sehari-hari saya menulis React dan Tailwind, dan saya juga mengerti sisi
            belakangnya lewat Go, Python, Java, C, dan C++.
          </p>

          <div className="mb-8 flex w-full flex-col items-stretch justify-center gap-3 min-[400px]:w-auto min-[400px]:flex-row min-[400px]:items-center lg:justify-start">
            <a
              href="/project"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-600/25 transition-all hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 active:scale-95"
            >
              Lihat project
              <HiArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900/70 px-5 py-3 text-sm font-bold text-gray-200 transition-all hover:border-pink-500/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 active:scale-95"
            >
              <HiMail className="h-4 w-4" />
              Hubungi saya
            </a>
          </div>

          {/* Deret ikon bahasa */}
          <ul className="flex flex-wrap items-center justify-center gap-2 lg:justify-start" aria-label="Bahasa pemrograman">
            {LANGS.map(({ name, Icon, color }) => (
              <li
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-800 bg-gray-900/60 px-3 py-1 text-[11px] font-medium text-gray-300"
              >
                <Icon className="h-3.5 w-3.5" style={{ color }} />
                {name}
              </li>
            ))}
          </ul>

          {/* Media sosial */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-gray-400 lg:justify-start">
            {SOCIALS.filter(({ key }) => sosial[key]).map(({ key, label, Icon, hover }) => (
              <a
                key={key}
                href={sosial[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={`grid h-10 w-10 place-items-center rounded-lg outline-none transition-all duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-pink-500/60 active:translate-y-0 ${hover}`}
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>

        {/* Orbit: di HP di atas teks & di tengah, di desktop di kanan */}
        <div className="order-1 flex w-full justify-center lg:order-2">
          <LanguageOrbit />
        </div>
      </div>
    </section>
  );
}