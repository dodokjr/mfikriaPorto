
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
  IoSettingsSharp,
  IoCheckmark,
} from 'react-icons/io5';

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SEEK_STEP = 10; // detik, tombol J / L dan klik ganda sisi kiri/kanan
const STALL_RECOVER_MS = 8000; // streaming macet selama ini -> minta ulang data

function fmt(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${h > 0 ? `${h}:${String(m).padStart(2, '0')}` : m}:${String(s).padStart(2, '0')}`;
}

export default function VideoPlayer({ src, title = '', onError, onLoadedMetadata }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const barRef = useRef(null);

  // Elemen yang digambar langsung (tanpa React state)
  const fillRef = useRef(null);
  const bufRef = useRef(null);
  const hoverFillRef = useRef(null);
  const headRef = useRef(null);
  const tipRef = useRef(null);
  const curRef = useRef(null);

  const hideTimer = useRef(null);
  const clickTimer = useRef(null);
  const flashTimer = useRef(null);
  const stallTimer = useRef(null);
  const rafRef = useRef(0);
  const seekRaf = useRef(0);
  const hoverRaf = useRef(0);
  const lastWake = useRef(0);
  const lastSec = useRef(-1);
  const dragging = useRef(false);
  const dragPct = useRef(0);
  const hoverPct = useRef(0);
  const visibleRef = useRef(true);

  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeed, setShowSpeed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [awake, setAwake] = useState(true);
  const [flash, setFlash] = useState(null); // { type: 'play' | 'pause' | 'back' | 'forward', id }

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
      if (visibleRef.current || dragging.current) paint();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, paint]);

  /* ---------- kontrol muncul saat mouse bergerak, hilang saat diam ---------- */
  const wake = useCallback(() => {
    const now = performance.now();
    if (now - lastWake.current < 200) return; // abaikan event mouse beruntun
    lastWake.current = now;
    setAwake(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setAwake(false), 2500);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(hideTimer.current);
      clearTimeout(clickTimer.current);
      clearTimeout(flashTimer.current);
      clearTimeout(stallTimer.current);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(seekRaf.current);
      cancelAnimationFrame(hoverRaf.current);
    },
    []
  );

  /* ---------- ikon sesaat di tengah layar (seperti YouTube) ---------- */
  const showFlash = useCallback((type) => {
    setFlash({ type, id: Date.now() });
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 650);
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
      showFlash('play');
    } else {
      v.pause();
      showFlash('pause');
    }
  }, [showFlash]);

  const seekBy = (delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0);
    paint();
  };

  const seekStep = (dir) => {
    seekBy(dir * SEEK_STEP);
    showFlash(dir < 0 ? 'back' : 'forward');
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
    if (v) v.playbackRate = value;
    setSpeed(value);
    setShowSpeed(false);
  };

  /* ---------- progress bar (klik + geser) ---------- */
  const pctFromEvent = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    return Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  };

  // Saat menggeser: tampilan bar mengikuti jari/kursor langsung, tapi seek ke video
  // dibatasi 1x per frame dan dilewati kalau seek sebelumnya belum selesai.
  const queueSeek = (pct) => {
    dragPct.current = pct;
    if (seekRaf.current) return;
    seekRaf.current = requestAnimationFrame(() => {
      seekRaf.current = 0;
      const v = videoRef.current;
      if (!v || !v.duration || v.seeking) return;
      const target = dragPct.current * v.duration;
      if (typeof v.fastSeek === 'function') v.fastSeek(target);
      else v.currentTime = target;
    });
  };

  const paintHover = () => {
    hoverRaf.current = 0;
    const v = videoRef.current;
    const d = (v && v.duration) || 0;
    const pct = hoverPct.current;
    if (hoverFillRef.current) hoverFillRef.current.style.transform = `scaleX(${pct})`;
    if (tipRef.current) {
      tipRef.current.style.left = `${pct * 100}%`;
      tipRef.current.textContent = fmt(pct * d);
      tipRef.current.style.opacity = d > 0 ? '1' : '0';
    }
    if (dragging.current) paint();
  };

  const hideHover = () => {
    if (dragging.current) return;
    if (hoverFillRef.current) hoverFillRef.current.style.transform = 'scaleX(0)';
    if (tipRef.current) tipRef.current.style.opacity = '0';
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    cancelAnimationFrame(seekRaf.current);
    seekRaf.current = 0;
    const v = videoRef.current;
    if (v && v.duration) v.currentTime = dragPct.current * v.duration; // seek akhir yang tepat
    paint();
  };

  /* ---------- keyboard (sama seperti YouTube) ---------- */
  const onKeyDown = (e) => {
    wake(); // tombol apa pun (termasuk Tab) memunculkan kontrol
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

  /* ---------- klik tunggal = play/pause, klik ganda: kiri -10 dtk, kanan +10 dtk, tengah fullscreen ---------- */
  const onSurfaceClick = () => {
    if (showSpeed) {
      setShowSpeed(false);
      return;
    }
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(toggle, 220);
  };
  const onSurfaceDoubleClick = (e) => {
    clearTimeout(clickTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (x < 0.3) seekStep(-1);
    else if (x > 0.7) seekStep(1);
    else toggleFullscreen();
  };

  const visible = awake || !playing || showSpeed;
  visibleRef.current = visible;
  useEffect(() => {
    if (visible) {
      paint();
      paintBuffer();
    }
  }, [visible, paint, paintBuffer]);

  const VolumeIcon = muted || volume === 0 ? IoVolumeMute : volume < 0.34 ? IoVolumeLow : volume < 0.67 ? IoVolumeMedium : IoVolumeHigh;
  const FlashIcon = flash
    ? { play: IoPlay, pause: IoPause, back: IoPlayBack, forward: IoPlayForward }[flash.type]
    : null;

  const layerShow = 'visible opacity-100';
  const layerHide = 'pointer-events-none invisible opacity-0';

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={wake}
      onTouchStart={wake}
      onFocus={wake}
      onMouseLeave={() => playing && setAwake(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`group relative h-full w-full select-none overflow-hidden bg-black outline-none ${
        visible ? '' : 'cursor-none'
      }`}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        preload="auto"
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          if (onLoadedMetadata) onLoadedMetadata(e.currentTarget.duration);
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
          wake();
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
        onError={onError}
        className="h-full w-full object-contain"
      />

      {/* Area klik */}
      <div className="absolute inset-0" onClick={onSurfaceClick} onDoubleClick={onSurfaceDoubleClick} />

      {/* Judul di atas */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 to-transparent px-4 pb-10 pt-3 transition-[opacity,visibility] duration-300 ${
          visible ? layerShow : 'invisible opacity-0'
        }`}
      >
        <p className="truncate text-base font-semibold text-white">{title}</p>
      </div>

      {/* Ikon sesaat: play / pause / mundur 10 dtk / maju 10 dtk */}
      {flash && FlashIcon && (
        <div
          key={flash.id}
          className={`pointer-events-none absolute inset-0 flex items-center ${
            flash.type === 'back'
              ? 'justify-start pl-[12%]'
              : flash.type === 'forward'
              ? 'justify-end pr-[12%]'
              : 'justify-center'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/70 text-3xl text-pink-400 ring-1 ring-pink-500/40">
              <FlashIcon />
            </div>
            {(flash.type === 'back' || flash.type === 'forward') && (
              <span className="rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-semibold text-pink-300">
                {SEEK_STEP} detik
              </span>
            )}
          </div>
        </div>
      )}

      {/* Spinner buffering */}
      {waiting && !ended && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-500/20 border-t-pink-500" />
        </div>
      )}

      {/* Tombol play besar saat jeda (sebelum diputar) */}
      {!playing && !waiting && !ended && !flash && (
        <button
          onClick={toggle}
          aria-label="Putar"
          className="absolute left-1/2 top-1/2 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-pink-500 text-4xl text-black shadow-[0_0_40px_rgba(236,72,153,0.55)] transition-transform hover:scale-110 hover:bg-pink-400"
        >
          <IoPlay className="ml-1" />
        </button>
      )}

      {/* Selesai: putar ulang */}
      {ended && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <button
            onClick={toggle}
            className="flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_0_30px_rgba(236,72,153,0.45)] transition hover:bg-pink-400"
          >
            <IoReload className="h-5 w-5" /> Putar ulang
          </button>
        </div>
      )}

      {/* Kontrol bawah */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-2 pt-12 transition-[opacity,visibility] duration-300 ${
          visible ? layerShow : layerHide
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
            hoverPct.current = pct;
            queueSeek(pct);
            paintHover();
          }}
          onPointerMove={(e) => {
            const pct = pctFromEvent(e);
            hoverPct.current = pct;
            if (!hoverRaf.current) hoverRaf.current = requestAnimationFrame(paintHover);
            if (dragging.current) queueSeek(pct);
          }}
          onPointerUp={() => {
            endDrag();
            hideHover();
          }}
          onPointerCancel={() => {
            endDrag();
            hideHover();
          }}
          onPointerLeave={hideHover}
          className="group/bar relative flex h-6 cursor-pointer touch-none items-center sm:h-4"
        >
          <div className="relative flex h-[5px] w-full items-center">
            <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/25 transition-[height] group-hover/bar:h-[5px] group-active/bar:h-[5px]">
              {/* buffer */}
              <div ref={bufRef} className="absolute inset-y-0 left-0 w-full origin-left bg-white/40 [transform:scaleX(0)]" />
              {/* posisi hover */}
              <div ref={hoverFillRef} className="absolute inset-y-0 left-0 w-full origin-left bg-pink-300/40 [transform:scaleX(0)]" />
              {/* sudah ditonton */}
              <div ref={fillRef} className="absolute inset-y-0 left-0 w-full origin-left bg-pink-500 [transform:scaleX(0)]" />
            </div>
            {/* kepala progress */}
            <div
              ref={headRef}
              className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] transition-transform group-hover/bar:scale-100 group-active/bar:scale-100"
            />
          </div>
          <span
            ref={tipRef}
            className="pointer-events-none absolute -top-7 left-0 -translate-x-1/2 rounded bg-black/90 px-1.5 py-0.5 text-xs font-medium text-white opacity-0 ring-1 ring-pink-500/40"
          />
        </div>

        {/* Tombol */}
        <div className="mt-0.5 flex items-center gap-1 text-white">
          <button
            onClick={toggle}
            aria-label={playing ? 'Jeda (k)' : 'Putar (k)'}
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl transition-colors hover:bg-pink-500/15 hover:text-pink-400"
          >
            {playing ? <IoPause /> : <IoPlay />}
          </button>

          <div className="group/vol flex items-center">
            <button
              onClick={toggleMute}
              aria-label={muted ? 'Suara aktif (m)' : 'Bisukan (m)'}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition-colors hover:bg-pink-500/15 hover:text-pink-400"
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
              className="h-1 w-0 cursor-pointer accent-pink-500 opacity-0 transition-[width,margin,opacity] group-hover/vol:ml-1 group-hover/vol:w-20 group-hover/vol:opacity-100 focus:ml-1 focus:w-20 focus:opacity-100"
            />
          </div>

          <span className="ml-2 text-[13px] tabular-nums text-gray-100">
            <span ref={curRef}>0:00</span> <span className="text-gray-400">/ {fmt(duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-1">
            {/* Pengaturan: kecepatan putar */}
            <div className="relative">
              <button
                onClick={() => setShowSpeed((s) => !s)}
                aria-label="Pengaturan kecepatan putar"
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xl transition hover:bg-pink-500/15 hover:text-pink-400 ${
                  showSpeed ? 'rotate-45 text-pink-400' : ''
                }`}
              >
                <IoSettingsSharp />
              </button>
              {showSpeed && (
                <div className="absolute bottom-12 right-0 w-44 overflow-hidden rounded-xl border border-pink-500/30 bg-black py-1 shadow-lg">
                  <p className="border-b border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-pink-400">
                    Kecepatan putar
                  </p>
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-pink-500/15 ${
                        s === speed ? 'font-semibold text-pink-400' : 'text-gray-200'
                      }`}
                    >
                      <span className="flex h-4 w-4 items-center justify-center">
                        {s === speed && <IoCheckmark />}
                      </span>
                      {s === 1 ? 'Normal' : `${s}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              aria-label={fullscreen ? 'Keluar layar penuh (f)' : 'Layar penuh (f)'}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition-colors hover:bg-pink-500/15 hover:text-pink-400"
            >
              {fullscreen ? <IoContract /> : <IoExpand />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}