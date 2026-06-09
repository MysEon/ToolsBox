import { SnakeSettings, TetrisSettings, GomokuSettings, CommonSettings, GameStats } from '../types';

// 默认游戏设置
export const defaultSnakeSettings: SnakeSettings = {
  speed: 150,
  snakeColor: '#10B981', // emerald-500
  foodColor: '#EF4444', // red-500
  borderMode: 'wall',
  controls: {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight'
  }
};

export const defaultTetrisSettings: TetrisSettings = {
  speed: 5,
  theme: 'classic',
  showNext: true,
  showGhost: true,
  controls: {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    down: 'ArrowDown',
    rotate: 'ArrowUp',
    drop: ' ' // 空格键
  }
};

export const defaultGomokuSettings: GomokuSettings = {
  boardSize: 15,
  playerColor: 'black',
  aiDifficulty: 'medium',
  forbiddenMoves: false,
  allowUndo: true
};

export const defaultCommonSettings: CommonSettings = {
  soundEnabled: true,
  musicEnabled: false,
  musicVolume: 0.5,
  theme: 'light',
  saveStats: true
};

export const defaultGameStats: GameStats = {
  gamesPlayed: 0,
  totalScore: 0,
  bestScore: 0,
  totalTime: 0
};

// 游戏信息配置
export const gameInfo = {
  snake: {
    id: 'snake',
    name: '贪吃蛇',
    description: '经典贪吃蛇游戏，控制蛇吃食物并避免撞到自己',
    icon: '🐍',
    color: 'from-green-500 to-emerald-600',
    difficulty: '简单',
    players: '单人'
  },
  tetris: {
    id: 'tetris',
    name: '俄罗斯方块',
    description: '经典俄罗斯方块游戏，消除完整的行来获得分数',
    icon: '🧩',
    color: 'from-blue-500 to-cyan-600',
    difficulty: '中等',
    players: '单人'
  },
  gomoku: {
    id: 'gomoku',
    name: '五子棋',
    description: '与AI对战五子棋，率先连成五子者获胜',
    icon: '⚫',
    color: 'from-gray-700 to-gray-900',
    difficulty: '中等',
    players: '人机对战'
  }
};

// 贪吃蛇速度选项
export const snakeSpeedOptions = [
  { label: '慢速', value: 200, description: '适合新手' },
  { label: '中速', value: 150, description: '标准速度' },
  { label: '快速', value: 100, description: '有挑战性' },
  { label: '极速', value: 50, description: '专家级别' }
];

// 贪吃蛇颜色主题
export const snakeColorThemes = [
  { name: '经典绿色', snake: '#10B981', food: '#EF4444' },
  { name: '蓝色主题', snake: '#3B82F6', food: '#F59E0B' },
  { name: '紫色主题', snake: '#8B5CF6', food: '#EC4899' },
  { name: '橙色主题', snake: '#F97316', food: '#06B6D4' }
];

// 俄罗斯方块颜色主题
export const tetrisThemes = {
  classic: {
    name: '经典',
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500']
  },
  neon: {
    name: '霓虹',
    colors: ['#FF1493', '#00FF7F', '#1E90FF', '#FFD700', '#FF69B4', '#00CED1', '#FF6347']
  },
  pastel: {
    name: '柔和',
    colors: ['#FFB6C1', '#98FB98', '#87CEEB', '#F0E68C', '#DDA0DD', '#AFEEEE', '#F4A460']
  },
  dark: {
    name: '暗黑',
    colors: ['#8B0000', '#006400', '#000080', '#B8860B', '#800080', '#008B8B', '#A0522D']
  }
};

// 五子棋棋盘大小选项
export const gomokuBoardSizes = [
  { size: 15, label: '15×15', description: '标准棋盘' },
  { size: 19, label: '19×19', description: '围棋棋盘' }
];

// 五子棋AI难度
export const gomokuDifficulties = [
  { level: 'easy', label: '简单', description: '适合新手' },
  { level: 'medium', label: '中等', description: '有一定挑战' },
  { level: 'hard', label: '困难', description: '高级AI' }
];

// 俄罗斯方块形状定义
export const tetrisShapes = [
  // I 形状
  [
    [1, 1, 1, 1]
  ],
  // O 形状
  [
    [1, 1],
    [1, 1]
  ],
  // T 形状
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  // S 形状
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  // Z 形状
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  // J 形状
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
  // L 形状
  [
    [0, 0, 1],
    [1, 1, 1]
  ]
];

// 键盘控制选项
export const keyOptions = [
  { key: 'ArrowUp', label: '↑' },
  { key: 'ArrowDown', label: '↓' },
  { key: 'ArrowLeft', label: '←' },
  { key: 'ArrowRight', label: '→' },
  { key: 'KeyW', label: 'W' },
  { key: 'KeyA', label: 'A' },
  { key: 'KeyS', label: 'S' },
  { key: 'KeyD', label: 'D' },
  { key: ' ', label: '空格' },
  { key: 'Enter', label: '回车' }
];
