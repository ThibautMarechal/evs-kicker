import EloRating from 'elo-rating';


export function calculateEloDelta(winnersElo: Array<number>, loosersElo: Array<number>, loosersScore: number) {
  const winnerAverage = winnersElo.reduce((acc, elo) => acc + elo, 0) / winnersElo.length;
  const looserAverage = loosersElo.reduce((acc, elo) => acc + elo, 0) / loosersElo.length;

  const { playerRating } = EloRating.calculate(winnerAverage, looserAverage, true);

  return Math.round((playerRating - winnerAverage) * (1 - ((loosersScore - 5)/10)));
}