import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HiMenuAlt2, HiX, HiHome, HiFolder, HiNewspaper, HiHeart, HiShoppingBag } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

const nav = {
  logo: "mfikria",
  menubar: [
    { name: "Home", url: "/app", icon: HiHome },
    { name: "Project", url: "/project", icon: HiFolder },
    { name: "Blog", url: "/blog", icon: HiNewspaper },
    { name: "My Hobbies", url: "/hobbies", icon: HiHeart },
    { name: "Store", url: "/store", icon: HiShoppingBag }
  ],
  github_button: {
    name: "Github",
    url: "https://github.com/dodokjr"
  }
};

const SCROLL_THRESHOLD = 40;
const EDGE_GAP = 8;        // jarak minimal sidebar dari tepi layar
const DRAG_THRESHOLD = 5;  // gerakan minimal (px) supaya dianggap drag, bukan klik

function Divider({ vertical }) {
  return (
    <div
      aria-hidden="true"
      className={`shrink-0 bg-gray-800 transition-all ${vertical ? 'w-px h-6' : 'w-6 h-px my-0.5'}`}
    />
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const sidebarRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setIsScrolled(true);
        setIsOpen(false);
      } else {
        setIsScrolled(false);
        setIsExpanded(false);
        setIsOpen(false);
        setIsSidebarVisible(true);
      }
    };

    handleScroll(); // cek posisi awal (mis. setelah refresh di tengah halaman)
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const applyTransform = () => {
    if (sidebarRef.current) {
      const { x, y } = posRef.current;
      sidebarRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  };

  // Jaga sidebar supaya tidak keluar layar
  const clamp = useCallback(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    let dx = 0;
    let dy = 0;

    if (rect.right > window.innerWidth - EDGE_GAP) dx = window.innerWidth - EDGE_GAP - rect.right;
    if (rect.left < EDGE_GAP) dx = EDGE_GAP - rect.left;
    if (rect.bottom > window.innerHeight - EDGE_GAP) dy = window.innerHeight - EDGE_GAP - rect.bottom;
    if (rect.top < EDGE_GAP) dy = EDGE_GAP - rect.top;

    if (dx || dy) {
      posRef.current.x += dx;
      posRef.current.y += dy;
      el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    }
  }, []);

  // Listener drag didaftarkan sekali saja (tidak bocor, ada cleanup)
  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d.active) return;

      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

      d.moved = true;
      posRef.current.x = d.originX + dx;
      posRef.current.y = d.originY + dy;
      applyTransform();
      clamp();
    };

    const onUp = () => {
      const d = dragRef.current;
      if (!d.active) return;
      d.active = false;
      // reset flag setelah event click selesai diproses
      if (d.moved) setTimeout(() => { d.moved = false; }, 0);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', clamp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', clamp);
    };
  }, [clamp]);

  // Ukuran sidebar berubah (buka/tutup, ganti layout) -> pastikan tetap di dalam layar
  useEffect(() => {
    clamp();
  }, [isExpanded, isSidebarVisible, isScrolled, clamp]);

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      originX: posRef.current.x,
      originY: posRef.current.y,
    };
  };

  // Kalau barusan di-drag, batalkan klik pada tombol/link di dalam sidebar
  const handleClickCapture = (e) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const sidebarLayout = !isSidebarVisible
    ? 'p-1'
    : isExpanded
      ? 'p-2 flex-row space-x-2'
      : 'p-2 flex-col space-y-2';

  return (
    <>
      {/* Navbar utama (sebelum di-scroll) */}
      <nav
        aria-hidden={isScrolled}
        className={`fixed z-40 top-4 left-0 right-0 w-full max-w-6xl mx-auto px-4 transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'opacity-0 invisible pointer-events-none -translate-y-10'
            : 'opacity-100 visible translate-y-0'
        }`}
      >
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
            {nav.menubar.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
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
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isOpen}
              className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 text-pink-400 flex items-center justify-center"
            >
              {isOpen ? <HiX className="w-4 h-4" /> : <HiMenuAlt2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {isOpen && !isScrolled && (
        <div className="md:hidden fixed top-24 left-4 right-4 z-30">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 p-2.5 rounded-2xl shadow-2xl space-y-1">
            {nav.menubar.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
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
            <a
              href={nav.github_button.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-pink-600 hover:bg-pink-500"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2.5">
                <FaGithub className="w-3.5 h-3.5" />
                <span>{nav.github_button.name}</span>
              </div>
              <span>→</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating sidebar (bisa di-drag dari bagian mana pun) */}
      <div
        ref={sidebarRef}
        aria-hidden={!isScrolled}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className={`fixed top-6 left-4 z-40 bg-gray-950/90 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing select-none touch-none flex items-center transition-[opacity,visibility] duration-300 ease-in-out ${sidebarLayout} ${
          isScrolled ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Logo: toggle buka/tutup sidebar */}
        <button
          type="button"
          onClick={() => setIsSidebarVisible((v) => !v)}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-black text-white hover:border-pink-500 transition-colors focus:outline-none shrink-0 ${
            !isSidebarVisible ? 'bg-pink-600 border-pink-500' : 'bg-gray-900 border-gray-800'
          }`}
          title={isSidebarVisible ? 'Tutup Sidebar' : 'Buka Sidebar'}
          aria-label={isSidebarVisible ? 'Tutup sidebar' : 'Buka sidebar'}
        >
          {nav.logo[0]}<span className="text-pink-500">.</span>
        </button>

        {isSidebarVisible && (
          <>
            <Divider vertical={isExpanded} />

            {/* Ganti layout vertikal / horizontal */}
            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              className="w-9 h-9 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-center text-xs font-bold text-gray-300 hover:text-white hover:border-pink-500 transition-colors focus:outline-none shrink-0"
              title="Ganti Mode Tata Letak"
              aria-label="Ganti mode tata letak"
            >
              <span className="text-pink-500 text-sm">{isExpanded ? '←' : '→'}</span>
            </button>

            <Divider vertical={isExpanded} />

            {/* Menu */}
            <div className={`flex items-center ${isExpanded ? 'flex-row space-x-1' : 'flex-col space-y-1'}`}>
              {nav.menubar.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    aria-label={item.name}
                    className="group relative w-9 h-9 rounded-xl bg-gray-900/60 hover:bg-gray-800 border border-gray-800/80 hover:border-pink-500/50 flex items-center justify-center text-gray-300 hover:text-white transition-colors shrink-0"
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

            <Divider vertical={isExpanded} />

            {/* GitHub */}
            <a
              href={nav.github_button.url}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="group relative w-9 h-9 rounded-xl bg-pink-600/10 hover:bg-pink-600 border border-pink-500/20 hover:border-pink-500 flex items-center justify-center text-pink-400 hover:text-white transition-colors shadow-md shrink-0"
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