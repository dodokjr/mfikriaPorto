import React, { useEffect, useState } from 'react';
import pp from "../assets/ppa.jpg";
import qrisImg from "../assets/qris.jpeg";
import { FaGlobe, FaHeart, FaShoppingBag, FaImages, FaSearchPlus, FaTimes } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';

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

  const handleOpenShopModal = () => {
    fetchStoreData();
    document.getElementById('shop_modal').showModal();
  };

  const handleOpenGalleryModal = () => {
    fetchGalleryData();
    document.getElementById('gallery_modal').showModal();
  };

  const handleOpenZoom = () => {
    const donationModal = document.getElementById('donation_modal');
    if (donationModal) {
      donationModal.close();
    }
    setIsZoomed(true);
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  const handleOpenImageZoom = (imgUrl) => {
    const galleryModal = document.getElementById('gallery_modal');
    if (galleryModal) {
      galleryModal.close();
    }
    setSelectedImage(imgUrl);
  };

  const handleCloseImageZoom = () => {
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <section className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center">
          <IoReload className="w-8 h-8 text-pink-500 animate-spin mb-4" />
          <h2 className="text-sm font-bold text-white mb-1">Memuat Tautan...</h2>
          <p className="text-xs text-gray-400">Mohon tunggu sebentar.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white relative">
      
      {/* Alert Error Pojok Kanan Atas */}
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <span className="text-xs font-bold">{errorMessage}</span>
        </div>
      )}

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        
        {/* Profile Image & Name */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-24 h-24 mb-4 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-indigo-500 shadow-lg">
            <img 
              src={pp} 
              alt={data?.name || "Profile"} 
              className="w-full h-full object-cover rounded-full bg-gray-950" 
            />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase">
            {data?.name || "Muhammad Fikri Ardiyansah"}
          </h1>
        </div>

        <div className="w-full h-px bg-gray-800 my-6" />

        {/* Short Summary / Quote */}
        <div className="mb-6">
          <span className="text-[10px] font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20 block w-max mx-auto mb-3">
            Tentang Saya
          </span>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed italic">
            "{data?.quetes || "Selalu belajar dan berkembang dalam dunia teknologi."}"
          </p>
        </div>

        <div className="w-full h-px bg-gray-800 my-6" />

        {/* Social Media Links */}
        <div className="flex flex-col space-y-3 mb-6">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Media Sosial & Tautan
          </span>

          {data?.link_one && data.link_one.length > 0 ? (
            data.link_one.map((r, i) => (
              <a 
                key={i} 
                href={r.href} 
                target="_blank" 
                rel="nofollow noopener noreferrer" 
                title={r.title} 
                className="w-full py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-pink-600 border border-gray-700 hover:border-pink-500 text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-95"
              >
                <FaGlobe className="w-4 h-4 text-pink-400 group-hover:text-white transition-colors" />
                <span>{r.title}</span>
              </a>
            ))
          ) : (
            <p className="text-xs text-gray-500">Tidak ada tautan tersedia.</p>
          )}
        </div>

        <div className="w-full h-px bg-gray-800 my-6" />

        {/* Fitur Spill Jualan & Gallery */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={handleOpenShopModal}
            className="py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            <FaShoppingBag className="w-4 h-4 text-pink-400" />
            <span>Spill Jualan</span>
          </button>
          
          <button 
            onClick={handleOpenGalleryModal}
            className="py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            <FaImages className="w-4 h-4 text-indigo-400" />
            <span>Gallery</span>
          </button>
        </div>

        {/* Tombol Donasi */}
        <button 
          onClick={() => document.getElementById('donation_modal').showModal()}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 active:scale-95"
        >
          <FaHeart className="w-4 h-4 text-white animate-pulse" />
          <span>Donasi / Traktir Kopi</span>
        </button>

      </div>

      {/* Modal Spill Jualan */}
      <dialog id="shop_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gray-900 border border-gray-800 text-white rounded-3xl p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <FaShoppingBag className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-base text-white">Spill Jualan & Produk</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Beberapa produk, jasa, atau barang rekomendasi yang saya tawarkan:
          </p>

          {isStoreLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <IoReload className="w-6 h-6 text-pink-500 animate-spin mb-2" />
              <p className="text-xs text-gray-400">Memuat produk...</p>
            </div>
          ) : storeData.length > 0 ? (
            <div className="space-y-3 mb-6">
              {storeData.map((item, index) => (
                <div key={index} className="bg-gray-950 border border-gray-800 rounded-2xl p-3 flex items-center gap-3">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title || item.name} 
                      className="w-14 h-14 object-cover rounded-xl bg-gray-900 border border-gray-800 flex-shrink-0" 
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.title || item.name}</h4>
                    <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">{item.description || item.desc}</p>
                  </div>
                  {item.price && (
                    <span className="text-xs font-extrabold text-pink-400 whitespace-nowrap px-2">
                      {formatRupiah(item.price)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-6">Tidak ada produk tersedia.</p>
          )}

          <div className="modal-action mt-0">
            <form method="dialog" className="w-full">
              <button className="w-full py-3 px-4 rounded-2xl bg-gray-800 hover:bg-gray-700 text-sm font-bold text-white transition-all">
                Tutup
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Modal Gallery */}
      <dialog id="gallery_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gray-900 border border-gray-800 text-white rounded-3xl p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <FaImages className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Gallery Momen</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Beberapa potret dokumentasi kegiatan dan hobi:
          </p>

          {isGalleryLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <IoReload className="w-6 h-6 text-indigo-500 animate-spin mb-2" />
              <p className="text-xs text-gray-400">Memuat gallery...</p>
            </div>
          ) : galleryData.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-6">
              {galleryData.map((item, index) => {
                const imgUrl = item.url_Image || item.url || item;
                return (
                  <div 
                    key={index} 
                    onClick={() => handleOpenImageZoom(imgUrl)}
                    className="h-32 rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden relative group cursor-pointer flex items-center justify-center"
                    title="Klik untuk memperbesar"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 text-xs font-semibold">
                      <FaSearchPlus className="w-4 h-4" />
                      <span>Zoom</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-6">Tidak ada foto gallery tersedia.</p>
          )}

          <div className="modal-action mt-0">
            <form method="dialog" className="w-full">
              <button className="w-full py-3 px-4 rounded-2xl bg-gray-800 hover:bg-gray-700 text-sm font-bold text-white transition-all">
                Tutup
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Modal Donasi */}
      <dialog id="donation_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gray-900 border border-gray-800 text-white rounded-3xl p-6 shadow-2xl text-center relative">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <FaHeart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white mb-1">Terima Kasih atas Dukungannya!</h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Dukungan Anda sangat membantu saya untuk terus semangat berkarya.
          </p>

          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 mb-4 text-center space-y-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
              Scan QRIS / Transfer Bank
            </span>
            
            <div 
              onClick={handleOpenZoom}
              className="w-44 h-44 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-md relative group cursor-pointer"
              title="Klik untuk memperbesar"
            >
              <img 
                src={qrisImg} 
                alt="QRIS Donasi" 
                className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white gap-1 text-xs font-semibold">
                <FaSearchPlus className="w-4 h-4" />
                <span>Zoom</span>
              </div>
            </div>

            <div className="text-xs text-gray-300 font-mono pt-1">
              BCA: 1234567890 <br/>
              <span className="text-gray-400 font-sans text-[11px]">a.n. Muhammad Fikri</span>
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-3 mb-6 text-left flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Saweria / Trakteer</span>
              <a href="https://saweria.co/mfikria" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-pink-400 hover:underline">
                saweria.co/mfikria
              </a>
            </div>
          </div>

          <div className="modal-action mt-0">
            <form method="dialog" className="w-full">
              <button className="w-full py-3 px-4 rounded-2xl bg-gray-800 hover:bg-gray-700 text-sm font-bold text-white transition-all">
                Tutup
              </button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Lightbox / Fullscreen Zoom Overlay untuk QRIS */}
      {isZoomed && (
        <div 
          onClick={handleCloseZoom} 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
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