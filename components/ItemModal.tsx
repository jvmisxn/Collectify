import React, { useState, useEffect, useCallback } from 'react';
import { CollectionItem, CollectionType, ItemDetails } from '../types';
import { COLLECTION_CONFIG } from '../constants';
import { fetchItemDetails } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CollectionItem) => void;
  item: CollectionItem | null;
  collectionType: CollectionType;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, item, collectionType }) => {
  const [formData, setFormData] = useState<CollectionItem>({
    id: item?.id || Date.now().toString(),
    title: item?.title || '',
    imageUrl: item?.imageUrl || '',
    details: item?.details || {},
  });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const config = COLLECTION_CONFIG[collectionType];
  const detailFields = config.fields;

  useEffect(() => {
    setFormData({
      id: item?.id || Date.now().toString(),
      title: item?.title || '',
      imageUrl: item?.imageUrl || '',
      details: item?.details || {},
    });
  }, [item, collectionType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (detailFields.includes(name)) {
      setFormData(prev => ({
        ...prev,
        details: { ...prev.details, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, imageUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAutofill = useCallback(async () => {
    if (!formData.title) {
        setError("Please enter a title first.");
        return;
    }
    setIsFetching(true);
    setError(null);
    try {
      const autofilledData = await fetchItemDetails(formData.title, collectionType);
      const { imageUrl, ...details } = autofilledData;

      setFormData(prev => ({
          ...prev,
          imageUrl: imageUrl || prev.imageUrl,
          details: { ...prev.details, ...details }
      }));
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsFetching(false);
    }
  }, [formData.title, collectionType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-secondary">
          <h2 className="text-2xl font-bold text-light">{item ? 'Edit' : 'Add'} {config.singular}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300">Title</label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="flex-grow bg-slate-700 text-light border border-slate-600 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                required
              />
              <button
                type="button"
                onClick={handleAutofill}
                disabled={isFetching || !formData.title}
                className="flex items-center bg-accent text-white px-3 py-2 rounded-md hover:bg-sky-400 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
              >
                {isFetching ? <LoadingSpinner/> : <SparklesIcon />}
                <span className="ml-2 hidden sm:inline">{isFetching ? 'Fetching...' : 'Auto-fill'}</span>
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-300 mb-1">Image</label>
                <img
                    src={formData.imageUrl || 'https://picsum.photos/seed/placeholder/200/300'}
                    alt="Preview"
                    className="w-full h-auto object-cover aspect-[2/3] rounded-md bg-slate-700"
                    onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallbackSrc = 'https://picsum.photos/seed/placeholder/200/300';
                    if (target.src !== fallbackSrc) {
                        target.onerror = null;
                        target.src = fallbackSrc;
                    }
                    }}
                />
            </div>
            <div className="md:col-span-2 space-y-4 pt-6">
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300">Image URL</label>
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl || ''}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1 block w-full bg-slate-700 text-light border border-slate-600 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-600" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-primary px-2 text-sm text-slate-400">OR</span>
                    </div>
                </div>
                <div>
                    <label htmlFor="imageUpload" className="block text-sm font-medium text-slate-300">Upload an image</label>
                    <input
                        type="file"
                        id="imageUpload"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-light hover:file:bg-slate-600 cursor-pointer"
                    />
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-secondary">
            {detailFields.map(field => (
                <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-slate-300 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    {field.toLowerCase().includes('summary') || field === 'notes' ? (
                        <textarea
                          id={field}
                          name={field}
                          value={(formData.details as any)[field] || ''}
                          onChange={handleChange}
                          rows={4}
                          className="mt-1 block w-full bg-slate-700 text-light border border-slate-600 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                        />
                    ) : (
                        <input
                          type={['pages', 'year', 'runtime', 'trackCount'].includes(field) ? 'number' : 'text'}
                          id={field}
                          name={field}
                          value={(formData.details as any)[field] || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full bg-slate-700 text-light border border-slate-600 rounded-md shadow-sm focus:ring-accent focus:border-accent"
                        />
                    )}
                </div>
            ))}
          </div>
        </form>

        <div className="p-4 border-t border-secondary flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors">Cancel</button>
          <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-sky-400 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;