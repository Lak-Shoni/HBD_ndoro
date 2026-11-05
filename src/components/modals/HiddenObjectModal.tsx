import { useState, useEffect } from "react";
import type { HiddenItem } from "../../types/game";
import { INITIAL_HIDDEN_ITEMS } from "../../constants/game";

interface HiddenObjectModalProps {
  onWin: () => void;
  onClose: () => void;
}

/**
 * Komponen Modal Hidden Object Game (Pos 3)
 * Pemain harus menemukan 5 tetes air yang terselip/tersamar di taman.
 */
export default function HiddenObjectModal({
  onWin,
  onClose,
}: HiddenObjectModalProps) {
  const [items, setItems] = useState<HiddenItem[]>(INITIAL_HIDDEN_ITEMS);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);

  const foundCount = items.filter((item) => item.found).length;

  // Pantau kondisi menang saat 5/5 tetes air ditemukan
  useEffect(() => {
    if (items.every((item) => item.found)) {
      setIsGameWon(true);
    }
  }, [items]);

  // Handler saat tetesan air ditemukan
  const handleFindItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, found: true } : item))
    );
    setActiveHint(null);
  };

  // Handler tampilkan petunjuk
  const handleShowHint = () => {
    const unfound = items.find((item) => !item.found);
    if (unfound) {
      setActiveHint(`Petunjuk: Coba cek ${unfound.hint}! 🔍`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border-4 border-purple-400 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-800">
            Pos 3: Cari 5 Tetes Air Tersembunyi
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

        {/* Indikator Progres */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-lg text-sm">
            🔍 Ditemukan: <strong className="text-base text-purple-900">{foundCount}</strong> / 5
          </span>
          <span className="text-gray-500 font-medium">
            Ketuk pada tetesan air 💧 yang tersamar di taman!
          </span>
        </div>

        {/* Kanvas Ilustrasi Taman 400x320 */}
        <div className="w-[400px] h-[320px] relative overflow-hidden rounded-xl border-2 border-emerald-500 mx-auto select-none shadow-inner">
          {/* Latar Langit & Rumput Taman */}
          <div className="absolute inset-x-0 top-0 h-28 bg-sky-200" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-emerald-200" />

          {/* Elemen Dekorasi Statis (Pengalih/Decoys) */}
          <span className="pointer-events-none select-none absolute top-[8%] left-[8%] text-3xl">☀️</span>
          <span className="pointer-events-none select-none absolute top-[10%] left-[20%] text-4xl opacity-90">☁️</span>
          <span className="pointer-events-none select-none absolute top-[12%] left-[68%] text-3xl opacity-80">☁️</span>

          <span className="pointer-events-none select-none absolute top-[28%] left-[10%] text-5xl drop-shadow-sm">🌲</span>
          <span className="pointer-events-none select-none absolute top-[32%] left-[76%] text-5xl drop-shadow-sm">🌳</span>
          <span className="pointer-events-none select-none absolute top-[25%] left-[42%] text-4xl drop-shadow-sm">🌴</span>

          <span className="pointer-events-none select-none absolute top-[48%] left-[46%] text-4xl drop-shadow-sm">🪑</span>
          <span className="pointer-events-none select-none absolute top-[50%] left-[25%] text-4xl drop-shadow-sm">⛲</span>

          <span className="pointer-events-none select-none absolute top-[72%] left-[14%] text-3xl">🌺</span>
          <span className="pointer-events-none select-none absolute top-[68%] left-[60%] text-3xl">🌻</span>
          <span className="pointer-events-none select-none absolute top-[80%] left-[72%] text-3xl">🪨</span>
          <span className="pointer-events-none select-none absolute top-[78%] left-[38%] text-2xl">🍄</span>

          {/* 5 Tetes Air Tersembunyi */}
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.found || isGameWon}
              onClick={() => handleFindItem(item.id)}
              style={{ top: item.top, left: item.left }}
              className={`absolute select-none transition-all duration-200 flex items-center justify-center ${
                item.found
                  ? "opacity-100 scale-125 bg-emerald-100/90 rounded-full ring-2 ring-emerald-500 p-0.5 pointer-events-none text-xl"
                  : "opacity-35 hover:opacity-75 cursor-pointer text-xl hover:scale-125"
              }`}
              title={item.found ? "Sudah ditemukan" : "Ada sesuatu di sini?"}
            >
              💧
            </button>
          ))}
        </div>

        {/* Bagian Bawah: Bantuan / Kemenangan */}
        {isGameWon ? (
          <div className="mt-3 text-center animate-in fade-in zoom-in-95 duration-200">
            <p className="text-sm font-bold text-emerald-600 mb-2">
              Mata yang Tajam! Semua 5 Tetes Air Berhasil Ditemukan! 🔍💧
            </p>
            <button
              type="button"
              onClick={onWin}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl w-full shadow-lg hover:shadow-emerald-400/40 cursor-pointer transition-all text-sm"
            >
              Ambil 1 Air 💧 & Kembali ke Map
            </button>
          </div>
        ) : (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={handleShowHint}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold py-1.5 px-3 rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              💡 Butuh Petunjuk?
            </button>
            {activeHint && (
              <p className="text-xs text-amber-900 font-semibold mt-2 bg-amber-100/70 p-1.5 rounded-md border border-amber-200 animate-in fade-in">
                {activeHint}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

