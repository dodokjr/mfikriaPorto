import React from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { FaRegCalendarAlt } from 'react-icons/fa';

export default function BlogHome({ api }) {
  const isLoading = !api;
  const blogs = api?.data?.blog || [];

  return (
    <section className="bg-gray-950 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section Minimalis */}
        <div className="mx-auto max-w-xl text-center mb-12">
          <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
            Articles & News
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">
            Latest Blog Posts
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-400">
            Berbagi pemikiran, tutorial, serta wawasan seputar teknologi dan pengembangan aplikasi.
          </p>
        </div>

        {/* Grid Artikel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 p-6 animate-pulse">
                <div className="h-48 w-full bg-gray-800 rounded-2xl mb-6" />
                <div className="h-4 w-1/3 bg-gray-800 rounded-md mb-3" />
                <div className="h-5 w-3/4 bg-gray-800 rounded-md mb-3" />
                <div className="h-3 w-full bg-gray-800 rounded-md mb-2" />
                <div className="h-3 w-2/3 bg-gray-800 rounded-md mb-6" />
                <div className="pt-4 border-t border-gray-800 flex items-center">
                  <div className="h-4 w-24 bg-gray-800 rounded-md" />
                </div>
              </div>
            ))
          ) : (
            blogs.map((r, i) => (
              <article
                key={r.id || i}
                className="group flex flex-col overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 transition-all duration-300 hover:border-gray-700 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Thumbnail Gambar */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-950">
                  <img
                    src={r.img_src}
                    alt={r.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Konten Artikel */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Waktu / Tanggal */}
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-pink-400 mb-2">
                      <FaRegCalendarAlt className="w-3.5 h-3.5" />
                      <span>{r.postBy?.time || 'Recent'}</span>
                    </div>

                    {/* Judul Artikel */}
                    <a href={`/blog/${r.slug}`} className="block">
                      <h3 className="text-lg font-bold tracking-tight text-white transition-colors hover:text-pink-400 line-clamp-2">
                        {r.title}
                      </h3>
                    </a>

                    {/* Deskripsi */}
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {r.descriptions}
                    </p>
                  </div>

                  {/* Link Baca Selengkapnya */}
                  <div className="mt-6 pt-4 border-t border-gray-800/80">
                    <a
                      href={`/blog/${r.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-pink-400 transition-colors group/link"
                    >
                      <span>Read Article</span>
                      <HiArrowRight className="w-4 h-4 text-pink-400 transition-transform group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

      </div>
    </section>
  );
}