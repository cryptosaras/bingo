import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { BALL_COLORS } from '../../types';
import { translations as t } from '../../utils/translations';

const MACHINE_WIDTH = 350;
const MACHINE_HEIGHT = 280;

export function BallMachine() {
  const { remainingBalls, status, currentBall } = useGameStore();
  const [isRolling, setIsRolling] = useState(false);
  const [lastBallOrder, setLastBallOrder] = useState<number | null>(null);

  // Trigger roll animation when new ball is drawn
  useEffect(() => {
    if (currentBall && currentBall.order !== lastBallOrder) {
      setIsRolling(true);
      setLastBallOrder(currentBall.order);
      const timer = setTimeout(() => setIsRolling(false), 800);
      return () => clearTimeout(timer);
    }
  }, [currentBall, lastBallOrder]);

  // Reset when game resets
  useEffect(() => {
    if (status === 'idle') {
      setLastBallOrder(null);
      setIsRolling(false);
    }
  }, [status]);

  const showVideo = status === 'idle';

  return (
    <div className="memphis-card p-4">
      <h2 className="text-lg font-bold mb-3 text-black flex items-center gap-2">
        <span className="inline-block w-3 h-3 bg-[#FF6B9D] border-2 border-black rounded-full"></span>
        {t.ballMachine}
      </h2>

      <div className="flex justify-center">
        <div
          className="rounded-xl border-4 border-black overflow-hidden relative shadow-[4px_4px_0px_#000]"
          style={{
            width: MACHINE_WIDTH,
            height: MACHINE_HEIGHT,
            background: showVideo ? 'transparent' : 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
          }}
        >
          {showVideo ? (
            // YouTube video when idle
            <iframe
              src="https://www.youtube.com/embed/hfKS3486dPI?autoplay=1&loop=1&playlist=hfKS3486dPI&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1"
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                top: '-60px',
                left: '-60px',
                width: MACHINE_WIDTH + 120,
                height: MACHINE_HEIGHT + 120,
              }}
            />
          ) : (
            // Ball display when game is active
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              {/* Background decoration - scattered small balls */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-8 h-8 rounded-full border-2 border-white/30"
                    style={{
                      left: `${10 + (i % 4) * 25}%`,
                      top: `${15 + Math.floor(i / 4) * 30}%`,
                      background: Object.values(BALL_COLORS)[i % 5],
                    }}
                  />
                ))}
              </div>

              {currentBall ? (
                // The main rolling ball - bounce wrapper always active, roll-in on inner ball
                <div className="animate-bounce-continuous">
                  <div
                    key={`roll-${currentBall.order}`}
                    className={`
                      memphis-ball flex flex-col items-center justify-center rounded-full
                      ${isRolling ? 'animate-roll-in' : ''}
                    `}
                    style={{
                      backgroundColor: BALL_COLORS[currentBall.column],
                      width: 140,
                      height: 140,
                      willChange: 'transform',
                    }}
                  >
                    <span
                      className="text-5xl font-black"
                      style={{ color: currentBall.column === 'N' ? '#000' : '#fff' }}
                    >
                      {currentBall.column}-{currentBall.number}
                    </span>
                  </div>
                </div>
              ) : (
                // Waiting state
                <div className="text-white/50 text-xl font-bold">
                  {t.clickRollToDraw}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className={`
          inline-block px-4 py-2 rounded-lg font-bold text-sm border-3 border-black shadow-[3px_3px_0px_#000]
          ${status === 'idle' ? 'bg-[#FFD93D] text-black' : ''}
          ${status === 'active' ? 'bg-[#5AE35A] text-black' : ''}
          ${status === 'ended' ? 'bg-[#FF6B6B] text-white' : ''}
        `}>
          {status === 'idle' && t.readyToStart}
          {status === 'active' && t.ballsRemaining(remainingBalls.length)}
          {status === 'ended' && t.gameComplete}
        </span>

        {currentBall && status !== 'idle' && (
          <div className="mt-2">
            <span className="px-3 py-1 bg-[#B06EFF] text-white font-bold text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
              {t.ballOf75(currentBall.order)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
