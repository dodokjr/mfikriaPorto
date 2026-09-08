import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { FaLocationDot, FaPhone, FaXTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { HiCheckCircle, HiXCircle, HiExclamationCircle, HiArrowRight } from "react-icons/hi";

export default function Contact({ api }) {
  const formRef = useRef();
  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string } | null
  const [errors, setErrors] = useState({}); // Menyimpan status field yang kosong/invalid

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
    // Hapus error saat pengguna mulai mengetik di kolom tersebut
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi Kolom Kosong
    const newErrors = {};
    if (!fields.name.trim()) newErrors.name = true;
    if (!fields.email.trim()) newErrors.email = true;
    if (!fields.message.trim()) newErrors.message = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Mohon lengkapi semua kolom yang kosong sebelum mengirim pesan.');
      return;
    }

    setLoading(true);
    setToast(null);

    emailjs
      .sendForm(
        'service_ru3f035',
        'template_aggqz48',
        formRef.current,
        'tVJhXv51XVHIQind4'
      )
      .then(
        () => {
          showToast('success', 'Pesan Anda berhasil dikirim! Terima kasih telah menghubungi.');
          setFields({ name: '', email: '', message: '' });
          setErrors({});
        },
        () => {
          showToast('error', 'Gagal mengirim pesan. Silakan coba beberapa saat lagi.');
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <section className="bg-gray-950 py-16 transition-colors duration-300 relative">
      
      {/* Floating Toast Notification Modern */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 border border-gray-800 px-5 py-4 rounded-2xl shadow-2xl animate-fade-in">
          {toast.type === 'success' ? (
            <HiCheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <HiXCircle className="w-6 h-6 text-pink-500 shrink-0" />
          )}
          <p className="text-xs font-semibold text-white">{toast.message}</p>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section Minimalis */}
        <div className="mx-auto max-w-xl text-center mb-12">
          <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
            Get In Touch
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-white">
            Contact Me
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-400">
            Punya pertanyaan, tawaran proyek, atau sekadar ingin menyapa? Kirim pesan Anda di sini.
          </p>
        </div>

        {/* Form & Info Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          
          {/* Info Kontak & Sosial Media */}
          <div className="flex flex-col justify-between rounded-3xl bg-gray-900 border border-gray-800 p-8 shadow-xl">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">Contact Information</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                Silakan hubungi melalui detail kontak berikut atau jaringan media sosial saya.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
                    <FaLocationDot size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-300 leading-relaxed">
                    Sendang Mulyo, Tembalang, Semarang City, Central Java 50272
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
                    <FaPhone size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-300">(+62) 8572-7738-629</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
                    <IoMail size={16} />
                  </div>
                  <a href="mailto:ffikri604@gmail.com" className="text-xs font-medium text-gray-300 hover:text-white transition-colors">
                    ffikri604@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Media Sosial */}
            <div className="mt-10 pt-6 border-t border-gray-800">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Follow Me</p>
              <div className="flex gap-3 text-gray-300">
                <a href="https://x.com/bintangFikri3" target="_blank" rel="noreferrer" className="rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 p-3 hover:text-white transition-all">
                  <FaXTwitter size={16} />
                </a>
                <a href="https://www.linkedin.com/in/muhammad-fikri-ardiyansah-952752194/" target="_blank" rel="noreferrer" className="rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 p-3 hover:text-white transition-all">
                  <FaLinkedinIn size={16} />
                </a>
                <a href="https://fb.com/muhammad.f.ardiyansah.16/" target="_blank" rel="noreferrer" className="rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 p-3 hover:text-white transition-all">
                  <FaFacebookF size={16} />
                </a>
                <a href="https://www.instagram.com/fkri.ardn/?hl=en" target="_blank" rel="noreferrer" className="rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 p-3 hover:text-white transition-all">
                  <FaInstagram size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Form Kontak Modern */}
          <div className="rounded-3xl bg-gray-900 border border-gray-800 p-8 shadow-xl">
            <h3 className="text-lg font-bold tracking-tight text-white mb-6">Send a Message</h3>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Full Name</label>
                  {errors.name && (
                    <span className="text-[10px] font-bold text-pink-500 flex items-center gap-1">
                      <HiExclamationCircle className="w-3.5 h-3.5" /> Kolom ini wajib diisi
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full rounded-2xl bg-gray-950 px-4 py-3 text-xs text-white border transition-all focus:outline-none ${
                    errors.name 
                      ? 'border-pink-500/80 focus:ring-2 focus:ring-pink-500/20' 
                      : 'border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'
                  }`}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Email Address</label>
                  {errors.email && (
                    <span className="text-[10px] font-bold text-pink-500 flex items-center gap-1">
                      <HiExclamationCircle className="w-3.5 h-3.5" /> Kolom ini wajib diisi
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com"
                  className={`w-full rounded-2xl bg-gray-950 px-4 py-3 text-xs text-white border transition-all focus:outline-none ${
                    errors.email 
                      ? 'border-pink-500/80 focus:ring-2 focus:ring-pink-500/20' 
                      : 'border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'
                  }`}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Message</label>
                  {errors.message && (
                    <span className="text-[10px] font-bold text-pink-500 flex items-center gap-1">
                      <HiExclamationCircle className="w-3.5 h-3.5" /> Kolom ini wajib diisi
                    </span>
                  )}
                </div>
                <textarea
                  name="message"
                  rows={4}
                  value={fields.message}
                  onChange={handleChange}
                  placeholder="Tuliskan pesan atau detail proyek Anda di sini..."
                  className={`w-full rounded-2xl bg-gray-950 px-4 py-3 text-xs text-white border transition-all focus:outline-none resize-none ${
                    errors.message 
                      ? 'border-pink-500/80 focus:ring-2 focus:ring-pink-500/20' 
                      : 'border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'
                  }`}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-pink-600 hover:bg-pink-500 py-3.5 text-center text-xs font-bold text-white shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                {!loading && <HiArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}