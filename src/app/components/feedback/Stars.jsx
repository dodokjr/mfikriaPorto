// Simpan di: src/app/components/feedback/Stars.jsx
// Bintang rating (hanya tampil, tidak bisa diklik).

import { HiStar } from 'react-icons/hi';

export default function Stars({ value, size = 'h-4 w-4' }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <HiStar key={n} className={`${size} ${n <= value ? 'text-amber-400' : 'text-gray-700'}`} />
      ))}
    </span>
  );
}