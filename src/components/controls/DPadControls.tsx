interface DPadControlsProps {
  onDirectionPress: (key: string) => void;
  onDirectionRelease: (key: string) => void;
}

/**
 * Komponen D-Pad kontrol layar sentuh / mouse untuk pergerakan karakter 4 arah.
 */
export default function DPadControls({
  onDirectionPress,
  onDirectionRelease,
}: DPadControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4 w-40">
      <div />
      <button
        type="button"
        onMouseDown={() => onDirectionPress("ArrowUp")}
        onMouseUp={() => onDirectionRelease("ArrowUp")}
        onMouseLeave={() => onDirectionRelease("ArrowUp")}
        onTouchStart={() => onDirectionPress("ArrowUp")}
        onTouchEnd={() => onDirectionRelease("ArrowUp")}
        className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg p-3 text-lg font-bold shadow-md cursor-pointer text-center select-none"
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
        className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg p-3 text-lg font-bold shadow-md cursor-pointer text-center select-none"
        aria-label="Left"
      >
        ◀
      </button>
      <div className="flex items-center justify-center text-gray-500 text-xs font-semibold">
        MOVE
      </div>
      <button
        type="button"
        onMouseDown={() => onDirectionPress("ArrowRight")}
        onMouseUp={() => onDirectionRelease("ArrowRight")}
        onMouseLeave={() => onDirectionRelease("ArrowRight")}
        onTouchStart={() => onDirectionPress("ArrowRight")}
        onTouchEnd={() => onDirectionRelease("ArrowRight")}
        className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg p-3 text-lg font-bold shadow-md cursor-pointer text-center select-none"
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
        className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg p-3 text-lg font-bold shadow-md cursor-pointer text-center select-none"
        aria-label="Down"
      >
        ▼
      </button>
      <div />
    </div>
  );
}

