import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiRefresh } from 'react-icons/hi';
import { fetchVideoLibrary } from '../utilities/guestToken'; // folder "utilities" (sama dengan yang dipakai App.jsx)
import { VideoToolbar, formatSize, watchPath } from './videoUi';
import VideoThumb from './Videothumb';
import Layout from '../../layout'; // sesuaikan dengan lokasi layout (App memakai './layout')

// Tanggal upload video, contoh: "9 Okt 2026" (zona waktu WIB).
// Memakai uploadedAt (ISO dari Drive); kalau tidak ada, pakai uploadedAtLocal.tanggal dari backend.
function formatUploadDate(video) {
  if (video.uploadedAt) {
    const d = new Date(video.uploadedAt);
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    }
  }
  return video.uploadedAtLocal?.tanggal || null;
}

// Data yang dikirim ke halaman tonton lewat router state
function watchState(v) {
  return {
    video: {
      title: v.title,
      size: v.size,
      mimeType: v.mimeType,
      views: v.views,
      uploadedAt: v.uploadedAt,
      uploadedAtLocal: v.uploadedAtLocal,
    },
  };
}

// Baris info kecil: ukuran • views • tanggal
function Meta({ video, className = '' }) {
  const uploadDate = formatUploadDate(video);
  const items = [
    formatSize(video.size),
    typeof video.views === 'number' ? `${video.views.toLocaleString('id-ID')}x ditonton` : null,
    uploadDate,
  ].filter(Boolean);

  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 ${className}`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="h-0.5 w-0.5 rounded-full bg-neutral-600" aria-hidden="true" />}
          {item}
        </span>
      ))}
    </p>
  );
}

export default function VideoLibrary() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  const load = useCallback(() => {
    setStatus('loading');
    // Backend mengacak urutan di setiap pemanggilan, jadi video pertama berbeda-beda.
    // Token guest 24 jam diurus otomatis (sessionStorage -> cek backend -> buat baru kalau expired).
    fetchVideoLibrary()
      .then((list) => {
        setVideos(list);
        setStatus('ready');
      })
      .catch((error) => {
        console.error('Library video gagal dimuat:', error);
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Kalau URL berubah (?q=...) dari halaman tonton, ikuti
  useEffect(() => {
    setSearch(params.get('q') || '');
  }, [params]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? videos.filter((v) => v.title.toLowerCase().includes(q)) : videos;
  }, [videos, search]);

  // Video pertama tampil besar sebagai sorotan (hanya saat tidak mencari & videonya cukup banyak)
  const showFeatured = status === 'ready' && !search.trim() && filtered.length >= 3;
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;

  return (
    <Layout>
      <style>{`
        @keyframes vl-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vl-rise { opacity: 0; animation: vl-rise .5s ease-out forwards; }
      `}</style>

      <section className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
        {/* Cahaya latar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-600/15 to-purple-600/20 blur-[120px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Video</h1>
              <p className="mt-2 text-sm text-neutral-400">
                {status === 'ready'
                  ? `${videos.length} video${search.trim() ? ` · ${filtered.length} hasil` : ''}`
                  : 'Koleksi video pilihan'}
              </p>
            </div>
            {status === 'ready' && (
              <button
                onClick={load}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
              >
                <HiRefresh className="h-4 w-4" aria-hidden="true" /> Acak ulang
              </button>
            )}
          </div>

          <VideoToolbar value={search} onChange={setSearch} />

          {/* Loading */}
          {status === 'loading' && (
            <div className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video rounded-2xl bg-white/10" />
                  <div className="mt-3 h-4 w-5/6 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-white/10" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div className="mx-auto mt-24 max-w-sm text-center">
              <p className="text-lg font-semibold">Video tidak bisa dimuat</p>
              <p className="mt-1 text-sm text-neutral-400">Periksa koneksi lalu coba lagi.</p>
              <button
                onClick={load}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-300"
              >
                <HiRefresh className="h-4 w-4" aria-hidden="true" /> Coba lagi
              </button>
            </div>
          )}

          {/* Kosong */}
          {status === 'ready' && filtered.length === 0 && (
            <p className="mt-24 text-center text-neutral-400">
              {videos.length === 0 ? 'Belum ada video.' : `Tidak ada video untuk "${search}".`}
            </p>
          )}

          {/* Sorotan */}
          {featured && (
            <Link
              to={watchPath(featured.videoToken)}
              state={watchState(featured)}
              className="vl-rise group mt-8 grid gap-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-cyan-400/40 hover:bg-white/[0.05] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-center md:gap-8 md:p-4"
            >
              <div className="overflow-hidden rounded-2xl transition duration-500 group-hover:scale-[1.01]">
                <VideoThumb token={featured.videoToken} title={featured.title} />
              </div>
              <div className="px-2 pb-3 md:px-0 md:pb-0 md:pr-4">
                <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  Pilihan untukmu
                </span>
                <h2 className="mt-4 line-clamp-3 text-2xl font-bold leading-snug tracking-tight transition-colors group-hover:text-cyan-300 sm:text-3xl">
                  {featured.title}
                </h2>
                <Meta video={featured} className="mt-3" />
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition group-hover:bg-cyan-300">
                  Tonton sekarang <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          )}

          {/* Daftar video */}
          {status === 'ready' && rest.length > 0 && (
            <div className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rest.map((v, i) => (
                <Link
                  key={v.videoToken}
                  to={watchPath(v.videoToken)}
                  state={watchState(v)}
                  className="vl-rise group block text-left"
                  style={{ animationDelay: `${Math.min(i, 12) * 50}ms` }}
                >
                  <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-1 group-hover:ring-cyan-400/50 group-hover:shadow-xl group-hover:shadow-cyan-500/10">
                    <VideoThumb token={v.videoToken} title={v.title} />
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-neutral-100 transition-colors group-hover:text-cyan-300">
                    {v.title}
                  </h3>
                  <Meta video={v} className="mt-1.5" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}