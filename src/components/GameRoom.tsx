import React, { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { PlayerDashboard } from './PlayerDashboard';
import { GameRoom as GameRoomType, Player, Position, CharacterClass, Character, CharacterStats } from '../types/game';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { MessageCircle, Send, LogOut } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface GameRoomProps {
  roomId: string;
  playerName: string;
  characterClass: CharacterClass;
  onLeaveRoom: () => void;
}

const createCharacter = (name: string, characterClass: CharacterClass): Character => {
  const baseStats: Record<CharacterClass, CharacterStats> = {
    [CharacterClass.WARRIOR]: {
      health: 100,
      maxHealth: 100,
      mana: 30,
      maxMana: 30,
      attack: 15,
      defense: 12,
      speed: 8
    },
    [CharacterClass.MAGE]: {
      health: 70,
      maxHealth: 70,
      mana: 100,
      maxMana: 100,
      attack: 8,
      defense: 6,
      speed: 10
    },
    [CharacterClass.ROGUE]: {
      health: 80,
      maxHealth: 80,
      mana: 50,
      maxMana: 50,
      attack: 12,
      defense: 8,
      speed: 15
    },
    [CharacterClass.HEALER]: {
      health: 90,
      maxHealth: 90,
      mana: 80,
      maxMana: 80,
      attack: 6,
      defense: 10,
      speed: 9
    }
  };

  return {
    id: uuidv4(),
    name,
    class: characterClass,
    level: 1,
    stats: baseStats[characterClass],
    inventory: []
  };
};

export const GameRoom: React.FC<GameRoomProps> = ({ 
  roomId, 
  playerName, 
  characterClass, 
  onLeaveRoom 
}) => {
  const [room, setRoom] = useState<GameRoomType | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [movementPoints, setMovementPoints] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    playerName: string;
    message: string;
    timestamp: number;
    type: 'chat' | 'system';
  }>>([]);

  // Initialize the game room
  useEffect(() => {
    const playerId = uuidv4();
    const character = createCharacter(playerName, characterClass);
    
    const player: Player = {
      id: playerId,
      name: playerName,
      character,
      position: { x: 1, y: 1 }, // Start at entrance
      isHost: true, // For demo, first player is host
      isConnected: true,
      remainingMoves: character.stats.speed // Initialize remaining moves
    };

    // Create mock additional players for demonstration
    const mockPlayers: Player[] = [
      {
        id: uuidv4(),
        name: 'Sir Lancelot',
        character: createCharacter('Sir Lancelot', CharacterClass.WARRIOR),
        position: { x: 2, y: 1 },
        isHost: false,
        isConnected: true,
        remainingMoves: createCharacter('Sir Lancelot', CharacterClass.WARRIOR).stats.speed
      },
      {
        id: uuidv4(),
        name: 'Gandalf',
        character: createCharacter('Gandalf', CharacterClass.MAGE),
        position: { x: 1, y: 2 },
        isHost: false,
        isConnected: true,
        remainingMoves: createCharacter('Gandalf', CharacterClass.MAGE).stats.speed
      }
    ];

    const gameRoom: GameRoomType = {
      id: roomId,
      name: 'Epic Adventure',
      players: [player, ...mockPlayers],
      maxPlayers: 4,
      gameState: {
        phase: 'playing',
        currentPlayer: playerId,
        gameBoard: {
          width: 15,
          height: 15,
          tiles: []
        },
        monsters: [],
        treasures: [],
        round: 1
      },
      currentTurn: playerId,
      turnOrder: [playerId, ...mockPlayers.map(p => p.id)]
    };

    setRoom(gameRoom);
    setCurrentPlayer(player);
    setMovementPoints(player.character.stats.speed);

    // Add welcome message
    setChatMessages([{
      id: uuidv4(),
      playerName: 'System',
      message: `Welcome to the dungeon, ${playerName}! Your quest begins now.`,
      timestamp: Date.now(),
      type: 'system'
    }]);
  }, [roomId, playerName, characterClass]);

  const handleTileClick = (position: Position) => {
    if (!room || !currentPlayer || room.currentTurn !== currentPlayer.id) {
      return;
    }

    // Check if the move is valid (Manhattan distance)
    const dx = Math.abs(position.x - currentPlayer.position.x);
    const dy = Math.abs(position.y - currentPlayer.position.y);
    const distance = dx + dy;

    if (distance > 0 && distance <= movementPoints) {
      // Update player position
      const updatedPlayer = { ...currentPlayer, position };
      const updatedPlayers = room.players.map(p =>
        p.id === currentPlayer.id ? updatedPlayer : p
      );

      const newMovementPoints = movementPoints - distance;
      setMovementPoints(newMovementPoints);

      const updatedRoom = { ...room, players: updatedPlayers };
      setRoom(updatedRoom);
      setCurrentPlayer(updatedPlayer);

      // Add movement message
      setChatMessages(prev => [...prev, {
        id: uuidv4(),
        playerName: currentPlayer.name,
        message: `moved to (${position.x}, ${position.y})`,
        timestamp: Date.now(),
        type: 'system'
      }]);
    }
  };

  const handleEndTurn = () => {
    if (!room || !currentPlayer) return;

    const currentIndex = room.turnOrder.indexOf(room.currentTurn);
    const nextIndex = (currentIndex + 1) % room.turnOrder.length;
    const nextPlayerId = room.turnOrder[nextIndex];
    
    const updatedRoom = { ...room, currentTurn: nextPlayerId };
    setRoom(updatedRoom);

    // Reset movement points for the next player
    const nextPlayer = room.players.find(p => p.id === nextPlayerId);
    if (nextPlayer) {
      setMovementPoints(nextPlayer.character.stats.speed);
    }

    // Add turn change message
    setChatMessages(prev => [...prev, {
      id: uuidv4(),
      playerName: 'System',
      message: `${nextPlayer?.name || 'Unknown'}'s turn`,
      timestamp: Date.now(),
      type: 'system'
    }]);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !currentPlayer) return;

    setChatMessages(prev => [...prev, {
      id: uuidv4(),
      playerName: currentPlayer.name,
      message: chatMessage.trim(),
      timestamp: Date.now(),
      type: 'chat'
    }]);

    setChatMessage('');
  };

  if (!room || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {room.name}
            </h1>
            <p className="text-gray-300">Room ID: <span className="font-mono text-cyan-400">{room.id}</span></p>
          </div>
          <Button
            onClick={onLeaveRoom}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave Room
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Game Board */}
          <div className="xl:col-span-3">
            <GameBoard
              room={room}
              currentPlayer={currentPlayer}
              onTileClick={handleTileClick}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player Dashboard */}
            <PlayerDashboard
              room={room}
              currentPlayer={currentPlayer}
              movementPoints={movementPoints}
              onEndTurn={handleEndTurn}
            />

            {/* Chat */}
            <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <MessageCircle className="h-5 w-5" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 overflow-y-auto space-y-2 p-2 bg-gray-800/50 rounded">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      {msg.type === 'system' ? (
                        <div className="text-yellow-400 italic">
                          • {msg.message}
                        </div>
                      ) : (
                        <div>
                          <span className="text-cyan-400 font-medium">{msg.playerName}:</span>
                          <span className="text-gray-300 ml-2">{msg.message}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};