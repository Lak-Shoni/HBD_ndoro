import { useState, useEffect, useRef, useCallback } from "react";
import type { PlayerPos, CompletedGames, ActiveModal } from "./types/game";
import { ZONES, MAP_CONFIG } from "./constants/game";
import { isNearZone } from "./utils/collision";

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
 * Mengelola state global permainan, pergerakan karakter, dan alur transisi modal mini-game.
 */
export default function App() {
  // 1. Posisi koordinat pemain di map 800x600
  const [playerPos, setPlayerPos] = useState<PlayerPos>({
    x: MAP_CONFIG.INITIAL_PLAYER_POS.x,
    y: MAP_CONFIG.INITIAL_PLAYER_POS.y,
  });

  // 2. Inventori air (0 sampai 3)
  const [waterCount, setWaterCount] = useState<number>(0);

  // 3. Tahap pohon: 0 = Benih, 1 = Tunas, 2 = Pohon Muda, 3 = Pohon Berbuah (Siap petik)
  const [treeStage, setTreeStage] = useState<number>(0);

  // 4. Tracking penyelesaian tiap mini-game (hanya memberi 1 air sekali seumur game)
  const [completedGames, setCompletedGames] = useState<CompletedGames>({
    game1: false,
    game2: false,
    game3: false,
  });

  // 5. State modal aktif
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");

  // 6. Pesan notifikasi / banner toast di bagian atas layar
  const [toastMessage, setToastMessage] = useState<string>(
    "Arahkan karakter ke Pos Misi untuk mencari air!"
  );

  // Set tombol keyboard yang sedang ditekan
  const keysPressed = useRef<Set<string>>(new Set());

  // Deteksi pos terdekat dari karakter
  const nearbyZone = ZONES.find((zone) => isNearZone(playerPos, zone)) || null;
  const nearbyZoneRef = useRef(nearbyZone);
  nearbyZoneRef.current = nearbyZone;

  // Handler interaksi dengan zona
  const handleInteraction = useCallback(
    (zoneId: string) => {
      if (zoneId === "game1" || zoneId === "game2" || zoneId === "game3") {
        if (completedGames[zoneId]) {
          setToastMessage(
            "Misi di pos ini sudah selesai! Cari air di pos lainnya atau siram pohon."
          );
        } else {
          setActiveModal(zoneId);
        }
      } else if (zoneId === "tree") {
        if (treeStage >= 3) {
          // Pohon sudah berbuah lebat -> buka modal surat harapan
          setActiveModal("letter");
        } else if (waterCount === 0) {
          // Belum punya air
          setToastMessage(
            "Ember airmu kosong! Selesaikan misi di pos sudut map dulu untuk mendapat air."
          );
        } else {
          // Siram pohon: kurangi air, naikkan tahap pertumbuhan pohon
          setWaterCount((prev) => prev - 1);
          setTreeStage((prev) => {
            const nextStage = prev + 1;
            if (nextStage >= 3) {
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
        }
      }
    },
    [completedGames, treeStage, waterCount]
  );

  const handleInteractionRef = useRef(handleInteraction);
  handleInteractionRef.current = handleInteraction;

  // Keyboard event listeners (gerak & interaksi Spasi/Enter)
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
  }, [activeModal]);

  // D-Pad helpers untuk touch/mouse
  const pressDirection = (key: string) => {
    keysPressed.current.add(key);
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
    setCompletedGames({ game1: false, game2: false, game3: false });
    setActiveModal("none");
    setToastMessage(
      "Permainan dimulai ulang! Arahkan karakter ke Pos Misi untuk mencari air!"
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 select-none overflow-x-auto">
      {/* Toast Banner */}
      <ToastBanner message={toastMessage} />

      {/* HUD Bar */}
      <GameHud
        waterCount={waterCount}
        treeStage={treeStage}
        completedGames={completedGames}
      />

      {/* Map Container */}
      <GameMap
        playerPos={playerPos}
        treeStage={treeStage}
        completedGames={completedGames}
        nearbyZone={nearbyZone}
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
