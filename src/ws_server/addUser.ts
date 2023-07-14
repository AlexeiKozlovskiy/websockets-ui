import { WebSocket } from 'ws';
import { playersDB, roomsDB, gamesDB } from '../db';
import { Game, Room, Player, AddPlayer, MessageType } from '../types';

export const addUserToRoom = (wss: WebSocket, data: AddPlayer, id: number) => {
  const { indexRoom } = JSON.parse(data.toString()) as AddPlayer;
  const roomActive: Room = roomsDB.find(({ roomId }) => roomId === indexRoom) as Room;
  const activePlayer: Player = playersDB.find(({ ws }) => ws === wss) as Player;
  const indexPlayerActive = roomActive.roomUsers[0].index;
  const waitingPlayer: Player = playersDB.find(({ playerId }) => playerId === indexPlayerActive) as Player;

  if (indexPlayerActive !== activePlayer.playerId) {
    const idGame = gamesDB.length;
    const game: Game = { idGame, players: [activePlayer, waitingPlayer] };
    gamesDB.push(game);

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
