'use client';

import React, { useState } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Palette, Zap, Grid3X3 } from 'lucide-react';
import { GameType } from '../types';
import { useGameContext } from '../context/GameContext';
import {
  snakeSpeedOptions,
  snakeColorThemes,
  tetrisThemes,
  gomokuBoardSizes,
  gomokuDifficulties
} from '../data/gameData';

interface GameSettingsProps {
  game: GameType;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameSettings({ game, isOpen, onClose }: GameSettingsProps) {
  const {
    snakeSettings,
    tetrisSettings,
    gomokuSettings,
    commonSettings,
    updateSnakeSettings,
    updateTetrisSettings,
    updateGomokuSettings,
    updateCommonSettings,
    resetGameStats
  } = useGameContext();
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  if (!isOpen) return null;
  
  const handleResetStats = () => {
    resetGameStats(game);
    setShowResetConfirm(false);
  };
  
  const renderSnakeSettings = () => (
    <div className="space-y-6">
      {/* 游戏速度 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Zap className="inline h-4 w-4 mr-1" />
          游戏速度
        </label>
        <div className="grid grid-cols-2 gap-2">
          {snakeSpeedOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSnakeSettings({ speed: option.value })}
              className={`p-3 rounded-lg border text-left transition-colors ${
                snakeSettings.speed === option.value
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* 颜色主题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Palette className="inline h-4 w-4 mr-1" />
          颜色主题
        </label>
        <div className="grid grid-cols-2 gap-2">
          {snakeColorThemes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => updateSnakeSettings({ 
                snakeColor: theme.snake, 
                foodColor: theme.food 
              })}
              className={`p-3 rounded-lg border text-left transition-colors ${
                snakeSettings.snakeColor === theme.snake
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: theme.snake }}
                ></div>
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: theme.food }}
                ></div>
                <span className="font-medium">{theme.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* 边界模式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">边界模式</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateSnakeSettings({ borderMode: 'wall' })}
            className={`p-3 rounded-lg border text-left transition-colors ${
              snakeSettings.borderMode === 'wall'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">撞墙死亡</div>
            <div className="text-xs text-gray-500">经典模式</div>
          </button>
          <button
            onClick={() => updateSnakeSettings({ borderMode: 'wrap' })}
            className={`p-3 rounded-lg border text-left transition-colors ${
              snakeSettings.borderMode === 'wrap'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">穿墙模式</div>
            <div className="text-xs text-gray-500">可以穿越边界</div>
          </button>
        </div>
      </div>
    </div>
  );
  
  const renderTetrisSettings = () => (
    <div className="space-y-6">
      {/* 下落速度 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Zap className="inline h-4 w-4 mr-1" />
          下落速度: {tetrisSettings.speed}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={tetrisSettings.speed}
          onChange={(e) => updateTetrisSettings({ speed: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>慢</span>
          <span>快</span>
        </div>
      </div>
      
      {/* 颜色主题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Palette className="inline h-4 w-4 mr-1" />
          颜色主题
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(tetrisThemes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => updateTetrisSettings({ theme: key })}
              className={`p-3 rounded-lg border text-left transition-colors ${
                tetrisSettings.theme === key
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium mb-2">{theme.name}</div>
              <div className="flex space-x-1">
                {theme.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* 游戏选项 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">游戏选项</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={tetrisSettings.showNext}
              onChange={(e) => updateTetrisSettings({ showNext: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">显示下一个方块</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={tetrisSettings.showGhost}
              onChange={(e) => updateTetrisSettings({ showGhost: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">显示幽灵方块</span>
          </label>
        </div>
      </div>
    </div>
  );
  
  const renderGomokuSettings = () => (
    <div className="space-y-6">
      {/* 棋盘大小 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Grid3X3 className="inline h-4 w-4 mr-1" />
          棋盘大小
        </label>
        <div className="grid grid-cols-2 gap-2">
          {gomokuBoardSizes.map((option) => (
            <button
              key={option.size}
              onClick={() => updateGomokuSettings({ boardSize: option.size as 15 | 19 })}
              className={`p-3 rounded-lg border text-left transition-colors ${
                gomokuSettings.boardSize === option.size
                  ? 'border-gray-500 bg-gray-50 text-gray-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* AI难度 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">AI难度</label>
        <div className="grid grid-cols-1 gap-2">
          {gomokuDifficulties.map((option) => (
            <button
              key={option.level}
              onClick={() => updateGomokuSettings({ aiDifficulty: option.level as 'easy' | 'medium' | 'hard' })}
              className={`p-3 rounded-lg border text-left transition-colors ${
                gomokuSettings.aiDifficulty === option.level
                  ? 'border-gray-500 bg-gray-50 text-gray-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* 游戏规则 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">游戏规则</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={gomokuSettings.forbiddenMoves}
              onChange={(e) => updateGomokuSettings({ forbiddenMoves: e.target.checked })}
              className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
            />
            <span className="ml-2 text-sm text-gray-700">启用禁手规则</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={gomokuSettings.allowUndo}
              onChange={(e) => updateGomokuSettings({ allowUndo: e.target.checked })}
              className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
            />
            <span className="ml-2 text-sm text-gray-700">允许悔棋</span>
          </label>
        </div>
      </div>
    </div>
  );
  
  const getGameTitle = () => {
    switch (game) {
      case 'snake': return '🐍 贪吃蛇设置';
      case 'tetris': return '🧩 俄罗斯方块设置';
      case 'gomoku': return '⚫ 五子棋设置';
      default: return '游戏设置';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{getGameTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {game === 'snake' && renderSnakeSettings()}
          {game === 'tetris' && renderTetrisSettings()}
          {game === 'gomoku' && renderGomokuSettings()}
          
          {/* 通用设置 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">通用设置</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">音效</span>
                <button
                  onClick={() => updateCommonSettings({ soundEnabled: !commonSettings.soundEnabled })}
                  className={`p-2 rounded-lg transition-colors ${
                    commonSettings.soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {commonSettings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={commonSettings.saveStats}
                  onChange={(e) => updateCommonSettings({ saveStats: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">保存游戏统计</span>
              </label>
            </div>
          </div>
          
          {/* 重置统计 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">数据管理</h3>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>重置游戏统计</span>
              </button>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 mb-3">确定要重置这个游戏的所有统计数据吗？此操作不可撤销。</p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleResetStats}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    确认重置
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 底部 */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
