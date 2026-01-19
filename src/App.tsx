import { useEffect, useState, useRef } from 'react';
import { useGameStore } from './stores/gameStore';
import { BallMachine } from './components/BallMachine/BallMachine';
import { BallHistory } from './components/BallHistory/BallHistory';
import { GameControls } from './components/GameControls/GameControls';
import { WinTracker } from './components/WinTracker/WinTracker';
import { PDFGenerator } from './components/PDFGenerator/PDFGenerator';
import { translations as t } from './utils/translations';
import { soundService } from './services/soundService';

function App() {
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [appEntered, setAppEntered] = useState(false);
  const prevWinnerCountRef = useRef(0);
  const { loadTickets, ticketsLoaded, status, voiceEnabled, ticketStatuses } = useGameStore();

  // Handle Enter button click
  const handleEnter = () => {
    setAppEntered(true);
    setAudioUnlocked(true);
    soundService.setEnabled(voiceEnabled);
    if (voiceEnabled) {
      soundService.startBackground('wait');
    }
  };

  // Manage background music based on game state
  useEffect(() => {
    soundService.setEnabled(voiceEnabled);
  }, [voiceEnabled]);

  useEffect(() => {
    if (!voiceEnabled || !audioUnlocked) return;

    if (status === 'idle') {
      soundService.startBackground('wait');
    } else if (status === 'active') {
      soundService.startBackground('bingo');
    } else {
      soundService.stopBackground();
    }

    return () => {
      soundService.stopBackground();
    };
  }, [status, voiceEnabled, audioUnlocked]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Play win sound when new winner is detected
  useEffect(() => {
    const currentWinnerCount = Object.values(ticketStatuses).filter(s => s.hasWon).length;

    if (currentWinnerCount > prevWinnerCountRef.current && audioUnlocked) {
      soundService.playWin();
    }

    prevWinnerCountRef.current = currentWinnerCount;
  }, [ticketStatuses, audioUnlocked]);

  // Loading screen
  if (!ticketsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="memphis-card p-8 text-center">
          <div className="text-2xl font-bold text-black animate-wiggle">{t.loadingTickets}</div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="shape-circle animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="shape-triangle animate-float" style={{ animationDelay: '0.3s' }}></div>
            <div className="shape-square animate-float" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Enter screen - shown after loading, before entering the app
  if (!appEntered) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] shape-circle-lg animate-float-idle" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-[20%] right-[15%] shape-triangle-lg animate-drift-idle" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-[25%] left-[20%] shape-square animate-float-idle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[60%] right-[10%] shape-diamond animate-drift-idle" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-[15%] right-[25%] shape-circle animate-float-idle" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-[40%] left-[5%] shape-triangle animate-drift-idle" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute bottom-[40%] right-[5%] shape-donut animate-orbit-idle" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[5%] left-[40%] shape-cross animate-float-idle" style={{ animationDelay: '1.2s' }}></div>
        </div>

        <div className="memphis-card p-10 text-center relative z-10 max-w-lg">
          {/* Title */}
          <h1 className="text-3xl font-black tracking-wide flex items-center justify-center gap-1 flex-wrap mb-3">
            <span className="inline-block px-2 py-1 bg-[#FF6B9D] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">K</span>
            <span className="inline-block px-2 py-1 bg-[#6BFFF9] text-black border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">A</span>
            <span className="inline-block px-2 py-1 bg-[#FF9F45] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">I</span>
            <span className="inline-block px-2 py-1 bg-[#5AE35A] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">M</span>
            <span className="inline-block px-2 py-1 bg-[#3D8BFF] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">Y</span>
            <span className="inline-block px-2 py-1 bg-[#FFD93D] text-black border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">N</span>
            <span className="inline-block px-2 py-1 bg-[#B06EFF] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">Ų</span>
          </h1>
          <h1 className="text-4xl font-black tracking-wide flex items-center justify-center gap-1 flex-wrap mb-8">
            <span className="inline-block px-3 py-2 bg-[#3D8BFF] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">B</span>
            <span className="inline-block px-3 py-2 bg-[#FF6B6B] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">I</span>
            <span className="inline-block px-3 py-2 bg-[#FFD93D] text-black border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">N</span>
            <span className="inline-block px-3 py-2 bg-[#5AE35A] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">G</span>
            <span className="inline-block px-3 py-2 bg-[#B06EFF] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">O</span>
          </h1>

          {/* Enter Button */}
          <button
            onClick={handleEnter}
            className="
              group relative px-12 py-5 text-2xl font-black uppercase tracking-wider
              bg-gradient-to-r from-[#FF6B9D] via-[#B06EFF] to-[#3D8BFF]
              text-white border-4 border-black rounded-2xl
              shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000]
              hover:translate-x-[-2px] hover:translate-y-[-2px]
              active:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px]
              transition-all duration-150
              animate-pulse-glow
            "
          >
            <span className="relative z-10">Pradėti</span>
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          {/* Decorative balls below button */}
          <div className="flex justify-center gap-3 mt-8">
            <div className="w-8 h-8 rounded-full bg-[#3D8BFF] border-2 border-black shadow-[2px_2px_0px_#000] animate-bounce-continuous" style={{ animationDelay: '0s' }}></div>
            <div className="w-8 h-8 rounded-full bg-[#FF6B6B] border-2 border-black shadow-[2px_2px_0px_#000] animate-bounce-continuous" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-8 h-8 rounded-full bg-[#FFD93D] border-2 border-black shadow-[2px_2px_0px_#000] animate-bounce-continuous" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-8 h-8 rounded-full bg-[#5AE35A] border-2 border-black shadow-[2px_2px_0px_#000] animate-bounce-continuous" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-8 h-8 rounded-full bg-[#B06EFF] border-2 border-black shadow-[2px_2px_0px_#000] animate-bounce-continuous" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="memphis-header px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-wide flex items-center gap-1 flex-wrap">
            <span className="inline-block px-2 py-1 bg-[#FF6B9D] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">K</span>
            <span className="inline-block px-2 py-1 bg-[#6BFFF9] text-black border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">A</span>
            <span className="inline-block px-2 py-1 bg-[#FF9F45] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">I</span>
            <span className="inline-block px-2 py-1 bg-[#5AE35A] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">M</span>
            <span className="inline-block px-2 py-1 bg-[#3D8BFF] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">Y</span>
            <span className="inline-block px-2 py-1 bg-[#FFD93D] text-black border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">N</span>
            <span className="inline-block px-2 py-1 bg-[#B06EFF] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">Ų</span>
            <span className="mx-2"></span>
            <span className="inline-block px-2 py-1 bg-[#3D8BFF] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">B</span>
            <span className="inline-block px-2 py-1 bg-[#FF6B6B] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">I</span>
            <span className="inline-block px-2 py-1 bg-[#FFD93D] text-black border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">N</span>
            <span className="inline-block px-2 py-1 bg-[#5AE35A] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">G</span>
            <span className="inline-block px-2 py-1 bg-[#B06EFF] text-white border-3 border-black rounded-lg shadow-[3px_3px_0px_#000]">O</span>
          </h1>
          <button
            onClick={() => setShowPDFModal(true)}
            className="memphis-btn px-5 py-3 bg-[#6BFFF9] text-black hover:bg-[#5DE0E0]"
          >
            {t.exportPDF}
          </button>
        </div>
      </header>

      {/* Decorative shapes - floating with status-based animation */}
      {/* Left side shapes */}
      <div className={`hidden lg:block fixed top-24 left-6 z-0 ${status === 'active' ? 'animate-float-active' : 'animate-float-idle'}`} style={{ animationDelay: '0s' }}>
        <div className="shape-triangle"></div>
      </div>
      <div className={`hidden lg:block fixed top-48 left-20 z-0 ${status === 'active' ? 'animate-drift-active' : 'animate-drift-idle'}`} style={{ animationDelay: '0.5s' }}>
        <div className="shape-circle-sm"></div>
      </div>
      <div className={`hidden lg:block fixed top-80 left-8 z-0 ${status === 'active' ? 'animate-float-active' : 'animate-float-idle'}`} style={{ animationDelay: '1.2s' }}>
        <div className="shape-diamond"></div>
      </div>
      <div className={`hidden lg:block fixed bottom-48 left-12 z-0 ${status === 'active' ? 'animate-drift-active' : 'animate-drift-idle'}`} style={{ animationDelay: '0.8s' }}>
        <div className="shape-square"></div>
      </div>
      <div className={`hidden lg:block fixed bottom-24 left-24 z-0 ${status === 'active' ? 'animate-orbit-active' : 'animate-orbit-idle'}`} style={{ animationDelay: '2s' }}>
        <div className="shape-triangle-sm"></div>
      </div>

      {/* Right side shapes */}
      <div className={`hidden lg:block fixed top-32 right-10 z-0 ${status === 'active' ? 'animate-float-active' : 'animate-float-idle'}`} style={{ animationDelay: '0.3s' }}>
        <div className="shape-circle"></div>
      </div>
      <div className={`hidden lg:block fixed top-56 right-24 z-0 ${status === 'active' ? 'animate-drift-active' : 'animate-drift-idle'}`} style={{ animationDelay: '1s' }}>
        <div className="shape-square-sm"></div>
      </div>
      <div className={`hidden lg:block fixed top-96 right-8 z-0 ${status === 'active' ? 'animate-float-active' : 'animate-float-idle'}`} style={{ animationDelay: '1.5s' }}>
        <div className="shape-donut"></div>
      </div>
      <div className={`hidden lg:block fixed bottom-56 right-16 z-0 ${status === 'active' ? 'animate-orbit-active' : 'animate-orbit-idle'}`} style={{ animationDelay: '0.7s' }}>
        <div className="shape-cross"></div>
      </div>
      <div className={`hidden lg:block fixed bottom-28 right-6 z-0 ${status === 'active' ? 'animate-drift-active' : 'animate-drift-idle'}`} style={{ animationDelay: '1.8s' }}>
        <div className="shape-circle-lg"></div>
      </div>

      {/* Extra scattered shapes for more visual interest */}
      <div className={`hidden xl:block fixed top-40 left-32 z-0 ${status === 'active' ? 'animate-float-active' : 'animate-float-idle'}`} style={{ animationDelay: '2.2s' }}>
        <div className="shape-triangle-lg"></div>
      </div>
      <div className={`hidden xl:block fixed bottom-72 right-32 z-0 ${status === 'active' ? 'animate-drift-active' : 'animate-drift-idle'}`} style={{ animationDelay: '1.3s' }}>
        <div className="shape-diamond"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ball Machine & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <BallMachine />
            <GameControls />
          </div>

          {/* Middle Column - Ball History */}
          <div className="lg:col-span-1">
            <BallHistory />
          </div>

          {/* Right Column - Win Tracker */}
          <div className="lg:col-span-1">
            <WinTracker />
          </div>
        </div>
      </main>

      {/* PDF Modal */}
      {showPDFModal && (
        <PDFGenerator onClose={() => setShowPDFModal(false)} />
      )}
    </div>
  );
}

export default App;
