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

// Tipe data objek jatuh (Catch Water Game)
interface FallingItem {
  id: number;
  type: 'water' | 'leaf' | 'bomb';
  x: number; // 0 sampai 328 (360 - 32)
  y: number; // mulai dari 0
  speed: number; // 3 sampai 5 px per tick
}

// Komponen Modal Catch Water Game (Pos 2)
function CatchWaterModal({
  onWin,
  onClose,
}: {
  onWin: () => void;
  onClose: () => void;
}) {
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
        x: Math.floor(Math.random() * 328), // 0 s.d. 328 (agar tidak tembus batas lebar 360)
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
            // Jangan masukkan ke remaining agar item langsung hilang
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
    const relativeX = clientX - rect.left - 32; // pusatkan ember (lebar 64px, setengahnya 32px)
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

// Interface Objek Tersembunyi (Hidden Object Game)
interface HiddenItem {
  id: number;
  top: string;
  left: string;
  hint: string;
  found: boolean;
}

const INITIAL_HIDDEN_ITEMS: HiddenItem[] = [
  { id: 1, top: "14%", left: "22%", hint: "Di dekat awan kiri atas", found: false },
  { id: 2, top: "42%", left: "82%", hint: "Di balik pohon kanan", found: false },
  { id: 3, top: "76%", left: "16%", hint: "Di semak bunga kiri bawah", found: false },
  { id: 4, top: "52%", left: "48%", hint: "Di bawah bangku taman tengah", found: false },
  { id: 5, top: "84%", left: "74%", hint: "Di dekat batu kolam kanan bawah", found: false },
];

// Komponen Modal Hidden Object Game (Pos 3)
function HiddenObjectModal({
  onWin,
  onClose,
}: {
  onWin: () => void;
  onClose: () => void;
}) {
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

const CELEBRATION_PARTICLES = [
  { id: 1, icon: "🌸", left: "8%", delay: "0s" },
  { id: 2, icon: "❤️", left: "16%", delay: "0.4s" },
  { id: 3, icon: "✨", left: "25%", delay: "0.8s" },
  { id: 4, icon: "🌹", left: "34%", delay: "0.2s" },
  { id: 5, icon: "💖", left: "44%", delay: "1.1s" },
  { id: 6, icon: "🌸", left: "53%", delay: "0.6s" },
  { id: 7, icon: "✨", left: "62%", delay: "0.3s" },
  { id: 8, icon: "❤️", left: "71%", delay: "0.9s" },
  { id: 9, icon: "🌷", left: "80%", delay: "0.5s" },
  { id: 10, icon: "💖", left: "88%", delay: "1.3s" },
  { id: 11, icon: "✨", left: "94%", delay: "0.7s" },
  { id: 12, icon: "🌹", left: "5%", delay: "1.5s" },
];

// Komponen Modal Surat Ulang Tahun (LetterModal)
function LetterModal({
  onClose,
  onResetGame,
}: {
  onClose: () => void;
  onResetGame: () => void;
}) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("Dinner Romantis 🍽️");
  const [rsvpAccepted, setRsvpAccepted] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Efek Partikel Kelopak Bunga & Hati Melayang (Issue #23) */}
      {CELEBRATION_PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="pointer-events-none select-none fixed top-4 text-2xl animate-bounce z-50 opacity-90 drop-shadow-sm"
          style={{
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: "2.2s",
          }}
        >
          {particle.icon}
        </span>
      ))}

      {/* Tampilan 1: Amplop Tertutup (Issue #21) */}
      {!isEnvelopeOpen ? (
        <div className="bg-rose-100 border-4 border-rose-300 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl px-2 py-1 cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>
          <div className="text-7xl animate-bounce my-4 select-none">💌</div>
          <h2 className="text-2xl font-extrabold text-rose-700 mb-2">
            Buah Surat Harapan
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            Kamu menemukan Buah Surat Harapan! Ada pesan spesial di dalamnya yang telah tumbuh bersama usaha dan kasih sayangmu.
          </p>
          <button
            type="button"
            onClick={() => setIsEnvelopeOpen(true)}
            className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl w-full shadow-lg hover:shadow-rose-400/40 cursor-pointer transition-all text-base"
          >
            Buka Amplop Sekarang ✨
          </button>
        </div>
      ) : (
        /* Tampilan 2: Surat Terbuka + Undangan Kencan + RSVP (Issue #21, #22, #24) */
        <div className="bg-gradient-to-b from-amber-50 via-white to-rose-50 border-4 border-rose-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[88vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-center">
          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl px-2 py-1 cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>

          {/* Hiasan Atas */}
          <div className="flex justify-center gap-2 text-xl select-none mb-2">
            <span>🌸</span>
            <span>✨</span>
            <span>💖</span>
            <span>✨</span>
            <span>🌸</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-600 mb-4 tracking-tight">
            Selamat Ulang Tahun, Sayangku! 🎂❤️
          </h2>

          {/* 3 Paragraf Isi Surat */}
          <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-3 text-left">
            <p>
              Halo Ndoro kesayanganku! Selamat bertambah usia ya. Melihatmu berhasil menyelesaikan tantangan di setiap pos—mulai dari mencocokkan kepingan memori kita, menangkap tetesan air dengan penuh sabar, hingga mencari hal-hal kecil yang tersembunyi—mengingatkanku pada betapa berharganya setiap langkah yang kita lewati bersama.
            </p>
            <p>
              Sama seperti Pohon Harapan yang kamu rawat dari sebutir bibit kecil hingga tumbuh mekar dan berbuah lebat berkat tiga ember air penuh perjuangan, cintaku dan rasa syukurku memilikimu pun akan selalu bertumbuh subur setiap hari.
            </p>
            <p>
              Semoga di usia yang baru ini, setiap langkahmu selalu dipeluk kebahagiaan, kesehatan, kemudahan, dan tawa yang tak pernah pudar. Terima kasih sudah selalu menjadi alasan terindah untuk tersenyum.
            </p>
            <p className="text-right italic font-semibold text-rose-600 pt-1">
              — Dari yang selalu menyayangimu sepenuh hati 💕
            </p>
          </div>

          {/* Garis Pemisah */}
          <div className="my-6 border-t-2 border-dashed border-rose-200" />

          {/* Bagian Date Invitation Interaktif (Issue #22) */}
          <div className="bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-5 text-left shadow-sm">
            <div className="text-center mb-3">
              <span className="text-xs uppercase font-extrabold text-rose-500 tracking-wider bg-rose-100 px-3 py-1 rounded-full">
                DATE INVITATION
              </span>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mt-2">
                ✨ Undangan Kencan Spesial Ulang Tahun ✨
              </h3>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm text-gray-600 mb-4">
              <p>📅 <strong>Waktu:</strong> Akhir Pekan Ini (Sabtu / Minggu)</p>
              <p>📍 <strong>Lokasi:</strong> Tempat Spesial Kita</p>
              <p>👗 <strong>Dresscode:</strong> Pakaian favoritmu yang paling nyaman & cantik</p>
            </div>

            {/* Pilihan Rencana Kencan */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-700 mb-2">
                Pilih rencana kencan yang paling kamu inginkan:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  "Dinner Romantis 🍽️",
                  "Jalan-Jalan & Jajan 🍦",
                  "Nonton & Quality Time 🎬",
                ].map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    disabled={rsvpAccepted}
                    onClick={() => setSelectedPlan(plan)}
                    className={`text-xs font-bold py-2 px-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedPlan === plan
                        ? "bg-rose-500 text-white border-rose-600 shadow-md scale-102"
                        : "bg-white text-gray-700 border-rose-200 hover:bg-rose-50"
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            {/* Tombol Konfirmasi RSVP */}
            {!rsvpAccepted ? (
              <button
                type="button"
                onClick={() => setRsvpAccepted(true)}
                className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl w-full shadow-md cursor-pointer transition-all text-sm"
              >
                Aku Mau & Pasti Datang! ❤️
              </button>
            ) : (
              <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-900 rounded-xl p-3 text-center font-bold text-xs sm:text-sm animate-in fade-in">
                Yeay! Janji Kencan Terkunci untuk: <u className="text-rose-600">{selectedPlan}</u> 🥰<br />
                Sampai ketemu nanti ya, sayang!
              </div>
            )}
          </div>

          {/* Tombol Reset Permainan (Issue #24) */}
          {rsvpAccepted && (
            <div className="mt-5 text-center animate-in fade-in">
              <button
                type="button"
                onClick={onResetGame}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl border border-gray-300 shadow-xs cursor-pointer transition-colors"
              >
                🔄 Main Lagi dari Awal
              </button>
            </div>
          )}

          {/* Hiasan Bawah */}
          <div className="flex justify-center gap-2 text-xl select-none mt-5">
            <span>🌷</span>
            <span>💖</span>
            <span>🌹</span>
            <span>💖</span>
            <span>🌷</span>
          </div>
        </div>
      )}
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

  // Reset seluruh progres game ke awal (Issue #24)
  const handleResetGame = () => {
    setPlayerPos({ x: 380, y: 500 });
    setWaterCount(0);
    setTreeStage(0);
    setCompletedGames({ game1: false, game2: false, game3: false });
    setActiveModal("none");
    setToastMessage("Permainan dimulai ulang! Arahkan karakter ke Pos Misi untuk mencari air!");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 select-none overflow-x-auto">
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

      {/* Catch Water Mini-Game Modal (Pos 2) */}
      {activeModal === "game2" && (
        <CatchWaterModal
          onClose={() => setActiveModal("none")}
          onWin={() => {
            setWaterCount((prev) => prev + 1);
            setCompletedGames((prev) => ({ ...prev, game2: true }));
            setActiveModal("none");
            setToastMessage("Misi Pos 2 selesai! Kamu dapat 1 Air 💧. Ayo siram pohonnya!");
          }}
        />
      )}

      {/* Hidden Object Mini-Game Modal (Pos 3) */}
      {activeModal === "game3" && (
        <HiddenObjectModal
          onClose={() => setActiveModal("none")}
          onWin={() => {
            setWaterCount((prev) => prev + 1);
            setCompletedGames((prev) => ({ ...prev, game3: true }));
            setActiveModal("none");
            setToastMessage("Misi Pos 3 selesai! Kamu dapat 1 Air 💧. Ayo siram pohonnya!");
          }}
        />
      )}

      {/* Final Birthday Letter Modal (Issue #21, #22, #23, #24) */}
      {activeModal === "letter" && (
        <LetterModal
          onClose={() => setActiveModal("none")}
          onResetGame={handleResetGame}
        />
      )}
    </main>
  );
}
