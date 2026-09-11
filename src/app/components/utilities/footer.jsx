import React from 'react';
import { FaArrowUp, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa6";
import RealtimePingAlert from './RealtimePingAlert'

const Footer = () => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-950 text-gray-400 border-t border-gray-900/80">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between pb-12 border-b border-gray-900">
          
          {/* Kolom Brand */}
          <div className="md:col-span-5 space-y-3">
            <a href="/app" className="inline-block text-base font-black tracking-wider text-white">
              mfikria<span className="text-pink-500">.</span>
            </a>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Full-stack developer building clean, scalable web applications and digital experiences with modern tools.
            </p>
          </div>

          {/* Kolom Navigasi */}
          <div className="md:col-span-4 flex flex-wrap gap-x-8 gap-y-2 text-xs font-semibold">
            <a href="/app" className="hover:text-white transition-colors">Home</a>
            <a href="/Project" className="hover:text-white transition-colors">Projects</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/hobbies" className="hover:text-white transition-colors">Hobbies</a>
            <a href="/store" className="hover:text-white transition-colors">Store</a>
          </div>

          {/* Kolom Social & Action */}
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-3">
            <a 
              href="https://github.com/dodokjr" 
              target="_blank" 
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500/50 transition-all"
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group flex items-center gap-2 px-3.5 h-9 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-300 hover:text-white hover:border-pink-500/50 hover:bg-gray-800 transition-all ml-auto md:ml-0"
            >
              <span>Back to top</span>
              <FaArrowUp className="w-3 h-3 text-pink-400 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>

        </div>

        {/* Baris Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-gray-400">
          <p>© {currentYear} Mfikria. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
            <span>Available for new projects</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;