import React, { useState, useEffect } from 'react';

const EMOJIS = ['🚀', '🎮', '🍕', '🐱', '🎸', '⚽', '🥹', '🍔'];
const MAX_MOVES = 7; // Batas maksimal langkah

export default function GamesTwo() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const initializeGame = () => {
    const duplicatedEmojis = [...EMOJIS, ...EMOJIS];
    const shuffled = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const isWin = matched.length === cards.length && cards.length > 0;
  const isGameOver = moves >= MAX_MOVES && !isWin;

  const handleCardClick = (index) => {
    // Kunci permainan jika sudah menang, kalah, kartu terbalik, atau sudah 2 kartu terbuka
    if (
      isGameOver || 
      isWin || 
      flipped.includes(index) || 
      matched.includes(index) || 
      flipped.length === 2
    ) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const [firstIndex, secondIndex] = newFlipped;

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setMatched((prev) => [...prev, firstIndex, secondIndex]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="memory-container">
      <h1 className='text-center text-white'>Memory Card Game</h1>
      
      <div className="info-panel text-center text-white">
        <span className={moves >= MAX_MOVES - 2 ? 'warning-text' : ''}>
          Langkah: <strong>{moves} / {MAX_MOVES}</strong>
        </span>
        <span>Tertebak: <strong>{matched.length / 2} / {EMOJIS.length}</strong></span>
      </div>

      {/* Pesan Menang / Kalah */}
      {isWin && <div className="game-status win-message text-center text-white">🎉 Selamat! Kamu Menang! 🎉</div>}
      {isGameOver && <div className="game-status lose-message text-center text-white">❌ Maaf kamu kalah! Batu langkah sudah habis.</div>}

      <div className={`card-grid-games ${isGameOver ? 'disabled-grid' : ''}`}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <div
              key={index}
              className={`card-Games ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              {isFlipped ? card.emoji : '❓'}
            </div>
          );
        })}
      </div>

      <button className="reset-btn" onClick={initializeGame}>
        Main Lagi
      </button>
    </div>
  );
}