import fs from 'fs/promises';
import path from 'path';

type TarotCard = {
  id: string;
  name: string;
  slug: string;
  arcana: string | null;
  suit: string | null;
  imagePath: string | null;
  tags: string[];
  upright: { work?: string; love?: string; finance?: string };
  reversed: { work?: string; love?: string; finance?: string };
};

async function loadTarot() {
  const file = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'tarot_cards.schema.json');
  const raw = await fs.readFile(file, 'utf8');
  const data = JSON.parse(raw) as { cards: TarotCard[] };
  return data.cards;
}

async function main(){
  const cards = await loadTarot();
  console.log('Loaded', cards.length, 'cards. Example:', cards[0]);
}

main().catch(err => { console.error(err); process.exit(1); });
