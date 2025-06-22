import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { GameRoom, Player, GameAction, ChatMessage } from '../types/game';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  currentRoom: GameRoom | null;
  player: Player | null;
  messages: ChatMessage[];
  joinRoom: (roomId: string, playerName: string) => void;
  createRoom: (roomName: string, playerName: string) => void;
  leaveRoom: () => void;
  sendAction: (action: GameAction) => void;
  sendMessage: (message: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // For now, we'll simulate a socket connection since we don't have a backend
    // In a real implementation, this would connect to a Socket.IO server
    const mockSocket = {
      on: (_event: string, _callback: (...args: unknown[]) => void) => {
        // Mock socket event handlers
      },
      emit: (event: string, ...args: unknown[]) => {
        console.log(`Socket emit: ${event}`, args);
      },
      disconnect: () => {
        console.log('Socket disconnected');
      }
    } as Socket;

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      if (mockSocket) {
        mockSocket.disconnect();
      }
    };
  }, []);

  const joinRoom = (roomId: string, playerName: string) => {
    if (socket) {
      socket.emit('join-room', { roomId, playerName });
    }
  };

  const createRoom = (roomName: string, playerName: string) => {
    if (socket) {
      socket.emit('create-room', { roomName, playerName });
    }
  };

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('leave-room', { roomId: currentRoom.id });
      setCurrentRoom(null);
      setPlayer(null);
    }
  };

  const sendAction = (action: GameAction) => {
    if (socket && currentRoom) {
      socket.emit('game-action', action);
    }
  };

  const sendMessage = (message: string) => {
    if (socket && currentRoom && player) {
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        playerId: player.id,
        playerName: player.name,
        message,
        timestamp: Date.now(),
        type: 'chat'
      };
      socket.emit('chat-message', chatMessage);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        currentRoom,
        player,
        messages,
        joinRoom,
        createRoom,
        leaveRoom,
        sendAction,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};