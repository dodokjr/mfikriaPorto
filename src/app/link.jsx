import React, { useEffect, useState } from 'react';
import pp from "../assets/ppa.jpg";
import qrisImg from "../assets/qris.jpeg";
import {
  FaGlobe, FaHeart, FaShoppingBag, FaImages, FaSearchPlus, FaTimes,
  FaSun, FaMoon, FaLinkedin, FaInstagram, FaTwitter, FaSpotify, FaYoutube,
  FaCoffee, FaArrowRight, FaCopy, FaCheck, FaPlay, FaFilm,
} from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';

// ====== KONFIGURASI VIDEO ======
// Ganti dengan ID video YouTube kamu (bagian setelah "v=" pada URL) dan URL video MP4 kamu.
// Jika API mengirim `youtube_id` / `video_url` / `video_poster`, nilai dari API yang dipakai.
const YOUTUBE_VIDEO_ID = 'f46pMb8WZFo'; // Rossa - Sakura (Official Music Video)
const LOCAL_VIDEO_URL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const LOCAL_VIDEO_POSTER = '';

// Pilih ikon berdasarkan judul tautan
const getLinkIcon = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('linkedin')) return FaLinkedin;
  if (t.includes('instagram')) return FaInstagram;
  if (t.includes('twitter') || t.includes(' x')) return FaTwitter;
  if (t.includes('spotify')) return FaSpotify;
  if (t.includes('youtube')) return FaYoutube;
  if (t.includes('sociabuzz') || t.includes('cofy') || t.includes('trakteer')) return FaCoffee;
  return FaGlobe;
};

export default function Link() {
  const [data, setData] = useState(null);
  const [storeData, setStoreData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoreLoading, setIsStoreLoading] = useState(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // State untuk alert error di pojok kanan atas
  const [activeModal, setActiveModal] = useState(null); // 'shop' | 'gallery' | 'donation' | null
  const [copied, setCopied] = useState(false);
  const [videoTab, setVideoTab] = useState('youtube'); // 'youtube' | 'video'
  const [ytPlaying, setYtPlaying] = useState(false);

  // Tema: 'dark' | 'light' (disimpan di localStorage, default mengikuti sistem)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('link-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) { /* abaikan */ }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });
  const isDark = theme === 'dark';
  // Helper: pilih class sesuai tema (tidak bergantung konfigurasi dark mode Tailwind)
  const c = (darkClass, lightClass) => (isDark ? darkClass : lightClass);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('link-theme', theme);
    } catch (e) { /* abaikan */ }
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Fungsi untuk menampilkan alert error otomatis hilang dalam 4 detik
  const triggerErrorAlert = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const api = await fetch("https://api-mfikria.vercel.app/v1/link");
      const result = await api.json();
      setData(result.data || {});
    } catch (error) {
      triggerErrorAlert("Gagal memuat data tautan utama.");
      setData({});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStoreData = async () => {
    setIsStoreLoading(true);
    try {
      const api = await fetch("https://api-mfikria.vercel.app/mfikria/store/assets");
      const result = await api.json();
      setStoreData(result.data || result || []);
    } catch (error) {
      triggerErrorAlert("Gagal memuat data produk jualan.");
      setStoreData([]);
    } finally {
      setIsStoreLoading(false);
    }
  };

  const fetchGalleryData = async () => {
    setIsGalleryLoading(true);
    try {
      const api = await fetch("https://api-mfikria.vercel.app/mfikria/c/ig");
      const result = await api.json();
      setGalleryData(result.data || result.data || []);
    } catch (error) {
      triggerErrorAlert("Gagal memuat data gallery.");
      setGalleryData([]);
    } finally {
      setIsGalleryLoading(false);
    }
  };

  // Helper untuk format angka ke Rupiah (contoh: 500000 -> Rp500.000)
  const formatRupiah = (value) => {
    if (!value) return "";
    if (typeof value === 'string' && (value.toLowerCase().includes('rp') || isNaN(Number(value)))) {
      return value;
    }
    const number = Number(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number).replace(/\s/g, '');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleOpenShopModal = () => {
    fetchStoreData();
    setActiveModal('shop');
  };

  const handleOpenGalleryModal = () => {
    fetchGalleryData();
    setActiveModal('gallery');
  };

  const handleOpenDonationModal = () => {
    setActiveModal('donation');
  };

  const handleOpenZoom = () => {
    setActiveModal(null);
    setIsZoomed(true);
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  const handleOpenImageZoom = (imgUrl) => {
    setActiveModal(null);
    setSelectedImage(imgUrl);
  };

  const handleCloseImageZoom = () => {
    setSelectedImage(null);
  };

  const handleCopyRekening = async () => {
    try {
      await navigator.clipboard.writeText('1234567890');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      triggerErrorAlert("Gagal menyalin nomor rekening.");
    }
  };

  const handleSwitchVideoTab = (tab) => {
    setVideoTab(tab);
    setYtPlaying(false); // pemutar lama dilepas sehingga video berhenti
  };

  // Tutup modal dengan tombol Escape & kunci scroll body saat modal terbuka
  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeModal]);

  // Data video (API diprioritaskan, jika kosong pakai konfigurasi di atas)
  const youtubeId = data?.youtube_id || YOUTUBE_VIDEO_ID;
  const videoUrl = data?.video_url || LOCAL_VIDEO_URL;
  const videoPoster = data?.video_poster || LOCAL_VIDEO_POSTER;

  // Kelas bersama (berbasis tema)
  const pageBg = c('bg-gray-950 text-white', 'bg-slate-100 text-slate-900');
  const cardCls = c(
    'bg-gray-900/60 border-white/10 shadow-black/50',
    'bg-white/70 border-white shadow-slate-300/60'
  );
  const mutedText = c('text-gray-400', 'text-slate-500');
  const strongText = c('text-white', 'text-slate-900');
  const divider = c('bg-gradient-to-r from-transparent via-white/15 to-transparent', 'bg-gradient-to-r from-transparent via-slate-300 to-transparent');
  const softSurface = c('bg-white/5 border-white/10', 'bg-slate-50 border-slate-200');
  const modalBox = c(
    'bg-gray-900 border-white/10 text-white',
    'bg-white border-slate-200 text-slate-900'
  );
  const closeBtn = c(
    'bg-white/5 hover:bg-white/10 border-white/10 text-white',
    'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
  );
  const sectionLabel = 'text-[10px] font-semibold tracking-[0.2em] uppercase';

  // Animasi kustom (tanpa perlu konfigurasi Tailwind)
  const animationStyles = (
    <style>{`
      @keyframes lfFadeIn { from { opacity: 0 } to { opacity: 1 } }
      @keyframes lfFadeUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
      @keyframes lfSheetUp { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
      @keyframes lfFloat { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(24px,-30px) scale(1.08) } }
      @keyframes lfFloatAlt { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(-28px,26px) scale(1.1) } }
      @keyframes lfSpin { to { transform: rotate(360deg) } }
      @keyframes lfPing { 0% { transform: scale(1); opacity: .6 } 80%,100% { transform: scale(1.7); opacity: 0 } }
      .lf-fade-in { animation: lfFadeIn .25s ease-out both }
      .lf-fade-up { animation: lfFadeUp .6s cubic-bezier(.22,1,.36,1) both }
      .lf-sheet-up { animation: lfSheetUp .35s cubic-bezier(.22,1,.36,1) both }
      .lf-float { animation: lfFloat 14s ease-in-out infinite }
      .lf-float-alt { animation: lfFloatAlt 17s ease-in-out infinite }
      .lf-spin-slow { animation: lfSpin 6s linear infinite }
      .lf-ping { animation: lfPing 1.8s cubic-bezier(0,0,.2,1) infinite }
      @media (prefers-reduced-motion: reduce) {
        .lf-fade-up, .lf-sheet-up, .lf-float, .lf-float-alt, .lf-spin-slow, .lf-ping { animation: none }
      }
    `}</style>
  );

  // Latar belakang dekoratif (blob gradient + grid halus)
  const background = (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.05)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.05)'} 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <div className={`lf-float absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl ${c('bg-pink-600/25', 'bg-pink-400/40')}`} />
      <div className={`lf-float-alt absolute top-1/3 -right-28 w-96 h-96 rounded-full blur-3xl ${c('bg-indigo-600/25', 'bg-indigo-400/40')}`} />
      <div className={`lf-float absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-3xl ${c('bg-fuchsia-600/15', 'bg-sky-300/50')}`} />
    </div>
  );

  if (isLoading) {
    return (
      <section className={`${pageBg} relative overflow-hidden min-h-screen py-12 px-4 flex flex-col items-center justify-center transition-colors duration-500`}>
        {animationStyles}
        {background}
        <div className={`relative w-full max-w-md ${cardCls} backdrop-blur-2xl border rounded-[2rem] p-8 shadow-2xl flex flex-col items-center justify-center text-center`}>
          <IoReload className="w-8 h-8 text-pink-500 animate-spin mb-4" />
          <h2 className={`text-sm font-bold mb-1 ${strongText}`}>Memuat Tautan...</h2>
          <p className={`text-xs ${mutedText}`}>Mohon tunggu sebentar.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`${pageBg} relative overflow-hidden min-h-screen py-12 px-4 flex flex-col items-center justify-center transition-colors duration-500`}>
      {animationStyles}
      {background}

      {/* Alert Error Pojok Kanan Atas */}
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <span className="text-xs font-bold">{errorMessage}</span>
        </div>
      )}

      <div className={`relative w-full max-w-md ${cardCls} backdrop-blur-2xl border rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden text-center transition-colors duration-500`}>

        {/* Kilau gradient di tepi atas kartu */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/70 to-transparent" />

        {/* Toggle Dark / Light Mode */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
          title={isDark ? 'Mode terang' : 'Mode gelap'}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${c(
            'bg-white/5 border-white/10 text-yellow-300 hover:bg-white/10',
            'bg-slate-900/5 border-slate-200 text-indigo-600 hover:bg-slate-900/10'
          )}`}
        >
          {isDark ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
        </button>

        {/* Profile Image & Name */}
        <div className="lf-fade-up flex flex-col items-center justify-center mb-6">
          <div className="relative w-28 h-28 mb-5">
            {/* Cincin gradient berputar */}
            <div
              className="lf-spin-slow absolute -inset-1 rounded-full opacity-90"
              style={{ background: 'conic-gradient(from 0deg, #ec4899, #8b5cf6, #6366f1, #22d3ee, #ec4899)' }}
            />
            <div className="absolute -inset-1 rounded-full blur-lg opacity-50 bg-gradient-to-tr from-pink-500 to-indigo-500" />
            <img
              src={pp}
              alt={data?.name || "Profile"}
              className={`relative w-full h-full object-cover rounded-full border-4 ${c('border-gray-900 bg-gray-950', 'border-white bg-slate-100')}`}
            />
            {/* Indikator online */}
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="lf-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className={`relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 ${c('border-gray-900', 'border-white')}`} />
            </span>
          </div>
          <h1 className={`text-xl font-extrabold tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r ${c('from-white via-pink-100 to-indigo-200', 'from-slate-900 via-pink-600 to-indigo-600')}`}>
            {data?.name || "Muhammad Fikri Ardiyansah"}
          </h1>
        </div>

        {/* Short Summary / Quote */}
        <div className="lf-fade-up mb-6" style={{ animationDelay: '80ms' }}>
          <span className="text-[10px] font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20 block w-max mx-auto mb-3">
            Tentang Saya
          </span>
          <p className={`text-xs sm:text-sm leading-relaxed italic ${mutedText}`}>
            "{data?.quetes || "Selalu belajar dan berkembang dalam dunia teknologi."}"
          </p>
        </div>

        <div className={`w-full h-px my-6 ${divider}`} />

        {/* Social Media Links */}
        <div className="flex flex-col space-y-3 mb-6">
          <span className={`${sectionLabel} mb-1 ${mutedText}`}>
            Media Sosial & Tautan
          </span>

          {data?.link_one && data.link_one.length > 0 ? (
            data.link_one.map((r, i) => {
              const Icon = getLinkIcon(r.title);
              return (
                <a
                  key={i}
                  href={r.href}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  title={r.title}
                  style={{ animationDelay: `${140 + i * 60}ms` }}
                  className={`lf-fade-up group relative overflow-hidden w-full py-3 px-3 rounded-2xl border text-xs font-bold transition-all duration-300 shadow-sm flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/20 hover:border-pink-500/60 active:scale-95 ${c(
                    'bg-white/5 border-white/10 text-white hover:bg-white/10',
                    'bg-white border-slate-200 text-slate-800 hover:bg-pink-50'
                  )}`}
                >
                  {/* Kilau saat hover */}
                  <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-0 group-hover:translate-x-[300%] transition-transform duration-700" />
                  <span className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${c(
                    'bg-pink-500/10 text-pink-400 group-hover:bg-pink-500 group-hover:text-white',
                    'bg-pink-100 text-pink-600 group-hover:bg-pink-500 group-hover:text-white'
                  )}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="relative flex-1 text-center">{r.title}</span>
                  <FaArrowRight className={`relative w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${c('text-pink-400', 'text-pink-500')}`} />
                </a>
              );
            })
          ) : (
            <p className={`text-xs ${mutedText}`}>Tidak ada tautan tersedia.</p>
          )}
        </div>

        <div className={`w-full h-px my-6 ${divider}`} />

        {/* Video: YouTube & Video Lokal */}
        <div className="lf-fade-up mb-6" style={{ animationDelay: '200ms' }}>
          <span className={`${sectionLabel} block mb-3 ${mutedText}`}>
            Tonton Video
          </span>

          {/* Tab switcher */}
          <div className={`relative grid grid-cols-2 p-1 rounded-2xl border mb-3 ${softSurface}`}>
            <span
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-xl shadow-md bg-gradient-to-r from-pink-600 to-indigo-600 transition-transform duration-300 ease-out ${videoTab === 'video' ? 'translate-x-full' : 'translate-x-0'}`}
            />
            <button
              onClick={() => handleSwitchVideoTab('youtube')}
              className={`relative z-10 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${videoTab === 'youtube' ? 'text-white' : mutedText}`}
            >
              <FaYoutube className="w-4 h-4" />
              <span>YouTube</span>
            </button>
            <button
              onClick={() => handleSwitchVideoTab('video')}
              className={`relative z-10 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${videoTab === 'video' ? 'text-white' : mutedText}`}
            >
              <FaFilm className="w-4 h-4" />
              <span>Video</span>
            </button>
          </div>

          {/* Pemutar */}
          <div className={`relative aspect-video w-full rounded-2xl overflow-hidden border shadow-xl bg-black ${c('border-white/10 shadow-black/40', 'border-slate-200 shadow-slate-300/60')}`}>
            {videoTab === 'youtube' ? (
              ytPlaying ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setYtPlaying(true)}
                  aria-label="Putar video YouTube"
                  className="group absolute inset-0 w-full h-full"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt="Thumbnail YouTube"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="relative flex items-center justify-center w-16 h-16">
                      <span className="lf-ping absolute inline-flex h-full w-full rounded-full bg-pink-500/60" />
                      <span className="relative w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-pink-600/40 transition-transform group-hover:scale-110 group-active:scale-95">
                        <FaPlay className="w-5 h-5 ml-1" />
                      </span>
                    </span>
                  </span>
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <FaYoutube className="w-3.5 h-3.5 text-red-500" />
                    Putar di sini
                  </span>
                </button>
              )
            ) : (
              <video
                key={videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                src={videoUrl}
                poster={videoPoster || undefined}
                controls
                playsInline
                preload="metadata"
              >
                Browser kamu tidak mendukung pemutar video.
              </video>
            )}
          </div>
        </div>

        <div className={`w-full h-px my-6 ${divider}`} />

        {/* Fitur Spill Jualan & Gallery */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleOpenShopModal}
            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${c(
              'bg-white/5 border-white/10 text-white hover:bg-white/10',
              'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
            )}`}
          >
            <FaShoppingBag className="w-4 h-4 text-pink-500" />
            <span>Spill Jualan</span>
          </button>

          <button
            onClick={handleOpenGalleryModal}
            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${c(
              'bg-white/5 border-white/10 text-white hover:bg-white/10',
              'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
            )}`}
          >
            <FaImages className="w-4 h-4 text-indigo-500" />
            <span>Gallery</span>
          </button>
        </div>

        {/* Tombol Donasi */}
        <button
          onClick={handleOpenDonationModal}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-indigo-600 hover:from-pink-500 hover:via-fuchsia-500 hover:to-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
        >
          <FaHeart className="w-4 h-4 text-white animate-pulse" />
          <span>Donasi / Traktir Kopi</span>
        </button>

      </div>

      {/* Modal Spill Jualan */}
      {activeModal === 'shop' && (
        <div
          onClick={handleCloseModal}
          className="lf-fade-in fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`lf-sheet-up w-full sm:max-w-md ${modalBox} border rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                <FaShoppingBag className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-base">Spill Jualan & Produk</h3>
            </div>
            <p className={`text-xs mb-4 ${mutedText}`}>
              Beberapa produk, jasa, atau barang rekomendasi yang saya tawarkan:
            </p>

            {isStoreLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <IoReload className="w-6 h-6 text-pink-500 animate-spin mb-2" />
                <p className={`text-xs ${mutedText}`}>Memuat produk...</p>
              </div>
            ) : storeData.length > 0 ? (
              <div className="space-y-3 mb-6">
                {storeData.map((item, index) => (
                  <div
                    key={index}
                    className={`${softSurface} border rounded-2xl p-3 flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:border-pink-500/40`}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title || item.name}
                        className={`w-14 h-14 object-cover rounded-xl border flex-shrink-0 ${c('bg-gray-900 border-white/10', 'bg-white border-slate-200')}`}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate">{item.title || item.name}</h4>
                      <p className={`text-[10px] line-clamp-2 mt-0.5 ${mutedText}`}>{item.description || item.desc}</p>
                    </div>
                    {item.price && (
                      <span className="text-xs font-extrabold text-pink-500 whitespace-nowrap px-2">
                        {formatRupiah(item.price)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs text-center py-6 ${mutedText}`}>Tidak ada produk tersedia.</p>
            )}

            <button
              onClick={handleCloseModal}
              className={`w-full py-3 px-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${closeBtn}`}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal Gallery */}
      {activeModal === 'gallery' && (
        <div
          onClick={handleCloseModal}
          className="lf-fade-in fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`lf-sheet-up w-full sm:max-w-md ${modalBox} border rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <FaImages className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-base">Gallery Momen</h3>
            </div>
            <p className={`text-xs mb-4 ${mutedText}`}>
              Beberapa potret dokumentasi kegiatan dan hobi:
            </p>

            {isGalleryLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <IoReload className="w-6 h-6 text-indigo-500 animate-spin mb-2" />
                <p className={`text-xs ${mutedText}`}>Memuat gallery...</p>
              </div>
            ) : galleryData.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {galleryData.map((item, index) => {
                  const imgUrl = item.url_Image || item.url || item;
                  return (
                    <div
                      key={index}
                      onClick={() => handleOpenImageZoom(imgUrl)}
                      className={`h-32 rounded-2xl border overflow-hidden relative group cursor-pointer flex items-center justify-center ${c('bg-gray-950 border-white/10', 'bg-slate-100 border-slate-200')}`}
                      title="Klik untuk memperbesar"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2 text-white gap-1 text-xs font-semibold">
                        <FaSearchPlus className="w-3.5 h-3.5" />
                        <span>Zoom</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={`text-xs text-center py-6 ${mutedText}`}>Tidak ada foto gallery tersedia.</p>
            )}

            <button
              onClick={handleCloseModal}
              className={`w-full py-3 px-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${closeBtn}`}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal Donasi */}
      {activeModal === 'donation' && (
        <div
          onClick={handleCloseModal}
          className="lf-fade-in fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`lf-sheet-up w-full sm:max-w-md ${modalBox} border rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl text-center relative max-h-[90vh] overflow-y-auto`}
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
              <FaHeart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">Terima Kasih atas Dukungannya!</h3>
            <p className={`text-xs mb-4 leading-relaxed ${mutedText}`}>
              Dukungan Anda sangat membantu saya untuk terus semangat berkarya.
            </p>

            <div className={`${softSurface} border rounded-2xl p-4 mb-4 text-center space-y-3`}>
              <span className={`text-[10px] uppercase tracking-wider font-semibold block ${mutedText}`}>
                Scan QRIS / Transfer Bank
              </span>

              <div
                onClick={handleOpenZoom}
                className="w-44 h-44 mx-auto bg-white p-2 rounded-2xl flex items-center justify-center shadow-lg relative group cursor-pointer ring-4 ring-pink-500/20"
                title="Klik untuk memperbesar"
              >
                <img
                  src={qrisImg}
                  alt="QRIS Donasi"
                  className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white gap-1 text-xs font-semibold">
                  <FaSearchPlus className="w-4 h-4" />
                  <span>Zoom</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-left pt-1">
                <div className={`text-xs font-mono ${c('text-gray-300', 'text-slate-700')}`}>
                  BCA: 1234567890 <br />
                  <span className={`font-sans text-[11px] ${mutedText}`}>a.n. Muhammad Fikri</span>
                </div>
                <button
                  onClick={handleCopyRekening}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                    copied
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                      : c('bg-white/5 border-white/10 text-white hover:bg-white/10', 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100')
                  }`}
                >
                  {copied ? <FaCheck className="w-3 h-3" /> : <FaCopy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div className={`${softSurface} border rounded-2xl p-3 mb-6 text-left flex items-center justify-between`}>
              <div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold block ${mutedText}`}>Saweria / Trakteer</span>
                <a href="https://saweria.co/mfikria" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-pink-500 hover:underline">
                  saweria.co/mfikria
                </a>
              </div>
            </div>

            <button
              onClick={handleCloseModal}
              className={`w-full py-3 px-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${closeBtn}`}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Lightbox / Fullscreen Zoom Overlay untuk QRIS */}
      {isZoomed && (
        <div
          onClick={handleCloseZoom}
          className="lf-fade-in fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={handleCloseZoom}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-pink-600 transition-colors shadow-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-sm w-full mx-4 cursor-default" onClick={(e) => e.stopPropagation()}>
            <img
              src={qrisImg}
              alt="QRIS Zoomed"
              className="w-full h-auto object-contain rounded-xl"
            />
            <p className="text-center text-gray-800 text-xs font-bold mt-3">
              Scan QRIS untuk berdonasi
            </p>
          </div>
        </div>
      )}

      {/* Lightbox / Fullscreen Zoom Overlay untuk Gallery */}
      {selectedImage && (
        <div
          onClick={handleCloseImageZoom}
          className="lf-fade-in fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={handleCloseImageZoom}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="bg-gray-900 border border-gray-800 p-3 rounded-2xl shadow-2xl max-w-md w-full mx-4 cursor-default" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Gallery Zoomed"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl bg-black"
            />
          </div>
        </div>
      )}
    </section>
  );
}