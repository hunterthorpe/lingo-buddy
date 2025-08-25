import type { Language, Mission } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh-CN', name: 'Mandarin Chinese' },
  { code: 'el', name: 'Greek' },
];


export const SUPPORTED_MISSIONS: Mission[] = [
  {
    id: 'restaurant',
    title: 'Ordering at a Restaurant',
    description: 'Practice ordering food and drinks from a waiter.',
  },
  {
    id: 'hotel',
    title: 'Checking into a Hotel',
    description: 'Role-play checking into a hotel and asking for room details.',
  },
  {
    id: 'grocery',
    title: 'Buying Groceries',
    description: 'Ask a store clerk for help finding items on your shopping list.',
  },
  {
    id: 'train_ticket',
    title: 'Buying a Train Ticket',
    description: 'Purchase a train ticket to a specific destination from a ticket agent.',
  },
];