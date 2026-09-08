import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsExpanded(false);
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!nav) return null;

  return (
    <>
      {/* Navbar Utama (Hanya muncul di atas sebelum di-scroll untuk Desktop & Mobile) */}
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

          {/* Tombol Mobile Toggle di Top Navbar */}
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

      {/* Mobile Dropdown di Top (Sebelum Scroll) */}
      {isOpen && !isScrolled && (
        <div className="md:hidden fixed top-22 left-4 right-4 z-30">
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

      {/* Floating Vertical Minimalis di Samping Kiri Saat Di-scroll (Berlaku untuk Desktop & Mobile) */}
      <div className={`fixed top-6 left-4 z-40 bg-gray-950/90 backdrop-blur-xl border border-gray-800 p-2 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out items-center flex ${
        isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none -translate-x-10'
      } ${isExpanded ? 'flex-row space-x-2' : 'flex-col space-y-2'}`}>
        
        {/* Logo / Tombol Expand ke Samping Kanan */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-xs font-black text-white hover:border-pink-500 transition-all focus:outline-none shrink-0"
          title="Toggle Navbar Mode"
        >
          {isExpanded ? (
            <span className="text-pink-500 text-sm">←</span>
          ) : (
            <>
              {nav.logo[0]}<span className="text-pink-500">.</span>
            </>
          )}
        </button>

        <div className={`bg-gray-800 my-0.5 transition-all ${isExpanded ? 'w-[1px] h-6 my-0' : 'w-6 h-[1px]'}`} />

        {/* Menu Items (Vertical / Horizontal tergantung state isExpanded) */}
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
                
                {/* Tooltip (Hanya muncul jika tidak dalam mode expanded) */}
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

      </div>
    </>
  );
}