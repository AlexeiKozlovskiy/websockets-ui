import { WebSocketServer, WebSocket, RawData } from 'ws';
import * as dotenv from 'dotenv';
import { Player, Room } from '../types';
import { players, rooms, games } from '../db';

dotenv.config();

let playerId = 0;

export function websocketServer(PORT: number) {
  const wss = new WebSocketServer({ port: PORT });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message: RawData) => {
      try {
        const { type, data, id } = JSON.parse(message.toString());
        console.log(type);
        switch (type) {
          case 'reg':
            handlePlayerRegistration(ws, data, id);
            break;
          case 'create_room':
            updateRoom(ws, id);
            break;
          case 'add_user_to_room':
            addUserToRoom(ws, data, id);
            break;
          case 'turn':
            break;
          case 'attack':
            break;
          default:
            console.log('Invalid request type');
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
}

function handlePlayerRegistration(ws: WebSocket, data: Player, id: number) {
  const { name, password } = JSON.parse(data.toString());

  const existingPlayer = players.find((player) => player.name === name);
  if (existingPlayer) {
    const response = {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: -1,
        error: true,
        errorText: 'Player already exists.',
      }),
      id,
    };
    ws.send(JSON.stringify(response));
    return;
  }
  playerId++;

  const newPlayer: Player = {
    name,
    playerId,
    password,
  };
  players.push(newPlayer);

  const response = {
    type: 'reg',
    data: JSON.stringify({
      name,
      index: players.indexOf(newPlayer),
      error: false,
      errorText: '',
    }),
    id,
  };
  ws.send(JSON.stringify(response));
}

function updateRoom(ws: WebSocket, id: number) {
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

function addUserToRoom(ws: WebSocket, data: any, id: number) {
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

// function updateRoomState(room: Room) {
//   const roomData = room.roomUsers.map((user) => ({
//     name: players.find((player) => player.playerId === user.playerId)?.name,
//     index: user.playerId,
//   }));

//   const response = {
//     type: 'update_room',
//     data: JSON.stringify([{ roomId: room.roomId, roomUsers: roomData }]),
//     id: 0,
//   };

//   room.roomUsers.forEach((ws) => {
//     ws.send(JSON.stringify(response));
//   });
// }
