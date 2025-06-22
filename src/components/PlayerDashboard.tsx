import React from 'react';
import { Player, GameRoom } from '../types/game';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Zap, Shield, Sword, Users, Crown } from 'lucide-react';

interface PlayerDashboardProps {
  room: GameRoom;
  currentPlayer: Player;
  movementPoints: number;
  onEndTurn: () => void;
}

const getClassColor = (className: string) => {
  switch (className) {
    case 'warrior': return 'text-red-400 bg-red-900/20';
    case 'mage': return 'text-blue-400 bg-blue-900/20';
    case 'rogue': return 'text-green-400 bg-green-900/20';
    case 'healer': return 'text-yellow-400 bg-yellow-900/20';
    default: return 'text-gray-400 bg-gray-900/20';
  }
};

const getClassIcon = (className: string) => {
  switch (className) {
    case 'warrior': return Sword;
    case 'mage': return Zap;
    case 'rogue': return Shield;
    case 'healer': return Heart;
    default: return Sword;
  }
};

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ 
  room, 
  currentPlayer, 
  movementPoints,
  onEndTurn 
}) => {
  const isCurrentTurn = room.currentTurn === currentPlayer.id;

  return (
    <div className="space-y-4">
      {/* Current Player Stats */}
      <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            {React.createElement(getClassIcon(currentPlayer.character.class), {
              className: "h-6 w-6"
            })}
            {currentPlayer.name}
            {currentPlayer.isHost && (
              <Crown className="h-5 w-5 text-yellow-400" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Level {currentPlayer.character.level}</span>
            <Badge className={getClassColor(currentPlayer.character.class)}>
              {currentPlayer.character.class.charAt(0).toUpperCase() + currentPlayer.character.class.slice(1)}
            </Badge>
          </div>
          
          {/* Health Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-400" />
                <span className="text-sm text-gray-300">Health</span>
              </div>
              <span className="text-sm text-red-400">
                {currentPlayer.character.stats.health}/{currentPlayer.character.stats.maxHealth}
              </span>
            </div>
            <Progress 
              value={(currentPlayer.character.stats.health / currentPlayer.character.stats.maxHealth) * 100}
              className="bg-gray-700"
            />
          </div>

          {/* Mana Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Mana</span>
              </div>
              <span className="text-sm text-blue-400">
                {currentPlayer.character.stats.mana}/{currentPlayer.character.stats.maxMana}
              </span>
            </div>
            <Progress 
              value={(currentPlayer.character.stats.mana / currentPlayer.character.stats.maxMana) * 100}
              className="bg-gray-700"
            />
          </div>

          {/* Movement Points */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Movement</span>
            <span className="font-bold text-cyan-400">
              {movementPoints} / {currentPlayer.character.stats.speed}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-700">
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">
                {currentPlayer.character.stats.attack}
              </div>
              <div className="text-xs text-gray-400">Attack</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">
                {currentPlayer.character.stats.defense}
              </div>
              <div className="text-xs text-gray-400">Defense</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {currentPlayer.character.stats.speed}
              </div>
              <div className="text-xs text-gray-400">Speed</div>
            </div>
          </div>

          {/* Turn Actions */}
          {isCurrentTurn && (
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">Your Turn</span>
              </div>
              <Button 
                onClick={onEndTurn}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              >
                End Turn
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Players */}
      <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Users className="h-5 w-5" />
            Players ({room.players.length}/{room.maxPlayers})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {room.players.map((player) => {
            const ClassIcon = getClassIcon(player.character.class);
            const isCurrentPlayerTurn = room.currentTurn === player.id;
            
            return (
              <div 
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  isCurrentPlayerTurn 
                    ? 'bg-green-900/30 border border-green-500/30' 
                    : 'bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClassIcon className={`h-5 w-5 ${getClassColor(player.character.class).split(' ')[0]}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{player.name}</span>
                      {player.isHost && (
                        <Crown className="h-4 w-4 text-yellow-400" />
                      )}
                      {isCurrentPlayerTurn && (
                        <Badge className="bg-green-600 text-white">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 capitalize">
                      {player.character.class} • Level {player.character.level}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-400" />
                    <span className="text-sm text-red-400">
                      {player.character.stats.health}/{player.character.stats.maxHealth}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-blue-400" />
                    <span className="text-sm text-blue-400">
                      {player.character.stats.mana}/{player.character.stats.maxMana}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Game Info */}
      <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Room:</span>
              <span className="text-white font-mono">{room.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Round:</span>
              <span className="text-cyan-400">{room.gameState.round}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Phase:</span>
              <span className="text-green-400 capitalize">{room.gameState.phase}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};