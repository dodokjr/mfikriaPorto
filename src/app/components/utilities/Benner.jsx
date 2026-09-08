import React from 'react';
import { HiSparkles, HiArrowRight, HiCode } from 'react-icons/hi';

export default function Benner() {
  return (
    <section className="relative bg-gray-950 py-16 sm:py-24 px-4 flex flex-col items-center justify-center text-center overflow-hidden border-b border-gray-900/60">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/15 via-gray-950 to-gray-950 pointer-events-none" />
      
      <div className="w-full max-w-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative z-10">
        
        {/* Badge Status */}
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 rounded-full mb-6">
          <HiSparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-pink-400 uppercase">
            My Hobbies & Passion
          </span>
        </div>

        {/* Heading Utama */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          Eksplorasi Sisi Lain <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Dunia Saya</span>
        </h1>

        {/* Deskripsi */}
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
          Temukan hobi, musik favorit, koleksi momen, hingga mini game interaktif yang saya buat untuk mengisi waktu luang di luar aktivitas coding.
        </p>

        {/* Quick Actions / Stats pill */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-gray-950/80 border border-gray-800 px-4 py-2 rounded-2xl text-xs text-gray-300 font-medium shadow-inner">
            <HiCode className="w-4 h-4 text-pink-400" />
            <span>Coding & Creative Hobbies</span>
          </div>
        </div>

      </div>
    </section>
  );
}