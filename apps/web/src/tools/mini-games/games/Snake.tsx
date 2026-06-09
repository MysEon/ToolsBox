'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Home, Settings } from 'lucide-react';
import { SnakeGameState, SnakePosition } from '../types';
import { useGameContext } from '../context/GameContext';
import { snakeUtils, gameUtils } from '../utils/gameUtils';

interface SnakeProps {
  onBack: () => void;
  onSettings: () => void;
}

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

export default function Snake({ onBack, onSettings }: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  
  const { snakeSettings, snakeStats, updateGameStats } = useGameContext();
  
  const [gameState, setGameState] = useState<SnakeGameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'right',
    score: 0,
    status: 'idle'
  });
  
  const [gameTime, setGameTime] = useState(0);
  const gameStartTimeRef = useRef<number>(0);
  
  // 初始化游戏
  const initGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    const food = snakeUtils.generateFood(initialSnake, GRID_SIZE);
    
    setGameState({
      snake: initialSnake,
      food,
      direction: 'right',
      score: 0,
      status: 'idle'
    });
    setGameTime(0);
  }, []);
  
  // 开始游戏
  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
    gameStartTimeRef.current = Date.now();
  }, []);
  
  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'playing' ? 'paused' : 'playing'
    }));
  }, []);
  
  // 重新开始游戏
  const restartGame = useCallback(() => {
    if (gameState.status === 'game-over' && gameState.score > 0) {
      // 更新统计数据
      const newStats = {
        gamesPlayed: snakeStats.gamesPlayed + 1,
        totalScore: snakeStats.totalScore + gameState.score,
        bestScore: Math.max(snakeStats.bestScore, gameState.score),
        totalTime: snakeStats.totalTime + Math.floor(gameTime / 1000)
      };
      updateGameStats('snake', newStats);
    }
    initGame();
  }, [gameState, gameTime, snakeStats, updateGameStats, initGame]);
  
  // 移动蛇
  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'playing') return prev;
      
      const head = prev.snake[0];
      let newHead: SnakePosition;
      
      switch (prev.direction) {
        case 'up':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'down':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'left':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'right':
          newHead = { x: head.x + 1, y: head.y };
          break;
        default:
          return prev;
      }
      
      // 处理边界
      if (snakeSettings.borderMode === 'wrap') {
        newHead = snakeUtils.wrapPosition(newHead, GRID_SIZE);
      } else if (snakeUtils.checkWallCollision(newHead, GRID_SIZE)) {
        return { ...prev, status: 'game-over' };
      }
      
      // 检查自撞
      if (snakeUtils.checkSelfCollision(newHead, prev.snake)) {
        return { ...prev, status: 'game-over' };
      }
      
      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;
      
      // 检查是否吃到食物
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newFood = snakeUtils.generateFood(newSnake, GRID_SIZE);
        newScore += 10;
      } else {
        newSnake.pop(); // 移除尾部
      }
      
      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore
      };
    });
  }, [snakeSettings.borderMode]);
  
  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.status === 'idle') {
        startGame();
        return;
      }
      
      if (gameState.status !== 'playing') return;
      
      const { controls } = snakeSettings;
      let newDirection = gameState.direction;
      
      switch (e.code) {
        case controls.up:
          if (gameState.direction !== 'down') newDirection = 'up';
          break;
        case controls.down:
          if (gameState.direction !== 'up') newDirection = 'down';
          break;
        case controls.left:
          if (gameState.direction !== 'right') newDirection = 'left';
          break;
        case controls.right:
          if (gameState.direction !== 'left') newDirection = 'right';
          break;
        case 'Space':
          e.preventDefault();
          togglePause();
          return;
      }
      
      if (newDirection !== gameState.direction) {
        setGameState(prev => ({ ...prev, direction: newDirection }));
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, snakeSettings, startGame, togglePause]);
  
  // 游戏循环
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      if (currentTime - lastTimeRef.current >= snakeSettings.speed) {
        moveSnake();
        lastTimeRef.current = currentTime;
      }
      
      if (gameState.status === 'playing') {
        setGameTime(Date.now() - gameStartTimeRef.current);
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };
    
    if (gameState.status === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.status, snakeSettings.speed, moveSnake]);
  
  // 渲染游戏
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 清空画布
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制网格
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
    
    // 绘制蛇
    ctx.fillStyle = snakeSettings.snakeColor;
    gameState.snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;
      
      if (index === 0) {
        // 蛇头
        ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        // 眼睛
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 4, y + 4, 3, 3);
        ctx.fillRect(x + CELL_SIZE - 7, y + 4, 3, 3);
        ctx.fillStyle = snakeSettings.snakeColor;
      } else {
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      }
    });
    
    // 绘制食物
    ctx.fillStyle = snakeSettings.foodColor;
    const foodX = gameState.food.x * CELL_SIZE;
    const foodY = gameState.food.y * CELL_SIZE;
    ctx.beginPath();
    ctx.arc(
      foodX + CELL_SIZE / 2,
      foodY + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [gameState, snakeSettings]);
  
  // 初始化
  useEffect(() => {
    initGame();
  }, [initGame]);
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>返回</span>
          </button>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">贪吃蛇</h1>
        </div>
        <button
          onClick={onSettings}
          className="flex items-center space-x-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>设置</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 游戏区域 */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="border border-gray-300 rounded-lg mx-auto block"
              />
              
              {/* 游戏状态覆盖层 */}
              {gameState.status !== 'playing' && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    {gameState.status === 'idle' && (
                      <div>
                        <h3 className="text-xl font-bold mb-2">准备开始</h3>
                        <p className="mb-4">按任意方向键开始游戏</p>
                        <button
                          onClick={startGame}
                          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-2 rounded-lg transition-colors"
                        >
                          开始游戏
                        </button>
                      </div>
                    )}
                    {gameState.status === 'paused' && (
                      <div>
                        <h3 className="text-xl font-bold mb-2">游戏暂停</h3>
                        <button
                          onClick={togglePause}
                          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-2 rounded-lg transition-colors"
                        >
                          继续游戏
                        </button>
                      </div>
                    )}
                    {gameState.status === 'game-over' && (
                      <div>
                        <h3 className="text-xl font-bold mb-2">游戏结束</h3>
                        <p className="mb-4">得分: {gameState.score}</p>
                        <button
                          onClick={restartGame}
                          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-2 rounded-lg transition-colors"
                        >
                          重新开始
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* 控制按钮 */}
            <div className="flex justify-center space-x-4 mt-4">
              {gameState.status === 'idle' && (
                <button
                  onClick={startGame}
                  className="flex items-center space-x-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <Play className="h-4 w-4" />
                  <span>开始</span>
                </button>
              )}
              {gameState.status === 'playing' && (
                <button
                  onClick={togglePause}
                  className="flex items-center space-x-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <Pause className="h-4 w-4" />
                  <span>暂停</span>
                </button>
              )}
              {gameState.status === 'paused' && (
                <button
                  onClick={togglePause}
                  className="flex items-center space-x-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <Play className="h-4 w-4" />
                  <span>继续</span>
                </button>
              )}
              <button
                onClick={restartGame}
                className="flex items-center space-x-2 bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-500 px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>重新开始</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* 信息面板 */}
        <div className="space-y-6">
          {/* 当前分数 */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">游戏信息</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">当前分数:</span>
                <span className="font-bold text-green-500">{gameUtils.formatScore(gameState.score)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">游戏时间:</span>
                <span className="font-mono">{gameUtils.formatTime(Math.floor(gameTime / 1000))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">蛇身长度:</span>
                <span className="font-bold">{gameState.snake.length}</span>
              </div>
            </div>
          </div>
          
          {/* 统计信息 */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">历史记录</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">最高分:</span>
                <span className="font-bold text-amber-500">{gameUtils.formatScore(snakeStats.bestScore)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">游戏次数:</span>
                <span className="font-bold">{snakeStats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">总游戏时间:</span>
                <span className="font-mono">{gameUtils.formatTime(snakeStats.totalTime)}</span>
              </div>
            </div>
          </div>
          
          {/* 操作说明 */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">操作说明</h3>
            <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <div>• 方向键控制蛇的移动</div>
              <div>• 空格键暂停/继续游戏</div>
              <div>• 吃到食物获得分数</div>
              <div>• 避免撞到自己或边界</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
