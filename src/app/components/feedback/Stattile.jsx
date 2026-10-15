// Simpan di: src/app/components/feedback/StatTile.jsx
// Kotak ringkasan angka. Isi bisa lewat `value` atau `children`.

export default function StatTile({ label, value, children }) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-3">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xl font-bold text-white">{children || value}</p>
      </div>
    );
  }