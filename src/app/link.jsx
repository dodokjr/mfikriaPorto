import React, { useEffect, useState } from 'react';
import pp from "../assets/ppa.jpg";
import { FaGlobe, FaHeart, FaShoppingBag, FaImages } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';

export default function Link() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error("Data failed to fetch", error);
      setData({});
    } finally {
      setIsLoading(false);
    }
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
    <section className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
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
            onClick={() => document.getElementById('shop_modal').showModal()}
            className="py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            <FaShoppingBag className="w-4 h-4 text-pink-400" />
            <span>Spill Jualan</span>
          </button>
          
          <button 
            onClick={() => document.getElementById('gallery_modal').showModal()}
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
        <div className="modal-box bg-gray-900 border border-gray-800 text-white rounded-3xl p-6 shadow-2xl text-left">
          <div className="flex items-center gap-2 mb-4">
            <FaShoppingBag className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-base text-white">Spill Jualan & Produk</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Beberapa produk, jasa, atau barang rekomendasi yang saya tawarkan:
          </p>

          <div className="space-y-3 mb-6">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-3 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-white">Jasa Pembuatan Website</h4>
                <p className="text-[10px] text-gray-400">Custom React, Tailwind, Fullstack</p>
              </div>
              <span className="text-xs font-extrabold text-pink-400">Mulai Rp150rb</span>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-3 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-white">E-Book Belajar Coding</h4>
                <p className="text-[10px] text-gray-400">Panduan lengkap pemula</p>
              </div>
              <span className="text-xs font-extrabold text-pink-400">Rp50rb</span>
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

      {/* Modal Gallery */}
      <dialog id="gallery_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gray-900 border border-gray-800 text-white rounded-3xl p-6 shadow-2xl text-left">
          <div className="flex items-center gap-2 mb-4">
            <FaImages className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Gallery Momen</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Beberapa potret dokumentasi kegiatan dan hobi:
          </p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="h-28 rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden flex items-center justify-center text-gray-600 text-xs font-medium">
              Foto 1
            </div>
            <div className="h-28 rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden flex items-center justify-center text-gray-600 text-xs font-medium">
              Foto 2
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

      {/* Modal Donasi */}
      <dialog id="donation_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gray-900 border border-gray-800 text-white rounded-3xl p-6 shadow-2xl text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <FaHeart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white mb-2">Terima Kasih atas Dukungannya!</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Dukungan Anda sangat membantu saya untuk terus semangat berkarya.
          </p>

          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 mb-6 text-left space-y-3">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Saweria / Trakteer</span>
              <a href="https://saweria.co" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-pink-400 hover:underline">
                saweria.co/mfikria
              </a>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">QRIS / Transfer Bank</span>
              <p className="text-xs text-gray-300 font-mono">BCA: 1234567890 a.n. Muhammad Fikri</p>
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
    </section>
  );
}