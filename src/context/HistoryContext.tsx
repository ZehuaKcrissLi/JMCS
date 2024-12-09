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
  updateVideoStats: (recordId: number, dishName: string, videoIndex: number, stats: VideoStats) => void;
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

  const updateVideoStats = (recordId: number, dishName: string, videoIndex: number, stats: VideoStats) => {
    setHistory(prev => prev.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          dishes: record.dishes.map(dish => {
            if (dish.dishName === dishName) {
              return {
                ...dish,
                videos: dish.videos.map((video, idx) => {
                  if (idx === videoIndex) {
                    return {
                      ...video,
                      stats: stats
                    };
                  }
                  return video;
                })
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