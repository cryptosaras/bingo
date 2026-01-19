import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { speechService } from '../../services/speechService';
import { soundService } from '../../services/soundService';
import { translations as t } from '../../utils/translations';

export function GameControls() {
  const [ticketInput, setTicketInput] = useState('');
  const {
    status,
    startNewGame,
    rollBall,
    setActiveTickets,
    toggleVoice,
    voiceEnabled,
    resetGame,
    activeTicketIds
  } = useGameStore();

  const handleRollBall = () => {
    const ball = rollBall();
    if (ball && voiceEnabled) {
      soundService.playBallRoll();
      speechService.announce(ball.number);
    }
  };

  const handleStartGame = () => {
    startNewGame();
  };

  const handleSetTickets = () => {
    const ids: number[] = [];
    const parts = ticketInput.split(',').map(s => s.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= 10000) ids.push(i);
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= 10000) {
          ids.push(num);
        }
      }
    }

    const uniqueIds = [...new Set(ids)].sort((a, b) => a - b);
    setActiveTickets(uniqueIds);
  };

  const getStatusText = () => {
    switch (status) {
      case 'idle': return t.statusIdle;
      case 'active': return t.statusActive;
      case 'ended': return t.statusEnded;
      default: return status;
    }
  };

  return (
    <div className="memphis-card p-4 space-y-4">
      <h2 className="text-lg font-bold text-black flex items-center gap-2">
        <span className="inline-block w-3 h-3 bg-[#B06EFF] border-2 border-black rounded-full"></span>
        {t.gameControls}
      </h2>

      {/* Game Status */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-black">{t.status}:</span>
        <span className={`
          px-3 py-1.5 rounded-lg text-sm font-bold border-3 border-black shadow-[3px_3px_0px_#000]
          ${status === 'idle' ? 'bg-gray-200 text-gray-700' : ''}
          ${status === 'active' ? 'bg-[#5AE35A] text-black' : ''}
          ${status === 'ended' ? 'bg-[#FF6B6B] text-white' : ''}
        `}>
          {getStatusText()}
        </span>
      </div>

      {/* Main Buttons */}
      <div className="flex gap-3">
        {status === 'idle' ? (
          <button
            onClick={handleStartGame}
            className="memphis-btn flex-1 px-4 py-3 bg-[#5AE35A] text-black hover:bg-[#4CD34C]"
          >
            {t.startNewGame}
          </button>
        ) : (
          <>
            <button
              onClick={handleRollBall}
              disabled={status !== 'active'}
              className="memphis-btn flex-1 px-4 py-3 bg-[#3D8BFF] text-white hover:bg-[#2D7BEF] disabled:bg-gray-300 disabled:text-gray-500"
            >
              {t.rollBall}
            </button>
            <button
              onClick={resetGame}
              className="memphis-btn px-4 py-3 bg-[#FF6B6B] text-white hover:bg-[#EF5B5B]"
            >
              {t.reset}
            </button>
          </>
        )}
      </div>

      {/* Voice Toggle */}
      <button
        onClick={toggleVoice}
        className={`
          memphis-btn w-full px-4 py-2.5 font-bold
          ${voiceEnabled
            ? 'bg-[#6BFFF9] text-black hover:bg-[#5BEEF9]'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }
        `}
      >
        {voiceEnabled ? t.voiceOn : t.voiceOff}
      </button>

      {/* Ticket Input */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-black">
          {t.activeTickets}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            placeholder={t.enterTicketNumbers}
            className="memphis-input flex-1 text-black placeholder-gray-400"
          />
          <button
            onClick={handleSetTickets}
            className="memphis-btn px-4 py-2 bg-[#FF9F45] text-black hover:bg-[#EF8F35]"
          >
            {t.set}
          </button>
        </div>
        {activeTicketIds.length > 0 && (
          <p className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-2 rounded-lg border-2 border-black">
            {t.trackingTickets(activeTicketIds.length)}
          </p>
        )}
      </div>
    </div>
  );
}
