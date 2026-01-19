import { useEffect, useState } from 'react';
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
  const { loadTickets, ticketsLoaded, status, voiceEnabled } = useGameStore();

  // Unlock audio on first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      if (!audioUnlocked) {
        setAudioUnlocked(true);
        soundService.setEnabled(voiceEnabled);
        if (voiceEnabled && status === 'idle') {
          soundService.startBackground('wait');
        }
      }
    };

    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, [audioUnlocked, voiceEnabled, status]);

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
