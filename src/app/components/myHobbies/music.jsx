import { useCallback, useEffect, useRef, useState } from 'react'
import {
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoPlay,
  IoPause,
  IoReload,
  IoVolumeHigh,
  IoVolumeLow,
  IoVolumeMute,
  IoShuffle,
  IoRepeat,
  IoMusicalNotes,
  IoExpandOutline,
  IoAlertCircleOutline,
  IoMoon,
  IoMoonOutline,
} from 'react-icons/io5'

const API_URL = 'https://api-mfikria.vercel.app/mfikria/myhobbies/music'
const PLAYLIST_NAME = 'Distro'
const COVER_FITS = ['object-cover', 'object-contain', 'object-fill']
const RESTART_AFTER = 3 // detik: tombol "sebelumnya" mengulang lagu jika sudah lewat dari ini
const SLEEP_OPTIONS = [
  { seconds: 10, label: '10 detik' }, // untuk testing, hapus baris ini kalau sudah tidak perlu
  { seconds: 15 * 60, label: '15 menit' },
  { seconds: 30 * 60, label: '30 menit' },
  { seconds: 45 * 60, label: '45 menit' },
  { seconds: 60 * 60, label: '60 menit' },
  { seconds: 90 * 60, label: '90 menit' },
] // pilihan timer tidur
const FADE_MS = 3000 // lama volume memudar sebelum musik berhenti
const FADE_STEPS = 30

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

function chipClass(on) {
  return `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${focusRing} ${
    on
      ? 'border-pink-500/40 bg-pink-500/15 text-pink-300'
      : 'border-gray-700/60 text-gray-300 hover:bg-white/5 hover:text-white'
  }`
}

/* Gambar dengan fallback kalau URL rusak / kosong */
function Cover({ src, alt = '', className = '', iconSize = 22 }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 text-gray-600 ${className}`}>
        <IoMusicalNotes size={iconSize} aria-hidden="true" />
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}

export default function Music() {
  const [tracks, setTracks] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | empty | error
  const [reloadKey, setReloadKey] = useState(0)

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [coverFit, setCoverFit] = useState(0)

  // Timer tidur
  const [sleepEnd, setSleepEnd] = useState(null) // timestamp (ms) kapan musik berhenti
  const [sleepTrack, setSleepTrack] = useState(false) // berhenti setelah lagu ini selesai
  const [sleepChoice, setSleepChoice] = useState(null) // durasi (detik) yang sedang aktif
  const [sleepLeft, setSleepLeft] = useState(0) // sisa detik
  const [sleepOpen, setSleepOpen] = useState(false)

  const audioRef = useRef(null)
  const listRef = useRef(null)
  const autoplayRef = useRef(false)
  const actionsRef = useRef({})
  const fadeRef = useRef(null)
  const volumeRef = useRef(1)

  const track = tracks[index] ?? null
  const src = track?.songSrc
  const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0
  const silent = muted || volume === 0
  const sleepActive = sleepEnd !== null || sleepTrack

  volumeRef.current = volume

  /* ---------- Ambil daftar lagu ---------- */
  useEffect(() => {
    const ctrl = new AbortController()

    ;(async () => {
      try {
        setStatus('loading')
        const res = await fetch(API_URL, { signal: ctrl.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const list = data?.assets_data?.music
        const valid = Array.isArray(list) ? list.filter((s) => s && s.songSrc) : []
        setTracks(valid)
        setIndex(0)
        setStatus(valid.length ? 'ready' : 'empty')
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Gagal mengambil data lagu:', err)
        setStatus('error')
      }
    })()

    return () => ctrl.abort()
  }, [reloadKey])

  /* ---------- Volume & mute ---------- */
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
    a.muted = muted
  }, [volume, muted])

  /* ---------- Putar otomatis saat lagu berganti ---------- */
  const onPlayError = useCallback((err) => {
    if (err?.name === 'AbortError') return // play() dibatalkan karena src berganti, bukan error
    console.error('Gagal memutar audio:', err)
    setIsBuffering(false)
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a || !src) return
    setCurrentTime(0)
    setDuration(0)
    setAudioError(false)
    if (autoplayRef.current) {
      setIsBuffering(true)
      a.play().catch(onPlayError)
    }
  }, [src, onPlayError])

  /* ---------- Gulir daftar putar ke lagu aktif (tanpa menggeser halaman) ---------- */
  useEffect(() => {
    const list = listRef.current
    const el = list?.querySelector('[aria-current="true"]')
    if (!list || !el) return
    const top = el.offsetTop
    const bottom = top + el.offsetHeight
    if (top < list.scrollTop || bottom > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: top - list.clientHeight / 2 + el.offsetHeight / 2, behavior: 'smooth' })
    }
  }, [index, status])

  /* ---------- Timer tidur ---------- */
  // Batalkan fade yang sedang berjalan dan kembalikan volume ke nilai pilihan pengguna
  const stopFade = useCallback(() => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current)
      fadeRef.current = null
      const a = audioRef.current
      if (a) a.volume = volumeRef.current
    }
  }, [])

  // Kecilkan volume pelan-pelan lalu jeda
  const fadeOutAndPause = useCallback(() => {
    const a = audioRef.current
    if (!a || a.paused) return
    if (fadeRef.current) clearInterval(fadeRef.current)
    const startVol = a.volume
    let step = 0
    fadeRef.current = setInterval(() => {
      step += 1
      a.volume = Math.max(0, startVol * (1 - step / FADE_STEPS))
      if (step >= FADE_STEPS) {
        clearInterval(fadeRef.current)
        fadeRef.current = null
        a.pause()
        a.volume = volumeRef.current
        autoplayRef.current = false
      }
    }, FADE_MS / FADE_STEPS)
  }, [])

  // Hitung mundur berdasarkan waktu akhir (tetap akurat walau tab di latar belakang)
  useEffect(() => {
    if (sleepEnd === null) {
      setSleepLeft(0)
      return
    }
    const tick = () => {
      const left = Math.ceil((sleepEnd - Date.now()) / 1000)
      if (left <= 0) {
        setSleepEnd(null)
        setSleepChoice(null)
        fadeOutAndPause()
      } else {
        setSleepLeft(left)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [sleepEnd, fadeOutAndPause])

  // Bersihkan fade saat komponen dilepas
  useEffect(() => () => {
    if (fadeRef.current) clearInterval(fadeRef.current)
  }, [])

  const startSleep = (seconds) => {
    setSleepTrack(false)
    setSleepChoice(seconds)
    setSleepEnd(Date.now() + seconds * 1000)
  }

  const startSleepAtTrackEnd = () => {
    setSleepEnd(null)
    setSleepChoice(null)
    setSleepTrack(true)
  }

  const cancelSleep = () => {
    setSleepEnd(null)
    setSleepChoice(null)
    setSleepTrack(false)
  }

  /* ---------- Kontrol ---------- */
  const goTo = (i) => {
    autoplayRef.current = true
    if (i === index) {
      const a = audioRef.current
      if (a) {
        a.currentTime = 0
        a.play().catch(onPlayError)
      }
      return
    }
    setIndex(i)
  }

  const play = () => {
    const a = audioRef.current
    if (!a || !src) return
    stopFade()
    autoplayRef.current = true
    a.play().catch(onPlayError)
  }

  const pause = () => {
    stopFade()
    audioRef.current?.pause()
  }

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) play()
    else pause()
  }

  const next = () => {
    if (!tracks.length) return
    stopFade()
    if (isShuffle && tracks.length > 1) {
      let r
      do {
        r = Math.floor(Math.random() * tracks.length)
      } while (r === index)
      goTo(r)
    } else {
      goTo((index + 1) % tracks.length)
    }
  }

  const prev = () => {
    if (!tracks.length) return
    stopFade()
    const a = audioRef.current
    if (a && a.currentTime > RESTART_AFTER) {
      a.currentTime = 0
      return
    }
    goTo(index === 0 ? tracks.length - 1 : index - 1)
  }

  // Saat lagu selesai: berhenti jika timer "akhir lagu" aktif atau fade timer sedang berjalan
  const handleEnded = () => {
    if (sleepTrack || fadeRef.current) {
      stopFade()
      setSleepTrack(false)
      autoplayRef.current = false
      return
    }
    next()
  }

  const handleSeek = (e) => {
    const t = parseFloat(e.target.value)
    const a = audioRef.current
    if (a && Number.isFinite(t)) {
      a.currentTime = t
      setCurrentTime(t)
    }
  }

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value)
    stopFade()
    setVolume(v)
    setMuted(v === 0)
  }

  const toggleMute = () => {
    stopFade()
    if (silent) {
      if (volume === 0) setVolume(0.5)
      setMuted(false)
    } else {
      setMuted(true)
    }
  }

  /* ---------- Media Session (tombol di lock screen / notifikasi) ---------- */
  actionsRef.current = { play, pause, next, prev }

  useEffect(() => {
    if (!('mediaSession' in navigator) || !track || typeof MediaMetadata === 'undefined') return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.songName || '',
      artist: track.songArtist || '',
      artwork: track.songAvatar ? [{ src: track.songAvatar }] : [],
    })
  }, [track])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
  }, [isPlaying])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const set = (action, fn) => {
      try {
        navigator.mediaSession.setActionHandler(action, fn)
      } catch {
        /* aksi tidak didukung browser */
      }
    }
    set('play', () => actionsRef.current.play())
    set('pause', () => actionsRef.current.pause())
    set('nexttrack', () => actionsRef.current.next())
    set('previoustrack', () => actionsRef.current.prev())
    return () => {
      set('play', null)
      set('pause', null)
      set('nexttrack', null)
      set('previoustrack', null)
    }
  }, [])

  /* ---------- Elemen audio (selalu ter-mount supaya ref tidak null) ---------- */
  const audioEl = (
    <audio
      ref={audioRef}
      src={src}
      preload="metadata"
      loop={isLooping && !sleepTrack}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onEnded={handleEnded}
      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      onLoadedMetadata={(e) => {
        const d = e.currentTarget.duration
        setDuration(Number.isFinite(d) ? d : 0)
      }}
      onDurationChange={(e) => {
        const d = e.currentTarget.duration
        setDuration(Number.isFinite(d) ? d : 0)
      }}
      onWaiting={() => setIsBuffering(true)}
      onPlaying={() => setIsBuffering(false)}
      onCanPlay={() => setIsBuffering(false)}
      onError={() => {
        setIsBuffering(false)
        setIsPlaying(false)
        setAudioError(true)
      }}
    />
  )

  const VolumeIcon = silent ? IoVolumeMute : volume < 0.5 ? IoVolumeLow : IoVolumeHigh
  const SleepIcon = sleepActive ? IoMoon : IoMoonOutline
  const sleepLabel = sleepTrack ? 'Akhir lagu' : sleepEnd !== null ? formatTime(sleepLeft) : 'Timer tidur'

  return (
    <>
      {audioEl}

      {status === 'loading' && (
        <div className="flex min-h-[60vh] items-center justify-center text-white">
          <div className="flex flex-col items-center gap-3" role="status">
            <IoReload className="h-9 w-9 animate-spin text-pink-500" aria-hidden="true" />
            <p className="text-sm text-gray-400">Memuat daftar musik...</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex min-h-[60vh] items-center justify-center px-4 text-white">
          <div className="flex max-w-xs flex-col items-center gap-3 text-center" role="alert">
            <IoAlertCircleOutline className="h-10 w-10 text-pink-500" aria-hidden="true" />
            <p className="text-sm text-gray-300">Daftar musik gagal dimuat. Periksa koneksi internet lalu coba lagi.</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className={`rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-500 ${focusRing} focus-visible:ring-offset-gray-950`}
            >
              Coba lagi
            </button>
          </div>
        </div>
      )}

      {status === 'empty' && (
        <div className="flex min-h-[60vh] items-center justify-center px-4 text-white">
          <p className="text-sm text-gray-400">Belum ada lagu di daftar ini.</p>
        </div>
      )}

      {status === 'ready' && track && (
        <section className="w-full px-4 py-6 text-white sm:py-10">
          <h1 className="sr-only">Pemutar musik</h1>

          <div className="relative isolate mx-auto grid w-full max-w-4xl grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/80 shadow-2xl md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            {/* Cahaya latar dari cover lagu yang sedang diputar */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 scale-125 bg-cover bg-center opacity-20 blur-3xl"
              style={track.songAvatar ? { backgroundImage: `url("${track.songAvatar}")` } : undefined}
            />

            {/* ===== Panel pemutar ===== */}
            <div className="flex min-w-0 flex-col p-6 sm:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-300">
                <IoMusicalNotes size={13} aria-hidden="true" />
                {PLAYLIST_NAME} ({tracks.length} lagu)
              </span>

              {/* Cover + piringan hitam */}
              <div className="mt-6 flex justify-center">
                <div className="relative aspect-square w-[min(15rem,72%)]">
                  <div
                    aria-hidden="true"
                    className={`mp-vinyl absolute left-[30%] top-[4%] aspect-square w-[92%] rounded-full ${
                      isPlaying ? 'is-playing' : ''
                    }`}
                  >
                    <div className="mp-vinyl-disc absolute inset-0 rounded-full" />
                    <div className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-gray-950">
                      <Cover src={track.songAvatar} className="h-full w-full object-cover" iconSize={14} />
                    </div>
                    <div className="absolute left-1/2 top-1/2 h-[5%] w-[5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-950" />
                  </div>

                  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-800 shadow-2xl shadow-black/50">
                    <Cover
                      src={track.songAvatar}
                      alt={`Cover ${track.songName || 'lagu'}`}
                      className={`h-full w-full ${COVER_FITS[coverFit]}`}
                      iconSize={40}
                    />
                    {isBuffering && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm" role="status">
                        <IoReload className="h-7 w-7 animate-spin text-pink-400" aria-hidden="true" />
                        <span className="sr-only">Memuat lagu</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setCoverFit((i) => (i + 1) % COVER_FITS.length)}
                      aria-label="Ubah tampilan cover"
                      title="Ubah tampilan cover"
                      className={`absolute bottom-2 right-2 rounded-lg bg-black/55 p-1.5 text-white/80 backdrop-blur transition-colors hover:text-white ${focusRing} focus-visible:ring-offset-0`}
                    >
                      <IoExpandOutline size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Judul */}
              <div className="mt-6 text-center">
                <h2 className="truncate text-xl font-bold text-white sm:text-2xl" title={track.songName}>
                  {track.songName || 'Tanpa judul'}
                </h2>
                <p className="mt-1 truncate text-sm text-pink-300/90" title={track.songArtist}>
                  {track.songArtist || 'Artis tidak diketahui'}
                </p>
                {audioError && (
                  <p role="alert" className="mt-2 text-sm text-rose-300">
                    Lagu ini tidak bisa diputar. Coba lagu lain di daftar putar.
                  </p>
                )}
              </div>

              {/* Seek */}
              <div className="mt-5">
                <input
                  type="range"
                  className="mp-range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={handleSeek}
                  disabled={!duration}
                  aria-label="Posisi lagu"
                  aria-valuetext={`${formatTime(currentTime)} dari ${formatTime(duration)}`}
                  style={{ '--p': `${progress}%` }}
                />
                <div className="mt-0.5 flex justify-between text-xs tabular-nums text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Tombol kontrol */}
              <div className="mt-3 flex items-center justify-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setIsShuffle((v) => !v)}
                  aria-pressed={isShuffle}
                  aria-label="Acak lagu"
                  title="Acak lagu"
                  className={`rounded-full p-2.5 transition-colors ${focusRing} ${
                    isShuffle ? 'bg-pink-500/15 text-pink-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <IoShuffle size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={prev}
                  aria-label="Lagu sebelumnya"
                  className={`rounded-full p-3 text-gray-200 transition-colors hover:bg-white/10 hover:text-white ${focusRing}`}
                >
                  <IoPlaySkipBack size={22} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Jeda' : 'Putar'}
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-pink-600 text-white shadow-lg shadow-pink-600/30 transition-all hover:bg-pink-500 active:scale-95 ${focusRing}`}
                >
                  {isBuffering ? (
                    <IoReload size={26} className="animate-spin" aria-hidden="true" />
                  ) : isPlaying ? (
                    <IoPause size={28} aria-hidden="true" />
                  ) : (
                    <IoPlay size={28} className="ml-0.5" aria-hidden="true" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Lagu berikutnya"
                  className={`rounded-full p-3 text-gray-200 transition-colors hover:bg-white/10 hover:text-white ${focusRing}`}
                >
                  <IoPlaySkipForward size={22} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLooping((v) => !v)}
                  aria-pressed={isLooping}
                  aria-label="Ulangi lagu"
                  title="Ulangi lagu"
                  className={`rounded-full p-2.5 transition-colors ${focusRing} ${
                    isLooping ? 'bg-pink-500/15 text-pink-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <IoRepeat size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Volume */}
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-gray-800/60 bg-gray-950/40 px-3 py-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={silent ? 'Nyalakan suara' : 'Bisukan suara'}
                  className={`rounded-full p-1 text-gray-400 transition-colors hover:text-white ${focusRing}`}
                >
                  <VolumeIcon size={18} aria-hidden="true" />
                </button>
                <input
                  type="range"
                  className="mp-range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={silent ? 0 : volume}
                  onChange={handleVolume}
                  aria-label="Volume"
                  style={{ '--p': `${(silent ? 0 : volume) * 100}%` }}
                />
                <span className="w-10 text-right text-xs tabular-nums text-gray-400">
                  {Math.round((silent ? 0 : volume) * 100)}%
                </span>
              </div>

              {/* Timer tidur */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setSleepOpen((v) => !v)}
                  aria-expanded={sleepOpen}
                  aria-controls="sleep-panel"
                  className={`mx-auto flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${focusRing} ${
                    sleepActive
                      ? 'border-pink-500/40 bg-pink-500/15 text-pink-300'
                      : 'border-gray-700/60 text-gray-400 hover:text-white'
                  }`}
                >
                  <SleepIcon size={15} aria-hidden="true" />
                  <span className="tabular-nums">{sleepLabel}</span>
                </button>

                {sleepOpen && (
                  <div
                    id="sleep-panel"
                    role="group"
                    aria-label="Pilihan timer tidur"
                    className="mt-3 rounded-2xl border border-gray-800/60 bg-gray-950/40 p-3"
                  >
                    <p className="mb-2 text-center text-xs text-gray-400">Musik berhenti otomatis dalam:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {SLEEP_OPTIONS.map((o) => {
                        const on = sleepEnd !== null && sleepChoice === o.seconds
                        return (
                          <button
                            key={o.seconds}
                            type="button"
                            onClick={() => startSleep(o.seconds)}
                            aria-pressed={on}
                            className={chipClass(on)}
                          >
                            {o.label}
                          </button>
                        )
                      })}
                      <button
                        type="button"
                        onClick={startSleepAtTrackEnd}
                        aria-pressed={sleepTrack}
                        className={chipClass(sleepTrack)}
                      >
                        Akhir lagu ini
                      </button>
                    </div>
                    {sleepActive && (
                      <div className="mt-3 flex justify-center">
                        <button
                          type="button"
                          onClick={cancelSleep}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/10 ${focusRing}`}
                        >
                          Matikan timer
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <span className="sr-only" role="status">
                  {sleepEnd !== null
                    ? `Timer tidur aktif, sisa ${Math.ceil(sleepLeft / 60)} menit`
                    : sleepTrack
                      ? 'Timer tidur aktif, berhenti setelah lagu ini'
                      : ''}
                </span>
              </div>
            </div>

            {/* ===== Daftar putar ===== */}
            <div className="min-w-0 border-t border-gray-800/80 p-4 sm:p-6 md:border-l md:border-t-0">
              <h3 className="mb-3 px-1 text-sm font-semibold text-gray-200">Daftar putar</h3>
              <ul
                ref={listRef}
                className="mp-scroll relative max-h-80 space-y-1.5 overflow-y-auto pr-1 md:max-h-[34rem]"
              >
                {tracks.map((song, i) => {
                  const active = i === index
                  return (
                    <li key={`${song.songSrc}-${i}`}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-current={active ? 'true' : undefined}
                        className={`group flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${focusRing} ${
                          active
                            ? 'border-pink-500/30 bg-pink-500/10'
                            : 'border-transparent hover:bg-white/5'
                        }`}
                      >
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-700/50 bg-gray-800">
                          <Cover src={song.songAvatar} className="h-full w-full object-cover" iconSize={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm font-medium ${
                              active ? 'text-pink-300' : 'text-gray-200 group-hover:text-white'
                            }`}
                          >
                            {song.songName || 'Tanpa judul'}
                          </p>
                          <p className="truncate text-xs text-gray-500">{song.songArtist}</p>
                        </div>
                        {active && (
                          <span className={`mp-eq shrink-0 ${isPlaying ? 'is-playing' : ''}`} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      <style>{`
        /* Slider (seek & volume) */
        .mp-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 20px;
          background: transparent;
          cursor: pointer;
          border-radius: 999px;
        }
        .mp-range:disabled { opacity: .5; cursor: default; }
        .mp-range:focus-visible { outline: 2px solid #f472b6; outline-offset: 2px; }
        .mp-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(to right, #ec4899 var(--p, 0%), rgba(255,255,255,.12) var(--p, 0%));
        }
        .mp-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          margin-top: -4px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(236,72,153,.25);
        }
        .mp-range::-moz-range-track {
          height: 6px; border-radius: 999px; background: rgba(255,255,255,.12);
        }
        .mp-range::-moz-range-progress {
          height: 6px; border-radius: 999px; background: #ec4899;
        }
        .mp-range::-moz-range-thumb {
          width: 14px; height: 14px; border: 0; border-radius: 50%;
          background: #fff; box-shadow: 0 0 0 4px rgba(236,72,153,.25);
        }

        /* Piringan hitam */
        .mp-vinyl { animation: mp-spin 6s linear infinite; animation-play-state: paused; }
        .mp-vinyl.is-playing { animation-play-state: running; }
        .mp-vinyl-disc {
          background:
            conic-gradient(from 0deg, rgba(255,255,255,.08), transparent 25%, rgba(255,255,255,.08) 50%, transparent 75%, rgba(255,255,255,.08)),
            repeating-radial-gradient(circle at center, #0a0a0f 0 2px, #15151c 2px 4px);
          box-shadow: 0 10px 30px rgba(0,0,0,.5);
        }
        @keyframes mp-spin { to { transform: rotate(360deg); } }

        /* Equalizer di daftar putar */
        .mp-eq { display: flex; align-items: flex-end; gap: 2px; height: 16px; }
        .mp-eq span {
          width: 3px; height: 30%; border-radius: 2px; background: #ec4899;
          animation: mp-eq 900ms ease-in-out infinite;
          animation-play-state: paused;
        }
        .mp-eq.is-playing span { animation-play-state: running; }
        .mp-eq span:nth-child(2) { animation-delay: -300ms; }
        .mp-eq span:nth-child(3) { animation-delay: -600ms; }
        @keyframes mp-eq { 0%, 100% { height: 25%; } 50% { height: 100%; } }

        /* Scrollbar daftar putar */
        .mp-scroll::-webkit-scrollbar { width: 5px; }
        .mp-scroll::-webkit-scrollbar-track { background: transparent; }
        .mp-scroll::-webkit-scrollbar-thumb { background: rgba(236,72,153,.3); border-radius: 8px; }
        .mp-scroll::-webkit-scrollbar-thumb:hover { background: rgba(236,72,153,.6); }
        .mp-scroll { scrollbar-width: thin; scrollbar-color: rgba(236,72,153,.4) transparent; }

        @media (prefers-reduced-motion: reduce) {
          .mp-vinyl, .mp-eq span { animation: none; }
          .mp-eq span { height: 60%; }
        }
      `}</style>
    </>
  )
}