import type { PlayerPos, CompletedGames, Zone } from "../../types/game";

interface GameMapProps {
  playerPos: PlayerPos;
  treeStage: number;
  completedGames: CompletedGames;
  nearbyZone: Zone | null;
}

/**
 * Komponen GameMap (Arena 800x600)
 * Menampilkan peta taman, Pohon Harapan di tengah, pos misi 1-3 di setiap sudut, dan karakter pemain.
 */
export default function GameMap({
  playerPos,
  treeStage,
  completedGames,
  nearbyZone,
}: GameMapProps) {
  return (
    <div className="relative w-[800px] h-[600px] bg-emerald-100 border-4 border-emerald-700 rounded-xl overflow-hidden shadow-2xl">
      {/* Zone: Pohon Harapan (tengah) */}
      <div
        className={`absolute flex flex-col items-center justify-center bg-emerald-200/60 border-2 border-dashed border-emerald-500 rounded-lg select-none transition-all ${
          nearbyZone?.id === "tree" ? "ring-4 ring-yellow-400 bg-emerald-300/70" : ""
        }`}
        style={{ left: 340, top: 240, width: 120, height: 120 }}
      >
        {treeStage === 0 && <span className="text-3xl transition-transform duration-300">🌱</span>}
        {treeStage === 1 && <span className="text-4xl transition-transform duration-300">🌿</span>}
        {treeStage === 2 && <span className="text-5xl transition-transform duration-300">🌳</span>}
        {treeStage === 3 && (
          <span className="text-5xl animate-bounce transition-transform duration-300">
            🍎🌳🍎
          </span>
        )}
        <span className="text-[11px] font-bold text-emerald-800 mt-1">
          {treeStage >= 3 ? "Petik Buah 🍎" : "Pohon Harapan"}
        </span>
      </div>

      {/* Zone: Pos 1 - Memory Match (kiri atas) */}
      <div
        className={`absolute flex items-center justify-center bg-blue-100 border-2 border-blue-400 rounded-lg p-2 text-center select-none transition-all ${
          nearbyZone?.id === "game1" ? "ring-4 ring-yellow-400 bg-blue-200" : ""
        }`}
        style={{ left: 60, top: 60, width: 110, height: 110 }}
      >
        <span className="text-sm font-bold text-blue-700">
          Pos 1<br />Memory Match
        </span>
        {completedGames.game1 && (
          <span className="absolute top-1 right-1 text-xs">✅</span>
        )}
      </div>

      {/* Zone: Pos 2 - Tangkap Air (kanan atas) */}
      <div
        className={`absolute flex items-center justify-center bg-cyan-100 border-2 border-cyan-400 rounded-lg p-2 text-center select-none transition-all ${
          nearbyZone?.id === "game2" ? "ring-4 ring-yellow-400 bg-cyan-200" : ""
        }`}
        style={{ left: 630, top: 60, width: 110, height: 110 }}
      >
        <span className="text-sm font-bold text-cyan-700">
          Pos 2<br />Tangkap Air
        </span>
        {completedGames.game2 && (
          <span className="absolute top-1 right-1 text-xs">✅</span>
        )}
      </div>

      {/* Zone: Pos 3 - Hidden Object (kiri bawah) */}
      <div
        className={`absolute flex items-center justify-center bg-purple-100 border-2 border-purple-400 rounded-lg p-2 text-center select-none transition-all ${
          nearbyZone?.id === "game3" ? "ring-4 ring-yellow-400 bg-purple-200" : ""
        }`}
        style={{ left: 60, top: 430, width: 110, height: 110 }}
      >
        <span className="text-sm font-bold text-purple-700">
          Pos 3<br />Hidden Object
        </span>
        {completedGames.game3 && (
          <span className="absolute top-1 right-1 text-xs">✅</span>
        )}
      </div>

      {/* Player Sprite (40x40) */}
      <div
        className="absolute w-[40px] h-[40px] bg-amber-400 rounded-full border-2 border-amber-700 flex items-center justify-center text-xl shadow-md z-10 transition-transform duration-75"
        style={{ left: playerPos.x, top: playerPos.y }}
      >
        🧑
      </div>
    </div>
  );
}
