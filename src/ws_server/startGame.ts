import { WebSocket } from 'ws';
import { DataAddShips, MessageType } from '../types';

export const startGame = (ws: WebSocket, data: DataAddShips, id: number) => {
  const { ships, indexPlayer: currentPlayerIndex } = JSON.parse(data.toString()) as DataAddShips;

  const response = {
    type: MessageType.START_GAME,
    data: JSON.stringify({
      ships,
      currentPlayerIndex,
    }),
    id,
  };
  ws.send(JSON.stringify(response));
};
