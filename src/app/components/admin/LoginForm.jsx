import React, { useState } from 'react';
import { HiMail, HiLockClosed, HiArrowRight, HiExclamationCircle, HiCheckCircle, HiEye, HiEyeOff, HiX } from 'react-icons/hi';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showAlert('Email dan password tidak boleh kosong!', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showAlert('Login berhasil! Selamat datang kembali.', 'success');
      setEmail('');
      setPassword('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Alert Notification dari Samping Kanan (Slide-in) */}
      <div className={`fixed top-6 right-6 z-50 flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out max-w-sm w-full ${
        alert.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
      } ${
        alert.type === 'error' 
          ? 'bg-red-950/90 border-red-800/80 text-red-200 shadow-red-950/50' 
          : 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200 shadow-emerald-950/50'
      }`}>
        <div className="flex items-center gap-2.5">
          {alert.type === 'error' ? (
            <HiExclamationCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <HiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold leading-relaxed">{alert.message}</span>
        </div>
        <button 
          onClick={() => setAlert({ show: false, message: '', type: '' })}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <HiX className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full max-w-sm bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 p-8 rounded-3xl shadow-2xl space-y-6">
        
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-black text-white tracking-wider">
            mfikria<span className="text-pink-500">.</span>
          </h1>
          <p className="text-xs text-gray-400">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Email</label>
            <div className="relative flex items-center">
              <HiMail className="absolute left-3.5 w-4 h-4 text-pink-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                className={`w-full h-11 bg-gray-950/60 border rounded-xl pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${
                  !email.trim() && alert.show && alert.type === 'error' ? 'border-red-500' : 'border-gray-800 focus:border-pink-500'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Password</label>
              <a href="/forgot" className="text-[10px] font-semibold text-pink-400 hover:text-pink-300 transition-colors">Lupa?</a>
            </div>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3.5 w-4 h-4 text-pink-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full h-11 bg-gray-950/60 border rounded-xl pl-10 pr-10 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${
                  !password.trim() && alert.show && alert.type === 'error' ? 'border-red-500' : 'border-gray-800 focus:border-pink-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? "Memproses..." : "Masuk"}</span>
            {!isLoading && <HiArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Belum punya akun? <a href="/register" className="text-pink-400 font-semibold hover:text-pink-300 transition-colors">Daftar</a>
        </p>

      </div>
    </div>
  );
}