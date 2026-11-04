Bagian 1: PRD Phase 3 — Mini-Game Pos 2 (Catch 23 Water Drops)

1. Instruksi Utama & Batasan (Guardrails)
   JANGAN UBAH logika map utama, pergerakan karakter di map, maupun MemoryGameModal (game1) yang sudah selesai di app/page.tsx.

Buat komponen baru bernama CatchWaterModal dan pasang menggantikan placeholder modal pada kondisi activeModal === 'game2'.

Saat activeModal === 'game2', tombol panah Kiri/Kanan atau A/D hanya menggerakkan ember di dalam mini-game, bukan karakter di map utama.

2. Spesifikasi Arena & Objek
   Ukuran Arena Game: Lebar 360px, Tinggi 400px (w-[360px] h-[400px] relative overflow-hidden bg-sky-100 rounded-xl border-2 border-sky-300 mx-auto).

Ukuran Ember (Catcher): Lebar 64px, Tinggi 40px (w-16 h-10), berada di bagian bawah arena (bottom-2 atau y = 350). Posisi horizontal bucketX dibatasi antara 0 sampai 296 (360 - 64).

Ukuran Item Jatuh: 32px x 32px (w-8 h-8), jatuh dari y = 0 ke y = 400.

Tipe Item & Efek Skor:

water (💧) — Peluang 60% | Efek: Skor +1

leaf (🍃) — Peluang 25% | Efek: Skor -1 (Skor minimal 0, tidak boleh minus)

bomb (💣) — Peluang 15% | Efek: Skor -3 (Skor minimal 0, tidak boleh minus)

Target Menang: Skor mencapai 23.
