import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { usePlayer, usePlayerGames } from '../../react-query/players';
import { Chart, ChartOptions } from 'react-charts';
import { GamesTable } from '../../components/GamesTable';

type GamePoint = {
  date: Date;
  elo: number;
};

function sameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export default function Stats() {
  const {
    query: { playerId },
  } = useRouter();
  const { data: player } = usePlayer(playerId as string);
  const { data: games } = usePlayerGames(playerId as string);

  const gamePoints = useMemo<GamePoint[]>(() => {
    const gamePoints: GamePoint[] = [];
    if (!player) {
      return [];
    }
    let playerElo = player.elo;
    games?.forEach((game) => {
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
      if (game.winners.includes(playerId as string)) {
        playerElo -= game.delta;
      } else {
        playerElo += game.delta;
      }
    });
    return gamePoints;
  }, [games, player, playerId]);

  const options = useMemo<ChartOptions<GamePoint>>(
    () => ({
      data: [
        {
          label: player?.username,
          data: gamePoints,
        },
      ],
      primaryAxis: {
        scaleType: 'time',
        getValue: (g) => g.date,
      },
      secondaryAxes: [
        {
          scaleType: 'linear',
          getValue: (g) => g.elo,
          min: 500,
          max: 1500,
        },
      ],
    }),
    [gamePoints, player?.username],
  );

  if (games?.length) {
    return (
      <div className="grid grid-cols-3 gap-4 p-4 h-screen">
        <div>
          <GamesTable games={games ?? []} />
        </div>
        <div className="col-span-2">
          <Chart options={options} />
        </div>
      </div>
    );
  }
  return null;
}
