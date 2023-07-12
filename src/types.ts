import { WebSocket } from 'ws';

export interface MessageRequest {
  type: MessageType;
  data: DataWSMessage;
  id: number;
}

export enum MessageType {
  REG = 'reg',
  CREATE_ROOM = 'create_room',
  CREATE_GAME = 'create_game',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  UPDATE_ROOM = 'update_room',
  ADD_SHIPS = 'add_ships',
  START_GAME = 'start_game',
  ATTACK = 'attack',
}

export interface DataWSMessage extends Player, AddPlayer, DataAddShips {}

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

export interface DataAddShips {
  gameId: number;
  ships: Ships[];
  indexPlayer: number;
}

export interface Ships {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: string;
}
