// Bingo column types
export type BingoColumn = 'B' | 'I' | 'N' | 'G' | 'O';

// Column ranges for 75-ball bingo
export const COLUMN_RANGES: Record<BingoColumn, { min: number; max: number }> = {
  B: { min: 1, max: 15 },
  I: { min: 16, max: 30 },
  N: { min: 31, max: 45 },
  G: { min: 46, max: 60 },
  O: { min: 61, max: 75 }
};

// Ball colors by column - Memphis 80s/90s palette
export const BALL_COLORS: Record<BingoColumn, string> = {
  B: '#3D8BFF', // Electric Blue
  I: '#FF6B6B', // Coral Red
  N: '#FFD93D', // Sunny Yellow
  G: '#5AE35A', // Neon Green
  O: '#B06EFF'  // Vivid Purple
};

// Stored ticket format (from JSON)
export interface StoredTicket {
  id: number;
  g: number[][]; // 5 columns x 5 rows, center (N[2]) = 0 for FREE
}

// Expanded ticket for game use
export interface BingoTicket {
  id: number;
  grid: (number | null)[][]; // 5x5, null = FREE space
  numbers: Set<number>; // All numbers on ticket for quick lookup
}

// Called ball
export interface CalledBall {
  number: number;
  column: BingoColumn;
  order: number;
  calledAt: number;
}

// Win line types
export type LineType = 'horizontal' | 'vertical' | 'diagonal';

// Status of a potential win line
export interface LineStatus {
  type: LineType;
  index: number;
  numbersNeeded: number;
  missingNumbers: number[];
}

// Status of a ticket in the game
export interface TicketStatus {
  ticketId: number;
  markedCount: number;
  lines: LineStatus[];
  closestToWin: number;
  hasWon: boolean;
}

// Game status
export type GameStatus = 'idle' | 'active' | 'paused' | 'ended';

// Full game state
export interface GameState {
  status: GameStatus;
  startedAt: number | null;
  remainingBalls: number[];
  calledBalls: CalledBall[];
  currentBall: CalledBall | null;
  activeTicketIds: number[];
  ticketStatuses: Map<number, TicketStatus>;
  voiceEnabled: boolean;
}

// Helper function to get column from number
export function getColumn(num: number): BingoColumn {
  if (num >= 1 && num <= 15) return 'B';
  if (num >= 16 && num <= 30) return 'I';
  if (num >= 31 && num <= 45) return 'N';
  if (num >= 46 && num <= 60) return 'G';
  return 'O';
}

// Helper to convert stored ticket to game ticket
export function expandTicket(stored: StoredTicket): BingoTicket {
  const numbers = new Set<number>();
  const grid: (number | null)[][] = [];

  // Convert column-major to row-major and extract numbers
  for (let row = 0; row < 5; row++) {
    grid[row] = [];
    for (let col = 0; col < 5; col++) {
      const value = stored.g[col][row];
      if (value === 0) {
        grid[row][col] = null; // FREE space
      } else {
        grid[row][col] = value;
        numbers.add(value);
      }
    }
  }

  return {
    id: stored.id,
    grid,
    numbers
  };
}
