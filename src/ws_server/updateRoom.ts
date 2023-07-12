import { WebSocket } from 'ws';
import { Room, MessageType } from '../types';
import { players, rooms } from '../db';

const updateData = (name: string, index: number) => {
  const newRoom: Room = {
    roomId: rooms.length,
    roomUsers: [{ name, index }],
  };
  rooms.push(newRoom);
};

export const updateRoom = (wss: WebSocket, id: number) => {
  players.forEach(({ name, playerId, ws }) => {
    if (wss === ws) {
      updateData(name, playerId);
    }
  });
  players.forEach(({ ws }) => {
    const response = {
      type: MessageType.UPDATE_ROOM,
      data: JSON.stringify(rooms),
      id,
    };
    ws.send(JSON.stringify(response));
  });
};
