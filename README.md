# Pohon Harapan - HBD Ndoro 🎂🌱

Mini RPG Web Interaktif 2D bertema perayaan ulang tahun spesial bergaya *Cozy Indie Game / Scrapbook*. Pemain menjelajahi peta taman berukuran 800x600, menyelesaikan tantangan mini-game di tiga pos sudut map untuk mengumpulkan air suci, menyiram dan menumbuhkan Pohon Harapan dari sebutir bibit hingga berbuah lebat, dan membuka Buah Surat Harapan berisi foto Polaroid kenangan, pesan cinta, serta undangan kencan (Date Invitation).

---

## 🎮 Fitur & Alur Permainan

1. **Layar Pembuka (Start Screen) & Musik Latar (BGM)**:
   - Pemain disambut layar pembuka bertema hangat dengan tombol **"▶️ Mulai Petualangan (& Nyalakan Musik 🎵)"**.
   - Musik latar diputar otomatis saat petualangan dimulai (`/audio/bgm.mp3`).
   - Tombol toggle **"🎵 Musik: ON / 🔇 OFF"** tersedia di pojok kanan HUD.

2. **Eksplorasi Map 800x600 (Cozy Indie Scrapbook)**:
   - Arena map bernuansa hangat dengan jalan setapak tanah (*dirt paths*), pondok kayu, pagar, jamur, dan bunga-bunga tepi taman.
   - Karakter pemain menggunakan foto avatar asli (`/photos/player.png`) dengan fallback emoji `🧑`.
   - Karakter dapat digerakkan menggunakan tombol keyboard **W, A, S, D** atau tombol panah (**Arrow Keys**), serta tombol 3D **D-Pad** pada layar untuk sentuh / mouse.
   - Deteksi interaksi otomatis saat mendekati zona: Pohon Harapan (tengah), Pos 1 (kiri atas), Pos 2 (kanan atas), Pos 3 (kiri bawah).

3. **Pos 1: Memory Match Game (6 Pasang Foto Kenangan)**:
   - Mencocokkan 12 kartu (6 pasang foto kenangan pasangan di `/photos/memori-*.jpg`).
   - Efek suara klik kartu dan suara kemenangan.
   - Menang saat seluruh 6 pasang kartu terbuka untuk memperoleh **1 Ember Air 💧**.

4. **Pos 2: Tangkap Tetes Air (Mini Arcade Catcher)**:
   - Mengendalikan ember di arena mini 400x320 untuk menangkap 23 tetesan air murni.
   - Dilengkapi efek suara tangkap air dan kena bom/daun.
   - Capai target 23 tetes air untuk memperoleh **1 Ember Air 💧**.

5. **Pos 3: Hidden Object Game (Cari 5 Tetes Air Tersembunyi)**:
   - Menemukan 5 tetes air yang tersamar di atas foto kenangan taman (`/photos/bg-hidden.jpg`).
   - Tersedia tombol petunjuk (hint) untuk membantu pemain.
   - Temukan kelima tetes air untuk memperoleh **1 Ember Air 💧**.

6. **Animasi Menyiram Pohon Harapan (3 Tahap)**:
   - **Tahap 0 (Benih 🌱)** ➡️ **Tahap 1 (Tunas 🌿)** ➡️ **Tahap 2 (Pohon Muda 🌳)** ➡️ **Tahap 3 (Pohon Berbuah 🍎🌳🍎)**.
   - Dilengkapi animasi teko menyiram air (`🚿💧✨`) dan efek *scale bounce* saat pohon disiram.

7. **Buah Surat Harapan, Foto Polaroid & RSVP Date Invitation**:
   - Petik buah saat pohon berbuah lebat untuk membuka amplop surat interaktif (dengan efek partikel melayang 🌸💖).
   - Menampilkan foto kenangan bergaya **Polaroid** miring dengan tulisan tangan *"Happy Birthday, My Favorite Person! 💕"*.
   - Surat ucapan ulang tahun 3 paragraf yang romantis dan tulus.
   - Kartu interaktif **Date Invitation** dengan pilihan agenda kencan (Dinner Romantis, Jalan-Jalan & Jajan, atau Nonton & Quality Time) beserta tombol konfirmasi RSVP.
   - Tombol **Main Lagi dari Awal** untuk mengulang permainan kapan saja.

8. **Sistem Audio Lengkap (Web Audio API)**:
   - Efek suara sintetis 8-bit/cozy tanpa dependensi file eksternal: `'click'`, `'water'`, `'hit'`, dan `'win'`.

---

## 📁 Struktur Kode & Arsitektur (Clean Code)

Kode dirancang modular, berorientasi komponen, dan terstruktur rapi:

```text
public/
├── audio/
│   └── bgm.mp3                    # Musik latar romantis / cozy
└── photos/
    ├── bg-hidden.jpg              # Latar foto mini-game Pos 3
    ├── memori-1..6.jpg            # 6 Foto kenangan mini-game Pos 1
    ├── player.png                 # Foto avatar pemain
    └── polaroid-ultah.jpg         # Foto polaroid di dalam surat
src/
├── components/
│   ├── controls/
│   │   └── DPadControls.tsx       # Kontrol D-Pad sentuh/mouse 4 arah 3D
│   ├── hud/
│   │   ├── GameHud.tsx            # Bar HUD status air, pohon, pos & tombol audio
│   │   └── ToastBanner.tsx        # Banner notifikasi petunjuk gaya kertas kayu
│   ├── map/
│   │   ├── GameMap.tsx            # Kanvas 800x600, dirt paths, pondok & animasi siram
│   │   └── NearbyPrompt.tsx       # Tombol prompt 3D chunky saat dekat zona
│   └── modals/
│       ├── CatchWaterModal.tsx    # Pos 2: Mini-game tangkap tetes air + SFX
│       ├── HiddenObjectModal.tsx  # Pos 3: Mini-game foto hidden object + SFX
│       ├── LetterModal.tsx        # Modal surat harapan, foto polaroid & RSVP
│       └── MemoryGameModal.tsx    # Pos 1: Mini-game foto kenangan + SFX
├── constants/
│   └── game.ts                    # Konfigurasi zona map, path foto, objek & partikel
├── prd/
│   └── prd_game_flow.md           # Dokumen alur & spesifikasi permainan
├── types/
│   └── game.ts                    # Deklarasi tipe & interface TypeScript
├── utils/
│   ├── audio.ts                   # Web Audio API synthesizer SFX (click, water, hit, win)
│   └── collision.ts               # Utilitas deteksi jarak / bounding box
├── App.tsx                        # Root orchestrator & pengelola state game
├── index.css                      # Konfigurasi Tailwind CSS & font Fredoka/Quicksand
└── main.tsx                       # Entry point aplikasi React 19
```

---

## 🚀 Menjalankan Proyek Secara Lokal

1. **Install dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di browser Anda.

3. **Build untuk produksi**:
   ```bash
   npm run build
   ```

4. **Linting kode**:
   ```bash
   npm run lint
   ```
