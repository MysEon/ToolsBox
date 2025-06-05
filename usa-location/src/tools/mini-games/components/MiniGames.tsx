'use client';

import React, { useState } from 'react';
import { GameType } from '../types';
import { GameProvider } from '../context/GameContext';
import GameSelector from './GameSelector';
import GameSettings from './GameSettings';
import Snake from '../games/Snake';
import Tetris from '../games/Tetris';
import Gomoku from '../games/Gomoku';

export default function MiniGames() {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [settingsGame, setSettingsGame] = useState<GameType | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const handleGameSelect = (game: GameType) => {
    setCurrentGame(game);
  };
  
  const handleBackToSelector = () => {
    setCurrentGame(null);
  };
  
  const handleSettingsOpen = (game: GameType) => {
    setSettingsGame(game);
    setShowSettings(true);
  };
  
  const handleSettingsClose = () => {
    setShowSettings(false);
    setSettingsGame(null);
  };
  
  const handleGameSettings = () => {
    if (currentGame) {
      handleSettingsOpen(currentGame);
    }
  };
  
  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'snake':
        return (
          <Snake 
            onBack={handleBackToSelector} 
            onSettings={handleGameSettings}
          />
        );
      case 'tetris':
        return (
          <Tetris 
            onBack={handleBackToSelector} 
            onSettings={handleGameSettings}
          />
        );
      case 'gomoku':
        return (
          <Gomoku 
            onBack={handleBackToSelector} 
            onSettings={handleGameSettings}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <GameProvider>
      <div className="min-h-screen">
        {currentGame ? (
          renderCurrentGame()
        ) : (
          <GameSelector 
            onGameSelect={handleGameSelect}
            onSettingsOpen={handleSettingsOpen}
          />
        )}
        
        {showSettings && settingsGame && (
          <GameSettings
            game={settingsGame}
            isOpen={showSettings}
            onClose={handleSettingsClose}
          />
        )}
      </div>
    </GameProvider>
  );
}
