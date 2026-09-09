import React from 'react';

export default function FooterStore({ isDarkMode }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={`border-t tracking-tight transition-colors duration-500 py-12 px-4 mt-20 ${
      isDarkMode ? 'bg-[#0a0a0c] border-neutral-900 text-neutral-400' : 'bg-white border-neutral-200 text-neutral-600'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Informasi Brand */}
        <div className="space-y-1">
          <h3 className={`text-sm sm:text-base font-black tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            LOS BRAND
          </h3>
          <p className="text-[11px] font-mono text-neutral-500">
            No Rules. Pure Form. All Rights Reserved.
          </p>
        </div>

        {/* Tautan Navigasi Footer */}
        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          <a href="/store" className="hover:text-white transition">Index</a>
          <a href="/tentang-kami" className="hover:text-white transition">About</a>
          <a href="/kritik-dan-saran" className="hover:text-white transition">Logs</a>
        </div>

        {/* Tombol Back to Top */}
        <div>
          <button
            onClick={scrollToTop}
            className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider border transition-all duration-300 flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white' 
                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:text-black'
            }`}
          >
            <span>↑</span>
            <span>Back to Top</span>
          </button>
        </div>

      </div>
    </footer>
  );
}