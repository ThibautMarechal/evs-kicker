import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { usePlayers, usePlayersGames } from '../../react-query/players';
import { Chart, ChartOptions } from 'react-charts';
import { Game, Player } from '../../typing';
import PlayerSelect from '../../components/PlayerSelect';

type GamePoint = {
  date: Date;
  elo: number;
};

function sameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export default function Stats() {
  const { query, push } = useRouter();
  const playerIds: string[] = useMemo(() => (query.playerIds as string[]) ?? [], [query.playerIds]);
  const { data: players } = usePlayers();
  const queries = usePlayersGames(playerIds);

  const gamePoints = useMemo<GamePoint[][]>(() => {
    if (!players) {
      return playerIds.map(() => []);
    }
    return queries.map(({ data: games }, i) => {
      const gamePoints: GamePoint[] = [];
      let playerElo = players.find((p) => p.id === playerIds[i])?.elo ?? 0;
      (games as Game[])?.forEach((game) => {
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
      });
      return gamePoints;
    });
  }, [playerIds, players, queries]);
  console.log(gamePoints);

  const options = useMemo<ChartOptions<GamePoint>>(
    () => ({
      data: gamePoints.map((gp, i) => ({
        label: players?.find((p) => p.id === playerIds[i])?.username,
        data: gp,
      })),
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
    [gamePoints, playerIds, players],
  );

  return (
    <div className="grid grid-cols-3 gap-4 p-4 h-screen">
      <div>
        <PlayerSelect
          value={(playerIds.map((id) => players?.find((p) => p.id === id))?.filter(Boolean) ?? []) as Player[]}
          onChange={(newPlayers) => (newPlayers ? push(`/stats/${newPlayers.map((p) => p.id).join('/')}`) : push('/stats/'))}
        />
      </div>
      <div className="col-span-2">{players && playerIds.length && queries.some((q) => q.data) ? <Chart options={options} /> : null}</div>
    </div>
  );
}
