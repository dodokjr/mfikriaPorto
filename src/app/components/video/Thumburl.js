// Simpan di: src/app/components/video/thumbUrl.js
// Alamat gambar cuplikan video dari backend (GET /mfikria/v1/thumb/:token)

const ORIGIN = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_ORIGIN) ||
  'https://api-mfikria.vercel.app'
).replace(/\/+$/, '');

const PATH = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TOKEN_PATH) ||
  '/mfikria/v1'
).replace(/\/+$/, '');

export function thumbUrl(token) {
  return `${ORIGIN}${PATH}/thumb/${encodeURIComponent(token)}`;
}