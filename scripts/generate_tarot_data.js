const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'DETAILED.md');
const outJson = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'tarot_cards.json');
const outCsv = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'tarot_cards.csv');

const md = fs.readFileSync(mdPath, 'utf8');

// Very simple parser based on the structure used in DETAILED.md
const lines = md.split(/\r?\n/);
const cards = [];
let currentCard = null;
let currentOrientation = null; // 'upright' or 'reversed'

function commitCard() {
  if (currentCard) {
    cards.push(currentCard);
    currentCard = null;
  }
}

for (let i = 0; i < lines.length; i++) {
  let line = lines[i].trim();

  // Card heading
  if (line.startsWith('### ')) {
    // commit previous
    commitCard();
    const name = line.replace('### ', '').trim();
    currentCard = {
      name,
      arcana: null,
      suit: null,
      keywords: [],
      upright: { work: '', love: '', finance: '' },
      reversed: { work: '', love: '', finance: '' }
    };
    currentOrientation = null;
    continue;
  }

  if (!currentCard) continue;

  if (line.toLowerCase().startsWith('- upright:') || line.toLowerCase().startsWith('- upright')) {
    currentOrientation = 'upright';
    continue;
  }
  if (line.toLowerCase().startsWith('- reversed:') || line.toLowerCase().startsWith('- reversed')) {
    currentOrientation = 'reversed';
    continue;
  }

  // Lines like '-  - งาน: ...' or '+  - งาน: ...' or '-  - งาน: ...'
  const match = line.match(/[-+]?\s*-?\s*[-–—]?\s*([A-Za-zก-๙ ]+):\s*(.*)/);
  if (match && currentOrientation) {
    const key = match[1].trim();
    const rest = match[2].trim();
    // Map Thai labels to keys
    if (/งาน|work/i.test(key)) {
      currentCard[currentOrientation].work += (currentCard[currentOrientation].work ? ' ' : '') + rest;
    } else if (/ความรัก|love/i.test(key)) {
      currentCard[currentOrientation].love += (currentCard[currentOrientation].love ? ' ' : '') + rest;
    } else if (/การเงิน|finance|การเงิน/i.test(key)) {
      currentCard[currentOrientation].finance += (currentCard[currentOrientation].finance ? ' ' : '') + rest;
    } else if (/keywords|คำสำคัญ|keywords/i.test(key)) {
      currentCard.keywords = rest.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
    }
  }
}

commitCard();

// Write JSON
fs.writeFileSync(outJson, JSON.stringify({ version: 'generated', cards }, null, 2), 'utf8');

// Write CSV header
const header = ['name','arcana','suit','orientation','work','love','finance'].join(',') + '\n';
const rows = [header];
cards.forEach(card => {
  ['upright','reversed'].forEach(orient => {
    const row = [
      '"' + card.name.replace(/"/g, '""') + '"',
      (card.arcana || ''),
      (card.suit || ''),
      orient,
      '"' + (card[orient].work || '').replace(/"/g, '""') + '"',
      '"' + (card[orient].love || '').replace(/"/g, '""') + '"',
      '"' + (card[orient].finance || '').replace(/"/g, '""') + '"'
    ].join(',');
    rows.push(row + '\n');
  });
});
fs.writeFileSync(outCsv, rows.join(''), 'utf8');

console.log('Generated', outJson, 'and', outCsv);
