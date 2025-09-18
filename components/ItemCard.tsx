import React from 'react';
import { CollectionItem } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ItemCardProps {
    item: CollectionItem;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onView, onEdit, onDelete }) => {
    
    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    }

    return (
        <div className="bg-secondary rounded-lg shadow-lg overflow-hidden group relative cursor-pointer transform hover:-translate-y-1 transition-transform duration-200" onClick={onView}>
            <img
                src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/600`}
                alt={item.title}
                className="w-full h-auto object-cover aspect-[2/3]"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallbackSrc = `https://picsum.photos/seed/placeholder/400/600`;
                    if (target.src !== fallbackSrc) {
                        target.onerror = null;
                        target.src = fallbackSrc;
                    }
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-white font-bold text-lg truncate">{item.title}</h3>
            </div>

            <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={(e) => handleActionClick(e, onEdit)} 
                    className="p-2 bg-slate-700/80 rounded-full text-white hover:bg-accent transition-colors"
                    aria-label="Edit item"
                >
                    <EditIcon />
                </button>
                <button 
                    onClick={(e) => handleActionClick(e, onDelete)} 
                    className="p-2 bg-slate-700/80 rounded-full text-white hover:bg-red-500 transition-colors"
                    aria-label="Delete item"
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export default ItemCard;
