import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const [res, setRes] = useState({});

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/app", { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    let isMounted = true;
    fetch(`https://api-mfikria.vercel.app/404${location.pathname}`)
      .then((response) => response.json())
      .then((body) => {
        if (isMounted) setRes(body || {});
      })
      .catch((error) => console.error("API not responding, please call me: ffikri604@gmail.com", error));

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  return (
    <main className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        
        {/* Error Badge */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
          <span className="text-xl font-black">404</span>
        </div>

        <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
          Halaman Hilang
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
          Page Not Found
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
          Maaf, halaman <span className="text-white font-mono bg-gray-950 px-2 py-0.5 rounded border border-gray-800">{location.pathname}</span> yang Anda cari tidak ditemukan.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/app?from=404"
            className="w-full py-3 px-4 rounded-2xl bg-pink-600 hover:bg-pink-500 text-sm font-bold text-white transition-all shadow-lg shadow-pink-600/30 active:scale-95 text-center"
          >
            Kembali ke Beranda
          </Link>
          <button 
            onClick={() => document.getElementById('support_modal').showModal()}
            className="w-full py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-sm font-bold text-white transition-all active:scale-95"
          >
            Hubungi Support
          </button>
        </div>
      </div>

      {/* Modern Dialog Modal */}
      <dialog id="support_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gray-900 border border-gray-800 text-white rounded-3xl p-6 shadow-2xl">
          <h3 className="font-bold text-lg text-white mb-2">Bantuan & Laporan Bug</h3>
          <p className="text-xs text-gray-400 mb-4">
            Rute <span className="text-pink-400 font-mono">{location.pathname}</span> tidak terdaftar di sistem.
          </p>

          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-300 font-mono mb-1">Time Status: <span className="text-pink-400">{res.TimeStatus || 'N/A'}</span></p>
            <p className="text-xs text-gray-300 font-mono">Kode Error: <span className="text-indigo-400">{res.code_for_message || 'N/A'}</span></p>
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Silakan laporkan kendala ini langsung melalui email ke <a href='mailto:ffikri604@gmail.com' className='text-pink-400 hover:underline font-semibold'>ffikri604@gmail.com</a>.
          </p>

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
    </main>
  );
}