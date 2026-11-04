Product Requirements Document (PRD): Phase 1 - Core 2D Map & Tree Growth System

1. Project Overview & Scope
   Build a 2D top-down interactive mini-RPG web application inspired by Stardew Valley for a birthday surprise.

Current Phase Scope (Phase 1): Build ONLY the 2D Map, Player Movement (Keyboard + On-Screen D-Pad), Collision/Proximity Detection, Global State Management, Tree Watering Progression, and Mock/Placeholder Modals for the 3 mini-games and final birthday letter.

Strict Constraint for AI: Do NOT build the complex logic for the 3 mini-games yet. Use simple placeholder modals with a "Simulate Win (+1 Water)" button so the core map loop can be tested end-to-end first. Put all code inside a single file (app/page.tsx using "use client") for Phase 1 to avoid broken imports.

2. Tech Stack & Libraries
   Framework: Next.js (App Router) with React (useState, useEffect, useRef, useCallback).

Styling: Tailwind CSS (no external CSS files needed beyond standard Tailwind setup).

Icons/Visuals: Use lucide-react icons or standard Unicode Emojis for sprites in Phase 1 (so no external image assets fail to load).

3. Global State Schema
   The application must maintain the following exact React states in the root component:

TypeScript
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
const [toastMessage, setToastMessage] = useState<string>("Arahkan karakter ke Pos Misi untuk mencari air!"); 4. Map Layout & Exact Coordinates
The game world is a fixed-size container centered on the screen.

Map Container: width: 800px, height: 600px, position: relative, overflow: hidden, rounded corners, border, and green grass styling (bg-emerald-100).

Player Size: width: 40px, height: 40px, position: absolute. Rendered using left: playerPos.x and top: playerPos.y.

All interactive zones are position: absolute inside the 800x600 Map Container with these exact coordinates:

JSON
[
{
"id": "tree",
"label": "Pohon Harapan",
"x": 340,
"y": 240,
"width": 120,
"height": 120
},
{
"id": "game1",
"label": "Pos 1: Memory Match",
"x": 60,
"y": 60,
"width": 110,
"height": 110
},
{
"id": "game2",
"label": "Pos 2: Tangkap Air",
"x": 630,
"y": 60,
"width": 110,
"height": 110
},
{
"id": "game3",
"label": "Pos 3: Hidden Object",
"x": 60,
"y": 430,
"width": 110,
"height": 110
}
] 5. Functional Requirements
A. Player Movement System
Controls: Support both keyboard (W, A, S, D and ArrowUp, ArrowLeft, ArrowDown, ArrowRight) and an on-screen D-Pad UI (4 directional buttons below or beside the map for mobile/mouse users).

Movement Speed & Loop: Move 5px per frame using requestAnimationFrame when a movement key is held down.

Movement Lock: Freeze player movement completely whenever activeModal !== 'none'.

Boundary Clamping: The player must never leave the 800x600 map:

newX must be clamped between 0 and 760 (800 - 40).

newY must be clamped between 0 and 560 (600 - 40).

B. Proximity / Collision Detection (AABB Formula)
Check if the player (40x40) overlaps or is within a 15px interaction buffer of any of the 4 zones using this exact helper function:

TypeScript
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
When isNearZone returns true for any zone, display a clear floating action button above the zone or at the bottom of the screen (e.g., "Tekan [Spasi] atau Klik di Sini untuk Interaksi") and listen for the Space or Enter key.

C. Zone Interaction Logic

1. Interacting with Mini-Game Zones (game1, game2, game3):

If completedGames[zoneId] is true: Do NOT open the modal. Update toastMessage to: "Misi di pos ini sudah selesai! Cari air di pos lainnya atau siram pohon."

If completedGames[zoneId] is false: Set activeModal to zoneId ('game1', 'game2', or 'game3').

2. Interacting with the Tree Zone (tree):

Case 1 (Tree is already stage 3 / Fruiting):

Show button label: "Petik Buah Surat 🍎".

On click/interact: Set activeModal to 'letter'.

Case 2 (Tree stage is 0, 1, or 2 AND waterCount === 0):

On click/interact: Update toastMessage to: "Ember airmu kosong! Selesaikan misi di pos sudut map dulu untuk mendapat air."

Case 3 (Tree stage is 0, 1, or 2 AND waterCount is 1 or more):

On click/interact:

Decrement waterCount by 1 (waterCount - 1).

Increment treeStage by 1 (treeStage + 1).

If the new treeStage is 1 or 2, update toastMessage to: "Segar! Pohon tumbuh ke tahap berikutnya. Cari air lagi untuk menyiram!"

If the new treeStage reaches 3, update toastMessage to: "Pohon sudah berbuah lebat! Klik pohon untuk memetik buahnya!"

D. Visual Representation of Tree Stages
Render the tree dynamically inside the Tree Zone (340, 240) based on treeStage:

treeStage === 0: 🌱 (Bibit Kecil - Scale text-3xl)

treeStage === 1: 🌿 (Tunas Tumbuh - Scale text-4xl)

treeStage === 2: 🌳 (Pohon Muda - Scale text-5xl)

treeStage === 3: 🍎🌳🍎 (Pohon Berbuah Surat - Scale text-6xl with a gentle bounce animation animate-bounce)

E. HUD (Heads-Up Display) & Placeholder Modals
Top HUD Bar: Display outside/above the map container showing:

Inventory Air: 💧 Air: {waterCount} / 1 (or total collected).

Progres Pohon: 🌱 Tahap Pohon: {treeStage} / 3.

Status Misi: 3 badges showing checkmark ✅ or lock ⏳ for Pos 1, Pos 2, and Pos 3.

Toast Banner: Displays current toastMessage.

Placeholder Mini-Game Modal (game1, game2, game3):

Render a centered modal overlay when activeModal matches a game ID.

Include a title, brief placeholder text, a "Tutup" button, and a "Simulasi Menang (+1 Air) 💧" button.

Clicking "Simulasi Menang (+1 Air)" must:

Increment waterCount by 1.

Set completedGames[activeModal] to true.

Set activeModal to 'none'.

Set toastMessage to "Kamu dapat 1 Air! Sekarang kembali ke tengah map dan siram pohonnya."

Final Birthday Letter Modal (letter):

Render a romantic card modal with a placeholder greeting message, date invitation section, and a "Tutup" button.
