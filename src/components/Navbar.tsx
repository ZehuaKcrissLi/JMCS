import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Video, History } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">聚木成森GPT（测试版）</span>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              美食短视频混剪
            </Link>
            <Link
              to="/history"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/history'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              历史记录
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}