import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface Video {
  id: number;
  url: string;
}

interface VideoCarouselProps {
  videos: Video[];
  onVideoChange?: (index: number) => void;
}

export function VideoCarousel({ videos, onVideoChange }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % videos.length;
    setCurrentIndex(newIndex);
    onVideoChange?.(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + videos.length) % videos.length;
    setCurrentIndex(newIndex);
    onVideoChange?.(newIndex);
  };

  return (
    <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
      <img
        src={videos[currentIndex].url}
        alt={`Video ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
          <Play className="w-6 h-6 text-white" fill="white" />
        </button>
      </div>
      
      {videos.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs">
          {currentIndex + 1} / {videos.length}
        </div>
      </div>
    </div>
  );
}