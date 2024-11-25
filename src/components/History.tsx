import React, { useState } from 'react';
import { Play, TrendingUp, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';

interface VideoStats {
  views: number;
  followers: number;
  retention: number;
  conversion: number;
  sales: number;
}

interface VideoCarouselProps {
  videos: {
    id: number;
    title: string;
    thumbnail: string;
    stats: VideoStats | null;
  }[];
  onVideoChange: (index: number) => void;
}

function VideoCarousel({ videos, onVideoChange }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    const newIndex = (currentIndex + 1) % videos.length;
    setCurrentIndex(newIndex);
    onVideoChange(newIndex);
  };

  const prevVideo = () => {
    const newIndex = (currentIndex - 1 + videos.length) % videos.length;
    setCurrentIndex(newIndex);
    onVideoChange(newIndex);
  };

  const currentVideo = videos[currentIndex];

  return (
    <div className="relative">
      <div className="relative aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={currentVideo.thumbnail}
          alt={currentVideo.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-8 h-8 text-white" fill="white" />
          </button>
        </div>
      </div>

      {videos.length > 1 && (
        <>
          <button
            onClick={prevVideo}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextVideo}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
          {currentIndex + 1} / {videos.length}
        </div>
      </div>
    </div>
  );
}

interface StatsDisplayProps {
  stats: VideoStats;
}

function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">播放量</p>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-xl font-semibold">
            {stats.views.toLocaleString()}
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">涨粉量</p>
        <div className="flex items-center gap-1">
          <span className="text-green-500 text-lg font-medium">+</span>
          <span className="text-xl font-semibold">
            {stats.followers}
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">3/5s停留</p>
        <p className="text-xl font-semibold">
          {stats.retention}%
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">转化率</p>
        <p className="text-xl font-semibold">
          {stats.conversion}%
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">销量</p>
        <p className="text-xl font-semibold">
          {stats.sales}
        </p>
      </div>
    </div>
  );
}

export default function History() {
  const { history, clearHistory } = useHistory();
  const [currentVideoIndices, setCurrentVideoIndices] = useState<Record<string, number>>({});

  const handleVideoChange = (dishId: string, index: number) => {
    setCurrentVideoIndices(prev => ({
      ...prev,
      [dishId]: index
    }));
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">历史记录</h1>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            清空历史记录
          </button>
        )}
      </div>
      
      <div className="space-y-8">
        {history.map((record) => (
          <div key={record.id} className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {record.productName}
            </h2>
            <p className="text-gray-500 mb-6">生成时间: {formatTimestamp(record.timestamp)}</p>

            <div className="space-y-8">
              {record.dishes.map((dish) => {
                const currentVideoIndex = currentVideoIndices[dish.dishName] || 0;
                const currentVideo = dish.videos[currentVideoIndex];

                return (
                  <div key={dish.dishName} className="border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <VideoCarousel 
                        videos={dish.videos} 
                        onVideoChange={(index) => handleVideoChange(dish.dishName, index)}
                      />

                      <div className="md:col-span-2">
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {dish.dishName} - 视频 {currentVideoIndex + 1}
                          </h3>
                        </div>

                        {currentVideo.stats && (
                          <StatsDisplay stats={currentVideo.stats} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}