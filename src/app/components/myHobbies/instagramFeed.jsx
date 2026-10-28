import React, { useCallback, useEffect, useRef, useState } from 'react'

export default function InstagramFeed({ api }) {
  const [loaded, setLoaded] = useState({})
  const [active, setActive] = useState(null) // index gambar yang dibuka
  const [modalLoaded, setModalLoaded] = useState(false)

  const items = Array.isArray(api) ? api : null
  const total = items?.length || 0

  const open = (i) => {
    setModalLoaded(false)
    setActive(i)
  }
  const close = () => setActive(null)
  const touch = useRef(null)

  const go = useCallback(
    (dir) => {
      setModalLoaded(false)
      setActive((i) => (i === null ? i : (i + dir + total) % total))
    },
    [total]
  )

  // Keyboard: Esc tutup, panah kiri/kanan pindah gambar. Kunci scroll saat modal terbuka.
  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [active, go])

  // Loading
  if (!items) {
    return (
      <section className="bg-neutral-950 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10 h-8 w-40 animate-pulse rounded-lg bg-white/10" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, n) => (
              <div key={n} className="aspect-square animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const current = active !== null ? items[active] : null

  // Swipe di HP: geser kiri/kanan = pindah foto, geser ke bawah = tutup
  const onTouchStart = (e) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
    else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) close()
  }
  const profileUrl = items.find((r) => r.url_Profile)?.url_Profile

  return (
    <section className="bg-neutral-950 py-20 text-white">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Gallery</h2>
            <p className="mt-2 text-sm text-neutral-400">Potongan momen dari keseharian saya.</p>
          </div>
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-sm font-medium text-pink-400 transition-colors hover:text-pink-300"
            >
              @fkri__17 →
            </a>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {items.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => open(i)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-white/5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              {!loaded[i] && <div className="absolute inset-0 animate-pulse bg-white/10" />}

              <img
                src={r.url_Image}
                alt={r.caption || 'Foto galeri'}
                loading="lazy"
                onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
                className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                  loaded[i] ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Overlay caption saat hover */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <p className="line-clamp-2 text-sm text-white">{r.caption || r.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Tutup"
            className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-lg text-white backdrop-blur transition hover:bg-white/20"
          >
            ✕
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Sebelumnya"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-white/20 sm:left-6 sm:flex"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Berikutnya"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:flex"
              >
                →
              </button>
            </>
          )}

          <figure className="flex max-h-full max-w-5xl flex-col items-center pt-12" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex min-h-[30vh] min-w-[60vw] items-center justify-center sm:min-w-[30vw]">
              {!modalLoaded && <div className="absolute inset-0 animate-pulse rounded-2xl bg-white/10" />}
              <img
                key={active}
                src={current.url_Image}
                alt={current.caption || 'Foto galeri'}
                onLoad={() => setModalLoaded(true)}
                className={`max-h-[78vh] w-auto max-w-full rounded-xl object-contain transition-opacity duration-300 ${
                  modalLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            <figcaption className="mt-4 pb-2 text-center">
              {(current.caption || current.name) && (
                <p className="text-sm text-neutral-200">{current.caption || current.name}</p>
              )}
              <p className="mt-1 text-xs text-neutral-500">
                {active + 1} / {total}
                {current.url_Profile && (
                  <>
                    {' · '}
                    <a
                      href={current.url_Profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300"
                    >
                      Lihat di Instagram
                    </a>
                  </>
                )}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}