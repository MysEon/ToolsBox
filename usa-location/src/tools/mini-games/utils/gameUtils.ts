import { SnakePosition, GomokuPlayer, GomokuPosition } from '../types';

// 本地存储键名
export const STORAGE_KEYS = {
  SNAKE_SETTINGS: 'mini-games-snake-settings',
  TETRIS_SETTINGS: 'mini-games-tetris-settings',
  GOMOKU_SETTINGS: 'mini-games-gomoku-settings',
  COMMON_SETTINGS: 'mini-games-common-settings',
  SNAKE_STATS: 'mini-games-snake-stats',
  TETRIS_STATS: 'mini-games-tetris-stats',
  GOMOKU_STATS: 'mini-games-gomoku-stats'
};

// 本地存储工具函数
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 忽略存储错误
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // 忽略删除错误
    }
  }
};

// 贪吃蛇游戏工具函数
export const snakeUtils = {
  // 生成随机食物位置
  generateFood: (snake: SnakePosition[], gridSize: number): SnakePosition => {
    let food: SnakePosition;
    do {
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
  },
  
  // 检查是否撞到自己
  checkSelfCollision: (head: SnakePosition, body: SnakePosition[]): boolean => {
    return body.some(segment => segment.x === head.x && segment.y === head.y);
  },
  
  // 检查是否撞墙
  checkWallCollision: (head: SnakePosition, gridSize: number): boolean => {
    return head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
  },
  
  // 处理穿墙模式
  wrapPosition: (position: SnakePosition, gridSize: number): SnakePosition => {
    return {
      x: ((position.x % gridSize) + gridSize) % gridSize,
      y: ((position.y % gridSize) + gridSize) % gridSize
    };
  }
};

// 俄罗斯方块游戏工具函数
export const tetrisUtils = {
  // 旋转方块形状
  rotateShape: (shape: number[][]): number[][] => {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated: number[][] = [];
    
    for (let i = 0; i < cols; i++) {
      rotated[i] = [];
      for (let j = 0; j < rows; j++) {
        rotated[i][j] = shape[rows - 1 - j][i];
      }
    }
    
    return rotated;
  },
  
  // 检查方块是否可以放置
  canPlacePiece: (
    board: (string | null)[][],
    shape: number[][],
    x: number,
    y: number
  ): boolean => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          
          if (
            newX < 0 ||
            newX >= board[0].length ||
            newY >= board.length ||
            (newY >= 0 && board[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  },
  
  // 清除完整的行
  clearLines: (board: (string | null)[][]): { newBoard: (string | null)[][]; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === null));
    const linesCleared = board.length - newBoard.length;
    
    // 在顶部添加空行
    while (newBoard.length < board.length) {
      newBoard.unshift(new Array(board[0].length).fill(null));
    }
    
    return { newBoard, linesCleared };
  },
  
  // 计算分数
  calculateScore: (linesCleared: number, level: number): number => {
    const baseScores = [0, 40, 100, 300, 1200];
    return baseScores[linesCleared] * (level + 1);
  }
};

// 五子棋游戏工具函数
export const gomokuUtils = {
  // 检查是否获胜
  checkWin: (
    board: GomokuPlayer[][],
    row: number,
    col: number,
    player: GomokuPlayer
  ): boolean => {
    if (!player) return false;
    
    const directions = [
      [0, 1],   // 水平
      [1, 0],   // 垂直
      [1, 1],   // 对角线
      [1, -1]   // 反对角线
    ];
    
    for (const [dx, dy] of directions) {
      let count = 1;
      
      // 向一个方向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (
          newRow >= 0 &&
          newRow < board.length &&
          newCol >= 0 &&
          newCol < board[0].length &&
          board[newRow][newCol] === player
        ) {
          count++;
        } else {
          break;
        }
      }
      
      // 向相反方向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (
          newRow >= 0 &&
          newRow < board.length &&
          newCol >= 0 &&
          newCol < board[0].length &&
          board[newRow][newCol] === player
        ) {
          count++;
        } else {
          break;
        }
      }
      
      if (count >= 5) return true;
    }
    
    return false;
  },
  
  // 简单AI：寻找最佳落子位置
  findBestMove: (
    board: GomokuPlayer[][],
    player: GomokuPlayer,
    difficulty: 'easy' | 'medium' | 'hard'
  ): GomokuPosition | null => {
    const opponent = player === 'black' ? 'white' : 'black';
    const boardSize = board.length;
    
    // 检查是否可以获胜
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (board[row][col] === null) {
          board[row][col] = player;
          if (gomokuUtils.checkWin(board, row, col, player)) {
            board[row][col] = null;
            return { row, col };
          }
          board[row][col] = null;
        }
      }
    }
    
    // 检查是否需要阻止对手获胜
    if (difficulty !== 'easy') {
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          if (board[row][col] === null) {
            board[row][col] = opponent;
            if (gomokuUtils.checkWin(board, row, col, opponent)) {
              board[row][col] = null;
              return { row, col };
            }
            board[row][col] = null;
          }
        }
      }
    }
    
    // 简单策略：在已有棋子附近落子
    const moves: GomokuPosition[] = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (board[row][col] === null) {
          // 检查周围是否有棋子
          let hasNeighbor = false;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const newRow = row + dx;
              const newCol = col + dy;
              if (
                newRow >= 0 &&
                newRow < boardSize &&
                newCol >= 0 &&
                newCol < boardSize &&
                board[newRow][newCol] !== null
              ) {
                hasNeighbor = true;
                break;
              }
            }
            if (hasNeighbor) break;
          }
          if (hasNeighbor) {
            moves.push({ row, col });
          }
        }
      }
    }
    
    // 如果没有邻近的位置，选择中心附近
    if (moves.length === 0) {
      const center = Math.floor(boardSize / 2);
      for (let offset = 0; offset < 3; offset++) {
        for (let dx = -offset; dx <= offset; dx++) {
          for (let dy = -offset; dy <= offset; dy++) {
            const row = center + dx;
            const col = center + dy;
            if (
              row >= 0 &&
              row < boardSize &&
              col >= 0 &&
              col < boardSize &&
              board[row][col] === null
            ) {
              moves.push({ row, col });
            }
          }
        }
        if (moves.length > 0) break;
      }
    }
    
    return moves.length > 0 ? moves[Math.floor(Math.random() * moves.length)] : null;
  }
};

// 通用工具函数
export const gameUtils = {
  // 格式化时间
  formatTime: (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
  
  // 格式化分数
  formatScore: (score: number): string => {
    return score.toLocaleString();
  },
  
  // 防抖函数
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
};
