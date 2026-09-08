import React, { useState } from 'react';
import { HiExternalLink, HiZoomIn, HiArrowRight } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

export default function HomeProject({ api }) {
  const [selectedImg, setSelectedImg] = useState(null);
  
  const isLoading = !api;
  const projects = api?.data?.project || [];

  return (
    <>
      <section className="bg-gray-950 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header Section Minimalis */}
          <div className="mx-auto max-w-xl text-center mb-12">
            <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
              Portfolio
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">
              Featured Projects
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-400">
              Kumpulan proyek pilihan yang pernah saya kerjakan.
            </p>
          </div>

          {/* Grid Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 p-6 animate-pulse">
                  <div className="h-48 w-full bg-gray-800 rounded-2xl mb-6" />
                  <div className="h-5 w-3/4 bg-gray-800 rounded-md mb-3" />
                  <div className="h-3 w-full bg-gray-800 rounded-md mb-2" />
                  <div className="h-3 w-2/3 bg-gray-800 rounded-md mb-6" />
                  <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                    <div className="h-4 w-12 bg-gray-800 rounded-md" />
                    <div className="h-8 w-20 bg-gray-800 rounded-xl" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {projects.map((r, i) => (
                  <div 
                    key={i} 
                    className="group relative flex flex-col overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 transition-all duration-300 hover:border-gray-700 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Visual Thumbnail */}
                    <div 
                      className="relative h-48 w-full cursor-pointer overflow-hidden bg-gray-950 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${r.img_url}')` }}
                      onClick={() => setSelectedImg({ url: r.img_url, title: r.title, github: r.url_github, demo: r.url_demo })}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-gray-700">
                          <HiZoomIn className="w-3.5 h-3.5 text-pink-400" /> Perbesar / Detail
                        </span>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-white capitalize">
                          {r.title}
                        </h3>
                        <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-2">
                          {r.descriptions}
                        </p>
                      </div>

                      {/* Link Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
                        {r.url_github ? (
                          <a 
                            href={r.url_github} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                          >
                            <FaGithub className="w-4 h-4" /> Code
                          </a>
                        ) : <span />}

                        {r.url_demo && (
                          <a 
                            href={r.url_demo} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-all shadow-lg shadow-pink-600/20 active:scale-95"
                          >
                            <span>Live Demo</span>
                            <HiExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Card More Projects */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 p-6 transition-all duration-300 hover:border-gray-700 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-block mb-3">
                      Explore More
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-white">
                      Semua Proyek & Repositori
                    </h3>
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                      Temukan daftar lengkap eksperimen kode, open source, dan proyek lainnya.
                    </p>
                  </div>

                  <a 
                    href="/project" 
                    className="mt-6 py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-95 group-hover:border-pink-500/50"
                  >
                    <span>Lihat Semua Proyek</span>
                    <HiArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </>
            )}

          </div>
        </div>
      </section>

      {/* Modern Modal Fullscreen dengan Tombol Aksi */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedImg(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white capitalize">{selectedImg.title}</h4>
              <button 
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
                onClick={() => setSelectedImg(null)}
              >
                ✕
              </button>
            </div>
            
            {/* Gambar Fullscreen / Preview */}
            <div className="w-full max-h-[55vh] overflow-hidden rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-center mb-6 p-2">
              <img 
                src={selectedImg.url} 
                alt={selectedImg.title} 
                className="max-h-[50vh] w-auto object-contain rounded-xl"
              />
            </div>

            {/* Tombol Aksi di dalam Modal */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-800">
              {selectedImg.github && (
                <a 
                  href={selectedImg.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>Lihat Kode GitHub</span>
                </a>
              )}
              {selectedImg.demo && (
                <a 
                  href={selectedImg.demo} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition-all shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Kunjungi Live Demo</span>
                  <HiExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}