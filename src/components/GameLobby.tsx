import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, Sword, Shield, Zap, Heart } from 'lucide-react';
import { CharacterClass } from '../types/game';

interface GameLobbyProps {
  onCreateRoom: (roomName: string, playerName: string, characterClass: CharacterClass) => void;
  onJoinRoom: (roomId: string, playerName: string, characterClass: CharacterClass) => void;
}

const characterClasses = [
  {
    class: CharacterClass.WARRIOR,
    name: 'Warrior',
    icon: Sword,
    description: 'Strong melee fighter with high health and attack',
    color: 'text-red-400',
    bgColor: 'bg-red-900/20 border-red-500/30'
  },
  {
    class: CharacterClass.MAGE,
    name: 'Mage',
    icon: Zap,
    description: 'Powerful spellcaster with devastating magic',
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20 border-blue-500/30'
  },
  {
    class: CharacterClass.ROGUE,
    name: 'Rogue',
    icon: Shield,
    description: 'Agile and stealthy with high speed',
    color: 'text-green-400',
    bgColor: 'bg-green-900/20 border-green-500/30'
  },
  {
    class: CharacterClass.HEALER,
    name: 'Healer',
    icon: Heart,
    description: 'Support character with healing abilities',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/20 border-yellow-500/30'
  }
];

export const GameLobby: React.FC<GameLobbyProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(CharacterClass.WARRIOR);
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');

  const handleCreateRoom = () => {
    if (playerName.trim() && roomName.trim()) {
      onCreateRoom(roomName.trim(), playerName.trim(), selectedClass);
    }
  };

  const handleJoinRoom = () => {
    if (playerName.trim() && roomId.trim()) {
      onJoinRoom(roomId.trim(), playerName.trim(), selectedClass);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            Hero Quest
          </h1>
          <p className="text-xl text-gray-300">Embark on an epic multiplayer adventure</p>
        </div>

        {mode === 'select' && (
          <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-cyan-400">Choose Your Path</CardTitle>
              <CardDescription className="text-gray-300">
                Create a new quest or join an existing adventure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setMode('create')}
                  className="h-16 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-lg"
                >
                  <Users className="mr-2 h-6 w-6" />
                  Create Room
                </Button>
                <Button
                  onClick={() => setMode('join')}
                  className="h-16 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-lg"
                >
                  <Sword className="mr-2 h-6 w-6" />
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(mode === 'create' || mode === 'join') && (
          <div className="space-y-6">
            {/* Character Selection */}
            <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-400">Choose Your Hero</CardTitle>
                <CardDescription className="text-gray-300">
                  Select your character class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {characterClasses.map((char) => {
                    const Icon = char.icon;
                    return (
                      <div
                        key={char.class}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          selectedClass === char.class
                            ? `${char.bgColor} border-current`
                            : 'bg-gray-800/50 border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setSelectedClass(char.class)}
                      >
                        <div className="text-center">
                          <Icon className={`h-12 w-12 mx-auto mb-2 ${char.color}`} />
                          <h3 className={`font-semibold ${char.color}`}>{char.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{char.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Room Setup */}
            <Card className="bg-gray-900/80 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-400">
                  {mode === 'create' ? 'Create Room' : 'Join Room'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {mode === 'create' 
                    ? 'Set up your adventure room' 
                    : 'Enter the room code to join'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your hero name"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {mode === 'create' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Room Name
                    </label>
                    <Input
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Room Code
                    </label>
                    <Input
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="Enter room code"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={() => setMode('select')}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={mode === 'create' ? handleCreateRoom : handleJoinRoom}
                    disabled={!playerName.trim() || (mode === 'create' ? !roomName.trim() : !roomId.trim())}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                  >
                    {mode === 'create' ? 'Create Room' : 'Join Room'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};