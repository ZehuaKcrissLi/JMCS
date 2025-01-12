import { VideoGenerateRequest, VideoResponse, PromptGenerateRequest } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const videoService = {
  async generateVideos(data: VideoGenerateRequest): Promise<VideoResponse> {
    try {
      // 开发阶段使用模拟数据
      return mockGenerateVideos(data);
    } catch (error) {
      console.error('Error generating videos:', error);
      throw error;
    }
  },

  async generatePrompt(data: PromptGenerateRequest, onChunk: (chunk: string) => void): Promise<void> {
    try {
      // 开发阶段使用模拟数据
      await mockGeneratePrompt(data, onChunk);
      
      // 后端ready后替换为实际API调用:
      /*
      const response = await fetch(`${API_BASE_URL}/api/prompt/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        onChunk(chunk);
      }
      */
    } catch (error) {
      console.error('Error generating prompt:', error);
      throw error;
    }
  }
};

// Mock functions
function mockGenerateVideos(data: VideoGenerateRequest): Promise<VideoResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockVideos = data.dishes.reduce((acc, dish) => {
        acc[dish] = Array(5).fill(0).map((_, i) => ({
          id: i + 1,
          url: `https://images.unsplash.com/photo-${1546069901 + i}-ba9599a7e63c`,
        }));
        return acc;
      }, {} as VideoResponse['data']);

      resolve({
        success: true,
        data: mockVideos
      });
    }, 1500);
  });
}

function mockGeneratePrompt(data: PromptGenerateRequest, onChunk: (chunk: string) => void): Promise<void> {
  return new Promise((resolve) => {
    const mockText = `为${data.productName}制作${data.dishes.join('、')}的视频文案：\n\n 孩子放学回家想吃小酥肉，自己在家就能做，又香又脆，和外面火锅店卖的一模一样。小酥肉酥脆的关键就是这个小酥肉专用粉，用它不管是炸鸡翅、炸丸子、炸蔬菜都特别酥脆。把小酥肉粉用水搅成这样的酸奶状，倒入腌制好的肉中，油温六成热，下锅炸炸至金黄，捞出外脆里嫩，真的太好吃了。`;
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex >= mockText.length) {
        clearInterval(interval); 
        resolve();
        return;
      }
      
      const chunk = mockText.slice(currentIndex, currentIndex + 5);
      onChunk(chunk);
      currentIndex += 5;
    }, 100);
  });
}