import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalledBall, GameStatus, TicketStatus, BingoTicket, StoredTicket } from '../types';
import { getColumn, expandTicket } from '../types';
import { calculateTicketStatus } from '../services/winCalculator';

// Load tickets lazily
let ticketsCache: StoredTicket[] | null = null;

async function loadTickets(): Promise<StoredTicket[]> {
  if (ticketsCache) return ticketsCache;
  const module = await import('../data/tickets.json');
  ticketsCache = module.default as StoredTicket[];
  return ticketsCache;
}

interface GameStore {
  // State
  status: GameStatus;
  startedAt: number | null;
  remainingBalls: number[];
  calledBalls: CalledBall[];
  currentBall: CalledBall | null;
  activeTicketIds: number[];
  ticketStatuses: Record<number, TicketStatus>;
  voiceEnabled: boolean;
  tickets: StoredTicket[];
  ticketsLoaded: boolean;

  // Actions
  loadTickets: () => Promise<void>;
  startNewGame: () => void;
  rollBall: () => CalledBall | null;
  setActiveTickets: (ids: number[]) => void;
  toggleVoice: () => void;
  resetGame: () => void;
  getTicketById: (id: number) => BingoTicket | null;
  getRandomTickets: (count: number) => StoredTicket[];
}

// Initialize all 75 balls
function initializeBalls(): number[] {
  return Array.from({ length: 75 }, (_, i) => i + 1);
}

// Shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      status: 'idle',
      startedAt: null,
      remainingBalls: initializeBalls(),
      calledBalls: [],
      currentBall: null,
      activeTicketIds: [],
      ticketStatuses: {},
      voiceEnabled: true,
      tickets: [],
      ticketsLoaded: false,

      // Load tickets from JSON
      loadTickets: async () => {
        if (get().ticketsLoaded) return;
        const tickets = await loadTickets();
        set({ tickets, ticketsLoaded: true });
      },

      // Start a new game
      startNewGame: () => {
        const shuffledBalls = shuffleArray(initializeBalls());
        set({
          status: 'active',
          startedAt: Date.now(),
          remainingBalls: shuffledBalls,
          calledBalls: [],
          currentBall: null,
          ticketStatuses: {}
        });
      },

      // Roll the next ball
      rollBall: () => {
        const { status, remainingBalls, calledBalls, activeTicketIds, tickets } = get();

        if (status !== 'active' || remainingBalls.length === 0) {
          return null;
        }

        // Get next ball from shuffled remaining
        const number = remainingBalls[0];
        const newRemaining = remainingBalls.slice(1);

        const ball: CalledBall = {
          number,
          column: getColumn(number),
          order: calledBalls.length + 1,
          calledAt: Date.now()
        };

        const newCalledBalls = [...calledBalls, ball];
        const calledSet = new Set(newCalledBalls.map(b => b.number));

        // Update ticket statuses
        const newStatuses: Record<number, TicketStatus> = {};
        for (const ticketId of activeTicketIds) {
          const storedTicket = tickets.find(t => t.id === ticketId);
          if (storedTicket) {
            const ticket = expandTicket(storedTicket);
            newStatuses[ticketId] = calculateTicketStatus(ticket, calledSet);
          }
        }

        set({
          remainingBalls: newRemaining,
          calledBalls: newCalledBalls,
          currentBall: ball,
          ticketStatuses: newStatuses,
          status: newRemaining.length === 0 ? 'ended' : 'active'
        });

        return ball;
      },

      // Set active tickets for tracking
      setActiveTickets: (ids: number[]) => {
        const { calledBalls, tickets } = get();
        const calledSet = new Set(calledBalls.map(b => b.number));

        // Calculate initial statuses
        const newStatuses: Record<number, TicketStatus> = {};
        for (const ticketId of ids) {
          const storedTicket = tickets.find(t => t.id === ticketId);
          if (storedTicket) {
            const ticket = expandTicket(storedTicket);
            newStatuses[ticketId] = calculateTicketStatus(ticket, calledSet);
          }
        }

        set({
          activeTicketIds: ids,
          ticketStatuses: newStatuses
        });
      },

      // Toggle voice
      toggleVoice: () => {
        set(state => ({ voiceEnabled: !state.voiceEnabled }));
      },

      // Reset to idle
      resetGame: () => {
        set({
          status: 'idle',
          startedAt: null,
          remainingBalls: initializeBalls(),
          calledBalls: [],
          currentBall: null,
          activeTicketIds: [],
          ticketStatuses: {}
        });
      },

      // Get expanded ticket by ID
      getTicketById: (id: number) => {
        const { tickets } = get();
        const stored = tickets.find(t => t.id === id);
        return stored ? expandTicket(stored) : null;
      },

      // Get random tickets for PDF
      getRandomTickets: (count: number) => {
        const { tickets } = get();
        const shuffled = shuffleArray([...tickets]);
        return shuffled.slice(0, Math.min(count, tickets.length));
      }
    }),
    {
      name: 'bingo-game-storage',
      partialize: (state) => ({
        voiceEnabled: state.voiceEnabled
        // Don't persist game state - start fresh each time
      })
    }
  )
);
