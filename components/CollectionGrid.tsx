import React from 'react';
import { CollectionItem, CollectionType } from '../types';
import ItemCard from './ItemCard';
import { PlusIcon } from './icons/PlusIcon';
import { COLLECTION_CONFIG } from '../constants';

interface CollectionGridProps {
    items: CollectionItem[];
    onAddItem: () => void;
    onViewItem: (item: CollectionItem) => void;
    onEditItem: (item: CollectionItem) => void;
    onDeleteItem: (itemId: string) => void;
    collectionType: CollectionType;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ items, onAddItem, onViewItem, onEditItem, onDeleteItem, collectionType }) => {
    const config = COLLECTION_CONFIG[collectionType];

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {items.map(item => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onView={() => onViewItem(item)}
                        onEdit={() => onEditItem(item)}
                        onDelete={() => onDeleteItem(item.id)}
                    />
                ))}
                <button
                    onClick={onAddItem}
                    className="flex flex-col items-center justify-center bg-secondary rounded-lg border-2 border-dashed border-slate-600 hover:border-accent hover:text-accent transition-all duration-200 text-slate-400 min-h-[20rem]"
                >
                    <PlusIcon />
                    <span className="mt-2 font-semibold">Add New {config.singular}</span>
                </button>
            </div>
            {items.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <h2 className="text-2xl font-semibold">Your collection is empty</h2>
                    <p className="mt-2">Click the button to add your first {config.singular}.</p>
                </div>
            )}
        </div>
    );
};

export default CollectionGrid;
