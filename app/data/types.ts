export interface TarotCard {
  id: number;
  name: string;
  thaiName: string;
  image: string; // Path to PNG image file
  emoji?: string; // Fallback emoji if image not available
  description: string;
  meaning: string;
  reversedMeaning: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
}