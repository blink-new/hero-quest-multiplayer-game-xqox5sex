import React, { useState } from 'react';
import { GameLobby } from './components/GameLobby';
import { GameRoom } from './components/GameRoom';
import { SocketProvider } from './contexts/SocketContext';
import { CharacterClass } from './types/game';

type AppState = 'lobby' | 'game';

interface GameSession {
  roomId: string;
  playerName: string;
  characterClass: CharacterClass;
}

function App() {
  const [appState, setAppState] = useState<AppState>('lobby');
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  const handleCreateRoom = (roomName: string, playerName: string, characterClass: CharacterClass) => {
    // Generate a random room ID for demo purposes
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    setGameSession({
      roomId,
      playerName,
      characterClass
    });
    setAppState('game');
  };

  const handleJoinRoom = (roomId: string, playerName: string, characterClass: CharacterClass) => {
    setGameSession({
      roomId,
      playerName,
      characterClass
    });
    setAppState('game');
  };

  const handleLeaveRoom = () => {
    setGameSession(null);
    setAppState('lobby');
  };

  return (
    <SocketProvider>
      <div className="app">
        {appState === 'lobby' && (
          <GameLobby
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />
        )}
        
        {appState === 'game' && gameSession && (
          <GameRoom
            roomId={gameSession.roomId}
            playerName={gameSession.playerName}
            characterClass={gameSession.characterClass}
            onLeaveRoom={handleLeaveRoom}
          />
        )}
      </div>
    </SocketProvider>
  );
}

export default App;