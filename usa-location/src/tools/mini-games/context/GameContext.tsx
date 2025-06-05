'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  GameType,
  GameContextType,
  SnakeSettings,
  TetrisSettings,
  GomokuSettings,
  CommonSettings,
  GameStats
} from '../types';
import {
  defaultSnakeSettings,
  defaultTetrisSettings,
  defaultGomokuSettings,
  defaultCommonSettings,
  defaultGameStats
} from '../data/gameData';
import { storage, STORAGE_KEYS } from '../utils/gameUtils';

// 状态类型
interface GameState {
  currentGame: GameType | null;
  snakeSettings: SnakeSettings;
  tetrisSettings: TetrisSettings;
  gomokuSettings: GomokuSettings;
  commonSettings: CommonSettings;
  snakeStats: GameStats;
  tetrisStats: GameStats;
  gomokuStats: GameStats;
}

// 动作类型
type GameAction =
  | { type: 'SET_CURRENT_GAME'; payload: GameType | null }
  | { type: 'UPDATE_SNAKE_SETTINGS'; payload: Partial<SnakeSettings> }
  | { type: 'UPDATE_TETRIS_SETTINGS'; payload: Partial<TetrisSettings> }
  | { type: 'UPDATE_GOMOKU_SETTINGS'; payload: Partial<GomokuSettings> }
  | { type: 'UPDATE_COMMON_SETTINGS'; payload: Partial<CommonSettings> }
  | { type: 'UPDATE_GAME_STATS'; payload: { game: GameType; stats: Partial<GameStats> } }
  | { type: 'RESET_GAME_STATS'; payload: GameType }
  | { type: 'RESET_ALL_STATS' }
  | { type: 'LOAD_SETTINGS' };

// 初始状态
const initialState: GameState = {
  currentGame: null,
  snakeSettings: defaultSnakeSettings,
  tetrisSettings: defaultTetrisSettings,
  gomokuSettings: defaultGomokuSettings,
  commonSettings: defaultCommonSettings,
  snakeStats: defaultGameStats,
  tetrisStats: defaultGameStats,
  gomokuStats: defaultGameStats
};

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_CURRENT_GAME':
      return { ...state, currentGame: action.payload };
      
    case 'UPDATE_SNAKE_SETTINGS': {
      const newSettings = { ...state.snakeSettings, ...action.payload };
      storage.set(STORAGE_KEYS.SNAKE_SETTINGS, newSettings);
      return { ...state, snakeSettings: newSettings };
    }
    
    case 'UPDATE_TETRIS_SETTINGS': {
      const newSettings = { ...state.tetrisSettings, ...action.payload };
      storage.set(STORAGE_KEYS.TETRIS_SETTINGS, newSettings);
      return { ...state, tetrisSettings: newSettings };
    }
    
    case 'UPDATE_GOMOKU_SETTINGS': {
      const newSettings = { ...state.gomokuSettings, ...action.payload };
      storage.set(STORAGE_KEYS.GOMOKU_SETTINGS, newSettings);
      return { ...state, gomokuSettings: newSettings };
    }
    
    case 'UPDATE_COMMON_SETTINGS': {
      const newSettings = { ...state.commonSettings, ...action.payload };
      storage.set(STORAGE_KEYS.COMMON_SETTINGS, newSettings);
      return { ...state, commonSettings: newSettings };
    }
    
    case 'UPDATE_GAME_STATS': {
      const { game, stats } = action.payload;
      const currentStats = state[`${game}Stats` as keyof GameState] as GameStats;
      const newStats = { ...currentStats, ...stats };
      storage.set(STORAGE_KEYS[`${game.toUpperCase()}_STATS` as keyof typeof STORAGE_KEYS], newStats);
      return { ...state, [`${game}Stats`]: newStats };
    }
    
    case 'RESET_GAME_STATS': {
      const game = action.payload;
      storage.set(STORAGE_KEYS[`${game.toUpperCase()}_STATS` as keyof typeof STORAGE_KEYS], defaultGameStats);
      return { ...state, [`${game}Stats`]: { ...defaultGameStats } };
    }
    
    case 'RESET_ALL_STATS':
      storage.set(STORAGE_KEYS.SNAKE_STATS, defaultGameStats);
      storage.set(STORAGE_KEYS.TETRIS_STATS, defaultGameStats);
      storage.set(STORAGE_KEYS.GOMOKU_STATS, defaultGameStats);
      return {
        ...state,
        snakeStats: { ...defaultGameStats },
        tetrisStats: { ...defaultGameStats },
        gomokuStats: { ...defaultGameStats }
      };
      
    case 'LOAD_SETTINGS':
      return {
        ...state,
        snakeSettings: storage.get(STORAGE_KEYS.SNAKE_SETTINGS, defaultSnakeSettings),
        tetrisSettings: storage.get(STORAGE_KEYS.TETRIS_SETTINGS, defaultTetrisSettings),
        gomokuSettings: storage.get(STORAGE_KEYS.GOMOKU_SETTINGS, defaultGomokuSettings),
        commonSettings: storage.get(STORAGE_KEYS.COMMON_SETTINGS, defaultCommonSettings),
        snakeStats: storage.get(STORAGE_KEYS.SNAKE_STATS, defaultGameStats),
        tetrisStats: storage.get(STORAGE_KEYS.TETRIS_STATS, defaultGameStats),
        gomokuStats: storage.get(STORAGE_KEYS.GOMOKU_STATS, defaultGameStats)
      };
      
    default:
      return state;
  }
};

// Context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider 组件
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // 加载设置
  useEffect(() => {
    dispatch({ type: 'LOAD_SETTINGS' });
  }, []);
  
  const contextValue: GameContextType = {
    currentGame: state.currentGame,
    setCurrentGame: (game) => dispatch({ type: 'SET_CURRENT_GAME', payload: game }),
    
    snakeSettings: state.snakeSettings,
    tetrisSettings: state.tetrisSettings,
    gomokuSettings: state.gomokuSettings,
    commonSettings: state.commonSettings,
    
    updateSnakeSettings: (settings) => dispatch({ type: 'UPDATE_SNAKE_SETTINGS', payload: settings }),
    updateTetrisSettings: (settings) => dispatch({ type: 'UPDATE_TETRIS_SETTINGS', payload: settings }),
    updateGomokuSettings: (settings) => dispatch({ type: 'UPDATE_GOMOKU_SETTINGS', payload: settings }),
    updateCommonSettings: (settings) => dispatch({ type: 'UPDATE_COMMON_SETTINGS', payload: settings }),
    
    snakeStats: state.snakeStats,
    tetrisStats: state.tetrisStats,
    gomokuStats: state.gomokuStats,
    
    updateGameStats: (game, stats) => dispatch({ type: 'UPDATE_GAME_STATS', payload: { game, stats } }),
    resetGameStats: (game) => dispatch({ type: 'RESET_GAME_STATS', payload: game }),
    resetAllStats: () => dispatch({ type: 'RESET_ALL_STATS' })
  };
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Hook
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
