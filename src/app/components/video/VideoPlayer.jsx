import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IoPlay,
  IoPause,
  IoPlayBack,
  IoPlayForward,
  IoVolumeHigh,
  IoVolumeMedium,
  IoVolumeLow,
  IoVolumeMute,
  IoExpand,
  IoContract,
  IoReload,
  IoSettingsOutline,
  IoCheckmark,
  IoChevronForward,
  IoChevronBack,
  IoSpeedometerOutline,
  IoOptionsOutline,
  IoLanguage,
} from 'react-icons/io5';

/*
  Props:
  - src          : URL video utama (dipakai untuk kualitas "Otomatis")
  - title        : judul di bagian atas player
  - qualities    : [{ label: '1080p', src: 'https://...' }, ...]        (opsional)
  - subtitles    : [{ label: 'Indonesia', lang: 'id', src: '...vtt' }]  (opsional, format WebVTT)
  - onError / onLoadedMetadata(duration)
*/

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SEEK_STEP = 10; // detik: tap ganda kiri/kanan, tombol J / L
const DOUBLE_TAP_MS = 300; // jeda maksimum antar dua tap
const SEEK_MODE_MS = 600; // setelah tap ganda, tap berikutnya langsung ikut maju/mundur
const STALL_RECOVER_MS = 8000; // streaming macet selama ini -> minta ulang data
const EMPTY = [];

function fmt(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${h > 0 ? `${h}:${String(m).padStart(2, '0')}` : m}:${String(s).padStart(2, '0')}`;
}

const iconBtn =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-white/90 transition hover:bg-white/15 hover:text-white active:scale-95';

/* ---------- potongan kecil menu pengaturan ---------- */
function MenuRow({ icon: Icon, label, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white transition-colors hover:bg-white/10"
    >
      <Icon className="shrink-0 text-lg text-neutral-300" aria-hidden="true" />
      <span className="flex-1">{label}</span>
      <span className="text-xs text-neutral-400">{value}</span>
      <IoChevronForward className="shrink-0 text-neutral-500" aria-hidden="true" />
    </button>
  );
}

function Option({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
        active ? 'font-semibold text-cyan-300' : 'text-neutral-200'
      }`}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">{active && <IoCheckmark />}</span>
      {children}
    </button>
  );
}

export default function VideoPlayer({
  src,
  title = '',
  qualities = EMPTY,
  subtitles = EMPTY,
  onError,
  onLoadedMetadata,
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const barRef = useRef(null);

  // Elemen yang digambar langsung (tanpa React state)
  const fillRef = useRef(null);
  const bufRef = useRef(null);
  const headRef = useRef(null);
  const tipRef = useRef(null);
  const curRef = useRef(null);

  const hideTimer = useRef(null);
  const fxTimer = useRef(null);
  const stallTimer = useRef(null);
  const rafRef = useRef(0);
  const lastWake = useRef(0);
  const lastSec = useRef(-1);
  const dragging = useRef(false);
  const dragPct = useRef(0);
  const visibleRef = useRef(true);
  const playingRef = useRef(false);
  const tap = useRef({ time: 0, side: null, seeking: false, timer: null });
  const acc = useRef({ dir: 0, total: 0, time: 0 });
  const pending = useRef(null); // { time, play } -> dipulihkan setelah ganti kualitas

  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [awake, setAwake] = useState(true);
  const [menu, setMenu] = useState(null); // null | 'main' | 'speed' | 'quality' | 'lang'
  const [fx, setFx] = useState(null); // { type: 'play' | 'pause' | 'back' | 'forward', total?, id }
  const [activeSrc, setActiveSrc] = useState(src);
  const [qualityIdx, setQualityIdx] = useState(-1); // -1 = Otomatis
  const [subIdx, setSubIdx] = useState(-1); // -1 = subtitle mati

  playingRef.current = playing;

  // Video berganti -> kembali ke sumber utama
  useEffect(() => {
    setActiveSrc(src);
    setQualityIdx(-1);
  }, [src]);

  /* ---------- menggambar progress langsung ke DOM ---------- */
  const paint = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const d = v.duration || 0;
    const t = dragging.current ? dragPct.current * d : v.currentTime;
    const r = d ? Math.min(Math.max(t / d, 0), 1) : 0;
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${r})`;
    if (headRef.current) headRef.current.style.left = `${r * 100}%`;
    const sec = Math.floor(t);
    if (sec !== lastSec.current) {
      lastSec.current = sec;
      if (curRef.current) curRef.current.textContent = fmt(t);
      if (barRef.current) barRef.current.setAttribute('aria-valuenow', String(sec));
    }
  }, []);

  const paintBuffer = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    let end = 0;
    for (let i = 0; i < v.buffered.length; i += 1) {
      if (v.buffered.start(i) <= v.currentTime + 0.1 && v.currentTime <= v.buffered.end(i)) {
        end = v.buffered.end(i);
        break;
      }
    }
    if (bufRef.current) bufRef.current.style.transform = `scaleX(${Math.min(end / v.duration, 1)})`;
  }, []);

  // Loop gambar hanya jalan saat video main (dan berhenti otomatis saat tab tersembunyi)
  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      paint();
      return undefined;
    }
    const tick = () => {
      if (!document.hidden || dragging.current) paint();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, paint]);

  /* ---------- kontrol muncul saat disentuh / mouse bergerak, hilang saat diam ---------- */
  const showControls = useCallback(() => {
    setAwake(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setAwake(false), 3000);
  }, []);

  const hideControls = useCallback(() => {
    clearTimeout(hideTimer.current);
    setAwake(false);
  }, []);

  const wake = useCallback(() => {
    const now = performance.now();
    if (now - lastWake.current < 200) return; // abaikan event mouse beruntun
    lastWake.current = now;
    showControls();
  }, [showControls]);

  useEffect(
    () => () => {
      clearTimeout(hideTimer.current);
      clearTimeout(fxTimer.current);
      clearTimeout(stallTimer.current);
      clearTimeout(tap.current.timer);
      cancelAnimationFrame(rafRef.current);
    },
    []
  );

  /* ---------- efek sesaat: play/pause di tengah, maju/mundur di sisi layar ---------- */
  const showFx = useCallback((type, total) => {
    setFx({ type, total, id: Date.now() });
    clearTimeout(fxTimer.current);
    fxTimer.current = setTimeout(() => setFx(null), 700);
  }, []);

  /* ---------- fullscreen ---------- */
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const wrap = wrapRef.current;
    const v = videoRef.current;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (wrap && wrap.requestFullscreen) {
      wrap.requestFullscreen();
    } else if (v && v.webkitEnterFullscreen) {
      v.webkitEnterFullscreen(); // iOS Safari
    }
  }, []);

  /* ---------- aksi dasar ---------- */
  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.ended) v.currentTime = 0;
    if (v.paused) {
      v.play().catch(() => {});
      showFx('play');
    } else {
      v.pause();
      showFx('pause');
    }
  }, [showFx]);

  const seekBy = (delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0);
    paint();
  };

  // Maju/mundur 10 detik; tap beruntun menumpuk (+10, +20, +30 ...)
  const seekStep = (dir) => {
    const now = Date.now();
    const a = acc.current;
    const total = a.dir === dir && now - a.time < 900 ? a.total + SEEK_STEP : SEEK_STEP;
    acc.current = { dir, total, time: now };
    seekBy(dir * SEEK_STEP);
    showFx(dir < 0 ? 'back' : 'forward', total);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  };

  const changeVolume = (value) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = value;
    v.muted = value === 0;
  };

  const changeSpeed = (value) => {
    const v = videoRef.current;
    if (v) {
      v.defaultPlaybackRate = value; // bertahan walau kualitas diganti
      v.playbackRate = value;
    }
    setSpeed(value);
    setMenu(null);
  };

  const selectQuality = (idx) => {
    setMenu(null);
    if (idx === qualityIdx) return;
    const v = videoRef.current;
    pending.current = v ? { time: v.currentTime, play: !v.paused } : null;
    setEnded(false);
    setWaiting(true);
    setQualityIdx(idx);
    setActiveSrc(idx < 0 ? src : qualities[idx].src);
  };

  const selectSubtitle = (idx) => {
    setSubIdx(idx);
    setMenu(null);
  };

  // Aktifkan hanya subtitle yang dipilih
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const apply = () => {
      Array.from(v.textTracks).forEach((t, i) => {
        t.mode = i === subIdx ? 'showing' : 'disabled';
      });
    };
    apply();
    v.textTracks.addEventListener?.('addtrack', apply);
    return () => v.textTracks.removeEventListener?.('addtrack', apply);
  }, [subIdx, subtitles, activeSrc]);

  /* ---------- progress bar (klik + geser) ---------- */
  const pctFromEvent = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    return Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  };

  const moveTip = (pct) => {
    const d = (videoRef.current && videoRef.current.duration) || 0;
    const tip = tipRef.current;
    if (!tip) return;
    tip.style.left = `${pct * 100}%`;
    tip.textContent = fmt(pct * d);
    tip.style.opacity = d > 0 ? '1' : '0';
  };

  const hideTip = () => {
    if (!dragging.current && tipRef.current) tipRef.current.style.opacity = '0';
  };

  // Saat menggeser hanya posisi bar yang digambar; seek ke video dilakukan SEKALI saat dilepas
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const v = videoRef.current;
    if (v && v.duration) v.currentTime = dragPct.current * v.duration;
    paint();
  };

  /* ---------- keyboard ---------- */
  const onKeyDown = (e) => {
    wake();
    const map = {
      ' ': toggle,
      k: toggle,
      j: () => seekStep(-1),
      l: () => seekStep(1),
      ArrowLeft: () => seekBy(-5),
      ArrowRight: () => seekBy(5),
      ArrowUp: () => changeVolume(Math.min(volume + 0.1, 1)),
      ArrowDown: () => changeVolume(Math.max(volume - 0.1, 0)),
      Home: () => seekBy(-Infinity),
      End: () => seekBy(Infinity),
      m: toggleMute,
      f: toggleFullscreen,
      Escape: () => setMenu(null),
    };
    let action = map[e.key];
    // Angka 0-9 = lompat ke 0%-90% durasi
    if (!action && /^[0-9]$/.test(e.key)) {
      action = () => {
        const v = videoRef.current;
        if (v && v.duration) {
          v.currentTime = (Number(e.key) / 10) * v.duration;
          paint();
        }
      };
    }
    // Biarkan tombol/slider yang sedang difokus menangani Spasi & panah sendiri
    const onControl = e.target !== e.currentTarget;
    if (action && !(onControl && (e.key === ' ' || e.key.startsWith('Arrow')))) {
      e.preventDefault();
      action();
    }
  };

  /* ---------- tap di layar video ----------
     Mouse : klik = putar/jeda, klik ganda kiri/kanan = mundur/maju 10 detik, klik ganda tengah = fullscreen
     Sentuh: tap = tampil/sembunyi kontrol (atau putar kalau sedang jeda),
             tap ganda sisi kiri = mundur 10 detik, sisi kanan = maju 10 detik (tap lagi untuk menumpuk) */
  const onSurfaceTap = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (menu) {
      setMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const side = x < 0.35 ? 'left' : x > 0.65 ? 'right' : 'center';
    const type = e.pointerType;
    const now = Date.now();
    const t = tap.current;
    const quick = now - t.time < DOUBLE_TAP_MS;
    const inSeekMode = t.seeking && now - t.time < SEEK_MODE_MS;

    // Tap ganda (atau tap lanjutan) di sisi kiri / kanan
    if (side !== 'center' && (inSeekMode || (quick && t.side === side))) {
      clearTimeout(t.timer);
      tap.current = { time: now, side, seeking: true, timer: null };
      seekStep(side === 'left' ? -1 : 1);
      return;
    }

    // Tap ganda di tengah -> fullscreen
    if (side === 'center' && quick && t.side === 'center') {
      clearTimeout(t.timer);
      tap.current = { time: 0, side: null, seeking: false, timer: null };
      toggleFullscreen();
      return;
    }

    // Tap tunggal: tunggu sebentar untuk memastikan bukan tap ganda
    clearTimeout(t.timer);
    const timer = setTimeout(() => {
      if (type === 'mouse' || !playingRef.current) toggle();
      else if (visibleRef.current) hideControls();
      else showControls();
    }, DOUBLE_TAP_MS - 40);
    tap.current = { time: now, side, seeking: false, timer };
  };

  const visible = awake || !playing || menu !== null;
  visibleRef.current = visible;
  useEffect(() => {
    if (visible) {
      paint();
      paintBuffer();
    }
  }, [visible, paint, paintBuffer]);

  const VolumeIcon =
    muted || volume === 0 ? IoVolumeMute : volume < 0.34 ? IoVolumeLow : volume < 0.67 ? IoVolumeMedium : IoVolumeHigh;
  const PlayFx = fx && (fx.type === 'play' ? IoPlay : fx.type === 'pause' ? IoPause : null);
  const SeekFx = fx && (fx.type === 'back' ? IoPlayBack : fx.type === 'forward' ? IoPlayForward : null);

  const speedLabel = speed === 1 ? 'Normal' : `${speed}x`;
  const qualityLabel = qualityIdx < 0 ? 'Otomatis' : qualities[qualityIdx]?.label;
  const subLabel = subIdx < 0 ? 'Mati' : subtitles[subIdx]?.label;
  const menuTitles = { speed: 'Kecepatan putar', quality: 'Kualitas', lang: 'Bahasa' };

  const fade = 'transition-[opacity,visibility] duration-300';

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerMove={(e) => e.pointerType === 'mouse' && wake()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && playing && hideControls()}
      onContextMenu={(e) => e.preventDefault()}
      className={`vp relative h-full w-full select-none overflow-hidden bg-black outline-none ${
        visible ? '' : 'cursor-none'
      }`}
    >
      <style>{`
        @keyframes vp-fx {
          0%   { opacity: 0; transform: scale(.85); }
          15%  { opacity: 1; transform: scale(1); }
          70%  { opacity: 1; }
          100% { opacity: 0; transform: scale(1.05); }
        }
        @keyframes vp-sheet {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vp-fx    { animation: vp-fx .7s ease-out forwards; }
        .vp-sheet { animation: vp-sheet .2s ease-out; }
        .vp video::cue { background: rgba(0,0,0,.65); color: #fff; }
      `}</style>

      <video
        ref={videoRef}
        src={activeSrc}
        autoPlay
        playsInline
        preload="metadata"
        // Subtitle dari domain lain butuh CORS; stream video juga harus mengirim header CORS
        crossOrigin={subtitles.length > 0 ? 'anonymous' : undefined}
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          setDuration(v.duration);
          if (onLoadedMetadata) onLoadedMetadata(v.duration);
          // Setelah ganti kualitas: lanjut dari posisi & status putar sebelumnya
          const p = pending.current;
          if (p) {
            pending.current = null;
            v.currentTime = Math.min(p.time, v.duration || p.time);
            if (p.play) v.play().catch(() => {});
            else v.pause();
          }
          paint();
        }}
        onTimeUpdate={() => {
          if (!playing) paint(); // saat main, rAF yang menggambar
          paintBuffer();
        }}
        onSeeked={paint}
        onProgress={paintBuffer}
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
          showControls();
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
        onWaiting={() => {
          setWaiting(true);
          // Streaming macet lama: minta ulang data dari posisi sekarang
          clearTimeout(stallTimer.current);
          stallTimer.current = setTimeout(() => {
            const v = videoRef.current;
            if (v && !v.paused && v.readyState < 3) v.currentTime = v.currentTime;
          }, STALL_RECOVER_MS);
        }}
        onCanPlay={() => {
          setWaiting(false);
          clearTimeout(stallTimer.current);
        }}
        onPlaying={() => {
          setWaiting(false);
          clearTimeout(stallTimer.current);
        }}
        onVolumeChange={(e) => {
          setVolume(e.currentTarget.volume);
          setMuted(e.currentTarget.muted);
        }}
        onError={(e) => {
          // Kualitas pilihan gagal dimuat -> kembali ke Otomatis, bukan menampilkan error
          if (qualityIdx >= 0) {
            const v = videoRef.current;
            if (!pending.current) pending.current = { time: v ? v.currentTime : 0, play: true };
            setQualityIdx(-1);
            setActiveSrc(src);
            return;
          }
          if (onError) onError(e);
        }}
        className="h-full w-full object-contain"
      >
        {subtitles.map((s, i) => (
          <track key={`${s.lang}-${i}`} kind="subtitles" src={s.src} srcLang={s.lang} label={s.label} />
        ))}
      </video>

      {/* Area tap */}
      <div className="absolute inset-0 touch-manipulation" onPointerUp={onSurfaceTap} />

      {/* Judul di atas */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent px-4 pb-10 pt-3 ${fade} ${
          visible ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <p className="truncate text-sm font-semibold text-white sm:text-base">{title}</p>
      </div>

      {/* Efek maju / mundur di sisi layar */}
      {SeekFx && (
        <div
          key={fx.id}
          className={`vp-fx pointer-events-none absolute inset-y-0 flex w-[38%] items-center justify-center bg-white/15 ${
            fx.type === 'back' ? 'left-0 rounded-r-[50%]' : 'right-0 rounded-l-[50%]'
          }`}
        >
          <div className="flex flex-col items-center gap-1 text-white">
            <SeekFx className="text-3xl" />
            <span className="text-xs font-semibold">{fx.total} detik</span>
          </div>
        </div>
      )}

      {/* Efek play / pause di tengah */}
      {PlayFx && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            key={fx.id}
            className="vp-fx flex h-16 w-16 items-center justify-center rounded-full bg-black/50 text-3xl text-white backdrop-blur"
          >
            <PlayFx />
          </div>
        </div>
      )}

      {/* Spinner buffering */}
      {waiting && !ended && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-white/20 border-t-white" />
        </div>
      )}

      {/* Tombol play besar saat jeda */}
      {!playing && !waiting && !ended && !fx && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Putar"
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white ring-1 ring-white/25 backdrop-blur transition hover:scale-105 hover:bg-white/25 sm:h-[4.5rem] sm:w-[4.5rem]"
        >
          <IoPlay className="ml-1" />
        </button>
      )}

      {/* Selesai: putar ulang */}
      {ended && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <button
            type="button"
            onClick={toggle}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-300"
          >
            <IoReload className="h-5 w-5" /> Putar ulang
          </button>
        </div>
      )}

      {/* Kontrol bawah */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2 pb-1.5 pt-12 sm:px-3 ${fade} ${
          visible ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div
          ref={barRef}
          role="slider"
          aria-label="Posisi video"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration) || 0}
          aria-valuenow={0}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            dragging.current = true;
            const pct = pctFromEvent(e);
            dragPct.current = pct;
            moveTip(pct);
            paint();
          }}
          onPointerMove={(e) => {
            const pct = pctFromEvent(e);
            moveTip(pct);
            if (dragging.current) {
              dragPct.current = pct;
              paint();
            }
          }}
          onPointerUp={() => {
            endDrag();
            hideTip();
          }}
          onPointerCancel={() => {
            endDrag();
            hideTip();
          }}
          onPointerLeave={hideTip}
          className="group/bar relative mx-1 flex h-6 cursor-pointer touch-none items-center"
        >
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/25 transition-[height] group-hover/bar:h-[5px] group-active/bar:h-[5px]">
            <div ref={bufRef} className="absolute inset-y-0 left-0 w-full origin-left bg-white/35 [transform:scaleX(0)]" />
            <div ref={fillRef} className="absolute inset-y-0 left-0 w-full origin-left bg-cyan-400 [transform:scaleX(0)]" />
          </div>
          <div
            ref={headRef}
            className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white shadow-md transition-transform group-hover/bar:scale-100 group-active/bar:scale-100"
          />
          <span
            ref={tipRef}
            className="pointer-events-none absolute -top-7 left-0 -translate-x-1/2 rounded-md bg-black/90 px-1.5 py-0.5 text-xs font-medium text-white opacity-0"
          />
        </div>

        {/* Tombol */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Jeda (k)' : 'Putar (k)'}
            className={`${iconBtn} text-2xl`}
          >
            {playing ? <IoPause /> : <IoPlay />}
          </button>

          {/* Volume: hanya di layar lebar (di HP pakai tombol volume perangkat) */}
          <div className="group/vol hidden items-center sm:flex">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Suara aktif (m)' : 'Bisukan (m)'}
              className={iconBtn}
            >
              <VolumeIcon />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="h-1 w-0 cursor-pointer accent-white opacity-0 transition-[width,margin,opacity] group-hover/vol:ml-1 group-hover/vol:w-20 group-hover/vol:opacity-100 focus:ml-1 focus:w-20 focus:opacity-100"
            />
          </div>

          <span className="ml-1.5 text-xs tabular-nums text-white sm:ml-2 sm:text-[13px]">
            <span ref={curRef}>0:00</span> <span className="text-neutral-400">/ {fmt(duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setMenu((m) => (m ? null : 'main'))}
              aria-label="Pengaturan"
              aria-expanded={menu !== null}
              className={`${iconBtn} ${menu ? 'bg-white/15 text-white' : ''}`}
            >
              <IoSettingsOutline />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? 'Keluar layar penuh (f)' : 'Layar penuh (f)'}
              className={iconBtn}
            >
              {fullscreen ? <IoContract /> : <IoExpand />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu pengaturan: bottom sheet di HP, popover di layar lebar */}
      {menu && (
        <div
          role="menu"
          className="vp-sheet absolute inset-x-0 bottom-0 z-20 max-h-full overflow-y-auto rounded-t-2xl border border-white/10 bg-neutral-900/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:bottom-16 sm:right-3 sm:max-h-72 sm:w-64 sm:rounded-2xl sm:pb-1"
        >
          {menu === 'main' ? (
            <div className="py-1">
              <MenuRow icon={IoSpeedometerOutline} label="Kecepatan" value={speedLabel} onClick={() => setMenu('speed')} />
              <MenuRow icon={IoOptionsOutline} label="Kualitas" value={qualityLabel} onClick={() => setMenu('quality')} />
              <MenuRow icon={IoLanguage} label="Bahasa" value={subLabel} onClick={() => setMenu('lang')} />
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setMenu('main')}
                className="flex w-full items-center gap-2 border-b border-white/10 px-4 py-3 text-left text-sm font-semibold text-white"
              >
                <IoChevronBack aria-hidden="true" /> {menuTitles[menu]}
              </button>

              <div className="py-1">
                {menu === 'speed' &&
                  SPEEDS.map((s) => (
                    <Option key={s} active={s === speed} onClick={() => changeSpeed(s)}>
                      {s === 1 ? 'Normal' : `${s}x`}
                    </Option>
                  ))}

                {menu === 'quality' && (
                  <>
                    <Option active={qualityIdx < 0} onClick={() => selectQuality(-1)}>
                      Otomatis
                    </Option>
                    {qualities.map((q, i) => (
                      <Option key={`${q.label}-${i}`} active={qualityIdx === i} onClick={() => selectQuality(i)}>
                        {q.label}
                      </Option>
                    ))}
                    {qualities.length === 0 && (
                      <p className="px-4 py-2 text-xs text-neutral-500">Belum ada pilihan kualitas lain untuk video ini.</p>
                    )}
                  </>
                )}

                {menu === 'lang' && (
                  <>
                    <Option active={subIdx < 0} onClick={() => selectSubtitle(-1)}>
                      Mati
                    </Option>
                    {subtitles.map((s, i) => (
                      <Option key={`${s.lang}-${i}`} active={subIdx === i} onClick={() => selectSubtitle(i)}>
                        {s.label}
                      </Option>
                    ))}
                    {subtitles.length === 0 && (
                      <p className="px-4 py-2 text-xs text-neutral-500">Belum ada subtitle untuk video ini.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}