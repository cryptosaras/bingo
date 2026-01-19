import { jsPDF } from 'jspdf';
import type { StoredTicket } from '../types';
import { BALL_COLORS } from '../types';

// A4 dimensions in mm
const A4_WIDTH = 210;
const A4_HEIGHT = 297;
const MARGIN = 10;
const TICKET_GAP = 10;

// Calculate ticket size for 2x2 layout
const TICKET_WIDTH = (A4_WIDTH - 2 * MARGIN - TICKET_GAP) / 2;
const TICKET_HEIGHT = (A4_HEIGHT - 2 * MARGIN - TICKET_GAP) / 2;

// Draw a single ticket on the PDF
function drawTicket(
  doc: jsPDF,
  ticket: StoredTicket,
  x: number,
  y: number
) {
  const CELL_SIZE = (TICKET_WIDTH - 10) / 5;
  const HEADER_HEIGHT = 20;
  const GRID_START_Y = y + HEADER_HEIGHT + 5;
  const GRID_START_X = x + 5;

  // Draw ticket border
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(1);
  doc.roundedRect(x, y, TICKET_WIDTH, TICKET_HEIGHT, 3, 3, 'S');

  // Draw "BINGO" header with colored letters
  const letters = ['B', 'I', 'N', 'G', 'O'];
  const colors = [BALL_COLORS.B, BALL_COLORS.I, BALL_COLORS.N, BALL_COLORS.G, BALL_COLORS.O];

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');

  letters.forEach((letter, i) => {
    const color = colors[i];
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    doc.setTextColor(r, g, b);

    const cellCenterX = GRID_START_X + i * CELL_SIZE + CELL_SIZE / 2;
    doc.text(letter, cellCenterX, y + 15, { align: 'center' });
  });

  // Reset text color to black
  doc.setTextColor(0, 0, 0);

  // Draw grid
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cellX = GRID_START_X + col * CELL_SIZE;
      const cellY = GRID_START_Y + row * CELL_SIZE;

      // Draw cell border
      doc.rect(cellX, cellY, CELL_SIZE, CELL_SIZE);

      // Get value from ticket (stored as column-major)
      const value = ticket.g[col][row];

      if (value === 0) {
        // FREE space - draw star or "FREE"
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('FREE', cellX + CELL_SIZE / 2, cellY + CELL_SIZE / 2 + 2, { align: 'center' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
      } else {
        // Number
        doc.text(
          value.toString(),
          cellX + CELL_SIZE / 2,
          cellY + CELL_SIZE / 2 + 4,
          { align: 'center' }
        );
      }
    }
  }

  // Draw ticket number at bottom
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Ticket #${ticket.id}`, x + 5, y + TICKET_HEIGHT - 5);
  doc.setTextColor(0, 0, 0);
}

// Generate PDF with tickets (4 per page)
export function generateTicketPDF(tickets: StoredTicket[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  tickets.forEach((ticket, index) => {
    const positionOnPage = index % 4;

    // Add new page if needed (but not for first page)
    if (positionOnPage === 0 && index > 0) {
      doc.addPage();
    }

    // Calculate position (2x2 grid)
    const row = Math.floor(positionOnPage / 2);
    const col = positionOnPage % 2;

    const x = MARGIN + col * (TICKET_WIDTH + TICKET_GAP);
    const y = MARGIN + row * (TICKET_HEIGHT + TICKET_GAP);

    drawTicket(doc, ticket, x, y);
  });

  // Save the PDF
  const timestamp = new Date().toISOString().slice(0, 10);
  doc.save(`bingo-tickets-${timestamp}.pdf`);
}

// Get the number of pages that will be generated
export function calculatePageCount(ticketCount: number): number {
  return Math.ceil(ticketCount / 4);
}
