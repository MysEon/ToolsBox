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

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

export default function Gomoku({ onBack, onSettings }: GomokuProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const { gomokuSettings, gomokuStats, updateGameStats } = useGameContext();

  const [gameState, setGameState] = useState<GomokuGameState>({
    board: Array(gomokuSettings.boardSize).fill(null).map(() => Array(gomokuSettings.boardSize).fill(null)),
    currentPlayer: 'black',
    winner: null,
    lastMove: null,
    moveHistory: [],
    status: 'idle',
  });

  const [gameTime, setGameTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [isThinking, setIsThinking] = useState(false);
  const [showResult, setShowResult] = useState<'win' | 'lose' | null>(null);

  const CELL_SIZE = Math.min(400 / gomokuSettings.boardSize, 25);
  const PADDING = CELL_SIZE * 0.8;
  const CANVAS_SIZE = gomokuSettings.boardSize * CELL_SIZE + PADDING * 2;

  // Particle effects
  const spawnParticles = useCallback((cx: number, cy: number, count: number) => {
    const colors = ['#f43f5e', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 3,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 5,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    if (!showResult) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Redraw board + stones
      drawBoard(ctx);

      // Draw & update particles
      const particles = particlesRef.current;
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.008;
        if (p.life <= 0) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (alive) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [showResult, gameState]);

  // Draw clean flat board
  const drawBoard = useCallback((ctx: CanvasRenderingContext2D) => {
    const bs = gomokuSettings.boardSize;
    const total = bs * CELL_SIZE + PADDING * 2;

    // Board background
    ctx.fillStyle = '#dcb35c';
    ctx.fillRect(0, 0, total, total);

    // Grid lines
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 1;
    for (let i = 0; i < bs; i++) {
      const pos = PADDING + i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(PADDING, pos);
      ctx.lineTo(PADDING + (bs - 1) * CELL_SIZE, pos);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos, PADDING);
      ctx.lineTo(pos, PADDING + (bs - 1) * CELL_SIZE);
      ctx.stroke();
    }

    // Star points
    if (bs === 19 || bs === 15) {
      const stars = bs === 19
        ? [[3,3],[3,9],[3,15],[9,3],[9,9],[9,15],[15,3],[15,9],[15,15]]
        : [[3,3],[3,7],[3,11],[7,3],[7,7],[7,11],[11,3],[11,7],[11,11]];
      ctx.fillStyle = '#8b6914';
      for (const [r, c] of stars) {
        ctx.beginPath();
        ctx.arc(PADDING + c * CELL_SIZE, PADDING + r * CELL_SIZE, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Stones
    const radius = CELL_SIZE * 0.43;
    gameState.board.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (!cell) return;
        const sx = PADDING + ci * CELL_SIZE;
        const sy = PADDING + ri * CELL_SIZE;

        // Stone
        ctx.fillStyle = cell === 'black' ? '#1a1a1a' : '#f5f5f5';
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = cell === 'black' ? '#000' : '#ccc';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Last move marker
        if (gameState.lastMove && gameState.lastMove.row === ri && gameState.lastMove.col === ci) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx, sy, radius * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
  }, [gameState, gomokuSettings.boardSize, CELL_SIZE, PADDING]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBoard(ctx);
  }, [gameState, drawBoard]);

  const initGame = useCallback(() => {
    setGameState({
      board: Array(gomokuSettings.boardSize).fill(null).map(() => Array(gomokuSettings.boardSize).fill(null)),
      currentPlayer: 'black',
      winner: null,
      lastMove: null,
      moveHistory: [],
      status: 'idle',
    });
    setGameTime(0);
    setGameStartTime(Date.now());
    setShowResult(null);
    particlesRef.current = [];
  }, [gomokuSettings.boardSize]);

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
        if (winner) {
          const isWin = winner === gomokuSettings.playerColor;
          setShowResult(isWin ? 'win' : 'lose');
          // Spawn particles at winning move position
          const sx = PADDING + move.col * CELL_SIZE;
          const sy = PADDING + move.row * CELL_SIZE;
          spawnParticles(sx, sy, 80);
        }
        return { ...prev, board: newBoard, currentPlayer: gomokuSettings.playerColor, winner, lastMove: move, moveHistory: [...prev.moveHistory, move], status: winner ? 'game-over' : 'playing' };
      });
      setIsThinking(false);
    }, 300 + Math.random() * 600);
  }, [gomokuSettings]);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
    setGameStartTime(Date.now());
    if (gomokuSettings.playerColor === 'white') {
      setTimeout(() => makeAIMove(), 500);
    }
  }, [gomokuSettings.playerColor, makeAIMove]);

  const restartGame = useCallback(() => {
    if (gameState.status !== 'idle' && gameState.moveHistory.length > 0) {
      updateGameStats('gomoku', {
        gamesPlayed: gomokuStats.gamesPlayed + 1,
        totalScore: gomokuStats.totalScore + (gameState.winner === gomokuSettings.playerColor ? 100 : 0),
        bestScore: Math.max(gomokuStats.bestScore, gameState.winner === gomokuSettings.playerColor ? 100 : 0),
        totalTime: gomokuStats.totalTime + Math.floor(gameTime / 1000),
      });
    }
    initGame();
  }, [gameState, gameTime, gomokuStats, updateGameStats, initGame, gomokuSettings.playerColor]);

  const makePlayerMove = useCallback((row: number, col: number) => {
    if (gameState.board[row][col] !== null || isThinking) return;
    if (gameState.status === 'idle') startGame();
    if (gameState.status !== 'playing') return;

    setGameState(prev => {
      const newBoard = prev.board.map(r => [...r]);
      newBoard[row][col] = gomokuSettings.playerColor;
      const winner = gomokuUtils.checkWin(newBoard, row, col, gomokuSettings.playerColor) ? gomokuSettings.playerColor : null;
      if (winner) {
        setShowResult('win');
        const sx = PADDING + col * CELL_SIZE;
        const sy = PADDING + row * CELL_SIZE;
        spawnParticles(sx, sy, 80);
      }
      return { ...prev, board: newBoard, currentPlayer: gomokuSettings.playerColor === 'black' ? 'white' : 'black', winner, lastMove: { row, col }, moveHistory: [...prev.moveHistory, { row, col }], status: winner ? 'game-over' : 'playing' };
    });

    if (!gameState.winner) setTimeout(() => makeAIMove(), 300);
  }, [gameState, gomokuSettings, isThinking, startGame, makeAIMove]);

  const undoMove = useCallback(() => {
    if (!gomokuSettings.allowUndo || gameState.moveHistory.length < 2) return;
    setGameState(prev => {
      const newHistory = prev.moveHistory.slice(0, -2);
      const newBoard = Array(gomokuSettings.boardSize).fill(null).map(() => Array(gomokuSettings.boardSize).fill(null));
      newHistory.forEach((move, index) => {
        newBoard[move.row][move.col] = index % 2 === 0 ? 'black' : 'white';
      });
      return { ...prev, board: newBoard, currentPlayer: gomokuSettings.playerColor, winner: null, lastMove: newHistory.length > 0 ? newHistory[newHistory.length - 1] : null, moveHistory: newHistory, status: 'playing' };
    });
    setShowResult(null);
  }, [gameState.moveHistory, gomokuSettings]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const col = Math.round((x - PADDING) / CELL_SIZE);
    const row = Math.round((y - PADDING) / CELL_SIZE);
    if (row >= 0 && row < gomokuSettings.boardSize && col >= 0 && col < gomokuSettings.boardSize) {
      makePlayerMove(row, col);
    }
  }, [CELL_SIZE, PADDING, CANVAS_SIZE, gomokuSettings.boardSize, makePlayerMove]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.status === 'playing') interval = setInterval(() => setGameTime(Date.now() - gameStartTime), 1000);
    return () => clearInterval(interval);
  }, [gameState.status, gameStartTime]);

  useEffect(() => { initGame(); }, [initGame]);

  const getStatusText = () => {
    if (showResult === 'win') return '你赢了！';
    if (showResult === 'lose') return 'AI 获胜';
    if (gameState.status === 'idle') return '点击棋盘开始';
    if (isThinking) return 'AI 思考中...';
    return gameState.currentPlayer === gomokuSettings.playerColor ? '轮到你下棋' : 'AI 回合';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="flex items-center space-x-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            <Home className="h-4 w-4" /><span>返回</span>
          </button>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">五子棋</h1>
        </div>
        <button onClick={onSettings} className="flex items-center space-x-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
          <Settings className="h-4 w-4" /><span>设置</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            {/* Status */}
            <div className="text-center mb-4">
              <div className={`text-lg font-bold mb-1 transition-colors duration-500 ${
                showResult === 'win' ? 'text-amber-500' :
                showResult === 'lose' ? 'text-zinc-400 dark:text-zinc-500' :
                'text-zinc-900 dark:text-zinc-100'
              }`}>
                {getStatusText()}
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-gray-400 to-black border border-zinc-400" />
                  黑棋
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-white to-gray-300 border border-zinc-300" />
                  白棋
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">|</span>
                <span>你执{gomokuSettings.playerColor === 'black' ? '黑' : '白'}棋</span>
              </div>
            </div>

            {/* Result overlay */}
            {showResult && (
              <div className={`text-center mb-3 py-3 px-4 rounded-xl animate-in zoom-in-95 duration-300 ${
                showResult === 'win'
                  ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800'
                  : 'bg-zinc-50 dark:bg-zinc-700/50 border border-zinc-200 dark:border-zinc-600'
              }`}>
                <div className="text-3xl mb-1">{showResult === 'win' ? '🏆' : '💪'}</div>
                <div className={`text-sm font-semibold ${showResult === 'win' ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {showResult === 'win' ? '恭喜获胜！棋艺精湛！' : '再接再厉，下次一定能赢！'}
                </div>
              </div>
            )}

            {/* Canvas */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                onClick={handleCanvasClick}
                className="rounded-lg cursor-pointer shadow-lg"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mt-4">
              {gomokuSettings.allowUndo && gameState.moveHistory.length >= 2 && gameState.status === 'playing' && (
                <button onClick={undoMove} className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm">
                  <Undo className="h-4 w-4" /><span>悔棋</span>
                </button>
              )}
              <button onClick={restartGame} className="flex items-center space-x-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-500 rounded-lg transition-colors text-sm">
                <RotateCcw className="h-4 w-4" /><span>重新开始</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info panels */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">游戏信息</h3>
            <div className="space-y-2 text-sm">
              {[
                ['棋盘大小', `${gomokuSettings.boardSize}×${gomokuSettings.boardSize}`],
                ['AI 难度', { easy: '简单', medium: '中等', hard: '困难' }[gomokuSettings.aiDifficulty]],
                ['已下步数', String(gameState.moveHistory.length)],
                ['游戏时间', gameUtils.formatTime(Math.floor(gameTime / 1000))],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">历史记录</h3>
            <div className="space-y-2 text-sm">
              {[
                ['胜利次数', String(Math.floor(gomokuStats.totalScore / 100))],
                ['游戏次数', String(gomokuStats.gamesPlayed)],
                ['胜率', gomokuStats.gamesPlayed > 0 ? `${Math.round((gomokuStats.totalScore / 100 / gomokuStats.gamesPlayed) * 100)}%` : '0%'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">操作说明</h3>
            <div className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <p>点击棋盘空位落子</p>
              <p>横、竖、斜方向连成五子获胜</p>
              {gomokuSettings.allowUndo && <p>支持悔棋（撤销上一步）</p>}
              {gomokuSettings.forbiddenMoves && <p>启用了禁手规则</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
