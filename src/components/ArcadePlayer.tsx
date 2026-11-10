import React, { useState, useEffect, useRef } from "react";
import { PremadeGame } from "../data/premadeGames";
import {
  ArrowLeft,
  Trophy,
  Code2,
  Wrench,
  Terminal as TerminalIcon,
  Play,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from "lucide-react";
import { playSound } from "../lib/gameAudio";

interface ArcadePlayerProps {
  game: PremadeGame;
  onBack: () => void;
  onRemixInStudio: (game: PremadeGame) => void;
  onOpenAiAssist: (code: string, errorMsg?: string, lessonCtx?: any) => void;
}

export const ArcadePlayer: React.FC<ArcadePlayerProps> = ({
  game,
  onBack,
  onRemixInStudio,
  onOpenAiAssist,
}) => {
  const [showCodeInspector, setShowCodeInspector] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem(`milkypy_arcade_hs_${game.id}`) || "0", 10);
  });

  const updateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(`milkypy_arcade_hs_${game.id}`, score.toString());
      playSound("point");
    }
  };

  const addTerminalLog = (msg: string) => {
    setTerminalLogs((prev) => [...prev.slice(-40), msg]);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(game.code);
    setCopiedCode(true);
    playSound("click");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-7.5rem)] md:h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-950 font-sans text-slate-100 relative">
      {/* Top Game Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSound("click");
              onBack();
            }}
            className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Arcade Hall</span>
          </button>

          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-xs sm:text-sm font-black text-white tracking-tight flex items-center gap-2">
                <span>{game.title}</span>
                <span className="hidden md:inline text-[10px] font-mono font-normal text-purple-400">
                  {game.genre}
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-[11px]">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">HIGH:</span>
            <strong className="text-amber-400 tabular-nums">{highScore}</strong>
          </div>

          <button
            onClick={() => {
              playSound("click");
              setShowCodeInspector(!showCodeInspector);
            }}
            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
              showCodeInspector
                ? "bg-purple-600 text-white border-purple-500 shadow-md"
                : "bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-850"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Game Logic</span>
          </button>

          <button
            onClick={() => {
              playSound("boost");
              onRemixInStudio(game);
            }}
            className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Remix</span>
          </button>
        </div>
      </div>

      {/* Main Playing Area with split code drawer */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Game Stage Area */}
        <div className="flex-1 flex flex-col min-h-0 relative bg-slate-950 overflow-hidden">
          {/* Specific game renderer */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
            {game.id === "pacman-classic" && (
              <PacmanGameStage onUpdateScore={updateHighScore} onLog={addTerminalLog} />
            )}
            {game.id === "snake-ascii" && (
              <SnakeGameStage onUpdateScore={updateHighScore} onLog={addTerminalLog} />
            )}
            {game.id === "tictactoe-ai" && (
              <TicTacToeGameStage onUpdateScore={updateHighScore} onLog={addTerminalLog} />
            )}
            {game.id === "hangman" && (
              <HangmanGameStage onUpdateScore={updateHighScore} onLog={addTerminalLog} />
            )}
          </div>

          {/* Collapsible Terminal Output Bar */}
          <div className="border-t border-slate-800 bg-slate-900/95 shrink-0">
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="w-full px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>Python Standard Output Stream</span>
                {terminalLogs.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-[10px]">
                    {terminalLogs.length} events
                  </span>
                )}
              </div>
              {showTerminal ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

            {showTerminal && (
              <div className="h-32 bg-slate-950 p-3 overflow-y-auto font-mono text-xs text-slate-300 space-y-1 border-t border-slate-800/80">
                {terminalLogs.length === 0 ? (
                  <p className="text-slate-500 italic">Terminal is silent. Execute game controls to trigger events.</p>
                ) : (
                  terminalLogs.map((log, i) => (
                    <p key={i} className="leading-relaxed border-l-2 border-slate-800 pl-2">
                      <span className="text-purple-400 font-bold mr-1.5">&gt;_</span>
                      {log}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating/Collapsible Code Inspector Drawer */}
        {showCodeInspector && (
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 min-h-0 relative z-10 animate-in slide-in-from-bottom lg:slide-in-from-right">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
              <span className="text-xs font-mono text-purple-400 font-bold">Source: main.py</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-[11px]"
                  title="Copy Python Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 bg-slate-950/80 whitespace-pre leading-relaxed select-text">
              {game.code}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   GAME STAGE 1: PACMAN CLASSIC
   ========================================================================= */
const PacmanGameStage: React.FC<{
  onUpdateScore: (s: number) => void;
  onLog: (m: string) => void;
}> = ({ onUpdateScore, onLog }) => {
  const [pacman, setPacman] = useState<[number, number]>([4, 5]);
  const [ghosts, setGhosts] = useState<[number, number][]>([[1, 1], [7, 1]]);
  const [pellets, setPellets] = useState<[number, number][]>(() => {
    const initialPellets: [number, number][] = [];
    const layout = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (layout[r][c] === 0 && !(r === 4 && c === 5)) {
          initialPellets.push([c, r]);
        }
      }
    }
    return initialPellets;
  });
  const [score, setScore] = useState(0);
  const [dir, setDir] = useState<[number, number]>([0, 0]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const resetGame = () => {
    setPacman([4, 5]);
    setGhosts([[1, 1], [7, 1]]);
    const initialPellets: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (maze[r][c] === 0 && !(r === 4 && c === 5)) {
          initialPellets.push([c, r]);
        }
      }
    }
    setPellets(initialPellets);
    setScore(0);
    setDir([0, 0]);
    setIsGameOver(false);
    setIsWon(false);
    setIsRunning(true);
    playSound("boost");
    onLog("Pac-Man Classic initialized. Use Arrow keys or WASD to eat all pellets!");
  };

  const handleMove = (dx: number, dy: number) => {
    if (!isRunning || isGameOver || isWon) return;
    const nextX = pacman[0] + dx;
    const nextY = pacman[1] + dy;

    if (nextX >= 0 && nextX < 9 && nextY >= 0 && nextY < 9 && maze[nextY][nextX] !== 1) {
      setDir([dx, dy]);
      playSound("click");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        handleMove(0, -1);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        handleMove(0, 1);
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleMove(-1, 0);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        handleMove(1, 0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pacman, isRunning, isGameOver, isWon]);

  useEffect(() => {
    if (!isRunning || isGameOver || isWon) return;

    const timer = setInterval(() => {
      setPacman((prevPac) => {
        if (dir[0] === 0 && dir[1] === 0) return prevPac;

        const nextX = prevPac[0] + dir[0];
        const nextY = prevPac[1] + dir[1];

        if (nextX < 0 || nextX >= 9 || nextY < 0 || nextY >= 9 || maze[nextY][nextX] === 1) {
          return prevPac;
        }

        const newPac: [number, number] = [nextX, nextY];

        setPellets((prevPellets) => {
          const isPelletEaten = prevPellets.some((p) => p[0] === newPac[0] && p[1] === newPac[1]);
          if (isPelletEaten) {
            const nextScore = score + 10;
            setScore(nextScore);
            onUpdateScore(nextScore);
            playSound("point");

            const remaining = prevPellets.filter((p) => !(p[0] === newPac[0] && p[1] === newPac[1]));
            if (remaining.length === 0) {
              setIsWon(true);
              setIsRunning(false);
              playSound("success");
              onLog(`Congratulations! You cleared all pellets! Score: ${nextScore}`);
            } else {
              onLog(`Chomped pellet! Remaining: ${remaining.length}, Score: ${nextScore}`);
            }
            return remaining;
          }
          return prevPellets;
        });

        return newPac;
      });

      setGhosts((prevGhosts) => {
        return prevGhosts.map((ghost) => {
          const possibleMoves: [number, number][] = [];
          const dirs: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0]];
          for (const [gDx, gDy] of dirs) {
            const gx = ghost[0] + gDx;
            const gy = ghost[1] + gDy;
            if (gx >= 0 && gx < 9 && gy >= 0 && gy < 9 && maze[gy][gx] !== 1) {
              possibleMoves.push([gx, gy]);
            }
          }

          if (possibleMoves.length > 0) {
            if (Math.random() < 0.6) {
              let bestMove = possibleMoves[0];
              let minDist = Infinity;
              for (const move of possibleMoves) {
                const dist = Math.hypot(move[0] - pacman[0], move[1] - pacman[1]);
                if (dist < minDist) {
                  minDist = dist;
                  bestMove = move;
                }
              }
              return bestMove;
            } else {
              return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            }
          }
          return ghost;
        });
      });
    }, 280);

    return () => clearInterval(timer);
  }, [isRunning, isGameOver, isWon, dir, pellets, score, pacman]);

  useEffect(() => {
    if (!isRunning || isGameOver || isWon) return;
    const hit = ghosts.some((g) => g[0] === pacman[0] && g[1] === pacman[1]);
    if (hit) {
      setIsGameOver(true);
      setIsRunning(false);
      playSound("crash");
      playSound("gameover");
      onLog("Collision with ghost! Game Over!");
    }
  }, [pacman, ghosts, isRunning, isGameOver, isWon]);

  return (
    <div className="flex flex-col items-center gap-4 max-w-md w-full">
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold">SCORE:</span>
          <span className="text-lg font-black text-white">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">PELLETS:</span>
          <span className="text-slate-200 font-bold">{pellets.length}</span>
        </div>
      </div>

      <div className="relative bg-slate-900 border-2 border-yellow-500/40 rounded-2xl p-2 shadow-2xl">
        <div
          className="grid gap-1 bg-slate-950 p-2 rounded-xl"
          style={{
            gridTemplateColumns: `repeat(9, minmax(0, 1fr))`,
            width: "320px",
            height: "320px",
          }}
        >
          {Array.from({ length: 81 }).map((_, index) => {
            const x = index % 9;
            const y = Math.floor(index / 9);
            const isWall = maze[y][x] === 1;
            const isPacman = pacman[0] === x && pacman[1] === y;
            const isGhost0 = ghosts[0][0] === x && ghosts[0][1] === y;
            const isGhost1 = ghosts[1][0] === x && ghosts[1][1] === y;
            const hasPellet = pellets.some((p) => p[0] === x && p[1] === y);

            return (
              <div
                key={index}
                className={`rounded-sm flex items-center justify-center transition-all ${
                  isWall
                    ? "bg-blue-900/60 border border-blue-700/50 shadow-xs"
                    : isPacman
                    ? "bg-yellow-400 rounded-full scale-105 shadow-md shadow-yellow-400/50"
                    : isGhost0
                    ? "bg-red-500 rounded-t-full rounded-b-sm scale-105 shadow-md shadow-red-500/50"
                    : isGhost1
                    ? "bg-pink-500 rounded-t-full rounded-b-sm scale-105 shadow-md shadow-pink-500/50"
                    : hasPellet
                    ? "bg-amber-100/10"
                    : "bg-slate-900/30"
                }`}
              >
                {isPacman && (
                  <div className="w-1.5 h-1.5 bg-slate-950 rounded-full ml-1" />
                )}
                {hasPellet && !isPacman && !isGhost0 && !isGhost1 && (
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-md animate-pulse" />
                )}
                {(isGhost0 || isGhost1) && (
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center">
                      <div className="w-0.5 h-0.5 bg-blue-600 rounded-full" />
                    </div>
                    <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center">
                      <div className="w-0.5 h-0.5 bg-blue-600 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {(!isRunning || isGameOver || isWon) && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center rounded-2xl gap-3 z-10">
            {isWon ? (
              <h3 className="text-xl font-black text-yellow-400 uppercase tracking-wider animate-bounce">
                Maze Cleared!
              </h3>
            ) : isGameOver ? (
              <h3 className="text-xl font-black text-rose-500 uppercase tracking-wider">
                Game Over!
              </h3>
            ) : (
              <h3 className="text-sm font-bold text-slate-300">Pac-man Classic</h3>
            )}
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-md cursor-pointer"
            >
              {isGameOver || isWon ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}
      </div>

      {/* D-Pad controls for mobile / touch */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <button
          onClick={() => handleMove(0, -1)}
          className="w-11 h-11 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center text-white active:scale-90 font-mono font-bold"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleMove(-1, 0)}
            className="w-11 h-11 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center text-white active:scale-90 font-mono font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => handleMove(0, 1)}
            className="w-11 h-11 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center text-white active:scale-90 font-mono font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => handleMove(1, 0)}
            className="w-11 h-11 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center text-white active:scale-90 font-mono font-bold"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME STAGE 2: SNAKE CLASSIC
   ========================================================================= */
const SnakeGameStage: React.FC<{
  onUpdateScore: (s: number) => void;
  onLog: (m: string) => void;
}> = ({ onUpdateScore, onLog }) => {
  const [snake, setSnake] = useState<[number, number][]>([[4, 4], [4, 5], [4, 6]]);
  const [food, setFood] = useState<[number, number]>([2, 2]);
  const [score, setScore] = useState(0);
  const [dir, setDir] = useState<[number, number]>([0, -1]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed] = useState(160);
  const gridDim = 10;

  const resetGame = () => {
    const initialSnake: [number, number][] = [[4, 4], [4, 5], [4, 6]];
    setSnake(initialSnake);
    setFood([2, 2]);
    setScore(0);
    setDir([0, -1]);
    setIsGameOver(false);
    setIsRunning(true);
    playSound("boost");
    onLog("Snake initialized on 10x10 field. Use Arrow keys or WASD.");
  };

  const handleMove = (dx: number, dy: number) => {
    if (!isRunning || isGameOver) return;
    if (snake.length > 1) {
      if (snake[0][0] + dx === snake[1][0] && snake[0][1] + dy === snake[1][1]) return;
    }
    setDir([dx, dy]);
    playSound("click");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        handleMove(0, -1);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        handleMove(0, 1);
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleMove(-1, 0);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        handleMove(1, 0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [snake, isRunning, isGameOver]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const timer = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead: [number, number] = [head[0] + dir[0], head[1] + dir[1]];

        if (newHead[0] < 0 || newHead[0] >= gridDim || newHead[1] < 0 || newHead[1] >= gridDim) {
          setIsGameOver(true);
          setIsRunning(false);
          playSound("crash");
          playSound("gameover");
          onLog("Collision with boundary wall. Game Over!");
          return prev;
        }

        if (prev.some((seg, idx) => idx !== prev.length - 1 && seg[0] === newHead[0] && seg[1] === newHead[1])) {
          setIsGameOver(true);
          setIsRunning(false);
          playSound("crash");
          playSound("gameover");
          onLog("Snake collided with its own tail. Game Over!");
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          const nextScore = score + 10;
          setScore(nextScore);
          onUpdateScore(nextScore);
          playSound("point");
          onLog(`Consumed fruit! Length: ${newSnake.length}, Score: ${nextScore}`);

          let newFoodCandidate: [number, number] = [
            Math.floor(Math.random() * gridDim),
            Math.floor(Math.random() * gridDim),
          ];
          while (newSnake.some((s) => s[0] === newFoodCandidate[0] && s[1] === newFoodCandidate[1])) {
            newFoodCandidate = [
              Math.floor(Math.random() * gridDim),
              Math.floor(Math.random() * gridDim),
            ];
          }
          setFood(newFoodCandidate);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isRunning, isGameOver, dir, food, score, speed]);

  return (
    <div className="flex flex-col items-center gap-4 max-w-md w-full">
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">SCORE:</span>
          <span className="text-lg font-black text-white">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">LENGTH:</span>
          <span className="text-slate-200 font-bold">{snake.length}</span>
        </div>
      </div>

      <div className="relative bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-2 shadow-2xl">
        <div
          className="grid gap-1 bg-slate-950 p-2 rounded-xl"
          style={{
            gridTemplateColumns: `repeat(${gridDim}, minmax(0, 1fr))`,
            width: "320px",
            height: "320px",
          }}
        >
          {Array.from({ length: gridDim * gridDim }).map((_, index) => {
            const x = index % gridDim;
            const y = Math.floor(index / gridDim);
            const isHead = snake[0][0] === x && snake[0][1] === y;
            const isBody = snake.slice(1).some((s) => s[0] === x && s[1] === y);
            const isFood = food[0] === x && food[1] === y;

            return (
              <div
                key={index}
                className={`rounded-sm transition-all duration-75 flex items-center justify-center ${
                  isHead
                    ? "bg-emerald-400 shadow-md shadow-emerald-400/50 scale-105"
                    : isBody
                    ? "bg-emerald-600/80"
                    : isFood
                    ? "bg-rose-500 rounded-full animate-pulse shadow-md shadow-rose-500/60"
                    : "bg-slate-900/60"
                }`}
              >
                {isHead && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
              </div>
            );
          })}
        </div>

        {(!isRunning || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3">
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              {isGameOver ? "GAME OVER" : "CHOMPSNAKE READY"}
            </h3>
            {isGameOver && (
              <p className="text-xs text-slate-300 font-mono">
                Final Score: <strong className="text-emerald-400">{score}</strong>
              </p>
            )}
            <button
              onClick={resetGame}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isGameOver ? "Play Again" : "Start Game"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 pt-1">
        <button
          onClick={() => handleMove(0, -1)}
          className="w-11 h-11 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center text-white active:scale-90 font-mono font-bold"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleMove(-1, 0)}
            className="w-11 h-11 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center text-white active:scale-90 font-mono font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => handleMove(0, 1)}
            className="w-11 h-11 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center text-white active:scale-90 font-mono font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => handleMove(1, 0)}
            className="w-11 h-11 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center text-white active:scale-90 font-mono font-bold"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME STAGE 3: TICTACTOE MINIMAX
   ========================================================================= */
const TicTacToeGameStage: React.FC<{
  onUpdateScore: (s: number) => void;
  onLog: (m: string) => void;
}> = ({ onUpdateScore, onLog }) => {
  const [board, setBoard] = useState<string[][]>([
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ]);
  const [winner, setWinner] = useState<string | null>(null);
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [draws, setDraws] = useState(0);

  const checkWinner = (b: string[][]): string | null => {
    for (let i = 0; i < 3; i++) {
      if (b[i][0] !== " " && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
      if (b[0][i] !== " " && b[0][i] === b[1][i] && b[1][i] === b[2][i]) return b[0][i];
    }
    if (b[0][0] !== " " && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
    if (b[0][2] !== " " && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];
    if (b.every((row) => row.every((c) => c !== " "))) return "Draw";
    return null;
  };

  const minimax = (tempBoard: string[][], depth: number, isMax: boolean): number => {
    const scoreWinner = checkWinner(tempBoard);
    if (scoreWinner === "O") return 10 - depth;
    if (scoreWinner === "X") return depth - 10;
    if (scoreWinner === "Draw") return 0;

    if (isMax) {
      let best = -Infinity;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (tempBoard[r][c] === " ") {
            tempBoard[r][c] = "O";
            best = Math.max(best, minimax(tempBoard, depth + 1, false));
            tempBoard[r][c] = " ";
          }
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (tempBoard[r][c] === " ") {
            tempBoard[r][c] = "X";
            best = Math.min(best, minimax(tempBoard, depth + 1, true));
            tempBoard[r][c] = " ";
          }
        }
      }
      return best;
    }
  };

  const getBestMove = (currentBoard: string[][]): [number, number] => {
    let bestVal = -Infinity;
    let bestMove: [number, number] = [-1, -1];

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (currentBoard[r][c] === " ") {
          currentBoard[r][c] = "O";
          const moveVal = minimax(currentBoard, 0, false);
          currentBoard[r][c] = " ";

          if (moveVal > bestVal) {
            bestVal = moveVal;
            bestMove = [r, c];
          }
        }
      }
    }
    return bestMove;
  };

  const resetBoard = () => {
    setBoard([
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ]);
    setWinner(null);
    onLog("Game reset. You are X. Make your first move.");
    playSound("boost");
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] !== " " || winner) return;

    playSound("click");
    const nextBoard = board.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? "X" : cell))
    );
    setBoard(nextBoard);

    let currentWinner = checkWinner(nextBoard);
    if (currentWinner) {
      handleEndGame(currentWinner, nextBoard);
      return;
    }

    // AI Turn (Minimax)
    const [aiRow, aiCol] = getBestMove(nextBoard);
    if (aiRow !== -1 && aiCol !== -1) {
      nextBoard[aiRow][aiCol] = "O";
      setBoard(nextBoard);
      currentWinner = checkWinner(nextBoard);
      if (currentWinner) {
        handleEndGame(currentWinner, nextBoard);
        return;
      }
    }
  };

  const handleEndGame = (resWinner: string, finalBoard: string[][]) => {
    setWinner(resWinner);
    if (resWinner === "X") {
      setPlayerWins((w) => w + 1);
      onUpdateScore((playerWins + 1) * 30);
      playSound("success");
      onLog("You won! You outsmarted the AI algorithm.");
    } else if (resWinner === "O") {
      setAiWins((w) => w + 1);
      playSound("crash");
      onLog("Minimax AI claims victory. Game Over!");
    } else {
      setDraws((d) => d + 1);
      playSound("click");
      onLog("It's a draw! Mathematical equilibrium reached.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-md w-full">
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs">
        <div className="text-blue-400">WINS: <strong className="text-white">{playerWins}</strong></div>
        <div className="text-rose-400">AI: <strong className="text-white">{aiWins}</strong></div>
        <div className="text-slate-400">DRAWS: <strong className="text-white">{draws}</strong></div>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-900 border border-slate-800 p-4 rounded-2xl w-72 h-72 shadow-2xl relative">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <button
              key={`${rIdx}-${cIdx}`}
              onClick={() => handleClick(rIdx, cIdx)}
              disabled={cell !== " " || !!winner}
              className={`bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-black text-2xl transition-all duration-150 transform hover:scale-102 ${
                cell === "X"
                  ? "text-blue-400 shadow-inner"
                  : cell === "O"
                  ? "text-rose-400 shadow-inner"
                  : "text-slate-600 hover:bg-slate-850 cursor-pointer"
              }`}
            >
              {cell}
            </button>
          ))
        )}

        {winner && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center rounded-2xl gap-3">
            <h3 className="text-lg font-black tracking-wider uppercase text-white">
              {winner === "Draw" ? "Draw Game" : winner === "X" ? "You Won!" : "AI Wins"}
            </h3>
            <button
              onClick={resetBoard}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md cursor-pointer transition-all"
            >
              Next Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   GAME STAGE 4: HANGMAN CLASSIC
   ========================================================================= */
const HangmanGameStage: React.FC<{
  onUpdateScore: (s: number) => void;
  onLog: (m: string) => void;
}> = ({ onUpdateScore, onLog }) => {
  const db: Record<string, string[]> = {
    Programming: ["PYTHON", "COMPILER", "ALGORITHM", "VARIABLE", "FUNCTION"],
    Astronomy: ["PLANET", "STAR", "GALAXY", "NEBULA", "GRAVITY"],
    Dessert: ["CHOCOLATE", "COOKIE", "MILKSHAKE", "CUPCAKE"]
  };

  const categories = Object.keys(db);
  const [category, setCategory] = useState(categories[0]);
  const [word, setSecretWord] = useState("");
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(6);

  const startNewWord = (catName = category) => {
    const list = db[catName];
    const picked = list[Math.floor(Math.random() * list.length)];
    setSecretWord(picked);
    setGuessed(new Set());
    setLives(6);
    onLog(`Hangman word selected. Category: ${catName}. Find all letters!`);
    playSound("boost");
  };

  useEffect(() => {
    startNewWord();
  }, []);

  const handleGuess = (char: string) => {
    if (guessed.has(char) || lives <= 0 || isWon) return;

    playSound("click");
    const nextGuessed = new Set(guessed);
    nextGuessed.add(char);
    setGuessed(nextGuessed);

    if (!word.includes(char)) {
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        playSound("crash");
        onLog(`Failed! The secret word was: ${word}.`);
      } else {
        onLog(`Letter ${char} not found! Attempts left: ${nextLives}`);
      }
    } else {
      playSound("point");
      // Check win
      const checkWon = word.split("").every((l) => nextGuessed.has(l));
      if (checkWon) {
        playSound("success");
        onUpdateScore(50);
        onLog(`Excellent! Word resolved: ${word}. +50 Points.`);
      } else {
        onLog(`Excellent! Letter ${char} matched.`);
      }
    }
  };

  const isWon = word.length > 0 && word.split("").every((l) => guessed.has(l));
  const isLost = lives <= 0;

  const displayGallows = (failedAttempts: number) => {
    const stages = [
      `
      +---+
      |   |
          |
          |
          |
          |
    =========`,
      `
      +---+
      |   |
      O   |
          |
          |
          |
    =========`,
      `
      +---+
      |   |
      O   |
      |   |
          |
          |
    =========`,
      `
      +---+
      |   |
     /O   |
      |   |
          |
          |
    =========`,
      `
      +---+
      |   |
     /O\\  |
      |   |
          |
          |
    =========`,
      `
      +---+
      |   |
     /O\\  |
      |   |
     /    |
          |
    =========`,
      `
      +---+
      |   |
     /O\\  |
      |   |
     / \\  |
          |
    =========`,
    ];
    return stages[failedAttempts];
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-sm w-full">
      <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
        <span className="text-slate-400">CATEGORY:</span>
        <span className="text-white font-extrabold">{category}</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              startNewWord(cat);
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
              category === cat
                ? "bg-purple-600 border-purple-500 text-white"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl w-full">
        <pre className="font-mono text-[10px] text-purple-400 leading-tight select-none">
          {displayGallows(6 - lives)}
        </pre>

        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="flex gap-2">
            {word.split("").map((letter, i) => (
              <span
                key={i}
                className="w-7 h-9 border-b-2 border-slate-700 flex items-center justify-center text-lg font-black font-mono tracking-wider text-white"
              >
                {guessed.has(letter) || isLost ? letter : "_"}
              </span>
            ))}
          </div>

          <div className="text-center font-mono text-[11px] text-slate-400">
            {isWon ? (
              <span className="text-emerald-400 font-bold uppercase tracking-wider animate-pulse">
                Word Cleared!
              </span>
            ) : isLost ? (
              <span className="text-rose-500 font-bold uppercase tracking-wider">
                Gallows Built!
              </span>
            ) : (
              <span>LIVES LEFT: <strong className="text-white">{lives}</strong></span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 max-w-full">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
          <button
            key={char}
            onClick={() => handleGuess(char)}
            disabled={guessed.has(char) || isWon || isLost}
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs transition border cursor-pointer ${
              guessed.has(char)
                ? word.includes(char)
                  ? "bg-emerald-950/40 text-emerald-500 border-emerald-800/50"
                  : "bg-rose-950/40 text-rose-500 border-rose-800/50"
                : "bg-slate-950 border-slate-850 hover:bg-slate-800 text-slate-200"
            }`}
          >
            {char}
          </button>
        ))}
      </div>

      {(isWon || isLost) && (
        <button
          onClick={() => startNewWord()}
          className="mt-2 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isWon ? "Next Word" : "Try Another Word"}</span>
        </button>
      )}
    </div>
  );
};
