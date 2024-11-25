import React, { useState } from 'react';
import { Play, RefreshCw, MessageSquarePlus, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedDishVideos[]>([]);

  const handleDishSelect = (dish: string) => {
    setSelectedDishes(prev => 
      prev.includes(dish) 
        ? prev.filter(d => d !== dish)
        : [...prev, dish]
    );
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">菜肴短视频生成</h1>
        
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

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPromptDialog(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              添加提示词
            </button>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedProduct || selectedDishes.length === 0}
              className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md ${
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

      {/* 提示词对话框 */}
      {showPromptDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">添加提示词</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="输入视频文案或内容方向的提示词..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowPromptDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowPromptDialog(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}