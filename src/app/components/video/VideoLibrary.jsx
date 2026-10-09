// Simpan di: src/app/components/video/VideoLibrary.jsx   -> route: /video

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiRefresh } from 'react-icons/hi';
import { fetchVideoLibrary } from '../utilities/guestToken';
import { Thumb, VideoToolbar, formatSize, watchPath } from './videoUi';
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

export default function VideoLibrary() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [durations, setDurations] = useState({});

  const load = useCallback(() => {
    setStatus('loading');
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

  const setDuration = (token, d) =>
    setDurations((prev) => (prev[token] === d ? prev : { ...prev, [token]: d }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? videos.filter((v) => v.title.toLowerCase().includes(q)) : videos;
  }, [videos, search]);

  return (
    <Layout>
      <section className="min-h-screen bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <VideoToolbar value={search} onChange={setSearch} />
          {status === 'loading' && (
            <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video rounded-xl bg-gray-900" />
                  <div className="mt-3 h-4 w-5/6 rounded bg-gray-900" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-gray-900" />
                </div>
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="mx-auto mt-20 max-w-sm text-center">
              <p className="text-lg font-semibold">Video tidak bisa dimuat</p>
              <p className="mt-1 text-sm text-gray-400">Periksa koneksi lalu coba lagi.</p>
              <button
                onClick={load}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-gray-950 transition hover:bg-cyan-400"
              >
                <HiRefresh className="h-4 w-4" /> Coba lagi
              </button>
            </div>
          )}

          {status === 'ready' &&
            (filtered.length === 0 ? (
              <p className="mt-20 text-center text-gray-400">
                {videos.length === 0 ? 'Belum ada video.' : `Tidak ada video untuk "${search}".`}
              </p>
            ) : (
              <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((v) => {
                  const uploadDate = formatUploadDate(v);
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
                        },
                      }}
                      className="group block text-left"
                    >
                      <Thumb
                        url={v.videoUrl}
                        duration={durations[v.videoToken]}
                        onDuration={(d) => setDuration(v.videoToken, d)}
                      />
                      <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-cyan-400">
                        {v.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatSize(v.size)}
                        {typeof v.views === 'number' && ` • ${v.views.toLocaleString('id-ID')}x ditonton`}
                        {uploadDate && ` • ${uploadDate}`}
                      </p>
                    </Link>
                  );
                })}
              </div>
            ))}
        </div>
      </section>
    </Layout>
  );
}