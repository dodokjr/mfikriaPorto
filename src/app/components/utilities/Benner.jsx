import React, { useEffect, useRef } from 'react';
import { HiSparkles, HiCode, HiRefresh } from 'react-icons/hi';

// ---------------------------------------------------------------
// Pengaturan
// ---------------------------------------------------------------
const AUTO_SPIN = 0.045; // derajat per milidetik (0.045 = 45°/detik, satu putaran penuh ±8 detik)
const BODY_Z = [-16, -12, -8, -4, 0, 4, 8, 12, 16]; // ketebalan tubuh (susunan irisan)
const CAPE_Z = [-34, -30, -26];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------
// Jagoan orisinal (bukan karakter berhak cipta).
// Dibuat dari susunan irisan SVG di kedalaman Z berbeda sehingga
// terlihat padat dan punya ketebalan saat berputar 360°.
// ---------------------------------------------------------------
function Slice({ z, children, flip = false }) {
  return (
    <svg
      viewBox="0 0 200 280"
      className="absolute inset-0 h-full w-full overflow-visible"
      style={{
        transform: `translateZ(${z}px)${flip ? ' rotateY(180deg)' : ''}`,
        backfaceVisibility: flip || z > 16 ? 'hidden' : 'visible',
      }}
    >
      {children}
    </svg>
  );
}

function BodyShape({ fill, accent }) {
  return (
    <>
      <path d="M74 172 L99 172 L97 248 L70 248 Z" fill={fill} />
      <path d="M101 172 L126 172 L130 248 L103 248 Z" fill={fill} />
      <path d="M66 246 H98 V264 H60 Z" fill={accent} />
      <path d="M102 246 H134 L140 264 H102 Z" fill={accent} />
      <path d="M64 96 Q100 82 136 96 L126 172 H74 Z" fill={fill} />
      <path d="M68 104 Q38 128 66 160" stroke={fill} strokeWidth="17" strokeLinecap="round" fill="none" />
      <path d="M132 104 Q162 128 134 160" stroke={fill} strokeWidth="17" strokeLinecap="round" fill="none" />
      <circle cx="66" cy="162" r="10" fill={accent} />
      <circle cx="134" cy="162" r="10" fill={accent} />
      <rect x="91" y="82" width="18" height="16" rx="6" fill={fill} />
      <circle cx="100" cy="66" r="22" fill={fill} />
    </>
  );
}

function HeroDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="hg-suit" gradientUnits="userSpaceOnUse" x1="40" y1="60" x2="160" y2="264">
          <stop offset="0" stopColor="#818cf8" />
          <stop offset="1" stopColor="#3730a3" />
        </linearGradient>
        <linearGradient id="hg-suit-dark" gradientUnits="userSpaceOnUse" x1="40" y1="60" x2="160" y2="264">
          <stop offset="0" stopColor="#4338ca" />
          <stop offset="1" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="hg-cape" gradientUnits="userSpaceOnUse" x1="0" y1="90" x2="0" y2="266">
          <stop offset="0" stopColor="#f472b6" />
          <stop offset="1" stopColor="#9d174d" />
        </linearGradient>
        <linearGradient id="hg-gold" gradientUnits="userSpaceOnUse" x1="80" y1="108" x2="125" y2="176">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="hg-skin" gradientUnits="userSpaceOnUse" x1="85" y1="52" x2="115" y2="86">
          <stop offset="0" stopColor="#fde4c8" />
          <stop offset="1" stopColor="#e3a374" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HeroModel() {
  return (
    <>
      <HeroDefs />

      {/* Jubah: tebal, terlihat dari depan maupun belakang */}
      {CAPE_Z.map((z) => (
        <Slice key={`cape${z}`} z={z}>
          <path
            d="M62 92 C16 130 14 222 30 266 L100 238 L170 266 C186 222 184 130 138 92 Z"
            fill="url(#hg-cape)"
          />
        </Slice>
      ))}

      {/* Tubuh: irisan dari belakang ke depan */}
      {BODY_Z.map((z, i) => {
        const isFront = i === BODY_Z.length - 1;
        const isBack = i === 0;
        return (
          <Slice key={`body${z}`} z={z}>
            <BodyShape
              fill={isFront ? 'url(#hg-suit)' : isBack ? 'url(#hg-suit-dark)' : '#4338ca'}
              accent={isBack ? '#831843' : '#be185d'}
            />
          </Slice>
        );
      })}

      {/* Detail depan: wajah, topeng, lambang, sabuk */}
      <Slice z={17.5}>
        <path d="M64 96 Q82 90 96 90 L90 172 H74 Z" fill="#fff" opacity=".13" />
        <rect x="73" y="164" width="54" height="11" rx="3" fill="url(#hg-gold)" />
        <ellipse cx="100" cy="69" rx="15" ry="16" fill="url(#hg-skin)" />
        <path d="M82 63 Q100 55 118 63 L117 74 Q100 69 83 74 Z" fill="#1e1b4b" />
        <ellipse cx="91" cy="67" rx="5" ry="2.6" fill="#fff" />
        <ellipse cx="109" cy="67" rx="5" ry="2.6" fill="#fff" />
        <path d="M94 80 Q100 84 106 80" stroke="#9a3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M80 54 Q100 40 120 54" stroke="#a5b4fc" strokeWidth="2" fill="none" opacity=".6" />
        <circle cx="100" cy="130" r="18" fill="#0f172a" stroke="url(#hg-gold)" strokeWidth="3" />
        <polygon points="102,112 89,134 98,134 94,150 112,126 103,126" fill="url(#hg-gold)" />
      </Slice>

      {/* Detail belakang: sirip di tudung kepala */}
      <Slice z={-17.5} flip>
        <path d="M100 46 V88" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      </Slice>
    </>
  );
}

// ---------------------------------------------------------------
// Panggung jagoan: berdiri di atas kartu dan berputar 360° sendiri.
// Tidak bisa disentuh, digeser, atau ditekan: murni animasi otomatis.
// ---------------------------------------------------------------
function HeroStage({ frames }) {
  const stageRef = useRef(null);
  const rotorRef = useRef(null);
  const imgRef = useRef(null);
  const framesRef = useRef(frames);
  const renderRef = useRef(() => {});
  const st = useRef({ angle: -20, last: 0, frame: -1 });

  framesRef.current = frames;

  // Preload frame (kalau pakai gambar 360 sendiri)
  useEffect(() => {
    (frames || []).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [frames]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = st.current;
    let raf = 0;
    let visible = true;

    const render = () => {
      const list = framesRef.current;
      if (list && list.length && imgRef.current) {
        const a = ((s.angle % 360) + 360) % 360;
        const idx = Math.round((a / 360) * list.length) % list.length;
        if (idx !== s.frame) {
          s.frame = idx;
          imgRef.current.src = list[idx];
        }
      } else if (rotorRef.current) {
        rotorRef.current.style.transform = `rotateX(-6deg) rotateY(${s.angle}deg)`;
      }
    };
    renderRef.current = render;

    const tick = (now) => {
      raf = 0;
      const dt = Math.min(now - s.last, 50);
      s.last = now;
      s.angle += AUTO_SPIN * dt;
      render();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf && visible && !reduce) {
        s.last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    // Berhenti saat jagoan di luar layar supaya hemat baterai
    let io;
    if ('IntersectionObserver' in window && stageRef.current) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      });
      io.observe(stageRef.current);
    }

    render();
    start();

    return () => {
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Kalau daftar frame berganti, tampilkan frame yang sesuai langsung
  useEffect(() => {
    st.current.frame = -1;
    renderRef.current();
  }, [frames]);

  return (
    <div
      ref={stageRef}
      role="img"
      aria-label="Ilustrasi jagoan 3D yang berputar 360 derajat"
      className="pointer-events-none absolute bottom-full left-1/2 h-64 w-[11.4rem] -translate-x-1/2 translate-y-5 select-none [perspective:900px] sm:h-80 sm:w-56"
    >
      {/* Aura di belakang jagoan */}
      <div className="absolute -inset-12 bg-[radial-gradient(circle,rgba(236,72,153,0.32),transparent_62%)]" />

      {/* Alas pameran */}
      <div className="absolute -bottom-1 left-1/2 h-6 w-48 -translate-x-1/2 rounded-[50%] border border-pink-400/40 bg-pink-500/20 blur-[2px]" />
      <div className="absolute bottom-0 left-1/2 h-3 w-28 -translate-x-1/2 rounded-[50%] bg-pink-500/50 blur-md" />

      {frames && frames.length ? (
        <img
          ref={imgRef}
          src={frames[0]}
          alt=""
          draggable={false}
          className="relative h-full w-full object-contain drop-shadow-[0_20px_30px_rgba(236,72,153,0.4)]"
        />
      ) : (
        <div
          ref={rotorRef}
          className="relative h-full w-full will-change-transform [transform-style:preserve-3d]"
        >
          <HeroModel />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------
// Isi kartu
// ---------------------------------------------------------------
function BannerCard() {
  return (
    <div className="w-full rounded-3xl border border-gray-800/80 bg-gray-900/90 p-8 text-center sm:p-12">
      {/* Badge Status */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5">
        <HiSparkles className="h-4 w-4 animate-pulse text-pink-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">
          My Hobbies & Passion
        </span>
      </div>

      {/* Heading Utama */}
      <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
        Eksplorasi Sisi Lain{' '}
        <span className="bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
          Dunia Saya
        </span>
      </h1>

      {/* Deskripsi */}
      <p className="mx-auto mb-8 max-w-xl text-xs leading-relaxed text-gray-400 sm:text-sm">
        Temukan hobi, musik favorit, koleksi momen, hingga mini game interaktif yang saya buat
        untuk mengisi waktu luang di luar aktivitas coding.
      </p>

      {/* Pill */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-gray-800 bg-gray-950/80 px-4 py-2 text-xs font-medium text-gray-300 shadow-inner">
          <HiCode className="h-4 w-4 text-pink-400" />
          <span>Coding & Creative Hobbies</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-pink-500/20 bg-pink-500/5 px-4 py-2 text-xs font-medium text-pink-300">
          <HiRefresh className="h-4 w-4 motion-safe:animate-[spin_6s_linear_infinite]" />
          <span>Jagoan berputar 360° otomatis</span>
        </div>
      </div>
    </div>
  );
}

// `heroFrames` (opsional): daftar URL gambar turntable 360° (mis. 36 PNG transparan)
// untuk menggantikan jagoan SVG bawaan dengan render 3D milikmu sendiri.
export default function Benner({ heroFrames }) {
  const wrapRef = useRef(null);
  const tiltRef = useRef(null);

  // Efek 3D kartu mengikuti scroll (jagoan ikut miring karena berdiri di atas kartu)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (!wrapRef.current || !tiltRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const p = (rect.top + rect.height / 2) / window.innerHeight;
      const d = clamp(p - 0.5, -1, 1);

      tiltRef.current.style.transform =
        `translate3d(0, ${d * -30}px, 0) ` +
        `rotateX(${d * 30}deg) rotateY(${d * -12}deg) scale(${1 - Math.abs(d) * 0.05})`;
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
    <section className="relative flex flex-col items-center justify-center overflow-x-clip border-b border-gray-900/60 bg-gray-950 px-4 pb-16 pt-64 text-center sm:pb-24 sm:pt-80">
      {/* Background Glow Effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/15 via-gray-950 to-gray-950" />
      </div>

      <div ref={wrapRef} className="relative z-10 w-full max-w-3xl [perspective:1100px]">
        <div
          ref={tiltRef}
          className="relative will-change-transform [transform-style:preserve-3d]"
        >
          <BannerCard />
          <HeroStage frames={heroFrames} />
        </div>
      </div>
    </section>
  );
}