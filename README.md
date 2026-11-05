# Pohon Harapan - HBD Ndoro 🎂🌱

Mini RPG Web Interaktif 2D bertema perayaan ulang tahun spesial. Pemain menjelajahi peta taman berukuran 800x600, menyelesaikan tantangan mini-game di tiga pos sudut map untuk mengumpulkan air suci, menyiram dan menumbuhkan Pohon Harapan dari sebutir bibit hingga berbuah lebat, dan membuka Buah Surat Harapan berisi pesan cinta serta undangan kencan (Date Invitation).

---

## 🎮 Fitur & Alur Permainan

1. **Eksplorasi Map 800x600**:
   - Karakter dapat digerakkan menggunakan tombol keyboard **W, A, S, D** atau tombol panah (**Arrow Keys**), serta kontrol layar **D-Pad** untuk perangkat sentuh / mouse.
   - Deteksi interaksi otomatis saat mendekati zona (Pohon Harapan di tengah, Pos 1 di kiri atas, Pos 2 di kanan atas, Pos 3 di kiri bawah).
   - Tekan **Spasi** / **Enter** atau klik tombol prompt kuning yang muncul untuk berinteraksi.

2. **Pos 1: Memory Match Game (6 Pasang Kartu)**:
   - Mencocokkan 12 kartu (6 pasang emoji kenangan romantis).
   - Menang saat seluruh 6 pasang kartu terbuka untuk memperoleh **1 Ember Air 💧**.

3. **Pos 2: Tangkap Tetes Air (Mini Arcade Catcher)**:
   - Mengendalikan ember di arena mini 400x320 untuk menangkap 23 tetesan air murni.
   - Hindari bom 💣 yang dapat mengurangi tetesan air.
   - Capai target 23 tetes air untuk memperoleh **1 Ember Air 💧**.

4. **Pos 3: Hidden Object Game (Cari 5 Tetes Air Tersembunyi)**:
   - Menemukan 5 tetes air yang tersamar di antara ilustrasi taman.
   - Tersedia tombol petunjuk (hint) untuk membantu pemain.
   - Temukan kelima tetes air untuk memperoleh **1 Ember Air 💧**.

5. **Pertumbuhan Pohon Harapan (3 Tahap)**:
   - **Tahap 0 (Benih 🌱)** ➡️ **Tahap 1 (Tunas 🌿)** ➡️ **Tahap 2 (Pohon Muda 🌳)** ➡️ **Tahap 3 (Pohon Berbuah 🍎🌳🍎)**.
   - Setiap kali disiram dengan 1 Ember Air, pohon bertumbuh ke tahap berikutnya.

6. **Buah Surat Harapan & RSVP Date Invitation**:
   - Saat pohon berbuah lebat, petik buah untuk membuka amplop surat interaktif (dengan efek partikel melayang 🌸💖).
   - Berisi surat ucapan ulang tahun 3 paragraf yang romantis dan tulus.
   - Kartu interaktif **Date Invitation** dengan pilihan agenda kencan (Dinner Romantis, Jalan-Jalan & Jajan, atau Nonton & Quality Time) beserta tombol konfirmasi RSVP.
   - Tombol **Main Lagi dari Awal** untuk mengulang permainan kapan saja.

---

## 📁 Struktur Kode & Arsitektur (Clean Code)

Kode telah direfaktor dan dipecah secara modular untuk memudahkan pemeliharaan:

```text
src/
├── components/
│   ├── controls/
│   │   └── DPadControls.tsx       # Kontrol D-Pad sentuh/mouse 4 arah
│   ├── hud/
│   │   ├── GameHud.tsx            # Bar HUD status air, tahap pohon & pos
│   │   └── ToastBanner.tsx        # Banner notifikasi petunjuk & status
│   ├── map/
│   │   ├── GameMap.tsx            # Arena kanvas map 800x600, zona & karakter
│   │   └── NearbyPrompt.tsx       # Tombol prompt interaksi saat dekat zona
│   └── modals/
│       ├── CatchWaterModal.tsx    # Pos 2: Mini-game tangkap tetes air
│       ├── HiddenObjectModal.tsx  # Pos 3: Mini-game cari objek tersembunyi
│       ├── LetterModal.tsx        # Modal surat harapan, amplop & RSVP
│       └── MemoryGameModal.tsx    # Pos 1: Mini-game memory match kartu
├── constants/
│   └── game.ts                    # Konfigurasi zona map, kartu, objek & partikel
├── prd/
│   └── prd_game_flow.md           # Dokumen alur & spesifikasi permainan
├── types/
│   └── game.ts                    # Deklarasi tipe & interface TypeScript
├── utils/
│   └── collision.ts               # Fungsi utilitas deteksi jarak / bounding box
├── App.tsx                        # Root orchestrator & pengelola state game
├── index.css                      # Konfigurasi Tailwind CSS
└── main.tsx                       # Entry point aplikasi React 19
```

---

## 🚀 Menjalankan Proyek Secara Lokal

Pastikan Node.js sudah terpasang di komputer Anda.

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
