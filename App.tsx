import React, { useState } from 'react';
import { CollectionType, CollectionItem } from './types';
import { INITIAL_COLLECTIONS, COLLECTION_CONFIG } from './constants';
import Sidebar from './components/Sidebar';
import CollectionGrid from './components/CollectionGrid';
import ItemModal from './components/ItemModal';
import ItemDetailModal from './components/ItemDetailModal';
import { MenuIcon } from './components/icons/MenuIcon';

interface CollectionData {
    collections: Record<CollectionType, CollectionItem[]>;
    revision: number;
    lastSaved: string | null;
}

const isValidCollectionFile = (data: any): data is CollectionData => {
    if (!data || typeof data !== 'object') return false;
    
    const { collections, revision, lastSaved } = data;

    if (typeof revision !== 'number' || (lastSaved !== null && typeof lastSaved !== 'string') || typeof collections !== 'object' || collections === null) {
        return false;
    }

    const collectionTypes = Object.values(CollectionType);
    return collectionTypes.every(type => Array.isArray(collections[type]));
};


const App: React.FC = () => {
    const [collectionData, setCollectionData] = useState<CollectionData>({
        collections: INITIAL_COLLECTIONS,
        revision: 0,
        lastSaved: null,
    });
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
            setCollectionData(prev => ({
                ...prev,
                collections: {
                    ...prev.collections,
                    [selectedCollection]: prev.collections[selectedCollection].filter(item => item.id !== itemId)
                }
            }));
        }
    };

    const handleSaveItem = (item: CollectionItem) => {
        setCollectionData(prev => {
            const currentCollection = prev.collections[selectedCollection];
            const itemIndex = currentCollection.findIndex(i => i.id === item.id);
            let updatedCollection;
            if (itemIndex > -1) {
                updatedCollection = [...currentCollection];
                updatedCollection[itemIndex] = item;
            } else {
                updatedCollection = [...currentCollection, item];
            }
            return {
                ...prev,
                collections: { ...prev.collections, [selectedCollection]: updatedCollection }
            };
        });
        setIsItemModalOpen(false);
        setEditingItem(null);
    };

    const handleViewItem = (item: CollectionItem) => {
        setViewingItem(item);
        setIsDetailModalOpen(true);
    };

    const handleSaveCollections = () => {
        try {
            setCollectionData(currentData => {
                const newRevision = currentData.lastSaved ? currentData.revision + 1 : 1;
                const newLastSaved = new Date().toISOString();
                
                const newCollectionData = {
                    ...currentData,
                    revision: newRevision,
                    lastSaved: newLastSaved,
                };
    
                const jsonString = JSON.stringify(newCollectionData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `collectify-collection-export-rev${newRevision}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                return newCollectionData;
            });
        } catch (error) {
            console.error("Failed to save collections:", error);
            alert("An error occurred while trying to save your collection.");
        }
    };
    
    const handleLoadCollections = (fileContent: string) => {
        let loadedData: unknown;

        // 1. Try to parse the file content as JSON
        try {
            loadedData = JSON.parse(fileContent);
        } catch (error) {
            console.error("File parsing error:", error);
            alert("Failed to load: The selected file is not valid JSON.");
            return;
        }

        // 2. Validate that the parsed JSON matches the structure of a collection file
        if (!isValidCollectionFile(loadedData)) {
            alert("Failed to load: The file is not a valid Collectify collection file.");
            return;
        }

        // 3. Confirm the overwrite with the user, showing details of both collections
        const fileInfo = `File details: Revision ${loadedData.revision}, saved on ${new Date(loadedData.lastSaved!).toLocaleString()}.`;
        const currentInfo = collectionData.lastSaved
            ? `Current collection: Revision ${collectionData.revision}, last saved on ${new Date(collectionData.lastSaved).toLocaleString()}.`
            : "You have an unsaved collection currently open.";

        if (window.confirm(`You are about to load a collection file.\n\n${fileInfo}\n\n${currentInfo}\n\nThis will overwrite your current collection. Are you sure you want to continue?`)) {
            // 4. Update the application state with the loaded data
            setCollectionData({
                collections: loadedData.collections,
                revision: loadedData.revision,
                lastSaved: loadedData.lastSaved,
            });
            // Reset view to the first collection type for a consistent experience
            setSelectedCollection(Object.values(CollectionType)[0]);
        }
    };

    const currentItems = collectionData.collections[selectedCollection];
    const currentConfig = COLLECTION_CONFIG[selectedCollection];

    return (
        <div className="flex h-screen bg-primary text-light font-sans">
            <Sidebar
                selectedCollection={selectedCollection}
                onSelectCollection={handleSelectCollection}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSave={handleSaveCollections}
                onLoad={handleLoadCollections}
                revision={collectionData.revision}
                lastSaved={collectionData.lastSaved}
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