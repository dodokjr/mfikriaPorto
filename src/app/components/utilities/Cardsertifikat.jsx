// Simpan di: src/app/components/sertifikat/cardSertifikat.jsx
//
// SEMUA data sertifikat ada di file ini, di konstanta SERTIFIKAT (bagian DATA SERTIFIKAT di bawah).
// Komponen tidak menerima data dari luar: untuk menambah / mengubah sertifikat, edit SERTIFIKAT saja.
//
// Pemakaian:
//   import CardSertifikat from './components/sertifikat/cardSertifikat';
//   <CardSertifikat />                 // semua sertifikat, berjajar ke kanan
//   <CardSertifikat limit={3} />       // 3 teratas (untuk beranda)
//   <CardSertifikat layout="grid" />   // tampilan grid (untuk halaman /sertifikat)
//
// Urutan array = urutan tampil (taruh yang terbaru di atas). Hanya title dan issuer yang wajib.
//   image : file di public/ (mis. '/sertifikat/react.jpg') atau URL lengkap, rasio mendekati 4:3
//   url   : halaman verifikasi sertifikat (opsional)

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaAward, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

/* ========================= DATA SERTIFIKAT ========================= */
// CONTOH: ganti isi di bawah dengan sertifikat milikmu.

export const SERTIFIKAT = [
  {
    id: 'react-dasar',
    title: 'Belajar Membuat Aplikasi Web dengan React',
    issuer: 'Dicoding Indonesia',
    issuedAt: '2026-08-14',
    expiresAt: null, // null = tidak kedaluwarsa
    credentialId: 'EYX123ABC',
    url: 'https://www.dicoding.com/certificates/EYX123ABC',
    image: '/sertifikat/react-dasar.jpg',
    skills: ['React', 'JavaScript'],
  },
  {
    id: 'nodejs-backend',
    title: 'Belajar Back-End Pemula dengan JavaScript',
    issuer: 'Dicoding Indonesia',
    issuedAt: '2026-05-02',
    expiresAt: null,
    credentialId: 'QLZ456DEF',
    url: 'https://www.dicoding.com/certificates/QLZ456DEF',
    image: '/sertifikat/nodejs-backend.jpg',
    skills: ['Node.js', 'REST API'],
  },
  {
    id: 'ui-ux',
    title: 'Dasar-Dasar UI/UX Design',
    issuer: 'Google Career Certificates',
    issuedAt: '2025-11-20',
    expiresAt: null,
    credentialId: 'GCC789XYZ',
    url: '', // kosong = tombol verifikasi tidak tampil
    image: '', // kosong = tampil kertas polos berisi nama penerbit
    skills: ['Figma', 'Riset pengguna'],
  },
];

// "2026-08-14" -> "14 Agustus 2026" (short: "Agu 2026"); teks bebas ("Agu 2026") ditampilkan apa adanya
function formatDate(value, short = false) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(String(value))) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      const opts = short
        ? { month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }
        : { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' };
      return new Intl.DateTimeFormat('id-ID', opts).format(d);
    }
  }
  return String(value);
}

// Pengganti gambar saat sertifikat tidak punya gambar / gagal dimuat: kertas polos dengan nama penerbit
function PlaceholderPaper({ issuer }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-pink-500/30 bg-gray-950/70 text-center">
        <FaAward className="mb-1.5 h-6 w-6 text-pink-500" aria-hidden="true" />
        <span className="line-clamp-2 px-2 text-xs font-semibold text-gray-300">{issuer}</span>
      </div>
    </div>
  );
}

// Jendela detail: gambar ukuran besar + info lengkap yang tidak muat di kartu kecil
function Preview({ item, showImage, onClose }) {
  const closeRef = useRef(null);
  const issued = formatDate(item.issuedAt);
  const expires = item.expiresAt ? formatDate(item.expiresAt) : null;
  const skills = Array.isArray(item.skills) ? item.skills : [];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Portal ke <body>: supaya tampil di atas semua layer Layout (TopBar z-70, konten z-10)
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Sertifikat ${item.title}`}
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-gray-950/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-800 bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 bg-gray-950/80 text-gray-300 transition hover:border-pink-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        >
          <FaTimes className="h-4 w-4" aria-hidden="true" />
        </button>

        {showImage ? (
          <img
            src={item.image}
            alt={`Sertifikat ${item.title} dari ${item.issuer}`}
            className="max-h-[60vh] w-full bg-gray-950 object-contain"
          />
        ) : (
          <div className="aspect-[4/3] max-h-[40vh] w-full bg-gray-950">
            <PlaceholderPaper issuer={item.issuer} />
          </div>
        )}

        <div className="space-y-3 p-5">
          <div>
            <h3 className="text-lg font-bold leading-snug text-white">{item.title}</h3>
            <p className="mt-1 text-sm text-pink-400">{item.issuer}</p>
          </div>

          <dl className="space-y-1.5 text-sm text-gray-400">
            {issued && (
              <div className="flex gap-2">
                <dt className="flex-none text-gray-500">Diterbitkan</dt>
                <dd>
                  {issued}
                  {item.expiresAt !== undefined && (expires ? `, berlaku sampai ${expires}` : ', tidak kedaluwarsa')}
                </dd>
              </div>
            )}
            {item.credentialId && (
              <div className="flex gap-2">
                <dt className="flex-none text-gray-500">ID kredensial</dt>
                <dd className="min-w-0 break-all font-medium tabular-nums text-gray-300">{item.credentialId}</dd>
              </div>
            )}
          </dl>

          {skills.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Keahlian">
              {skills.map((sk) => (
                <li key={sk} className="rounded-full border border-gray-800 bg-gray-950/60 px-2.5 py-1 text-xs text-gray-300">
                  {sk}
                </li>
              ))}
            </ul>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-950 px-4 py-2 text-xs font-semibold text-white transition hover:border-pink-500 hover:bg-pink-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
              Verifikasi sertifikat
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Satu kartu kecil: gambar, judul, penerbit, bulan terbit. Detail lengkap ada di jendela yang terbuka saat diklik.
// fluid: lebar mengikuti kolom (untuk grid); tanpa fluid lebarnya tetap supaya bisa berjajar ke kanan.
function CardSertifikat({ item, fluid = false }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const hasImage = Boolean(item.image) && !imgFailed;
  const issued = formatDate(item.issuedAt, true);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus(); // fokus kembali ke kartu yang diklik
  };

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-xl border border-gray-800/80 bg-gray-900/60 transition-colors duration-200 hover:border-pink-500/60 ${
        fluid ? 'w-full' : 'w-48 flex-none snap-start sm:w-52'
      }`}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Lihat detail sertifikat ${item.title}`}
        className="relative block aspect-[4/3] w-full overflow-hidden border-b border-gray-800/80 bg-gray-900 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-500"
      >
        {hasImage ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <PlaceholderPaper issuer={item.issuer} />
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">{item.title}</h3>
          <p className="mt-0.5 truncate text-xs text-pink-400">{item.issuer}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          {issued ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <FaCalendarAlt className="h-3 w-3" aria-hidden="true" />
              {issued}
            </span>
          ) : (
            <span />
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Verifikasi sertifikat ${item.title}`}
              title="Verifikasi sertifikat"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-800 bg-gray-900 text-gray-300 transition hover:border-pink-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {open && <Preview item={item} showImage={hasImage} onClose={close} />}
    </article>
  );
}

// Baris kartu yang bisa digeser ke kanan (swipe di HP, tombol panah di layar lebar)
function Row({ children }) {
  const ref = useRef(null);

  const scrollBy = (dir) => {
    const el = ref.current;
    if (!el) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: smooth ? 'smooth' : 'auto' });
  };

  return (
    <div>
      <div className="mb-2 hidden justify-end gap-2 md:flex">
        {[
          { dir: -1, label: 'Geser ke kiri', Icon: FaChevronLeft },
          { dir: 1, label: 'Geser ke kanan', Icon: FaChevronRight },
        ].map(({ dir, label, Icon }) => (
          <button
            key={dir}
            type="button"
            onClick={() => scrollBy(dir)}
            aria-label={label}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-800 bg-gray-900 text-gray-300 transition hover:border-pink-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div
        ref={ref}
        role="region"
        aria-label="Daftar sertifikat, geser ke kanan untuk melihat lainnya"
        tabIndex={0}
        className="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overscroll-x-contain rounded-xl pb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
      >
        {children}
      </div>
    </div>
  );
}

// Daftar sertifikat, datanya selalu dari SERTIFIKAT di atas.
//   layout 'row' (default): berjajar ke kanan, bisa digeser
//   layout 'grid'         : kotak-kotak ke bawah
// limit: tampilkan hanya N pertama. Daftar kosong -> pesan kosong.
export function ListSertifikat({ limit, layout = 'row' }) {
  const all = SERTIFIKAT.filter(Boolean);
  const list = Number.isInteger(limit) && limit > 0 ? all.slice(0, limit) : all;

  if (list.length === 0) {
    return <p className="py-16 text-center text-sm text-gray-400">Belum ada sertifikat.</p>;
  }

  const keyOf = (item, i) => item.id || `${item.issuer}-${item.title}-${i}`;

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((item, i) => (
          <CardSertifikat key={keyOf(item, i)} item={item} fluid />
        ))}
      </div>
    );
  }

  return (
    <Row>
      {list.map((item, i) => (
        <CardSertifikat key={keyOf(item, i)} item={item} />
      ))}
    </Row>
  );
}

export default ListSertifikat;