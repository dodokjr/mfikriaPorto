import React, { useState, useEffect, useRef, useCallback } from 'react';

// ---------------------------------------------------------------
// Alert tema hitam-pink: kaca gelap, aksen neon, hitung mundur
// melingkar dengan angka detik, dan tombol close.
//
// Contoh pemakaian:
//   <Alert variant="success" title="Berhasil" duration={5000}>
//     Data berhasil disimpan.
//   </Alert>
//
// Props:
//   variant      'info' (pink, warna utama) | 'success' | 'warning' | 'error'   (default 'info')
//   title        judul (opsional)
//   duration     lama tampil dalam milidetik; 0 = tidak hilang otomatis (default 5000)
//   dismissible  tampilkan tombol close (default true)
//   pauseOnHover hentikan hitung mundur saat kursor/fokus di atas alert (default true)
//   onClose      dipanggil setelah alert benar-benar tertutup
//   className    class tambahan untuk pembungkus
//
// Tips: ganti `key` pada <Alert> kalau ingin memunculkan alert yang sama lagi
// dengan hitung mundur baru.
// ---------------------------------------------------------------

const EXIT_MS = 250;

// Lingkaran hitung mundur (viewBox 36x36, radius 15)
const RING_R = 15;
const RING_C = 2 * Math.PI * RING_R;

const CSS = `
@keyframes alert-in {
  from { opacity: 0; transform: translateX(28px) scale(.96); }
  to   { opacity: 1; transform: none; }
}
@keyframes alert-shine {
  from { transform: translateX(0) skewX(-12deg); }
  to   { transform: translateX(520%) skewX(-12deg); }
}
@media (prefers-reduced-motion: reduce) { .alert-anim { animation-duration: 0.01ms !important; } }
`;

// SVG Icons untuk tiap tipe alert
const Icons = {
  info: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
    </svg>
  ),
  success: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
      />
    </svg>
  ),
};

// Palet tiap variant. Dasarnya selalu hitam; hanya aksennya yang berganti.
// (Semua class ditulis utuh supaya terbaca oleh Tailwind.)
const styles = {
  info: {
    accent: 'from-pink-500 to-fuchsia-600',
    wash: 'from-pink-500/10',
    chip: 'border-pink-500/30 bg-pink-500/15 text-pink-400',
    glow: 'shadow-pink-500/25',
    ring: 'text-pink-500',
  },
  success: {
    accent: 'from-emerald-400 to-teal-500',
    wash: 'from-emerald-500/10',
    chip: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
    glow: 'shadow-emerald-500/20',
    ring: 'text-emerald-400',
  },
  warning: {
    accent: 'from-amber-400 to-orange-500',
    wash: 'from-amber-500/10',
    chip: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
    glow: 'shadow-amber-500/20',
    ring: 'text-amber-400',
  },
  error: {
    accent: 'from-red-500 to-rose-600',
    wash: 'from-red-500/10',
    chip: 'border-red-500/30 bg-red-500/15 text-red-400',
    glow: 'shadow-red-500/25',
    ring: 'text-red-500',
  },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  duration = 5000,
  dismissible = true,
  pauseOnHover = true,
  onClose,
  className = '',
}) {
  const hasTimer = duration > 0;

  const [phase, setPhase] = useState('open'); // 'open' | 'closing' | 'closed'
  const [paused, setPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(duration / 1000));

  const remainingRef = useRef(duration); // sisa waktu (ms), tidak memicu render ulang
  const ringRef = useRef(null);

  // Simpan onClose di ref supaya perubahan fungsi dari parent tidak mereset timer
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const close = useCallback(() => {
    setPhase((p) => (p === 'open' ? 'closing' : p));
  }, []);

  // Kalau duration diganti, mulai hitung mundur dari awal
  useEffect(() => {
    remainingRef.current = duration;
    setSecondsLeft(Math.ceil(duration / 1000));
    ringRef.current?.setAttribute('stroke-dashoffset', '0');
  }, [duration]);

  // Hitung mundur: satu sumber waktu untuk lingkaran dan angka.
  // Berhenti sementara saat paused, lanjut dari sisa waktu terakhir.
  useEffect(() => {
    if (!hasTimer || phase !== 'open' || paused) return undefined;

    let raf = 0;
    let last = performance.now();

    const tick = (now) => {
      remainingRef.current -= now - last;
      last = now;

      const remaining = Math.max(remainingRef.current, 0);
      ringRef.current?.setAttribute(
        'stroke-dashoffset',
        String(RING_C * (1 - remaining / duration)),
      );
      setSecondsLeft(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        close();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasTimer, phase, paused, duration, close]);

  // Animasi keluar singkat, lalu benar-benar dilepas dari DOM
  useEffect(() => {
    if (phase !== 'closing') return undefined;
    const t = setTimeout(() => {
      setPhase('closed');
      onCloseRef.current?.();
    }, EXIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === 'closed') return null;

  const s = styles[variant] || styles.info;
  const pause = pauseOnHover ? () => setPaused(true) : undefined;
  const resume = pauseOnHover ? () => setPaused(false) : undefined;

  return (
    <div
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className={`alert-anim relative mb-4 flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-gray-950/90 py-3.5 pl-5 pr-3.5 shadow-2xl backdrop-blur-xl transition-all ease-in ${s.glow} ${className}`}
      style={{
        transitionDuration: `${EXIT_MS}ms`,
        animation: 'alert-in 380ms cubic-bezier(.2,.9,.3,1.1)',
        opacity: phase === 'closing' ? 0 : 1,
        transform: phase === 'closing' ? 'translateX(28px) scale(0.96)' : undefined,
      }}
    >
      <style>{CSS}</style>

      {/* Garis aksen di sisi kiri */}
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${s.accent}`} />

      {/* Pendar warna lembut dari kiri */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent ${s.wash}`}
      />

      {/* Kilau cahaya yang melintas sekali saat muncul */}
      <span
        aria-hidden="true"
        className="alert-anim pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ animation: 'alert-shine 900ms ease-out 200ms 1 both' }}
      />

      {/* Icon */}
      <div
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-[0_0_20px_-4px_currentColor] ${s.chip}`}
      >
        {Icons[variant] || Icons.info}
      </div>

      {/* Content */}
      <div className="relative min-w-0 flex-1">
        {title && <h3 className="text-sm font-bold tracking-tight text-white">{title}</h3>}
        <div
          className={
            title ? 'mt-0.5 text-xs leading-relaxed text-gray-400' : 'text-sm leading-relaxed text-gray-200'
          }
        >
          {children}
        </div>
      </div>

      {/* Hitung mundur melingkar + angka detik tersisa */}
      {hasTimer && (
        <div
          className={`relative h-10 w-10 shrink-0 transition-opacity ${s.ring} ${paused ? 'opacity-60' : ''}`}
          title={paused ? 'Dijeda' : undefined}
        >
          <span className="sr-only">Menutup dalam {secondsLeft} detik</span>
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
            style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
          >
            {/* Jalur latar */}
            <circle cx="18" cy="18" r={RING_R} stroke="white" strokeWidth="2.5" opacity="0.12" />
            {/* Lingkaran yang menyusut */}
            <circle
              ref={ringRef}
              cx="18"
              cy="18"
              r={RING_R}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
            />
          </svg>
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold tabular-nums text-white"
          >
            {secondsLeft}
          </span>
        </div>
      )}

      {/* Tombol Dismiss/Close */}
      {dismissible && (
        <button
          type="button"
          onClick={close}
          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          aria-label="Tutup"
        >
          <span className="sr-only">Tutup</span>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 14 14" aria-hidden="true">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      )}
    </div>
  );
}