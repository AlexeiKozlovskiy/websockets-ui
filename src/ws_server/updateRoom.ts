import { WebSocket } from 'ws';
import { Room } from '../types';
import { players, rooms } from '../db';

const updateDB = (name: string, index: number) => {
  const newRoom: Room = {
    roomId: rooms.length,
    roomUsers: [{ name, index }],
  };
  rooms.push(newRoom);
};

export const updateRoom = (wss: WebSocket, id: number) => {
  players.forEach(({ name, playerId, ws }) => {
    if (wss === ws) {
      updateDB(name, playerId);
    }
  });
  players.forEach(({ ws }) => {
    const response = {
      type: 'update_room',
      data: JSON.stringify(rooms),
      id,
    };
    ws.send(JSON.stringify(response));
  });
};
