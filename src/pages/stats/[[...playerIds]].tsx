import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { usePlayers, usePlayersGames } from '../../react-query/players';
import { Chart, ChartOptions } from 'react-charts';
import { Player } from '../../typing';
import PlayerSelect from '../../components/PlayerSelect';
import { PlayersTable } from '../../components/PlayersTable';
import { QueryClient,dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { getPlayers } from '../../firebase/players';
import { getPlayerGames } from '../../firebase/games';

type GamePoint = {
  date: Date;
  elo: number;
};

function sameDay(d1: Date, d2: Date) {
  console.log(d1, d2)
  return d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() === d2.getUTCDate();
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (context.req.url?.startsWith('/_next/data')) {
    return { props: {} };
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey:['players'],queryFn: getPlayers});
  const players = queryClient.getQueryData<Player[]>(['players']) ?? [];
  players.forEach((player) => {
    queryClient.setQueryData(['players', player.id], player);
  });
  const playerIds = (context.query.playerIds as string[]) ?? [];
  await Promise.allSettled(playerIds.map((playerId) => getPlayerGames(playerId))).then((playersGamesResults) => {
    playersGamesResults.forEach((playersGamesResult, index) => {
      if (playersGamesResult.status === 'fulfilled') {
        queryClient.setQueryData(['players', playerIds[index], 'games'], playersGamesResult.value);
      }
    });
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
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
      .filter((gps) => gps.length);
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
      },
    ],
    dark: (typeof window !== 'undefined') ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  }
  return (
    <div className="md:grid md:grid-cols-3 md:gap-4 p-4 h-full flex flex-col">
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
      <div className="md:col-span-2 h-full">
        {players && playerIds.length && queries.some((q) => q.data) ? <>{gamePointsSeries.length ? <Chart options={options} /> : <p>No match found</p>}</> : null}
      </div>
    </div>
  );
}
