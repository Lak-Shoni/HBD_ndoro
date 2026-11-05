// Types untuk seluruh aplikasi game HBD Ndoro

export interface PlayerPos {
  x: number;
  y: number;
}

export interface Zone {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ActiveModal = 'none' | 'game1' | 'game2' | 'game3' | 'letter';

export interface CompletedGames {
  game1: boolean;
  game2: boolean;
  game3: boolean;
}

// Memory Match Game (Pos 1)
export interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Catch Water Game (Pos 2)
export type FallingItemType = 'water' | 'leaf' | 'bomb';

export interface FallingItem {
  id: number;
  type: FallingItemType;
  x: number; // 0 sampai 328 (360 - 32)
  y: number; // mulai dari 0
  speed: number; // 3 sampai 5 px per tick
}

// Hidden Object Game (Pos 3)
export interface HiddenItem {
  id: number;
  top: string;
  left: string;
  hint: string;
  found: boolean;
}

// Letter & Celebration Particles (Phase 5)
export interface CelebrationParticle {
  id: number;
  icon: string;
  left: string;
  delay: string;
}

