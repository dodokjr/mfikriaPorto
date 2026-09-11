import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IoReload, IoTrophy, IoPlay, IoList } from 'react-icons/io5';

export default function SimpleGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPos, setTargetPos] = useState({ top: 50, left: 50 });

  const timerRef = useRef(null);
  const scoreRef = useRef(0);

  // Update ref setiap kali score berubah agar callback selalu mendapat nilai terbaru
  scoreRef.current = score;

  const moveTarget = () => {
    const randomTop = Math.floor(Math.random() * 70) + 15;
    const randomLeft = Math.floor(Math.random() * 70) + 15;
    setTargetPos({ top: randomTop, left: randomLeft });
  };

  const handleGameOver = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const finalScore = scoreRef.current;
    setHighScore((prev) => (finalScore > prev ? finalScore : prev));
    setScoreHistory((prev) => {
      const updated = [...prev, finalScore].sort((a, b) => b - a);
      return updated.slice(0, 5);
    });
  }, []);

  const startGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(30);
    setIsPlaying(true);
    moveTarget();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTargetClick = () => {
    if (!isPlaying) return;
    setScore((prev) => prev + 1);
    moveTarget();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleGameOver]);

  return (
    <div className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">

        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-lg font-extrabold tracking-wider text-pink-500 uppercase">Speed Clicker</h1>
            <p className="text-xs text-gray-400">Klik target sebanyak mungkin dalam 30 detik!</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
            <IoTrophy className="text-amber-400" size={16} />
            <span className="text-xs font-mono font-bold">{highScore}</span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-950/60 p-4 rounded-2xl border border-gray-800 mb-6 font-mono text-sm">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">Skor</span>
            <span className="text-xl font-bold text-pink-400">{score}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block text-[10px] uppercase">Waktu</span>
            <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-rose-500 animate-ping' : 'text-white'}`}>{timeLeft}s</span>
          </div>
        </div>

        <div className="relative w-full h-72 bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-inner mb-6">
          {!isPlaying && timeLeft === 30 && score === 0 && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <button 
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-500 font-bold text-sm shadow-lg shadow-pink-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <IoPlay size={18} /> Mulai Bermain
              </button>
            </div>
          )}

          {!isPlaying && timeLeft === 0 && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <h3 className="text-base font-bold text-white">Waktu Habis!</h3>
              <p className="text-xs text-gray-400">Skor Akhir Kamu: <strong className="text-pink-400">{score}</strong></p>
              <button 
                onClick={startGame}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 font-bold text-xs shadow-lg shadow-pink-600/30 transition-all active:scale-95 mt-2 cursor-pointer"
              >
                <IoReload size={16} /> Main Lagi
              </button>
            </div>
          )}

          {isPlaying && (
            <button
              onClick={handleTargetClick}
              style={{ top: `${targetPos.top}%`, left: `${targetPos.left}%` }}
              className="absolute w-12 h-12 bg-gradient-to-tr from-pink-600 to-rose-500 rounded-full shadow-lg shadow-pink-600/50 transform -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform cursor-pointer border-2 border-white/30 animate-pulse"
              aria-label="Target Game"
            />
          )}
        </div>

        <div className="bg-gray-950/40 p-4 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <IoList className="text-pink-400" size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">Riwayat Skor Terbaik</h3>
          </div>
          {scoreHistory.length === 0 ? (
            <p className="text-xs text-gray-500 italic">Belum ada riwayat permainan.</p>
          ) : (
            <div className="space-y-1.5 font-mono text-xs">
              {scoreHistory.map((histScore, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-900/80 px-3 py-2 rounded-xl border border-gray-800/60">
                  <span className="text-gray-400">Peringkat #{index + 1}</span>
                  <span className="font-bold text-pink-400">{histScore} Poin</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}