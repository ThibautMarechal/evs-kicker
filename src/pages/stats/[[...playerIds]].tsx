import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { usePlayers, usePlayersGames } from '../../react-query/players';
import { Chart, ChartOptions } from 'react-charts';
import { Game, Player } from '../../typing';
import PlayerSelect from '../../components/PlayerSelect';
import { PlayersTable } from '../../components/PlayersTable';

type GamePoint = {
  date: Date;
  elo: number;
};

function sameDay(d1: Date, d2: Date) {
  return d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() === d2.getUTCDate();
}

export default function Stats() {
  const { query, push } = useRouter();
  const playerIds: string[] = useMemo(() => (query.playerIds as string[]) ?? [], [query.playerIds]);
  const { data: players } = usePlayers();
  const queries = usePlayersGames(playerIds);

  const gamePointsSeries = useMemo<GamePoint[][]>(() => {
    if (!players) {
      return playerIds.map(() => []);
    }
    return queries
      .map(({ data: games }, i) => {
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
      })
      .filter((gps) => gps.length);
  }, [playerIds, players, queries]);

  const options = useMemo<ChartOptions<GamePoint>>(
    () => ({
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
          min: 500,
          max: 1500,
        },
      ],
    }),
    [gamePointsSeries, playerIds, players],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full">
      <div>
        <PlayerSelect
          value={(playerIds.map((id) => players?.find((p) => p.id === id))?.filter(Boolean) ?? []) as Player[]}
          onChange={(newPlayers) => (newPlayers ? push(`/stats/${newPlayers.map((p) => p.id).join('/')}`) : push('/stats/'))}
        />
        {playerIds.length ? (
          <div className="my-4">
            <PlayersTable players={players?.filter((p) => playerIds.includes(p.id)) ?? []} />
          </div>
        ) : null}
      </div>
      <div className="col-span-2">
        {players && playerIds.length && queries.some((q) => q.data) ? <>{gamePointsSeries.length ? <Chart options={options} /> : <p>No match found</p>}</> : null}
      </div>
    </div>
  );
}
