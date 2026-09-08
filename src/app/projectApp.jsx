import React, { useEffect, useState } from 'react';
import Layout from "./layout";
import GitHubCalendar from 'react-github-calendar';
import CardRepos from './components/project/cardRepos';

export default function ProjectApp() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api-mfikria.vercel.app/v2/github/dodokjr/repos")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data dari API");
        return res.json();
      })
      .then((body) => {
        if (body.message) {
          setError(body.message);
        } else {
          setData(body);
        }
      })
      .catch((err) => {
        console.error("API tidak merespons, silakan hubungi: ffikri604@gmail.com", err);
        setError("API server sedang tidak merespons.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Palet warna cerah (Hijau Neon GitHub Standard)
  const themeInput = {
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            GitHub Activity & Projects
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Ringkasan kontribusi dan repositori publik di GitHub.
          </p>
        </div>

        {/* GitHub Calendar Section */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-slate-200 mb-6 text-center">
            Kontribusi GitHub
          </h2>
          <div className="flex justify-center overflow-x-auto pb-2">
            <GitHubCalendar 
              username="dodokjr" 
              blockMargin={4} 
              blockSize={14} 
              blockRadius={4} 
              theme={themeInput} 
              colorScheme="dark"
              fontSize={13} 
              showWeekdayLabels
            />
          </div>
        </section>

        {/* Stats & Analytics Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-200 text-center">
            Statistik & Aktivitas
          </h2>
          
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex items-center justify-center hover:border-slate-700 transition">
              <img 
                className="w-full h-auto object-contain max-h-52" 
                src="https://github-readme-streak-stats.herokuapp.com?user=dodokjr&theme=tokyonight&hide_border=true&border_radius=8&mode=weekly" 
                alt="dodokjr GitHub streak"
                loading="lazy"
              />
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex items-center justify-center hover:border-slate-700 transition">
              <img 
                className="w-full h-auto object-contain max-h-52" 
                src="http://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=dodokjr&theme=aura" 
                alt="Dodokjr GitHub Contribution"
                loading="lazy"
              />
            </div>
          </div>

          {/* Top Languages */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex justify-center hover:border-slate-700 transition">
            <img 
              className="w-full max-w-md h-auto object-contain" 
              src="https://denvercoder1-github-readme-stats.vercel.app/api/top-langs/?username=dodokjr&langs_count=8&layout=compact&theme=react&border_color=00083B&bg_color=00083B&title_color=DAD0FE&icon_color=F5E572" 
              alt="Dodokjr Top Languages"
              loading="lazy"
            />
          </div>

          {/* Activity Graph */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex justify-center hover:border-slate-700 transition">
            <img 
              className="w-full h-auto object-contain" 
              src="https://github-readme-activity-graph.vercel.app/graph?username=dodokjr&custom_title=Dodokjr%27s%20GitHub%20Activity%20Graph&bg_color=00083B&color=6E49F5&line=6E49F5&point=6E49F5&area_color=0000&title_color=DAD0FE&area=true" 
              alt="Dodokjr GitHub Activity Graph"
              loading="lazy"
            />
          </div>
        </section>

        {/* Repositories Section */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <h2 className="text-2xl font-bold text-white">
              Repositori Pilihan
            </h2>
            <span className="text-xs text-slate-400">
              Data langsung dari GitHub API
            </span>
          </div>

          {/* State Handling (Loading / Error / Content) */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm">Memuat repositori...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-rose-400 font-medium mb-3">Terjadi kendala saat memuat data repositori.</p>
              <a 
                href="mailto:ffikri604@gmail.com" 
                className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Hubungi Pengembang (ffikri604@gmail.com)
              </a>
            </div>
          ) : (
            <CardRepos api={data} />
          )}
        </section>

      </div>
    </Layout>
  );
}