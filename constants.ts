import React from 'react';
import { CollectionType, CollectionItem } from './types';
import { BookIcon } from './components/icons/BookIcon';
import { CardIcon } from './components/icons/CardIcon';
import { DiscIcon } from './components/icons/DiscIcon';
import { FilmIcon } from './components/icons/FilmIcon';
import { ZapIcon } from './components/icons/ZapIcon';

export const COLLECTION_CONFIG = {
  [CollectionType.Books]: {
    singular: 'Book',
    plural: 'Books',
    // FIX: Storing component reference instead of JSX element to avoid syntax error in .ts file.
    icon: BookIcon,
    fields: ['author', 'publisher', 'pages', 'year', 'genre', 'summary', 'notes']
  },
  [CollectionType.TradingCards]: {
    singular: 'Trading Card',
    plural: 'Trading Cards',
    // FIX: Storing component reference instead of JSX element to avoid syntax error in .ts file.
    icon: CardIcon,
    fields: ['set', 'cardNumber', 'rarity', 'condition', 'year', 'genre', 'notes']
  },
  [CollectionType.BluRays]: {
    singular: 'Blu-ray',
    plural: 'Blu-rays',
    // FIX: Storing component reference instead of JSX element to avoid syntax error in .ts file.
    icon: FilmIcon,
    fields: ['director', 'studio', 'runtime', 'year', 'genre', 'summary', 'notes']
  },
  [CollectionType.ComicBooks]: {
    singular: 'Comic Book',
    plural: 'Comic Books',
    // FIX: Storing component reference instead of JSX element to avoid syntax error in .ts file.
    icon: ZapIcon,
    fields: ['writer', 'artist', 'publisher', 'issueNumber', 'year', 'genre', 'summary', 'notes']
  },
  [CollectionType.Records]: {
    singular: 'Record',
    plural: 'Records',
    // FIX: Storing component reference instead of JSX element to avoid syntax error in .ts file.
    icon: DiscIcon,
    fields: ['artist', 'label', 'trackCount', 'year', 'genre', 'notes']
  }
};

export const INITIAL_COLLECTIONS: Record<CollectionType, CollectionItem[]> = {
    [CollectionType.Books]: [],
    [CollectionType.TradingCards]: [],
    [CollectionType.BluRays]: [],
    [CollectionType.ComicBooks]: [],
    [CollectionType.Records]: [],
};