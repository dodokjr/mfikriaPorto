import React from 'react'

export default function Benner() {
  return (
    <section className="relative overflow-hidden bg-gray-950 text-white py-20 lg:py-32">
      {/* Background glow effect modern */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-purple-600/20 via-blue-500/20 to-green-400/25 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge Kategori */}
        <span className="inline-block px-3.5 py-1 text-xs font-medium tracking-wider text-pink-400 uppercase bg-pink-500/10 border border-pink-500/20 rounded-full mb-6">
          Eksplorasi & Kreativitas
        </span>

        {/* Heading Utama */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          My Hobbies <span className="block mt-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">Collection & Feed</span>
        </h1>

        {/* Deskripsi */}
        <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Halaman khusus tempat saya mendokumentasikan dan membagikan berbagai hobi, aktivitas seru, serta feed visual dalam keseharian saya.
        </p>

        {/* Action Buttons / Call to Action (Opsional jika ingin ditambahkan tombol interaktif) */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#hobbies-content"
            className="inline-flex items-center justify-center px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-full transition-all duration-200 shadow-lg shadow-pink-600/20"
          >
            Jelajahi Hobi
          </a>
        </div>

      </div>
    </section>
  )
}