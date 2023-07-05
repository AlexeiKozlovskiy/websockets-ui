import { WebSocketServer, WebSocket, Data } from 'ws';
import * as dotenv from 'dotenv';
import { MessageReq, Player } from '../types';

dotenv.config();

const players: Player[] = [];

export function websocketServer(PORT: number) {
  const wss = new WebSocketServer({ port: PORT });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message: Data) => {
      try {
        const { type, data, id } = JSON.parse(message.toString()) as MessageReq;
        switch (type) {
          case 'reg':
            handlePlayerRegistration(ws, data, id);
            break;
          case 'create_game':
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

  const newPlayer: Player = {
    name,
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
