import { useState } from "react";
import { CELEBRATION_PARTICLES } from "../../constants/game";
import { playSfx } from "../../utils/audio";

interface LetterModalProps {
  onClose: () => void;
  onResetGame: () => void;
}

// Komponen Foto Polaroid Romantis (Issue #26)
function PolaroidPhoto() {
  const [imgSrc, setImgSrc] = useState("/photos/polaroid-ultah.JPG");
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc.endsWith(".JPG")) {
      setImgSrc("/photos/polaroid-ultah.jpg");
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="bg-white p-3 pb-6 rounded-2xl shadow-xl border border-stone-200 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 max-w-[220px] mx-auto my-3 select-none">
      <div className="w-full h-44 rounded-xl overflow-hidden bg-rose-50 flex items-center justify-center border border-stone-100">
        {!hasError ? (
          <img
            src={imgSrc}
            alt="Foto Kenangan Ulang Tahun"
            className="w-full h-full object-cover"
            onError={handleError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <span className="text-5xl animate-bounce mb-1">🎂💖</span>
            <span className="text-xs font-bold text-rose-500">Momen Terindah Kita</span>
          </div>
        )}
      </div>
      <p className="text-xs font-black text-stone-700 mt-2.5 tracking-tight text-center italic">
        Happy Birthday, My Favorite Person! 💕
      </p>
    </div>
  );
}

/**
 * Komponen Modal Surat Ulang Tahun (LetterModal)
 * Menampilkan amplop interaktif yang dapat dibuka, foto polaroid kenangan,
 * surat pesan cinta 3 paragraf, kartu RSVP Date Invitation, dan opsi reset game.
 */
export default function LetterModal({
  onClose,
  onResetGame,
}: LetterModalProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("Dinner Romantis 🍽️");
  const [rsvpAccepted, setRsvpAccepted] = useState<boolean>(false);

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
    playSfx("win");
  };

  const handleSelectPlan = (plan: string) => {
    playSfx("click");
    setSelectedPlan(plan);
  };

  const handleAcceptRsvp = () => {
    playSfx("win");
    setRsvpAccepted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Efek Partikel Kelopak Bunga & Hati Melayang (Issue #23) */}
      {CELEBRATION_PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="pointer-events-none select-none fixed top-4 text-2xl animate-bounce z-50 opacity-90 drop-shadow-sm"
          style={{
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: "2.2s",
          }}
        >
          {particle.icon}
        </span>
      ))}

      {/* Tampilan 1: Amplop Tertutup (Issue #21) */}
      {!isEnvelopeOpen ? (
        <div className="bg-[#fffdf7] border-4 border-[#d4a373] shadow-[0_12px_0_#bc8a5f] rounded-3xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-200 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#99582a] hover:text-[#582f0e] font-black text-xl px-2 py-1 cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>
          <div className="text-7xl animate-bounce my-4 select-none">💌</div>
          <h2 className="text-2xl font-black text-[#582f0e] mb-2 tracking-tight">
            Buah Surat Harapan
          </h2>
          <p className="text-[#7f5539] text-sm leading-relaxed mb-6 font-medium">
            Kamu menemukan Buah Surat Harapan! Ada pesan spesial di dalamnya yang telah tumbuh bersama usaha dan kasih sayangmu.
          </p>
          <button
            type="button"
            onClick={handleOpenEnvelope}
            className="bg-[#e76f51] hover:bg-[#f4a261] text-white font-black py-3.5 px-6 rounded-2xl w-full border-2 border-[#d46043] border-b-6 border-b-[#b84326] active:border-b-2 active:translate-y-1 shadow-lg cursor-pointer transition-all text-base"
          >
            Buka Amplop Sekarang ✨
          </button>
        </div>
      ) : (
        /* Tampilan 2: Surat Terbuka + Foto Polaroid + Undangan Kencan + RSVP */
        <div className="bg-[#fffdf7] border-4 border-[#d4a373] shadow-[0_12px_0_#bc8a5f] rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[88vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 text-center">
          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#99582a] hover:text-[#582f0e] font-black text-xl px-2 py-1 cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>

          {/* Hiasan Atas */}
          <div className="flex justify-center gap-2 text-xl select-none mb-1">
            <span>🌸</span>
            <span>✨</span>
            <span>💖</span>
            <span>✨</span>
            <span>🌸</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#b7094c] mb-2 tracking-tight">
            Selamat Ulang Tahun, Sayangku! 🎂❤️
          </h2>

          {/* Foto Polaroid Kenangan (Issue #26) */}
          <PolaroidPhoto />

          {/* 3 Paragraf Isi Surat */}
          <div className="text-[#582f0e] text-sm sm:text-base leading-relaxed space-y-3 text-left font-medium mt-3">
            <p>
              Halo Ndoro kesayanganku! Selamat bertambah usia ya. Melihatmu berhasil menyelesaikan tantangan di setiap pos—mulai dari mencocokkan kepingan memori kita, menangkap tetesan air dengan penuh sabar, hingga mencari hal-hal kecil yang tersembunyi—mengingatkanku pada betapa berharganya setiap langkah yang kita lewati bersama.
            </p>
            <p>
              Sama seperti Pohon Harapan yang kamu rawat dari sebutir bibit kecil hingga tumbuh mekar dan berbuah lebat berkat tiga ember air penuh perjuangan, cintaku dan rasa syukurku memilikimu pun akan selalu bertumbuh subur setiap hari.
            </p>
            <p>
              Semoga di usia yang baru ini, setiap langkahmu selalu dipeluk kebahagiaan, kesehatan, kemudahan, dan tawa yang tak pernah pudar. Terima kasih sudah selalu menjadi alasan terindah untuk tersenyum.
            </p>
            <p className="text-right italic font-bold text-[#b7094c] pt-1">
              — Dari yang selalu menyayangimu sepenuh hati 💕
            </p>
          </div>

          {/* Garis Pemisah Kayu/Scrapbook */}
          <div className="my-6 border-t-2 border-dashed border-[#d4a373]" />

          {/* Bagian Date Invitation Interaktif (Issue #22) */}
          <div className="bg-[#faedcd]/80 border-2 border-[#d4a373] rounded-2xl p-5 text-left shadow-sm">
            <div className="text-center mb-3">
              <span className="text-xs uppercase font-black text-[#b7094c] tracking-wider bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                DATE INVITATION
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#582f0e] mt-2">
                ✨ Undangan Kencan Spesial Ulang Tahun ✨
              </h3>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm text-[#7f5539] mb-4 font-semibold">
              <p>📅 <strong>Waktu:</strong> Akhir Pekan Ini (Sabtu / Minggu)</p>
              <p>📍 <strong>Lokasi:</strong> Tempat Spesial Kita</p>
              <p>👗 <strong>Dresscode:</strong> Pakaian favoritmu yang paling nyaman & cantik</p>
            </div>

            {/* Pilihan Rencana Kencan (Chunky 3D Buttons) */}
            <div className="mb-4">
              <p className="text-xs font-bold text-[#582f0e] mb-2">
                Pilih rencana kencan yang paling kamu inginkan:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  "Dinner Romantis 🍽️",
                  "Jalan-Jalan & Jajan 🍦",
                  "Nonton & Quality Time 🎬",
                ].map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    disabled={rsvpAccepted}
                    onClick={() => handleSelectPlan(plan)}
                    className={`text-xs font-black py-2.5 px-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedPlan === plan
                        ? "bg-[#e76f51] text-white border-[#b84326] border-b-4 border-b-[#943017] shadow-md scale-102"
                        : "bg-[#fffdf7] text-[#7f5539] border-[#d4a373] border-b-4 border-b-[#bc8a5f] hover:bg-[#fefae0] active:border-b-0 active:translate-y-1"
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            {/* Tombol Konfirmasi RSVP */}
            {!rsvpAccepted ? (
              <button
                type="button"
                onClick={handleAcceptRsvp}
                className="bg-[#e76f51] hover:bg-[#f4a261] text-white font-black py-3 px-4 rounded-xl w-full border-2 border-[#b84326] border-b-4 border-b-[#943017] active:border-b-0 active:translate-y-1 shadow-md cursor-pointer transition-all text-sm"
              >
                Aku Mau & Pasti Datang! ❤️
              </button>
            ) : (
              <div className="bg-[#eaf4e8] border-2 border-emerald-400 text-emerald-950 rounded-xl p-3 text-center font-black text-xs sm:text-sm animate-in fade-in shadow-xs">
                Yeay! Janji Kencan Terkunci untuk: <u className="text-[#b7094c]">{selectedPlan}</u> 🥰<br />
                Sampai ketemu nanti ya, sayang!
              </div>
            )}
          </div>

          {/* Tombol Reset Permainan (Issue #24) */}
          {rsvpAccepted && (
            <div className="mt-5 text-center animate-in fade-in">
              <button
                type="button"
                onClick={() => {
                  playSfx("click");
                  onResetGame();
                }}
                className="text-xs bg-[#faedcd] hover:bg-[#fefae0] text-[#7f5539] font-black py-2.5 px-4 rounded-xl border-2 border-[#d4a373] border-b-4 border-b-[#b08968] active:border-b-0 active:translate-y-1 shadow-xs cursor-pointer transition-all"
              >
                🔄 Main Lagi dari Awal
              </button>
            </div>
          )}

          {/* Hiasan Bawah */}
          <div className="flex justify-center gap-2 text-xl select-none mt-5">
            <span>🌷</span>
            <span>💖</span>
            <span>🌹</span>
            <span>💖</span>
            <span>🌷</span>
          </div>
        </div>
      )}
    </div>
  );
}
