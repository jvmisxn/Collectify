import React from 'react';
import { CollectionItem, CollectionType } from '../types';
import { COLLECTION_CONFIG } from '../constants';

interface ItemDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: CollectionItem;
    collectionType: CollectionType;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ isOpen, onClose, item, collectionType }) => {
    if (!isOpen) return null;

    const config = COLLECTION_CONFIG[collectionType];

    const renderDetail = (key: string, value: any) => {
        if (!value) return null;
        return (
            <div key={key}>
                <h4 className="text-sm font-semibold text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                <p className="text-light">{value.toString()}</p>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-primary rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col sm:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="w-full sm:w-1/3 flex-shrink-0 bg-secondary">
                    <img 
                        src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/600`} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const fallbackSrc = `https://picsum.photos/seed/placeholder/400/600`;
                            if (target.src !== fallbackSrc) {
                                target.onerror = null;
                                target.src = fallbackSrc;
                            }
                        }}
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start p-6 border-b border-secondary">
                        <div>
                            <h2 className="text-3xl font-bold text-light">{item.title}</h2>
                            { (item.details as any).author && <p className="text-slate-400 text-lg">by {(item.details as any).author}</p> }
                            { (item.details as any).artist && <p className="text-slate-400 text-lg">by {(item.details as any).artist}</p> }
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>

                    <div className="overflow-y-auto p-6 space-y-4">
                        {config.fields.map(field => renderDetail(field, (item.details as any)[field]))}
                    </div>

                    <div className="mt-auto p-6 border-t border-secondary flex justify-end">
                         <button onClick={onClose} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-sky-400 transition-colors">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailModal;
