import React, { useState, useEffect } from 'react';

export default function NavbarStore({ isDarkMode, setIsDarkMode, totalItems, setIsCartOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-30 tracking-tight transition-all duration-500 ${
      isScrolled 
        ? `border-b backdrop-blur-xl ${isDarkMode ? 'bg-[#0a0a0c]/80 border-neutral-900' : 'bg-white/80 border-neutral-200 shadow-sm'}` 
        : `border-b ${isDarkMode ? 'bg-[#0a0a0c] border-neutral-900' : 'bg-white border-neutral-200'}`
    }`}>
      <div className={`max-w-6xl mx-auto px-4 transition-all duration-300 grid grid-cols-3 items-center ${
        isScrolled ? 'py-3' : 'py-4 sm:py-5'
      }`}>
        
        {/* Bagian Kiri: Logo & Navigasi Home */}
        <div className="flex items-center gap-3 sm:gap-6 justify-start">
          <h1 className={`font-black uppercase tracking-tighter whitespace-nowrap transition-all duration-300 ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          } ${
            isScrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
          }`}>
            LOS BRAND
          </h1>
          <a
            href="/app"
            className={`text-xs font-mono transition flex items-center gap-1.5 uppercase tracking-wider ${
              isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden xs:inline">[Home]</span>
          </a>
        </div>

        {/* Bagian Tengah: Tombol Dark Mode Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider border transition-all duration-300 flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700' 
                : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:border-neutral-300'
            }`}
          >
            <span className="text-[10px]">{isDarkMode ? '⚡' : '🌙'}</span>
            <span className="hidden sm:inline">{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>
        </div>

        {/* Bagian Kanan: Ruang Penyeimbang / Bantuan */}
        <div className="flex justify-end">
          {/* Grid balancing placeholder */}
        </div>

      </div>
    </header>
  );
}