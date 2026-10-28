// Simpan di: src/app/components/feedback/feedbackConfig.js
// Konfigurasi bersama untuk fitur saran & kritik.

import { HiLightBulb, HiExclamationCircle, HiChatAlt2 } from 'react-icons/hi';

const API_ORIGIN = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_ORIGIN) ||
  'https://api-mfikria.vercel.app'
).replace(/\/+$/, '');

const API_PATH = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TOKEN_PATH) ||
  '/mfikria/v1'
).replace(/\/+$/, '');

export const FEEDBACK_URL = `${API_ORIGIN}${API_PATH}/feedback`;

export const PAGE_SIZE = 5; // jumlah komentar utama per halaman (sama dengan default backend)
export const MIN_MESSAGE = 5; // sama dengan backend
export const MAX_MESSAGE = 1000;
export const MAX_NAME = 40;

// Kunci penyimpanan browser tempat hasil login (dashboardData) disimpan.
// Di aplikasi ini tersimpan di Local storage dengan kunci "session". Dicari di localStorage lalu sessionStorage.
export const ADMIN_STORAGE_KEY = 'session';

export const TYPES = {
  saran: {
    label: 'Saran',
    Icon: HiLightBulb,
    chip: 'bg-cyan-500/15 text-cyan-300 ring-cyan-500/30',
    avatar: 'bg-cyan-500/20 text-cyan-300',
  },
  kritik: {
    label: 'Kritik',
    Icon: HiExclamationCircle,
    chip: 'bg-pink-500/15 text-pink-300 ring-pink-500/30',
    avatar: 'bg-pink-500/20 text-pink-300',
  },
  lainnya: {
    label: 'Lainnya',
    Icon: HiChatAlt2,
    chip: 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30',
    avatar: 'bg-indigo-500/20 text-indigo-300',
  },
};