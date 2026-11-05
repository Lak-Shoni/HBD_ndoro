import type { CompletedGames } from "../../types/game";

interface GameHudProps {
  waterCount: number;
  treeStage: number;
  completedGames: CompletedGames;
}

/**
 * Komponen GameHud untuk menampilkan status jumlah air, tahap pertumbuhan pohon,
 * dan status penyelesaian pos 1, 2, dan 3.
 */
export default function GameHud({
  waterCount,
  treeStage,
  completedGames,
}: GameHudProps) {
  return (
    <div className="w-[800px] flex items-center justify-between bg-gray-800/90 border border-gray-700 text-white px-6 py-3 rounded-xl mb-3 shadow-xl backdrop-blur-sm text-sm font-medium">
      <div className="flex items-center gap-2">
        <span className="text-blue-400 text-base">💧</span>
        <span>
          Air: <strong className="text-blue-300 font-bold">{waterCount}</strong> / 3
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-emerald-400 text-base">🌱</span>
        <span>
          Tahap Pohon: <strong className="text-emerald-300 font-bold">{treeStage}</strong> / 3
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold">
        <span className="bg-gray-700/80 px-2.5 py-1 rounded-md border border-gray-600">
          Pos 1: {completedGames.game1 ? "✅" : "⏳"}
        </span>
        <span className="bg-gray-700/80 px-2.5 py-1 rounded-md border border-gray-600">
          Pos 2: {completedGames.game2 ? "✅" : "⏳"}
        </span>
        <span className="bg-gray-700/80 px-2.5 py-1 rounded-md border border-gray-600">
          Pos 3: {completedGames.game3 ? "✅" : "⏳"}
        </span>
      </div>
    </div>
  );
}

