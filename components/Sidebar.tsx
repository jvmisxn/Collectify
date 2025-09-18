import React from 'react';
import { CollectionType } from '../types';
import { COLLECTION_CONFIG } from '../constants';
import { SaveIcon } from './icons/SaveIcon';
import { UploadIcon } from './icons/UploadIcon';

interface SidebarProps {
    selectedCollection: CollectionType;
    onSelectCollection: (type: CollectionType) => void;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    onLoad: (fileContent: string) => void;
    revision: number;
    lastSaved: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCollection, onSelectCollection, isOpen, onClose, onSave, onLoad, revision, lastSaved }) => {

    const navItems = Object.values(CollectionType).map(type => {
        const config = COLLECTION_CONFIG[type];
        const Icon = config.icon;
        const isSelected = selectedCollection === type;
        return (
            <li key={type}>
                <button
                    onClick={() => onSelectCollection(type)}
                    className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 ${
                        isSelected
                            ? 'bg-accent text-white shadow-md'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                    <Icon />
                    <span className="ml-4 font-semibold">{config.plural}</span>
                </button>
            </li>
        );
    });

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target?.result;
            if (typeof content === 'string') {
                onLoad(content);
            } else {
                alert('Could not read file content.');
            }
            // Reset input value to allow re-uploading the same file
            event.target.value = '';
        };

        reader.onerror = () => {
            alert('Error reading file.');
            event.target.value = '';
        };

        reader.readAsText(file);
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            <aside className={`fixed lg:relative inset-y-0 left-0 bg-secondary w-64 p-4 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}>
                <div className="flex items-center mb-8">
                    <svg className="h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <h1 className="text-2xl font-bold ml-3 text-white">Collectify</h1>
                </div>
                <nav className="flex-1">
                    <ul>{navItems}</ul>
                </nav>
                <div className="mt-auto">
                    <div className="pt-4 border-t border-slate-700 space-y-2">
                        <button
                            onClick={onSave}
                            className="flex items-center w-full p-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
                        >
                            <SaveIcon />
                            <span className="ml-4 font-semibold">Save Data</span>
                        </button>
                        
                        {/* Rebuilt Load button using a reliable label-for-input pattern */}
                        <label
                            htmlFor="collection-file-input"
                            className="flex items-center w-full p-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                            <UploadIcon />
                            <span className="ml-4 font-semibold">Load Data</span>
                        </label>
                        <input
                            type="file"
                            id="collection-file-input"
                            onChange={handleFileSelected}
                            accept=".json"
                            className="hidden"
                        />
                    </div>
                    <div className="mt-4 text-center text-xs text-slate-400">
                        {lastSaved ? (
                            <>
                                <p>Revision: {revision}</p>
                                <p>Last Saved: {new Date(lastSaved).toLocaleString()}</p>
                            </>
                        ) : (
                            <p>Unsaved Collection</p>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;