import React, { useEffect, useState } from 'react'
import Layout from './layout'
import BlogCard from './components/blog/blogCard'

export default function Blog() {
  // Ubah inisialisasi awal menjadi null agar pengecekan loading akurat
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const api = await fetch("https://api-mfikria.vercel.app/mfikria/c/blog")
      const res = await api.json()
      setData(res)
    } catch (error) {
      console.error("Gagal mengambil data blog:", error)
    }
  }

  // Tampilan Loading (Skeleton) yang lebih rapi dan simetris di tengah
  if (!data) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex w-full max-w-md flex-col gap-4 p-4">
            <div className="skeleton h-32 w-full rounded-xl"></div>
            <div className="skeleton h-6 w-1/3 rounded-lg"></div>
            <div className="skeleton h-4 w-full rounded-lg"></div>
            <div className="skeleton h-4 w-2/3 rounded-lg"></div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Header Minimalis & Modern */}
      <header className="border-b border-gray-800/40 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            
            {/* Judul & Deskripsi */}
            <div className="max-w-2xl">
              <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase">
                Eksplorasi & Cerita
              </span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Welcome To My Blog
              </h1>
              <p className="mt-2 text-base text-gray-400">
                Temukan berbagai artikel menarik, tips, dan pemikiran terbaru di sini. 🎉
              </p>
            </div>

            {/* Quick Navigation / Pills (Opsional jika ingin tetap ditampilkan secara minimalis) */}
            <div className="flex flex-wrap items-center gap-2">
              {data.data && data.data.map((r, i) => (
                <a
                  key={i}
                  href={`blog/${r.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-300 bg-gray-900 border border-gray-800 rounded-full transition-all duration-200 hover:border-pink-500 hover:text-white hover:bg-pink-500/10"
                >
                  <span>Blog #{r.id}</span>
                </a>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* Konten Utama Blog Card */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <BlogCard api={data} />
      </main>
    </Layout>
  )
}