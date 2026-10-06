// Satu file untuk dua peran. Taruh di folder public/ agar terbaca di /sw.js.
//  - Dimuat sebagai <script> di halaman  -> mendaftarkan dirinya sendiri sebagai service worker.
//  - Dijalankan sebagai service worker   -> mengurus cache dan mode offline.
(function () {
  'use strict'

  // ---------------------------------------------------------------
  // 1) Dijalankan di dalam service worker
  // ---------------------------------------------------------------
  if (typeof ServiceWorkerGlobalScope !== 'undefined' && self instanceof ServiceWorkerGlobalScope) {
    // Naikkan versi ini setiap kali ingin memaksa cache lama dibuang
    var CACHE = 'mfikria-v3'
    var PRECACHE = ['/', '/manifest.webmanifest']

    // Jalur yang tidak boleh masuk cache
    var skip = function (path) {
      return path === '/sw.js' || path.indexOf('/.well-known/') === 0 || path.indexOf('/api/') === 0
    }

    // Hanya simpan respons yang benar-benar sukses dan berasal dari domain sendiri
    var cacheable = function (res) {
      return res && res.ok && res.type === 'basic'
    }

    self.addEventListener('install', function (event) {
      event.waitUntil(
        caches
          .open(CACHE)
          // Satu file gagal diambil tidak menggagalkan seluruh instalasi
          .then(function (cache) {
            return Promise.allSettled(PRECACHE.map(function (url) { return cache.add(url) }))
          })
          .then(function () { return self.skipWaiting() })
      )
    })

    self.addEventListener('activate', function (event) {
      event.waitUntil(
        caches
          .keys()
          .then(function (keys) {
            return Promise.all(keys.filter(function (k) { return k !== CACHE }).map(function (k) { return caches.delete(k) }))
          })
          .then(function () { return self.clients.claim() })
      )
    })

    self.addEventListener('fetch', function (event) {
      var req = event.request
      var url = new URL(req.url)

      // Hanya tangani GET dari domain sendiri (API dan file musik dari domain lain dibiarkan)
      if (req.method !== 'GET' || url.origin !== self.location.origin) return
      if (skip(url.pathname)) return
      // Permintaan audio/video berbentuk range, jangan di-cache
      if (req.headers.has('range')) return
      if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') return

      // Navigasi halaman: ambil dari jaringan dulu, cadangan dari cache saat offline
      if (req.mode === 'navigate') {
        event.respondWith(
          fetch(req)
            .then(function (res) {
              if (cacheable(res)) {
                var copy = res.clone()
                caches.open(CACHE).then(function (cache) { cache.put('/', copy) })
              }
              return res
            })
            .catch(function () { return caches.match('/') })
        )
        return
      }

      // File statis (JS, CSS, gambar): pakai cache dulu, lalu simpan hasil jaringan
      event.respondWith(
        caches.match(req).then(function (cached) {
          return (
            cached ||
            fetch(req).then(function (res) {
              if (cacheable(res)) {
                var copy = res.clone()
                caches.open(CACHE).then(function (cache) { cache.put(req, copy) })
              }
              return res
            })
          )
        })
      )
    })

    return
  }

  // ---------------------------------------------------------------
  // 2) Dijalankan di halaman (lewat <script src="/sw.js" defer>)
  // ---------------------------------------------------------------
  // Dilewati di localhost supaya cache tidak mengganggu saat development.
  var isLocal = location.hostname === 'https://mfikria.vercel.app' || location.hostname === ''
  if ('serviceWorker' in navigator && !isLocal) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {})
    })
  }
})()