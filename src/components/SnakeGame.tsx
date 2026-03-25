import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 5, y: 5 };
const SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 font-pixel">
      <div className="mb-6 flex justify-between items-end w-full max-w-[400px] text-neon-cyan">
        <div className="border-2 border-dashed border-neon-cyan/50 p-2 bg-black/40">
          <div 
            className="glitch-text text-2xl font-pixel tracking-tighter" 
            data-text={`SCORE: ${score}`}
          >
            SCORE: {score}
          </div>
        </div>
        <div className="glitch-hover text-xs font-mono uppercase tracking-widest opacity-80">
          STATUS: {gameOver ? 'DEAD' : isPaused ? 'PAUSED' : 'ACTIVE'}
        </div>
      </div>

      <div 
        className="relative neon-border bg-black/80 overflow-hidden"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-neon-cyan/20" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`absolute ${i === 0 ? 'bg-neon-cyan' : 'bg-neon-cyan/60'} neon-border`}
            initial={false}
            animate={{
              left: segment.x * 20,
              top: segment.y * 20,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ width: 18, height: 18, margin: 1 }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute bg-neon-magenta neon-border-magenta rounded-full neon-icon-magenta"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          style={{
            left: food.x * 20 + 2,
            top: food.y * 20 + 2,
            width: 16,
            height: 16,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10 screen-tear"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {gameOver ? (
                <>
                  <h2 className="text-neon-magenta text-2xl mb-4 glitch-text font-pixel" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                  <p className="text-neon-magenta/40 text-[8px] mb-6 tracking-[0.4em] uppercase">MEMORY_CORRUPTION_DETECTED</p>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-2 neon-border-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black transition-all font-pixel text-[10px] glitch-hover"
                  >
                    INIT_REBOOT
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-neon-cyan text-2xl mb-4 glitch-text font-pixel" data-text="STANDBY_MODE">STANDBY_MODE</h2>
                  <p className="text-neon-cyan/40 text-[8px] mb-6 tracking-[0.4em] uppercase">WAITING_FOR_OPERATOR_INPUT</p>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 neon-border text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-pixel text-[10px] glitch-hover"
                  >
                    RESUME_SYNC
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 text-[10px] text-neon-cyan/50 text-center leading-relaxed">
        [ ARROWS ] TO NAVIGATE<br />
        [ SPACE ] TO TOGGLE_STATE
      </div>
    </div>
  );
}
