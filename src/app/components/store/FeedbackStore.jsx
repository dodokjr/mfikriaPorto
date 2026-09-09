import React, { useState } from 'react';

export default function FeedbackStore({ isDarkMode }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kritik');
  const [message, setMessage] = useState('');
  
  const [errorWarning, setErrorWarning] = useState('');
  const [alert, setAlert] = useState(null);

  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      name: 'Rian P.',
      category: 'Saran',
      message: 'Tolong adakan variasi warna baru untuk koleksi kaos basic-nya, seperti warna olive atau sage green.',
      date: '8 September 2026'
    },
    {
      id: 2,
      name: 'Dimas A.',
      category: 'Pujian',
      message: 'Kualitas bahan katunnya beneran nyaman banget dipakai harian dan adem!',
      date: '7 September 2026'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setErrorWarning('Kolom pesan tidak boleh kosong!');
      setAlert({ type: 'error', message: 'Transmission failed. Missing required field.' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    setErrorWarning('');

    const newFeedback = {
      id: Date.now(),
      name: name.trim() || 'Anonymous',
      category,
      message,
      date: 'Just now'
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setName('');
    setMessage('');

    setAlert({ type: 'success', message: 'Transmission received successfully.' });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className={`relative max-w-4xl mx-auto px-4 py-16 overflow-hidden tracking-tight transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0c] text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
      
      {/* Alert Minimalis Monokrom dengan Animasi Masuk dari Kiri */}
      {alert && (
        <div className="fixed top-20 left-0 z-50 animate-slide-in-left">
          <div className="bg-neutral-900 text-white px-5 py-3.5 rounded-r-xl shadow-2xl border-l-2 border-white flex items-center gap-3 text-xs font-mono tracking-wider backdrop-blur-md">
            <span className="text-xs">{alert.type === 'success' ? '⚡' : '⚠️'}</span>
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Tambahan CSS Keyframe untuk Slide dari Kiri */}
      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Header Section */}
      <div className="text-center space-y-4 max-w-xl mx-auto mb-16">
        <span className="inline-block px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase tracking-widest">
          // Client Transmissions
        </span>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase">Feedback & Logs</h2>
        <p className={`text-xs font-mono ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Secure protocol for your critiques, recommendations, and field reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Form Input Kritik & Saran */}
        <div className={`md:col-span-1 p-6 rounded-2xl border h-fit transition-all duration-300 ${isDarkMode ? 'bg-neutral-950 border-neutral-900' : 'bg-white border-neutral-200 shadow-sm'}`}>
          <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-5 pb-2 border-b border-neutral-900">New Entry</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            <div>
              <label className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">Alias (Optional)</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none transition ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-400'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none transition ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neutral-600' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-400'
                }`}
              >
                <option value="Kritik">Critique</option>
                <option value="Saran">Suggestion</option>
                <option value="Pujian">Testimonial</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">Transmission Data</label>
              <textarea
                rows="4"
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (e.target.value.trim()) setErrorWarning('');
                }}
                className={`w-full text-xs px-3 py-2.5 rounded-lg border focus:outline-none resize-none transition ${
                  errorWarning ? 'border-red-500' : ''
                } ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-400'
                }`}
              />
              {errorWarning && (
                <span className="text-[10px] text-red-400 mt-1 block">
                  {errorWarning}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black hover:bg-neutral-200 py-2.5 rounded-lg text-xs uppercase tracking-wider transition font-bold"
            >
              Transmit Data
            </button>
          </form>
        </div>

        {/* Daftar List Masukan Publik */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Public Feed // Archive</h3>
          
          <div className="space-y-3">
            {feedbacks.map((item) => (
              <div 
                key={item.id} 
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  isDarkMode ? 'bg-neutral-950/80 border-neutral-900 hover:border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-xs tracking-tight">{item.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase tracking-widest ${
                      item.category === 'Pujian' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : item.category === 'Saran'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">{item.date}</span>
                </div>
                <p className={`text-xs font-mono leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}