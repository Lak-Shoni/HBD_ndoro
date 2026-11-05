import { useState, useEffect, useCallback } from "react";
import type { Card } from "../../types/game";
import { CARD_ITEMS } from "../../constants/game";
import { playSfx } from "../../utils/audio";

interface MemoryGameModalProps {
  onWin: () => void;
  onClose: () => void;
}

// Komponen kartu foto dengan fallback graceful saat foto belum diunggah (Issue #26)
function MemoryCardPhoto({ src }: { src: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc.endsWith(".JPG")) {
      setImgSrc(imgSrc.replace(".JPG", ".jpg"));
    } else if (imgSrc.endsWith(".jpg")) {
      setImgSrc(imgSrc.replace(".jpg", ".JPG"));
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return <span className="text-3xl select-none animate-pulse">❤️</span>;
  }

  return (
    <img
      src={imgSrc}
      alt="Memori Kenangan"
      className="w-full h-full object-cover rounded-lg p-0.5 bg-white shadow-xs"
      onError={handleError}
    />
  );
}

/**
 * Komponen Modal Pos 1: Memory Match Game (6 Pasang Foto Kenangan)
 * Didesain dengan gaya cozy wooden scrapbook, tombol 3D membal, dan sound effects.
 */
export default function MemoryGameModal({ onWin, onClose }: MemoryGameModalProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);

  // Inisialisasi & acak kartu (12 kartu)
  const initGame = useCallback(() => {
    const duplicated = [...CARD_ITEMS, ...CARD_ITEMS];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        content: item,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setIsChecking(false);
    setIsGameWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Pantau kondisi menang: semua 12 kartu sudah cocok
  useEffect(() => {
    if (cards.length === 12 && cards.every((c) => c.isMatched)) {
      setIsGameWon(true);
      playSfx("win");
    }
  }, [cards]);

  // Logika klik kartu (flip & match)
  const handleCardClick = (id: number) => {
    if (isChecking) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    playSfx("click");

    const newCards = [...cards];
    newCards[id] = { ...newCards[id], isFlipped: true };
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      setIsChecking(true);

      if (newCards[firstId].content === newCards[secondId].content) {
        setCards((prev) => {
          const updated = [...prev];
          updated[firstId] = { ...updated[firstId], isMatched: true };
          updated[secondId] = { ...updated[secondId], isMatched: true };
          return updated;
        });
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstId] = { ...updated[firstId], isFlipped: false };
            updated[secondId] = { ...updated[secondId], isFlipped: false };
            return updated;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 800);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#fffdf7] rounded-3xl p-6 max-w-md w-full shadow-[0_12px_0_#bc8a5f] border-4 border-[#d4a373] animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-black text-[#582f0e] tracking-tight">
            Pos 1: Cocokkan Memori Kita 💕
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

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#7f5539] font-medium">
            Buka dan temukan 6 pasang foto kenangan yang sama!
          </p>
          <button
            type="button"
            onClick={initGame}
            className="text-xs bg-[#faedcd] hover:bg-[#fefae0] text-[#7f5539] border-2 border-[#d4a373] border-b-4 border-b-[#b08968] active:border-b-2 active:translate-y-0.5 px-3 py-1 rounded-xl font-bold cursor-pointer transition-all shadow-xs"
          >
            🔄 Acak Ulang
          </button>
        </div>

        {/* Grid Kartu 4 Kolom x 3 Baris */}
        <div className="grid grid-cols-4 gap-2.5 my-4">
          {cards.map((card) => {
            if (!card.isFlipped && !card.isMatched) {
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className="h-20 rounded-2xl flex items-center justify-center text-2xl font-black cursor-pointer transition-all duration-200 select-none bg-[#cb997e] hover:bg-[#b07d62] text-[#fffdf7] border-2 border-[#a0684b] border-b-4 border-b-[#7f5539] active:border-b-0 active:translate-y-1 shadow-md hover:scale-102"
                >
                  💌
                </div>
              );
            }

            if (card.isMatched) {
              return (
                <div
                  key={card.id}
                  className="h-20 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-200 select-none bg-[#eaf4e8] border-2 border-emerald-500 shadow-inner p-1 opacity-90 ring-2 ring-emerald-300"
                >
                  <MemoryCardPhoto src={card.content} />
                </div>
              );
            }

            return (
              <div
                key={card.id}
                className="h-20 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-200 select-none bg-[#fffdf7] border-2 border-[#ffb703] shadow-md scale-105 p-1 ring-2 ring-[#fcbf49]"
              >
                <MemoryCardPhoto src={card.content} />
              </div>
            );
          })}
        </div>

        {/* Tampilan Saat Menang */}
        {isGameWon ? (
          <div className="mt-3 text-center animate-in fade-in zoom-in-95 duration-200">
            <p className="text-sm font-black text-emerald-700 mb-3">
              Yeay! Semua foto memori berhasil dicocokkan! 🎉
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
          <div className="mt-2 text-center text-xs text-[#99582a] italic">
            Klik dua kartu untuk melihat foto di baliknya ✨
          </div>
        )}
      </div>
    </div>
  );
}
