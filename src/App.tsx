import { useState, useEffect, useRef, useCallback } from "react";
import type { PlayerPos, CompletedGames, ActiveModal } from "./types/game";
import { ZONES, MAP_CONFIG } from "./constants/game";
import { isNearZone } from "./utils/collision";
import { playSfx, setAudioMuted } from "./utils/audio";

// Komponen HUD
import ToastBanner from "./components/hud/ToastBanner";
import GameHud from "./components/hud/GameHud";

// Komponen Map & Kontrol
import GameMap from "./components/map/GameMap";
import NearbyPrompt from "./components/map/NearbyPrompt";
import DPadControls from "./components/controls/DPadControls";

// Komponen Modals
import MemoryGameModal from "./components/modals/MemoryGameModal";
import CatchWaterModal from "./components/modals/CatchWaterModal";
import HiddenObjectModal from "./components/modals/HiddenObjectModal";
import LetterModal from "./components/modals/LetterModal";

/**
 * Komponen Utama Aplikasi Pohon Harapan (HBD Ndoro 🎂🌱)
 * Mengelola state global permainan, audio BGM/SFX, start screen,
 * animasi penyiraman pohon, dan transisi modal mini-game.
 */
export default function App() {
  // 0. State Layar Pembuka (Issue #28)
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  // 1. Audio BGM & SFX (Issue #27)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 2. Posisi koordinat pemain di map 800x600
  const [playerPos, setPlayerPos] = useState<PlayerPos>({
    x: MAP_CONFIG.INITIAL_PLAYER_POS.x,
    y: MAP_CONFIG.INITIAL_PLAYER_POS.y,
  });

  // 3. Inventori air (0 sampai 3)
  const [waterCount, setWaterCount] = useState<number>(0);

  // 4. Tahap pohon: 0 = Benih, 1 = Tunas, 2 = Pohon Muda, 3 = Pohon Berbuah
  const [treeStage, setTreeStage] = useState<number>(0);

  // 5. Animasi menyiram pohon (Issue #28)
  const [isWatering, setIsWatering] = useState<boolean>(false);

  // 6. Tracking penyelesaian tiap mini-game
  const [completedGames, setCompletedGames] = useState<CompletedGames>({
    game1: false,
    game2: false,
    game3: false,
  });

  // 7. State modal aktif
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");

  // 8. Pesan notifikasi / banner toast
  const [toastMessage, setToastMessage] = useState<string>(
    "Arahkan karakter ke Pos Misi untuk mencari air!"
  );

  // Set tombol keyboard yang sedang ditekan
  const keysPressed = useRef<Set<string>>(new Set());

  // Inisialisasi volume BGM lembut
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.35;
    }
  }, []);

  // Debug / Cheat Functions via Browser Console (Memudahkan Pengujian Langsung)
  useEffect(() => {
    const cheatFruit = () => {
      setIsGameStarted(true);
      setTreeStage(3);
      setWaterCount(3);
      setCompletedGames({ game1: true, game2: true, game3: true });
      setActiveModal("none");
      setToastMessage("🍎 Cheat Aktif: Pohon sudah berbuah lebat! Klik pohon untuk memetik buahnya!");
      playSfx("win");
      console.log(
        "%c🍎 Cheat Berhasil: Pohon langsung berbuah (Tahap 3)! Dekati pohon lalu tekan Spasi/Enter atau klik pohon untuk memetik buah surat.",
        "color: #10b981; font-weight: bold; font-size: 14px;"
      );
    };

    const cheatLetter = () => {
      setIsGameStarted(true);
      setTreeStage(3);
      setActiveModal("letter");
      playSfx("win");
      console.log(
        "%c💌 Cheat Berhasil: Modal Buah Surat Harapan langsung dibuka!",
        "color: #ec4899; font-weight: bold; font-size: 14px;"
      );
    };

    window.cheatFruit = cheatFruit;
    window.spawnFruit = cheatFruit;
    window.cheatLetter = cheatLetter;
    window.openLetter = cheatLetter;

    console.log(
      "%c🎮 Debug / Cheat Mode Tersedia:\n" +
      "1. window.cheatFruit()  -> Buah langsung muncul di pohon (Tahap 3) 🍎\n" +
      "2. window.cheatLetter() -> Langsung buka modal surat ucapan & RSVP 💌",
      "color: #b45309; font-weight: bold; font-size: 12px; background: #fffdf7; padding: 8px; border: 2px solid #d4a373; border-radius: 8px;"
    );

    return () => {
      delete window.cheatFruit;
      delete window.spawnFruit;
      delete window.cheatLetter;
      delete window.openLetter;
    };
  }, []);

  // Handler Mulai Petualangan dari Start Screen
  const handleStartGame = () => {
    setIsGameStarted(true);
    playSfx("click");
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(() => {});
    }
  };

  // Handler Toggle Mute / Unmute
  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      setAudioMuted(next);
      if (audioRef.current) {
        if (next) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  };

  // Deteksi pos terdekat dari karakter
  const nearbyZone = ZONES.find((zone) => isNearZone(playerPos, zone)) || null;
  const nearbyZoneRef = useRef(nearbyZone);
  nearbyZoneRef.current = nearbyZone;

  // Handler interaksi dengan zona
  const handleInteraction = useCallback(
    (zoneId: string) => {
      if (isWatering) return;

      // Autoplay fallback: pastikan musik menyala saat interaksi pertama jika belum aktif
      if (audioRef.current && !isMuted && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }

      if (zoneId === "game1" || zoneId === "game2" || zoneId === "game3") {
        if (completedGames[zoneId]) {
          playSfx("click");
          setToastMessage(
            "Misi di pos ini sudah selesai! Cari air di pos lainnya atau siram pohon."
          );
        } else {
          playSfx("click");
          setActiveModal(zoneId);
        }
      } else if (zoneId === "tree") {
        if (treeStage >= 3) {
          // Pohon sudah berbuah lebat -> petik buah & buka modal surat
          playSfx("win");
          setActiveModal("letter");
        } else if (waterCount === 0) {
          // Belum punya air
          playSfx("hit");
          setToastMessage(
            "Ember airmu kosong! Selesaikan misi di pos sudut map dulu untuk mendapat air."
          );
        } else {
          // Siram pohon: kurangi air, jalankan animasi menyiram selama 1000ms (Issue #28)
          setIsWatering(true);
          playSfx("water");
          setWaterCount((prev) => prev - 1);
          setToastMessage("Menyiram Pohon Harapan dengan air murni... 🚿💧");

          setTimeout(() => {
            setIsWatering(false);
            setTreeStage((prev) => {
              const nextStage = prev + 1;
              if (nextStage >= 3) {
                playSfx("win");
                setToastMessage(
                  "Pohon sudah berbuah lebat! Klik pohon untuk memetik buahnya!"
                );
              } else {
                setToastMessage(
                  "Segar! Pohon tumbuh ke tahap berikutnya. Cari air lagi untuk menyiram!"
                );
              }
              return nextStage;
            });
          }, 1000);
        }
      }
    },
    [completedGames, treeStage, waterCount, isWatering, isMuted]
  );

  const handleInteractionRef = useRef(handleInteraction);
  handleInteractionRef.current = handleInteraction;

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);

      // Autoplay fallback saat pemain menekan tombol keyboard
      if (audioRef.current && !isMuted && audioRef.current.paused && isGameStarted) {
        audioRef.current.play().catch(() => {});
      }

      // Listen Spasi atau Enter untuk interaksi
      if (e.key === " " || e.key === "Enter") {
        if (nearbyZoneRef.current && isGameStarted) {
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
  }, [isGameStarted, isMuted]);

  // Movement loop via requestAnimationFrame (5px per frame)
  useEffect(() => {
    let animId: number;
    const gameLoop = () => {
      if (activeModal === "none" && isGameStarted && !isWatering) {
        setPlayerPos((prev) => {
          let { x, y } = prev;
          const speed = MAP_CONFIG.MOVE_SPEED;
          const keys = keysPressed.current;

          if (keys.has("w") || keys.has("W") || keys.has("ArrowUp")) y -= speed;
          if (keys.has("s") || keys.has("S") || keys.has("ArrowDown")) y += speed;
          if (keys.has("a") || keys.has("A") || keys.has("ArrowLeft")) x -= speed;
          if (keys.has("d") || keys.has("D") || keys.has("ArrowRight")) x += speed;

          // Boundary clamping (0 - 760, 0 - 560)
          x = Math.max(0, Math.min(MAP_CONFIG.MAX_X, x));
          y = Math.max(0, Math.min(MAP_CONFIG.MAX_Y, y));

          return { x, y };
        });
      }
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [activeModal, isGameStarted, isWatering]);

  // D-Pad helpers untuk touch/mouse
  const pressDirection = (key: string) => {
    keysPressed.current.add(key);
    if (audioRef.current && !isMuted && audioRef.current.paused && isGameStarted) {
      audioRef.current.play().catch(() => {});
    }
  };
  const releaseDirection = (key: string) => {
    keysPressed.current.delete(key);
  };

  // Reset seluruh progres game ke awal (Issue #24)
  const handleResetGame = () => {
    setPlayerPos({
      x: MAP_CONFIG.INITIAL_PLAYER_POS.x,
      y: MAP_CONFIG.INITIAL_PLAYER_POS.y,
    });
    setWaterCount(0);
    setTreeStage(0);
    setIsWatering(false);
    setCompletedGames({ game1: false, game2: false, game3: false });
    setActiveModal("none");
    setToastMessage(
      "Permainan dimulai ulang! Arahkan karakter ke Pos Misi untuk mencari air!"
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#fdf6e3] p-4 select-none overflow-x-auto text-[#432818]">
      {/* HTML5 Audio Background Music Player (Issue #27) */}
      <audio ref={audioRef} src="/audio/bgm.mp3" loop preload="auto" />

      {/* Layar Pembuka / Start Screen (Issue #28) */}
      {!isGameStarted && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#fffdf7] border-4 border-[#d4a373] shadow-[0_12px_0_#bc8a5f] rounded-3xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-200">
            <span className="text-6xl mb-3 block animate-bounce">🌱🎂✨</span>
            <h1 className="text-2xl font-black text-[#582f0e] mb-2 tracking-tight">
              Petualangan Kebun Harapan Ulang Tahunmu
            </h1>
            <p className="text-[#7f5539] text-sm leading-relaxed mb-6 font-medium">
              Bantu siram pohon di tengah taman sampai berbuah lebat untuk membuka kejutan spesial ulang tahunmu!
            </p>
            <button
              type="button"
              onClick={handleStartGame}
              className="bg-[#e76f51] hover:bg-[#f4a261] text-white font-black py-4 px-6 rounded-2xl w-full border-2 border-[#d46043] border-b-6 border-b-[#b84326] active:border-b-2 active:translate-y-1 shadow-lg cursor-pointer transition-all text-base"
            >
              ▶️ Mulai Petualangan (& Nyalakan Musik 🎵)
            </button>
          </div>
        </div>
      )}

      {/* Toast Banner */}
      <ToastBanner message={toastMessage} />

      {/* HUD Bar */}
      <GameHud
        waterCount={waterCount}
        treeStage={treeStage}
        completedGames={completedGames}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Map Container (800x600) */}
      <GameMap
        playerPos={playerPos}
        treeStage={treeStage}
        completedGames={completedGames}
        nearbyZone={nearbyZone}
        isWatering={isWatering}
      />

      {/* Interactive Prompt saat berada di dekat zona */}
      {activeModal === "none" && (
        <NearbyPrompt
          nearbyZone={nearbyZone}
          treeStage={treeStage}
          onInteract={handleInteraction}
        />
      )}

      {/* On-Screen D-Pad */}
      <DPadControls
        onDirectionPress={pressDirection}
        onDirectionRelease={releaseDirection}
      />

      {/* Memory Match Mini-Game Modal (Pos 1) */}
      {activeModal === "game1" && (
        <MemoryGameModal
          onClose={() => setActiveModal("none")}
          onWin={() => {
            setWaterCount((prev) => prev + 1);
            setCompletedGames((prev) => ({ ...prev, game1: true }));
            setActiveModal("none");
            setToastMessage(
              "Misi Pos 1 selesai! Kamu dapat 1 Air 💧. Ayo siram pohonnya!"
            );
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
            setToastMessage(
              "Misi Pos 2 selesai! Kamu dapat 1 Air 💧. Ayo siram pohonnya!"
            );
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
            setToastMessage(
              "Misi Pos 3 selesai! Kamu dapat 1 Air 💧. Ayo siram pohonnya!"
            );
          }}
        />
      )}

      {/* Final Birthday Letter Modal */}
      {activeModal === "letter" && (
        <LetterModal
          onClose={() => setActiveModal("none")}
          onResetGame={handleResetGame}
        />
      )}
    </main>
  );

}
