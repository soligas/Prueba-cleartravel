import React, { createContext, useState, useContext, useMemo } from 'react';
import type { ComparisonItem } from '../types';

const MAX_COMPARISON_ITEMS = 3;

interface ComparisonContextType {
  items: ComparisonItem[];
  addItem: (item: ComparisonItem) => void;
  removeItem: (item: ComparisonItem) => void;
  clearItems: () => void;
  canAddItem: (type: 'flight' | 'hotel' | 'airbnb') => boolean;
  error: string | null;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    if (error) setError(null);
  };
  
  const addItem = (itemToAdd: ComparisonItem) => {
    clearError();
    setItems(prevItems => {
      if (prevItems.length >= MAX_COMPARISON_ITEMS) {
        setError('max_items_reached');
        return prevItems;
      }
      if (prevItems.length > 0 && prevItems[0].type !== itemToAdd.type) {
        setError('different_types_error');
        return prevItems;
      }
      const itemExists = prevItems.some(item => 
        item.type === itemToAdd.type && JSON.stringify(item.item) === JSON.stringify(itemToAdd.item)
      );
      if (itemExists) {
        return prevItems;
      }
      return [...prevItems, itemToAdd];
    });
  };

  const removeItem = (itemToRemove: ComparisonItem) => {
    clearError();
    setItems(prevItems => prevItems.filter(item => 
      JSON.stringify(item.item) !== JSON.stringify(itemToRemove.item)
    ));
  };
  
  const clearItems = () => {
    clearError();
    setItems([]);
  };
  
  const canAddItem = (type: 'flight' | 'hotel' | 'airbnb') => {
    if (items.length >= MAX_COMPARISON_ITEMS) return false;
    if (items.length > 0 && items[0].type !== type) return false;
    return true;
  };

  const contextValue = useMemo(() => ({
    items,
    addItem,
    removeItem,
    clearItems,
    canAddItem,
    error
  }), [items, error]);

  return (
    <ComparisonContext.Provider value={contextValue}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};