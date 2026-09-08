import React, { useState, useEffect } from 'react';

const EMOJIS = ['🚀', '🎮', '🍕', '🐱', '🎸', '⚽', '🥹', '🍔'];
const MAX_MOVES = 20;

export default function GamesTwo() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const initializeGame = () => {
    const duplicatedEmojis = [...EMOJIS, ...EMOJIS];
    const shuffled = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsChecking(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const isWin = matched.length === cards.length && cards.length > 0;
  const isGameOver = moves >= MAX_MOVES && !isWin;

  const handleCardClick = (index) => {
    if (
      isGameOver || 
      isWin || 
      isChecking || 
      flipped.includes(index) || 
      matched.includes(index) || 
      flipped.length >= 2
    ) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const [firstIndex, secondIndex] = newFlipped;

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setMatched((prev) => [...prev, firstIndex, secondIndex]);
        setFlipped([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 800);
      }
    }
  };

  return (
    <section className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Header Title */}
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
            Mini Game
          </span>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-white">Memory Card</h2>
        </div>

        {/* Info Panel / Skor */}
        <div className="flex justify-between items-center bg-gray-950/60 border border-gray-800/80 rounded-2xl p-4 mb-6 text-center">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Langkah</span>
            <span className={`text-lg font-extrabold ${moves >= MAX_MOVES - 4 ? 'text-red-400 animate-pulse' : 'text-pink-400'}`}>
              {moves} / {MAX_MOVES}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Pasangan</span>
            <span className="text-lg font-extrabold text-indigo-400">
              {matched.length / 2} / {EMOJIS.length}
            </span>
          </div>
        </div>

        {/* Status Pesan Menang / Kalah */}
        <div className="text-center mb-6 h-8 flex items-center justify-center">
          {isWin ? (
            <span className="text-sm font-extrabold text-pink-400 tracking-wide bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 rounded-full">
              🎉 Selamat! Kamu Berhasil Menang!
            </span>
          ) : isGameOver ? (
            <span className="text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full">
              ❌ Game Over! Langkah habis.
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-400">
              Temukan semua pasangan emoji tersembunyi!
            </span>
          )}
        </div>

        {/* Grid Kartu */}
        <div className={`grid grid-cols-4 gap-3 mb-6 ${isGameOver ? 'opacity-50 pointer-events-none' : ''}`}>
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                disabled={isFlipped || isGameOver || isWin || isChecking}
                className={`h-16 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 border ${
                  isFlipped 
                    ? 'bg-gray-800/90 border-pink-500/50 shadow-lg shadow-pink-500/10 scale-105' 
                    : 'bg-gray-950/80 border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 text-gray-600'
                }`}
              >
                <span className={`transition-transform duration-300 ${isFlipped ? 'scale-100 opacity-100' : 'scale-75 opacity-70'}`}>
                  {isFlipped ? card.emoji : '❓'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tombol Main Lagi */}
        <button 
          onClick={initializeGame}
          className="w-full py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-sm font-bold text-white transition-all shadow-lg active:scale-95"
        >
          Main Lagi
        </button>

      </div>
    </section>
  );
}