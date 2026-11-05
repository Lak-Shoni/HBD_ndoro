interface ToastBannerProps {
  message: string;
}

/**
 * Komponen ToastBanner untuk notifikasi dan instruksi gameplay kepada pemain.
 * Menggunakan gaya cozy paper scrapbook hangat.
 */
export default function ToastBanner({ message }: ToastBannerProps) {
  return (
    <div className="w-[800px] bg-[#fffdf7] border-4 border-[#d4a373] text-[#6f4e37] px-5 py-3 rounded-2xl mb-3 text-sm font-bold shadow-[0_5px_0_#bc8a5f] flex items-center justify-center gap-2 tracking-wide">
      <span className="text-lg">📢</span>
      <span>{message}</span>
    </div>
  );
}
