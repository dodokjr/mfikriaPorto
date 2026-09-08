import React from 'react';
import { FaArrowUp } from "react-icons/fa6";

const Footer = () => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 transition-colors duration-300 dark:border-slate-800">
      <div className="container mx-auto px-6 py-10">
        
        {/* Baris Atas: Brand & Tombol Scroll Up */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Logo / Brand */}
          <a 
            href="/" 
            className="text-xl font-extrabold tracking-tight text-white transition-colors hover:text-indigo-400"
          >
            Mfikria<span className="text-indigo-500">.</span>
          </a>

          {/* Navigasi Ringkas */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#project" className="hover:text-white transition-colors">Projects</a>
            <a href="#blog" className="hover:text-white transition-colors">Blog</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Tombol Back To Top Modern */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 shadow-md border border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:text-white hover:shadow-indigo-500/25"
          >
            <FaArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>

        </div>

        {/* Divider Halus */}
        <div className="my-8 h-px w-full bg-slate-800"></div>

        {/* Baris Bawah: Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs font-medium sm:flex-row">
          <p>© {currentYear} Mfikria. All rights reserved.</p>
          <p className="text-slate-500">Designed & Built with React & Tailwind CSS</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;