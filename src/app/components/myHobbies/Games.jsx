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
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [isThinking, setIsThinking] = useState(false);

  // Cek Pemenang dan Kembalikan Baris Menangnya
  const checkWinnerDetails = (squares) => {
    for (let combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo };
      }
    }
    return { winner: null, line: [] };
  };

  const { winner, line } = checkWinnerDetails(board);
  const isDraw = !winner && board.every((square) => square !== null);

  // AI Cerdas (Minimax / Sederhana dengan Blok & Win)
  const getBestMove = (currentBoard) => {
    const emptyIndices = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    // 1. Cek apakah AI ('O') bisa menang dalam 1 langkah
    for (let idx of emptyIndices) {
      const tempBoard = [...currentBoard];
      tempBoard[idx] = 'O';
      if (checkWinnerDetails(tempBoard).winner === 'O') return idx;
    }

    // 2. Cek apakah Player ('X') bisa menang dalam 1 langkah, lalu blok
    for (let idx of emptyIndices) {
      const tempBoard = [...currentBoard];
      tempBoard[idx] = 'X';
      if (checkWinnerDetails(tempBoard).winner === 'X') return idx;
    }

    // 3. Ambil tengah jika kosong
    if (currentBoard[4] === null) return 4;

    // 4. Random jika tidak ada kondisi di atas
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  };

  const makeAIMove = (currentBoard) => {
    const bestIdx = getBestMove(currentBoard);
    if (bestIdx === undefined) return;

    const newBoard = [...currentBoard];
    newBoard[bestIdx] = 'O';

    const result = checkWinnerDetails(newBoard);
    setBoard(newBoard);
    if (result.winner) {
      setWinningLine(result.line);
      setScores(prev => ({ ...prev, O: prev.O + 1 }));
    } else if (newBoard.every(sq => sq !== null)) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setIsXNext(true);
    }
    setIsThinking(false);
  };

  const handleClick = (index) => {
    if (board[index] || winner || (vsAI && !isXNext) || isThinking) return;

    const newBoard = [...board];
    const currentPlayer = isXNext ? 'X' : 'O';
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinnerDetails(newBoard);

    if (result.winner) {
      setWinningLine(result.line);
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
    } else if (newBoard.every(sq => sq !== null)) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      if (vsAI && isXNext) {
        setIsXNext(false);
        setIsThinking(true);
        setTimeout(() => makeAIMove(newBoard), 500);
      } else {
        setIsXNext(!isXNext);
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinningLine([]);
    setIsThinking(false);
  };

  return (
    <section className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Header Title */}
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
            Mini Game
          </span>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-white">Tic Tac Toe</h2>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-950 p-1 rounded-2xl border border-gray-800 mb-6">
          <button 
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${!vsAI ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setVsAI(false); resetGame(); setScores({ X: 0, O: 0, draws: 0 }); }}
          >
            2 Player
          </button>
          <button 
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${vsAI ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setVsAI(true); resetGame(); setScores({ X: 0, O: 0, draws: 0 }); }}
          >
            Lawan AI
          </button>
        </div>

        {/* Skor & Status */}
        <div className="flex justify-between items-center bg-gray-950/60 border border-gray-800/80 rounded-2xl p-4 mb-6 text-center">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Player X</span>
            <span className="text-lg font-extrabold text-pink-400">{scores.X}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Seri</span>
            <span className="text-lg font-extrabold text-gray-300">{scores.draws}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">{vsAI ? 'AI (O)' : 'Player O'}</span>
            <span className="text-lg font-extrabold text-indigo-400">{scores.O}</span>
          </div>
        </div>

        {/* Status Giliran / Pemenang */}
        <div className="text-center mb-6 h-7 flex items-center justify-center">
          {winner ? (
            <span className="text-sm font-extrabold text-pink-400 animate-bounce tracking-wide bg-pink-500/10 border border-pink-500/20 px-4 py-1 rounded-full">
              🎉 Pemenang: {winner} {winner === 'X' ? '✨' : '🤖'}
            </span>
          ) : isDraw ? (
            <span className="text-sm font-bold text-gray-400 bg-gray-800/50 px-4 py-1 rounded-full">
              🤝 Hasil Seri!
            </span>
          ) : isThinking ? (
            <span className="text-xs font-medium text-pink-400 animate-pulse">
              AI sedang berpikir... 🤔
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-400">
              Giliran pemain: <strong className="text-white">{isXNext ? 'X' : 'O'}</strong>
            </span>
          )}
        </div>

        {/* Board Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine.includes(idx);
            return (
              <button 
                key={idx} 
                onClick={() => handleClick(idx)}
                disabled={cell !== null || winner !== null || isThinking}
                className={`h-24 sm:h-28 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all duration-300 border ${
                  isWinningCell 
                    ? 'bg-pink-600/30 border-pink-500 text-pink-400 shadow-lg shadow-pink-500/20 scale-105' 
                    : cell 
                    ? 'bg-gray-800/80 border-gray-700 text-white' 
                    : 'bg-gray-950/80 border-gray-800/80 hover:border-gray-700 hover:bg-gray-800/40 text-transparent'
                }`}
              >
                <span className={`transition-transform duration-300 ${cell ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} ${cell === 'X' ? 'text-pink-400' : 'text-indigo-400'}`}>
                  {cell}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tombol Reset */}
        <button 
          onClick={resetGame}
          className="w-full py-3 px-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-sm font-bold text-white transition-all shadow-lg active:scale-95"
        >
          Reset Permainan
        </button>

      </div>
    </section>
  );
}