Bagian 1: PRD Phase 5 — Interactive Letter, Date Invitation, Confetti & Mobile Polish

1. Instruksi Utama & Batasan Wajib (Guardrails)
   JANGAN UBAH ukuran asli container map (800x600), koordinat ke-4 zona, maupun logika di dalam MemoryGameModal, CatchWaterModal, dan HiddenObjectModal.

DILARANG MENGINSTAL LIBRARY BARU: Jangan menginstal paket eksternal seperti canvas-confetti atau framer-motion agar tidak terjadi error TypeScript. Gunakan murni React State dan Tailwind CSS.

Gantikan placeholder modal pada activeModal === 'letter' dengan komponen baru <LetterModal/>.

2. Spesifikasi State & Fitur <LetterModal/>
   Komponen LetterModal memiliki 3 tahap interaksi di dalamnya:

Tahap Amplop Tertutup (isEnvelopeOpen === false): Menampilkan visual amplop surat bersegel hati yang berdenyut lembut. Pemain harus mengklik tombol "Buka Amplop Surat 💌" terlebih dahulu.

Tahap Isi Surat & Undangan (isEnvelopeOpen === true): Menampilkan efek kelopak bunga/hati berjatuhan, teks ucapan ulang tahun, dan kartu Undangan Kencan (Date Invitation) di bagian bawah.

Tahap Konfirmasi RSVP (rsvpAccepted === true): Pemain dapat memilih opsi aktivitas/makanan kencan dan menekan tombol "Aku Mau & Pasti Datang! ❤️" yang akan memunculkan pesan konfirmasi romantis di layar.
