import { WebSocket } from 'ws';
import { Room, MessageType } from '../types';
import { playersDB, roomsDB } from '../db';

const updateData = (name: string, index: number) => {
  const newRoom: Room = {
    roomId: roomsDB.length,
    roomUsers: [{ name, index }],
  };
  roomsDB.push(newRoom);
};
export const updateRoom = (wss: WebSocket, id: number) => {

  playersDB?.forEach(({ name, playerId, ws }) => {
    if (wss === ws) {
      updateData(name, playerId);
    }
  });
  playersDB?.forEach(({ ws }) => {
    const response = {
      type: MessageType.UPDATE_ROOM,
      data: JSON.stringify(roomsDB),
      id,
    };
    ws.send(JSON.stringify(response));
  });
};
