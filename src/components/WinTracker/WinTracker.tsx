import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { BALL_COLORS } from '../../types';
import { translations as t } from '../../utils/translations';

// Win celebration GIFs
const WIN_GIFS = [
  'Baby Success GIF.gif',
  'update success GIF.gif',
  'happy celebration GIF by Tennis TV.gif',
  'Fist Pump Yes GIF by JSTCompete.gif',
  'Celebrate Winning Streak GIF by Big Time Gaming.gif',
  'Slot Machines Casino GIF by BCSlots.com.gif',
  'Slot Machine Money GIF by Jess.gif',
  'Pay Day Money GIF.gif',
  'Make It Rain Money GIF by yvngswag.gif',
  'Pay Day Money GIF by MOST EXPENSIVEST.gif',
  'Get Your Billion Back Make It Rain GIF by Billion Back Records.gif',
  'Make It Rain Money GIF.gif',
  'Make It Rain Money GIF by SpongeBob SquarePants.gif',
  'Pay Me Kim Kardashian GIF by GQ.gif',
  'Dance Winning GIF.gif',
  'winner GIF.gif',
  'Happy The Office GIF by Imaginal Biotech.gif',
  'Winner Winner Dance GIF.gif',
  'Happy Football GIF by Piñata Farms The Meme App.gif',
  'Happy Spongebob Squarepants GIF by Bombay Softwares.gif',
  'Happy Fun GIF by reactionseditor.gif',
  'Celebrate Mr Bean GIF by Working Title.gif',
  'Excited Season 6 GIF by The Office.gif',
  'Michael Van Gerwen Yes GIF by DAZN.gif',
];

export function WinTracker() {
  const { ticketStatuses, activeTicketIds, status, calledBalls } = useGameStore();
  const [bouncingBalls, setBouncingBalls] = useState<Set<number>>(new Set());
  const [winGif, setWinGif] = useState<string | null>(null);

  // Random bounce effect for last 5 balls
  const triggerRandomBounce = useCallback(() => {
    const ballCount = Math.min(calledBalls.length, 5);
    if (ballCount === 0) return;

    // Randomly decide how many balls bounce (1-3)
    const numToBounce = Math.floor(Math.random() * 3) + 1;
    const newBouncing = new Set<number>();

    for (let i = 0; i < numToBounce && i < ballCount; i++) {
      const randomIndex = Math.floor(Math.random() * ballCount);
      newBouncing.add(randomIndex);
    }

    setBouncingBalls(newBouncing);

    // Remove bounce after animation completes (600ms)
    setTimeout(() => {
      setBouncingBalls(new Set());
    }, 600);
  }, [calledBalls.length]);

  useEffect(() => {
    if (calledBalls.length === 0) return;

    // Initial delay before first bounce
    const initialDelay = setTimeout(() => {
      triggerRandomBounce();
    }, 1000);

    // Random interval between 2-4 seconds
    const interval = setInterval(() => {
      triggerRandomBounce();
    }, 2000 + Math.random() * 2000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [calledBalls.length, triggerRandomBounce]);

  const statuses = Object.values(ticketStatuses);
  const winnerCount = statuses.filter(s => s.hasWon).length;

  // Pick random GIF on first win, reset on game reset
  useEffect(() => {
    if (winnerCount > 0 && !winGif) {
      const randomGif = WIN_GIFS[Math.floor(Math.random() * WIN_GIFS.length)];
      setWinGif(randomGif);
    }
  }, [winnerCount, winGif]);

  // Reset GIF when game resets
  useEffect(() => {
    if (status === 'idle') {
      setWinGif(null);
    }
  }, [status]);

  const last5Balls = [...calledBalls].reverse().slice(0, 5);

  const countByBallsNeeded: Record<number, number> = {};
  statuses.forEach(s => {
    if (!s.hasWon && s.closestToWin <= 5) {
      countByBallsNeeded[s.closestToWin] = (countByBallsNeeded[s.closestToWin] || 0) + 1;
    }
  });

  return (
    <div className="memphis-card p-4 h-full flex flex-col">
      {/* Last 5 Balls Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 text-black flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-[#FFD93D] border-2 border-black rounded-full"></span>
          {t.last5Balls}
        </h2>
        <div className="flex gap-2 justify-center">
          {last5Balls.length === 0 ? (
            <p className="text-gray-500 text-sm font-bold py-4">{t.noBallsDrawn}</p>
          ) : (
            last5Balls.map((ball, index) => (
              <div
                key={ball.order}
                className={`
                  memphis-ball w-14 h-14 rounded-full flex flex-col items-center justify-center
                  transition-all duration-300
                  ${index === 0 ? 'scale-110 ring-4 ring-black' : 'opacity-80'}
                  ${bouncingBalls.has(index) ? 'animate-bounce-once' : ''}
                `}
                style={{ backgroundColor: BALL_COLORS[ball.column] }}
              >
                <span className="text-xs font-black" style={{ color: ball.column === 'N' ? '#000' : '#fff', opacity: 0.8 }}>{ball.column}</span>
                <span className="text-lg font-black" style={{ color: ball.column === 'N' ? '#000' : '#fff' }}>{ball.number}</span>
              </div>
            ))
          )}
        </div>
        {calledBalls.length > 0 && (
          <p className="text-center text-xs font-bold text-gray-600 mt-3">
            {t.ballOf75(calledBalls.length)}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t-4 border-black border-dashed mb-4"></div>

      {/* Win Tracker Section */}
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-3 text-black flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-[#5AE35A] border-2 border-black rounded-full"></span>
          {t.winTracker}
        </h2>

        {activeTicketIds.length === 0 ? (
          <p className="text-gray-500 text-sm font-bold bg-gray-100 p-4 rounded-lg border-2 border-black">
            {t.enterTicketsToTrack}
          </p>
        ) : (
          <div className="space-y-4">
            {/* Tracking Summary */}
            <div className="text-sm font-bold bg-white rounded-lg p-3 border-3 border-black shadow-[3px_3px_0px_#000]">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">{t.ticketsInPlay}:</span>
                <span className="text-black">{activeTicketIds.length}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">{t.ballsCalled}:</span>
                <span className="text-black">{calledBalls.length}</span>
              </div>
            </div>

            {/* Winners Alert */}
            {winnerCount > 0 && (
              <div className="winner-alert p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-black">
                  {t.bingo}
                </div>
                <div className="text-black font-bold mt-1">
                  {t.winningTickets(winnerCount)}
                </div>
                {winGif && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={`/win_gif/${encodeURIComponent(winGif)}`}
                      alt="Winner celebration"
                      className="rounded-lg border-3 border-black shadow-[3px_3px_0px_#000]"
                      style={{
                        width: '350px',
                        height: 'auto',
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Near Win Stats */}
            {status === 'active' && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-700">{t.closeToWin}</h3>

                {/* 1 ball away - highlighted */}
                {countByBallsNeeded[1] > 0 && (
                  <div className="near-win p-3 rounded-lg flex justify-between items-center">
                    <span className="text-black font-bold">
                      {t.need1Ball}
                    </span>
                    <span className="text-2xl font-black text-black">
                      {countByBallsNeeded[1]}
                    </span>
                  </div>
                )}

                {/* 2 balls away */}
                {countByBallsNeeded[2] > 0 && (
                  <div className="p-3 bg-[#FFD93D] border-3 border-black rounded-lg flex justify-between items-center shadow-[3px_3px_0px_#000]">
                    <span className="text-black font-bold">
                      {t.need2Balls}
                    </span>
                    <span className="text-xl font-black text-black">
                      {countByBallsNeeded[2]}
                    </span>
                  </div>
                )}

                {/* 3 balls away */}
                {countByBallsNeeded[3] > 0 && (
                  <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center shadow-[2px_2px_0px_#000]">
                    <span className="text-gray-600 font-bold">
                      {t.need3Balls}
                    </span>
                    <span className="text-lg font-bold text-gray-700">
                      {countByBallsNeeded[3]}
                    </span>
                  </div>
                )}

                {/* 4-5 balls away */}
                {(countByBallsNeeded[4] || 0) + (countByBallsNeeded[5] || 0) > 0 && (
                  <div className="p-2 bg-gray-100 border-2 border-gray-300 rounded-lg flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-bold">
                      {t.need4to5Balls}
                    </span>
                    <span className="text-gray-600 font-bold">
                      {(countByBallsNeeded[4] || 0) + (countByBallsNeeded[5] || 0)}
                    </span>
                  </div>
                )}

                {/* No tickets close */}
                {Object.keys(countByBallsNeeded).length === 0 && winnerCount === 0 && (
                  <p className="text-gray-500 text-sm font-bold text-center py-4 bg-gray-100 rounded-lg border-2 border-gray-300">
                    {t.noTicketsCloseYet}
                  </p>
                )}
              </div>
            )}

            {status === 'idle' && (
              <p className="text-gray-500 text-sm font-bold text-center py-4 bg-gray-100 rounded-lg border-2 border-black">
                {t.startGameToTrack}
              </p>
            )}

            {status === 'ended' && (
              <div className="text-center py-4 bg-[#B06EFF] rounded-lg border-3 border-black shadow-[3px_3px_0px_#000]">
                <p className="text-white font-bold">{t.gameEnded}</p>
                <p className="text-sm text-white/80 font-bold mt-1">
                  {t.winnersFound(winnerCount)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
