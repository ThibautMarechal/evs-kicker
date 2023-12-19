;import * as React from 'react';
import { curveLinear} from 'd3-shape';
import { usePlayers, usePlayersGames } from '../react-query/players';
import { Chart, ChartOptions } from 'react-charts';

type Props = {
  playerIds: Array<string>
};

type GamePoint = {
  date: Date;
  elo: number;
};

function sameDay(d1: Date, d2: Date) {
  return d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() === d2.getUTCDate();
}

export const EloChart = ({ playerIds }: Props) => {
  const { data: players } = usePlayers();
  const queries = usePlayersGames(playerIds);

  const gamePointsSeries = React.useMemo<GamePoint[][]>(() => {
    if (!players) {
      return [];
    }
    return queries
      .map(({ data: games }, i) => {
        const gamePoints: GamePoint[] = [];
        let playerElo = players.find((p) => p.id === playerIds[i])?.elo ?? 0;
        for (const game of games ?? []) {
          const gameDate = new Date(game.date);
          gameDate.setUTCHours(0);
          gameDate.setUTCMinutes(0);
          gameDate.setUTCSeconds(0);
          gameDate.setUTCMilliseconds(0);
          if (!gamePoints.length || !sameDay(new Date(game.date), gamePoints[gamePoints.length - 1].date)) {
            gamePoints.push({
              date: gameDate,
              elo: playerElo,
            });
          }
          if (game.winners.includes(playerIds[i])) {
            playerElo -= game.delta;
          } else {
            playerElo += game.delta;
          }
        }

        if (gamePoints.length) {
          const theDateBeforeTheFirstMatch = new Date(gamePoints.at(-1)!.date);
          theDateBeforeTheFirstMatch.setDate(theDateBeforeTheFirstMatch.getDate() - 1);
          gamePoints.push({
            date: theDateBeforeTheFirstMatch,
            elo: Number.parseInt(process.env.NEXT_PUBLIC_INITIAL_ELO as string, 10),
          });
          if(!sameDay(gamePoints[0].date, new Date())) {
            const todayAdjusted = new Date();
            todayAdjusted.setUTCHours(0);
            todayAdjusted.setUTCMinutes(0);
            todayAdjusted.setUTCSeconds(0);
            todayAdjusted.setUTCMilliseconds(0);
            gamePoints.unshift({
              date: todayAdjusted,
              elo: gamePoints[0].elo
            })
          }
        }
        return gamePoints;
      })
  }, [playerIds, players, queries]);

  const options: ChartOptions<GamePoint> = {
    data: gamePointsSeries.map((gps, i) => ({
      label: players?.find((p) => p.id === playerIds[i])?.username,
      data: gps,
    })),
    primaryAxis: {
      scaleType: 'time',
      getValue: (g) => g.date,
    },
    secondaryAxes: [
      {
        scaleType: 'linear',
        getValue: (g) => g.elo,
        min: 1000 - 2 * (1000 - Math.min(...gamePointsSeries.map(serie => Math.min(...serie.map(s => s.elo))))),
        max: 1000 + 2 * (Math.max(...gamePointsSeries.map(serie => Math.max(...serie.map(s => s.elo)))) - 1000),
        curve: curveLinear
      },
    ],
    dark: (typeof window !== 'undefined') ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  }
  return gamePointsSeries.length ? <Chart options={options} /> : <p>No match found</p>;
}

export default EloChart;
