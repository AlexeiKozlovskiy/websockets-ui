import { WebSocket } from 'ws';
import { players } from '../db';
import { Player } from '../types';

let playerId = 0;

export function registration(ws: WebSocket, data: Player, id: number) {
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
