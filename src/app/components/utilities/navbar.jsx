import React, { useState, useEffect, useRef } from 'react';
import { HiMenuAlt2, HiX, HiHome, HiFolder, HiNewspaper, HiHeart, HiShoppingBag } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

const nav = {
  logo: "mfikria",
  menubar: [
    { name: "Home", url: "/app", icon: HiHome },
    { name: "Project", url: "/Project", icon: HiFolder },
    { name: "Blog", url: "/blog", icon: HiNewspaper },
    { name: "My Hobbies", url: "/hobbies", icon: HiHeart },
    { name: "Store", url: "/store", icon: HiShoppingBag }
  ],
  github_button: {
    name: "Github",
    url: "https://github.com/dodokjr"
  }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const sidebarRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0, isDragging: false, startX: 0, startY: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsExpanded(false);
        setIsOpen(false);
        setIsSidebarVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePointerDown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'A' || e.target.closest('a')) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    posRef.current.isDragging = true;
    posRef.current.startX = clientX - posRef.current.x;
    posRef.current.startY = clientY - posRef.current.y;

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('touchend', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!posRef.current.isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    posRef.current.x = clientX - posRef.current.startX;
    posRef.current.y = clientY - posRef.current.startY;

    if (sidebarRef.current) {
      requestAnimationFrame(() => {
        sidebarRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      });
    }
  };

  const handlePointerUp = () => {
    posRef.current.isDragging = false;
    document.removeEventListener('mousemove', handlePointerMove);
    document.removeEventListener('mouseup', handlePointerUp);
    document.removeEventListener('touchmove', handlePointerMove);
    document.removeEventListener('touchend', handlePointerUp);
  };

  if (!nav) return null;

  return (
    <>
      {/* Navbar Utama (Sebelum di-scroll) */}
      <nav className={`fixed z-40 top-4 left-0 right-0 w-full max-w-6xl mx-auto px-4 transition-all duration-500 ease-in-out ${
        isScrolled ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100 translate-y-0'
      }`}>
        <div className="flex items-center justify-between h-16 px-5 bg-gray-950/85 backdrop-blur-xl border border-gray-800/80 rounded-2xl shadow-2xl">
          
          <div className="flex items-center gap-2">
            <a 
              href="/app" 
              className="text-sm font-black uppercase tracking-wider text-white hover:text-pink-400 transition-colors"
            >
              {nav.logo}<span className="text-pink-500">.</span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1 rounded-xl border border-gray-800">
            {nav.menubar.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.url}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  {IconComponent && <IconComponent className="w-3.5 h-3.5 text-pink-400" />}
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>

          <div className="hidden md:block">
            <a
              href={nav.github_button.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-pink-600 rounded-xl hover:bg-pink-500 transition-all shadow-lg shadow-pink-600/20 active:scale-95"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>{nav.github_button.name}</span>
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 text-pink-400 flex items-center justify-center"
            >
              {isOpen ? <HiX className="w-4 h-4" /> : <HiMenuAlt2 className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Dropdown di Top */}
      {isOpen && !isScrolled && (
        <div className="md:hidden fixed top-24 left-4 right-4 z-30">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 p-2.5 rounded-2xl shadow-2xl space-y-1">
            {nav.menubar.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.url}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center gap-2.5">
                    {IconComponent && <IconComponent className="w-3.5 h-3.5 text-pink-400" />}
                    <span>{item.name}</span>
                  </div>
                  <span className="text-pink-500">→</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Sidebar (Bisa di-drag, logo berfungsi untuk buka/tutup menu secara utuh) */}
      <div 
        ref={sidebarRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        className={`fixed top-6 left-4 z-40 bg-gray-950/90 backdrop-blur-xl border border-gray-800 p-2 rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing select-none transition-opacity duration-300 ease-in-out items-center flex ${
          isScrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } ${!isSidebarVisible ? 'w-11 h-11 p-1' : isExpanded ? 'flex-row space-x-2' : 'flex-col space-y-2'}`}
      >
        
        {/* Tombol Logo: Klik untuk Toggle Buka/Tutup Sidebar (Tutup sisa logo saja, Buka tampilkan semua menu) */}
        <button 
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className={`rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-xs font-black text-white hover:border-pink-500 transition-all focus:outline-none shrink-0 ${
            !isSidebarVisible ? 'w-9 h-9 bg-pink-600 border-pink-500' : 'w-9 h-9'
          }`}
          title={isSidebarVisible ? "Tutup Sidebar" : "Buka Sidebar"}
        >
          {nav.logo[0]}<span className="text-pink-500">.</span>
        </button>

        {/* Bagian menu dan github hanya muncul jika sidebar terbuka (isSidebarVisible = true) */}
        {isSidebarVisible && (
          <>
            <div className={`bg-gray-800 my-0.5 transition-all ${isExpanded ? 'w-[1px] h-6 my-0' : 'w-6 h-[1px]'}`} />

            {/* Tombol Mode Tampilan (Vertical / Horizontal) */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-9 h-9 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-center text-xs font-bold text-gray-300 hover:text-white hover:border-pink-500 transition-all focus:outline-none shrink-0"
              title="Ganti Mode Tata Letak"
            >
              {isExpanded ? <span className="text-pink-500 text-sm">←</span> : <span className="text-pink-500 text-sm">→</span>}
            </button>

            <div className={`bg-gray-800 my-0.5 transition-all ${isExpanded ? 'w-[1px] h-6 my-0' : 'w-6 h-[1px]'}`} />

            {/* Menu Items */}
            <div className={`flex transition-all ${isExpanded ? 'flex-row space-x-1 items-center' : 'flex-col space-y-1 items-center'}`}>
              {nav.menubar.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={index}
                    href={item.url}
                    className="group relative w-9 h-9 rounded-xl bg-gray-900/60 hover:bg-gray-800 border border-gray-800/80 hover:border-pink-500/50 flex items-center justify-center text-gray-300 hover:text-white transition-all shrink-0"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 text-pink-400" />}
                    
                    {!isExpanded && (
                      <span className="absolute left-12 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                        {item.name}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            <div className={`bg-gray-800 my-0.5 transition-all ${isExpanded ? 'w-[1px] h-6 my-0' : 'w-6 h-[1px]'}`} />

            {/* GitHub Icon */}
            <a
              href={nav.github_button.url}
              target="_blank"
              rel="noreferrer"
              className="group relative w-9 h-9 rounded-xl bg-pink-600/10 hover:bg-pink-600 border border-pink-500/20 hover:border-pink-500 flex items-center justify-center text-pink-400 hover:text-white transition-all shadow-md shrink-0"
            >
              <FaGithub className="w-4 h-4" />
              {!isExpanded && (
                <span className="absolute left-12 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                  GitHub
                </span>
              )}
            </a>
          </>
        )}

      </div>
    </>
  );
}