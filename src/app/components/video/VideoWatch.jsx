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
import { Thumb, VideoToolbar, formatDuration, formatSize, watchPath } from './videoUi';
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
  { key: 'twitter', label: 'X / Twitter', className: 'bg-gray-700 hover:bg-gray-600' },
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
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
      <div className="flex items-stretch gap-2">
        {multiline ? (
          <textarea
            readOnly
            value={value}
            rows={3}
            onFocus={(e) => e.target.select()}
            className="min-w-0 flex-1 resize-none rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 font-mono text-xs text-gray-200 outline-none focus:border-cyan-500"
          />
        ) : (
          <input
            readOnly
            value={value}
            onFocus={(e) => e.target.select()}
            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-500"
          />
        )}
        <button
          type="button"
          onClick={onCopy}
          className={`shrink-0 rounded-lg px-4 text-sm font-semibold transition ${
            copied ? 'bg-green-500 text-gray-950' : 'bg-cyan-500 text-gray-950 hover:bg-cyan-400'
          }`}
        >
          {copied ? 'Tersalin' : 'Salin'}
        </button>
      </div>
    </div>
  );
}

function ShareDialog({ share, title, onClose }) {
  const [copied, setCopied] = useState(null); // 'link' | 'embed' | null
  const timer = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bagikan video"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold">Bagikan</h3>
            {title && <p className="mt-0.5 truncate text-sm text-gray-400">{title}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Media sosial */}
        <div className="mt-4 flex flex-wrap gap-2">
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
        className="inline-flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
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
  const [durations, setDurations] = useState({});

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
  const setOtherDuration = (token, d) =>
    setDurations((prev) => (prev[token] === d ? prev : { ...prev, [token]: d }));

  const goSearch = (q) => navigate(q.trim() ? `/video?q=${encodeURIComponent(q.trim())}` : '/video');

  const uploadDate = formatUploadDate(info, 'long');

  return (
    <Layout>
      <section className="min-h-screen bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <VideoToolbar value={search} onChange={setSearch} onSubmit={goSearch} backTo="/video" />
          {status === 'error' ? (
            <div className="mx-auto mt-20 max-w-sm text-center">
              <p className="text-lg font-semibold">Video tidak ditemukan</p>
              <p className="mt-1 text-sm text-gray-400">
                Link tidak valid atau sudah kedaluwarsa. Buka lagi dari library.
              </p>
              <Link
                to="/video"
                className="mt-4 inline-block rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-gray-950 transition hover:bg-cyan-400"
              >
                Ke Video Library
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Player */}
              <div className="min-w-0 flex-1">
                <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                  {session && !playerError ? (
                    <VideoPlayer
                      key={id}
                      src={videoStreamUrl(id, session)}
                      title={info ? info.title : ''}
                      watermark={session.userId}
                      onLoadedMetadata={(d) => setDuration(d)}
                      onError={() => setPlayerError(true)}
                    />
                  ) : playerError ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                      <p className="text-sm text-gray-300">
                        Video tidak bisa diputar. Link mungkin sudah kedaluwarsa.
                      </p>
                      <Link
                        to="/video"
                        className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-cyan-400"
                      >
                        Kembali ke library
                      </Link>
                    </div>
                  ) : (
                    <div className="h-full w-full animate-pulse bg-gray-900" />
                  )}
                </div>

                {info ? (
                  <>
                    <h1 className="mt-4 text-xl font-bold leading-snug">{info.title}</h1>
                    <p className="mt-1 text-sm text-gray-400">
                      {[
                        formatDuration(duration),
                        formatSize(info.size),
                        typeof info.views === 'number' ? `${info.views.toLocaleString('id-ID')}x ditonton` : null,
                        uploadDate ? `Diunggah ${uploadDate}` : null,
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <ShareButton share={info.share} title={info.title} />
                    </div>
                  </>
                ) : (
                  <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-gray-900" />
                )}
              </div>

              {/* Berikutnya */}
              <aside className="w-full shrink-0 lg:w-96">
                <h2 className="mb-3 text-sm font-semibold text-gray-300">Berikutnya</h2>
                <div className="space-y-3">
                  {upNext.map((v) => {
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
                        className="group flex gap-3"
                      >
                        <div className="w-40 shrink-0">
                          <Thumb
                            url={v.videoUrl}
                            duration={durations[v.videoToken]}
                            onDuration={(d) => setOtherDuration(v.videoToken, d)}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-cyan-400">
                            {v.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatSize(v.size)}
                            {date && ` • ${date}`}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                  {others.length > 0 && upNext.length === 0 && (
                    <p className="text-sm text-gray-500">Tidak ada video lain.</p>
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