import { useState, useEffect, useRef, useCallback } from "react";
import type { FallingItem } from "../../types/game";

interface CatchWaterModalProps {
  onWin: () => void;
  onClose: () => void;
}

export default function CatchWaterModal({ onWin, onClose }: CatchWaterModalProps) {
  const [score, setScore] = useState<number>(0);
  const [bucketX, setBucketX] = useState<number>(148); // range: 0 s.d. 296
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [items, setItems] = useState<FallingItem[]>([]);

  const bucketXRef = useRef<number>(148);
  bucketXRef.current = bucketX;

  const nextItemIdRef = useRef<number>(1);
  const arenaRef = useRef<HTMLDivElement>(null);

  // Pantau kondisi menang saat score mencapai 23
  useEffect(() => {
    if (score >= 23 && !isGameWon) {
      setIsGameWon(true);
      setItems([]); // bersihkan objek jatuh
    }
  }, [score, isGameWon]);

  // Spawner Loop (setiap 650ms selama !isGameWon)
  useEffect(() => {
    if (isGameWon) return;

    const spawnInterval = setInterval(() => {
      const rand = Math.random();
      let type: 'water' | 'leaf' | 'bomb' = 'water';

      if (rand < 0.60) {
        type = 'water'; // 60%
      } else if (rand < 0.85) {
        type = 'leaf'; // 25%
      } else {
        type = 'bomb'; // 15%
      }

      const newItem: FallingItem = {
        id: nextItemIdRef.current++,
        type,
        x: Math.floor(Math.random() * 328), // 0 s.d. 328
        y: 0,
        speed: 3 + Math.random() * 2, // kecepatan antara 3 s.d. 5 px per tick
      };

      setItems((prev) => [...prev, newItem]);
    }, 650);

    return () => clearInterval(spawnInterval);
  }, [isGameWon]);

  // Movement Loop & Collision Detection (setiap 30ms selama !isGameWon)
  useEffect(() => {
    if (isGameWon) return;

    const moveInterval = setInterval(() => {
      setItems((prevItems) => {
        const remaining: FallingItem[] = [];
        const currentBucketX = bucketXRef.current;

        for (const item of prevItems) {
          const nextY = item.y + item.speed;

          // Cek tabrakan dengan ember (Area vertikal: 350 s.d. 390, Area horizontal: bucketXRef s.d. bucketXRef + 64)
          const isCollidingY = nextY + 32 >= 350 && nextY <= 390;
          const isCollidingX = item.x + 32 >= currentBucketX && item.x <= currentBucketX + 64;

          if (isCollidingY && isCollidingX) {
            // Objek tertangkap ember! Perbarui skor berdasarkan jenis objek
            if (item.type === "water") {
              setScore((prev) => Math.min(23, prev + 1));
            } else if (item.type === "leaf") {
              setScore((prev) => Math.max(0, prev - 1));
            } else if (item.type === "bomb") {
              setScore((prev) => Math.max(0, prev - 3));
            }
            continue;
          }

          // Hapus item yang sudah keluar batas bawah arena (y > 400)
          if (nextY <= 400) {
            remaining.push({ ...item, y: nextY });
          }
        }

        return remaining;
      });
    }, 30);

    return () => clearInterval(moveInterval);
  }, [isGameWon]);

  // Geser ember dengan batasan clamp 0 s/d 296
  const moveBucket = useCallback((delta: number) => {
    if (isGameWon) return;
    setBucketX((prev) => Math.max(0, Math.min(296, prev + delta)));
  }, [isGameWon]);

  // Listener keyboard panah Kiri/Kanan & A/D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameWon) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        moveBucket(-20);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        moveBucket(20);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveBucket, isGameWon]);

  // Drag / Click koordinat kursor atau touch di arena
  const handlePointerMove = (clientX: number) => {
    if (isGameWon || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left - 32;
    setBucketX(Math.max(0, Math.min(296, relativeX)));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-4 border-cyan-400 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-800">
            Pos 2: Kumpulkan 23 Tetes Air
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2 py-1 cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Indikator Skor & Petunjuk */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-extrabold text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-lg text-sm">
            💧 Air Terkumpul: <strong className="text-base text-cyan-900">{score}</strong> / 23
          </span>
          <span className="text-gray-500 font-semibold bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
            💧 +1 | 🍃 -1 | 💣 -3
          </span>
        </div>

        {/* Arena Permainan 360x400 */}
        <div
          ref={arenaRef}
          onMouseMove={(e) => {
            if (e.buttons === 1) handlePointerMove(e.clientX);
          }}
          onClick={(e) => handlePointerMove(e.clientX)}
          onTouchMove={(e) => {
            if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
          }}
          className="w-[360px] h-[400px] relative overflow-hidden bg-gradient-to-b from-sky-100 to-sky-200 rounded-xl border-2 border-sky-400 mx-auto select-none cursor-ew-resize shadow-inner"
        >
          {/* Objek Jatuh (Air, Daun, Bom) */}
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute w-8 h-8 flex items-center justify-center text-2xl select-none pointer-events-none drop-shadow-sm"
              style={{ left: `${item.x}px`, top: `${item.y}px` }}
            >
              {item.type === "water" && "💧"}
              {item.type === "leaf" && "🍃"}
              {item.type === "bomb" && "💣"}
            </div>
          ))}

          {/* Ember (Catcher) */}
          <div
            className="absolute bottom-2 w-16 h-10 flex items-center justify-center text-4xl select-none transition-[left] duration-75 pointer-events-none drop-shadow-md"
            style={{ left: `${bucketX}px` }}
          >
            🪣
          </div>

          {/* Overlay Kemenangan saat Target 23 Air Tercapai */}
          {isGameWon && (
            <div className="absolute inset-0 bg-cyan-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200 z-20">
              <span className="text-5xl mb-2 animate-bounce">🪣💧✨</span>
              <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">
                Luar Biasa! Embermu Sudah Penuh 23 Tetes Air! 🪣💧
              </h3>
              <p className="text-cyan-200 text-xs mb-4">
                Air murni berhasil dikumpulkan untuk menyiram Pohon Harapan!
              </p>
              <button
                type="button"
                onClick={onWin}
                className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl w-full shadow-lg hover:shadow-emerald-400/40 cursor-pointer transition-all text-sm"
              >
                Ambil 1 Air 💧 & Kembali ke Map
              </button>
            </div>
          )}
        </div>

        {/* Tombol Kontrol Layar di Bawah Arena */}
        <div className="flex justify-between items-center mt-3 gap-3">
          <button
            type="button"
            onClick={() => moveBucket(-25)}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-bold py-2 px-3 rounded-xl shadow cursor-pointer text-sm select-none"
          >
            ⬅️ Geser Kiri
          </button>
          <button
            type="button"
            onClick={() => moveBucket(25)}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-bold py-2 px-3 rounded-xl shadow cursor-pointer text-sm select-none"
          >
            Geser Kanan ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
