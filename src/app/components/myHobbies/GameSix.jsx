import React, { useState, useEffect } from 'react';
import { IoReload, IoTrophy, IoPlay, IoTime } from 'react-icons/io5';

export default function GameSix() {
  const BOARD_SIZE = 8;
  const GAME_TIME = 60; // Waktu awal dalam detik
  const [board, setBoard] = useState(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0))
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pieces, setPieces] = useState([]);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);

  const SHAPES = [
    [[1]], 
    [[1, 1]], 
    [[1], [1]], 
    [[1, 1], [1, 1]], 
    [[1, 1, 1]], 
    [[1], [1], [1]], 
    [[1, 1], [1, 0]], 
    [[1, 1, 1], [1, 0, 0]]
  ];

  // Efek untuk Timer Game
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const generateRandomPieces = () => {
    const newPieces = [];
    for (let i = 0; i < 3; i++) {
      const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      newPieces.push({ id: Math.random(), shape: randomShape, used: false });
    }
    return newPieces;
  };

  const startGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)));
    setScore(0);
    setTimeLeft(GAME_TIME);
    setPieces(generateRandomPieces());
    setSelectedPieceIndex(null);
    setIsPlaying(true);
  };

  const checkLines = (currentBoard) => {
    let newBoard = currentBoard.map(row => [...row]);
    let rowsToClear = [];
    let colsToClear = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
      if (newBoard[r].every(cell => cell === 1)) {
        rowsToClear.push(r);
      }
    }

    for (let c = 0; c < BOARD_SIZE; c++) {
      let isColFull = true;
      for (let r = 0; r < BOARD_SIZE; r++) {
        if (newBoard[r][c] === 0) {
          isColFull = false;
          break;
        }
      }
      if (isColFull) colsToClear.push(c);
    }

    let clearedCount = rowsToClear.length + colsToClear.length;
    if (clearedCount > 0) {
      rowsToClear.forEach(r => {
        newBoard[r] = Array(BOARD_SIZE).fill(0);
      });
      colsToClear.forEach(c => {
        for (let r = 0; r < BOARD_SIZE; r++) {
          newBoard[r][c] = 0;
        }
      });

      const points = clearedCount * 100 * clearedCount;
      setScore(prev => {
        const updated = prev + points;
        setHighScore(h => (updated > h ? updated : h));
        return updated;
      });
    }

    return newBoard;
  };

  const isGameOver = (currentBoard, currentPieces) => {
    const availablePieces = currentPieces.filter(p => !p.used);
    if (availablePieces.length === 0) return false;

    for (let p of availablePieces) {
      const shape = p.shape;
      const sRows = shape.length;
      const sCols = shape[0].length;

      let canFitAnywhere = false;
      for (let r = 0; r <= BOARD_SIZE - sRows; r++) {
        for (let c = 0; c <= BOARD_SIZE - sCols; c++) {
          let fits = true;
          for (let sr = 0; sr < sRows; sr++) {
            for (let sc = 0; sc < sCols; sc++) {
              if (shape[sr][sc] === 1 && currentBoard[r + sr][c + sc] === 1) {
                fits = false;
                break;
              }
            }
            if (!fits) break;
          }
          if (fits) {
            canFitAnywhere = true;
            break;
          }
        }
        if (canFitAnywhere) break;
      }
      if (canFitAnywhere) return false;
    }
    return true;
  };

  const handleCellClick = (startR, startC) => {
    if (!isPlaying || selectedPieceIndex === null) return;
    const piece = pieces[selectedPieceIndex];
    if (piece.used) return;

    const shape = piece.shape;
    const sRows = shape.length;
    const sCols = shape[0].length;

    let fits = true;
    for (let sr = 0; sr < sRows; sr++) {
      for (let sc = 0; sc < sCols; sc++) {
        if (shape[sr][sc] === 1) {
          if (startR + sr >= BOARD_SIZE || startC + sc >= BOARD_SIZE || board[startR + sr][startC + sc] === 1) {
            fits = false;
            break;
          }
        }
      }
      if (!fits) break;
    }

    if (!fits) return;

    let newBoard = board.map(row => [...row]);
    let blockCount = 0;
    for (let sr = 0; sr < sRows; sr++) {
      for (let sc = 0; sc < sCols; sc++) {
        if (shape[sr][sc] === 1) {
          newBoard[startR + sr][startC + sc] = 1;
          blockCount++;
        }
      }
    }

    // Tambah waktu 5 detik saat berhasil meletakkan balok
    setTimeLeft(prev => prev + 5);

    setScore(prev => {
      const updated = prev + blockCount * 10;
      setHighScore(h => (updated > h ? updated : h));
      return updated;
    });

    newBoard = checkLines(newBoard);
    setBoard(newBoard);

    const updatedPieces = pieces.map((p, idx) => (idx === selectedPieceIndex ? { ...p, used: true } : p));
    const allUsed = updatedPieces.every(p => p.used);
    const finalPieces = allUsed ? generateRandomPieces() : updatedPieces;

    setPieces(finalPieces);
    setSelectedPieceIndex(null);

    if (isGameOver(newBoard, finalPieces)) {
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">

        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-lg font-extrabold tracking-wider text-pink-500 uppercase">Block Blast</h1>
            <p className="text-xs text-gray-400">Pilih balok bawah, lalu klik petak papan!</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 font-mono">
            <IoTrophy className="text-amber-400" size={16} />
            <span className="text-xs font-bold">{highScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-gray-950/60 p-4 rounded-2xl border border-gray-800 mb-6 font-mono text-sm items-center">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">Skor</span>
            <span className="text-xl font-bold text-pink-400">{score}</span>
          </div>
          <div className="text-center">
            <span className="text-gray-400 block text-[10px] uppercase flex items-center justify-center gap-1">
              <IoTime size={12} className="text-pink-400" /> Waktu
            </span>
            <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="text-right">
            {selectedPieceIndex !== null && (
              <span className="text-pink-400 text-[9px] uppercase animate-pulse font-bold block">Pilih Papan</span>
            )}
          </div>
        </div>

        <div className="relative w-full aspect-square bg-gray-950 rounded-2xl border border-gray-800 p-2 overflow-hidden shadow-inner flex items-center justify-center mb-6">
          {!isPlaying && score === 0 && timeLeft === GAME_TIME && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <button 
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-500 font-bold text-sm shadow-lg shadow-pink-600/35 transition-all active:scale-95 cursor-pointer"
              >
                <IoPlay size={18} /> Mulai Game
              </button>
            </div>
          )}

          {(!isPlaying && (score > 0 || timeLeft === 0)) && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <h3 className="text-base font-bold text-white">Game Over!</h3>
              <p className="text-xs text-gray-400">Skor Akhir: <strong className="text-pink-400">{score}</strong></p>
              <button 
                onClick={startGame}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 font-bold text-xs shadow-lg shadow-pink-600/35 transition-all active:scale-95 mt-2 cursor-pointer"
              >
                <IoReload size={16} /> Main Lagi
              </button>
            </div>
          )}

          <div 
            className="grid w-full h-full bg-gray-900/40 rounded-xl gap-1 p-1"
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-full h-full rounded-md transition-all duration-200 cursor-pointer ${
                    cell === 1 ? 'bg-pink-500 shadow-md shadow-pink-500/40' : 'bg-gray-800/50 hover:bg-gray-700/80'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-gray-950/40 p-4 rounded-2xl border border-gray-800 min-h-[100px] items-center justify-items-center">
          {pieces.map((piece, pIdx) => {
            const isSelected = selectedPieceIndex === pIdx;
            return (
              <div 
                key={piece.id}
                onClick={() => {
                  if (!piece.used && isPlaying) {
                    setSelectedPieceIndex(isSelected ? null : pIdx);
                  }
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  piece.used 
                    ? 'opacity-30 border-transparent bg-transparent cursor-default' 
                    : isSelected 
                      ? 'bg-gray-800 border-pink-500 ring-2 ring-pink-500/50 shadow-lg scale-105' 
                      : 'bg-gray-900 border-gray-700 hover:border-pink-400 shadow-md'
                }`}
              >
                {!piece.used && (
                  <div 
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${piece.shape[0].length}, minmax(0, 1fr))`
                    }}
                  >
                    {piece.shape.map((row, sr) =>
                      row.map((val, sc) => (
                        <div 
                          key={`${sr}-${sc}`}
                          className={`w-3.5 h-3.5 rounded-sm ${val === 1 ? 'bg-pink-500 shadow-sm' : 'bg-transparent'}`}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}