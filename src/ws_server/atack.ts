import { Attack, Game, Player, MessageType } from '../types';
import { playersDB, gamesDB, shipsDB } from '../db';

export const attack = (data: Attack, id: number) => {
  const { gameId, x, y, indexPlayer } = JSON.parse(data.toString()) as Attack;
  const currentPlayer = playersDB[indexPlayer];
  const otherPlayer = playersDB.find((player) => player.playerId !== currentPlayer.playerId)!;
  const currentGame = gamesDB.find((game) => game.idGame === gameId);
  const attackResult = handlerStatusAttack(currentGame!, x, y, currentPlayer);
  const respons = {
    type: MessageType.ATTACK,
    data: JSON.stringify({
      position: { x, y },
      currentPlayer: currentPlayer.playerId,
      status: attackResult,
    }),
    id,
  };
  currentPlayer.ws.send(JSON.stringify(respons));
  otherPlayer.ws.send(JSON.stringify(respons));
};

const handlerStatusAttack = (game: Game, x: number, y: number, currentPlayer: Player) => {
  const opponentShips = shipsDB.find(
    (ship) => ship.gameId === game.idGame && ship.indexPlayer !== currentPlayer.playerId
  )!.ships;

  for (const ship of opponentShips) {
    const { position, direction, length } = ship;
    const { x: shipX, y: shipY } = position;

    ship.hits = ship.hits || Array(length).fill(false);

    if (!direction) {
      if (y === shipY && x >= shipX && x < shipX + length) {
        const hitIndex = x - shipX;
        ship.hits[hitIndex] = true;
        if (ship.hits.every((hit) => hit)) return 'killed';
        else return 'shot';
      }
    } else {
      if (x === shipX && y >= shipY && y < shipY + length) {
        const hitIndex = y - shipY;
        ship.hits[hitIndex] = true;
        if (ship.hits.every((hit) => hit)) return 'killed';
        else return 'shot';
      }
    }
  }
  return 'miss';
};
