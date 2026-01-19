import { useGameStore } from '../../stores/gameStore';
import { BALL_COLORS } from '../../types';
import { translations as t } from '../../utils/translations';

export function CurrentBall() {
  const { currentBall, status } = useGameStore();

  if (!currentBall) {
    return (
      <div className="memphis-card p-6 text-center">
        <div className="text-gray-500 text-lg font-bold">
          {status === 'idle' ? t.startGameToBegin : t.clickRollToDraw}
        </div>
        <div className="flex justify-center mt-4">
          <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-3xl text-gray-300">?</span>
          </div>
        </div>
      </div>
    );
  }

  const bgColor = BALL_COLORS[currentBall.column];
  const textColor = currentBall.column === 'N' ? '#000' : '#fff';

  return (
    <div className="memphis-card p-6 text-center">
      <div
        className="memphis-ball inline-flex flex-col items-center justify-center w-36 h-36 rounded-full animate-bounce-once"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-5xl font-black" style={{ color: textColor }}>
          {currentBall.column}-{currentBall.number}
        </span>
      </div>
      <div className="mt-4">
        <span className="px-4 py-2 bg-[#B06EFF] text-white font-bold text-sm rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
          {t.ballOf75(currentBall.order)}
        </span>
      </div>
    </div>
  );
}
