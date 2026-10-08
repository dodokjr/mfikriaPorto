import React, { useState, useRef, useEffect } from 'react';
import {
  HiUser,
  HiKey,
  HiLockClosed,
  HiArrowRight,
  HiExclamationCircle,
  HiCheckCircle,
  HiEye,
  HiEyeOff,
  HiX,
} from 'react-icons/hi';

const API_BASE = 'https://api-mfikria.vercel.app/mfikria/v1';
const REGISTER_URL = `${API_BASE}/register`;
const LOGIN_URL = `${API_BASE}/login`;
const REDIRECT_AFTER_LOGIN = '/auth/ff/Dashboard';
const MIN_PASSWORD_LENGTH = 6;

// "403 Forbidden: Username sudah terdaftar" -> "Username sudah terdaftar"
const cleanMessage = (msg) => String(msg || '').replace(/^\d{3} [A-Za-z ]+: /, '');

export default function AuthForm() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const alertTimer = useRef(null);

  const isLogin = mode === 'login';

  const showAlert = (message, type) => {
    clearTimeout(alertTimer.current);
    setAlert({ show: true, message, type });
    alertTimer.current = setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3500);
  };

  const closeAlert = () => {
    clearTimeout(alertTimer.current);
    setAlert({ show: false, message: '', type: '' });
  };

  useEffect(() => () => clearTimeout(alertTimer.current), []);

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
    setPassword('');
    setAccessToken('');
    setShowPassword(false);
    closeAlert();
  };

  const parseResponse = async (res) => {
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.status === 'success', data };
  };

  /* ---------------------------- REGISTER ---------------------------- */
  const handleRegister = async () => {
    const name = username.trim();

    const newErrors = {};
    if (!name) newErrors.username = true;
    if (!password) newErrors.password = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showAlert('Username dan password tidak boleh kosong!', 'error');
      return;
    }
    if (name.length > 50) {
      setErrors({ username: true });
      showAlert('Username maksimal 50 karakter.', 'error');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrors({ password: true });
      showAlert(`Password minimal ${MIN_PASSWORD_LENGTH} karakter.`, 'error');
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, password }),
      });
      const { ok, data } = await parseResponse(res);

      if (!ok) {
        showAlert(cleanMessage(data.message) || 'Registrasi gagal. Coba lagi.', 'error');
        return;
      }

      // Register berhasil -> pindah ke form login, username tetap terisi
      setMode('login');
      setPassword('');
      setAccessToken('');
      setShowPassword(false);
      showAlert('Registrasi berhasil! Silakan masuk.', 'success');
    } catch (err) {
      showAlert('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /* ----------------------------- LOGIN ------------------------------ */
  const handleLogin = async () => {
    const name = username.trim();
    const token = accessToken.trim();

    const newErrors = {};
    if (!name) newErrors.username = true;
    if (!password) newErrors.password = true;
    if (!token) newErrors.accessToken = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showAlert('Username, Password, dan Access Token tidak boleh kosong!', 'error');
      return;
    }

    setErrors({});
    setIsLoading(true);
    let redirecting = false;

    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: name, password }),
      });
      const { ok, data } = await parseResponse(res);

      if (!ok) {
        showAlert(cleanMessage(data.message) || 'Login gagal. Coba lagi.', 'error');
        return;
      }

      // Simpan sesi untuk Dashboard (dipakai juga untuk signOut & foto profil)
      try {
        localStorage.setItem('session', JSON.stringify(data.dashboardData));
      } catch (storageError) {
        // Abaikan jika storage diblokir; login tetap dilanjutkan
      }

      redirecting = true;
      showAlert('Login berhasil! Mengalihkan ke dashboard...', 'success');
      setTimeout(() => window.location.assign(REDIRECT_AFTER_LOGIN), 900);
    } catch (err) {
      showAlert('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 'error');
    } finally {
      // Tombol tetap nonaktif selama menunggu redirect
      if (!redirecting) setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (isLogin) handleLogin();
    else handleRegister();
  };

  const inputClass = (hasError, extra = '') =>
    `w-full h-11 bg-gray-950/60 border rounded-xl pl-10 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${extra} ${
      hasError ? 'border-red-500' : 'border-gray-800 focus:border-pink-500'
    }`;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Alert Notification dari Samping Kanan (Slide-in) */}
      <div
        role="alert"
        className={`fixed top-6 right-6 z-50 flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out max-w-sm w-full ${
          alert.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        } ${
          alert.type === 'error'
            ? 'bg-red-950/90 border-red-800/80 text-red-200 shadow-red-950/50'
            : 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200 shadow-emerald-950/50'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {alert.type === 'error' ? (
            <HiExclamationCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <HiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-semibold leading-relaxed">{alert.message}</span>
        </div>
        <button
          type="button"
          onClick={closeAlert}
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
          <p className="text-xs text-gray-400">
            {isLogin ? 'Masuk ke akun Anda untuk melanjutkan' : 'Buat akun baru untuk memulai'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username (login & register) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">
              Username
            </label>
            <div className="relative flex items-center">
              <HiUser className="absolute left-3.5 w-4 h-4 text-pink-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username Anda"
                autoComplete="username"
                maxLength={50}
                className={inputClass(errors.username, 'pr-4')}
              />
            </div>
          </div>

          {/* Password (login & register) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">
              Password
            </label>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3.5 w-4 h-4 text-pink-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? '••••••••' : `minimal ${MIN_PASSWORD_LENGTH} karakter`}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className={inputClass(errors.password, 'pr-10')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-3.5 text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>


          {/* Access Token (khusus login) */}
          {isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">
                Access Token
              </label>
              <div className="relative flex items-center">
                <HiKey className="absolute left-3.5 w-4 h-4 text-pink-400" />
                <input
                  type={showToken ? 'text' : 'password'}
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="off"
                  className={inputClass(errors.accessToken, 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  aria-label={showToken ? 'Sembunyikan token' : 'Tampilkan token'}
                  className="absolute right-3.5 text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  {showToken ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}</span>
            {!isLoading && <HiArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <button
            type="button"
            onClick={() => switchMode(isLogin ? 'register' : 'login')}
            className="text-pink-400 font-semibold hover:text-pink-300 transition-colors cursor-pointer"
          >
            {isLogin ? 'Daftar' : 'Masuk'}
          </button>
        </p>
      </div>
    </div>
  );
}