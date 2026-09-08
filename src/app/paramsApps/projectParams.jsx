import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import Layout from '../layout'
import NotFound from '../notFound'
import { FaGithub, FaCodeBranch, FaStar, FaEye, FaCalendarAlt } from 'react-icons/fa'

export const ProjectParams = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [events, setEvents] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resRepo, resEvents] = await Promise.all([
          fetch(`https://api.github.com/repos/dodokjr/${id}`),
          fetch(`https://api.github.com/repos/dodokjr/${id}/events`)
        ])
        
        const repoBody = await resRepo.json()
        const eventsBody = await resEvents.json()

        setData(repoBody)
        setEvents(eventsBody)
      } catch (error) {
        console.error("Gagal mengambil data GitHub:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex w-full max-w-2xl flex-col gap-6 p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="skeleton h-24 w-24 rounded-full"></div>
              <div className="skeleton h-6 w-48 rounded-md"></div>
              <div className="skeleton h-4 w-72 rounded-md"></div>
            </div>
            <div className="skeleton h-64 w-full rounded-2xl"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (data?.message || events?.message || !data) {
    return <NotFound />
  }

  return (
    <Layout>
      <main className="min-h-screen bg-gray-950 text-gray-100 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Profil & Repositori */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
              <img 
                src={data.owner?.avatar_url || "https://avatars.githubusercontent.com/u/67883705?v=4"} 
                alt="Owner Avatar" 
                className="w-24 h-24 rounded-full object-cover border-2 border-pink-500/50 shadow-xl shadow-pink-500/10"
              />
              <span className="absolute bottom-0 right-0 p-1.5 bg-gray-900 border border-gray-800 rounded-full text-pink-500">
                <FaGithub size={16} />
              </span>
            </div>

            <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase mb-1">
              Repositori GitHub
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {data.name}
            </h1>
            
            {data.description && (
              <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-xl">
                {data.description}
              </p>
            )}

            {/* Tombol Tautan Repositori Asli */}
            <div className="mt-6">
              <a 
                target="_blank" 
                rel="noopener noreferrer" 
                href={data.html_url} 
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gray-900 border border-gray-800 rounded-full transition-all duration-200 hover:border-pink-500 hover:bg-pink-500/10"
              >
                <FaGithub size={14} />
                <span>Lihat di GitHub ({data.full_name})</span>
              </a>
            </div>
          </div>

          {/* Statistik Ringkas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-pink-500 mb-1">
                <FaStar size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Stars</span>
              </div>
              <span className="text-xl font-bold text-white">{data.stargazers_count ?? 0}</span>
            </div>
            <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-pink-500 mb-1">
                <FaCodeBranch size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Forks</span>
              </div>
              <span className="text-xl font-bold text-white">{data.forks_count ?? 0}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-pink-500 mb-1">
                <FaEye size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Watchers</span>
              </div>
              <span className="text-xl font-bold text-white">{data.watchers_count ?? 0}</span>
            </div>
          </div>

          {/* Tabel Riwayat Aktivitas (Events) */}
          <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-800/80 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">Aktivitas Terbaru</h2>
              <span className="text-xs text-gray-500">Log Aktivitas Repositori</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-900/80 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">#</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Repositori</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Tipe Aktivitas</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {Array.isArray(events) && events.length > 0 ? (
                    events.map((r, i) => (
                      <tr key={r.id || i} className="hover:bg-gray-900/60 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-500">{i + 1}</td>
                        <td className="px-6 py-4 font-medium text-white">{r.repo?.name || data.full_name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20">
                            {r.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs flex items-center gap-1.5 pt-5">
                          <FaCalendarAlt size={12} className="text-gray-500" />
                          {r.created_at ? format(new Date(r.created_at), "dd MMMM yyyy") : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                        Tidak ada aktivitas terbaru untuk repositori ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </Layout>
  )
}