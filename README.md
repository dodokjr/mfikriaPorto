<div align="center">

# 🎧 My Hobbies

Website pribadi untuk memamerkan hobi, dengan **pemutar musik** interaktif sebagai fitur utamanya.

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-pink)

[Demo](#) · [Laporkan Bug](../../issues) · [Request Fitur](../../issues)

</div>

---

## 📸 Tampilan

> Letakkan screenshot di folder `docs/` lalu ganti path di bawah.

<div align="center">
  <img src="docs/screenshot-music.png" alt="Tampilan pemutar musik" width="760" />
</div>

## ✨ Fitur

**Pemutar musik**

- 🎵 Daftar putar diambil langsung dari API
- ⏯️ Putar, jeda, lagu berikutnya / sebelumnya (tekan "sebelumnya" setelah 3 detik untuk mengulang lagu)
- 🔀 Acak (shuffle) dan 🔁 ulangi lagu (loop)
- 🎚️ Seek bar dan pengatur volume dengan tombol bisu
- 😴 **Timer tidur**: musik berhenti otomatis dengan volume memudar pelan-pelan
  - Pilihan 15, 30, 45, 60, dan 90 menit, atau "akhir lagu ini"
- 💿 Animasi piringan hitam dan equalizer saat lagu diputar
- 🖼️ Tampilan cover bisa diganti (cover / contain / fill)
- 📱 Media Session API: kontrol lagu dari lock screen dan notifikasi
- ♿ Aksesibel: label ARIA, fokus keyboard, dan dukungan `prefers-reduced-motion`
- 🛟 Penanganan state loading, error, dan daftar kosong

## 🧰 Teknologi

| Kategori | Teknologi |
| --- | --- |
| Framework | [React](https://react.dev/) |
| Build tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Ikon | [React Icons](https://react-icons.github.io/react-icons/) (Ionicons 5) |
| Linting | ESLint |

## 🚀 Memulai

### Prasyarat

- [Node.js](https://nodejs.org/) 18 atau lebih baru
- npm, pnpm, atau yarn

### Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/dodokjr/mfikriaPorto.git
cd <nama-repo>

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka `http://localhost:5173` di browser.

### Perintah yang tersedia

| Perintah | Fungsi |
| --- | --- |
| `npm start` | Menjalankan server pengembangan dengan HMR |
| `npm run build` | Membuat build produksi ke folder `dist/` |
| `npm run preview` | Melihat hasil build produksi secara lokal |
| `npm run lint` | Memeriksa kode dengan ESLint |

## 🔌 Sumber Data

Daftar lagu diambil dari endpoint berikut:

```
GET https://api-mfikria.vercel.app/mfikria/myhobbies/music
```

Format respons yang dibaca aplikasi:

```json
{
  "assets_data": {
    "music": [
      {
        "songName": "Judul lagu",
        "songArtist": "Nama artis",
        "songAvatar": "https://.../cover.jpg",
        "songSrc": "https://.../lagu.mp3"
      }
    ]
  }
}
```

Lagu tanpa `songSrc` otomatis diabaikan. Alamat API bisa diubah lewat konstanta `API_URL` di `src/.../Music.jsx`.

## 🗂️ Struktur Proyek

```
.
├── public/
├── src/
│   ├── components/
│   │   └── Music.jsx      # Pemutar musik + timer tidur
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

> Sesuaikan struktur di atas dengan folder proyekmu.

## ⚙️ Konfigurasi Cepat

Beberapa nilai bisa diubah langsung di bagian atas `Music.jsx`:

| Konstanta | Fungsi |
| --- | --- |
| `API_URL` | Alamat API daftar lagu |
| `PLAYLIST_NAME` | Nama daftar putar yang tampil di kartu |
| `SLEEP_OPTIONS` | Pilihan durasi timer tidur |
| `FADE_MS` | Lama volume memudar sebelum musik berhenti |
| `RESTART_AFTER` | Batas detik tombol "sebelumnya" mengulang lagu |

## 🤝 Kontribusi

Kontribusi sangat diterima.

1. Fork repositori ini
2. Buat branch fitur: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m "Tambah nama-fitur"`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buka Pull Request

## 📄 Lisensi

Dirilis di bawah lisensi [MIT](LICENSE).

## 👤 Kontak

**M. Fikria**

- GitHub: [@username](https://github.com/username)

---

<div align="center">
  Dibuat dengan ❤️ dan banyak lagu.
</div>