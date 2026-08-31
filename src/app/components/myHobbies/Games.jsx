import React, { useState } from 'react';

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Baris
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolom
  [0, 4, 8], [2, 4, 6]             // Diagonal
];

export default function Games() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsAI, setVsAI] = useState(false);

  // Mengecek apakah ada pemenang
  const checkWinner = (squares) => {
    for (let [a, b, c] of WINNING_COMBOS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = checkWinner(board);
  const isDraw = !winner && board.every((square) => square !== null);

  // Gerakan Otomatis Komputer (AI Sederhana)
  const makeAIMove = (currentBoard) => {
    const emptyIndices = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (emptyIndices.length === 0) return;

    // AI memilih langkah secara acak
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = 'O';

    setBoard(newBoard);
    setIsXNext(true);
  };

  // Penanganan Klik Pada Kotak
  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    if (vsAI && isXNext && !checkWinner(newBoard)) {
      setIsXNext(false);
      setTimeout(() => makeAIMove(newBoard), 400); // Penundaan respons AI
    } else {
      setIsXNext(!isXNext);
    }
  };

  // Reset Permainan
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="game-container">
    <div className='text-center text-white p-2'>Games</div>
      
      <div className="mode-toggle">
        <button 
          className={!vsAI ? 'active' : ''} 
          onClick={() => { setVsAI(false); resetGame(); }}
        >
          2 Player
        </button>
        <button 
          className={vsAI ? 'active' : ''} 
          onClick={() => { setVsAI(true); resetGame(); }}
        >
          Lawan AI
        </button>
      </div>

      <div className="status text-white">
        {winner 
          ? `Pemenang: ${winner}` 
          : isDraw 
          ? 'Hasil Seri!' 
          : `Giliran: ${isXNext ? 'X' : 'O'}`}
      </div>

      <div className="board">
        {board.map((cell, idx) => (
          <button 
            key={idx} 
            className="square" 
            onClick={() => handleClick(idx)}
            disabled={vsAI && !isXNext}
          >
            {cell}
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={resetGame}>Ulangi Game</button>
    </div>
  );
}