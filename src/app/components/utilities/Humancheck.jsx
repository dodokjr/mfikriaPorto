// Simpan di: src/app/components/common/HumanCheck.jsx
// Captcha "Saya bukan robot" buatan sendiri (tanpa layanan pihak ketiga).
// Dipakai oleh Contact.jsx dan FeedbackForm.jsx.

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { HiCheck, HiExclamationCircle, HiRefresh, HiShieldCheck } from 'react-icons/hi';

const CAPTCHA_LEN = 5;
// Tanpa karakter yang mirip (I, O, 0, 1) agar mudah dibaca
const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const rand = (min, max) => Math.random() * (max - min) + min;

function makeCode() {
  const arr = new Uint32Array(CAPTCHA_LEN);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => CAPTCHA_CHARS[n % CAPTCHA_CHARS.length]).join('');
}

// Menggambar kode di canvas lengkap dengan noise supaya sulit dibaca OCR sederhana
function drawCaptcha(canvas, code) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width: w, height: h } = canvas;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0b0f1a';
  ctx.fillRect(0, 0, w, h);

  // Titik acak
  for (let i = 0; i < 70; i += 1) {
    ctx.fillStyle = `rgba(${rand(120, 255)}, ${rand(80, 200)}, ${rand(150, 255)}, ${rand(0.15, 0.5)})`;
    ctx.beginPath();
    ctx.arc(rand(0, w), rand(0, h), rand(0.6, 1.8), 0, Math.PI * 2);
    ctx.fill();
  }

  // Garis di belakang teks
  for (let i = 0; i < 4; i += 1) {
    ctx.strokeStyle = `rgba(${rand(150, 255)}, ${rand(80, 160)}, ${rand(180, 255)}, 0.35)`;
    ctx.lineWidth = rand(1, 2);
    ctx.beginPath();
    ctx.moveTo(rand(0, w), rand(0, h));
    ctx.bezierCurveTo(rand(0, w), rand(0, h), rand(0, w), rand(0, h), rand(0, w), rand(0, h));
    ctx.stroke();
  }

  // Karakter: tiap huruf punya rotasi, ukuran, dan warna berbeda
  const slot = (w - 24) / CAPTCHA_LEN;
  code.split('').forEach((ch, i) => {
    ctx.save();
    ctx.translate(18 + i * slot + rand(-2, 2), h / 2 + rand(-6, 6));
    ctx.rotate(rand(-0.45, 0.45));
    ctx.font = `bold ${Math.round(rand(26, 33))}px monospace`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `hsl(${Math.round(rand(300, 345))}, 85%, ${Math.round(rand(68, 82))}%)`;
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  // Garis di atas teks
  for (let i = 0; i < 3; i += 1) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${rand(0.15, 0.35)})`;
    ctx.lineWidth = rand(1, 1.8);
    ctx.beginPath();
    ctx.moveTo(rand(0, w * 0.3), rand(0, h));
    ctx.lineTo(rand(w * 0.7, w), rand(0, h));
    ctx.stroke();
  }
}

// Kotak centang "Saya bukan robot": klik -> muncul tantangan -> ketik kode
const HumanCheck = forwardRef(function HumanCheck({ verified, onVerify, error }, ref) {
  const canvasRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);

  const refresh = useCallback(() => {
    setCode(makeCode());
    setInput('');
    setWrong(false);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        setOpen(false);
        setCode('');
        setInput('');
        setWrong(false);
      },
    }),
    []
  );

  useEffect(() => {
    if (open && code && canvasRef.current) drawCaptcha(canvasRef.current, code);
  }, [open, code]);

  const toggle = () => {
    if (verified) return;
    if (open) {
      setOpen(false);
      return;
    }
    refresh();
    setOpen(true);
  };

  const handleInput = (e) => {
    const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CAPTCHA_LEN);
    setInput(v);
    setWrong(false);
    if (v.length !== CAPTCHA_LEN) return;

    if (v === code) {
      setOpen(false);
      onVerify();
    } else {
      // Jawaban salah -> kode diganti baru
      setCode(makeCode());
      setInput('');
      setWrong(true);
    }
  };

  return (
    <div>
      <div
        className={`rounded-2xl border bg-gray-950/70 p-3.5 transition-colors duration-200 ${
          error ? 'border-pink-500/80' : verified ? 'border-emerald-500/40' : 'border-white/10'
        }`}
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={verified}
          onClick={toggle}
          className="flex w-full items-center gap-3 text-left"
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-white transition-all duration-200 ${
              verified
                ? 'border-emerald-500 bg-emerald-500'
                : open
                ? 'border-pink-500'
                : 'border-gray-500 hover:border-pink-400'
            }`}
          >
            {verified && <HiCheck className="h-4 w-4" />}
          </span>
          <span className="text-xs font-medium text-gray-300">Saya bukan robot</span>
          <HiShieldCheck
            aria-hidden="true"
            className={`ml-auto h-5 w-5 ${verified ? 'text-emerald-500' : 'text-gray-600'}`}
          />
        </button>

        {open && !verified && (
          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="flex items-center gap-2">
              <canvas
                ref={canvasRef}
                width={200}
                height={56}
                role="img"
                aria-label="Gambar kode verifikasi"
                className="select-none rounded-xl border border-white/10"
              />
              <button
                type="button"
                onClick={refresh}
                aria-label="Ganti gambar"
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-gray-300 transition-colors hover:border-pink-500/40 hover:text-pink-400"
              >
                <HiRefresh className="h-4 w-4" />
              </button>
            </div>

            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={CAPTCHA_LEN}
              value={input}
              onChange={handleInput}
              placeholder="Ketik karakter pada gambar"
              aria-label="Ketik karakter pada gambar"
              className={`mt-3 w-full rounded-xl border bg-gray-950 px-4 py-2.5 text-xs uppercase tracking-[0.3em] text-white placeholder-gray-600 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-4 ${
                wrong
                  ? 'border-pink-500/80 focus:ring-pink-500/15'
                  : 'border-white/10 focus:border-pink-500 focus:ring-pink-500/15'
              }`}
            />
            {wrong && (
              <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-pink-500">
                <HiExclamationCircle className="h-3.5 w-3.5" /> Kode salah, silakan coba lagi
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-pink-500">
          <HiExclamationCircle className="h-3.5 w-3.5" /> {error}
        </span>
      )}
    </div>
  );
});

export default HumanCheck;