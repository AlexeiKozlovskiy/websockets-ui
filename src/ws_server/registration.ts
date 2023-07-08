import { WebSocket } from 'ws';
import { players } from '../db';
import { Player } from '../types';

const updateDB = (ws: WebSocket, data: Player, error: boolean) => {
  const playerIndex = players.length;
  const { name, password } = JSON.parse(data.toString());
  const newPlayer: Player = {
    ws,
    name,
    playerId: playerIndex,
    password,
  };
  if (!error) players.push(newPlayer);
  return playerIndex;
};

const validatePlayer = (data: Player) => {
  const { name } = JSON.parse(data.toString());
  const existingPlayer = players.find((user) => user.name === name);
  if (existingPlayer) {
    return { error: true, errorText: 'Player already exists' };
  } else {
    return { error: false, errorText: '' };
  }
};

export const registration = (ws: WebSocket, data: Player, id: number) => {
  const { name } = JSON.parse(data.toString());
  const { error, errorText } = validatePlayer(data);

  const playerIndex = updateDB(ws, data, error);
  const response = {
    type: 'reg',
    data: JSON.stringify({
      name,
      index: playerIndex,
      error,
      errorText,
    }),
    id,
  };
  ws.send(JSON.stringify(response));
};
