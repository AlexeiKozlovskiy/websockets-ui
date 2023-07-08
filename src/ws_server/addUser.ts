import { WebSocket } from 'ws';
import { rooms } from '../db';
import { Game } from '../types';

export function addUserToRoom(ws: WebSocket, data: Game, id: number) {
  const { indexRoom } = JSON.parse(data.toString());

  if (indexRoom < 0 || indexRoom >= rooms.length) {
    console.log('Invalid room index');
    return;
  }

  const room = rooms[indexRoom];
  // room.roomUsers.push({ ws, playerId: ws.playerId });
  // rooms.splice(indexRoom, 1);

  const response = {
    type: 'create_game',
    data: JSON.stringify({
      idGame: room.roomId,
      idPlayer: room.roomUsers.length - 1,
    }),
    id,
  };
  ws.send(JSON.stringify(response));

  // updateRoomState(room);
}
