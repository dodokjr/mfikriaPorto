// Service worker mfikria. Taruh di folder public/ agar terbaca di /sw.js.
// Naikkan versi ini setiap kali ingin memaksa cache lama dibuang.
const CACHE = 'mfikria-v2'
const PRECACHE = ['/', '/manifest.webmanifest']

// Jalur yang tidak boleh masuk cache
const SKIP = (path) => path === '/sw.js' || path === '/register-sw.js' || path.startsWith('/.well-known/') || path.startsWith('/api/')

// Hanya simpan respons yang benar-benar sukses dan berasal dari domain sendiri
const cacheable = (res) => res && res.ok && res.type === 'basic'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // Satu file gagal diambil tidak menggagalkan seluruh instalasi
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  // Hanya tangani GET dari domain sendiri (API dan file musik dari domain lain dibiarkan)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return
  if (SKIP(url.pathname)) return
  // Permintaan audio/video berbentuk range, jangan di-cache
  if (req.headers.has('range')) return
  if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') return

  // Navigasi halaman: ambil dari jaringan dulu, cadangan dari cache saat offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (cacheable(res)) {
            const copy = res.clone()
            caches.open(CACHE).then((cache) => cache.put('/', copy))
          }
          return res
        })
        .catch(() => caches.match('/'))
    )
    return
  }

  // File statis (JS, CSS, gambar): pakai cache dulu, lalu simpan hasil jaringan
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          if (cacheable(res)) {
            const copy = res.clone()
            caches.open(CACHE).then((cache) => cache.put(req, copy))
          }
          return res
        })
    )
  )
})