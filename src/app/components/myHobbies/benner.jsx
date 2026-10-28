import React from 'react'

export default function Benner() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-24 text-white lg:py-36">
      <style>{`
        @keyframes benner-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes benner-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes benner-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-70px, -30px) scale(1.1); }
        }
        @keyframes benner-drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(30px, -50px) scale(1.2); }
        }
        @keyframes benner-grid-move {
          from { background-position: 0 0; }
          to   { background-position: 48px 48px; }
        }
        .benner-fade-up { opacity: 0; animation: benner-fade-up 0.7s ease-out forwards; }
        .benner-blob-a  { animation: benner-drift-a 14s ease-in-out infinite; }
        .benner-blob-b  { animation: benner-drift-b 18s ease-in-out infinite; }
        .benner-blob-c  { animation: benner-drift-c 16s ease-in-out infinite; }
        .benner-grid {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: benner-grid-move 6s linear infinite;
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 100%);
                  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 100%);
        }
      `}</style>

      {/* Background: blob warna yang bergerak pelan */}
      <div className="pointer-events-none absolute inset-0">
        <div className="benner-blob-a absolute -left-24 top-0 h-72 w-72 rounded-full bg-purple-600/40 blur-[100px] sm:h-96 sm:w-96" />
        <div className="benner-blob-b absolute -right-24 top-10 h-72 w-72 rounded-full bg-pink-500/30 blur-[100px] sm:h-96 sm:w-96" />
        <div className="benner-blob-c absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/30 blur-[100px] sm:h-96 sm:w-96" />

        {/* Grid tipis yang bergeser, memudar di tepi */}
        <div className="benner-grid absolute inset-0" />

        {/* Fade ke warna dasar di bagian bawah agar menyatu dengan section berikutnya */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <span className="benner-fade-up inline-block rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium tracking-wider text-pink-400 backdrop-blur">
          Eksplorasi & Kreativitas
        </span>

        <h1
          className="benner-fade-up mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          style={{ animationDelay: '0.1s' }}
        >
          My Hobbies
          <span className="mt-1 block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Collection & Feed
          </span>
        </h1>

        <p
          className="benner-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg"
          style={{ animationDelay: '0.2s' }}
        >
          Tempat saya mendokumentasikan hobi, aktivitas seru, dan feed visual dari keseharian.
        </p>

        <div className="benner-fade-up mt-10" style={{ animationDelay: '0.3s' }}>
          <a
            href="#hobbies-content"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-all duration-200 hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-500/20"
          >
            Jelajahi Hobi
            <span className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}