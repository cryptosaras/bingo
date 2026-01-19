// Lithuanian translations

export const translations = {
  // Header
  appTitle: 'BINGO Vedėjas',
  exportPDF: 'Eksportuoti bilietus PDF',

  // Ball Machine
  ballMachine: 'Kamuoliukų mašina',
  readyToStart: 'Paruošta pradėti',
  ballsRemaining: (count: number) => `Liko ${count} kamuoliukų`,
  gameComplete: 'Žaidimas baigtas!',

  // Current Ball
  startGameToBegin: 'Pradėkite žaidimą',
  clickRollToDraw: 'Spauskite "Traukti" kad ištraukti',
  ballOf75: (num: number) => `Kamuoliukas #${num} iš 75`,

  // Game Controls
  gameControls: 'Žaidimo valdymas',
  status: 'Būsena',
  statusIdle: 'Laukiama',
  statusActive: 'Vyksta',
  statusEnded: 'Baigta',
  startNewGame: 'Pradėti naują žaidimą',
  rollBall: 'Traukti',
  reset: 'Iš naujo',
  voiceOn: 'Garsas: ĮJUNGTAS',
  voiceOff: 'Garsas: IŠJUNGTAS',
  activeTickets: 'Aktyvūs bilietai (pvz., "1, 5-10, 23")',
  enterTicketNumbers: 'Įveskite bilietų numerius...',
  set: 'Nustatyti',
  trackingTickets: (count: number) => `Sekama ${count} bilietų`,
  autoDrawOn: 'Automatinis traukimas: ĮJUNGTAS',
  autoDrawOff: 'Automatinis traukimas: IŠJUNGTAS',

  // Ball History
  ballHistory: 'Iškritusių kamuoliukų istorija',
  called: 'Ištraukta',
  remaining: 'Liko',

  // Win Tracker
  last5Balls: 'Paskutiniai 5 kamuoliukai',
  noBallsDrawn: 'Kamuoliukai dar neištraukti',
  winTracker: 'Laimėjimų sekimas',
  enterTicketsToTrack: 'Įveskite bilietų numerius žaidimo valdyme, kad juos sekti.',
  ticketsInPlay: 'Bilietų žaidime',
  ballsCalled: 'Ištraukta kamuoliukų',
  bingo: 'BINGO!',
  winningTickets: (count: number) => `${count} laimėję${count > 1 ? ' bilietai' : 's bilietas'}!`,
  closeToWin: 'Arti laimėjimo',
  need1Ball: 'Trūksta 1 kamuoliuko',
  need2Balls: 'Trūksta 2 kamuoliukų',
  need3Balls: 'Trūksta 3 kamuoliukų',
  need4to5Balls: 'Trūksta 4-5 kamuoliukų',
  noTicketsCloseYet: 'Dar nėra bilietų arti laimėjimo',
  startGameToTrack: 'Pradėkite žaidimą, kad sekti laimėjimus',
  gameEnded: 'Žaidimas baigtas',
  winnersFound: (count: number) => `Rasta ${count} laimėtojų`,

  // PDF Generator
  exportTicketsPDF: 'Eksportuoti bilietus PDF',
  numberOfTickets: 'Bilietų skaičius',
  tickets: 'Bilietai',
  pagesCount: 'Puslapiai (4 per puslapį)',
  downloadPDF: 'Atsisiųsti PDF',

  // Loading
  loadingTickets: 'Kraunami bilietai...',
};

// Lithuanian number words (1-75)
const numberWords: Record<number, string> = {
  1: 'vienas',
  2: 'du',
  3: 'trys',
  4: 'keturi',
  5: 'penki',
  6: 'šeši',
  7: 'septyni',
  8: 'aštuoni',
  9: 'devyni',
  10: 'dešimt',
  11: 'vienuolika',
  12: 'dvylika',
  13: 'trylika',
  14: 'keturiolika',
  15: 'penkiolika',
  16: 'šešiolika',
  17: 'septyniolika',
  18: 'aštuoniolika',
  19: 'devyniolika',
  20: 'dvidešimt',
  21: 'dvidešimt vienas',
  22: 'dvidešimt du',
  23: 'dvidešimt trys',
  24: 'dvidešimt keturi',
  25: 'dvidešimt penki',
  26: 'dvidešimt šeši',
  27: 'dvidešimt septyni',
  28: 'dvidešimt aštuoni',
  29: 'dvidešimt devyni',
  30: 'trisdešimt',
  31: 'trisdešimt vienas',
  32: 'trisdešimt du',
  33: 'trisdešimt trys',
  34: 'trisdešimt keturi',
  35: 'trisdešimt penki',
  36: 'trisdešimt šeši',
  37: 'trisdešimt septyni',
  38: 'trisdešimt aštuoni',
  39: 'trisdešimt devyni',
  40: 'keturiasdešimt',
  41: 'keturiasdešimt vienas',
  42: 'keturiasdešimt du',
  43: 'keturiasdešimt trys',
  44: 'keturiasdešimt keturi',
  45: 'keturiasdešimt penki',
  46: 'keturiasdešimt šeši',
  47: 'keturiasdešimt septyni',
  48: 'keturiasdešimt aštuoni',
  49: 'keturiasdešimt devyni',
  50: 'penkiasdešimt',
  51: 'penkiasdešimt vienas',
  52: 'penkiasdešimt du',
  53: 'penkiasdešimt trys',
  54: 'penkiasdešimt keturi',
  55: 'penkiasdešimt penki',
  56: 'penkiasdešimt šeši',
  57: 'penkiasdešimt septyni',
  58: 'penkiasdešimt aštuoni',
  59: 'penkiasdešimt devyni',
  60: 'šešiasdešimt',
  61: 'šešiasdešimt vienas',
  62: 'šešiasdešimt du',
  63: 'šešiasdešimt trys',
  64: 'šešiasdešimt keturi',
  65: 'šešiasdešimt penki',
  66: 'šešiasdešimt šeši',
  67: 'šešiasdešimt septyni',
  68: 'šešiasdešimt aštuoni',
  69: 'šešiasdešimt devyni',
  70: 'septyniasdešimt',
  71: 'septyniasdešimt vienas',
  72: 'septyniasdešimt du',
  73: 'septyniasdešimt trys',
  74: 'septyniasdešimt keturi',
  75: 'septyniasdešimt penki',
};

// Get Lithuanian word for a number
export function getNumberInLithuanian(num: number): string {
  return numberWords[num] || num.toString();
}

// Format announcement: "B - penkiolika"
export function formatAnnouncementLT(column: string, number: number): string {
  const numWord = getNumberInLithuanian(number);
  return `${column}, ${numWord}`;
}
