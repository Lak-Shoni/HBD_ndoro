interface DPadControlsProps {
  onDirectionPress: (key: string) => void;
  onDirectionRelease: (key: string) => void;
}

/**
 * Komponen D-Pad kontrol layar sentuh / mouse untuk pergerakan karakter 4 arah.
 * Didesain dengan tombol 3D bernuansa kayu hangat.
 */
export default function DPadControls({
  onDirectionPress,
  onDirectionRelease,
}: DPadControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4 w-44 select-none">
      <div />
      <button
        type="button"
        onMouseDown={() => onDirectionPress("ArrowUp")}
        onMouseUp={() => onDirectionRelease("ArrowUp")}
        onMouseLeave={() => onDirectionRelease("ArrowUp")}
        onTouchStart={() => onDirectionPress("ArrowUp")}
        onTouchEnd={() => onDirectionRelease("ArrowUp")}
        className="bg-[#d4a373] hover:bg-[#c69263] active:bg-[#b08054] text-[#fffdf7] rounded-2xl p-3 text-lg font-black border-2 border-[#b08968] border-b-4 border-b-[#7f5539] active:border-b-0 active:translate-y-1 shadow-md cursor-pointer text-center transition-all select-none"
        aria-label="Up"
      >
        ▲
      </button>
      <div />

      <button
        type="button"
        onMouseDown={() => onDirectionPress("ArrowLeft")}
        onMouseUp={() => onDirectionRelease("ArrowLeft")}
        onMouseLeave={() => onDirectionRelease("ArrowLeft")}
        onTouchStart={() => onDirectionPress("ArrowLeft")}
        onTouchEnd={() => onDirectionRelease("ArrowLeft")}
        className="bg-[#d4a373] hover:bg-[#c69263] active:bg-[#b08054] text-[#fffdf7] rounded-2xl p-3 text-lg font-black border-2 border-[#b08968] border-b-4 border-b-[#7f5539] active:border-b-0 active:translate-y-1 shadow-md cursor-pointer text-center transition-all select-none"
        aria-label="Left"
      >
        ◀
      </button>
      <div className="flex items-center justify-center text-[#99582a] text-xs font-black tracking-wider">
        MOVE
      </div>
      <button
        type="button"
        onMouseDown={() => onDirectionPress("ArrowRight")}
        onMouseUp={() => onDirectionRelease("ArrowRight")}
        onMouseLeave={() => onDirectionRelease("ArrowRight")}
        onTouchStart={() => onDirectionPress("ArrowRight")}
        onTouchEnd={() => onDirectionRelease("ArrowRight")}
        className="bg-[#d4a373] hover:bg-[#c69263] active:bg-[#b08054] text-[#fffdf7] rounded-2xl p-3 text-lg font-black border-2 border-[#b08968] border-b-4 border-b-[#7f5539] active:border-b-0 active:translate-y-1 shadow-md cursor-pointer text-center transition-all select-none"
        aria-label="Right"
      >
        ▶
      </button>

      <div />
      <button
        type="button"
        onMouseDown={() => onDirectionPress("ArrowDown")}
        onMouseUp={() => onDirectionRelease("ArrowDown")}
        onMouseLeave={() => onDirectionRelease("ArrowDown")}
        onTouchStart={() => onDirectionPress("ArrowDown")}
        onTouchEnd={() => onDirectionRelease("ArrowDown")}
        className="bg-[#d4a373] hover:bg-[#c69263] active:bg-[#b08054] text-[#fffdf7] rounded-2xl p-3 text-lg font-black border-2 border-[#b08968] border-b-4 border-b-[#7f5539] active:border-b-0 active:translate-y-1 shadow-md cursor-pointer text-center transition-all select-none"
        aria-label="Down"
      >
        ▼
      </button>
      <div />
    </div>
  );
}
