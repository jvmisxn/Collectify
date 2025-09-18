import React from 'react';
import { CollectionType } from '../types';
import { COLLECTION_CONFIG } from '../constants';

interface SidebarProps {
    selectedCollection: CollectionType;
    onSelectCollection: (type: CollectionType) => void;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCollection, onSelectCollection, isOpen, onClose }) => {
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
            </aside>
        </>
    );
};

export default Sidebar;
