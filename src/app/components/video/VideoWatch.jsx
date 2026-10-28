// Simpan di: src/app/components/video/VideoWatch.jsx   -> route: /video/watch?id={videoToken}

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ensureGuestToken,
  fetchVideoInfo,
  fetchVideoLibrary,
  videoStreamUrl,
} from '../utilities/guestToken';
import VideoPlayer from './VideoPlayer';
import VideoReactions from './VideoReactions';
import VideoComments from './VideoComments';
import VideoThumb from './Videothumb';
import { VideoToolbar, formatDuration, formatSize, watchPath } from './videoUi';
import Layout from '../../layout'; // sesuaikan dengan lokasi layout (App memakai './layout')

// Tanggal upload video (WIB). month: 'long' -> "9 Oktober 2026", 'short' -> "9 Okt 2026".
// Memakai uploadedAt (ISO dari Drive); kalau tidak ada, pakai uploadedAtLocal.tanggal dari backend.
function formatUploadDate(video, month = 'short') {
  if (!video) return null;
  if (video.uploadedAt) {
    const d = new Date(video.uploadedAt);
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: 'numeric',
        month,
        year: 'numeric',
      }).format(d);
    }
  }
  return video.uploadedAtLocal?.tanggal || null;
}

/* ========================= SHARE ========================= */

const SOCIALS = [
  { key: 'whatsapp', label: 'WhatsApp', className: 'bg-green-600 hover:bg-green-500' },
  { key: 'facebook', label: 'Facebook', className: 'bg-blue-600 hover:bg-blue-500' },
  { key: 'twitter', label: 'X / Twitter', className: 'bg-neutral-700 hover:bg-neutral-600' },
  { key: 'telegram', label: 'Telegram', className: 'bg-sky-600 hover:bg-sky-500' },
  { key: 'linkedin', label: 'LinkedIn', className: 'bg-blue-800 hover:bg-blue-700' },
];

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {
    /* lanjut ke fallback */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}

function CopyRow({ label, value, copied, onCopy, multiline = false }) {
  const fieldClass =
    'min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-neutral-200 outline-none transition focus:border-cyan-400/60';

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-neutral-400">{label}</p>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        {multiline ? (
          <textarea
            readOnly
            value={value}
            rows={3}
            onFocus={(e) => e.target.select()}
            className={`${fieldClass} resize-none font-mono text-xs`}
          />
        ) : (
          <input readOnly value={value} onFocus={(e) => e.target.select()} className={`${fieldClass} text-sm`} />
        )}
        <button
          type="button"
          onClick={onCopy}
          className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:py-0 ${
            copied ? 'bg-green-400 text-neutral-950' : 'bg-white text-neutral-950 hover:bg-cyan-300'
          }`}
        >
          {copied ? 'Tersalin ✓' : 'Salin'}
        </button>
      </div>
    </div>
  );
}

function ShareDialog({ share, title, onClose }) {
  const [copied, setCopied] = useState(null); // 'link' | 'embed' | null
  const timer = useRef(null);

  // Esc untuk menutup, dan kunci scroll halaman selama dialog terbuka
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer.current);
    };
  }, [onClose]);

  const handleCopy = async (kind, text) => {
    if (await copyText(text)) {
      setCopied(kind);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 2000);
    }
  };

  const social = share.social || {};

  return (
    <div
      className="vw-fade fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bagikan video"
        onClick={(e) => e.stopPropagation()}
        className="vw-pop max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-neutral-900 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15 sm:hidden" aria-hidden="true" />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold tracking-tight">Bagikan video</h3>
            {title && <p className="mt-0.5 truncate text-sm text-neutral-400">{title}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Media sosial */}
        <div className="mt-5 flex flex-wrap gap-2">
          {SOCIALS.filter((s) => social[s.key]).map((s) => (
            <a
              key={s.key}
              href={social[s.key]}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${s.className}`}
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {share.shareUrl && (
            <CopyRow
              label="Link video"
              value={share.shareUrl}
              copied={copied === 'link'}
              onCopy={() => handleCopy('link', share.shareUrl)}
            />
          )}
          {share.embedCode && (
            <CopyRow
              label="Kode embed"
              value={share.embedCode}
              multiline
              copied={copied === 'embed'}
              onCopy={() => handleCopy('embed', share.embedCode)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ShareButton({ share, title }) {
  const [open, setOpen] = useState(false);
  if (!share || !share.shareUrl) return null;

  // Di HP, pakai menu share bawaan perangkat kalau ada; kalau dibatalkan/gagal, buka dialog
  const handleClick = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ title: title || undefined, url: share.shareUrl });
        return;
      } catch (error) {
        if (error && error.name === 'AbortError') return;
      }
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13"
          />
        </svg>
        Bagikan
      </button>
      {open && <ShareDialog share={share} title={title} onClose={() => setOpen(false)} />}
    </>
  );
}

/* ========================= HALAMAN ========================= */

export default function VideoWatch() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [session, setSession] = useState(null);
  // { title, size, mimeType, views, uploadedAt, uploadedAtLocal, share }
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [duration, setDuration] = useState(0);
  const [playerError, setPlayerError] = useState(false);
  const [others, setOthers] = useState([]);

  // Muat info video tiap kali ?id= berubah (termasuk saat klik video "Berikutnya")
  useEffect(() => {
    if (!id) {
      setStatus('error');
      return undefined;
    }

    let alive = true;
    setStatus('loading');
    setPlayerError(false);
    setDuration(0);
    // Judul dari state navigasi muncul instan; kalau link dibuka langsung, tunggu fetch
    setInfo((location.state && location.state.video) || null);

    ensureGuestToken()
      .then((s) => {
        if (alive) setSession(s);
        return fetchVideoInfo(id);
      })
      .then((data) => {
        if (!alive) return;
        // Gabungkan dengan data dari state navigasi supaya field yang tidak dikembalikan tidak hilang
        setInfo((prev) => ({ ...(prev || {}), ...data }));
        setStatus('ready');
      })
      .catch((error) => {
        console.error('Video gagal dimuat:', error);
        if (alive) setStatus('error');
      });

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Daftar "Berikutnya": cukup sekali (non-fatal kalau gagal)
  useEffect(() => {
    let alive = true;
    fetchVideoLibrary()
      .then((list) => alive && setOthers(list))
      .catch((error) => console.error('Daftar berikutnya gagal dimuat:', error));
    return () => {
      alive = false;
    };
  }, []);

  const upNext = others.filter((v) => !info || v.title !== info.title);

  const goSearch = (q) => navigate(q.trim() ? `/video?q=${encodeURIComponent(q.trim())}` : '/video');

  const uploadDate = formatUploadDate(info, 'long');

  // Info singkat dalam bentuk chip
  const chips = info
    ? [
        formatDuration(duration),
        formatSize(info.size),
        typeof info.views === 'number' ? `${info.views.toLocaleString('id-ID')}x ditonton` : null,
        uploadDate ? `Diunggah ${uploadDate}` : null,
      ].filter(Boolean)
    : [];

  return (
    <Layout>
      <style>{`
        @keyframes vw-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes vw-pop {
          from { opacity: 0; transform: translateY(24px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes vw-rise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vw-fade { animation: vw-fade .2s ease-out; }
        .vw-pop  { animation: vw-pop .3s cubic-bezier(.2,.8,.2,1); }
        .vw-rise { opacity: 0; animation: vw-rise .45s ease-out forwards; }
      `}</style>

      <section className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
        {/* Cahaya latar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 left-1/3 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-purple-600/15 blur-[130px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          <VideoToolbar value={search} onChange={setSearch} onSubmit={goSearch} backTo="/video" />
          {status === 'error' ? (
            <div className="mx-auto mt-24 max-w-sm text-center">
              <p className="text-lg font-semibold">Video tidak ditemukan</p>
              <p className="mt-1 text-sm text-neutral-400">
                Link tidak valid atau sudah kedaluwarsa. Buka lagi dari library.
              </p>
              <Link
                to="/video"
                className="mt-5 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-300"
              >
                Ke Video Library
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-8 lg:flex-row">
              {/* Player */}
              <div className="min-w-0 flex-1">
                {/* Di HP player memenuhi lebar layar (full-bleed), di layar lebih besar membulat */}
                <div className="-mx-4 aspect-video overflow-hidden bg-black sm:mx-0 sm:rounded-2xl sm:shadow-2xl sm:shadow-black/60 sm:ring-1 sm:ring-white/10">
                  {session && !playerError ? (
                    <VideoPlayer
                      key={id}
                      src={videoStreamUrl(id, session)}
                      title={info ? info.title : ''}
                      qualities={info ? info.qualities : undefined}
                      subtitles={info ? info.subtitles : undefined}
                      watermark={session.userId}
                      onLoadedMetadata={(d) => setDuration(d)}
                      onError={() => setPlayerError(true)}
                    />
                  ) : playerError ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                      <p className="text-sm text-neutral-300">
                        Video tidak bisa diputar. Link mungkin sudah kedaluwarsa.
                      </p>
                      <Link
                        to="/video"
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-300"
                      >
                        Kembali ke library
                      </Link>
                    </div>
                  ) : (
                    <div className="h-full w-full animate-pulse bg-white/10" />
                  )}
                </div>

                {info ? (
                  <div key={id} className="vw-rise">
                    <h1 className="mt-4 break-words text-lg font-bold leading-snug tracking-tight sm:mt-5 sm:text-xl lg:text-2xl">
                      {info.title}
                    </h1>

                    {chips.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {chips.map((c, i) => (
                          <span
                            key={i}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-white/10 py-4">
                      <VideoReactions key={id} videoId={id} session={session} />
                      <ShareButton share={info.share} title={info.title} />
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <div className="h-7 w-2/3 animate-pulse rounded bg-white/10" />
                    <div className="h-5 w-1/2 animate-pulse rounded bg-white/10" />
                  </div>
                )}

                {/* Komentar */}
                <VideoComments key={id} videoId={id} session={session} />
              </div>

              {/* Berikutnya */}
              <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:w-80 lg:self-start lg:overflow-y-auto lg:pr-1 xl:w-96">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-tight">Berikutnya</h2>
                  {upNext.length > 0 && <span className="text-xs text-neutral-500">{upNext.length} video</span>}
                </div>

                <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-1">
                  {others.length === 0 &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex animate-pulse gap-3 p-2">
                        <div className="aspect-video w-36 shrink-0 rounded-xl bg-white/10 sm:w-40 md:w-36 xl:w-40" />
                        <div className="flex-1 space-y-2 pt-1">
                          <div className="h-3.5 w-5/6 rounded bg-white/10" />
                          <div className="h-3 w-1/3 rounded bg-white/10" />
                        </div>
                      </div>
                    ))}

                  {upNext.map((v, i) => {
                    const date = formatUploadDate(v);
                    return (
                      <Link
                        key={v.videoToken}
                        to={watchPath(v.videoToken)}
                        state={{
                          video: {
                            title: v.title,
                            size: v.size,
                            mimeType: v.mimeType,
                            views: v.views,
                            uploadedAt: v.uploadedAt,
                            uploadedAtLocal: v.uploadedAtLocal,
                            share: v.share,
                          },
                        }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="vw-rise group flex gap-3 rounded-2xl p-2 transition-colors hover:bg-white/5"
                        style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
                      >
                        <div className="w-36 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 transition group-hover:ring-cyan-400/50 sm:w-40 md:w-36 xl:w-40">
                          <VideoThumb token={v.videoToken} title={v.title} small />
                        </div>
                        <div className="min-w-0 py-0.5">
                          <p className="line-clamp-2 text-sm font-medium leading-snug text-neutral-100 transition-colors group-hover:text-cyan-300">
                            {v.title}
                          </p>
                          <p className="mt-1.5 text-xs text-neutral-500">
                            {formatSize(v.size)}
                            {date && ` • ${date}`}
                          </p>
                        </div>
                      </Link>
                    );
                  })}

                  {others.length > 0 && upNext.length === 0 && (
                    <p className="col-span-full p-2 text-sm text-neutral-500">Tidak ada video lain.</p>
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}