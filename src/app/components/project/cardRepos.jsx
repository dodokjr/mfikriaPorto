import React from 'react';
import { format } from 'date-fns';
import { FaGithub, FaCodeFork } from 'react-icons/fa6';
import { FaStar, FaEye, FaFileCode, FaCode, FaExternalLinkAlt } from "react-icons/fa";

export default function CardRepos({ api }) {
  if (!Array.isArray(api) || api.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        Tidak ada repositori untuk ditampilkan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {api.map((r) => {
        const formattedSize = r.size > 1024 
          ? `${(r.size / 1024).toFixed(1)} MB` 
          : `${r.size} KB`;

        return (
          <div 
            key={r.id} 
            className="group flex flex-col justify-between bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          >
            {/* Header & Body */}
            <div className="space-y-4">
              {/* Owner Avatar & Title */}
              <div className="flex items-center gap-3">
                <img 
                  src={r.owner?.avatar_url} 
                  alt={r.owner?.login || 'Owner Avatar'} 
                  className="w-10 h-10 rounded-full border border-slate-700"
                  loading="lazy"
                />
                <h3 className="font-bold text-lg text-slate-100 group-hover:text-sky-400 transition-colors truncate">
                  {r.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">
                {r.description || "Tidak ada deskripsi tersedia."}
              </p>

              {/* Badges / Metrics */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-amber-400 border border-slate-700/50">
                  <FaStar size={12} /> {r.stargazers_count}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-sky-400 border border-slate-700/50">
                  <FaEye size={12} /> {r.watchers_count}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-emerald-400 border border-slate-700/50">
                  <FaCodeFork size={12} /> {r.forks_count}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50">
                  <FaFileCode size={12} /> {formattedSize}
                </span>
                {r.language && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-purple-400 border border-slate-700/50">
                    <FaCode size={12} /> {r.language}
                  </span>
                )}
              </div>
            </div>

            {/* Footer Section */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-4">
              {/* Dates */}
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <p>Dibuat: {r.created_at ? format(new Date(r.created_at), "dd MMM yyyy") : '-'}</p>
                <p>Diperbarui: {r.updated_at ? format(new Date(r.updated_at), "dd MMM yyyy") : '-'}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href={r.svn_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
                  >
                    <FaGithub size={13} /> GitHub
                  </a>
                  <a 
                    href={`/project/${r.name}`} 
                    className="flex items-center justify-center px-3 py-2 text-xs font-semibold text-sky-400 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/50 rounded-lg transition truncate"
                  >
                    Detail
                  </a>
                </div>

                {r.homepage && (
                  <a 
                    href={r.homepage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-800/40 rounded-lg transition"
                  >
                    <FaExternalLinkAlt size={11} /> Live Website
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}