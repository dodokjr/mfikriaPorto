import React, { useState, useEffect, useRef } from 'react';
import { IoReload, IoTrophy, IoPlay } from 'react-icons/io5';

export default function GamesFour() {
  const [gameState, setGameState] = useState('idle'); // idle, waiting, ready, result, falsestart
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [history, setHistory] = useState([]);

  const timeoutRef = useRef(null);

  const startTest = () => {
    setGameState('waiting');
    setReactionTime(null);
    
    const randomTime = Math.floor(Math.random() * 3000) + 2000; // 2 - 5 detik
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      setStartTime(performance.now());
    }, randomTime);
  };

  const handleClick = () => {
    if (gameState === 'idle' || gameState === 'falsestart' || gameState === 'result') {
      startTest();
    } else if (gameState === 'waiting') {
      clearTimeout(timeoutRef.current);
      setGameState('falsestart');
    } else if (gameState === 'ready') {
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);
      setReactionTime(time);
      setGameState('result');

      setBestTime((prev) => (prev === null || time < prev ? time : prev));
      setHistory((prev) => [time, ...prev].slice(0, 5));
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getBackgroundStyle = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-rose-950/40 border-rose-500/50 text-rose-300';
      case 'ready':
        return 'bg-emerald-600 border-emerald-400 text-white animate-pulse';
      case 'falsestart':
        return 'bg-amber-950/40 border-amber-500/50 text-amber-300';
      default:
        return 'bg-gray-950 border-gray-800 text-white';
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">

        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-lg font-extrabold tracking-wider text-pink-500 uppercase">Reaction Speed</h1>
            <p className="text-xs text-gray-400">Seberapa cepat refleks tanganmu?</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 font-mono">
            <IoTrophy className="text-amber-400" size={16} />
            <span className="text-xs font-bold">{bestTime !== null ? `${bestTime} ms` : '-'}</span>
          </div>
        </div>

        <div 
          onClick={handleClick}
          className={`relative w-full h-64 rounded-2xl border-2 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 shadow-inner select-none ${getBackgroundStyle()}`}
        >
          {gameState === 'idle' && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <IoPlay size={24} />
              </div>
              <p className="text-sm font-bold">Klik di sini untuk Mulai</p>
              <span className="text-xs text-gray-400">Tunggu sampai warna kotak berubah menjadi Hijau</span>
            </div>
          )}

          {gameState === 'waiting' && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xl font-bold tracking-wider animate-bounce">Tunggu warna hijau...</span>
              <p className="text-xs text-rose-400">Jangan klik terlalu cepat!</p>
            </div>
          )}

          {gameState === 'ready' && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black uppercase tracking-widest animate-ping">KLIK SEKARANG!</span>
            </div>
          )}

          {gameState === 'falsestart' && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-base font-bold text-amber-400">Terlalu Cepat (False Start)!</span>
              <p className="text-xs text-gray-300">Klik lagi untuk mencoba ulang.</p>
            </div>
          )}

          {gameState === 'result' && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-400">Waktu Refleks Kamu</span>
              <span className="text-4xl font-mono font-black text-pink-400">{reactionTime} ms</span>
              <p className="text-xs text-gray-400 mt-2">Klik untuk tes lagi</p>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-6 bg-gray-950/40 p-4 rounded-2xl border border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Riwayat Percobaan Terakhir</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((time, idx) => (
                <span key={idx} className="bg-gray-800/80 border border-gray-700/60 px-3 py-1 rounded-xl text-xs font-mono text-pink-300 font-semibold">
                  {time} ms
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}