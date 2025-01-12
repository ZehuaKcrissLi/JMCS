import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';
import StatsDisplay from './StatsDisplay';
import StatsForm from './StatsForm';
import { VideoCarousel } from './VideoGenerator/VideoCarousel';
import type { VideoStats } from '../types/api';

export default function History() {
  const { history, clearHistory, updateVideoStats } = useHistory();
  const [currentVideoIndices, setCurrentVideoIndices] = useState<Record<string, number>>({});
  const [editingStats, setEditingStats] = useState<string | null>(null);

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

  const handleSaveStats = (recordId: number, dishName: string, videoIndex: number, stats: VideoStats) => {
    updateVideoStats(recordId, dishName, videoIndex, stats);
    setEditingStats(null);
  };

  if (!history || history.length === 0) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">历史记录</h1>
        <p className="text-gray-500">暂无历史记录</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">历史记录</h1>
        <button
          onClick={clearHistory}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          清空历史记录
        </button>
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
                if (!dish || !dish.videos || dish.videos.length === 0) {
                  return null;
                }

                const currentVideoIndex = currentVideoIndices[dish.dishName] || 0;
                const currentVideo = dish.videos[currentVideoIndex];

                if (!currentVideo) {
                  return null;
                }

                const isEditing = editingStats === `${record.id}-${dish.dishName}-${currentVideoIndex}`;

                const carouselVideos = dish.videos.map(v => ({
                  id: v.id,
                  url: v.thumbnail || '',
                  stats: v.stats || null
                }));

                return (
                  <div key={dish.dishName} className="border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <VideoCarousel 
                        videos={carouselVideos}
                        onVideoChange={(video) => handleVideoChange(dish.dishName, carouselVideos.indexOf(video))}
                      />

                      <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {dish.dishName} - 视频 {currentVideoIndex + 1}
                          </h3>
                          {!isEditing && (
                            <button
                              onClick={() => setEditingStats(`${record.id}-${dish.dishName}-${currentVideoIndex}`)}
                              className="flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
                            >
                              <Edit2 className="h-4 w-4 mr-1.5" />
                              编辑数据
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <StatsForm
                            initialStats={currentVideo.stats || null}
                            onSave={(stats) => handleSaveStats(record.id, dish.dishName, currentVideoIndex, stats)}
                          />
                        ) : currentVideo.stats ? (
                          <StatsDisplay stats={currentVideo.stats} />
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            暂无数据，点击编辑按钮添加
                          </div>
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