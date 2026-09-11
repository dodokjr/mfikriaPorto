import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IoReload, IoTrophy, IoPlay, IoArrowUp, IoArrowDown,IoArrowBackSharp, IoArrowForwardOutline } from 'react-icons/io5';

export default function GamesFive() {
  const GRID_SIZE = 15;
  const [snake, setSnake] = useState([
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 7, y: 9 }
  ]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [direction, setDirection] = useState('UP');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const collision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!collision) break;
    }
    return newFood;
  };

  const startGame = () => {
    const initialSnake = [
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 7, y: 9 }
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('UP');
    setScore(0);
    setIsPlaying(true);
  };

  const gameOver = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const changeDirection = (newDir) => {
    const current = directionRef.current;
    if (
      (newDir === 'UP' && current !== 'DOWN') ||
      (newDir === 'DOWN' && current !== 'UP') ||
      (newDir === 'LEFT' && current !== 'RIGHT') ||
      (newDir === 'RIGHT' && current !== 'LEFT')
    ) {
      setDirection(newDir);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowUp') changeDirection('UP');
      if (e.key === 'ArrowDown') changeDirection('DOWN');
      if (e.key === 'ArrowLeft') changeDirection('LEFT');
      if (e.key === 'ArrowRight') changeDirection('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = directionRef.current;

        if (currentDir === 'UP') head.y -= 1;
        if (currentDir === 'DOWN') head.y += 1;
        if (currentDir === 'LEFT') head.x -= 1;
        if (currentDir === 'RIGHT') head.x += 1;

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          gameOver();
          return prevSnake;
        }

        for (let i = 0; i < prevSnake.length; i++) {
          if (prevSnake[i].x === head.x && prevSnake[i].y === head.y) {
            gameOver();
            return prevSnake;
          }
        }

        let newSnake;
        if (head.x === food.x && head.y === food.y) {
          newSnake = [head, ...prevSnake];
          setScore((prev) => {
            const newScore = prev + 1;
            setHighScore((h) => (newScore > h ? newScore : h));
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake = [head, ...prevSnake.slice(0, -1)];
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, food, gameOver]);

  return (
    <div className="bg-gray-950 min-h-screen py-12 px-4 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">

        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-lg font-extrabold tracking-wider text-pink-500 uppercase">Mini Snake</h1>
            <p className="text-xs text-gray-400">Makan makanan sebanyak mungkin!</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 font-mono">
            <IoTrophy className="text-amber-400" size={16} />
            <span className="text-xs font-bold">{highScore}</span>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-950/60 p-4 rounded-2xl border border-gray-800 mb-6 font-mono text-sm">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">Skor Kamu</span>
            <span className="text-xl font-bold text-pink-400">{score}</span>
          </div>
        </div>

        <div className="relative w-full aspect-square bg-gray-950 rounded-2xl border border-gray-800 p-2 overflow-hidden shadow-inner flex items-center justify-center">
          {!isPlaying && score === 0 && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <button 
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-500 font-bold text-sm shadow-lg shadow-pink-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <IoPlay size={18} /> Mulai Game
              </button>
            </div>
          )}

          {!isPlaying && score > 0 && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <h3 className="text-base font-bold text-white">Game Over!</h3>
              <p className="text-xs text-gray-400">Skor Akhir: <strong className="text-pink-400">{score}</strong></p>
              <button 
                onClick={startGame}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 font-bold text-xs shadow-lg shadow-pink-600/30 transition-all active:scale-95 mt-2 cursor-pointer"
              >
                <IoReload size={16} /> Main Lagi
              </button>
            </div>
          )}

          <div 
            className="grid w-full h-full bg-gray-900/50 rounded-xl relative"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);

              const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
              const isHead = snake[0].x === x && snake[0].y === y;
              const isFood = food.x === x && food.y === y;

              let cellStyle = 'bg-transparent';
              if (isHead) {
                cellStyle = 'bg-pink-500 rounded-md scale-95 shadow-md shadow-pink-500/50';
              } else if (isSnake) {
                cellStyle = 'bg-pink-600/70 rounded-sm scale-90';
              } else if (isFood) {
                cellStyle = 'bg-rose-500 rounded-full animate-ping';
              }

              return <div key={index} className={`w-full h-full transition-all duration-75 ${cellStyle}`} />;
            })}
          </div>
        </div>

        {/* Tombol Kontrol Mobile/Opsional */}
        <div className="grid grid-cols-3 gap-2 mt-6 max-w-[200px] mx-auto">
          <div />
          <button 
            onClick={() => changeDirection('UP')}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center border border-gray-700 active:scale-95 cursor-pointer text-white"
          >
            <IoArrowUp size={18} />
          </button>
          <div />
          <button 
            onClick={() => changeDirection('LEFT')}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center border border-gray-700 active:scale-95 cursor-pointer text-white"
          >
            <IoArrowBackSharp/>
          </button>
          <button 
            onClick={() => changeDirection('DOWN')}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center border border-gray-700 active:scale-95 cursor-pointer text-white"
          >
            <IoArrowDown size={18} />
          </button>
          <button 
            onClick={() => changeDirection('RIGHT')}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center border border-gray-700 active:scale-95 cursor-pointer text-white"
          >
            <IoArrowForwardOutline/>
          </button>
        </div>

      </div>
    </div>
  );
}