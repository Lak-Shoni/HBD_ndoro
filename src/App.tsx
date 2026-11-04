import { useState, useEffect, useRef, useCallback } from "react";

// Struktur data kartu Memory Match
interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_ITEMS = ["❤️", "🌹", "🧸", "🍫", "💍", "💌"];

// Komponen Modal Memory Game (Pos 1)
function MemoryGameModal({
  onWin,
  onClose,
}: {
  onWin: () => void;
  onClose: () => void;
}) {
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
    // Guard clause: abaikan jika sedang checking, atau kartu sudah terbuka / sudah matched
    if (isChecking) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    // Buka kartu yang diklik
    const newCards = [...cards];
    newCards[id] = { ...newCards[id], isFlipped: true };
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    // Jika sekarang ada 2 kartu yang terbuka
    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      setIsChecking(true);

      // Cek apakah konten kedua kartu sama
      if (newCards[firstId].content === newCards[secondId].content) {
        // Cocok! Tandai isMatched = true pada kedua kartu
        setCards((prev) => {
          const updated = [...prev];
          updated[firstId] = { ...updated[firstId], isMatched: true };
          updated[secondId] = { ...updated[secondId], isMatched: true };
          return updated;
        });
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // Tidak cocok: beri jeda 800ms lalu tutup kembali kedua kartu
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
            // Tertutup
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

            // Sudah Cocok
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

            // Terbuka (Sedang Diperiksa)
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

const ZONES = [
  { id: "tree", label: "Pohon Harapan", x: 340, y: 240, width: 120, height: 120 },
  { id: "game1", label: "Pos 1: Memory Match", x: 60, y: 60, width: 110, height: 110 },
  { id: "game2", label: "Pos 2: Tangkap Air", x: 630, y: 60, width: 110, height: 110 },
  { id: "game3", label: "Pos 3: Hidden Object", x: 60, y: 430, width: 110, height: 110 },
];

function isNearZone(
  player: { x: number; y: number },
  zone: { x: number; y: number; width: number; height: number }
): boolean {
  const buffer = 15;
  const playerSize = 40;
  return (
    player.x < zone.x + zone.width + buffer &&
    player.x + playerSize > zone.x - buffer &&
    player.y < zone.y + zone.height + buffer &&
    player.y + playerSize > zone.y - buffer
  );
}

export default function App() {
  // 1. Player coordinates on the 800x600 map
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 380, y: 500 });

  // 2. Water inventory (0 to 3)
  const [waterCount, setWaterCount] = useState<number>(0);

  // 3. Tree growth stage: 0 = Seed, 1 = Sprout, 2 = Sapling, 3 = Fruiting Tree (Ready to harvest)
  const [treeStage, setTreeStage] = useState<number>(0);

  // 4. Mini-game completion tracking (each game can only give water ONCE)
  const [completedGames, setCompletedGames] = useState<{
    game1: boolean;
    game2: boolean;
    game3: boolean;
  }>({
    game1: false,
    game2: false,
    game3: false,
  });

  // 5. Active modal overlay
  const [activeModal, setActiveModal] = useState<'none' | 'game1' | 'game2' | 'game3' | 'letter'>('none');

  // 6. Floating notification/toast message at the top of the screen
  const [toastMessage, setToastMessage] = useState<string>(
    "Arahkan karakter ke Pos Misi untuk mencari air!"
  );

  // Set tombol aktif saat ini
  const keysPressed = useRef<Set<string>>(new Set());

  // Proximity detection zone
  const nearbyZone = ZONES.find((zone) => isNearZone(playerPos, zone)) || null;
  const nearbyZoneRef = useRef(nearbyZone);
  nearbyZoneRef.current = nearbyZone;

  // Interaksi handler
  const handleInteraction = useCallback((zoneId: string) => {
    if (zoneId === "game1" || zoneId === "game2" || zoneId === "game3") {
      if (completedGames[zoneId]) {
        setToastMessage("Misi di pos ini sudah selesai! Cari air di pos lainnya atau siram pohon.");
      } else {
        setActiveModal(zoneId as 'game1' | 'game2' | 'game3');
      }
    } else if (zoneId === "tree") {
      if (treeStage >= 3) {
        // Pohon sudah berbuah lebat -> buka modal surat
        setActiveModal("letter");
      } else if (waterCount === 0) {
        // Belum punya air
        setToastMessage("Ember airmu kosong! Selesaikan misi di pos sudut map dulu untuk mendapat air.");
      } else {
        // Siram pohon: kurangi air, naikkan tahap pohon
        setWaterCount((prev) => prev - 1);
        setTreeStage((prev) => {
          const nextStage = prev + 1;
          if (nextStage >= 3) {
            setToastMessage("Pohon sudah berbuah lebat! Klik pohon untuk memetik buahnya!");
          } else {
            setToastMessage("Segar! Pohon tumbuh ke tahap berikutnya. Cari air lagi untuk menyiram!");
          }
          return nextStage;
        });
      }
    }
  }, [completedGames, treeStage, waterCount]);

  const handleInteractionRef = useRef(handleInteraction);
  handleInteractionRef.current = handleInteraction;

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);

      // Listen Spasi atau Enter untuk interaksi
      if (e.key === " " || e.key === "Enter") {
        if (nearbyZoneRef.current) {
          e.preventDefault();
          handleInteractionRef.current(nearbyZoneRef.current.id);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Movement loop via requestAnimationFrame (5px per frame)
  useEffect(() => {
    let animId: number;
    const gameLoop = () => {
      if (activeModal === "none") {
        setPlayerPos((prev) => {
          let { x, y } = prev;
          const speed = 5;
          const keys = keysPressed.current;

          if (keys.has("w") || keys.has("W") || keys.has("ArrowUp")) y -= speed;
          if (keys.has("s") || keys.has("S") || keys.has("ArrowDown")) y += speed;
          if (keys.has("a") || keys.has("A") || keys.has("ArrowLeft")) x -= speed;
          if (keys.has("d") || keys.has("D") || keys.has("ArrowRight")) x += speed;

          // Boundary clamping (0 - 760, 0 - 560)
          x = Math.max(0, Math.min(760, x));
          y = Math.max(0, Math.min(560, y));

          return { x, y };
        });
      }
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [activeModal]);

  // D-Pad helpers
  const pressDirection = (key: string) => {
    keysPressed.current.add(key);
  };
  const releaseDirection = (key: string) => {
    keysPressed.current.delete(key);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 select-none">
      {/* Toast Banner */}
      <div className="w-[800px] bg-amber-100 border-2 border-amber-400 text-amber-900 px-4 py-2.5 rounded-xl mb-3 text-sm font-semibold shadow-md flex items-center justify-center gap-2">
        <span className="text-base">📢</span>
        <span>{toastMessage}</span>
      </div>

      {/* HUD Bar */}
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

      {/* Map Container */}
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

      {/* Floating / Interactive Prompt when near any zone */}
      {nearbyZone && activeModal === "none" && (
        <button
          onClick={() => handleInteraction(nearbyZone.id)}
          className="mt-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl shadow-lg border-2 border-yellow-600 animate-pulse cursor-pointer flex items-center gap-2"
        >
          <span>✨</span>
          <span>
            {nearbyZone.id === "tree" && treeStage >= 3 ? (
              <>
                Tekan <kbd className="bg-white/80 px-2 py-0.5 rounded shadow text-xs">Spasi</kbd> atau Klik untuk <u>Petik Buah Surat 🍎</u>
              </>
            ) : nearbyZone.id === "tree" ? (
              <>
                Tekan <kbd className="bg-white/80 px-2 py-0.5 rounded shadow text-xs">Spasi</kbd> atau Klik untuk <u>Siram Pohon Harapan 🌱</u>
              </>
            ) : (
              <>
                Tekan <kbd className="bg-white/80 px-2 py-0.5 rounded shadow text-xs">Spasi</kbd> atau Klik di Sini untuk Interaksi dengan <u>{nearbyZone.label}</u>
              </>
            )}
          </span>
        </button>
      )}

      {/* On-Screen D-Pad */}
      <div className="grid grid-cols-3 gap-2 mt-4 w-40">
        <div />
        <button
          onMouseDown={() => pressDirection("ArrowUp")}
          onMouseUp={() => releaseDirection("ArrowUp")}
          onMouseLeave={() => releaseDirection("ArrowUp")}
          onTouchStart={() => pressDirection("ArrowUp")}
          onTouchEnd={() => releaseDirection("ArrowUp")}
          className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg p-3 text-lg font-bold shadow-md cursor-pointer text-center select-none"
          aria-label="Up"
        >
          ▲
        </button>
        <div />

        <button
          onMouseDown={() => pressDirection("ArrowLeft")}
          onMouseUp={() => releaseDirection("ArrowLeft")}
          onMouseLeave={() => releaseDirection("ArrowLeft")}
          onTouchStart={() => pressDirection("ArrowLeft")}
          onTouchEnd={() => releaseDirection("ArrowLeft")}
          className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg p-3 text-lg font-bold shadow-md cursor-pointer text-center select-none"
          aria-label="Left"
        >
          ◀
        </button>
        <div className="flex items-center justify-center text-gray-500 text-xs font-semibold">
          MOVE
        </div>
        <button
          onMouseDown={() => pressDirection("ArrowRight")}
          onMouseUp={() => releaseDirection("ArrowRight")}
          onMouseLeave={() => releaseDirection("ArrowRight")}
          onTouchStart={() => pressDirection("ArrowRight")}
          onTouchEnd={() => releaseDirection("ArrowRight")}
          className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg p-3 text-lg font-bold shadow-md cursor-pointer text-center select-none"
          aria-label="Right"
        >
          ▶
        </button>

        <div />
        <button
          onMouseDown={() => pressDirection("ArrowDown")}
          onMouseUp={() => releaseDirection("ArrowDown")}
          onMouseLeave={() => releaseDirection("ArrowDown")}
          onTouchStart={() => pressDirection("ArrowDown")}
          onTouchEnd={() => releaseDirection("ArrowDown")}
          className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg p-3 text-lg font-bold shadow-md cursor-pointer text-center select-none"
          aria-label="Down"
        >
          ▼
        </button>
        <div />
      </div>

      {/* Memory Match Mini-Game Modal (Pos 1) */}
      {activeModal === "game1" && (
        <MemoryGameModal
          onClose={() => setActiveModal("none")}
          onWin={() => {
            setWaterCount((prev) => prev + 1);
            setCompletedGames((prev) => ({ ...prev, game1: true }));
            setActiveModal("none");
            setToastMessage("Misi Pos 1 selesai! Kamu dapat 1 Air 💧. Ayo siram pohonnya!");
          }}
        />
      )}

      {/* Placeholder Mini-Game Modal untuk Pos 2 & 3 */}
      {(activeModal === "game2" || activeModal === "game3") && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-emerald-600 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              {activeModal === "game2" && "💧 Pos 2: Tangkap Air"}
              {activeModal === "game3" && "🔍 Pos 3: Hidden Object"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              [Placeholder Phase 1] Mini-game sesungguhnya akan dibangun pada sub-phase berikutnya. Klik tombol di bawah untuk simulasi menang dan dapatkan 1 ember air.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold cursor-pointer transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setWaterCount((prev) => prev + 1);
                  setCompletedGames((prev) => ({ ...prev, [activeModal]: true }));
                  setActiveModal("none");
                  setToastMessage("Kamu dapat 1 Air! Sekarang kembali ke tengah map dan siram pohonnya.");
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition-colors"
              >
                Simulasi Menang (+1 Air) 💧
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Birthday Letter Modal */}
      {activeModal === "letter" && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center shadow-2xl border-4 border-pink-300 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
              💌
            </div>
            <h2 className="text-3xl font-extrabold text-pink-600 mb-4 tracking-tight">
              Selamat Ulang Tahun! 🎂
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
              Halo Ndoro kesayangan! 💕<br /><br />
              Terima kasih banyak sudah mau menyiram pohon harapan ini sampai berbuah lebat!
              Semoga di usiamu yang baru ini selalu dilimpahi kebahagiaan, kesehatan, dan impian-impian indahmu tercapai satu per satu. 🌟<br /><br />
              <span className="italic font-medium text-pink-600">— Dari yang selalu menyayangimu</span>
            </p>
            <div className="bg-white/80 rounded-2xl p-4 mb-6 border border-pink-200 shadow-sm">
              <p className="text-sm text-pink-800 font-bold mb-1">📅 Undangan Spesial Hari Ini</p>
              <p className="text-xs text-gray-600">
                Setelah ini, kita rayakan bareng ya! Aku sudah siapkan sesuatu yang seru buat kamu. 🥰
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal("none")}
              className="w-full sm:w-auto px-8 py-3 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-pink-400/50 cursor-pointer transition-all"
            >
              Tutup & Peluk Erat 💖
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
