import React from 'react';
import { TrendingUp } from 'lucide-react';

interface VideoStats {
  [key: string]: number;
}

interface StatsDisplayProps {
  stats: VideoStats;
}

interface StatConfig {
  label: string;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
}

const statsConfig: Record<string, StatConfig> = {
  views: {
    label: '播放量',
    icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
    formatter: (value) => value.toLocaleString()
  },
  followers: {
    label: '涨粉量',
    prefix: '+',
  },
  retention_3: {
    label: '3s停留',
    suffix: '%'
  },
  retention_5: {
    label: '5s停留',
    suffix: '%'
  },
  conversion: {
    label: '转化率',
    suffix: '%'
  },
  sales: {
    label: '销量'
  }
};

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  const statsEntries = Object.entries(stats);
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
      {statsEntries.map(([key, value]) => {
        const config = statsConfig[key] || { label: key };
        const displayValue = config.formatter ? config.formatter(value) : value.toString();

        return (
          <div key={key}>
            <p className="text-sm text-gray-500 mb-1">{config.label}</p>
            <div className="flex items-center gap-1">
              {config.icon}
              {config.prefix && (
                <span className="text-green-500 text-lg font-medium">
                  {config.prefix}
                </span>
              )}
              <span className="text-xl font-semibold">
                {displayValue}
                {config.suffix}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}