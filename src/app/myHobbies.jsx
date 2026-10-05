import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import Layout from './layout'
import Benner from './components/myHobbies/benner'
import InstagramFeed from './components/myHobbies/instagramFeed'
import { IoReload } from 'react-icons/io5'

// Bagian di bawah layar dimuat belakangan (code splitting), jadi halaman terbuka lebih cepat
const Music = lazy(() => import('./components/myHobbies/music'))
const Games = lazy(() => import('./components/myHobbies/Games'))
const GamesTwo = lazy(() => import('./components/myHobbies/GameTwo'))
const GamesThree = lazy(() => import('./components/myHobbies/GamesThree.jsx'))
const GamesFour = lazy(() => import('./components/myHobbies/GamesFour.jsx'))
const GamesFive = lazy(() => import('./components/myHobbies/GamesFive.jsx'))
const GamesSix = lazy(() => import('./components/myHobbies/GameSix.jsx'))

const GAMES = [
  { key: 'one', Component: Games },
  { key: 'two', Component: GamesTwo },
  { key: 'three', Component: GamesThree },
  { key: 'four', Component: GamesFour },
  { key: 'five', Component: GamesFive },
  { key: 'six', Component: GamesSix },
]

const API_URL = 'https://api-mfikria.vercel.app/mfikria/c/ig'

const Sk = ({ className = '', style }) => <div aria-hidden="true" style={style} className={`hob-sk ${className}`} />

// Kerangka blok yang bergerak (kilau) selama komponen lazy sedang diunduh
function BlockSkeleton({ minHeight }) {
  return <Sk className="w-full rounded-3xl" style={{ minHeight }} />
}

// Kerangka Instagram: kotak-kotak foto + judul
function IgSkeleton() {
  return (
    <section aria-busy="true" className="px-4 py-16">
      <span role="status" className="sr-only">Memuat hobi…</span>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 flex max-w-xl flex-col items-center gap-3">
          <Sk className="h-6 w-28 rounded-full" />
          <Sk className="h-9 w-2/3 rounded-lg" />
          <Sk className="h-3 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Sk key={i} className="aspect-square w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  )
}

function IgError({ onRetry }) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
        <h2 className="text-sm font-bold text-white">Foto Instagram belum bisa dimuat</h2>
        <p className="mt-1 text-xs text-gray-400">Periksa koneksi Anda lalu coba lagi.</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-pink-600/25 transition-all hover:bg-pink-500 active:scale-95"
        >
          <IoReload className="h-4 w-4" />
          Coba Lagi
        </button>
      </div>
    </section>
  )
}

// Komponen baru dirender saat hampir terlihat di layar, dan tetap terpasang setelahnya.
// Sebelum itu hanya ada kotak kosong ber-tinggi tetap (tanpa animasi) supaya ringan.
function LazyMount({ children, minHeight = 320, rootMargin = '400px 0px' }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (show) return undefined
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setShow(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [show, rootMargin])

  return (
    <div ref={ref}>
      {show ? (
        <Suspense fallback={<BlockSkeleton minHeight={minHeight} />}>
          <div className="hob-in">{children}</div>
        </Suspense>
      ) : (
        <div style={{ minHeight }} className="rounded-3xl border border-white/5 bg-white/[0.02]" />
      )}
    </div>
  )
}

export default function MyHobbies() {
  const [status, setStatus] = useState('loading') // loading | success | error
  const [dataIg, setDataIg] = useState([])
  const ctrlRef = useRef(null)

  const fetchData = useCallback(async () => {
    ctrlRef.current?.abort()
    const ctrl = new AbortController()
    ctrlRef.current = ctrl
    setStatus('loading')

    try {
      const res = await fetch(API_URL, { signal: ctrl.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setDataIg(Array.isArray(json?.data) ? json.data : [])
      setStatus('success')
    } catch (error) {
      if (error.name === 'AbortError') return
      console.error('Data failed to fetch', error)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchData()
    return () => ctrlRef.current?.abort()
  }, [fetchData])

  return (
    <Layout>
      <style>{`
        .hob-sk {
          background: linear-gradient(100deg, #1f2937 30%, #374151 50%, #1f2937 70%);
          background-size: 200% 100%;
          animation: hob-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes hob-shimmer {
          0% { background-position: 150% 0; }
          100% { background-position: -50% 0; }
        }
        .hob-in { animation: hob-in 600ms cubic-bezier(.2,.9,.3,1) both; }
        @keyframes hob-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hob-sk, .hob-in { animation: none; }
        }
      `}</style>

      {/* Layout sudah menyediakan <main>, jadi di sini cukup pembungkus biasa */}
      <div>
        {/* Banner langsung tampil, tidak menunggu data Instagram */}
        <Benner />

        {status === 'loading' && <IgSkeleton />}
        {status === 'error' && <IgError onRetry={fetchData} />}
        {status === 'success' && <InstagramFeed api={dataIg} />}

        <LazyMount minHeight={360}>
          <Music />
        </LazyMount>

        <section className="px-4 py-16">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink-500">
              Mini Games
            </span>
            <h2 className="mt-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
              Waktunya Bermain
            </h2>
            <p className="mt-2 text-xs text-gray-400 sm:text-sm">
              Beberapa mini game yang saya buat untuk mengisi waktu luang.
            </p>
          </div>

          <div className="mx-auto max-w-xl space-y-8">
            {GAMES.map(({ key, Component }) => (
              <LazyMount key={key} minHeight={280}>
                <Component />
              </LazyMount>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}