import type { BingoTicket, TicketStatus, LineStatus, LineType } from '../types';

// Calculate how close a line is to winning
function calculateLineStatus(
  cells: (number | null)[],
  calledNumbers: Set<number>,
  type: LineType,
  index: number
): LineStatus {
  const missingNumbers: number[] = [];

  for (const cell of cells) {
    // null = FREE space, always "marked"
    if (cell !== null && !calledNumbers.has(cell)) {
      missingNumbers.push(cell);
    }
  }

  return {
    type,
    index,
    numbersNeeded: missingNumbers.length,
    missingNumbers
  };
}

// Calculate full status of a ticket
export function calculateTicketStatus(
  ticket: BingoTicket,
  calledNumbers: Set<number>
): TicketStatus {
  const lines: LineStatus[] = [];
  let markedCount = 0;

  // Count marked numbers
  for (const num of ticket.numbers) {
    if (calledNumbers.has(num)) {
      markedCount++;
    }
  }
  // Add 1 for FREE space
  markedCount++;

  // Check 5 horizontal lines (rows)
  for (let row = 0; row < 5; row++) {
    const cells = ticket.grid[row];
    lines.push(calculateLineStatus(cells, calledNumbers, 'horizontal', row));
  }

  // Check 5 vertical lines (columns)
  for (let col = 0; col < 5; col++) {
    const cells = ticket.grid.map(row => row[col]);
    lines.push(calculateLineStatus(cells, calledNumbers, 'vertical', col));
  }

  // Check 2 diagonals
  // Top-left to bottom-right
  const diagonal1 = [0, 1, 2, 3, 4].map(i => ticket.grid[i][i]);
  lines.push(calculateLineStatus(diagonal1, calledNumbers, 'diagonal', 0));

  // Top-right to bottom-left
  const diagonal2 = [0, 1, 2, 3, 4].map(i => ticket.grid[i][4 - i]);
  lines.push(calculateLineStatus(diagonal2, calledNumbers, 'diagonal', 1));

  // Find closest to win
  const closestToWin = Math.min(...lines.map(l => l.numbersNeeded));
  const hasWon = closestToWin === 0;

  return {
    ticketId: ticket.id,
    markedCount,
    lines,
    closestToWin,
    hasWon
  };
}

// Get tickets that are close to winning (within threshold)
export function getTicketsNearWin(
  statuses: Record<number, TicketStatus>,
  threshold: number = 1
): TicketStatus[] {
  return Object.values(statuses)
    .filter(status => status.closestToWin <= threshold && !status.hasWon)
    .sort((a, b) => a.closestToWin - b.closestToWin);
}

// Get winning lines for a ticket
export function getWinningLines(status: TicketStatus): LineStatus[] {
  return status.lines.filter(line => line.numbersNeeded === 0);
}

// Get description of a line
export function describeLineType(line: LineStatus): string {
  switch (line.type) {
    case 'horizontal':
      return `Row ${line.index + 1}`;
    case 'vertical':
      return ['B', 'I', 'N', 'G', 'O'][line.index] + ' column';
    case 'diagonal':
      return line.index === 0 ? 'Diagonal (↘)' : 'Diagonal (↙)';
  }
}
