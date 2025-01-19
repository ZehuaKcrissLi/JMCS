import React, { createContext, useContext, useState } from 'react';
import type { Video } from '../types/api';

interface GeneratedVideo {
  dishName: string;
  videos: Video[];
}

interface VideoGeneratorState {
  selectedProduct: string;
  selectedDishes: string[];
  prompt: string;
  showPrompt: boolean;
  generatedVideos: GeneratedVideo[];
}

interface VideoGeneratorContextType {
  state: VideoGeneratorState;
  setSelectedProduct: (product: string) => void;
  setSelectedDishes: (dishes: string[]) => void;
  setPrompt: (prompt: string) => void;
  setShowPrompt: (show: boolean) => void;
  setGeneratedVideos: (videos: GeneratedVideo[]) => void;
  resetState: () => void;
}

const initialState: VideoGeneratorState = {
  selectedProduct: '',
  selectedDishes: [],
  prompt: '',
  showPrompt: false,
  generatedVideos: []
};

const VideoGeneratorContext = createContext<VideoGeneratorContextType | undefined>(undefined);

export function VideoGeneratorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VideoGeneratorState>(initialState);

  const setSelectedProduct = (product: string) => {
    setState(prev => ({ ...prev, selectedProduct: product }));
  };

  const setSelectedDishes = (dishes: string[]) => {
    setState(prev => ({
      ...prev,
      selectedDishes: Array.isArray(dishes) ? dishes : []
    }));
  };

  const setPrompt = (promptOrUpdater: string | ((prev: string) => string)) => {
    setState(prev => ({
      ...prev,
      prompt: typeof promptOrUpdater === 'function' 
        ? promptOrUpdater(prev.prompt)
        : promptOrUpdater || ''
    }));
  };

  const setShowPrompt = (show: boolean) => {
    setState(prev => ({ ...prev, showPrompt: show }));
  };

  const setGeneratedVideos = (videos: GeneratedVideo[]) => {
    setState(prev => ({ ...prev, generatedVideos: videos }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <VideoGeneratorContext.Provider 
      value={{ 
        state,
        setSelectedProduct,
        setSelectedDishes,
        setPrompt,
        setShowPrompt,
        setGeneratedVideos,
        resetState
      }}
    >
      {children}
    </VideoGeneratorContext.Provider>
  );
}

export function useVideoGenerator() {
  const context = useContext(VideoGeneratorContext);
  if (context === undefined) {
    throw new Error('useVideoGenerator must be used within a VideoGeneratorProvider');
  }
  return context;
} 