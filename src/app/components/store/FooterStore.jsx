import React from 'react';

export default function FooterStore(){
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 text-gray-600">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        
        {/* Brand / Copyright */}
        <p>© {new Date().getFullYear()} Lose Brand All rights reserved.</p>

        {/* Links */}
        <div className="flex gap-6">
          <a href="#about" className="hover:text-gray-900 transition-colors">Tentang</a>
          <a href="#privacy" className="hover:text-gray-900 transition-colors">Privasi</a>
          <a href="#contact" className="hover:text-gray-900 transition-colors">Kontak</a>
        </div>

      </div>
    </footer>
  );
};