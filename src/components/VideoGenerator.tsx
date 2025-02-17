import React, { useState } from 'react';
import { Play, RefreshCw, MessageSquarePlus, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';

interface Product {
  id: number;
  name: string;
  dishes: string[];
}

interface GeneratedVideo {
  id: number;
  thumbnail: string;
}

interface GeneratedDishVideos {
  dishName: string;
  videos: GeneratedVideo[];
}

const products: Product[] = [
  { 
    id: 1, 
    name: '小酥肉粉', 
    dishes: ['炸小酥肉', '香酥鸡块', '酥炸虾', '炸鱼排'] 
  },
  { 
    id: 2, 
    name: '烤肉料', 
    dishes: ['烤羊肉串', '烤鸡翅', '烤五花肉', '烤生蚝'] 
  },
];

const demoThumbnails = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
  'https://images.unsplash.com/photo-1432139555190-58524dae6a55',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327'
];

function VideoCarousel({ videos }: { videos: GeneratedVideo[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
      <img
        src={videos[currentIndex].thumbnail}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
          <Play className="w-6 h-6 text-white" fill="white" />
        </button>
      </div>
      
      {videos.length > 1 && (
        <>
          <button
            onClick={prevVideo}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextVideo}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs">
          {currentIndex + 1} / {videos.length}
        </div>
      </div>
    </div>
  );
}

export default function VideoGenerator() {
  const { addRecord } = useHistory();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedDishVideos[]>([]);

  const handleDishSelect = (dish: string) => {
    setSelectedDishes(prev => 
      prev.includes(dish) 
        ? prev.filter(d => d !== dish)
        : [...prev, dish]
    );
  };

  const handleGeneratePrompt = async () => {
    if (!selectedProduct || selectedDishes.length === 0) {
      alert('请选择产品和至少一个菜品');
      return;
    }

    setIsGeneratingPrompt(true);
    setShowPrompt(true);
    setPrompt('');

    try {
      // 模拟流式返回
      const mockText = `为${selectedProduct}制作${selectedDishes.join('、')}的视频文案：\n\n孩子放学回家想吃小酥肉，自己在家就能做，又香又脆，和外面火锅店卖的一模一样。小酥肉酥脆的关键就是这个小酥肉专用粉，用它不管是炸鸡翅、炸丸子、炸蔬菜都特别酥脆。把小酥肉粉用水搅成这样的酸奶状，倒入腌制好的肉中，油温六成热，下锅炸炸至金黄，捞出外脆里嫩，真的太好吃了。`;


      for (let i = 0; i < mockText.length; i += 5) {
        const chunk = mockText.slice(i, i + 5);
        await new Promise(resolve => setTimeout(resolve, 100));
        setPrompt(prev => prev + chunk);
      }

      // TODO: 替换为实际的API调用
      // const response = await fetch('/api/generate-prompt', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ product: selectedProduct, dishes: selectedDishes })
      // });
      // const reader = response.body.getReader();
      // const decoder = new TextDecoder();
      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) break;
      //   const chunk = decoder.decode(value);
      //   setPrompt(prev => prev + chunk);
      // }
    } catch (error) {
      console.error('Error generating prompt:', error);
      alert('生成文案失败，请重试');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGenerate = () => {
    if (!selectedProduct || selectedDishes.length === 0) {
      alert('请选择产品和至少一个菜品');
      return;
    }

    setIsGenerating(true);

    // 模拟生成过程
    setTimeout(() => {
      const newGeneratedVideos = selectedDishes.map(dish => ({
        dishName: dish,
        videos: Array(5).fill(0).map((_, i) => ({
          id: i + 1,
          thumbnail: demoThumbnails[i % demoThumbnails.length]
        }))
      }));

      setGeneratedVideos(newGeneratedVideos);
      
      // Add to history
      addRecord({
        id: Date.now(),
        productName: selectedProduct,
        timestamp: Date.now(),
        dishes: newGeneratedVideos.map(dish => ({
          dishName: dish.dishName,
          videos: dish.videos.map(v => ({
            id: v.id,
            title: `${selectedProduct} - ${dish.dishName} ${v.id}`,
            thumbnail: v.thumbnail,
            stats: null
          }))
        }))
      });

      setIsGenerating(false);
    }, 2000);
  };

  const selectedProductDishes = products.find(p => p.name === selectedProduct)?.dishes || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">创建短视频</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择产品
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedDishes([]);
                setGeneratedVideos([]);
                setShowPrompt(false);
                setPrompt('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">请选择产品</option>
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="bg-purple-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-purple-800 mb-3">可制作的菜品：</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProductDishes.map((dish) => (
                  <button
                    key={dish}
                    onClick={() => handleDishSelect(dish)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedDishes.includes(dish)
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {dish}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGeneratePrompt}
              disabled={isGeneratingPrompt || !selectedProduct || selectedDishes.length === 0}
              className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md ${
                isGeneratingPrompt || !selectedProduct || selectedDishes.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              {isGeneratingPrompt ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageSquarePlus className="h-4 w-4 mr-2" />
              )}
              {isGeneratingPrompt ? '生成文案中...' : '生成视频文案'}
            </button>

            {showPrompt && (
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="正在生成文案..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  disabled={isGeneratingPrompt}
                />
                {!isGeneratingPrompt && (
                  <button
                    onClick={handleGeneratePrompt}
                    className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                    title="重新生成"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedProduct || selectedDishes.length === 0}
              className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md ${
                isGenerating || !selectedProduct || selectedDishes.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? '生成中...' : '开始生成'}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Videos Display */}
      {generatedVideos.length > 0 && (
        <div className="space-y-8">
          {generatedVideos.map((dishVideos, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {dishVideos.dishName}
              </h2>
              <div className="max-w-sm mx-auto">
                <VideoCarousel videos={dishVideos.videos} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}