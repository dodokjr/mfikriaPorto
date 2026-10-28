import React, { useEffect, useMemo, useState } from 'react'
import { HiRefresh, HiSearch, HiX } from 'react-icons/hi'
import Layout from './layout'
import { BlogCardItem, BlogSkeleton, FeaturedPost } from './components/blog/blogCard'

const BLOG_URL = 'https://api-mfikria.vercel.app/v1/blog'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [query, setQuery] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    fetch(BLOG_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`blog gagal (${res.status})`)
        return res.json()
      })
      .then((body) => {
        setPosts(Array.isArray(body && body.data) ? body.data.filter(Boolean) : [])
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        console.error('Gagal mengambil data blog:', error)
        setStatus('error')
      })

    return () => controller.abort()
  }, [attempt])

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return posts
    return posts.filter((p) => `${p.title || ''} ${p.subtitle || ''} ${p.descriptions || ''}`.toLowerCase().includes(q))
  }, [posts, q])

  // Artikel pertama tampil besar, kecuali saat mencari (hasil pencarian tampil sebagai grid biasa)
  const featured = !q && filtered.length > 0 ? filtered[0] : null
  const gridPosts = featured ? filtered.slice(1) : filtered

  return (
    <Layout>
      <header className="border-b border-gray-800/40 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
                Welcome To My Blog
              </h1>
              <p className="mt-3 text-base text-gray-400">
                Artikel, tips, dan catatan seputar teknologi dan pengembangan aplikasi.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <HiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari artikel"
                aria-label="Cari artikel"
                className="w-full rounded-full border border-gray-800 bg-gray-900 py-2.5 pl-11 pr-10 text-sm text-white placeholder-gray-500 transition focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                >
                  <HiX className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {status === 'loading' && <BlogSkeleton />}

        {status === 'error' && (
          <div className="mx-auto mt-10 max-w-sm text-center">
            <p className="text-lg font-semibold text-white">Artikel tidak bisa dimuat</p>
            <p className="mt-1 text-sm text-gray-400">Periksa koneksi lalu coba lagi.</p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
            >
              <HiRefresh className="h-4 w-4" aria-hidden="true" /> Coba lagi
            </button>
          </div>
        )}

        {status === 'ready' && (
          <>
            <p aria-live="polite" className="mb-6 text-sm text-gray-500">
              {q
                ? `${filtered.length} artikel untuk "${query.trim()}"`
                : `${posts.length} artikel`}
            </p>

            {posts.length === 0 ? (
              <p className="py-16 text-center text-gray-400">Belum ada artikel.</p>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-400">Tidak ada artikel yang cocok dengan "{query.trim()}".</p>
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="mt-3 text-sm font-semibold text-pink-400 hover:text-pink-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                >
                  Tampilkan semua artikel
                </button>
              </div>
            ) : (
              <>
                {featured && <FeaturedPost item={featured} />}

                {gridPosts.length > 0 && (
                  <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${featured ? 'mt-8' : ''}`}>
                    {gridPosts.map((r, i) => (
                      <BlogCardItem key={r.id || r.slug || i} item={r} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </Layout>
  )
}