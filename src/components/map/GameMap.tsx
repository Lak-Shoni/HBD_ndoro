import { useState } from "react";
import type { PlayerPos, CompletedGames, Zone } from "../../types/game";

interface GameMapProps {
  playerPos: PlayerPos;
  treeStage: number;
  completedGames: CompletedGames;
  nearbyZone: Zone | null;
  isWatering?: boolean;
}

/**
 * Komponen GameMap (Arena 800x600)
 * Menampilkan arena taman bergaya cozy indie game lengkap dengan jalan setapak (dirt path),
 * hiasan pagar & bunga pinggir map, pos berbentuk pondok kayu, serta animasi menyiram pohon.
 */
export default function GameMap({
  playerPos,
  treeStage,
  completedGames,
  nearbyZone,
  isWatering = false,
}: GameMapProps) {
  const [playerImgError, setPlayerImgError] = useState(false);

  return (
    <div className="relative w-[800px] h-[600px] bg-[#ccd5ae] border-6 border-[#8f9e6d] rounded-3xl overflow-hidden shadow-[0_12px_0_#606c38] select-none">
      {/* 1. Latar Pola Rumput Taman Halus */}
      <div className="absolute inset-0 bg-[radial-gradient(#b5c99a_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* 2. Jalan Setapak (Dirt Paths) - Menghubungkan Pohon Harapan ke Pos 1, 2, & 3 */}
      {/* Lingkaran tanah tengah di sekitar Pohon Harapan */}
      <div className="absolute left-[310px] top-[210px] w-[180px] h-[180px] rounded-full bg-[#faedcd]/60 border-2 border-[#e6ccb2]/80 pointer-events-none" />

      {/* Jalan setapak ke Pos 1 (Kiri Atas) */}
      <div className="absolute left-[290px] top-[210px] w-[34px] h-[34px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />
      <div className="absolute left-[245px] top-[175px] w-[36px] h-[36px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />
      <div className="absolute left-[195px] top-[140px] w-[34px] h-[34px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />
      <div className="absolute left-[145px] top-[110px] w-[38px] h-[38px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />

      {/* Jalan setapak ke Pos 2 (Kanan Atas) */}
      <div className="absolute left-[480px] top-[210px] w-[34px] h-[34px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />
      <div className="absolute left-[530px] top-[175px] w-[36px] h-[36px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />
      <div className="absolute left-[580px] top-[140px] w-[34px] h-[34px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />
      <div className="absolute left-[630px] top-[110px] w-[38px] h-[38px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />

      {/* Jalan setapak ke Pos 3 (Kiri Bawah) */}
      <div className="absolute left-[295px] top-[375px] w-[36px] h-[36px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />
      <div className="absolute left-[245px] top-[410px] w-[34px] h-[34px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />
      <div className="absolute left-[195px] top-[445px] w-[36px] h-[36px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />
      <div className="absolute left-[145px] top-[470px] w-[38px] h-[38px] rounded-full bg-[#e6ccb2]/75 pointer-events-none shadow-xs" />

      {/* 3. Elemen Dekorasi Pinggir Map (Bunga, Jamur, Pagar) */}
      <span className="absolute top-2 left-6 text-xl pointer-events-none opacity-80">🌸</span>
      <span className="absolute top-4 left-44 text-lg pointer-events-none opacity-70">🌼</span>
      <span className="absolute top-3 left-80 text-xl pointer-events-none opacity-80">🍄</span>
      <span className="absolute top-4 right-52 text-lg pointer-events-none opacity-80">🌷</span>
      <span className="absolute top-2 right-10 text-xl pointer-events-none opacity-80">🌸</span>

      <span className="absolute top-44 left-2 text-xl pointer-events-none opacity-80">🌻</span>
      <span className="absolute top-72 left-3 text-lg pointer-events-none opacity-70">🍄</span>
      <span className="absolute bottom-40 left-2 text-xl pointer-events-none opacity-80">🌼</span>

      <span className="absolute top-48 right-3 text-xl pointer-events-none opacity-80">🌸</span>
      <span className="absolute top-72 right-4 text-lg pointer-events-none opacity-80">🍄</span>
      <span className="absolute bottom-44 right-3 text-xl pointer-events-none opacity-80">🌷</span>

      <span className="absolute bottom-3 left-10 text-xl pointer-events-none opacity-80">🌸</span>
      <span className="absolute bottom-4 left-56 text-lg pointer-events-none opacity-70">🍄</span>
      <span className="absolute bottom-3 left-[380px] text-xl pointer-events-none opacity-80">🌼</span>
      <span className="absolute bottom-4 right-52 text-lg pointer-events-none opacity-80">🌸</span>
      <span className="absolute bottom-3 right-10 text-xl pointer-events-none opacity-80">🌻</span>

      {/* 4. Zone: Pohon Harapan (Tengah: 340, 240, 120x120) */}
      <div
        className={`absolute flex flex-col items-center justify-center bg-[#e9edc9] border-4 border-[#8f9e6d] rounded-3xl select-none transition-all shadow-[0_6px_0_#606c38] ${
          nearbyZone?.id === "tree" ? "ring-4 ring-[#ffb703] scale-105 bg-[#fefae0]" : ""
        }`}
        style={{ left: 340, top: 240, width: 120, height: 120 }}
      >
        {/* Animasi Teko Siram Air saat isWatering aktif (Issue #28) */}
        {isWatering && (
          <div className="absolute -top-10 flex flex-col items-center pointer-events-none z-30 animate-bounce">
            <span className="text-4xl drop-shadow-md">🚿</span>
            <span className="text-xl animate-ping -mt-1">💧✨</span>
          </div>
        )}

        <div className={`flex flex-col items-center transition-transform duration-300 ${isWatering ? "scale-125" : ""}`}>
          {treeStage === 0 && <span className="text-4xl drop-shadow-sm">🌱</span>}
          {treeStage === 1 && <span className="text-5xl drop-shadow-sm">🌿</span>}
          {treeStage === 2 && <span className="text-6xl drop-shadow-sm">🌳</span>}
          {treeStage === 3 && (
            <span className="text-5xl animate-bounce drop-shadow-md">
              🍎🌳🍎
            </span>
          )}
        </div>
        <span className="text-[11px] font-black text-[#582f0e] mt-1 tracking-tight">
          {treeStage >= 3 ? "Petik Buah 🍎" : "Pohon Harapan"}
        </span>
      </div>

      {/* 5. Zone: Pos 1 - Memory Match (Kiri Atas: 60, 60, 110x110) */}
      <div
        className={`absolute flex flex-col items-center justify-center bg-[#faedcd] border-4 border-[#b08968] shadow-[0_6px_0_#7f5539] rounded-2xl p-2 text-center select-none transition-all ${
          nearbyZone?.id === "game1" ? "ring-4 ring-[#ffb703] scale-105 bg-[#fffdf7]" : ""
        }`}
        style={{ left: 60, top: 60, width: 110, height: 110 }}
      >
        <span className="text-2xl mb-1 drop-shadow-xs">🏡</span>
        <span className="text-xs font-black text-[#6f4e37] leading-tight">
          Pos 1<br />Memory Match
        </span>
        {completedGames.game1 && (
          <span className="absolute top-1 right-1 text-sm bg-emerald-100 rounded-full px-1 border border-emerald-400">
            ✅
          </span>
        )}
      </div>

      {/* 6. Zone: Pos 2 - Tangkap Air (Kanan Atas: 630, 60, 110x110) */}
      <div
        className={`absolute flex flex-col items-center justify-center bg-[#faedcd] border-4 border-[#b08968] shadow-[0_6px_0_#7f5539] rounded-2xl p-2 text-center select-none transition-all ${
          nearbyZone?.id === "game2" ? "ring-4 ring-[#ffb703] scale-105 bg-[#fffdf7]" : ""
        }`}
        style={{ left: 630, top: 60, width: 110, height: 110 }}
      >
        <span className="text-2xl mb-1 drop-shadow-xs">⛲</span>
        <span className="text-xs font-black text-[#6f4e37] leading-tight">
          Pos 2<br />Tangkap Air
        </span>
        {completedGames.game2 && (
          <span className="absolute top-1 right-1 text-sm bg-emerald-100 rounded-full px-1 border border-emerald-400">
            ✅
          </span>
        )}
      </div>

      {/* 7. Zone: Pos 3 - Hidden Object (Kiri Bawah: 60, 430, 110x110) */}
      <div
        className={`absolute flex flex-col items-center justify-center bg-[#faedcd] border-4 border-[#b08968] shadow-[0_6px_0_#7f5539] rounded-2xl p-2 text-center select-none transition-all ${
          nearbyZone?.id === "game3" ? "ring-4 ring-[#ffb703] scale-105 bg-[#fffdf7]" : ""
        }`}
        style={{ left: 60, top: 430, width: 110, height: 110 }}
      >
        <span className="text-2xl mb-1 drop-shadow-xs">🔍</span>
        <span className="text-xs font-black text-[#6f4e37] leading-tight">
          Pos 3<br />Hidden Object
        </span>
        {completedGames.game3 && (
          <span className="absolute top-1 right-1 text-sm bg-emerald-100 rounded-full px-1 border border-emerald-400">
            ✅
          </span>
        )}
      </div>

      {/* 8. Player Sprite (40x40) - Foto Pemain dengan Fallback Emoji (Issue #26) */}
      <div
        className="absolute w-[40px] h-[40px] rounded-full border-2 border-white shadow-md z-10 transition-transform duration-75 flex items-center justify-center overflow-hidden bg-amber-300 ring-2 ring-[#7f5539]"
        style={{ left: playerPos.x, top: playerPos.y }}
      >
        {!playerImgError ? (
          <img
            src="/photos/player.png"
            alt="Player"
            className="w-full h-full object-cover"
            onError={() => setPlayerImgError(true)}
          />
        ) : (
          <span className="text-2xl select-none">🧑</span>
        )}
      </div>
    </div>
  );
}
