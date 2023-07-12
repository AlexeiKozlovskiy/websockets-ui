import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import { registration } from './registration';
import { updateRoom } from './updateRoom';
import { addUserToRoom } from './addUser';
import { MessageRequest, MessageType } from '../types';
import { WebSocket } from 'ws';
import { startGame } from './startGame';

dotenv.config();

export function websocketServer(PORT: number) {
  const wss = new WebSocketServer({ port: PORT });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');

    ws.on('message', (message: string) => {
      try {
        const { type, data, id } = JSON.parse(message) as MessageRequest;
        switch (type) {
          case MessageType.REG:
            registration(ws, data, id);
            break;
          case MessageType.CREATE_ROOM:
            updateRoom(ws, id);
            break;
          case MessageType.ADD_USER_TO_ROOM:
            addUserToRoom(ws, data, id);
            break;
          case MessageType.ADD_SHIPS:
            startGame(ws, data, id);
            break;
          case MessageType.ATTACK:
            break;
          default:
            console.log('Unknown request type');
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
