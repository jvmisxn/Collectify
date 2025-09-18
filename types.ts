
export enum CollectionType {
    Books = 'books',
    TradingCards = 'tradingCards',
    BluRays = 'bluRays',
    ComicBooks = 'comicBooks',
    Records = 'records',
}

export interface BaseDetails {
    year?: number;
    genre?: string;
    notes?: string;
}

export interface BookDetails extends BaseDetails {
    author?: string;
    pages?: number;
    publisher?: string;
    summary?: string;
}

export interface TradingCardDetails extends BaseDetails {
    set?: string;
    cardNumber?: string;
    rarity?: string;
    condition?: string;
}

export interface BluRayDetails extends BaseDetails {
    director?: string;
    studio?: string;
    runtime?: number;
    summary?: string;
}

export interface ComicBookDetails extends BaseDetails {
    writer?: string;
    artist?: string;
    publisher?: string;
    issueNumber?: string;
    summary?: string;
}

export interface RecordDetails extends BaseDetails {
    artist?: string;
    label?: string;
    trackCount?: number;
}

export type ItemDetails = BookDetails | TradingCardDetails | BluRayDetails | ComicBookDetails | RecordDetails;

export interface CollectionItem {
    id: string;
    title: string;
    imageUrl?: string;
    details: ItemDetails;
}
