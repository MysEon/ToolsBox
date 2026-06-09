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
const DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]];

// 棋型评分表：索引 = 连子数 * 2 + (两端开放 ? 0 : 1)
// openEnds: 2=两端都空, 1=一端空一端堵, 0=两端都堵
const SCORE_TABLE: Record<string, number> = {
  '5_2': 1000000, '5_1': 1000000, '5_0': 1000000, // 五连
  '4_2': 100000,  '4_1': 10000,   '4_0': 0,       // 活四/冲四/死四
  '3_2': 10000,   '3_1': 1000,    '3_0': 0,       // 活三/眠三
  '2_2': 1000,    '2_1': 100,     '2_0': 0,        // 活二/眠二
  '1_2': 100,     '1_1': 10,      '1_0': 0,
};

function evaluateLine(board: GomokuPlayer[][], row: number, col: number, dx: number, dy: number, player: GomokuPlayer): number {
  const size = board.length;
  let count = 1;
  let openEnds = 0;

  // positive direction
  let r = row + dx, c = col + dy;
  while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
    count++;
    r += dx;
    c += dy;
  }
  if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === null) openEnds++;

  // negative direction
  r = row - dx;
  c = col - dy;
  while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
    count++;
    r -= dx;
    c -= dy;
  }
  if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === null) openEnds++;

  const key = `${Math.min(count, 5)}_${openEnds}`;
  return SCORE_TABLE[key] || 0;
}

function evaluateBoard(board: GomokuPlayer[][], player: GomokuPlayer): number {
  const opponent = player === 'black' ? 'white' : 'black';
  const size = board.length;
  const visited = new Set<string>();
  let score = 0;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const stone = board[row][col];
      if (!stone) continue;
      for (const [dx, dy] of DIRECTIONS) {
        const key = `${row},${col},${dx},${dy}`;
        if (visited.has(key)) continue;
        // Mark all cells on this line as visited
        let r = row, c = col;
        while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === stone) {
          visited.add(`${r},${c},${dx},${dy}`);
          r -= dx;
          c -= dy;
        }
        r = row + dx;
        c = col + dy;
        while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === stone) {
          visited.add(`${r},${c},${dx},${dy}`);
          r += dx;
          c += dy;
        }

        const lineScore = evaluateLine(board, row, col, dx, dy, stone);
        score += stone === player ? lineScore : -lineScore * 1.1; // 对手威胁权重略高（防守优先）
      }
    }
  }
  return score;
}

function getCandidateMoves(board: GomokuPlayer[][]): GomokuPosition[] {
  const size = board.length;
  const candidateSet = new Set<string>();
  const moves: GomokuPosition[] = [];

  // Find empty cells within 2 steps of any stone
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === null) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = row + dr, nc = col + dc;
          const k = `${nr},${nc}`;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === null && !candidateSet.has(k)) {
            candidateSet.add(k);
            moves.push({ row: nr, col: nc });
          }
        }
      }
    }
  }

  // If board is empty, play center
  if (moves.length === 0) {
    const center = Math.floor(size / 2);
    moves.push({ row: center, col: center });
  }
  return moves;
}

function minimax(
  board: GomokuPlayer[][],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: GomokuPlayer,
  currentPlayer: GomokuPlayer,
): number {
  if (depth === 0) {
    return evaluateBoard(board, aiPlayer);
  }

  const opponent = aiPlayer === 'black' ? 'white' : 'black';

  // Terminal check: immediate win/loss
  // We check this via evaluateBoard returning very large scores
  const baseScore = evaluateBoard(board, aiPlayer);
  if (Math.abs(baseScore) >= 1000000) return baseScore;

  const moves = getCandidateMoves(board);
  if (moves.length === 0) return 0;

  // Move ordering: evaluate each move quickly and sort by promise
  const scoredMoves = moves.map(move => {
    board[move.row][move.col] = currentPlayer;
    const s = evaluateBoard(board, aiPlayer);
    board[move.row][move.col] = null;
    return { move, score: s };
  });

  if (isMaximizing) {
    scoredMoves.sort((a, b) => b.score - a.score);
  } else {
    scoredMoves.sort((a, b) => a.score - b.score);
  }

  // Limit branching factor for performance
  const maxBranches = depth >= 3 ? 15 : 25;
  const topMoves = scoredMoves.slice(0, maxBranches);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const { move } of topMoves) {
      board[move.row][move.col] = currentPlayer;
      const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
      const evalScore = minimax(board, depth - 1, alpha, beta, false, aiPlayer, nextPlayer);
      board[move.row][move.col] = null;
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const { move } of topMoves) {
      board[move.row][move.col] = currentPlayer;
      const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
      const evalScore = minimax(board, depth - 1, alpha, beta, true, aiPlayer, nextPlayer);
      board[move.row][move.col] = null;
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export const gomokuUtils = {
  checkWin(
    board: GomokuPlayer[][],
    row: number,
    col: number,
    player: GomokuPlayer,
  ): boolean {
    if (!player) return false;
    const size = board.length;

    for (const [dx, dy] of DIRECTIONS) {
      let count = 1;
      for (let i = 1; i < 5; i++) {
        const r = row + dx * i, c = col + dy * i;
        if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) count++;
        else break;
      }
      for (let i = 1; i < 5; i++) {
        const r = row - dx * i, c = col - dy * i;
        if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) count++;
        else break;
      }
      if (count >= 5) return true;
    }
    return false;
  },

  findBestMove(
    board: GomokuPlayer[][],
    player: GomokuPlayer,
    difficulty: 'easy' | 'medium' | 'hard',
  ): GomokuPosition | null {
    const opponent = player === 'black' ? 'white' : 'black';
    const size = board.length;

    // Immediate win
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === null) {
          board[r][c] = player;
          if (gomokuUtils.checkWin(board, r, c, player)) { board[r][c] = null; return { row: r, col: c }; }
          board[r][c] = null;
        }
      }
    }

    // Block opponent's immediate win
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === null) {
          board[r][c] = opponent;
          if (gomokuUtils.checkWin(board, r, c, opponent)) { board[r][c] = null; return { row: r, col: c }; }
          board[r][c] = null;
        }
      }
    }

    // Easy: random near existing stones
    if (difficulty === 'easy') {
      const moves = getCandidateMoves(board);
      return moves[Math.floor(Math.random() * moves.length)] || null;
    }

    // Medium/Hard: Minimax with alpha-beta
    const depth = difficulty === 'hard' ? 4 : 2;
    const candidates = getCandidateMoves(board);
    if (candidates.length === 0) return null;

    let bestScore = -Infinity;
    let bestMove = candidates[0];

    // Score & sort candidates for better pruning
    const scored = candidates.map(move => {
      board[move.row][move.col] = player;
      const s = evaluateBoard(board, player);
      board[move.row][move.col] = null;
      return { move, score: s };
    });
    scored.sort((a, b) => b.score - a.score);

    const topN = difficulty === 'hard' ? 20 : 15;
    for (const { move } of scored.slice(0, topN)) {
      board[move.row][move.col] = player;
      const evalScore = minimax(board, depth - 1, -Infinity, Infinity, false, player, opponent);
      board[move.row][move.col] = null;
      if (evalScore > bestScore) {
        bestScore = evalScore;
        bestMove = move;
      }
    }

    return bestMove;
  },
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
  debounce: <T extends (...args: unknown[]) => unknown>(
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
