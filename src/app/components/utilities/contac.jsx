import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { FaLocationDot, FaPhone, FaXTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

export default function Contact({ api }) {
  const formRef = useRef();
  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .sendForm(
        'service_ru3f035',
        'template_aggqz48',
        formRef.current,
        'tVJhXv51XVHIQind4'
      )
      .then(
        () => {
          setStatus('success');
          setFields({ name: '', email: '', message: '' });
        },
        () => {
          setStatus('error');
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <section className="bg-slate-100/70 py-16 transition-colors duration-300 dark:bg-slate-900">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Get In Touch
          </span>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Contact Me
          </h2>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <p className="mt-4 text-base font-medium text-slate-600 dark:text-slate-300 sm:text-lg">
            Punya pertanyaan, tawaran proyek, atau sekadar ingin menyapa? Silakan kirim pesan Anda di bawah ini.
          </p>
        </div>

        {/* Form & Info Section */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          
          {/* Info Kontak & Sosial Media */}
          <div className="flex flex-col justify-between rounded-2xl bg-slate-800 p-8 text-white shadow-xl lg:p-10">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white">Contact Information</h3>
              <p className="mt-3 text-sm text-slate-300">
                Silakan hubungi melalui detail kontak berikut atau jaringan media sosial saya.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                    <FaLocationDot size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    Sendang Mulyo, Tembalang, Semarang City, Central Java 50272
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                    <FaPhone size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-200">(+62) 8572-7738-629</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                    <IoMail size={18} />
                  </div>
                  <a href="mailto:ffikri604@gmail.com" className="text-sm font-medium text-slate-200 hover:text-indigo-400 transition-colors">
                    ffikri604@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Media Sosial */}
            <div className="mt-10 pt-6 border-t border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Follow Me</p>
              <div className="mt-4 flex gap-4 text-slate-300">
                <a href="https://x.com/bintangFikri3" target="_blank" rel="noreferrer" className="rounded-lg bg-slate-700 p-2.5 hover:bg-indigo-600 hover:text-white transition-all">
                  <FaXTwitter size={18} />
                </a>
                <a href="https://www.linkedin.com/in/muhammad-fikri-ardiyansah-952752194/" target="_blank" rel="noreferrer" className="rounded-lg bg-slate-700 p-2.5 hover:bg-indigo-600 hover:text-white transition-all">
                  <FaLinkedinIn size={18} />
                </a>
                <a href="https://fb.com/muhammad.f.ardiyansah.16/" target="_blank" rel="noreferrer" className="rounded-lg bg-slate-700 p-2.5 hover:bg-indigo-600 hover:text-white transition-all">
                  <FaFacebookF size={18} />
                </a>
                <a href="https://www.instagram.com/fkri.ardn/?hl=en" target="_blank" rel="noreferrer" className="rounded-lg bg-slate-700 p-2.5 hover:bg-indigo-600 hover:text-white transition-all">
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Form Kontak Modern */}
          <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700/60 lg:p-10">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Send a Message</h3>
            
            {/* Alert Notifikasi */}
            {status === 'success' && (
              <div className="mt-4 rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                ✓ Pesan Anda berhasil dikirim! Terima kasih telah menghubungi.
              </div>
            )}
            {status === 'error' && (
              <div className="mt-4 rounded-xl bg-rose-500/10 p-4 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm font-semibold">
                ✕ Gagal mengirim pesan. Silakan coba lagi atau kirim via email langsung.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com"
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  value={fields.message}
                  onChange={handleChange}
                  placeholder="Tuliskan pesan atau detail proyek Anda di sini..."
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-3.5 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}