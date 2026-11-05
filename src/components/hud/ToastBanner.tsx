interface ToastBannerProps {
  message: string;
}

/**
 * Komponen ToastBanner untuk notifikasi dan instruksi gameplay kepada pemain.
 */
export default function ToastBanner({ message }: ToastBannerProps) {
  return (
    <div className="w-[800px] bg-amber-100 border-2 border-amber-400 text-amber-900 px-4 py-2.5 rounded-xl mb-3 text-sm font-semibold shadow-md flex items-center justify-center gap-2">
      <span className="text-base">📢</span>
      <span>{message}</span>
    </div>
  );
}

