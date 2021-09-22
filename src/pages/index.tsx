import { GetServerSidePropsContext } from 'next';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { GameForm } from '../components/GameForm';
import { GamesTable } from '../components/GamesTable';
import { PlayersTable } from '../components/PlayersTable';
import { getGames } from '../firebase/games';
import { getPlayers } from '../firebase/players';
import { useGames } from '../react-query/games';
import { usePlayers } from '../react-query/players';
import { Player } from '../typing';

export async function getServerSideProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['games'], getGames);
  await queryClient.prefetchQuery(['players'], getPlayers);
  const players = queryClient.getQueryData<Player[]>(['players']) ?? [];
  players.forEach(player => {
    queryClient.setQueryData(['players', player.id], player);
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }, 
  }
}

export default function Home() {
  const { data: games } = useGames();
  const { data: players } = usePlayers();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <GameForm />
      <div className="md:col-span-2">
        <GamesTable games={games ?? []} canDelete />
      </div>
      <div>
        <PlayersTable players={players ?? []} />
      </div>
    </div>
  );
}
