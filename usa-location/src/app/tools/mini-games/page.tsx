'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MiniGames from '@/tools/mini-games/components/MiniGames';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

export default function MiniGamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* 头部导航 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-white hover:text-purple-100 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">返回工具箱</span>
              </Link>
              <div className="h-6 w-px bg-purple-300"></div>
              <h1 className="text-xl font-bold text-white">🎮 小游戏合集</h1>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary><MiniGames /></ErrorBoundary>
      </main>
    </div>
  );
}
