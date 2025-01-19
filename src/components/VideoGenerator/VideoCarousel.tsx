import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Video } from '../../types/api';

interface VideoCarouselProps {
  videos: Video[];
  onVideoChange?: (video: Video) => void;
}

export function VideoCarousel({ videos, onVideoChange }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onVideoChange) {
      onVideoChange(videos[currentIndex]);
    }
  }, [currentIndex]);

  useEffect(() => {
    setIsPlaying(false);
    setError(null);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % videos.length;
    setCurrentIndex(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + videos.length) % videos.length;
    setCurrentIndex(newIndex);
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
      setProgress(0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const time = (percentage / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(percentage);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={currentVideo.url}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
        loop={false}
        onError={(e) => {
          console.error('视频加载错误:', {
            error: e,
            videoUrl: currentVideo.url,
            videoElement: videoRef.current
          });
          setError(`视频加载失败: ${currentVideo.url}`);
        }}
        onLoadedData={() => {
          console.log('视频加载成功:', {
            url: currentVideo.url,
            duration: videoRef.current?.duration
          });
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
      
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm">
        {/* 进度条 */}
        <div 
          ref={progressBarRef}
          className="h-1 bg-gray-600 cursor-pointer relative"
          onClick={handleProgressBarClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-white text-sm font-medium flex items-center gap-2">
            <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="text-white text-sm font-medium">
            {currentIndex + 1} / {videos.length}
          </div>
        </div>
      </div>
    </div>
  );
}