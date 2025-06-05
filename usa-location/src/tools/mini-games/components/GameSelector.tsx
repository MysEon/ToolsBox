'use client';

import React from 'react';
import { Play, Settings, Trophy, Clock, User } from 'lucide-react';
import { GameType } from '../types';
import { gameInfo } from '../data/gameData';
import { useGameContext } from '../context/GameContext';
import { gameUtils } from '../utils/gameUtils';

interface GameSelectorProps {
  onGameSelect: (game: GameType) => void;
  onSettingsOpen: (game: GameType) => void;
}

export default function GameSelector({ onGameSelect, onSettingsOpen }: GameSelectorProps) {
  const { snakeStats, tetrisStats, gomokuStats } = useGameContext();
  
  const getGameStats = (game: GameType) => {
    switch (game) {
      case 'snake':
        return snakeStats;
      case 'tetris':
        return tetrisStats;
      case 'gomoku':
        return gomokuStats;
      default:
        return { gamesPlayed: 0, totalScore: 0, bestScore: 0, totalTime: 0 };
    }
  };
  
  const games: GameType[] = ['snake', 'tetris', 'gomoku'];
  
  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
          <span className="text-3xl">🎮</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">小游戏合集</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          经典小游戏合集，包含贪吃蛇、俄罗斯方块、五子棋等热门游戏。每个游戏都支持个性化设置，让您享受最佳的游戏体验。
        </p>
      </div>
      
      {/* 游戏卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const info = gameInfo[game];
          const stats = getGameStats(game);
          
          return (
            <div
              key={game}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* 卡片头部 */}
              <div className={`bg-gradient-to-r ${info.color} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 opacity-10 text-6xl transform rotate-12 translate-x-4 -translate-y-2">
                  {info.icon}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{info.icon}</span>
                    <h3 className="text-xl font-bold">{info.name}</h3>
                  </div>
                  <p className="text-white/90 text-sm mb-4">{info.description}</p>
                  
                  {/* 游戏信息 */}
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                      <span className="text-white/80">{info.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 text-white/80" />
                      <span className="text-white/80">{info.players}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 统计信息 */}
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
                      <Trophy className="h-3 w-3" />
                      <span>最高分</span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {gameUtils.formatScore(stats.bestScore)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
                      <Play className="h-3 w-3" />
                      <span>游戏次数</span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {stats.gamesPlayed}
                    </div>
                  </div>
                </div>
                
                {stats.totalTime > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-1 text-gray-500 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>总游戏时间: {gameUtils.formatTime(stats.totalTime)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 操作按钮 */}
              <div className="p-4 bg-white">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onGameSelect(game)}
                    className={`flex-1 bg-gradient-to-r ${info.color} text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2`}
                  >
                    <Play className="h-4 w-4" />
                    <span>开始游戏</span>
                  </button>
                  <button
                    onClick={() => onSettingsOpen(game)}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                    title="游戏设置"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 特色功能 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">✨ 特色功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">个性化设置</h3>
            <p className="text-sm text-gray-600">每个游戏都支持丰富的个性化设置选项</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">成绩记录</h3>
            <p className="text-sm text-gray-600">自动保存游戏记录和最高分数</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">响应式设计</h3>
            <p className="text-sm text-gray-600">完美适配桌面端和移动端设备</p>
          </div>
        </div>
      </div>
    </div>
  );
}
