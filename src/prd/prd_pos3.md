Bagian 1: PRD Phase 4 — Mini-Game Pos 3 (Hidden Object: Cari 5 Tetes Air)

1. Instruksi Utama & Batasan (Guardrails)
   JANGAN UBAH logika map utama, MemoryGameModal (game1), maupun CatchWaterModal (game2) yang sudah berjalan di app/page.tsx.

Buat komponen baru bernama HiddenObjectModal dan pasang menggantikan placeholder modal pada kondisi activeModal === 'game3'.

2. Spesifikasi Arena & Objek Tersembunyi
   Ukuran Kanvas Ilustrasi: Lebar 400px, Tinggi 320px (w-[400px] h-[320px] relative overflow-hidden rounded-xl border-2 border-emerald-400 mx-auto select-none).

Dekorasi Pengalih Perhatian (Decoys): Render objek-objek taman statis (pointer-events-none) seperti pohon, semak, bunga, awan, dan bangku taman di koordinat tertentu agar arena terlihat ramai.

Data 5 Tetes Air Tersembunyi:

id: 1 — top: "14%", left: "22%", hint: "Di dekat awan kiri atas"

id: 2 — top: "42%", left: "82%", hint: "Di balik pohon kanan"

id: 3 — top: "76%", left: "16%", hint: "Di semak bunga kiri bawah"

id: 4 — top: "52%", left: "48%", hint: "Di bawah bangku taman tengah"

id: 5 — top: "84%", left: "74%", hint: "Di dekat batu kolam kanan bawah"
