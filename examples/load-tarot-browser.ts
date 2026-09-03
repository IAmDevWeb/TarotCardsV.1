// Browser example: fetch the schema JSON from the public folder and use it in the app
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

export async function loadTarotBrowser(url = '/.agents/skills/tarot-skill/tarot_cards.schema.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load tarot schema: ' + res.statusText);
  const data = await res.json() as { cards: TarotCard[] };
  return data.cards;
}

// Example usage in a browser environment or framework component
// (async () => { const cards = await loadTarotBrowser(); console.log(cards[0]); })();
