import React, { useEffect, useRef } from 'react';
import { FaGithub, FaInstagram, FaYoutube, FaLinkedin, FaSteam, FaDiscord, FaCode } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import Type from './type';
import PP from "../../../assets/documents/pp_merah_new.jpg";

// Ubah ke true jika PP berupa PNG transparan (background fotonya sudah dihapus).
// Foto akan tampil sebagai sosok 3D melayang tanpa bingkai kartu.
const PHOTO_IS_CUTOUT = false;

const SOCIALS = [
  { key: 'github', label: 'GitHub', Icon: FaGithub, hover: 'hover:text-[#181717] hover:drop-shadow-[0_0_8px_rgba(24,23,23,0.45)] dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram, hover: 'hover:text-[#E4405F] hover:drop-shadow-[0_0_8px_rgba(228,64,95,0.6)]' },
  { key: 'youtube', label: 'YouTube', Icon: FaYoutube, hover: 'hover:text-[#FF0000] hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.55)]' },
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedin, hover: 'hover:text-[#0A66C2] hover:drop-shadow-[0_0_8px_rgba(10,102,194,0.6)]' },
  { key: 'discord', label: 'Discord', Icon: FaDiscord, hover: 'hover:text-[#5865F2] hover:drop-shadow-[0_0_8px_rgba(88,101,242,0.6)]' },
  { key: 'steam', label: 'Steam', Icon: FaSteam, hover: 'hover:text-[#171A21] hover:drop-shadow-[0_0_8px_rgba(23,26,33,0.45)] dark:hover:text-[#66C0F4] dark:hover:drop-shadow-[0_0_8px_rgba(102,192,244,0.6)]' },
  { key: 'twitter', label: 'X (Twitter)', Icon: FaXTwitter, hover: 'hover:text-black hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.45)] dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' },
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Ikon melayang di sekeliling foto (dekoratif)
function Orb({ className, z, delay, children }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute ${className}`}
      style={{ transform: `translateZ(${z}px)` }}
    >
      <div
        className="home-bob grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gray-900/90 text-pink-400 shadow-[0_10px_24px_-6px_rgba(168,85,247,0.55)]"
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    </div>
  );
}

// Foto 3D: miring mengikuti pointer / sentuhan, punya ketebalan dan lapisan melayang
function PhotoStage({ src, alt }) {
  const stageRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const stage = stageRef.current;
    const card = cardRef.current;
    const st = { rx: 0, ry: 0, tx: 0, ty: 0, raf: 0, inside: false };

    const tick = () => {
      st.raf = 0;
      st.rx += (st.tx - st.rx) * 0.12;
      st.ry += (st.ty - st.ry) * 0.12;
      card.style.transform = `rotateX(${st.rx}deg) rotateY(${st.ry}deg)`;
      const settled = Math.abs(st.tx - st.rx) < 0.02 && Math.abs(st.ty - st.ry) < 0.02;
      if (st.inside || !settled) st.raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!st.raf) st.raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const px = clamp((e.clientX - r.left) / r.width, 0, 1);
      const py = clamp((e.clientY - r.top) / r.height, 0, 1);
      st.inside = true;
      st.ty = (px - 0.5) * 30;
      st.tx = (0.5 - py) * 30;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      wake();
    };
    const onLeave = () => {
      st.inside = false;
      st.tx = 0;
      st.ty = 0;
      wake();
    };

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointercancel', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointercancel', onLeave);
      if (st.raf) cancelAnimationFrame(st.raf);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative touch-pan-y p-6 [perspective:1000px] sm:p-10"
    >
      {/* Bayangan lantai (supaya terasa melayang) */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-[50%] bg-black/30 blur-xl dark:bg-black/60" />

      {/* Goyang dan melayang pelan saat diam */}
      <div className="home-float relative [transform-style:preserve-3d]">
        <div
          ref={cardRef}
          className="relative will-change-transform [transform-style:preserve-3d]"
        >
          {/* Ketebalan kartu */}
          {!PHOTO_IS_CUTOUT &&
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl"
                style={{
                  transform: `translateZ(${-i * 4}px)`,
                  background: `hsl(${290 + i * 3} 65% ${44 - i * 4}%)`,
                }}
              />
            ))}

          {/* Foto */}
          <div
            className={
              PHOTO_IS_CUTOUT
                ? 'relative'
                : 'relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl'
            }
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              className={`block w-64 select-none object-cover lg:w-80 ${
                PHOTO_IS_CUTOUT ? 'drop-shadow-[0_24px_30px_rgba(168,85,247,0.45)]' : ''
              }`}
            />
            {!PHOTO_IS_CUTOUT && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-overlay"
                style={{
                  background:
                    'radial-gradient(circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.35), transparent 55%)',
                }}
              />
            )}
          </div>

          {/* Ikon melayang di kedalaman berbeda */}
          <Orb className="-left-2 top-6 sm:-left-8" z={70} delay={0}>
            <FaGithub size={22} />
          </Orb>
          <Orb className="-right-2 top-1/2 sm:-right-8" z={110} delay={1.2}>
            <FaCode size={22} />
          </Orb>
          <Orb className="-left-1 bottom-10 sm:-left-6" z={50} delay={2.2}>
            <FaDiscord size={22} />
          </Orb>
        </div>
      </div>
    </div>
  );
}


// Nama interaktif: huruf di dekat kursor / jari terangkat, membesar, berwarna,
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

export default function Home({ data }) {
  if (!data) return null;
  const size = 22;
  const sosial = data.data.media_sosial || {};

  return (
    <section id="home" className="overflow-x-clip pt-32 pb-16 transition-colors duration-300 dark:bg-dark">
      <style>{`
        @keyframes home-float {
          0%, 100% { transform: translateY(0) rotateY(-7deg); }
          50% { transform: translateY(-10px) rotateY(7deg); }
        }
        @keyframes home-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .home-float { animation: home-float 7s ease-in-out infinite; }
        .home-bob { animation: home-bob 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .home-float, .home-bob { animation: none; }
        }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:justify-between">

          {/* Bagian Teks */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2">
            <div>
              <h1 className="text-lg font-semibold text-primary md:text-xl">
                Halo Semua 👋, saya
                <span className="mt-2 block text-4xl font-extrabold tracking-tight text-dark dark:text-white lg:text-6xl">
                  <InteractiveName name={data.data.name} />
                </span>
              </h1>
              <h2 className="mt-3 flex items-center gap-2 text-lg font-medium text-secondary lg:text-2xl">
                💻 <span className="text-dark dark:text-white"><Type /></span>
              </h2>
            </div>

            <p className="text-base font-medium leading-relaxed text-secondary lg:text-lg">
              {data.data.about} : <span className="font-semibold text-dark dark:text-white">{data.data.code}</span> {data.data.about_and} <span className="font-semibold text-dark dark:text-white">{data.data.skill}</span>
            </p>

            {/* Tombol & Badge */}
            <div className="flex flex-wrap items-center gap-6">
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
            </div>

            {/* Media Sosial: tanpa background, warna logo muncul saat hover */}
            <div className="mt-4 flex flex-wrap gap-3 text-gray-500 dark:text-gray-400">
              {SOCIALS.filter(({ key }) => sosial[key]).map(({ key, label, Icon, hover }) => (
                <a
                  key={key}
                  href={sosial[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`grid h-10 w-10 place-items-center rounded-lg outline-none transition-all duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-pink-500/60 active:translate-y-0 ${hover}`}
                >
                  <Icon size={size} />
                </a>
              ))}
            </div>
          </div>

          {/* Bagian Gambar 3D (tanpa glow/background di belakang) */}
          <div className="flex w-full justify-center lg:w-1/2 lg:justify-end">
            <PhotoStage src={PP} alt={data.data.name} />
          </div>

        </div>
      </div>
    </section>
  );
}