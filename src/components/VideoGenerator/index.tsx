import React, { useState } from 'react';
import { Play, RefreshCw, MessageSquarePlus, RotateCcw } from 'lucide-react';
import { useHistory } from '../../context/HistoryContext';
import { videoService } from '../../services/api';
import { PRODUCTS, DISH_NAMES } from '../../config/products';
import { VideoCarousel } from './VideoCarousel';
import type { VideoGenerateRequest } from '../../types/api';

export default function VideoGenerator() {
  const { addRecord } = useHistory();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<Array<{
    dishName: string;
    videos: Array<{ id: number; url: string; }>;
  }>>([]);

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
      const productName = PRODUCTS.find(p => p.id === selectedProduct)?.name || '';
      const dishNames = selectedDishes.map(id => DISH_NAMES[id]);

      await videoService.generatePrompt(
        { productName, dishes: dishNames },
        (chunk) => {
          setPrompt(prev => prev + chunk);
        }
      );
    } catch (error) {
      console.error('Error generating prompt:', error);
      alert('生成文案失败，请重试');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProduct || selectedDishes.length === 0) {
      alert('请选择产品和至少一个菜品');
      return;
    }

    setIsGenerating(true);

    try {
      const request: VideoGenerateRequest = {
        productId: selectedProduct,
        dishes: selectedDishes,
        prompt: prompt || undefined
      };

      const response = await videoService.generateVideos(request);
      
      if (response.success) {
        const newGeneratedVideos = Object.entries(response.data).map(([dishId, videos]) => ({
          dishName: DISH_NAMES[dishId],
          videos: videos
        }));

        setGeneratedVideos(newGeneratedVideos);
        
        addRecord({
          id: Date.now(),
          productName: PRODUCTS.find(p => p.id === selectedProduct)?.name || '',
          timestamp: Date.now(),
          dishes: newGeneratedVideos.map(dish => ({
            dishName: dish.dishName,
            videos: dish.videos.map(v => ({
              id: v.id,
              title: `${dish.dishName} - 视频 ${v.id}`,
              thumbnail: v.url,
              stats: null
            }))
          }))
        });
      }
    } catch (error) {
      console.error('Error generating videos:', error);
      alert('生成视频失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedProductDishes = PRODUCTS.find(p => p.id === selectedProduct)?.dishes || [];

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
              {PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>
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
                    {DISH_NAMES[dish]}
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