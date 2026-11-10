import React, { useState } from "react";
import { PremadeGame } from "../data/premadeGames";
import {
  Play,
  Code2,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  BookOpen,
  Wrench,
  Search,
  Gamepad2,
  Grid3X3,
  Type,
  GitCommit
} from "lucide-react";
import { playSound } from "../lib/gameAudio";

const getGameIcon = (id: string) => {
  switch (id) {
    case "pacman-classic":
      return <Gamepad2 className="w-6 h-6 text-amber-500 shrink-0" />;
    case "snake-ascii":
      return <GitCommit className="w-6 h-6 text-emerald-500 shrink-0" />;
    case "tictactoe-ai":
      return <Grid3X3 className="w-6 h-6 text-blue-500 shrink-0" />;
    case "hangman":
      return <Type className="w-6 h-6 text-purple-500 shrink-0" />;
    default:
      return <Gamepad2 className="w-6 h-6 text-slate-500 shrink-0" />;
  }
};

interface ArcadeCatalogProps {
  games: PremadeGame[];
  onSelectGame: (game: PremadeGame) => void;
  onInspectCode: (game: PremadeGame) => void;
  onRemixInStudio: (game: PremadeGame) => void;
}

export const ArcadeCatalog: React.FC<ArcadeCatalogProps> = ({
  games,
  onSelectGame,
  onInspectCode,
  onRemixInStudio,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const genres = ["All", "Retro/Action", "Adventure/RPG", "Strategy/Board", "Word/Puzzle", "Casual"];

  const filteredGames = games.filter((game) => {
    const matchesGenre = selectedGenre === "All" || game.genre === selectedGenre;
    const matchesQuery =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.conceptsDemonstrated.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 py-4 md:px-8 space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>4 Playable Python Titles · WebAssembly Engine</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase font-sans">
            Python Arcade Hall
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Real games powered by real Python code. Play classic retro arcade titles, test your wits against minimax AI, explore turn-based dungeons, or jump straight into the code to customize game mechanics.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Real-Time State Telemetry</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Local High Scores</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>One-Click Code Remix</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Genre buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                playSound("click");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedGenre === genre
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games or concepts..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredGames.map((game) => {
          const difficultyColor =
            game.difficulty === "Beginner"
              ? "text-emerald-400"
              : game.difficulty === "Intermediate"
              ? "text-amber-400"
              : "text-purple-400";

          return (
            <div
              key={game.id}
              className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-purple-900/20 group relative overflow-hidden"
            >
              {/* Subtle accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />

              <div className="space-y-3">
                {/* Header: Icon, Category & Difficulty */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                      {getGameIcon(game.id)}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                        {game.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5">
                        <span>{game.genre}</span>
                        <span>•</span>
                        <span className={`font-bold ${difficultyColor}`}>{game.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>

                {/* Concepts demonstrated tags */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Concepts Taught:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {game.conceptsDemonstrated.slice(0, 3).map((concept, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
                      >
                        {concept}
                      </span>
                    ))}
                    {game.conceptsDemonstrated.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                        +{game.conceptsDemonstrated.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playSound("click");
                      onInspectCode(game);
                    }}
                    title="Inspect Python source code"
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[11px] font-mono">Code</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    playSound("boost");
                    onSelectGame(game);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-purple-600/30 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
