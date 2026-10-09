// Simpan di: src/app/components/video/VideoPlayer.jsx
// Player kustom: tanpa kontrol bawaan browser (menu titik tiga berisi "Download" hilang),
// tanpa klik kanan, tanpa Picture-in-Picture / cast, plus watermark ID guest yang berpindah-pindah.

import { useCallback, useEffect, useRef, useState } from 'react';
import { IoPlay, IoPause, IoVolumeHigh, IoVolumeMute, IoExpand, IoContract, IoReload } from 'react-icons/io5';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const CORNERS = ['top-3 left-3', 'top-3 right-3', 'bottom-16 right-3', 'bottom-16 left-3'];

function fmt(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${h > 0 ? `${h}:${String(m).padStart(2, '0')}` : m}:${String(s).padStart(2, '0')}`;
}

export default function VideoPlayer({ src, title = '', watermark = '', onError, onLoadedMetadata }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const barRef = useRef(null);
  const hideTimer = useRef(null);
  const clickTimer = useRef(null);
  const dragging = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [ended, setEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeed, setShowSpeed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [awake, setAwake] = useState(true);
  const [hover, setHover] = useState(null); // { pct, sec }
  const [corner, setCorner] = useState(0);

  /* ---------- kontrol muncul saat mouse bergerak, hilang saat diam ---------- */
  const wake = useCallback(() => {
    setAwake(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setAwake(false), 2500);
  }, []);

  useEffect(() => () => {
    clearTimeout(hideTimer.current);
    clearTimeout(clickTimer.current);
  }, []);

  /* ---------- watermark pindah sudut tiap 15 detik ---------- */
  useEffect(() => {
    if (!watermark) return undefined;
    const t = setInterval(() => setCorner((c) => (c + 1) % CORNERS.length), 15000);
    return () => clearInterval(t);
  }, [watermark]);

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
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const seekBy = (delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0);
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

  const seekFromEvent = (e) => {
    const v = videoRef.current;
    if (v && duration) v.currentTime = pctFromEvent(e) * duration;
  };

  /* ---------- keyboard ---------- */
  const onKeyDown = (e) => {
    const map = {
      ' ': toggle,
      k: toggle,
      ArrowLeft: () => seekBy(-5),
      ArrowRight: () => seekBy(5),
      ArrowUp: () => changeVolume(Math.min(volume + 0.1, 1)),
      ArrowDown: () => changeVolume(Math.max(volume - 0.1, 0)),
      m: toggleMute,
      f: toggleFullscreen,
    };
    const action = map[e.key];
    if (action) {
      e.preventDefault();
      action();
      wake();
    }
  };

  /* ---------- klik tunggal = play/pause, klik ganda = fullscreen ---------- */
  const onSurfaceClick = () => {
    if (showSpeed) {
      setShowSpeed(false);
      return;
    }
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(toggle, 220);
  };
  const onSurfaceDoubleClick = () => {
    clearTimeout(clickTimer.current);
    toggleFullscreen();
  };

  const playedPct = duration ? (time / duration) * 100 : 0;
  const visible = awake || !playing || showSpeed;

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={wake}
      onTouchStart={wake}
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
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          if (onLoadedMetadata) onLoadedMetadata(e.currentTarget.duration);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onProgress={(e) => {
          const v = e.currentTarget;
          for (let i = 0; i < v.buffered.length; i += 1) {
            if (v.buffered.start(i) <= v.currentTime && v.currentTime <= v.buffered.end(i)) {
              setBuffered(v.buffered.end(i));
              break;
            }
          }
        }}
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
        onWaiting={() => setWaiting(true)}
        onCanPlay={() => setWaiting(false)}
        onPlaying={() => setWaiting(false)}
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
        className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent px-4 pb-8 pt-3 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="truncate text-sm font-semibold text-white">{title}</p>
      </div>

      {/* Watermark ID guest (menyulitkan penyebaran hasil rekam layar) */}
      {watermark && (
        <span
          className={`pointer-events-none absolute ${CORNERS[corner]} rounded bg-black/20 px-2 py-0.5 text-xs font-medium tracking-wider text-white/30 transition-all duration-700`}
        >
          {watermark}
        </span>
      )}

      {/* Spinner buffering */}
      {waiting && !ended && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
        </div>
      )}

      {/* Tombol play besar saat jeda */}
      {!playing && !waiting && !ended && (
        <button
          onClick={toggle}
          aria-label="Putar"
          className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cyan-500/90 text-4xl text-gray-950 shadow-[0_0_40px_rgba(34,211,238,0.5)] transition hover:scale-110 hover:bg-cyan-400"
        >
          <IoPlay className="ml-1" />
        </button>
      )}

      {/* Selesai: putar ulang */}
      {ended && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <button
            onClick={toggle}
            className="flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-cyan-400"
          >
            <IoReload className="h-5 w-5" /> Putar ulang
          </button>
        </div>
      )}

      {/* Kontrol bawah */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-2 pt-10 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div
          ref={barRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            dragging.current = true;
            seekFromEvent(e);
          }}
          onPointerMove={(e) => {
            const pct = pctFromEvent(e);
            setHover({ pct: pct * 100, sec: pct * duration });
            if (dragging.current) seekFromEvent(e);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerLeave={() => setHover(null)}
          className="group/bar relative flex h-4 cursor-pointer items-center"
        >
          <div className="relative h-1 w-full rounded-full bg-white/25 transition-all group-hover/bar:h-1.5">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/40"
              style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-cyan-400"
              style={{ width: `${playedPct}%` }}
            />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-cyan-400 shadow transition-transform group-hover/bar:scale-100"
              style={{ left: `${playedPct}%` }}
            />
          </div>
          {hover && duration > 0 && (
            <span
              className="pointer-events-none absolute -top-6 -translate-x-1/2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white"
              style={{ left: `${hover.pct}%` }}
            >
              {fmt(hover.sec)}
            </span>
          )}
        </div>

        {/* Tombol */}
        <div className="mt-1 flex items-center gap-2 text-white">
          <button
            onClick={toggle}
            aria-label={playing ? 'Jeda' : 'Putar'}
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl transition hover:bg-white/10 hover:text-cyan-400"
          >
            {playing ? <IoPause /> : <IoPlay />}
          </button>

          <div className="group/vol flex items-center">
            <button
              onClick={toggleMute}
              aria-label={muted ? 'Suara aktif' : 'Bisukan'}
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/10 hover:text-cyan-400"
            >
              {muted || volume === 0 ? <IoVolumeMute /> : <IoVolumeHigh />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="h-1 w-0 cursor-pointer accent-cyan-400 opacity-0 transition-all group-hover/vol:ml-1 group-hover/vol:w-20 group-hover/vol:opacity-100 focus:ml-1 focus:w-20 focus:opacity-100"
            />
          </div>

          <span className="ml-1 text-xs tabular-nums text-gray-200">
            {fmt(time)} / {fmt(duration)}
          </span>

          <div className="ml-auto flex items-center gap-1">
            {/* Kecepatan */}
            <div className="relative">
              <button
                onClick={() => setShowSpeed((s) => !s)}
                aria-label="Kecepatan putar"
                className="flex h-9 min-w-[2.5rem] items-center justify-center rounded-full px-2 text-xs font-semibold transition hover:bg-white/10 hover:text-cyan-400"
              >
                {speed}x
              </button>
              {showSpeed && (
                <div className="absolute bottom-11 right-0 w-24 overflow-hidden rounded-xl border border-gray-800 bg-gray-900/95 py-1 shadow-xl backdrop-blur">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`block w-full px-4 py-1.5 text-left text-sm transition hover:bg-gray-800 ${
                        s === speed ? 'font-semibold text-cyan-400' : 'text-gray-200'
                      }`}
                    >
                      {s === 1 ? 'Normal' : `${s}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              aria-label={fullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/10 hover:text-cyan-400"
            >
              {fullscreen ? <IoContract /> : <IoExpand />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}