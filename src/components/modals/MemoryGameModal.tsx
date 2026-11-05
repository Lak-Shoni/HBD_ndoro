import { useState, useEffect, useCallback } from "react";
import type { Card } from "../../types/game";
import { CARD_ITEMS } from "../../constants/game";

interface MemoryGameModalProps {
  onWin: () => void;
  onClose: () => void;
}

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
    }
  }, [cards]);

  // Logika klik kartu (flip & match)
  const handleCardClick = (id: number) => {
    if (isChecking) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

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
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-4 border-rose-300 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-800">
            Pos 1: Cocokkan Memori Kita
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

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">
            Buka dan temukan 6 pasang kartu yang sama!
          </p>
          <button
            type="button"
            onClick={initGame}
            className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition-colors"
          >
            🔄 Acak Ulang
          </button>
        </div>

        {/* Grid Kartu 4 Kolom x 3 Baris */}
        <div className="grid grid-cols-4 gap-3 my-4">
          {cards.map((card) => {
            if (!card.isFlipped && !card.isMatched) {
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className="h-20 rounded-xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-200 select-none bg-rose-400 hover:bg-rose-500 text-white shadow-sm hover:scale-105 active:scale-95"
                >
                  ?
                </div>
              );
            }

            if (card.isMatched) {
              return (
                <div
                  key={card.id}
                  className="h-20 rounded-xl flex items-center justify-center text-3xl font-bold transition-all duration-200 select-none bg-emerald-100 border-2 border-emerald-400 opacity-80 shadow-inner"
                >
                  {card.content}
                </div>
              );
            }

            return (
              <div
                key={card.id}
                className="h-20 rounded-xl flex items-center justify-center text-3xl font-bold transition-all duration-200 select-none bg-amber-50 border-2 border-rose-400 shadow-md scale-105"
              >
                {card.content}
              </div>
            );
          })}
        </div>

        {/* Tampilan Saat Menang */}
        {isGameWon ? (
          <div className="mt-3 text-center animate-in fade-in zoom-in-95 duration-200">
            <p className="text-sm font-bold text-emerald-600 mb-3">
              Yeay! Semua memori berhasil dicocokkan! 🎉
            </p>
            <button
              type="button"
              onClick={onWin}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl w-full shadow-lg hover:shadow-emerald-400/40 cursor-pointer transition-all"
            >
              Ambil 1 Air 💧 & Kembali ke Map
            </button>
          </div>
        ) : (
          <div className="mt-2 text-center">
            <span className="text-[11px] text-gray-400">
              Pasangan ditemukan: {cards.filter((c) => c.isMatched).length / 2} / 6
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
