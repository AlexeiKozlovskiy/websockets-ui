import { WebSocket } from 'ws';
import { DataAddShips, MessageType } from '../types';
import { shipsDB } from '../db';

export const startGame = (ws: WebSocket, data: DataAddShips, id: number) => {
  const { ships, indexPlayer } = JSON.parse(data.toString()) as DataAddShips;
  const ship: DataAddShips = { gameId: id, ships, indexPlayer };
  shipsDB.push(ship);

  const response = {
    type: MessageType.START_GAME,
    data: JSON.stringify({
      ships,
      currentPlayerIndex: indexPlayer,
    }),
    id,
  };
  ws.send(JSON.stringify(response));
};
