class SoundService {
  private backgroundMusic: HTMLAudioElement | null = null;
  private currentTrack: string | null = null;
  private isEnabled: boolean = true;

  private createAudio(src: string): HTMLAudioElement {
    const audio = new Audio(src);
    return audio;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopBackground();
    }
  }

  playEffect(src: string) {
    if (!this.isEnabled) return;
    const audio = this.createAudio(src);
    audio.play().catch(() => {});
  }

  playBallRoll() {
    this.playEffect('/sounds/lotto-ball.mp3');
  }

  playWin() {
    if (!this.isEnabled) return;
    const audio = this.createAudio('/sounds/win.mp3');
    audio.volume = 1.0; // 100% volume
    audio.play().catch(() => {});
  }

  startBackground(track: 'wait' | 'bingo') {
    if (!this.isEnabled) return;

    const src = track === 'wait' ? '/sounds/wait.mp3' : '/sounds/bingo.mp3';

    // Don't restart if same track is already playing
    if (this.currentTrack === track && this.backgroundMusic) {
      return;
    }

    this.stopBackground();
    this.backgroundMusic = this.createAudio(src);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.15;
    this.backgroundMusic.play().catch(() => {});
    this.currentTrack = track;
  }

  stopBackground() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = null;
      this.currentTrack = null;
    }
  }
}

export const soundService = new SoundService();
