import { WebSocket } from 'ws';
import { rooms, players, games } from '../db';
import { Game, Room, Player, AddPlayer, MessageType } from '../types';

export const addUserToRoom = (wss: WebSocket, data: AddPlayer, id: number) => {
  const { indexRoom } = JSON.parse(data.toString()) as AddPlayer;
  const roomActive: Room = rooms.find(({ roomId }) => roomId === indexRoom) as Room;
  const activePlayer: Player = players.find(({ ws }) => ws === wss) as Player;
  const indexPlayerActive = roomActive.roomUsers[0].index;
  const waitingPlayer: Player = players.find(({ playerId }) => playerId === indexPlayerActive) as Player;

  if (indexPlayerActive !== activePlayer.playerId) {
    const idGame = games.length;
    const game: Game = { idGame, players: [activePlayer, waitingPlayer] };
    games.push(game);

    const dataActive = {
      type: MessageType.CREATE_GAME,
      data: JSON.stringify({
        idGame,
        idPlayer: activePlayer.playerId,
      }),
      id,
    };
    activePlayer.ws.send(JSON.stringify(dataActive));
    const dataWait = {
      type: MessageType.CREATE_GAME,
      data: JSON.stringify({
        idGame,
        idPlayer: waitingPlayer.playerId,
      }),
      id,
    };
    waitingPlayer.ws.send(JSON.stringify(dataWait));
  }
};
