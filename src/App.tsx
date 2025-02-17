import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VideoGenerator from './components/VideoGenerator/index';
import History from './components/History';
import { HistoryProvider } from './context/HistoryContext';
import { VideoGeneratorProvider } from './context/VideoGeneratorContext';

function App() {
  return (
    <HistoryProvider>
      <VideoGeneratorProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<VideoGenerator />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
        </div>
      </VideoGeneratorProvider>
    </HistoryProvider>
  );
}

export default App;