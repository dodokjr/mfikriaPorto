import React, { useEffect, useRef } from 'react';

// ---------------------------------------------------------------
// Pengaturan animasi scroll (posisi vertikal pusat item di layar:
// 0 = tepi atas, 1 = tepi bawah)
// ---------------------------------------------------------------
const ENTER_START = 0.92; // item mulai muncul dari bawah
const ENTER_END = 0.68; //   item sudah penuh terlihat
const EXIT_START = 0.32; //  item mulai bergeser ke kanan
const EXIT_END = -0.1; //    item sudah hilang di sisi kanan

// ---------------------------------------------------------------
// Data pengalaman (mengikuti urutan & isi di LinkedIn)
// - end: null  → masih berjalan ("Sekarang")
// - month: 1-12
// - logo: (opsional) URL gambar logo perusahaan; kalau kosong
//   dipakai inisial perusahaan
// - moreSkills: jumlah skill lain yang tidak ditampilkan ("+2 skill")
// ---------------------------------------------------------------
const TIMELINE_DATA = [
  {
    id: 'office-admin',
    title: 'Office Administrator',
    company: 'Cv. Sinergi solusi sejahtera',
    employmentType: 'Self-employed',
    start: { year: 2025, month: 12 },
    end: null,
    location: 'Semarang, Central Java, Indonesia',
    locationType: 'On-site',
    description: 'mengerjakan tugas admin serta mensuplai kebutuhan perusahaan',
    skills: ['Microsoft Excel', 'Microsoft Office'],
    moreSkills: 2,
  },
  {
    id: 'freelance-web',
    title: 'Freelance Web Developer',
    company: 'Freelance (Self employed)',
    employmentType: 'Freelance',
    start: { year: 2023, month: 10 },
    end: null,
    location: 'Semarang, Central Java, Indonesia',
    locationType: 'Remote',
    description: 'I want to work and make my parents happy',
    skills: ['Node.js', 'Bootstrap'],
    moreSkills: 12,
  },
  {
    id: 'game-developer',
    title: 'Game Developer',
    company: 'FiveM',
    employmentType: 'Full-time',
    start: { year: 2022, month: 3 },
    end: null,
    location: 'Semarang, Central Java, Indonesia',
    locationType: 'Remote',
    description:
      'Membuat sebuah server yang optimal dan perkembangan Game GTA V Rolplay yang seru dan kompetitif, serta menambahkan fitur untuk mempermudah dalam permainan Gta V Rolplay.',
    skills: ['Java', 'C++'],
    moreSkills: 3,
  },
  {
    id: 'crew-oti-desmon',
    title: 'Crew outlet',
    company: 'CV. OTI DESMON',
    employmentType: 'Self-employed',
    start: { year: 2025, month: 1 },
    end: { year: 2025, month: 12 },
    location: 'Semarang, Central Java, Indonesia',
    locationType: 'On-site',
    description: 'membuat makanan cepat saji seperti fried chicken',
    skills: ['Kitchen'],
  },
  {
    id: 'crew-burger-bangor',
    title: 'Crew outlet',
    company: 'Burger Bangor',
    employmentType: null,
    start: { year: 2024, month: 6 },
    end: { year: 2025, month: 1 },
    location: 'Semarang, Central Java, Indonesia',
    locationType: 'On-site',
    description: 'membuat makanan cepat saji seperti burger, nugget, ayam goreng, kentang goreng, dll',
    skills: ['Kitchen'],
  },
];

// ---------------------------------------------------------------
// Helper
// ---------------------------------------------------------------
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t * t;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const formatDate = ({ year, month }) => `${MONTHS[month - 1]} ${year}`;

// Durasi dihitung seperti LinkedIn: bulan awal & bulan akhir sama-sama dihitung
const formatDuration = (start, end) => {
  const now = new Date();
  const to = end ?? { year: now.getFullYear(), month: now.getMonth() + 1 };
  const total = (to.year - start.year) * 12 + (to.month - start.month) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years > 0 && `${years} thn`, months > 0 && `${months} bln`].filter(Boolean).join(' ');
};

// Inisial dari nama perusahaan (mengabaikan awalan "Cv." / "Pt.")
const getInitials = (name) =>
  name
    .replace(/^(cv|pt)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// ---------------------------------------------------------------
// Ikon kecil (inline SVG, tanpa library tambahan)
// ---------------------------------------------------------------
const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-3.5 w-3.5 shrink-0 text-pink-400',
  'aria-hidden': true,
};

const CalendarIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ---------------------------------------------------------------
// Komponen
// ---------------------------------------------------------------
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

function Logo({ company, logo }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-pink-500/25 to-fuchsia-600/10 text-sm font-bold text-pink-200 ring-1 ring-pink-500/30">
      {logo ? (
        <img src={logo} alt={`Logo ${company}`} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{getInitials(company)}</span>
      )}
    </div>
  );
}

function Card({ item, alignRight }) {
  const current = item.end === null;
  const dateRange = `${formatDate(item.start)} – ${current ? 'Sekarang' : formatDate(item.end)}`;
  const duration = formatDuration(item.start, item.end);
  const end = alignRight ? 'md:justify-end' : '';

  // Cahaya mengikuti kursor (hanya bereaksi saat pengguna menggerakkan mouse)
  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div
      className={`relative ${
        alignRight ? 'md:col-start-1 md:pr-10' : 'md:col-start-2 md:pl-10'
      }`}
    >
      {/* Penghubung kartu ke garis tengah */}
      <span
        aria-hidden="true"
        className={`absolute top-[28px] hidden h-px w-10 bg-gradient-to-r md:block ${
          alignRight ? 'right-0 from-pink-500/10 to-pink-500/60' : 'left-0 from-pink-500/60 to-pink-500/10'
        }`}
      />

      {/* Lapisan luar = border 1px bergradien; menyala mengikuti kursor saat hover */}
      <div
        onMouseMove={onMouseMove}
        className={`group relative rounded-3xl p-px ${
          current
            ? 'bg-gradient-to-br from-pink-400/70 via-pink-500/30 to-fuchsia-600/30 shadow-[0_0_60px_-20px_rgba(236,72,153,0.8)]'
            : 'bg-gradient-to-br from-pink-500/30 via-pink-500/10 to-transparent'
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(244,114,182,0.9), transparent 70%)',
          }}
        />

        <article
          className={`relative overflow-hidden rounded-[23px] bg-zinc-950 p-6 ${
            alignRight ? 'md:text-right' : ''
          } ${current ? 'bg-[linear-gradient(135deg,rgba(236,72,153,0.14),transparent_55%)]' : ''}`}
        >
          {/* Cahaya lembut di dalam kartu */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(236,72,153,0.16), transparent 65%)',
            }}
          />

          <div className="relative">
            <div className={`flex items-center gap-4 ${alignRight ? 'md:flex-row-reverse' : ''}`}>
              <Logo company={item.company} logo={item.logo} />
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold tracking-tight text-white">{item.title}</h3>
                <p className="text-sm text-pink-100/70">{item.company}</p>
              </div>
            </div>

            <div className={`mt-4 flex flex-wrap items-center gap-2 ${end}`}>
              {current && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500 px-2.5 py-1 text-xs font-semibold text-black">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-black motion-safe:animate-pulse" />
                  Saat ini
                </span>
              )}
              {item.employmentType && (
                <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-1 text-xs font-medium text-pink-200">
                  {item.employmentType}
                </span>
              )}
              {item.locationType && (
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-pink-100/70">
                  {item.locationType}
                </span>
              )}
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-pink-100/60">
              <p className={`flex items-center gap-1.5 ${end}`}>
                <CalendarIcon />
                <time>{dateRange}</time>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-pink-300">{duration}</span>
              </p>
              <p className={`flex items-center gap-1.5 ${end}`}>
                <PinIcon />
                <span>{item.location}</span>
              </p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-pink-100/70">{item.description}</p>

            {(item.skills?.length > 0 || item.moreSkills > 0) && (
              <ul className={`mt-5 flex flex-wrap gap-2 border-t border-white/5 pt-4 ${end}`}>
                {item.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-pink-500/20 bg-white/[0.03] px-2.5 py-1 text-xs text-pink-100/80"
                  >
                    {skill}
                  </li>
                ))}
                {item.moreSkills > 0 && (
                  <li className="rounded-full border border-dashed border-pink-500/25 px-2.5 py-1 text-xs text-pink-100/50">
                    +{item.moreSkills} skill
                  </li>
                )}
              </ul>
            )}
          </div>
        </article>
      </div>
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
      className="relative flex flex-col items-center overflow-x-clip bg-black px-4 pb-48 pt-20"
      aria-labelledby="timeline-title"
    >
      {/* Titik-titik halus yang memudar ke bawah */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(236,72,153,0.2)_1px,transparent_1px)] [background-size:28px_28px] [-webkit-mask-image:radial-gradient(ellipse_at_top,#000_10%,transparent_65%)] [mask-image:radial-gradient(ellipse_at_top,#000_10%,transparent_65%)]"
      />
      {/* Cahaya pink halus di latar hitam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.18),transparent_70%)]"
      />

      <header className="relative mb-16 text-center">
        <h2
          id="timeline-title"
          className="text-4xl font-black tracking-tighter text-white sm:text-5xl md:text-6xl"
        >
          <span className="bg-gradient-to-r from-pink-300 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent">
            Pengalaman Saya
          </span>
        </h2>
        <span
          aria-hidden="true"
          className="mx-auto mt-5 block h-[3px] w-16 rounded-full bg-pink-500 shadow-[0_0_12px_2px_rgba(236,72,153,0.6)]"
        />
      </header>

      <ol className="relative w-full max-w-4xl [perspective:1200px]">
        {/* Garis tunggal, lurus, menyambung dari atas sampai bawah */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-2.5 top-5 w-[2px] -translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.4)] [-webkit-mask-image:linear-gradient(to_bottom,#000_80%,transparent)] [mask-image:linear-gradient(to_bottom,#000_80%,transparent)] md:left-1/2"
          style={{
            background: 'linear-gradient(to right, #f9a8d4 0%, #ec4899 50%, #9d174d 100%)',
          }}
        />

        {TIMELINE_DATA.map((item, index) => (
          <li
            key={item.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="relative pb-10 pl-10 will-change-transform md:grid md:grid-cols-2 md:pl-0"
          >
            <Marker current={item.end === null} />
            <Card item={item} alignRight={index % 2 === 0} />
          </li>
        ))}
      </ol>
    </section>
  );
}