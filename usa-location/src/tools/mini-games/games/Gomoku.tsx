'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Home, Settings, Undo } from 'lucide-react';
import { GomokuGameState } from '../types';
import { useGameContext } from '../context/GameContext';
import { gomokuUtils, gameUtils } from '../utils/gameUtils';

interface GomokuProps {
  onBack: () => void;
  onSettings: () => void;
}

export default function Gomoku({ onBack, onSettings }: GomokuProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gomokuSettings, gomokuStats, updateGameStats } = useGameContext();
  
  const [gameState, setGameState] = useState<GomokuGameState>({
    board: Array(gomokuSettings.boardSize).fill(null).map(() => Array(gomokuSettings.boardSize).fill(null)),
    currentPlayer: 'black',
    winner: null,
    lastMove: null,
    moveHistory: [],
    status: 'idle'
  });
  
  const [gameTime, setGameTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [isThinking, setIsThinking] = useState(false);
  
  const CELL_SIZE = Math.min(400 / gomokuSettings.boardSize, 25);
  const CANVAS_SIZE = gomokuSettings.boardSize * CELL_SIZE;
  
  // 初始化游戏
  const initGame = useCallback(() => {
    setGameState({
      board: Array(gomokuSettings.boardSize).fill(null).map(() => Array(gomokuSettings.boardSize).fill(null)),
      currentPlayer: gomokuSettings.playerColor,
      winner: null,
      lastMove: null,
      moveHistory: [],
      status: 'idle'
    });
    setGameTime(0);
    setGameStartTime(Date.now());
  }, [gomokuSettings.boardSize, gomokuSettings.playerColor]);
  
  // AI移动
  const makeAIMove = useCallback(() => {
    setIsThinking(true);

    setTimeout(() => {
      setGameState(prev => {
        if (prev.status !== 'playing' || prev.winner) return prev;

        const aiPlayer = gomokuSettings.playerColor === 'black' ? 'white' : 'black';
        const move = gomokuUtils.findBestMove(prev.board, aiPlayer, gomokuSettings.aiDifficulty);

        if (!move) return prev;

        const newBoard = prev.board.map(row => [...row]);
        newBoard[move.row][move.col] = aiPlayer;

        const winner = gomokuUtils.checkWin(newBoard, move.row, move.col, aiPlayer) ? aiPlayer : null;

        return {
          ...prev,
          board: newBoard,
          currentPlayer: gomokuSettings.playerColor,
          winner,
          lastMove: move,
          moveHistory: [...prev.moveHistory, move],
          status: winner ? 'game-over' : 'playing'
        };
      });
      setIsThinking(false);
    }, 500 + Math.random() * 1000); // 模拟AI思考时间
  }, [gomokuSettings]);

  // 开始游戏
  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
    setGameStartTime(Date.now());

    // 如果玩家选择白棋，AI先手
    if (gomokuSettings.playerColor === 'white') {
      setTimeout(() => {
        makeAIMove();
      }, 500);
    }
  }, [gomokuSettings.playerColor, makeAIMove]);
  
  // 重新开始游戏
  const restartGame = useCallback(() => {
    if (gameState.status !== 'idle' && gameState.moveHistory.length > 0) {
      const newStats = {
        gamesPlayed: gomokuStats.gamesPlayed + 1,
        totalScore: gomokuStats.totalScore + (gameState.winner === gomokuSettings.playerColor ? 100 : 0),
        bestScore: Math.max(gomokuStats.bestScore, gameState.winner === gomokuSettings.playerColor ? 100 : 0),
        totalTime: gomokuStats.totalTime + Math.floor(gameTime / 1000)
      };
      updateGameStats('gomoku', newStats);
    }
    initGame();
  }, [gameState, gameTime, gomokuStats, updateGameStats, initGame, gomokuSettings.playerColor]);
  

  
  // 玩家移动
  const makePlayerMove = useCallback((row: number, col: number) => {
    if (gameState.status === 'idle') {
      startGame();
    }
    
    if (gameState.status !== 'playing' || gameState.board[row][col] !== null || isThinking) {
      return;
    }
    
    setGameState(prev => {
      const newBoard = prev.board.map(row => [...row]);
      newBoard[row][col] = gomokuSettings.playerColor;
      
      const winner = gomokuUtils.checkWin(newBoard, row, col, gomokuSettings.playerColor) ? gomokuSettings.playerColor : null;
      const move = { row, col };
      
      return {
        ...prev,
        board: newBoard,
        currentPlayer: gomokuSettings.playerColor === 'black' ? 'white' : 'black',
        winner,
        lastMove: move,
        moveHistory: [...prev.moveHistory, move],
        status: winner ? 'game-over' : 'playing'
      };
    });
    
    // AI回合
    if (!gameState.winner) {
      setTimeout(() => {
        makeAIMove();
      }, 300);
    }
  }, [gameState, gomokuSettings, isThinking, startGame, makeAIMove]);
  
  // 悔棋
  const undoMove = useCallback(() => {
    if (!gomokuSettings.allowUndo || gameState.moveHistory.length < 2) return;
    
    setGameState(prev => {
      const newHistory = prev.moveHistory.slice(0, -2); // 撤销玩家和AI的最后一步
      const newBoard = Array(gomokuSettings.boardSize).fill(null).map(() => Array(gomokuSettings.boardSize).fill(null));
      
      // 重新放置棋子
      newHistory.forEach((move, index) => {
        const player = index % 2 === 0 ? 'black' : 'white';
        newBoard[move.row][move.col] = player;
      });
      
      return {
        ...prev,
        board: newBoard,
        currentPlayer: gomokuSettings.playerColor,
        winner: null,
        lastMove: newHistory.length > 0 ? newHistory[newHistory.length - 1] : null,
        moveHistory: newHistory,
        status: 'playing'
      };
    });
  }, [gameState.moveHistory, gomokuSettings]);
  
  // 处理画布点击
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    
    if (row >= 0 && row < gomokuSettings.boardSize && col >= 0 && col < gomokuSettings.boardSize) {
      makePlayerMove(row, col);
    }
  }, [CELL_SIZE, gomokuSettings.boardSize, makePlayerMove]);
  
  // 渲染棋盘
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 清空画布
    ctx.fillStyle = '#D2B48C'; // 棋盘颜色
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制网格线
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < gomokuSettings.boardSize; i++) {
      // 垂直线
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2);
      ctx.lineTo(i * CELL_SIZE + CELL_SIZE / 2, CANVAS_SIZE - CELL_SIZE / 2);
      ctx.stroke();
      
      // 水平线
      ctx.beginPath();
      ctx.moveTo(CELL_SIZE / 2, i * CELL_SIZE + CELL_SIZE / 2);
      ctx.lineTo(CANVAS_SIZE - CELL_SIZE / 2, i * CELL_SIZE + CELL_SIZE / 2);
      ctx.stroke();
    }
    
    // 绘制星位（如果是19x19棋盘）
    if (gomokuSettings.boardSize === 19) {
      const starPoints = [
        [3, 3], [3, 9], [3, 15],
        [9, 3], [9, 9], [9, 15],
        [15, 3], [15, 9], [15, 15]
      ];
      
      ctx.fillStyle = '#8B4513';
      starPoints.forEach(([row, col]) => {
        ctx.beginPath();
        ctx.arc(
          col * CELL_SIZE + CELL_SIZE / 2,
          row * CELL_SIZE + CELL_SIZE / 2,
          3,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });
    }
    
    // 绘制棋子
    gameState.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const x = colIndex * CELL_SIZE + CELL_SIZE / 2;
          const y = rowIndex * CELL_SIZE + CELL_SIZE / 2;
          const radius = CELL_SIZE * 0.4;
          
          // 棋子阴影
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.arc(x + 2, y + 2, radius, 0, 2 * Math.PI);
          ctx.fill();
          
          // 棋子
          ctx.fillStyle = cell === 'black' ? '#000000' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fill();
          
          // 棋子边框
          ctx.strokeStyle = cell === 'black' ? '#333333' : '#CCCCCC';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // 高亮最后一步
          if (gameState.lastMove && gameState.lastMove.row === rowIndex && gameState.lastMove.col === colIndex) {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, radius + 2, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }
      });
    });
  }, [gameState.board, gameState.lastMove, gomokuSettings.boardSize, CELL_SIZE, CANVAS_SIZE]);
  
  // 更新游戏时间
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.status === 'playing') {
      interval = setInterval(() => {
        setGameTime(Date.now() - gameStartTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.status, gameStartTime]);
  
  // 初始化
  useEffect(() => {
    initGame();
  }, [initGame]);
  
  const getStatusText = () => {
    if (gameState.status === 'idle') return '点击棋盘开始游戏';
    if (gameState.winner) {
      if (gameState.winner === gomokuSettings.playerColor) {
        return '🎉 恭喜你获胜！';
      } else {
        return '😔 AI获胜，再试一次！';
      }
    }
    if (isThinking) return '🤔 AI正在思考...';
    return gameState.currentPlayer === gomokuSettings.playerColor ? '轮到你下棋' : 'AI回合';
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>返回</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">⚫ 五子棋</h1>
        </div>
        <button
          onClick={onSettings}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>设置</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 游戏区域 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* 游戏状态 */}
            <div className="text-center mb-4">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {getStatusText()}
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-black rounded-full border"></div>
                  <span>黑棋</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white rounded-full border border-gray-400"></div>
                  <span>白棋</span>
                </div>
                <div className="text-gray-400">|</div>
                <div>你是: {gomokuSettings.playerColor === 'black' ? '黑棋' : '白棋'}</div>
              </div>
            </div>
            
            {/* 棋盘 */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                onClick={handleCanvasClick}
                className="border border-gray-300 rounded-lg cursor-pointer"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            
            {/* 控制按钮 */}
            <div className="flex justify-center space-x-4 mt-4">
              {gomokuSettings.allowUndo && gameState.moveHistory.length >= 2 && gameState.status === 'playing' && (
                <button
                  onClick={undoMove}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Undo className="h-4 w-4" />
                  <span>悔棋</span>
                </button>
              )}
              <button
                onClick={restartGame}
                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>重新开始</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* 信息面板 */}
        <div className="space-y-6">
          {/* 游戏信息 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">游戏信息</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">棋盘大小:</span>
                <span className="font-bold">{gomokuSettings.boardSize}×{gomokuSettings.boardSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AI难度:</span>
                <span className="font-bold capitalize">{gomokuSettings.aiDifficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">已下步数:</span>
                <span className="font-bold">{gameState.moveHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">游戏时间:</span>
                <span className="font-mono">{gameUtils.formatTime(Math.floor(gameTime / 1000))}</span>
              </div>
            </div>
          </div>
          
          {/* 统计信息 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">历史记录</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">胜利次数:</span>
                <span className="font-bold text-green-600">{Math.floor(gomokuStats.totalScore / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">游戏次数:</span>
                <span className="font-bold">{gomokuStats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">胜率:</span>
                <span className="font-bold">
                  {gomokuStats.gamesPlayed > 0 
                    ? `${Math.round((gomokuStats.totalScore / 100 / gomokuStats.gamesPlayed) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总游戏时间:</span>
                <span className="font-mono">{gameUtils.formatTime(gomokuStats.totalTime)}</span>
              </div>
            </div>
          </div>
          
          {/* 游戏规则 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">游戏规则</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• 率先连成五子者获胜</div>
              <div>• 可横、竖、斜连成五子</div>
              <div>• 点击棋盘空位下棋</div>
              {gomokuSettings.allowUndo && <div>• 可以悔棋撤销上一步</div>}
              {gomokuSettings.forbiddenMoves && <div>• 启用了禁手规则</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
