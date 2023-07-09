import { WebSocket } from 'ws';

export interface MessageRequest {
  type: MessageType;
  data: DataWSMessage;
  id: number;
}

export enum MessageType {
  REG = 'reg',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ADD_SHIPS = 'add_ships',
  ATTACK = 'attack',
}

export interface DataWSMessage extends Player, AddPlayer {}

export interface Player {
  name: string;
  playerId: number;
  password: string;
  ws: WebSocket;
}
export interface Room {
  roomId: number;
  roomUsers: [
    {
      name: string;
      index: number;
    }
  ];
}
export interface Game {
  idGame: number;
  players: Player[];
}

export interface AddPlayer {
  indexRoom: number;
}
