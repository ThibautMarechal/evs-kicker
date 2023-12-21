import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { usePlayers } from '../../react-query/players';
import { Player } from '../../typing';
import PlayerSelect from '../../components/PlayerSelect';
import { PlayersTable } from '../../components/PlayersTable';
import { QueryClient,dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { getPlayers } from '../../firebase/players';
import { getPlayerGames } from '../../firebase/games';
import EloChart from '../../components/Chart';
import Link from 'next/link';

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
  const { data: players } = usePlayers()
  return (
    <div className="md:grid md:grid-cols-3 md:gap-4 p-4 h-full flex flex-col">
      <div>
        <Link href="/stats/all" className='m-2'>Go to all players stats ➡️</Link>
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
        {players && playerIds.length ? <EloChart playerIds={playerIds}/> : null}
      </div>
    </div>
  );
}
