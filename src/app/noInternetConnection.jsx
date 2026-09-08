import React, { useState, useEffect } from 'react';

export default function NoInternetConnection(props) {
  const [isOnline, setOnline] = useState(navigator.onLine);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setOnline(false);
      setShowAlert(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Toast Notifikasi Ketika Kembali Online */}
      <div className={`fixed top-5 right-5 z-50 transition-all duration-300 transform ${showAlert ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="flex items-center gap-3 bg-gray-900/90 backdrop-blur-md border border-emerald-500/30 p-4 rounded-2xl shadow-2xl text-white">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Koneksi Dipulihkan</h4>
            <p className="text-[10px] text-emerald-400">Anda kembali terhubung ke internet.</p>
          </div>
        </div>
      </div>

      {/* Tampilan Utama / Halaman Offline */}
      {isOnline ? (
        props.children
      ) : (
        <section className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
            
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-3.536m0 0v-2m0 2h2m-2-2L3 3l18 18"
                />
              </svg>
            </div>

            <span className="text-xs font-semibold tracking-wider text-red-500 uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              Koneksi Terputus
            </span>

            <h2 className="mt-4 text-xl font-bold tracking-tight text-white">
              Tidak Ada Internet
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
              Periksa kembali koneksi Wi-Fi atau data seluler Anda. Halaman akan otomatis pulih saat terhubung kembali.
            </p>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-sm font-bold text-white transition-all shadow-lg active:scale-95"
            >
              Coba Muat Ulang
            </button>

          </div>
        </section>
      )}
    </>
  );
}