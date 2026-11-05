import { useState, useEffect } from "react";
import type { HiddenItem } from "../../types/game";
import { INITIAL_HIDDEN_ITEMS } from "../../constants/game";
import { playSfx } from "../../utils/audio";

interface HiddenObjectModalProps {
  onWin: () => void;
  onClose: () => void;
}

/**
 * Komponen Modal Pos 3: Cari 5 Tetes Air Tersembunyi di Foto/Taman
 * Didesain dengan foto latar /photos/bg-hidden.jpg, gaya scrapbook kayu, dan efek suara.
 */
export default function HiddenObjectModal({
  onWin,
  onClose,
}: HiddenObjectModalProps) {
  const [items, setItems] = useState<HiddenItem[]>(INITIAL_HIDDEN_ITEMS);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [bgSrc, setBgSrc] = useState<string>("/photos/bg-hidden.JPG");
  const [bgImgError, setBgImgError] = useState<boolean>(false);

  const handleBgError = () => {
    if (bgSrc.endsWith(".JPG")) {
      setBgSrc("/photos/bg-hidden.jpg");
    } else {
      setBgImgError(true);
    }
  };

  const foundCount = items.filter((item) => item.found).length;

  // Pantau kondisi menang saat 5/5 tetes air ditemukan
  useEffect(() => {
    if (items.every((item) => item.found)) {
      setIsGameWon(true);
      playSfx("win");
    }
  }, [items]);

  // Handler saat tetesan air ditemukan
  const handleFindItem = (id: number) => {
    playSfx("water");
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, found: true } : item))
    );
    setActiveHint(null);
  };

  // Handler tampilkan petunjuk
  const handleShowHint = () => {
    playSfx("click");
    const unfound = items.find((item) => !item.found);
    if (unfound) {
      setActiveHint(`Petunjuk: Coba cek ${unfound.hint}! 🔍`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#fffdf7] rounded-3xl p-6 max-w-lg w-full shadow-[0_12px_0_#bc8a5f] border-4 border-[#d4a373] animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-black text-[#582f0e] tracking-tight">
            Pos 3: Cari 5 Tetes Air Tersembunyi 🔍💧
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#99582a] hover:text-[#582f0e] font-black text-xl px-2 py-1 cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Indikator Progres */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-black text-purple-900 bg-purple-50 border-2 border-purple-200 px-3 py-1.5 rounded-xl text-sm shadow-xs">
            🔍 Ditemukan: <strong className="text-base text-purple-950">{foundCount}</strong> / 5
          </span>
          <span className="text-[#6f4e37] font-semibold">
            Ketuk pada tetesan air 💧 yang tersamar!
          </span>
        </div>

        {/* Kanvas Ilustrasi / Foto Kenangan Taman 400x320 */}
        <div className="w-[400px] h-[320px] relative overflow-hidden rounded-2xl border-4 border-[#8f9e6d] mx-auto select-none shadow-inner">
          {/* Foto Latar Asli jika tersedia (Issue #26) */}
          {!bgImgError ? (
            <img
              src={bgSrc}
              alt="Latar Taman Kenangan"
              className="absolute inset-0 w-full h-full object-cover"
              onError={handleBgError}
            />
          ) : (
            /* Fallback Ilustrasi Taman Cozy jika foto belum diunggah */
            <>
              <div className="absolute inset-x-0 top-0 h-28 bg-sky-200" />
              <div className="absolute inset-x-0 bottom-0 h-52 bg-[#ccd5ae]" />

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
            </>
          )}

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
                  ? "opacity-100 scale-125 bg-emerald-100/90 rounded-full ring-2 ring-emerald-500 p-0.5 pointer-events-none text-xl shadow-md"
                  : "opacity-35 hover:opacity-85 cursor-pointer text-xl hover:scale-130 drop-shadow-md"
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
            <p className="text-sm font-black text-emerald-700 mb-2">
              Mata yang Tajam! Semua 5 Tetes Air Berhasil Ditemukan! 🔍💧
            </p>
            <button
              type="button"
              onClick={onWin}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black py-3 px-4 rounded-2xl w-full border-2 border-emerald-600 border-b-6 border-b-emerald-800 active:border-b-2 active:translate-y-1 shadow-lg cursor-pointer transition-all text-sm"
            >
              Ambil 1 Air 💧 & Kembali ke Map
            </button>
          </div>
        ) : (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={handleShowHint}
              className="text-xs bg-[#faedcd] hover:bg-[#fefae0] text-[#7f5539] border-2 border-[#d4a373] border-b-4 border-b-[#b08968] active:border-b-2 active:translate-y-0.5 font-bold py-1.5 px-3 rounded-xl shadow-xs cursor-pointer transition-all"
            >
              💡 Butuh Petunjuk?
            </button>
            {activeHint && (
              <p className="text-xs text-[#582f0e] font-bold mt-2 bg-[#faedcd]/90 p-2 rounded-xl border border-[#d4a373] animate-in fade-in">
                {activeHint}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
