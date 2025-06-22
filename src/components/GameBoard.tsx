import React from 'react';
import { GameRoom, Player, Position, TileType } from '../types/game';
import { Sword, Shield, Zap, Heart, Coins, Skull } from 'lucide-react';

interface GameBoardProps {
  room: GameRoom;
  currentPlayer: Player;
  onTileClick: (position: Position) => void;
}

const BOARD_SIZE = 20;

// Function to calculate visible tiles based on player positions
const calculateVisibility = (tiles: Tile[][], players: Player[]) => {
  const visibleTiles = new Set<string>();

  players.forEach(player => {
    const { x, y } = player.position;
    const visionRadius = 3; // How far the player can see

    for (let i = -visionRadius; i <= visionRadius; i++) {
      for (let j = -visionRadius; j <= visionRadius; j++) {
        // Use a circular field of view
        if (i * i + j * j <= visionRadius * visionRadius) {
          const checkX = x + i;
          const checkY = y + j;

          if (checkX >= 0 && checkX < BOARD_SIZE && checkY >= 0 && checkY < BOARD_SIZE) {
            // Line of sight check (simple version)
            // A more advanced version would trace a line between player and tile
            visibleTiles.add(`${checkX},${checkY}`);
          }
        }
      }
    }
  });

  // Update tile visibility
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (visibleTiles.has(`${x},${y}`)) {
        tiles[y][x].isVisible = true;
      }
    }
  }
};

// Generate a simple dungeon layout
const generateDungeon = () => {
  const tiles = Array(BOARD_SIZE).fill(null).map((_, y) =>
    Array(BOARD_SIZE).fill(null).map((_, x) => ({
      x,
      y,
      type: TileType.FLOOR,
      isWalkable: true,
      hasPlayer: false,
      hasMonster: false,
      hasTreasure: false,
      isVisible: false // All tiles are initially hidden
    }))
  );

  // Add walls around the edges
  for (let i = 0; i < BOARD_SIZE; i++) {
    tiles[0][i].type = TileType.WALL;
    tiles[0][i].isWalkable = false;
    tiles[BOARD_SIZE - 1][i].type = TileType.WALL;
    tiles[BOARD_SIZE - 1][i].isWalkable = false;
    tiles[i][0].type = TileType.WALL;
    tiles[i][0].isWalkable = false;
    tiles[i][BOARD_SIZE - 1].type = TileType.WALL;
    tiles[i][BOARD_SIZE - 1].isWalkable = false;
  }

  // Add some interior walls
  const wallPositions = [
    [3, 3], [3, 4], [3, 5],
    [7, 7], [8, 7], [9, 7],
    [11, 3], [11, 4], [11, 5],
    [5, 10], [6, 10], [7, 10]
  ];

  wallPositions.forEach(([x, y]) => {
    if (tiles[y] && tiles[y][x]) {
      tiles[y][x].type = TileType.WALL;
      tiles[y][x].isWalkable = false;
    }
  });

  // Add entrance and exit
  tiles[1][1].type = TileType.ENTRANCE;
  tiles[BOARD_SIZE - 2][BOARD_SIZE - 2].type = TileType.EXIT;

  return tiles;
};

const getCharacterIcon = (className: string) => {
  switch (className) {
    case 'warrior': return Sword;
    case 'mage': return Zap;
    case 'rogue': return Shield;
    case 'healer': return Heart;
    default: return Sword;
  }
};

const getCharacterColor = (className: string) => {
  switch (className) {
    case 'warrior': return 'text-red-400';
    case 'mage': return 'text-blue-400';
    case 'rogue': return 'text-green-400';
    case 'healer': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

const getTileStyle = (tile: { type: TileType }) => {
  switch (tile.type) {
    case TileType.WALL:
      return 'bg-gray-800 border-gray-700';
    case TileType.FLOOR:
      return 'bg-gray-700 border-gray-600 hover:bg-gray-600 cursor-pointer';
    case TileType.ENTRANCE:
      return 'bg-green-800 border-green-600 animate-pulse';
    case TileType.EXIT:
      return 'bg-purple-800 border-purple-600 animate-pulse';
    case TileType.DOOR:
      return 'bg-yellow-800 border-yellow-600';
    default:
      return 'bg-gray-700 border-gray-600';
  }
};

export const GameBoard: React.FC<GameBoardProps> = ({ room, currentPlayer, onTileClick }) => {
  const tiles = generateDungeon();

  // Mark tiles with players
  room.players.forEach(player => {
    const { x, y } = player.position;
    if (tiles[y] && tiles[y][x]) {
      tiles[y][x].hasPlayer = true;
    }
  });

  // Calculate visibility based on all players' positions
  calculateVisibility(tiles, room.players);

  // Add some mock monsters and treasures
  const mockMonsters = [
    { x: 5, y: 5 },
    { x: 10, y: 8 },
    { x: 3, y: 11 }
  ];

  const mockTreasures = [
    { x: 6, y: 3 },
    { x: 12, y: 6 },
    { x: 4, y: 13 }
  ];

  mockMonsters.forEach(pos => {
    if (tiles[pos.y] && tiles[pos.y][pos.x]) {
      tiles[pos.y][pos.x].hasMonster = true;
    }
  });

  mockTreasures.forEach(pos => {
    if (tiles[pos.y] && tiles[pos.y][pos.x]) {
      tiles[pos.y][pos.x].hasTreasure = true;
    }
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Dungeon Map</h2>
        <p className="text-gray-300">
          Current Turn: <span className="text-yellow-400 font-semibold">
            {room.players.find(p => p.id === room.currentTurn)?.name || 'Unknown'}
          </span>
        </p>
      </div>
      
      <div className="grid grid-cols-20 gap-1 p-4 bg-gray-900/80 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
        {tiles.map((row, y) =>
          row.map((tile, x) => {
            const playersOnTile = room.players.filter(p => p.position.x === x && p.position.y === y);
            
            if (!tile.isVisible) {
              return (
                <div
                  key={`${x}-${y}`}
                  className="w-8 h-8 bg-black border-2 border-gray-900"
                />
              );
            }

            return (
              <div
                key={`${x}-${y}`}
                className={`w-8 h-8 border-2 relative flex items-center justify-center transition-all duration-200 ${getTileStyle(tile)}`}
                onClick={() => tile.isWalkable && onTileClick({ x, y })}
              >
                {/* Players */}
                {playersOnTile.map((player, index) => {
                  const Icon = getCharacterIcon(player.character.class);
                  const colorClass = getCharacterColor(player.character.class);
                  return (
                    <Icon
                      key={player.id}
                      className={`w-5 h-5 ${colorClass} ${index > 0 ? 'absolute' : ''}`}
                      style={index > 0 ? { transform: `translate(${index * 2}px, ${index * 2}px)` } : {}}
                    />
                  );
                })}
                
                {/* Monsters */}
                {tile.hasMonster && !tile.hasPlayer && (
                  <Skull className="w-5 h-5 text-red-500 animate-pulse" />
                )}
                
                {/* Treasures */}
                {tile.hasTreasure && !tile.hasPlayer && !tile.hasMonster && (
                  <Coins className="w-5 h-5 text-yellow-500 animate-bounce" />
                )}
                
                {/* Highlight current player's possible moves */}
                {tile.isWalkable && currentPlayer.id === room.currentTurn && 
                 Math.abs(tile.x - currentPlayer.position.x) + Math.abs(tile.y - currentPlayer.position.y) <= currentPlayer.remainingMoves && 
                 (tile.x !== currentPlayer.position.x || tile.y !== currentPlayer.position.y) && (
                  <div className="absolute inset-0 bg-cyan-400/20 rounded border border-cyan-400/50 animate-pulse" />
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-800 border border-green-600 rounded"></div>
          <span>Entrance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-800 border border-purple-600 rounded"></div>
          <span>Exit</span>
        </div>
        <div className="flex items-center gap-2">
          <Skull className="w-4 h-4 text-red-500" />
          <span>Monster</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span>Treasure</span>
        </div>
      </div>
    </div>
  );
};