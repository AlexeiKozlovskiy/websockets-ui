import { WebSocket } from 'ws';
import { players } from '../db';
import { Player, MessageType } from '../types';

const updateData = (ws: WebSocket, data: Player, error: boolean) => {
  const playerId = players.length;
  const { name, password } = JSON.parse(data.toString()) as Player;
  const newPlayer: Player = {
    ws,
    name,
    playerId,
    password,
  };
  if (!error) players.push(newPlayer);
  return playerId;
};

const validatePlayer = (data: Player) => {
  const { name } = JSON.parse(data.toString()) as Player;
  const existingPlayer = players.find((user) => user.name === name);
  if (existingPlayer) {
    return { error: true, errorText: 'Player already exists' };
  } else {
    return { error: false, errorText: '' };
  }
};

export const registration = (ws: WebSocket, data: Player, id: number) => {
  const { name } = JSON.parse(data.toString()) as Player;
  const { error, errorText } = validatePlayer(data);

  const index = updateData(ws, data, error);
  const response = {
    type: MessageType.REG,
    data: JSON.stringify({
      name,
      index,
      error,
      errorText,
    }),
    id,
  };
  ws.send(JSON.stringify(response));
};
