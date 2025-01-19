import React, { createContext, useContext, useState } from 'react';
import type { Video } from '../types/api';

interface HistoryRecord {
  id: number;
  productName: string;
  timestamp: number;
  dishes: {
    dishName: string;
    videos: Video[];
  }[];
}

interface HistoryContextType {
  history: HistoryRecord[];
  addRecord: (record: HistoryRecord) => void;
  clearHistory: () => void;
  updateVideoStats: (recordId: number, dishName: string, videoIndex: number, stats: Video['stats']) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  const addRecord = (record: HistoryRecord) => {
    setHistory(prev => [record, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const updateVideoStats = (recordId: number, dishName: string, videoIndex: number, stats: Video['stats']) => {
    setHistory(prev => prev.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          dishes: record.dishes.map(dish => {
            if (dish.dishName === dishName) {
              return {
                ...dish,
                videos: dish.videos.map((video, index) => 
                  index === videoIndex ? { ...video, stats } : video
                )
              };
            }
            return dish;
          })
        };
      }
      return record;
    }));
  };

  return (
    <HistoryContext.Provider value={{ history, addRecord, clearHistory, updateVideoStats }}>
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