import React, { useEffect, useState } from 'react';
import { FaBook, FaBuilding, FaCalendarAlt, FaExternalLinkAlt, FaGithub, FaLink, FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa';
import { apiFetch } from '../../../libs/Mfikriaapi';
import { ensureGuestToken } from '../utilities/guestToken';

const USERNAME = 'dodokjr';

const nf = new Intl.NumberFormat('id-ID');

// "2019-08-14T..." -> "Agustus 2019"
function joinedLabel(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(d);
}

// Tautan blog diisi bebas oleh pemilik akun: hanya http(s) yang boleh jadi link (cegah "javascript:")
function safeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withProtocol);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch (error) {
    return null;
  }
}

function Skeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat profil GitHub"
      className="flex animate-pulse flex-col items-center gap-6 rounded-2xl border border-gray-800/80 bg-gray-900/60 p-6 sm:flex-row sm:items-start"
    >
      <div className="h-24 w-24 flex-none rounded-full bg-gray-800" />
      <div className="w-full flex-1 space-y-3">
        <div className="mx-auto h-5 w-40 rounded bg-gray-800 sm:mx-0" />
        <div className="mx-auto h-4 w-24 rounded bg-gray-800 sm:mx-0" />
        <div className="h-4 w-full max-w-md rounded bg-gray-800" />
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="h-14 rounded-xl bg-gray-800" />
          <div className="h-14 rounded-xl bg-gray-800" />
          <div className="h-14 rounded-xl bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export default function ProfileGithub() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true; // cegah setState setelah unmount

    (async () => {
      setStatus('loading');
      try {
        // Pastikan guest token ada dulu, supaya beberapa request bersamaan tidak membuat token ganda
        await ensureGuestToken().catch(() => null);
        const res = await apiFetch(`/v2/github/${encodeURIComponent(USERNAME)}`);
        const body = await res.json().catch(() => null);
        if (!res.ok || !body || body.message) throw new Error((body && body.message) || `HTTP ${res.status}`);
        if (!active) return;
        setData(body);
        setStatus('ready');
      } catch (error) {
        console.error('Profil GitHub gagal dimuat:', error);
        if (active) setStatus('error');
      }
    })();

    return () => {
      active = false;
    };
  }, [attempt]);

  if (status === 'loading') return <Skeleton />;

  if (status === 'error' || !data) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center">
        <p className="text-sm font-medium text-rose-400">Profil GitHub tidak bisa dimuat.</p>
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="mt-3 inline-flex items-center rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const avatar = data.avatar_url ? `${data.avatar_url}${data.avatar_url.includes('?') ? '&' : '?'}s=192` : null;
  const blog = safeUrl(data.blog);
  const joined = joinedLabel(data.created_at);

  const meta = [
    data.location && { Icon: FaMapMarkerAlt, text: data.location },
    data.company && { Icon: FaBuilding, text: data.company },
    joined && { Icon: FaCalendarAlt, text: `Bergabung ${joined}` },
  ].filter(Boolean);

  const stats = [
    { label: 'Repositori', value: data.public_repos, Icon: FaBook },
    { label: 'Pengikut', value: data.followers, Icon: FaUserFriends },
    { label: 'Mengikuti', value: data.following, Icon: FaUserFriends },
  ];

  return (
    <section
      aria-label={`Profil GitHub ${data.login}`}
      className="flex flex-col items-center gap-6 rounded-2xl border border-gray-800/80 bg-gray-900/60 p-6 sm:flex-row sm:items-start sm:p-8"
    >
      <div className="relative flex-none">
        {avatar ? (
          <img
            src={avatar}
            alt={`Foto profil ${data.login}`}
            width="96"
            height="96"
            className="h-24 w-24 rounded-full border-2 border-pink-500/50 object-cover shadow-xl shadow-pink-500/10"
          />
        ) : (
          <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-pink-500/50 bg-gray-900 text-pink-500">
            <FaGithub className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
        <span className="absolute bottom-0 right-0 rounded-full border border-gray-800 bg-gray-900 p-1.5 text-pink-500">
          <FaGithub size={14} aria-hidden="true" />
        </span>
      </div>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">{data.name || data.login}</h2>
        <a
          href={data.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-pink-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        >
          @{data.login}
        </a>

        {data.bio && <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300 sm:mx-0">{data.bio}</p>}

        {(meta.length > 0 || blog) && (
          <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-gray-400 sm:justify-start">
            {meta.map(({ Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-1.5">
                <Icon className="h-3 w-3 text-gray-500" aria-hidden="true" />
                {text}
              </li>
            ))}
            {blog && (
              <li className="inline-flex min-w-0 items-center gap-1.5">
                <FaLink className="h-3 w-3 flex-none text-gray-500" aria-hidden="true" />
                <a
                  href={blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:text-pink-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                >
                  {blog.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </li>
            )}
          </ul>
        )}

        <dl className="mt-5 grid grid-cols-3 gap-3">
          {stats.map(({ label, value, Icon }) => (
            <div key={label} className="rounded-xl border border-gray-800/80 bg-gray-950/50 px-3 py-3 text-center">
              <dt className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Icon className="h-3 w-3 text-pink-500" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-white">{nf.format(value || 0)}</dd>
            </div>
          ))}
        </dl>

        <a
          href={data.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:border-pink-500 hover:bg-pink-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        >
          <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
          Lihat profil di GitHub
        </a>
      </div>
    </section>
  );
}