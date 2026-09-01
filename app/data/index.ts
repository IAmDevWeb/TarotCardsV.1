import { MAJOR_ARCANA } from './majorArcana';
import { WANDS_CARDS } from './wands';
import { CUPS_CARDS } from './cups';
import { SWORDS_CARDS } from './swords';
import { PENTACLES_CARDS } from './pentacles';
import type { TarotCard } from './types';

export const TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...WANDS_CARDS,
  ...CUPS_CARDS,
  ...SWORDS_CARDS,
  ...PENTACLES_CARDS
];

export type { TarotCard };