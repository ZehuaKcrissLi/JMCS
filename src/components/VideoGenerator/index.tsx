import React, { useState } from 'react';
import { MessageSquarePlus, Play, RefreshCw, RotateCcw } from 'lucide-react';
import { useHistory } from '../../context/HistoryContext';
import { videoService } from '../../services/api';
import { PRODUCTS, DISH_NAMES } from '../../config/products';
import { VideoCarousel } from './VideoCarousel';
import type { VideoGenerateRequest } from '../../types/api';
import { useVideoGenerator } from '../../context/VideoGeneratorContext';

export default function VideoGenerator() {
  const { 
    state: { selectedProduct, selectedDishes, prompt, showPrompt, generatedVideos },
    setSelectedProduct,
    setSelectedDishes,
    setPrompt,
    setShowPrompt,
    setGeneratedVideos
  } = useVideoGenerator();
  
  const { addRecord } = useHistory();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isPromptComplete, setIsPromptComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideos, setCurrentVideos] = useState<Record<string, number>>({});
  const [numVideos, setNumVideos] = useState(5);
  const [showNumVideosSelect, setShowNumVideosSelect] = useState(false);

  const handleDishSelect = (dish: string) => {
    setSelectedDishes(selectedDishes.includes(dish)
      ? selectedDishes.filter(d => d !== dish)
      : [...selectedDishes, dish]
    );
  };

  const handleGeneratePrompt = async () => {
    if (!selectedProduct || selectedDishes.length === 0) {
      alert('请选择产品和至少一个菜品');
      return;
    }

    setShowNumVideosSelect(true);
  };

  const handleConfirmNumVideos = async () => {
    setShowNumVideosSelect(false);
    setIsGeneratingPrompt(true);
    setIsPromptComplete(false);
    setShowPrompt(true);
    setPrompt('');

    try {
      const productName = PRODUCTS.find(p => p.id === selectedProduct)?.name || '';

      let currentPrompt = '';
      await videoService.generatePrompt(
        { productName, dishes: selectedDishes, numVideos },
        (chunk: string) => {
          currentPrompt += chunk;
          setPrompt(currentPrompt);
        }
      );
      setIsPromptComplete(true);
    } catch (error) {
      console.error('Error generating prompt:', error);
      alert('生成文案失败，请重试');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProduct || selectedDishes.length === 0 || !prompt) {
      alert('请选择产品和菜品，并调用GPT生成视频文案');
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);

    try {
      const request: VideoGenerateRequest = {
        productId: selectedProduct,
        dishes: selectedDishes,
        prompt: prompt,
        numVideos
      };

      const response = await videoService.generateVideos(request);
      
      if (response.success) {
        const newGeneratedVideos = Object.entries(response.data).map(([dishId, videos]) => ({
          dishName: DISH_NAMES[dishId],
          videos: videos.map(video => ({
            ...video,
            title: video.title || `${DISH_NAMES[dishId]} - 视频 ${video.id}`,
            thumbnail: video.thumbnail || video.url,
            stats: video.stats || null
          }))
        }));

        const baseWaitTime = 8000; // 基础等待时间 8 秒
        const additionalTimePerVideo = 4000; // 每个额外视频增加 4 秒
        const randomFactor = Math.random() * 4000; // 0-4 秒的随机时间
        const totalWaitTime = Math.min(
          baseWaitTime + (numVideos - 1) * additionalTimePerVideo + randomFactor,
          35000 // 最大等待时间 35 秒
        );

        await new Promise(resolve => setTimeout(resolve, totalWaitTime));

        setGeneratedVideos(newGeneratedVideos);
        
        addRecord({
          id: Date.now(),
          productName: PRODUCTS.find(p => p.id === selectedProduct)?.name || '',
          timestamp: Date.now(),
          dishes: newGeneratedVideos.map(dish => ({
            dishName: dish.dishName,
            videos: dish.videos
          }))
        });
      }
    } catch (error) {
      console.error('Error generating videos:', error);
      alert('生成视频失败，请重试');
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const handleVideoChange = (dishName: string, video: { id: number; url: string }) => {
    setCurrentVideos(prev => ({
      ...prev,
      [dishName]: video.id
    }));
  };

  const selectedProductDishes = PRODUCTS.find(p => p.id === selectedProduct)?.dishes || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">创建混剪</h1>
        
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
                setIsPromptComplete(false);
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
              {isGeneratingPrompt ? '生成文案中...' : 'GPT生成视频文案'}
            </button>

            {showNumVideosSelect && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  你想为每个菜品生成几个混剪视频？
                </h3>
                <div className="flex gap-4">
                  <select
                    value={numVideos}
                    onChange={(e) => setNumVideos(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleConfirmNumVideos}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    确定
                  </button>
                </div>
              </div>
            )}

            {showPrompt && (
              <div className="relative">
                <textarea
                  value={prompt || ''}
                  readOnly
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
              disabled={isGenerating || !selectedProduct || selectedDishes.length === 0 || !prompt || !isPromptComplete || isGeneratingPrompt}
              className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md ${
                isGenerating || !selectedProduct || selectedDishes.length === 0 || !prompt || !isPromptComplete || isGeneratingPrompt
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

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          {/* <p className="text-gray-600">正在生成视频，请稍候...</p> */}
        </div>
      )}

      {generatedVideos.length > 0 && !isLoading && (
        <div className="space-y-8">
          {generatedVideos.map((dishVideos, index) => {
            const currentVideoId = currentVideos[dishVideos.dishName] || dishVideos.videos[0].id;

            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {dishVideos.dishName} - 视频 {currentVideoId}
                </h2>
                <div className="max-w-sm mx-auto">
                  <VideoCarousel 
                    videos={dishVideos.videos}
                    onVideoChange={(video) => handleVideoChange(dishVideos.dishName, video)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}