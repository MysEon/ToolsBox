'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Home, Settings } from 'lucide-react';
import { TetrisGameState, TetrisPiece } from '../types';
import { useGameContext } from '../context/GameContext';
import { tetrisUtils, gameUtils } from '../utils/gameUtils';
import { tetrisShapes, tetrisThemes } from '../data/gameData';

interface TetrisProps {
  onBack: () => void;
  onSettings: () => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 20;

export default function Tetris({ onBack, onSettings }: TetrisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  
  const { tetrisSettings, tetrisStats, updateGameStats } = useGameContext();
  
  const [gameState, setGameState] = useState<TetrisGameState>({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 1,
    status: 'idle'
  });
  
  const [gameTime, setGameTime] = useState(0);
  const gameStartTimeRef = useRef<number>(0);
  
  // 创建新方块
  const createPiece = useCallback((): TetrisPiece => {
    const shapeIndex = Math.floor(Math.random() * tetrisShapes.length);
    const shape = tetrisShapes[shapeIndex];
    const colors = tetrisThemes[tetrisSettings.theme as keyof typeof tetrisThemes]?.colors || tetrisThemes.classic.colors;
    const color = colors[shapeIndex % colors.length];
    
    return {
      shape,
      color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2),
      y: 0
    };
  }, [tetrisSettings.theme]);
  
  // 初始化游戏
  const initGame = useCallback(() => {
    const board = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
    const currentPiece = createPiece();
    const nextPiece = createPiece();
    
    setGameState({
      board,
      currentPiece,
      nextPiece,
      score: 0,
      lines: 0,
      level: 1,
      status: 'idle'
    });
    setGameTime(0);
  }, [createPiece]);
  
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
      const newStats = {
        gamesPlayed: tetrisStats.gamesPlayed + 1,
        totalScore: tetrisStats.totalScore + gameState.score,
        bestScore: Math.max(tetrisStats.bestScore, gameState.score),
        totalTime: tetrisStats.totalTime + Math.floor(gameTime / 1000)
      };
      updateGameStats('tetris', newStats);
    }
    initGame();
  }, [gameState, gameTime, tetrisStats, updateGameStats, initGame]);
  
  // 放置方块到棋盘
  const placePiece = useCallback((piece: TetrisPiece, board: (string | null)[][]) => {
    const newBoard = board.map(row => [...row]);
    
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      });
    });
    
    return newBoard;
  }, []);
  
  // 移动方块
  const movePiece = useCallback((dx: number, dy: number, rotate: boolean = false) => {
    setGameState(prev => {
      if (prev.status !== 'playing' || !prev.currentPiece) return prev;
      
      let piece = prev.currentPiece;
      
      if (rotate) {
        piece = {
          ...piece,
          shape: tetrisUtils.rotateShape(piece.shape)
        };
      }
      
      const newPiece = {
        ...piece,
        x: piece.x + dx,
        y: piece.y + dy
      };
      
      if (tetrisUtils.canPlacePiece(prev.board, newPiece.shape, newPiece.x, newPiece.y)) {
        return { ...prev, currentPiece: newPiece };
      }
      
      // 如果不能移动且是向下移动，则放置方块
      if (dy > 0 && !rotate) {
        const newBoard = placePiece(prev.currentPiece, prev.board);
        const { newBoard: clearedBoard, linesCleared } = tetrisUtils.clearLines(newBoard);
        
        const newScore = prev.score + tetrisUtils.calculateScore(linesCleared, prev.level);
        const newLines = prev.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        
        const nextPiece = createPiece();
        
        // 检查游戏是否结束
        if (!tetrisUtils.canPlacePiece(clearedBoard, prev.nextPiece!.shape, prev.nextPiece!.x, prev.nextPiece!.y)) {
          return {
            ...prev,
            board: clearedBoard,
            score: newScore,
            lines: newLines,
            level: newLevel,
            status: 'game-over'
          };
        }
        
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: prev.nextPiece,
          nextPiece: nextPiece,
          score: newScore,
          lines: newLines,
          level: newLevel
        };
      }
      
      return prev;
    });
  }, [placePiece, createPiece]);
  
  // 硬降落
  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'playing' || !prev.currentPiece) return prev;
      
      let dropY = 0;
      while (tetrisUtils.canPlacePiece(prev.board, prev.currentPiece.shape, prev.currentPiece.x, prev.currentPiece.y + dropY + 1)) {
        dropY++;
      }
      
      const droppedPiece = {
        ...prev.currentPiece,
        y: prev.currentPiece.y + dropY
      };
      
      const newBoard = placePiece(droppedPiece, prev.board);
      const { newBoard: clearedBoard, linesCleared } = tetrisUtils.clearLines(newBoard);
      
      const newScore = prev.score + tetrisUtils.calculateScore(linesCleared, prev.level) + dropY * 2;
      const newLines = prev.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      
      const nextPiece = createPiece();
      
      if (!tetrisUtils.canPlacePiece(clearedBoard, prev.nextPiece!.shape, prev.nextPiece!.x, prev.nextPiece!.y)) {
        return {
          ...prev,
          board: clearedBoard,
          score: newScore,
          lines: newLines,
          level: newLevel,
          status: 'game-over'
        };
      }
      
      return {
        ...prev,
        board: clearedBoard,
        currentPiece: prev.nextPiece,
        nextPiece: nextPiece,
        score: newScore,
        lines: newLines,
        level: newLevel
      };
    });
  }, [placePiece, createPiece]);
  
  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.status === 'idle') {
        startGame();
        return;
      }
      
      if (gameState.status !== 'playing') return;
      
      const { controls } = tetrisSettings;
      
      switch (e.code) {
        case controls.left:
          movePiece(-1, 0);
          break;
        case controls.right:
          movePiece(1, 0);
          break;
        case controls.down:
          movePiece(0, 1);
          break;
        case controls.rotate:
          movePiece(0, 0, true);
          break;
        case controls.drop:
          e.preventDefault();
          hardDrop();
          break;
        case 'Space':
          e.preventDefault();
          togglePause();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, tetrisSettings, startGame, togglePause, movePiece, hardDrop]);
  
  // 游戏循环
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      const speed = Math.max(50, 500 - (tetrisSettings.speed - 1) * 50);
      
      if (currentTime - lastTimeRef.current >= speed) {
        movePiece(0, 1);
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
  }, [gameState.status, tetrisSettings.speed, movePiece]);
  
  // 渲染主棋盘
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = BOARD_WIDTH * CELL_SIZE;
    const height = BOARD_HEIGHT * CELL_SIZE;
    
    // 清空画布
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制棋盘
    gameState.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillStyle = cell;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      });
    });
    
    // 绘制当前方块
    if (gameState.currentPiece) {
      ctx.fillStyle = gameState.currentPiece.color;
      gameState.currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const drawX = (gameState.currentPiece!.x + x) * CELL_SIZE;
            const drawY = (gameState.currentPiece!.y + y) * CELL_SIZE;
            ctx.fillRect(drawX, drawY, CELL_SIZE - 1, CELL_SIZE - 1);
          }
        });
      });
    }
    
    // 绘制幽灵方块
    if (tetrisSettings.showGhost && gameState.currentPiece) {
      let ghostY = 0;
      while (tetrisUtils.canPlacePiece(gameState.board, gameState.currentPiece.shape, gameState.currentPiece.x, gameState.currentPiece.y + ghostY + 1)) {
        ghostY++;
      }
      
      if (ghostY > 0) {
        ctx.fillStyle = gameState.currentPiece.color + '40'; // 透明度
        gameState.currentPiece.shape.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell) {
              const drawX = (gameState.currentPiece!.x + x) * CELL_SIZE;
              const drawY = (gameState.currentPiece!.y + y + ghostY) * CELL_SIZE;
              ctx.fillRect(drawX, drawY, CELL_SIZE - 1, CELL_SIZE - 1);
            }
          });
        });
      }
    }
    
    // 绘制网格
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, height);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(width, y * CELL_SIZE);
      ctx.stroke();
    }
  }, [gameState, tetrisSettings.showGhost]);
  
  // 渲染下一个方块
  useEffect(() => {
    const canvas = nextCanvasRef.current;
    if (!canvas || !gameState.nextPiece) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = 80;
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, size, size);
    
    const piece = gameState.nextPiece;
    const cellSize = 16;
    const offsetX = (size - piece.shape[0].length * cellSize) / 2;
    const offsetY = (size - piece.shape.length * cellSize) / 2;
    
    ctx.fillStyle = piece.color;
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillRect(
            offsetX + x * cellSize,
            offsetY + y * cellSize,
            cellSize - 1,
            cellSize - 1
          );
        }
      });
    });
  }, [gameState.nextPiece]);
  
  // 初始化
  useEffect(() => {
    initGame();
  }, [initGame]);
  
  return (
    <div className="max-w-6xl mx-auto">
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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">俄罗斯方块</h1>
        </div>
        <button
          onClick={onSettings}
          className="flex items-center space-x-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>设置</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 游戏区域 */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={BOARD_WIDTH * CELL_SIZE}
                height={BOARD_HEIGHT * CELL_SIZE}
                className="border border-gray-300 rounded-lg mx-auto block"
              />
              
              {/* 游戏状态覆盖层 */}
              {gameState.status !== 'playing' && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    {gameState.status === 'idle' && (
                      <div>
                        <h3 className="text-xl font-bold mb-2">准备开始</h3>
                        <p className="mb-4">按任意键开始游戏</p>
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
        <div className="lg:col-span-2 space-y-6">
          {/* 下一个方块 */}
          {tetrisSettings.showNext && (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">下一个方块</h3>
              <div className="flex justify-center">
                <canvas
                  ref={nextCanvasRef}
                  width={80}
                  height={80}
                  className="border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}
          
          {/* 游戏信息 */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">游戏信息</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">分数:</span>
                <span className="font-bold text-blue-600">{gameUtils.formatScore(gameState.score)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">消除行数:</span>
                <span className="font-bold">{gameState.lines}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">等级:</span>
                <span className="font-bold">{gameState.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">游戏时间:</span>
                <span className="font-mono">{gameUtils.formatTime(Math.floor(gameTime / 1000))}</span>
              </div>
            </div>
          </div>
          
          {/* 统计信息 */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">历史记录</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">最高分:</span>
                <span className="font-bold text-amber-500">{gameUtils.formatScore(tetrisStats.bestScore)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">游戏次数:</span>
                <span className="font-bold">{tetrisStats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">总游戏时间:</span>
                <span className="font-mono">{gameUtils.formatTime(tetrisStats.totalTime)}</span>
              </div>
            </div>
          </div>
          
          {/* 操作说明 */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">操作说明</h3>
            <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <div>• ←→ 左右移动方块</div>
              <div>• ↓ 加速下落</div>
              <div>• ↑ 旋转方块</div>
              <div>• 空格 硬降落</div>
              <div>• 消除完整行获得分数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
