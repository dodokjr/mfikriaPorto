import React, { useState, useEffect } from 'react';
import { HiWifi, HiExclamationCircle } from 'react-icons/hi';

export default function RealtimePingAlert() {
  const [pingData, setPingData] = useState({
    status: 'Checking...',
    latency: null,
    isAlert: false,
    color: 'bg-gray-900 border-gray-800 text-gray-300'
  });

  const targetUrl = 'https://mfikria.vercel.app/assets/Mfikria-D1fUWlBA.svg';

  const checkPingRealtime = async () => {
    const start = performance.now();
    try {
      const response = await fetch(targetUrl, { method: 'HEAD', cache: 'no-store' });
      const end = performance.now();
      const latency = Math.round(end - start);

      if (response.ok) {
        if (latency > 800) {
          setPingData({
            status: 'Slow Connection',
            latency: latency,
            isAlert: true,
            color: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          });
        } else {
          setPingData({
            status: 'Online',
            latency: latency,
            isAlert: false,
            color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          });
        }
      } else {
        setPingData({
          status: 'Server Error',
          latency: latency,
          isAlert: true,
          color: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        });
      }
    } catch (error) {
      setPingData({
        status: 'Disconnected',
        latency: null,
        isAlert: true,
        color: 'bg-rose-600/20 border-rose-500 text-rose-400 animate-pulse'
      });
    }
  };

  useEffect(() => {
    checkPingRealtime();
    const interval = setInterval(checkPingRealtime, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside aria-label="Status Jaringan Real-Time" className="fixed top-5 right-5 z-50 pointer-events-none">
      <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border backdrop-blur-xl shadow-lg transition-all duration-300 pointer-events-auto ${pingData.color}`}>
        
        {/* Indikator Ikon */}
        <div className="flex items-center justify-center shrink-0">
          {pingData.isAlert ? (
            <HiExclamationCircle className="w-4 h-4 text-rose-500 animate-bounce" />
          ) : (
            <HiWifi className="w-4 h-4 text-emerald-400 animate-pulse" />
          )}
        </div>

        {/* Angka Latency Saja */}
        <div className="text-xs font-mono font-bold tracking-tight">
          {pingData.latency !== null ? (
            <span>{pingData.latency} ms</span>
          ) : (
            <span className="text-[11px] uppercase">Offline</span>
          )}
        </div>

      </div>
    </aside>
  );
}