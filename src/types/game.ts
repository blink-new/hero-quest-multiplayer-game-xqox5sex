export interface Player {
  id: string;
  name: string;
  character: Character;
  position: Position;
  isHost: boolean;
  isConnected: boolean;
  remainingMoves: number;
}

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  stats: CharacterStats;
  inventory: Item[];
}

export interface CharacterStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  gameState: GameState;
  currentTurn: string; // player ID
  turnOrder: string[]; // player IDs in turn order
}

export interface GameState {
  phase: 'lobby' | 'setup' | 'playing' | 'combat' | 'finished';
  currentPlayer: string;
  gameBoard: GameBoard;
  monsters: Monster[];
  treasures: Treasure[];
  round: number;
}

export interface GameBoard {
  width: number;
  height: number;
  tiles: Tile[][];
}

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  isWalkable: boolean;
  hasPlayer: boolean;
  hasMonster: boolean;
  hasTreasure: boolean;
  isVisible: boolean;
}

export interface Monster {
  id: string;
  name: string;
  position: Position;
  stats: CharacterStats;
  type: MonsterType;
  isAlive: boolean;
}

export interface Treasure {
  id: string;
  name: string;
  position: Position;
  type: TreasureType;
  value: number;
  isCollected: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  value: number;
  equipped: boolean;
}

export interface GameAction {
  type: ActionType;
  playerId: string;
  data: unknown;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'chat' | 'system' | 'combat';
}

// Enums
export enum CharacterClass {
  WARRIOR = 'warrior',
  MAGE = 'mage',
  ROGUE = 'rogue',
  HEALER = 'healer'
}

export enum TileType {
  FLOOR = 'floor',
  WALL = 'wall',
  DOOR = 'door',
  ENTRANCE = 'entrance',
  EXIT = 'exit'
}

export enum MonsterType {
  GOBLIN = 'goblin',
  ORC = 'orc',
  SKELETON = 'skeleton',
  DRAGON = 'dragon'
}

export enum TreasureType {
  GOLD = 'gold',
  WEAPON = 'weapon',
  ARMOR = 'armor',
  POTION = 'potion',
  ARTIFACT = 'artifact'
}

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  POTION = 'potion',
  SCROLL = 'scroll',
  ARTIFACT = 'artifact'
}

export enum ActionType {
  MOVE = 'move',
  ATTACK = 'attack',
  CAST_SPELL = 'cast_spell',
  USE_ITEM = 'use_item',
  OPEN_DOOR = 'open_door',
  COLLECT_TREASURE = 'collect_treasure',
  END_TURN = 'end_turn'
}