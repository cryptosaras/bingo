// Bingo Ticket Generator - Generates 10,000 unique 75-ball bingo tickets
// Run with: node scripts/generateTickets.js

const fs = require('fs');
const path = require('path');

// Column ranges for 75-ball bingo
const COLUMN_RANGES = {
  B: { min: 1, max: 15 },
  I: { min: 16, max: 30 },
  N: { min: 31, max: 45 },
  G: { min: 46, max: 60 },
  O: { min: 61, max: 75 }
};

// Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate numbers for a column
function generateColumn(min, max, count) {
  const available = [];
  for (let i = min; i <= max; i++) {
    available.push(i);
  }
  shuffleArray(available);
  return available.slice(0, count);
}

// Generate a single ticket
function generateTicket(id) {
  const columns = Object.entries(COLUMN_RANGES).map(([col, range], colIndex) => {
    const numbers = generateColumn(range.min, range.max, 5);
    // For N column (index 2), set center cell to 0 (FREE space)
    if (colIndex === 2) {
      numbers[2] = 0;
    }
    return numbers;
  });

  return {
    id,
    g: columns // 5 columns x 5 rows
  };
}

// Generate hash for uniqueness check
function ticketHash(ticket) {
  return ticket.g.flat().join(',');
}

// Generate all 10,000 tickets
function generateAllTickets(count = 10000) {
  const tickets = [];
  const seen = new Set();

  console.log(`Generating ${count} unique bingo tickets...`);

  let id = 1;
  let attempts = 0;
  const maxAttempts = count * 10;

  while (tickets.length < count && attempts < maxAttempts) {
    const ticket = generateTicket(id);
    const hash = ticketHash(ticket);

    if (!seen.has(hash)) {
      seen.add(hash);
      tickets.push(ticket);
      id++;

      if (tickets.length % 1000 === 0) {
        console.log(`  Generated ${tickets.length} tickets...`);
      }
    }
    attempts++;
  }

  if (tickets.length < count) {
    console.warn(`Warning: Only generated ${tickets.length} unique tickets after ${maxAttempts} attempts`);
  }

  return tickets;
}

// Main execution
const tickets = generateAllTickets(10000);

// Save to JSON file
const outputPath = path.join(__dirname, '..', 'src', 'data', 'tickets.json');
fs.writeFileSync(outputPath, JSON.stringify(tickets));

console.log(`\nDone! Generated ${tickets.length} tickets.`);
console.log(`Saved to: ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
