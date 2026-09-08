import React, { useState } from 'react';
import Header from '../utilities/header';
import Img from "../../../assets/ff.png";

export default function HomeProject({ api }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const projects = api?.data?.project || [];

  return (
    <>
      {/* Background Soft Off-White */}
      <section className="bg-slate-100/70 py-16 transition-colors duration-300 dark:bg-slate-900">
        <div className="container mx-auto px-6">
          
          {/* Header Section dengan Judul Lebih Tebal & Menonjol */}
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Projects
              </span>
            </h1>
            <div className="mx-auto mt-2 h-1.5 w-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <p className="mt-4 text-base font-medium text-slate-600 dark:text-slate-300 sm:text-lg">
              Kumpulan proyek terbaru yang pernah saya kerjakan.
            </p>
          </div>

          {/* Grid Projects */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((r, i) => (
              <div 
                key={i} 
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:bg-slate-800 dark:border-slate-700/60"
              >
                {/* Visual Thumbnail */}
                <div 
                  className="relative h-60 w-full cursor-pointer overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url('${r.img_url}')` }}
                  onClick={() => setSelectedImg({ url: r.img_url, title: r.title })}
                >
                  <span className="absolute top-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    🔍 Zoom
                  </span>
                </div>

                {/* Content Card */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Judul Kartu Proyek Lebih Tebal & Jelas */}
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white capitalize">
                      {r.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                      {r.descriptions}
                    </p>
                  </div>

                  {/* Link Actions */}
                  <div className="mt-6 flex items-center gap-4 text-sm font-bold">
                    {r.url_github && (
                      <a 
                        href={r.url_github} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
                      >
                        GitHub →
                      </a>
                    )}
                    {r.url_demo && (
                      <a 
                        href={r.url_demo} 
                        target="_blank" 
                        rel="noreferrer"
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 transition-colors shadow-md"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Card More Projects */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-md border border-slate-700 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Portfolio</span>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white">More Projects & Repos</h2>
                <p className="mt-3 text-sm font-medium text-slate-200">
                  Lihat daftar lengkap repositori dan eksperimen kode lainnya di halaman utama proyek.
                </p>
              </div>

              <a 
                href="/project" 
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-white/10 py-3 text-center text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-slate-900 border border-white/20"
              >
                Project ++ →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Modal Fullscreen */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-slate-300"
              onClick={() => setSelectedImg(null)}
            >
              ✕
            </button>
            <img 
              src={selectedImg.url} 
              alt={selectedImg.title} 
              className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl"
            />
            <p className="mt-3 text-center text-white text-lg font-bold">{selectedImg.title}</p>
          </div>
        </div>
      )}
    </>
  );
}