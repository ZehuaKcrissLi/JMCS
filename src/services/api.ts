import { VideoGenerateRequest, PromptGenerateRequest, VideoStats } from '../types/api';
import { DISH_NAMES } from '../config/products';

interface VideoData {
  [key: string]: {
    [videoPath: string]: string;  // 视频路径 -> 文案
  }
}

interface SelectedVideo {
  videoPath: string;
  script: string;
}

interface SelectedVideos {
  [dishName: string]: SelectedVideo[];
}

let videoData: VideoData | null = null;
let lastSelectedVideos: SelectedVideos = {};

async function loadVideoData(): Promise<VideoData> {
  if (videoData) return videoData;
  
  try {
    const response = await fetch('/ASR_demo2_output.json');
    const data = await response.json();
    
    // 处理数据结构
    const processedData: VideoData = {};
    for (const [path, script] of Object.entries(data)) {
      // 从完整路径中提取文件名
      const match = path.match(/([^/]+?)_([^_/]+?)_\d+\.mp4$/);
      if (match) {
        const dishType = match[2];  // 例如：炸小酥肉、炸鸡翅、炸藕盒
        if (!processedData[dishType]) {
          processedData[dishType] = {};
        }
        // 只保存文件名部分
        const fileName = path.split('/').pop() || path;
        processedData[dishType][fileName] = script as string;
      }
    }
    
    videoData = processedData;
    return processedData;
  } catch (error) {
    console.error('Error loading video data:', error);
    throw error;
  }
}

// 修改VideoResponse类型
interface VideoWithScript {
  id: number;
  url: string;
  script: string;
  stats?: VideoStats | null;
  thumbnail?: string;
  title?: string;
}

export const videoService = {
  async generateVideos(data: VideoGenerateRequest): Promise<{ success: boolean; data: Record<string, VideoWithScript[]> }> {
    try {
      await loadVideoData();  // 确保数据已加载
      
      // 检查是否有选中的视频
      const hasSelectedVideos = Object.keys(lastSelectedVideos).length > 0;
      if (!hasSelectedVideos) {
        throw new Error('请先生成文案');
      }

      const mockVideos = data.dishes.reduce((acc, dish) => {
        const dishName = DISH_NAMES[dish];
        const selectedVideosForDish = lastSelectedVideos[dishName];
        if (dishName && selectedVideosForDish) {
          // 使用之前选中的视频
          const selectedVideos = selectedVideosForDish.map((selected, index) => ({
            id: index + 1,
            url: `/videos/demo2/${selected.videoPath}`,
            script: selected.script,
            thumbnail: `/videos/demo2/${selected.videoPath}`,
            title: `${dishName} - 视频 ${index + 1}`
          }));
          
          acc[dish] = selectedVideos;
        }
        return acc;
      }, {} as Record<string, VideoWithScript[]>);

      console.log('生成的视频数据:', mockVideos);

      return {
        success: true,
        data: mockVideos
      };
    } catch (error) {
      console.error('Error generating videos:', error);
      throw error;
    }
  },

  generatePrompt(data: PromptGenerateRequest, onChunk: (chunk: string) => void): Promise<void> {
    return new Promise((resolve) => {
      loadVideoData()
        .then(videoData => {
          // 重置选中的视频为空对象
          lastSelectedVideos = {};

          // 为每个菜品随机选择指定数量的文案
          const prompts = data.dishes
            .filter(dish => DISH_NAMES[dish])
            .map(dish => {
              const dishName = DISH_NAMES[dish];
              if (videoData[dishName]) {
                const videoEntries = Object.entries(videoData[dishName]);
                if (videoEntries.length > 0) {
                  // 随机选择指定数量的不同视频及其文案
                  const selectedEntries = [];
                  const availableIndices = Array.from({ length: videoEntries.length }, (_, i) => i);
                  
                  for (let i = 0; i < Math.min(data.numVideos, videoEntries.length); i++) {
                    // 从剩余的视频中随机选择一个
                    const randomIndex = Math.floor(Math.random() * availableIndices.length);
                    const entryIndex = availableIndices[randomIndex];
                    // 从可用列表中移除已选择的索引
                    availableIndices.splice(randomIndex, 1);
                    
                    const [videoPath, script] = videoEntries[entryIndex];
                    selectedEntries.push({ videoPath, script });
                  }

                  // 保存选中的视频
                  lastSelectedVideos[dishName] = selectedEntries;
                  
                  return `${dishName}：\n${selectedEntries.map((entry, index) => 
                    `视频${index + 1}：${entry.script}`
                  ).join('\n\n')}`;
                }
              }
              return null;
            })
            .filter(Boolean);

          if (prompts.length === 0) {
            resolve();
            return;
          }

          const fullText = prompts.join('\n\n' + '='.repeat(50) + '\n\n');
          let currentIndex = 0;

          // 模拟流式输出
          const interval = setInterval(() => {
            if (currentIndex >= fullText.length) {
              clearInterval(interval);
              resolve();
              return;
            }

            onChunk(fullText[currentIndex]);
            currentIndex++;
          }, 20);
        })
        .catch(error => {
          console.error('Error generating prompt:', error);
          resolve();
        });
    });
  }
};