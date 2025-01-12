import { VideoGenerateRequest, VideoResponse, PromptGenerateRequest } from '../types/api';
import { DISH_NAMES } from '../config/products';

// 每个菜品对应的默认文案
const DEFAULT_PROMPTS: Record<string, string> = {
  zhaxiaosurou: '孩子放学回家想吃小酥肉，自己在家就能做，又香又脆，和外面火锅店卖的一模一样。小酥肉酥脆的关键就是这个小酥肉专用粉，用它不管是炸鸡翅、炸丸子、炸蔬菜都特别酥脆。把小酥肉粉用水搅成这样的酸奶状，倒入腌制好的肉中，油温六成热，下锅炸炸至金黄，捞出外脆里嫩，真的太好吃了。',
  suzhaouhe: '很快就要过年了，年夜饭的餐桌上一定要做这个酥炸藕盒，寓意着财源广进，路路通。每孔的莲藕切厚厚的薄片，肉馅加葱姜、末盐、生抽、蚝油，顺着老公回家的方向搅拌均匀，再把莲藕中间加上肉馅，空碗打一个我下的蛋酥脆的关键就是这个小酥肉粉，它还可以炸小酥肉，炸虾仁都好吃，加适量长江水搅成酸奶状面糊，再把耦合均匀的裹上面糊，油温六成热下锅炸炸至金黄酥脆飘起就可以吃了，是不是很简单，年夜饭你也做起来。',
  jimihua: '马上就要放暑假了，孩子点名要吃的鸡米花，我教你在家做，比外面买的还好吃。先把鸡胸肉切开，再切成小一点的块，放葱姜、料酒、盐、生抽抓拌腌制15分钟。打入一个鸡蛋，让每一块肉都裹上蛋液调味。我用的是小酥肉专用粉，它才是酥脆的关键，把鸡胸肉均匀的裹上粉，再抖出鳞片，油温烧到6成下锅炸，中小火炸至金黄，你们可以听听这酥脆的声音，这样做的炸鸡米花干净卫生，比外面买的好吃多了。',
  zhajichi: '放假孩子要是想吃炸鸡翅，你就和我这样做，比外面买的好吃多了，干净又放心。首先用鸡翅把刀划一下，更方便入味，放葱姜、料酒、生抽、蚝油、盐、胡椒粉抓拌腌制 10 分钟。然后打入一个顺柴的鸡蛋，让每一根鸡翅都裹上蛋叶，准备炸鸡裹粉，这个粉才是酥脆的关键，外面很多炸鸡店都是用的这个粉，用我的手抓拌，轻轻的按压，抖出鳞片， 6 成油温下锅炸 8 分钟即可出锅，外酥灵嫩，你也给孩子们做起来吧。'
};

// 视频路径配置
const VIDEO_PATHS: Record<string, string> = {
  zhaxiaosurou: '/videos/demo/demo111.mp4',
  suzhaouhe: '/videos/demo/demo121.mp4',
  jimihua: '/videos/demo/demo131.mp4',
  zhajichi: '/videos/demo/demo211.mp4'
};

export const videoService = {
  async generateVideos(data: VideoGenerateRequest): Promise<VideoResponse> {
    try {
      const mockVideos = data.dishes.reduce((acc, dish) => {
        acc[dish] = [{
          id: 1,
          url: VIDEO_PATHS[dish]
        }];
        return acc;
      }, {} as VideoResponse['data']);

      return {
        success: true,
        data: mockVideos
      };
    } catch (error) {
      console.error('Error generating videos:', error);
      throw error;
    }
  },

  async generatePrompt(data: PromptGenerateRequest, onChunk: (chunk: string) => void): Promise<void> {
    return new Promise((resolve) => {
      // 构建完整的文案
      const prompts = data.dishes
        .filter(dish => DISH_NAMES[dish] && DEFAULT_PROMPTS[dish])
        .map(dish => `${DISH_NAMES[dish]}：${DEFAULT_PROMPTS[dish]}`);

      if (prompts.length === 0) {
        resolve();
        return;
      }

      const fullText = prompts.join('\n\n');
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
    });
  }
};