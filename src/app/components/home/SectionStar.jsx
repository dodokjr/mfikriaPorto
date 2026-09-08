import React from 'react';
import { useNavigate } from 'react-router-dom';

const STATS_DATA = [
  { value: '10+', label: 'Projects Completed' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '2+', label: 'Years Experience' },
  { value: '99.9%', label: 'Service Uptime', isLive: true },
];

export default function SectionStar() {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-900 px-6 py-20 transition-colors duration-300">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        
        {/* Bagian Teks & Call to Action */}
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 border border-indigo-500/20">
            Services & Expertise
          </span>
          
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Full-Stack & Mobile Development Solutions
          </h2>
          
          <p className="text-base font-medium leading-relaxed text-slate-300 sm:text-lg">
            Saya menerima proyek pengembangan aplikasi web dan mobile secara *end-to-end*. Berfokus pada performa tinggi, desain responsif, dan arsitektur kode yang bersih.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate('/project')}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-indigo-500 hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              Lihat Semua Proyek →
            </button>
          </div>
        </div>

        {/* Grid Statistik Modern */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {STATS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-800"
            >
              {/* Efek Glow Tipis saat Hover */}
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl transition-all duration-300 group-hover:bg-indigo-500/20" />

              <h3 className="text-3xl font-black tracking-tight text-indigo-400 sm:text-4xl lg:text-5xl">
                {item.value}
              </h3>
              
              <div className="mt-3 flex items-center gap-2">
                {item.isLive && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                )}
                <p className="text-xs font-semibold text-slate-400 sm:text-sm">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}