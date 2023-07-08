import { WebSocket } from 'ws';
import { Room } from '../types';
import { players, rooms } from '../db';

export function updateRoom(ws: WebSocket, id: number) {
  const room: Room = {
    roomId: rooms.length,
    roomUsers: [ws],
  };
  rooms.push(room);
  const roomData = rooms.map(() => ({
    roomId: room.roomId,
    roomUsers: room.roomUsers.map(() => ({
      name: players
        .map((player, indx) => {
          if (indx === 0) {
            return player.name;
          }
        })
        .join(''),
      index: players
        .map((player, indx) => {
          if (indx === 0) {
            return player.playerId;
          }
        })
        .join(''),
    })),
  }));
  roomData.splice(1);

  const response = {
    type: 'update_room',
    data: JSON.stringify(roomData),
    id,
  };
  ws.send(JSON.stringify(response));
}
