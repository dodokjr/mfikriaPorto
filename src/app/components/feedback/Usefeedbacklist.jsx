// Simpan di: src/app/components/feedback/useFeedbackList.js
// State daftar saran & kritik: muat, filter, "muat lebih banyak", tambah item lokal setelah kirim,
// dan tambah balasan admin langsung ke komentar yang dibalas.

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchList } from '../../../libs/Feedbackapi';

export default function useFeedbackList() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState(''); // '' | saran | kritik | lainnya
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [loadingMore, setLoadingMore] = useState(false);
  const abortRef = useRef(null);

  const load = useCallback((tipe, nextPage) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (nextPage === 1) setStatus('loading');
    else setLoadingMore(true);

    fetchList({ page: nextPage, tipe, signal: controller.signal })
      .then((body) => {
        setItems((prev) => {
          if (nextPage === 1) return body.data;
          // Buang duplikat (mis. komentar yang baru dikirim lalu muncul lagi di halaman berikutnya)
          const seen = new Set(prev.map((item) => item.id));
          return [...prev, ...body.data.filter((item) => !seen.has(item.id))];
        });
        setSummary(body.summary);
        setHasMore(Boolean(body.hasMore));
        setPage(nextPage);
        setStatus('ready');
        setLoadingMore(false);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error('Saran & kritik gagal dimuat:', error);
        setStatus('error');
        setLoadingMore(false);
      });
  }, []);

  useEffect(() => {
    load(filter, 1);
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [filter, load]);

  const loadMore = useCallback(() => load(filter, page + 1), [filter, page, load]);
  const reload = useCallback(() => load(filter, 1), [filter, load]);

  // Tampilkan komentar yang baru dikirim langsung (tanpa menunggu cache server), hanya kalau cocok dengan filter aktif
  const addLocal = useCallback(
    (data) => {
      if (!data) return;
      if (!filter || filter === data.tipe) setItems((prev) => [{ ...data, replies: [], replyCount: 0 }, ...prev]);
      setSummary((prev) =>
        prev ? { ...prev, total: prev.total + 1, [data.tipe]: (prev[data.tipe] || 0) + 1 } : prev
      );
    },
    [filter]
  );

  // Tampilkan balasan admin yang baru terkirim di bawah komentar yang dibalas
  const addReply = useCallback((parentId, reply) => {
    if (!parentId || !reply) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === reply.parentId || item.id === parentId
          ? { ...item, replies: [...(item.replies || []), reply], replyCount: (item.replyCount || 0) + 1 }
          : item
      )
    );
  }, []);

  return { items, summary, filter, setFilter, status, hasMore, loadingMore, loadMore, reload, addLocal, addReply };
}