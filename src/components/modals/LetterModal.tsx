import { useState } from "react";
import { CELEBRATION_PARTICLES } from "../../constants/game";

interface LetterModalProps {
  onClose: () => void;
  onResetGame: () => void;
}

/**
 * Komponen Modal Surat Ulang Tahun (LetterModal)
 * Menampilkan amplop interaktif yang dapat dibuka, surat pesan cinta 3 paragraf,
 * kartu RSVP Date Invitation dengan 3 pilihan kencan, dan opsi reset game.
 */
export default function LetterModal({
  onClose,
  onResetGame,
}: LetterModalProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("Dinner Romantis 🍽️");
  const [rsvpAccepted, setRsvpAccepted] = useState<boolean>(false);

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
        <div className="bg-rose-100 border-4 border-rose-300 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl px-2 py-1 cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>
          <div className="text-7xl animate-bounce my-4 select-none">💌</div>
          <h2 className="text-2xl font-extrabold text-rose-700 mb-2">
            Buah Surat Harapan
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            Kamu menemukan Buah Surat Harapan! Ada pesan spesial di dalamnya yang telah tumbuh bersama usaha dan kasih sayangmu.
          </p>
          <button
            type="button"
            onClick={() => setIsEnvelopeOpen(true)}
            className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl w-full shadow-lg hover:shadow-rose-400/40 cursor-pointer transition-all text-base"
          >
            Buka Amplop Sekarang ✨
          </button>
        </div>
      ) : (
        /* Tampilan 2: Surat Terbuka + Undangan Kencan + RSVP (Issue #21, #22, #24) */
        <div className="bg-gradient-to-b from-amber-50 via-white to-rose-50 border-4 border-rose-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[88vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-center">
          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl px-2 py-1 cursor-pointer transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>

          {/* Hiasan Atas */}
          <div className="flex justify-center gap-2 text-xl select-none mb-2">
            <span>🌸</span>
            <span>✨</span>
            <span>💖</span>
            <span>✨</span>
            <span>🌸</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-600 mb-4 tracking-tight">
            Selamat Ulang Tahun, Sayangku! 🎂❤️
          </h2>

          {/* 3 Paragraf Isi Surat */}
          <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-3 text-left">
            <p>
              Halo Ndoro kesayanganku! Selamat bertambah usia ya. Melihatmu berhasil menyelesaikan tantangan di setiap pos—mulai dari mencocokkan kepingan memori kita, menangkap tetesan air dengan penuh sabar, hingga mencari hal-hal kecil yang tersembunyi—mengingatkanku pada betapa berharganya setiap langkah yang kita lewati bersama.
            </p>
            <p>
              Sama seperti Pohon Harapan yang kamu rawat dari sebutir bibit kecil hingga tumbuh mekar dan berbuah lebat berkat tiga ember air penuh perjuangan, cintaku dan rasa syukurku memilikimu pun akan selalu bertumbuh subur setiap hari.
            </p>
            <p>
              Semoga di usia yang baru ini, setiap langkahmu selalu dipeluk kebahagiaan, kesehatan, kemudahan, dan tawa yang tak pernah pudar. Terima kasih sudah selalu menjadi alasan terindah untuk tersenyum.
            </p>
            <p className="text-right italic font-semibold text-rose-600 pt-1">
              — Dari yang selalu menyayangimu sepenuh hati 💕
            </p>
          </div>

          {/* Garis Pemisah */}
          <div className="my-6 border-t-2 border-dashed border-rose-200" />

          {/* Bagian Date Invitation Interaktif (Issue #22) */}
          <div className="bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-5 text-left shadow-sm">
            <div className="text-center mb-3">
              <span className="text-xs uppercase font-extrabold text-rose-500 tracking-wider bg-rose-100 px-3 py-1 rounded-full">
                DATE INVITATION
              </span>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mt-2">
                ✨ Undangan Kencan Spesial Ulang Tahun ✨
              </h3>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm text-gray-600 mb-4">
              <p>📅 <strong>Waktu:</strong> Akhir Pekan Ini (Sabtu / Minggu)</p>
              <p>📍 <strong>Lokasi:</strong> Tempat Spesial Kita</p>
              <p>👗 <strong>Dresscode:</strong> Pakaian favoritmu yang paling nyaman & cantik</p>
            </div>

            {/* Pilihan Rencana Kencan */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-700 mb-2">
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
                    onClick={() => setSelectedPlan(plan)}
                    className={`text-xs font-bold py-2 px-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedPlan === plan
                        ? "bg-rose-500 text-white border-rose-600 shadow-md scale-102"
                        : "bg-white text-gray-700 border-rose-200 hover:bg-rose-50"
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
                onClick={() => setRsvpAccepted(true)}
                className="bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl w-full shadow-md cursor-pointer transition-all text-sm"
              >
                Aku Mau & Pasti Datang! ❤️
              </button>
            ) : (
              <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-900 rounded-xl p-3 text-center font-bold text-xs sm:text-sm animate-in fade-in">
                Yeay! Janji Kencan Terkunci untuk: <u className="text-rose-600">{selectedPlan}</u> 🥰<br />
                Sampai ketemu nanti ya, sayang!
              </div>
            )}
          </div>

          {/* Tombol Reset Permainan (Issue #24) */}
          {rsvpAccepted && (
            <div className="mt-5 text-center animate-in fade-in">
              <button
                type="button"
                onClick={onResetGame}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl border border-gray-300 shadow-xs cursor-pointer transition-colors"
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
