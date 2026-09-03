const fs = require('fs');
const path = require('path');

const inPath = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'tarot_cards.json');
const outPath = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'tarot_cards.schema.json');

const raw = fs.readFileSync(inPath, 'utf8');
const src = JSON.parse(raw);

const MAJOR = [
  'The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant','The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man','Death','Temperance','The Devil','The Tower','The Star','The Moon','The Sun','Judgement','The World'
];

function slug(name){
  return name.toLowerCase().replace(/[^a-z0-9ก-๙]+/g,'-').replace(/^-+|-+$/g,'');
}

const cards = src.cards.map((c,i) => {
  const name = c.name;
  const isMajor = MAJOR.includes(name);
  let suit = null;
  let arcana = isMajor ? 'Major' : 'Minor';
  if (!isMajor) {
    const m = name.match(/of\s+(Wands|Cups|Swords|Pentacles)/i);
    if (m) suit = m[1];
  }
  const id = (isMajor ? 'maj-' : 'min-') + slug(name);
  const imgFilename = slug(name) + '.png';
  const imagePath = '/Cards-png/' + imgFilename;
  const tags = Array.from(new Set([...(c.keywords||[]), arcana, suit].filter(Boolean)));
  return {
    id,
    name,
    slug: slug(name),
    arcana,
    suit,
    imagePath,
    tags,
    upright: c.upright || {},
    reversed: c.reversed || {},
    source: src.version || 'generated',
    index: i
  };
});

const out = { version: 'schema-1.0', generatedAt: new Date().toISOString(), cards };
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', outPath);
