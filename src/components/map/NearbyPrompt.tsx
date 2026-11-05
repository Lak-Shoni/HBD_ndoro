import type { Zone } from "../../types/game";

interface NearbyPromptProps {
  nearbyZone: Zone | null;
  treeStage: number;
  onInteract: (zoneId: string) => void;
}

/**
 * Komponen tombol prompt interaktif yang muncul saat pemain berada di dekat zona (pohon / pos misi).
 */
export default function NearbyPrompt({
  nearbyZone,
  treeStage,
  onInteract,
}: NearbyPromptProps) {
  if (!nearbyZone) return null;

  return (
    <button
      type="button"
      onClick={() => onInteract(nearbyZone.id)}
      className="mt-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl shadow-lg border-2 border-yellow-600 animate-pulse cursor-pointer flex items-center gap-2"
    >
      <span>✨</span>
      <span>
        {nearbyZone.id === "tree" && treeStage >= 3 ? (
          <>
            Tekan{" "}
            <kbd className="bg-white/80 px-2 py-0.5 rounded shadow text-xs">
              Spasi
            </kbd>{" "}
            atau Klik untuk <u>Petik Buah Surat 🍎</u>
          </>
        ) : nearbyZone.id === "tree" ? (
          <>
            Tekan{" "}
            <kbd className="bg-white/80 px-2 py-0.5 rounded shadow text-xs">
              Spasi
            </kbd>{" "}
            atau Klik untuk <u>Siram Pohon Harapan 🌱</u>
          </>
        ) : (
          <>
            Tekan{" "}
            <kbd className="bg-white/80 px-2 py-0.5 rounded shadow text-xs">
              Spasi
            </kbd>{" "}
            atau Klik di Sini untuk Interaksi dengan <u>{nearbyZone.label}</u>
          </>
        )}
      </span>
    </button>
  );
}

