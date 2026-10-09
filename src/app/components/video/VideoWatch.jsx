// Simpan di: src/app/components/video/VideoWatch.jsx   -> route: /video/watch?id={videoToken}

import { useEffect, useState } from 'react';
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

export default function VideoWatch() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [session, setSession] = useState(null);
  const [info, setInfo] = useState(null); // { title, size, mimeType }
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
        setInfo(data);
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
                      {[formatDuration(duration), formatSize(info.size)].filter(Boolean).join(' • ')}
                    </p>
                  </>
                ) : (
                  <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-gray-900" />
                )}
              </div>

              {/* Berikutnya */}
              <aside className="w-full shrink-0 lg:w-96">
                <h2 className="mb-3 text-sm font-semibold text-gray-300">Berikutnya</h2>
                <div className="space-y-3">
                  {upNext.map((v) => (
                    <Link
                      key={v.videoToken}
                      to={watchPath(v.videoToken)}
                      state={{ video: { title: v.title, size: v.size, mimeType: v.mimeType } }}
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
                        <p className="mt-1 text-xs text-gray-500">{formatSize(v.size)}</p>
                      </div>
                    </Link>
                  ))}
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