import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import { registration } from './registration';
import { updateRoom } from './updateRoom';
import { addUserToRoom } from './addUser';
import { WsMessage } from '../types';

dotenv.config();

export function websocketServer(PORT: number) {
  const wss = new WebSocketServer({ port: PORT });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message: string) => {
      try {
        const { type, data, id } = JSON.parse(message) as WsMessage;
        switch (type) {
          case 'reg':
            registration(ws, data, id);
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
