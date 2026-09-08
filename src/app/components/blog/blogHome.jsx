import React from 'react';

export default function BlogHome({ api }) {
  const blogs = api?.data?.blog || [];

  return (
    <section className="bg-slate-100/70 py-16 transition-colors duration-300 dark:bg-slate-900">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Articles & News
          </span>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Latest Blog Posts
          </h2>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <p className="mt-4 text-base font-medium text-slate-600 dark:text-slate-300 sm:text-lg">
            Berbagi pemikiran, tutorial, serta wawasan seputar teknologi dan pengembangan aplikasi.
          </p>
        </div>

        {/* Grid Artikel */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((r, i) => (
            <article
              key={r.id || i}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:bg-slate-800 dark:border-slate-700/60"
            >
              {/* Thumbnail Gambar */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
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
                  {/* Tanggal / Penulis */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>{r.postBy?.time || 'Recent'}</span>
                  </div>

                  {/* Judul Artikel */}
                  <a href={`/blog/${r.slug}`} className="mt-2 block">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 line-clamp-2">
                      {r.title}
                    </h3>
                  </a>

                  {/* Deskripsi */}
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                    {r.descriptions}
                  </p>
                </div>

                {/* Link Baca Selengkapnya */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <a
                    href={`/blog/${r.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Read Article <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}