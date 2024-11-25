import React, { createContext, useContext, useState } from 'react';

interface VideoStats {
  views: number;
  followers: number;
  retention: number;
  conversion: number;
  sales: number;
}

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  stats: VideoStats | null;
}

interface DishVideos {
  dishName: string;
  videos: Video[];
}

export interface ProductRecord {
  id: number;
  productName: string;
  timestamp: number;
  dishes: DishVideos[];
}

interface HistoryContextType {
  history: ProductRecord[];
  addRecord: (record: ProductRecord) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<ProductRecord[]>([]);

  const addRecord = (record: ProductRecord) => {
    setHistory(prev => [record, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ history, addRecord, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}