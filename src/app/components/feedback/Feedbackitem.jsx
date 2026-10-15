// Simpan di: src/app/components/feedback/FeedbackItem.jsx
// Satu komentar saran / kritik.

import Stars from './Stars';
import { TYPES } from '../../../libs/Feedbackconfig';

export default function FeedbackItem({ item }) {
  const type = TYPES[item.tipe] || TYPES.lainnya;
  const initial = (item.nama || '?').trim().charAt(0).toUpperCase();
  return (
    <article className="flex gap-3 rounded-2xl border border-gray-800 bg-gray-900/50 p-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${type.avatar}`}>
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="max-w-full truncate text-sm font-semibold text-white">{item.nama}</h3>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${type.chip}`}>
            <type.Icon className="h-3 w-3" />
            {type.label}
          </span>
          {item.rating ? <Stars value={item.rating} size="h-3.5 w-3.5" /> : null}
        </div>
        {/* React otomatis meng-escape teks, aman dari XSS. whitespace-pre-wrap menjaga baris baru. */}
        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-300">{item.pesan}</p>
        <p className="mt-2 text-xs text-gray-500">
          {item.tanggal}
          {item.pukul && ` • ${item.pukul} WIB`}
        </p>
      </div>
    </article>
  );
}