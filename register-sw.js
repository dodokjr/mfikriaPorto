// Mendaftarkan service worker. Taruh di folder public/ bersama sw.js.
// Dilewati di localhost supaya cache tidak mengganggu saat development.
if ('serviceWorker' in navigator) {
    var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    if (!isLocal) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {})
      })
    }
  }