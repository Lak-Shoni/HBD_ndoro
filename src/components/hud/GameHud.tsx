import type { CompletedGames } from "../../types/game";

interface GameHudProps {
  waterCount: number;
  treeStage: number;
  completedGames: CompletedGames;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

/**
 * Komponen GameHud untuk menampilkan status jumlah air, tahap pertumbuhan pohon,
 * status penyelesaian pos 1, 2, dan 3, serta tombol pengaturan musik.
 * Didesain dengan gaya cozy wooden scrapbook.
 */
export default function GameHud({
  waterCount,
  treeStage,
  completedGames,
  isMuted = false,
  onToggleMute,
}: GameHudProps) {
  return (
    <div className="w-[800px] flex items-center justify-between bg-[#fffdf7] border-4 border-[#d4a373] shadow-[0_8px_0_#bc8a5f] text-[#582f0e] px-6 py-3.5 rounded-3xl mb-4 text-sm font-semibold select-none">
      <div className="flex items-center gap-2 bg-[#f4ece1] px-3 py-1.5 rounded-2xl border-2 border-[#e6ccb2]">
        <span className="text-xl">💧</span>
        <span>
          Air: <strong className="text-cyan-700 font-extrabold text-base">{waterCount}</strong> / 3
        </span>
      </div>

      <div className="flex items-center gap-2 bg-[#eaf4e8] px-3 py-1.5 rounded-2xl border-2 border-[#c7e2c2]">
        <span className="text-xl">🌱</span>
        <span>
          Pohon: <strong className="text-emerald-800 font-extrabold text-base">{treeStage}</strong> / 3
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs font-bold">
        <span className="bg-[#faedcd] text-[#6f4e37] px-3 py-1.5 rounded-xl border-2 border-[#d4a373] shadow-xs">
          Pos 1: {completedGames.game1 ? "✅ Selesai" : "⏳ Tantangan"}
        </span>
        <span className="bg-[#faedcd] text-[#6f4e37] px-3 py-1.5 rounded-xl border-2 border-[#d4a373] shadow-xs">
          Pos 2: {completedGames.game2 ? "✅ Selesai" : "⏳ Tantangan"}
        </span>
        <span className="bg-[#faedcd] text-[#6f4e37] px-3 py-1.5 rounded-xl border-2 border-[#d4a373] shadow-xs">
          Pos 3: {completedGames.game3 ? "✅ Selesai" : "⏳ Tantangan"}
        </span>
      </div>

      {onToggleMute && (
        <button
          type="button"
          onClick={onToggleMute}
          className="bg-[#eddcd2] hover:bg-[#e0cdbf] text-[#6f4e37] font-bold text-xs px-3 py-1.5 rounded-xl border-2 border-[#cb997e] border-b-4 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer shadow-xs"
          title="Nyalakan / Matikan Musik"
        >
          {isMuted ? "🔇 Musik: OFF" : "🎵 Musik: ON"}
        </button>
      )}
    </div>
  );
}
