import React, { useState } from 'react';
import { HiCheck, HiClock, HiDeviceMobile, HiGlobeAlt, HiServer, HiCode, HiLink } from 'react-icons/hi';
import { FaGamepad, FaWhatsapp } from 'react-icons/fa';
import Contac from "./components/utilities/contac";
import Layout from './layout';

const WHATSAPP = '6285727738629';
const STATUS = 'Terima proyek baru';

const plan = (name, tagline, price, durasi, features, extra = {}) => ({
  name, tagline, price, durasi, features, note: 'sekali bayar', ...extra,
});
const FROM = { prefix: 'Mulai dari', note: 'tergantung kebutuhan' }; // paket paling atas
const POP = { popular: true };                                       // paket "Paling dipilih"

const categories = [
  {
    id: 'mobile', label: 'Mobile App', Icon: HiDeviceMobile,
    desc: 'Aplikasi Android dan iOS untuk bisnis atau ide Anda.',
    plans: [
      plan('Starter', 'Aplikasi sederhana untuk satu platform.', 8000000, '3–4 minggu', [
        'Satu platform (Android atau iOS)', 'Hingga 5 layar', 'Desain antarmuka sesuai referensi', '1x revisi',
      ]),
      plan('Business', 'Aplikasi lengkap dengan akun pengguna.', 20000000, '6–8 minggu', [
        'Android dan iOS', 'Login dan profil pengguna', 'Integrasi API atau backend', '3x revisi',
      ], POP),
      plan('Premium', 'Aplikasi skala besar siap rilis.', 40000000, '3 bulan atau lebih', [
        'Notifikasi push dan fitur lanjutan', 'Panel admin untuk kelola data',
        'Bantuan publikasi ke Play Store dan App Store', 'Revisi sesuai kesepakatan',
      ], FROM),
    ],
  },
  {
    id: 'web', label: 'Web App', Icon: HiGlobeAlt,
    desc: 'Website dan aplikasi web yang responsif, dari landing page sampai sistem lengkap.',
    plans: [
      plan('Starter', 'Landing page atau portofolio satu halaman.', 1500000, '± 1 minggu', [
        '1 halaman, responsif di semua perangkat', 'Desain mengikuti referensi Anda',
        'Tombol kontak WhatsApp dan media sosial', 'SEO dasar', '1x revisi',
      ]),
      plan('Business', 'Company profile lengkap untuk bisnis Anda.', 4500000, '2–3 minggu', [
        'Hingga 5 halaman', 'Desain khusus sesuai identitas brand', 'Form kontak yang terhubung ke email',
        'SEO dasar dan optimasi kecepatan', '3x revisi',
      ], POP),
      plan('Premium', 'Aplikasi web dengan backend dan database.', 10000000, '1–3 bulan', [
        'Login dan pengaturan hak akses', 'Dashboard dan manajemen data', 'Backend API dan database',
        'Dokumentasi penggunaan', 'Revisi sesuai kesepakatan',
      ], FROM),
    ],
  },
  {
    id: 'games', label: 'Games', Icon: FaGamepad,
    desc: 'Game untuk mobile dan web, dari prototipe sampai rilis.',
    plans: [
      plan('Starter', 'Game sederhana untuk satu platform.', 5000000, '3–4 minggu', [
        'Satu platform', 'Gameplay inti dan hingga 3 level', 'Aset grafis dan audio dasar', '1x revisi',
      ]),
      plan('Business', 'Game lengkap dengan menu dan skor.', 15000000, '6–8 minggu', [
        'Android dan web', 'Menu, pengaturan, dan sistem skor', 'Level dengan tingkat kesulitan bertahap', '3x revisi',
      ], POP),
      plan('Premium', 'Game online dengan fitur multiplayer.', 35000000, '3 bulan atau lebih', [
        'Multiplayer atau leaderboard online', 'Backend dan database pemain',
        'Bantuan publikasi ke store', 'Revisi sesuai kesepakatan',
      ], FROM),
    ],
  },
  {
    id: 'server', label: 'Server', Icon: HiServer,
    desc: 'Penyiapan dan perawatan server agar aplikasi Anda aman dan selalu aktif.',
    plans: [
      plan('Starter', 'Setup server untuk satu aplikasi.', 750000, '1–2 hari', [
        'Konfigurasi VPS dan Nginx', 'Sertifikat SSL (HTTPS)', 'Deploy satu aplikasi', 'Panduan penggunaan',
      ], { note: 'sekali setup' }),
      plan('Business', 'Server siap produksi dengan cadangan.', 2000000, '3–5 hari', [
        'Semua fitur Starter', 'Backup otomatis', 'Firewall dan keamanan dasar', 'Monitoring dasar',
      ], { ...POP, note: 'sekali setup' }),
      plan('Premium', 'Infrastruktur untuk trafik tinggi.', 5000000, '1–2 minggu', [
        'Docker dan CI/CD', 'Load balancing', 'Migrasi dari server lama', 'Dukungan teknis berkala',
      ], FROM),
    ],
  },
  {
    id: 'backend', label: 'Backend', Icon: HiCode,
    desc: 'API dan sistem di balik layar untuk aplikasi web, mobile, atau game Anda.',
    plans: [
      plan('Starter', 'REST API dasar untuk aplikasi kecil.', 3000000, '1–2 minggu', [
        'REST API dengan database', 'Login dan autentikasi', 'Validasi input dan penanganan error', '1x revisi',
      ]),
      plan('Business', 'API lengkap, aman, dan terdokumentasi.', 8000000, '3–4 minggu', [
        'Hak akses berdasarkan peran', 'Rate limit dan keamanan dasar', 'Dokumentasi API', '3x revisi',
      ], POP),
      plan('Premium', 'Backend dengan integrasi dan performa tinggi.', 18000000, '6 minggu atau lebih', [
        'Integrasi pihak ketiga (pembayaran, email, dll.)', 'Antrean dan proses latar belakang',
        'Optimasi performa dan caching', 'Revisi sesuai kesepakatan',
      ], FROM),
    ],
  },
  {
    id: 'domain', label: 'Custom Domain', Icon: HiLink,
    desc: 'Pakai alamat sendiri (namaanda.com) dan email bisnis agar tampil lebih profesional. Biaya registrasi domain dibayar terpisah ke penyedia domain.',
    plans: [
      plan('Starter', 'Pasang domain yang sudah Anda punya.', 250000, '1 hari', [
        'Konfigurasi DNS', 'Sertifikat SSL (HTTPS)', 'Redirect www dan non-www', 'Panduan perawatan domain',
      ], { note: 'sekali setup, biaya domain terpisah' }),
      plan('Business', 'Domain baru lengkap dengan email bisnis.', 750000, '1–2 hari', [
        'Bantuan memilih dan membeli domain', 'Email bisnis (nama@domainanda.com)',
        'Konfigurasi DNS dan SSL', 'Subdomain untuk aplikasi',
      ], { ...POP, note: 'sekali setup, biaya domain terpisah' }),
      plan('Premium', 'Beberapa domain dengan keamanan lengkap.', 2000000, '3–5 hari', [
        'Banyak domain dan subdomain', 'Email bisnis untuk tim', 'CDN dan proteksi DNS',
        'Migrasi dari penyedia domain lain', 'Pemantauan masa aktif domain dan SSL',
      ], { ...FROM, note: 'biaya domain terpisah' }),
    ],
  },
];

const idr = (n) => new Intl.NumberFormat('id-ID').format(n);
const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

const btnBase =
  'flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-bold text-white transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60 sm:w-auto';
const btnPrimary = `${btnBase} bg-pink-600 shadow-lg shadow-pink-600/20 hover:bg-pink-500`;
const btnGhost = `${btnBase} border border-gray-700 bg-gray-800 hover:bg-gray-700`;

export default function Pricing() {
  const [catId, setCatId] = useState(categories[0].id);
  const cat = categories.find((c) => c.id === catId);

  const pick = setCatId;

  return (
    <Layout>
      <section aria-labelledby="pricing-title" className="bg-gray-950 py-16">
        <div className="container mx-auto max-w-6xl px-4">

          {/* Banner: tengah, satu pesan, latar titik-titik dan satu cahaya pink */}
          <div className="relative mb-16 overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 px-6 py-16 text-center sm:px-12 sm:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
                WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
                maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-pink-600/25 blur-3xl"
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-950/70 px-3 py-1.5 text-xs text-gray-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {STATUS}
              </span>

              <h1 id="pricing-title" className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
                Dari ide sampai rilis, saya yang kerjakan.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                Harga jelas di awal, tanpa biaya tersembunyi. Pilih paket, lalu bicarakan detailnya langsung lewat WhatsApp.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={waLink('Halo, saya ingin konsultasi proyek.')} target="_blank" rel="noreferrer" className={btnPrimary}>
                  <FaWhatsapp aria-hidden="true" className="h-4 w-4" />
                  <span>Konsultasi gratis</span>
                </a>
                <a href="#paket" className={btnGhost}>Lihat paket</a>
              </div>

              <ul aria-label="Layanan" className="mt-12 flex flex-wrap justify-center gap-2">
                {categories.map(({ id, label, Icon }) => (
                  <li
                    key={id}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-950/60 px-3.5 py-2 text-xs text-gray-300 backdrop-blur"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 text-pink-400" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pilih kategori */}
          <div id="paket" className="scroll-mt-24">
            <div
              role="group"
              aria-label="Kategori layanan"
              className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 py-2 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => pick(id)}
                  aria-pressed={id === catId}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60 ${
                    id === catId
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                      : 'border border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <div aria-live="polite">
              <h2 className="sr-only">Paket {cat.label}</h2>
              <p className="mx-auto mb-12 max-w-md text-center text-xs leading-relaxed text-gray-400 sm:text-sm">{cat.desc}</p>

              {/* Kartu paket: paket populer dibuat lebih tinggi dan lebih terang */}
              <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
                {cat.plans.map((p) => (
                  <article
                    key={`${cat.id}-${p.name}`}
                    className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 ${
                      p.popular
                        ? 'border-pink-500/60 bg-gray-900 shadow-xl shadow-pink-600/10 md:-my-3 md:py-11'
                        : 'border-gray-800 bg-gray-900/60'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-3 left-6 rounded-full bg-pink-600 px-3 py-1 text-[11px] font-semibold text-white">
                        Paling dipilih
                      </span>
                    )}

                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">{p.tagline}</p>

                    <div className="mt-6">
                      {p.prefix && <p className="text-[11px] font-medium text-gray-400">{p.prefix}</p>}
                      <p className="flex items-baseline gap-1.5">
                        <span className="text-sm font-semibold text-gray-400">Rp</span>
                        <span className={`font-black tracking-tight text-white ${p.popular ? 'text-4xl' : 'text-3xl'}`}>
                          {idr(p.price)}
                        </span>
                      </p>
                      <p className="mt-1 text-[11px] text-gray-500">{p.note}</p>
                    </div>

                    <p className="mt-4 flex items-center gap-2 rounded-xl bg-gray-950 px-3 py-2 text-[11px] text-gray-400">
                      <HiClock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-pink-400" />
                      <span>
                        Estimasi pengerjaan <b className="font-semibold text-gray-200">{p.durasi}</b>
                      </span>
                    </p>

                    <ul className="mt-6 flex-1 space-y-3 border-t border-gray-800 pt-6">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-xs leading-relaxed text-gray-300">
                          <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pink-500/15">
                            <HiCheck aria-hidden="true" className="h-3 w-3 text-pink-400" />
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={waLink(`Halo, saya tertarik dengan paket ${p.name} untuk ${cat.label}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-8 ${p.popular ? btnPrimary : btnGhost} sm:w-full`}
                    >
                      <FaWhatsapp aria-hidden="true" className="h-4 w-4" />
                      <span>Pilih paket {p.name}</span>
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Kebutuhan khusus */}
          <div className="mt-20 flex flex-col items-start justify-between gap-5 rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-base font-bold text-white">Kebutuhan Anda berbeda?</h2>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-gray-400">
                Ceritakan proyeknya, saya buatkan penawaran yang sesuai. Harga di atas adalah estimasi dan bisa berubah menurut kebutuhan.
              </p>
            </div>
            <a href={waLink('Halo, saya ingin minta penawaran untuk proyek khusus.')} target="_blank" rel="noreferrer" className={`${btnGhost} sm:shrink-0`}>
              <FaWhatsapp aria-hidden="true" className="h-4 w-4" />
              <span>Minta penawaran</span>
            </a>
          </div>
        </div>
        <Contac />
      </section>
    </Layout>
  );
}