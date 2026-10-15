// Simpan di: src/app/components/feedback/StarPicker.jsx
// Pemilih rating 1-5 bintang. Klik bintang yang sama lagi = hapus rating.

import { useState } from 'react';
import { HiStar } from 'react-icons/hi';

export default function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(value === n ? 0 : n)}
          aria-label={`Beri ${n} bintang`}
          aria-pressed={value === n}
          className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <HiStar className={`h-7 w-7 ${n <= shown ? 'text-amber-400' : 'text-gray-700'}`} />
        </button>
      ))}
      <span className="ml-2 text-xs text-gray-500">{value ? `${value}/5` : 'Opsional'}</span>
    </div>
  );
}