import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface VideoStats {
  [key: string]: number;
}

interface StatsFormProps {
  initialStats: VideoStats | null;
  onSave: (stats: VideoStats) => void;
}

interface FieldConfig {
  label: string;
  min?: number;
  max?: number;
  suffix?: string;
}

const fieldConfigs: Record<string, FieldConfig> = {
  views: {
    label: '播放量',
    min: 0
  },
  followers: {
    label: '涨粉量',
    min: 0
  },
  retention_3: {
    label: '3s停留',
    min: 0,
    max: 100,
    suffix: '%'
  },
  retention_5: {
  label: '5s停留',
  min: 0,
  max: 100,
  suffix: '%'
  },
  conversion: {
    label: '转化率',
    min: 0,
    max: 100,
    suffix: '%'
  },
  sales: {
    label: '销量',
    min: 0
  }
};

export default function StatsForm({ initialStats, onSave }: StatsFormProps) {
  const defaultStats = Object.keys(fieldConfigs).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as VideoStats);

  const [stats, setStats] = useState<VideoStats>(initialStats || defaultStats);

  const handleChange = (field: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setStats(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(stats);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(fieldConfigs).map(([field, config]) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.label}
              {config.suffix && ` (${config.suffix})`}
            </label>
            <input
              type="number"
              value={stats[field] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              min={config.min}
              max={config.max}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          保存数据
        </button>
      </div>
    </form>
  );
}