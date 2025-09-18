import React, { useState } from 'react';
import { CollectionType, CollectionItem } from './types';
import { INITIAL_COLLECTIONS, COLLECTION_CONFIG } from './constants';
import Sidebar from './components/Sidebar';
import CollectionGrid from './components/CollectionGrid';
import ItemModal from './components/ItemModal';
import ItemDetailModal from './components/ItemDetailModal';
import { MenuIcon } from './components/icons/MenuIcon';

const App: React.FC = () => {
    const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
    const [selectedCollection, setSelectedCollection] = useState<CollectionType>(CollectionType.Books);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
    const [viewingItem, setViewingItem] = useState<CollectionItem | null>(null);

    const handleSelectCollection = (type: CollectionType) => {
        setSelectedCollection(type);
        setIsSidebarOpen(false);
    };

    const handleAddItem = () => {
        setEditingItem(null);
        setIsItemModalOpen(true);
    };

    const handleEditItem = (item: CollectionItem) => {
        setEditingItem(item);
        setIsItemModalOpen(true);
    };

    const handleDeleteItem = (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setCollections(prev => ({
                ...prev,
                [selectedCollection]: prev[selectedCollection].filter(item => item.id !== itemId)
            }));
        }
    };

    const handleSaveItem = (item: CollectionItem) => {
        setCollections(prev => {
            const currentCollection = prev[selectedCollection];
            const itemIndex = currentCollection.findIndex(i => i.id === item.id);
            if (itemIndex > -1) {
                const updatedCollection = [...currentCollection];
                updatedCollection[itemIndex] = item;
                return { ...prev, [selectedCollection]: updatedCollection };
            } else {
                return { ...prev, [selectedCollection]: [...currentCollection, item] };
            }
        });
        setIsItemModalOpen(false);
        setEditingItem(null);
    };

    const handleViewItem = (item: CollectionItem) => {
        setViewingItem(item);
        setIsDetailModalOpen(true);
    };

    const currentItems = collections[selectedCollection];
    const currentConfig = COLLECTION_CONFIG[selectedCollection];

    return (
        <div className="flex h-screen bg-primary text-light font-sans">
            <Sidebar
                selectedCollection={selectedCollection}
                onSelectCollection={handleSelectCollection}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-secondary p-4 flex items-center shadow-lg z-10">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 text-light">
                        <MenuIcon />
                    </button>
                    <h1 className="text-2xl font-bold">{currentConfig.plural}</h1>
                </header>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <CollectionGrid
                        items={currentItems}
                        onAddItem={handleAddItem}
                        onViewItem={handleViewItem}
                        onEditItem={handleEditItem}
                        onDeleteItem={handleDeleteItem}
                        collectionType={selectedCollection}
                    />
                </div>
            </main>
            
            {isItemModalOpen && (
                <ItemModal
                    isOpen={isItemModalOpen}
                    onClose={() => setIsItemModalOpen(false)}
                    onSave={handleSaveItem}
                    item={editingItem}
                    collectionType={selectedCollection}
                />
            )}

            {isDetailModalOpen && viewingItem && (
                 <ItemDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    item={viewingItem}
                    collectionType={selectedCollection}
                />
            )}
        </div>
    );
};

export default App;
