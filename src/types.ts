import { WebSocket } from 'ws';
export interface MessageReq {
  type:
    | 'reg'
    | 'update_winners'
    | 'create_room'
    | 'add_user_to_room'
    | 'add_player_to_room'
    | 'create_game'
    | 'update_room'
    | 'add_ships'
    | 'start_game'
    | 'attack'
    | 'randomAttack'
    | 'turn'
    | 'finish';
  data: Player;
  id: number;
}

export interface Player {
  name: string;
  playerId: number;
  password: string;
  ws: WebSocket;
}
export interface Room {
  roomId: number;
  // roomUsers: WebSocket[];
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
