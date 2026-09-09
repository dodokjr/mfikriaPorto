import React from 'react';

export default function AboutMe({ isDarkMode }) {
  return (
    <div className={`min-h-screen font-sans tracking-tight transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0c] text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
      
      {/* Container Utama */}
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        
        {/* Bagian Header / Intro */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
          <span className="inline-block px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase tracking-widest">
            // About LOS BRAND
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase">
            No Rules. Pure Form.
          </h1>
          <p className={`text-xs sm:text-sm font-mono leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            LOS BRAND lahir dari presisi malam dan estetika minimalis. Kami mendefinisikan ulang pakaian esensial harian melalui arsitektur kain berbobot berat dan potongan tajam tanpa kompromi.
          </p>
        </div>

        {/* Bagian Fitur / Nilai Utama (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-neutral-950/80 border-neutral-900 hover:border-neutral-700' : 'bg-white border-neutral-200 shadow-sm'}`}>
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-mono text-xs mb-4">
              01
            </div>
            <h3 className="font-semibold text-sm tracking-tight mb-2 uppercase font-mono">Minimalist Architecture</h3>
            <p className={`text-[11px] sm:text-xs font-mono leading-relaxed ${isDarkMode ? 'text-neutral-500' : 'text-neutral-600'}`}>
              Garis desain bersih, monokromatik, dan abadi yang dirancang untuk skena urban malam hari.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-neutral-950/80 border-neutral-900 hover:border-neutral-700' : 'bg-white border-neutral-200 shadow-sm'}`}>
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-mono text-xs mb-4">
              02
            </div>
            <h3 className="font-semibold text-sm tracking-tight mb-2 uppercase font-mono">Heavyweight Material</h3>
            <p className={`text-[11px] sm:text-xs font-mono leading-relaxed ${isDarkMode ? 'text-neutral-500' : 'text-neutral-600'}`}>
              Standar katun combed premium berdensitas tinggi yang memberikan struktur, kenyamanan, dan durabilitas maksimal.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-neutral-950/80 border-neutral-900 hover:border-neutral-700' : 'bg-white border-neutral-200 shadow-sm'}`}>
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-mono text-xs mb-4">
              03
            </div>
            <h3 className="font-semibold text-sm tracking-tight mb-2 uppercase font-mono">Nocturnal Utility</h3>
            <p className={`text-[11px] sm:text-xs font-mono leading-relaxed ${isDarkMode ? 'text-neutral-500' : 'text-neutral-600'}`}>
              Potongan presisi tailored-fit yang menyatu secara alami dengan dinamika mobilitas malam Anda.
            </p>
          </div>
        </div>

        {/* Bagian Filosofi / Cerita Brand */}
        <div className={`p-8 sm:p-10 rounded-3xl border ${isDarkMode ? 'bg-neutral-950/50 border-neutral-900' : 'bg-white border-neutral-200 shadow-sm'} flex flex-col md:flex-row items-center gap-8`}>
          <div className="space-y-4 flex-1">
            <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">// Philosophy & Identity</span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">Knight & Nomad Archetype</h2>
            <p className={`text-xs sm:text-sm font-mono leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Di balik setiap jahitan tersembunyi karakter yang terinspirasi dari keteguhan seorang ksatria modern dan kebebasan jiwa petualang perkotaan. Visual yang tegas, gelap, dan maskulin.
            </p>
            <p className={`text-[11px] font-mono leading-relaxed ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Terima kasih telah menjadi bagian dari pergerakan ini.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}