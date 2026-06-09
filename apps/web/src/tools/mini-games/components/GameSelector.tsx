'use client';

import React from 'react';
import { Play, Settings, Trophy } from 'lucide-react';
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
      case 'snake': return snakeStats;
      case 'tetris': return tetrisStats;
      case 'gomoku': return gomokuStats;
      default: return { gamesPlayed: 0, totalScore: 0, bestScore: 0, totalTime: 0 };
    }
  };

  const games: GameType[] = ['snake', 'tetris', 'gomoku'];

  return (
    <div className="space-y-8">
      {/* Game cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {games.map((game) => {
          const info = gameInfo[game];
          const stats = getGameStats(game);

          return (
            <div
              key={game}
              className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md transition-all duration-200"
            >
              {/* Card header */}
              <div className="p-5 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-r ${info.color} text-white`}>
                    <span className="text-xl">{info.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{info.name}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{info.difficulty} · {info.players}</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{info.description}</p>
              </div>

              {/* Stats */}
              <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-700/50">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-zinc-400 mb-0.5">最高分</div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{gameUtils.formatScore(stats.bestScore)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 mb-0.5">游戏次数</div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{stats.gamesPlayed}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => onGameSelect(game)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium"
                >
                  <Play className="h-4 w-4" />
                  开始游戏
                </button>
                <button
                  onClick={() => onSettingsOpen(game)}
                  className="px-3 py-2.5 border border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  title="游戏设置"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Settings className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">个性化设置</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">每个游戏支持丰富的自定义选项</p>
        </div>
        <div className="text-center p-5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">成绩记录</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">自动保存游戏记录和最高分数</p>
        </div>
        <div className="text-center p-5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Play className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">即点即玩</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">无需安装，打开浏览器即可畅玩</p>
        </div>
      </div>
    </div>
  );
}
