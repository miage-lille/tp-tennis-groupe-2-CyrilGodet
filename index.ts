import { isSamePlayer, Player, stringToPlayer } from './types/player';
import { FortyData, Point, PointsData, Score, advantage, deuce, forty, game, thirty, fifteen } from './types/score';
import { pipe, Option } from 'effect'

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return stringToPlayer('PLAYER_TWO');
    case 'PLAYER_TWO':
      return stringToPlayer('PLAYER_ONE');
  }
};
// Exercice 1 :
export const pointToString = (point: Point): string =>
  'You can use pattern matching with switch case pattern.';

export const scoreToString = (score: Score): string => {
  const scoreHandlers: Record<Score['kind'], (s: Score) => string> = {
    POINTS: (s) => {
      const { pointsData } = s as { kind: 'POINTS'; pointsData: PointsData };
      return `${pointToString(pointsData.PLAYER_ONE)} - ${pointToString(pointsData.PLAYER_TWO)}`;
    },
    GAME: (s) => {
      const { player } = s as { kind: 'GAME'; player: Player };
      return `Game ${playerToString(player)}`;
    },
    DEUCE: () => 'Deuce',
    FORTY: (s) => {
      const { player, point } = s as unknown as { kind: 'FORTY'; player: Player; point: Point };
      return `${playerToString(player)}: 40 - ${playerToString(otherPlayer(player))}: ${pointToString(point)}`;
    },
    ADVANTAGE: (s) => {
      const { player } = s as { kind: 'ADVANTAGE'; player: Player };
      return `Advantage ${playerToString(player)}`;
    },
  };
  return scoreHandlers[score.kind](score);
};

export const scoreWhenDeuce = (winner: Player): Score => advantage(winner);

export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  if (isSamePlayer(advantagedPlayed, winner)) return game(winner);
  return deuce();
};


export const scoreWhenForty = (
  currentForty: FortyData,
  winner: Player
): Score => {
  if (isSamePlayer(currentForty.player, winner)) return game(winner);
  return pipe(
    incrementPoint(currentForty.otherPoint),
    Option.match({
      onNone: () => deuce(),
      onSome: p => forty(currentForty.player, p) as Score
    })
  );
};

export const incrementPoint = (point: Point) : Option.Option<Point> => {
  switch (point.kind) {
    case 'LOVE':
      return Option.some(fifteen());
    case 'FIFTEEN':
      return Option.some(thirty());
    case 'THIRTY':
      return Option.none();
  }
};

// Exercice 2
// Tip: You can use pipe function from Effect to improve readability.
// See scoreWhenForty function above.
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  throw new Error('not implemented');
};

// Exercice 3
export const scoreWhenGame = (winner: Player): Score => {
  throw new Error('not implemented');
};

export const score = (currentScore: Score, winner: Player): Score => {
  throw new Error('not implemented');
};
