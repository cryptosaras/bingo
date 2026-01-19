import { getColumn } from '../types';
import { formatAnnouncementLT } from '../utils/translations';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
    }
  }

  private initVoice() {
    if (!this.synth) return;

    const loadVoices = () => {
      const voices = this.synth!.getVoices();
      // Prefer Lithuanian voices, fallback to any available
      this.voice = voices.find(v =>
        v.lang.startsWith('lt')
      ) || voices.find(v =>
        v.lang.includes('LT')
      ) || voices[0];
      this.initialized = true;

      // Log available voices for debugging
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      console.log('Selected voice:', this.voice?.name, this.voice?.lang);
    };

    // Voices may load asynchronously
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }

    // Try loading immediately too
    loadVoices();
  }

  // Check if speech synthesis is available
  isAvailable(): boolean {
    return this.synth !== null;
  }

  // Announce a bingo number in Lithuanian
  announce(number: number): void {
    if (!this.synth || !this.initialized) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const column = getColumn(number);
    // Format: "B, penkiolika" (with pause)
    const text = formatAnnouncementLT(column, number);

    const utterance = new SpeechSynthesisUtterance(text);

    if (this.voice) {
      utterance.voice = this.voice;
    }

    // Set Lithuanian language
    utterance.lang = 'lt-LT';
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  // Announce custom text
  speak(text: string): void {
    if (!this.synth || !this.initialized) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (this.voice) {
      utterance.voice = this.voice;
    }

    utterance.lang = 'lt-LT';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  // Stop any ongoing speech
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// Singleton instance
export const speechService = new SpeechService();
