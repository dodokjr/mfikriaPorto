import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import emailjs from '@emailjs/browser';
import { FaLocationDot, FaPhone, FaXTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import {
  HiCheck,
  HiCheckCircle,
  HiExclamationCircle,
  HiArrowRight,
  HiRefresh,
  HiShieldCheck,
  HiUser,
  HiMail,
  HiChatAlt2,
} from 'react-icons/hi';
import Alert from './Alert';

const TOAST_MS = 5000;
const MESSAGE_MAX = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 3000; // form yang dikirim lebih cepat dari ini dianggap bot

const ADDRESS = 'Sendang Mulyo, Tembalang, Semarang City, Central Java 50272';

const CONTACTS = [
  {
    icon: FaLocationDot,
    label: 'Lokasi',
    value: ADDRESS,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`,
    external: true,
  },
  { icon: FaPhone, label: 'Telepon', value: '(+62) 8572-7738-629', href: 'tel:+6285727738629' },
  { icon: IoMail, label: 'Email', value: 'ffikri604@gmail.com', href: 'mailto:ffikri604@gmail.com' },
];

const SOCIALS = [
  { icon: FaXTwitter, label: 'X (Twitter)', href: 'https://x.com/bintangFikri3' },
  { icon: FaLinkedinIn, label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-fikri-ardiyansah-952752194/' },
  { icon: FaFacebookF, label: 'Facebook', href: 'https://fb.com/muhammad.f.ardiyansah.16/' },
  { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/fkri.ardn/?hl=en' },
];

/* ------------------------------------------------------------------ */
/* Captcha buatan sendiri (tanpa layanan pihak ketiga)                  */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */

// Kartu kaca dengan cahaya lembut yang mengikuti kursor (hanya untuk mouse)
function GlassCard({ className = '', children, style }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - box.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - box.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      style={style}
      className={`group/card relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(236,72,153,0.10), transparent 60%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function Field({ id, label, icon: Icon, error, extra, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs font-semibold text-gray-300">
          {label}
        </label>
        {error ? (
          <span id={`${id}-error`} className="flex items-center gap-1 text-[10px] font-bold text-pink-500">
            <HiExclamationCircle className="h-3.5 w-3.5" /> {error}
          </span>
        ) : (
          extra
        )}
      </div>
      <div className="group/field relative">
        <Icon
          aria-hidden="true"
          className={`pointer-events-none absolute left-4 top-3.5 h-4 w-4 transition-colors duration-200 group-focus-within/field:text-pink-400 ${
            error ? 'text-pink-500' : 'text-gray-500'
          }`}
        />
        {children}
      </div>
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full rounded-2xl border bg-gray-950/70 py-3 pl-11 pr-4 text-xs text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-4 ${
    hasError
      ? 'border-pink-500/80 focus:ring-pink-500/15'
      : 'border-white/10 hover:border-white/20 focus:border-pink-500 focus:ring-pink-500/15'
  }`;

export default function Contact({ api }) {
  const formRef = useRef(null);
  const sectionRef = useRef(null);
  const humanRef = useRef(null);
  const mountedAt = useRef(Date.now());

  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false); // tombol berubah hijau sebentar setelah berhasil
  const [toast, setToast] = useState(null); // { id, type: 'success' | 'error', title, message } | null
  const [errors, setErrors] = useState({}); // { name?, email?, message?, captcha? }
  const [inView, setInView] = useState(false);
  const [human, setHuman] = useState(false); // sudah lolos captcha buatan sendiri

  // Animasi muncul saat section terlihat
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Alert baru selalu memakai id baru -> komponen Alert dibuat ulang
  // sehingga hitung mundurnya mulai dari awal.
  const showToast = (type, title, message) => {
    setToast({ id: Date.now(), type, title, message });
  };

  const resetCaptcha = () => {
    humanRef.current?.reset();
    setHuman(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MESSAGE_MAX) return;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Hapus error saat pengguna mulai mengetik di kolom tersebut
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    // Honeypot: kolom tersembunyi yang tidak akan diisi manusia
    const honeypot = formRef.current?.elements?.website?.value;
    if (honeypot) {
      // Pura-pura berhasil agar bot tidak tahu ketahuan
      showToast('success', 'Pesan terkirim', 'Pesan Anda berhasil dikirim! Terima kasih telah menghubungi.');
      setFields({ name: '', email: '', message: '' });
      resetCaptcha();
      return;
    }

    // Validasi kolom
    const newErrors = {};
    if (!fields.name.trim()) newErrors.name = 'Kolom ini wajib diisi';
    if (!fields.email.trim()) newErrors.email = 'Kolom ini wajib diisi';
    else if (!EMAIL_RE.test(fields.email.trim())) newErrors.email = 'Format email tidak valid';
    if (!fields.message.trim()) newErrors.message = 'Kolom ini wajib diisi';
    if (!human) newErrors.captcha = 'Silakan centang "Saya bukan robot" terlebih dahulu';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(
        'error',
        'Data belum lengkap',
        'Mohon periksa kembali kolom yang ditandai sebelum mengirim pesan.'
      );
      return;
    }

    // Terlalu cepat untuk ukuran manusia
    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      showToast('error', 'Terlalu cepat', 'Mohon tunggu beberapa detik lalu coba kirim lagi.');
      return;
    }

    setLoading(true);
    setToast(null);

    emailjs
      .sendForm('service_ru3f035', 'template_aggqz48', formRef.current, 'tVJhXv51XVHIQind4')
      .then(
        () => {
          showToast('success', 'Pesan terkirim', 'Pesan Anda berhasil dikirim! Terima kasih telah menghubungi.');
          setFields({ name: '', email: '', message: '' });
          setErrors({});
          setSent(true);
          setTimeout(() => setSent(false), 3000);
          resetCaptcha(); // verifikasi hanya berlaku untuk satu kali kirim
        },
        () => {
          showToast('error', 'Gagal mengirim', 'Gagal mengirim pesan. Silakan coba beberapa saat lagi.');
          resetCaptcha();
        }
      )
      .finally(() => setLoading(false));
  };

  const reveal = (delay = 0) => ({
    style: { transitionDelay: `${delay}ms` },
    className: `transition-all duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`,
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-950 py-20 transition-colors duration-300"
    >
      {/* Cahaya latar */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-pink-600/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl" />

      {/* Alert: hitung mundur melingkar + tombol close */}
      {toast && (
        <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:top-6">
          <Alert
            key={toast.id}
            variant={toast.type}
            title={toast.title}
            duration={TOAST_MS}
            onClose={() => setToast(null)}
            className="shadow-2xl"
          >
            {toast.message}
          </Alert>
        </div>
      )}

      <div className="container relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <div style={reveal(0).style} className={`mx-auto mb-14 max-w-xl text-center ${reveal(0).className}`}>
          <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink-500">
            Get In Touch
          </span>
          <h2 className="mt-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
            Contact Me
          </h2>
          <p className="mt-2 text-xs text-gray-400 sm:text-sm">
            Punya pertanyaan, tawaran proyek, atau sekadar ingin menyapa? Kirim pesan Anda di sini.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-stretch">
          {/* Info Kontak & Sosial Media */}
          <div style={reveal(120).style} className={`lg:col-span-2 ${reveal(120).className}`}>
            <GlassCard className="flex h-full flex-col p-7 sm:p-8">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Terbuka untuk proyek baru
                  </span>

                  <h3 className="mt-5 text-xl font-bold tracking-tight text-white">Contact Information</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    Silakan hubungi melalui detail kontak berikut atau jaringan media sosial saya.
                  </p>

                  <ul className="mt-7 space-y-2">
                    {CONTACTS.map(({ icon: Icon, label, value, href, external }) => (
                      <li key={label}>
                        <a
                          href={href}
                          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                          className="group/item flex items-center gap-4 rounded-2xl p-2.5 transition-colors hover:bg-white/[0.04]"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10 text-pink-400 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-pink-500 group-hover/item:text-white">
                            <Icon size={16} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                              {label}
                            </span>
                            <span className="mt-0.5 block break-words text-xs font-medium leading-relaxed text-gray-300 transition-colors group-hover/item:text-white">
                              {value}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Media Sosial */}
                <div className="mt-10 border-t border-white/10 pt-6">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Follow Me</p>
                  <div className="flex gap-3">
                    {SOCIALS.map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-400"
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Form Kontak */}
          <div style={reveal(240).style} className={`lg:col-span-3 ${reveal(240).className}`}>
            <GlassCard className="h-full p-7 sm:p-8">
              <h3 className="text-xl font-bold tracking-tight text-white">Send a Message</h3>
              <p className="mb-6 mt-1 text-xs text-gray-400">Biasanya saya membalas dalam 1–2 hari kerja.</p>

              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot: disembunyikan dari manusia dan pembaca layar */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <Field id="contact-name" label="Full Name" icon={HiUser} error={errors.name}>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={fields.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    className={inputClass(!!errors.name)}
                  />
                </Field>

                <Field id="contact-email" label="Email Address" icon={HiMail} error={errors.email}>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={fields.email}
                    onChange={handleChange}
                    placeholder="johndoe@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    className={inputClass(!!errors.email)}
                  />
                </Field>

                <Field
                  id="contact-message"
                  label="Message"
                  icon={HiChatAlt2}
                  error={errors.message}
                  extra={
                    <span
                      className={`text-[10px] font-semibold tabular-nums ${
                        fields.message.length > MESSAGE_MAX - 50 ? 'text-pink-400' : 'text-gray-500'
                      }`}
                    >
                      {fields.message.length}/{MESSAGE_MAX}
                    </span>
                  }
                >
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={fields.message}
                    onChange={handleChange}
                    placeholder="Tuliskan pesan atau detail proyek Anda di sini..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className={`${inputClass(!!errors.message)} resize-none`}
                  />
                </Field>

                {/* Captcha "Saya bukan robot" buatan sendiri */}
                <HumanCheck
                  ref={humanRef}
                  verified={human}
                  error={errors.captcha}
                  onVerify={() => {
                    setHuman(true);
                    setErrors((prev) => (prev.captcha ? { ...prev, captcha: undefined } : prev));
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-3.5 text-center text-xs font-bold text-white shadow-lg transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 ${
                    sent
                      ? 'bg-emerald-600 shadow-emerald-600/25'
                      : 'bg-gradient-to-r from-pink-600 to-fuchsia-600 shadow-pink-600/25 hover:shadow-pink-500/40'
                  }`}
                >
                  {/* Kilau yang melintas saat hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/20 opacity-0 transition-all duration-700 group-hover/btn:left-full group-hover/btn:opacity-100"
                  />
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Sending Message...</span>
                    </>
                  ) : sent ? (
                    <>
                      <HiCheckCircle className="h-4 w-4" />
                      <span>Message Sent</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <HiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}