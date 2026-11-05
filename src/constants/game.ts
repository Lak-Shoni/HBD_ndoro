import type { Zone, HiddenItem, CelebrationParticle, PlayerPos } from "../types/game";

// Konfigurasi Peta & Karakter
export const MAP_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  PLAYER_SIZE: 40,
  MAX_X: 760, // 800 - 40
  MAX_Y: 560, // 600 - 40
  MOVE_SPEED: 5,
  INITIAL_PLAYER_POS: { x: 380, y: 500 } as PlayerPos,
  PROXIMITY_BUFFER: 15,
} as const;

// 4 Zona Interaktif pada Map 800x600
export const ZONES: Zone[] = [
  { id: "tree", label: "Pohon Harapan", x: 340, y: 240, width: 120, height: 120 },
  { id: "game1", label: "Pos 1: Memory Match", x: 60, y: 60, width: 110, height: 110 },
  { id: "game2", label: "Pos 2: Tangkap Air", x: 630, y: 60, width: 110, height: 110 },
  { id: "game3", label: "Pos 3: Hidden Object", x: 60, y: 430, width: 110, height: 110 },
];

// Pos 1: Foto Pasangan Kartu Memori (Issue #26)
export const CARD_ITEMS: string[] = [
  "/photos/memori-1.JPG",
  "/photos/memori-2.JPG",
  "/photos/memori-3.JPG",
  "/photos/memori-4.JPG",
  "/photos/memori-5.JPG",
  "/photos/memori-6.JPG",
];

// Pos 3: Titik Koordinat Tetes Air Tersembunyi
export const INITIAL_HIDDEN_ITEMS: HiddenItem[] = [
  { id: 1, top: "14%", left: "22%", hint: "Di dekat awan kiri atas", found: false },
  { id: 2, top: "42%", left: "82%", hint: "Di balik pohon kanan", found: false },
  { id: 3, top: "76%", left: "16%", hint: "Di semak bunga kiri bawah", found: false },
  { id: 4, top: "52%", left: "48%", hint: "Di bawah bangku taman tengah", found: false },
  { id: 5, top: "84%", left: "74%", hint: "Di dekat batu kolam kanan bawah", found: false },
];

// Phase 5: Partikel Perayaan & Hujan Bunga Melayang
export const CELEBRATION_PARTICLES: CelebrationParticle[] = [
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

