export type GameType = 'snake' | 'tetris' | 'gomoku';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'game-over' | 'win';

export interface GameScore {
  current: number;
  best: number;
}

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  totalTime: number;
}

// 贪吃蛇相关类型
export interface SnakePosition {
  x: number;
  y: number;
}

export interface SnakeSettings {
  speed: number; // 游戏速度 (ms)
  snakeColor: string;
  foodColor: string;
  borderMode: 'wall' | 'wrap'; // 撞墙死亡或穿墙
  controls: {
    up: string;
    down: string;
    left: string;
    right: string;
  };
}

export interface SnakeGameState {
  snake: SnakePosition[];
  food: SnakePosition;
  direction: 'up' | 'down' | 'left' | 'right';
  score: number;
  status: GameStatus;
}

// 俄罗斯方块相关类型
export interface TetrisBlock {
  x: number;
  y: number;
  color: string;
}

export interface TetrisPiece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

export interface TetrisSettings {
  speed: number; // 下落速度级别 1-10
  theme: string; // 颜色主题
  showNext: boolean; // 显示下一个方块
  showGhost: boolean; // 显示幽灵方块
  controls: {
    left: string;
    right: string;
    down: string;
    rotate: string;
    drop: string;
  };
}

export interface TetrisGameState {
  board: (string | null)[][];
  currentPiece: TetrisPiece | null;
  nextPiece: TetrisPiece | null;
  score: number;
  lines: number;
  level: number;
  status: GameStatus;
}

// 五子棋相关类型
export type GomokuPlayer = 'black' | 'white' | null;

export interface GomokuPosition {
  row: number;
  col: number;
}

export interface GomokuSettings {
  boardSize: 15 | 19;
  playerColor: 'black' | 'white';
  aiDifficulty: 'easy' | 'medium' | 'hard';
  forbiddenMoves: boolean; // 禁手规则
  allowUndo: boolean; // 允许悔棋
}

export interface GomokuGameState {
  board: GomokuPlayer[][];
  currentPlayer: GomokuPlayer;
  winner: GomokuPlayer;
  lastMove: GomokuPosition | null;
  moveHistory: GomokuPosition[];
  status: GameStatus;
}

// 通用游戏设置
export interface CommonSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  musicVolume: number;
  theme: 'light' | 'dark';
  saveStats: boolean;
}

// 游戏上下文类型
export interface GameContextType {
  currentGame: GameType | null;
  setCurrentGame: (game: GameType | null) => void;
  
  // 设置
  snakeSettings: SnakeSettings;
  tetrisSettings: TetrisSettings;
  gomokuSettings: GomokuSettings;
  commonSettings: CommonSettings;
  
  updateSnakeSettings: (settings: Partial<SnakeSettings>) => void;
  updateTetrisSettings: (settings: Partial<TetrisSettings>) => void;
  updateGomokuSettings: (settings: Partial<GomokuSettings>) => void;
  updateCommonSettings: (settings: Partial<CommonSettings>) => void;
  
  // 统计数据
  snakeStats: GameStats;
  tetrisStats: GameStats;
  gomokuStats: GameStats;
  
  updateGameStats: (game: GameType, stats: Partial<GameStats>) => void;
  resetGameStats: (game: GameType) => void;
  resetAllStats: () => void;
}
