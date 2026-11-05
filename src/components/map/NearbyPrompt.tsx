import type { Zone } from "../../types/game";

interface NearbyPromptProps {
  nearbyZone: Zone | null;
  treeStage: number;
  onInteract: (zoneId: string) => void;
}

/**
 * Komponen tombol prompt interaktif yang muncul saat pemain berada di dekat zona (pohon / pos misi).
 * Didesain dengan tombol 3D chunky bertema cozy.
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
      className="mt-4 bg-[#ffb703] hover:bg-[#fcbf49] text-[#582f0e] font-extrabold px-6 py-3 rounded-2xl border-2 border-[#d4a373] border-b-6 border-b-[#bc6c25] active:border-b-2 active:translate-y-1 shadow-lg transition-all cursor-pointer flex items-center gap-2 select-none animate-pulse"
    >
      <span className="text-xl">✨</span>
      <span className="text-sm">
        {nearbyZone.id === "tree" && treeStage >= 3 ? (
          <>
            Tekan{" "}
            <kbd className="bg-[#fffdf7] px-2 py-0.5 rounded-lg border border-[#d4a373] shadow-xs text-xs font-black">
              Spasi
            </kbd>{" "}
            atau Klik untuk <u>Petik Buah Surat 🍎</u>
          </>
        ) : nearbyZone.id === "tree" ? (
          <>
            Tekan{" "}
            <kbd className="bg-[#fffdf7] px-2 py-0.5 rounded-lg border border-[#d4a373] shadow-xs text-xs font-black">
              Spasi
            </kbd>{" "}
            atau Klik untuk <u>Siram Pohon Harapan 🌱</u>
          </>
        ) : (
          <>
            Tekan{" "}
            <kbd className="bg-[#fffdf7] px-2 py-0.5 rounded-lg border border-[#d4a373] shadow-xs text-xs font-black">
              Spasi
            </kbd>{" "}
            atau Klik di Sini untuk Interaksi dengan <u>{nearbyZone.label}</u>
          </>
        )}
      </span>
    </button>
  );
}
