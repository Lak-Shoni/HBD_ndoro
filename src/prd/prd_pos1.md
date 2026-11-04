PRD Phase 2A: Mini-Game 1 (Memory Card Flip & Match)

1. Instruksi Utama untuk AI (PENTING)
   JANGAN HAPUS ATAU UBAH logika pergerakan map, koordinat, atau state utama dari Phase 1 di app/page.tsx.

Tugasmu HANYA membuat komponen MemoryGameModal dan mengganti isi modal placeholder activeModal === 'game1' dengan komponen ini.

Buat kode sesederhana mungkin dalam satu file yang sama (app/page.tsx) atau komponen lokal di bawahnya tanpa library tambahan.

2. Kontrak Props (Hubungan dengan Map Utama)
   Komponen MemoryGameModal menerima 2 fungsi (props) dari komponen utama:

onWin: Fungsi yang dijalankan saat pemain menang. Efeknya sama persis dengan tombol "Simulasi Menang" di Phase 1:

waterCount bertambah 1.

completedGames.game1 menjadi true.

activeModal kembali menjadi 'none'.

toastMessage berubah menjadi "Misi Pos 1 selesai! Kamu dapat 1 Air 💧. Ayo siram pohonnya!"

onClose: Fungsi untuk menutup modal (setActiveModal('none')) jika pemain ingin keluar sebelum selesai.

3. Data & State di Dalam MemoryGameModal
   Gunakan 6 pasang ikon (total 12 kartu). Nantinya ikon ini bisa diganti dengan foto pasangan.

TypeScript
// Daftar 6 ikon dasar (akan digandakan jadi 12 kartu)
const CARD_ITEMS = ["❤️", "🌹", "🧸", "🍫", "💍", "💌"];

// Struktur data tiap kartu
interface Card {
id: number; // Index unik 0 sampai 11
content: string; // Emoji atau URL gambar
isFlipped: boolean; // Apakah kartu sedang terbuka
isMatched: boolean; // Apakah pasangan kartu sudah ditemukan
}
State yang dibutuhkan di dalam komponen game:

cards: Array berisi 12 objek Card.

flippedCards: Array berisi angka id kartu yang sedang dibuka pada giliran ini (maksimal 2 angka, contoh: [2, 7]).

isChecking: Boolean (true atau false) untuk mengunci klik sementara saat menunggu 2 kartu yang salah tertutup kembali.

isGameWon: Boolean (true jika semua 12 kartu sudah isMatched: true).

4. Alur Logika Game (Step-by-Step)
   Langkah 1: Inisialisasi & Acak Kartu (Saat Modal Dibuka)
   Saat komponen pertama kali muncul (useEffect), gandakan CARD_ITEMS menjadi 12 item, acak urutannya, lalu masukkan ke state cards:

TypeScript
const initGame = () => {
const duplicated = [...CARD_ITEMS, ...CARD_ITEMS];
const shuffled = duplicated
.sort(() => Math.random() - 0.5)
.map((item, index) => ({
id: index,
content: item,
isFlipped: false,
isMatched: false,
}));
setCards(shuffled);
setFlippedCards([]);
setIsChecking(false);
setIsGameWon(false);
};
Langkah 2: Logika Saat Kartu Diklik (handleCardClick(id))
Saat pemain mengklik kartu dengan id tertentu:

Validasi Klik: Abaikan klik (jangan lakukan apa-apa) jika:

isChecking bernilai true

Kartu tersebut sudah terbuka (cards[id].isFlipped === true)

Kartu tersebut sudah cocok (cards[id].isMatched === true)

Buka Kartu: Ubah cards[id].isFlipped menjadi true, lalu masukkan id ke dalam array flippedCards.

Cek Jika Sudah 2 Kartu Terbuka:

Jika panjang flippedCards sekarang menjadi 2 (misal firstId dan secondId):

Set isChecking(true) agar pemain tidak bisa klik kartu ke-3.

Jika Isinya SAMA (cards[firstId].content === cards[secondId].content):

Ubah isMatched pada kedua kartu tersebut menjadi true.

Kosongkan flippedCards menjadi [].

Set isChecking(false).

Jika Isinya BERBEDA:

Gunakan setTimeout selama 800 milidetik (0.8 detik).

Setelah 0.8 detik, ubah isFlipped kedua kartu kembali menjadi false.

Kosongkan flippedCards menjadi [].

Set isChecking(false).

Langkah 3: Cek Kondisi Menang
Gunakan useEffect yang memantau perubahan state cards:

Jika cards.length adalah 12 DAN semua kartu memiliki isMatched === true, maka ubah isGameWon menjadi true.

5. Desain Tampilan UI (Tailwind CSS)
   Container Modal: Layar gelap transparan di belakang (fixed inset-0 bg-black/60 flex items-center justify-center z-50), dengan kotak putih di tengah (bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl).

Header Modal: Judul "Pos 1: Cocokkan Memori Kita", tombol "Tutup (X)" di pojok kanan atas, dan tombol kecil "Acak Ulang" di bawahnya.

Grid Kartu: Gunakan grid 4 kolom x 3 baris (grid grid-cols-4 gap-3 my-4).

Tampilan Tiap Kartu:

Ukuran kotak proporsional (h-20 rounded-xl flex items-center justify-center text-3xl cursor-pointer transition-all duration-200).

Jika tertutup (!isFlipped && !isMatched): Warna latar belakang merah muda/ungu (bg-rose-400 hover:bg-rose-500 text-white), tampilkan tanda tanya "?".

Jika terbuka (isFlipped): Warna latar putih dengan border (bg-amber-50 border-2 border-rose-400), tampilkan card.content (Emoji).

Jika sudah cocok (isMatched): Warna latar hijau lembut (bg-emerald-100 border-2 border-emerald-400 opacity-80), tampilkan card.content.

Tampilan Saat Menang (isGameWon === true):

Tampilkan pesan di bawah grid: "Yeay! Semua memori berhasil dicocokkan! 🎉"

Tampilkan tombol besar berwarna biru/hijau: "Ambil 1 Air 💧 & Kembali ke Map" yang ketika diklik akan memanggil fungsi onWin().
