import React, { useState } from "react";
import { PremadeGame, PREMADE_GAMES } from "../data/premadeGames";
import { ArcadeCatalog } from "./ArcadeCatalog";
import { ArcadePlayer } from "./ArcadePlayer";
import {
  Gamepad2,
  Volume2,
  VolumeX,
  Ticket
} from "lucide-react";
import { isGameAudioMuted, setGameAudioMuted, playSound } from "../lib/gameAudio";

interface GamesViewProps {
  onOpenAiAssist: (code: string, errorMsg?: string, lessonCtx?: any) => void;
  onPracticeClick: (code: string) => void;
}

export const GamesView: React.FC<GamesViewProps> = ({
  onOpenAiAssist,
}) => {
  const [selectedGame, setSelectedGame] = useState<PremadeGame | null>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const gameParam = urlParams.get("game");
      if (gameParam) {
        const found = PREMADE_GAMES.find((g) => g.id === gameParam);
        if (found) return found;
      }
    }
    return null;
  });
  const [muted, setMuted] = useState<boolean>(() => isGameAudioMuted());

  // VIP user tag
  const [vipUser] = useState<string>(() => {
    return localStorage.getItem("milkypy_arcade_vip") || "PLAYER_ONE";
  });

  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setGameAudioMuted(nextMuted);
    if (!nextMuted) {
      playSound("click");
    }
  };

  const handleSelectGame = (game: PremadeGame) => {
    setSelectedGame(game);
  };

  const handleInspectCode = (game: PremadeGame) => {
    setSelectedGame(game);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-7.5rem)] md:h-[calc(100vh-3.5rem)] overflow-hidden bg-[#08090D] font-sans text-slate-100 relative">
      {/* Universal Neo-Arcade Sub-Header */}
      <header className="px-3 sm:px-4 py-2 bg-[#15171E] border-b border-[#252933] flex items-center justify-between gap-2 sm:gap-3 shrink-0 z-20">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#A98BFF] shrink-0">
            <Gamepad2 className="w-4 h-4 text-[#A98BFF]" />
            <span>Python Arcade</span>
          </div>
        </div>

        {/* Right: Sound Toggle & VIP Pass */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-xs shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 bg-[#08090D] px-2.5 py-1 rounded-lg border border-[#252933] font-mono text-[10px] text-[#A98BFF]">
            <Ticket className="w-3.5 h-3.5 text-[#A98BFF] shrink-0" />
            <span>VIP: <strong className="text-white">{vipUser}</strong></span>
          </div>

          <button
            onClick={handleToggleMute}
            title={muted ? "Unmute Retro Audio" : "Mute Retro Audio"}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-[#08090D] hover:bg-[#252933] border border-[#252933] text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono shrink-0 cursor-pointer touch-target"
          >
            {muted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="hidden sm:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#65D9D0] shrink-0" />
                <span className="hidden sm:inline">Audio On</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {selectedGame ? (
          <ArcadePlayer
            game={selectedGame}
            onBack={() => setSelectedGame(null)}
            onRemixInStudio={() => {}}
            onOpenAiAssist={onOpenAiAssist}
          />
        ) : (
          <ArcadeCatalog
            games={PREMADE_GAMES}
            onSelectGame={handleSelectGame}
            onInspectCode={handleInspectCode}
            onRemixInStudio={() => {}}
          />
        )}
      </div>
    </div>
  );
};
