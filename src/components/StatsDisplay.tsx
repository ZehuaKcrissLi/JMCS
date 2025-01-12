import React from 'react';
import type { VideoStats } from '../types/api';

interface StatsDisplayProps {
  stats: VideoStats;
}

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <div className="text-sm font-medium text-gray-500">播放量</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.views}</div>
      </div>
      
      <div>
        <div className="text-sm font-medium text-gray-500">涨粉量</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.followers}</div>
      </div>
      
      <div>
        <div className="text-sm font-medium text-gray-500">完播率</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.retention}%</div>
      </div>
      
      <div>
        <div className="text-sm font-medium text-gray-500">转化率</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.conversion}%</div>
      </div>
      
      <div>
        <div className="text-sm font-medium text-gray-500">销售额</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.sales}</div>
      </div>
    </div>
  );
}