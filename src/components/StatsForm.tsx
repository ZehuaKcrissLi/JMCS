import React, { useState } from 'react';
import type { VideoStats } from '../types/api';

interface StatsFormProps {
  initialStats: VideoStats | null;
  onSave: (stats: VideoStats) => void;
}

export default function StatsForm({ initialStats, onSave }: StatsFormProps) {
  const [stats, setStats] = useState<VideoStats>(() => initialStats || {
    views: 0,
    followers: 0,
    retention: 0,
    conversion: 0,
    sales: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(stats);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">播放量</label>
        <input
          type="number"
          value={stats.views}
          onChange={(e) => setStats(prev => ({ ...prev, views: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">涨粉量</label>
        <input
          type="number"
          value={stats.followers}
          onChange={(e) => setStats(prev => ({ ...prev, followers: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">完播率</label>
        <input
          type="number"
          value={stats.retention}
          onChange={(e) => setStats(prev => ({ ...prev, retention: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">转化率</label>
        <input
          type="number"
          value={stats.conversion}
          onChange={(e) => setStats(prev => ({ ...prev, conversion: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">销售额</label>
        <input
          type="number"
          value={stats.sales}
          onChange={(e) => setStats(prev => ({ ...prev, sales: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          保存
        </button>
      </div>
    </form>
  );
}