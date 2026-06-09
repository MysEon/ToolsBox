'use client';

import React, { useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Palette, Zap, Grid3X3 } from 'lucide-react';
import { GameType } from '../types';
import { useGameContext } from '../context/GameContext';
import Modal from '@/shared/components/Modal';
import {
  snakeSpeedOptions,
  snakeColorThemes,
  tetrisThemes,
  gomokuBoardSizes,
  gomokuDifficulties,
} from '../data/gameData';

interface GameSettingsProps {
  game: GameType;
  isOpen: boolean;
  onClose: () => void;
}

const btnBase = 'p-3 rounded-lg border text-left transition-colors text-sm';
const btnActive = 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-700/50';
const btnInactive = 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600';

export default function GameSettings({ game, isOpen, onClose }: GameSettingsProps) {
  const {
    snakeSettings, tetrisSettings, gomokuSettings, commonSettings,
    updateSnakeSettings, updateTetrisSettings, updateGomokuSettings,
    updateCommonSettings, resetGameStats,
  } = useGameContext();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetStats = () => {
    resetGameStats(game);
    setShowResetConfirm(false);
  };

  const title =
    game === 'snake' ? '贪吃蛇设置' :
    game === 'tetris' ? '俄罗斯方块设置' : '五子棋设置';

  return (
    <Modal open={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-6">
        {/* Snake settings */}
        {game === 'snake' && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                <Zap className="inline h-4 w-4 mr-1" />游戏速度
              </label>
              <div className="grid grid-cols-2 gap-2">
                {snakeSpeedOptions.map((opt) => (
                  <button key={opt.value} onClick={() => updateSnakeSettings({ speed: opt.value })}
                    className={`${btnBase} ${snakeSettings.speed === opt.value ? btnActive : btnInactive}`}>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{opt.label}</div>
                    <div className="text-xs text-zinc-500">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                <Palette className="inline h-4 w-4 mr-1" />颜色主题
              </label>
              <div className="grid grid-cols-2 gap-2">
                {snakeColorThemes.map((theme) => (
                  <button key={theme.name}
                    onClick={() => updateSnakeSettings({ snakeColor: theme.snake, foodColor: theme.food })}
                    className={`${btnBase} ${snakeSettings.snakeColor === theme.snake ? btnActive : btnInactive}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: theme.snake }} />
                      <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: theme.food }} />
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{theme.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">边界模式</label>
              <div className="grid grid-cols-2 gap-2">
                {(['wall', 'wrap'] as const).map((mode) => (
                  <button key={mode} onClick={() => updateSnakeSettings({ borderMode: mode })}
                    className={`${btnBase} ${snakeSettings.borderMode === mode ? btnActive : btnInactive}`}>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{mode === 'wall' ? '撞墙死亡' : '穿墙模式'}</div>
                    <div className="text-xs text-zinc-500">{mode === 'wall' ? '经典模式' : '可以穿越边界'}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tetris settings */}
        {game === 'tetris' && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                <Zap className="inline h-4 w-4 mr-1" />下落速度: {tetrisSettings.speed}
              </label>
              <input type="range" min="1" max="10" value={tetrisSettings.speed}
                onChange={(e) => updateTetrisSettings({ speed: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-xs text-zinc-400 mt-1"><span>慢</span><span>快</span></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                <Palette className="inline h-4 w-4 mr-1" />颜色主题
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(tetrisThemes).map(([key, theme]) => (
                  <button key={key} onClick={() => updateTetrisSettings({ theme: key })}
                    className={`${btnBase} ${tetrisSettings.theme === key ? btnActive : btnInactive}`}>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1.5">{theme.name}</div>
                    <div className="flex gap-1">
                      {theme.colors.slice(0, 4).map((color, i) => (
                        <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">游戏选项</label>
              {[
                { key: 'showNext', label: '显示下一个方块', checked: tetrisSettings.showNext, fn: (v: boolean) => updateTetrisSettings({ showNext: v }) },
                { key: 'showGhost', label: '显示幽灵方块', checked: tetrisSettings.showGhost, fn: (v: boolean) => updateTetrisSettings({ showGhost: v }) },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={opt.checked} onChange={(e) => opt.fn(e.target.checked)}
                    className="rounded border-zinc-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">{opt.label}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {/* Gomoku settings */}
        {game === 'gomoku' && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                <Grid3X3 className="inline h-4 w-4 mr-1" />棋盘大小
              </label>
              <div className="grid grid-cols-2 gap-2">
                {gomokuBoardSizes.map((opt) => (
                  <button key={opt.size} onClick={() => updateGomokuSettings({ boardSize: opt.size as 15 | 19 })}
                    className={`${btnBase} ${gomokuSettings.boardSize === opt.size ? btnActive : btnInactive}`}>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{opt.label}</div>
                    <div className="text-xs text-zinc-500">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">AI难度</label>
              <div className="grid grid-cols-1 gap-2">
                {gomokuDifficulties.map((opt) => (
                  <button key={opt.level}
                    onClick={() => updateGomokuSettings({ aiDifficulty: opt.level as 'easy' | 'medium' | 'hard' })}
                    className={`${btnBase} ${gomokuSettings.aiDifficulty === opt.level ? btnActive : btnInactive}`}>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{opt.label}</div>
                    <div className="text-xs text-zinc-500">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">游戏规则</label>
              {[
                { key: 'forbiddenMoves', label: '启用禁手规则', checked: gomokuSettings.forbiddenMoves, fn: (v: boolean) => updateGomokuSettings({ forbiddenMoves: v }) },
                { key: 'allowUndo', label: '允许悔棋', checked: gomokuSettings.allowUndo, fn: (v: boolean) => updateGomokuSettings({ allowUndo: v }) },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={opt.checked} onChange={(e) => opt.fn(e.target.checked)}
                    className="rounded border-zinc-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">{opt.label}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {/* Common settings */}
        <div className="pt-5 border-t border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">通用设置</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">音效</span>
              <button onClick={() => updateCommonSettings({ soundEnabled: !commonSettings.soundEnabled })}
                className={`p-2 rounded-lg transition-colors ${commonSettings.soundEnabled ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-400'}`}>
                {commonSettings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={commonSettings.saveStats}
                onChange={(e) => updateCommonSettings({ saveStats: e.target.checked })}
                className="rounded border-zinc-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">保存游戏统计</span>
            </label>
          </div>
        </div>

        {/* Reset */}
        <div className="pt-5 border-t border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">数据管理</h3>
          {!showResetConfirm ? (
            <button onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm">
              <RotateCcw className="h-4 w-4" />重置游戏统计
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm mb-3">确定要重置这个游戏的所有统计数据吗？此操作不可撤销。</p>
              <div className="flex gap-2">
                <button onClick={handleResetStats} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">确认重置</button>
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-500 transition-colors text-sm">取消</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
