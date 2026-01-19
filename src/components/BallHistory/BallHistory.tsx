import { useGameStore } from '../../stores/gameStore';
import { BALL_COLORS, type BingoColumn } from '../../types';
import { translations as t } from '../../utils/translations';

const COLUMNS: BingoColumn[] = ['B', 'I', 'N', 'G', 'O'];

export function BallHistory() {
  const { calledBalls } = useGameStore();
  const calledSet = new Set(calledBalls.map(b => b.number));

  const columnNumbers: Record<BingoColumn, number[]> = {
    B: Array.from({ length: 15 }, (_, i) => i + 1),
    I: Array.from({ length: 15 }, (_, i) => i + 16),
    N: Array.from({ length: 15 }, (_, i) => i + 31),
    G: Array.from({ length: 15 }, (_, i) => i + 46),
    O: Array.from({ length: 15 }, (_, i) => i + 61)
  };

  return (
    <div className="memphis-card p-4 h-full">
      <h2 className="text-lg font-bold mb-4 text-black flex items-center gap-2">
        <span className="inline-block w-3 h-3 bg-[#3D8BFF] border-2 border-black rounded-full"></span>
        {t.ballHistory}
      </h2>

      <div className="grid grid-cols-5 gap-1">
        {/* Column headers */}
        {COLUMNS.map(col => (
          <div
            key={col}
            className="text-center font-black text-xl py-3 rounded-t-lg border-3 border-black shadow-[2px_2px_0px_#000]"
            style={{ backgroundColor: BALL_COLORS[col], color: col === 'N' ? '#000' : '#fff' }}
          >
            {col}
          </div>
        ))}

        {/* Number grid - 15 rows */}
        {Array.from({ length: 15 }, (_, rowIndex) => (
          COLUMNS.map(col => {
            const number = columnNumbers[col][rowIndex];
            const isCalled = calledSet.has(number);

            return (
              <div
                key={`${col}-${number}`}
                className={`
                  number-cell text-center py-2 text-sm transition-all duration-300 rounded-sm
                  ${isCalled
                    ? 'called text-white scale-105'
                    : 'bg-white text-gray-400'
                  }
                `}
                style={isCalled ? { backgroundColor: BALL_COLORS[col], color: col === 'N' ? '#000' : '#fff' } : undefined}
              >
                {number}
              </div>
            );
          })
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 flex justify-between">
        <span className="px-3 py-2 bg-[#5AE35A] text-black font-bold text-sm rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
          {t.called}: {calledBalls.length}
        </span>
        <span className="px-3 py-2 bg-[#FFD93D] text-black font-bold text-sm rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
          {t.remaining}: {75 - calledBalls.length}
        </span>
      </div>
    </div>
  );
}
