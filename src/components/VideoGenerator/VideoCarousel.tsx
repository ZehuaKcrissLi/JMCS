import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsPlaying(false);
    setError(null);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [currentIndex]);

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

  const handlePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pause();
        } else {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('播放出错:', error);
              setError('视频播放失败，请重试');
            });
          }
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('播放控制出错:', error);
        setError('视频控制失败，请重试');
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videos[currentIndex].url}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        playsInline
        loop={false}
        onError={(e) => {
          console.error('视频加载错误:', e);
          setError('视频加载失败');
        }}
        onLoadedData={() => {
          console.log('视频加载成功:', videos[currentIndex].url);
          setError(null);
        }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <button 
          onClick={handlePlayPause}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" fill="white" />
          )}
        </button>
      </div>

      {error && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
          {error}
        </div>
      )}
      
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