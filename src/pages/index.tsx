import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GamesTable } from '../components/GamesTable';
import { PlayersTable } from '../components/PlayersTable';
import { getGames } from '../firebase/games';
import { getPlayers } from '../firebase/players';
import { useGames } from '../react-query/games';
import { usePlayers } from '../react-query/players';
import { Player } from '../typing';
import { useRef } from 'react';
import dynamic from 'next/dynamic';

const GameForm = dynamic(() => import('../components/GameForm').then(({ GameForm }) => ({ default: GameForm})), { ssr: false });

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({queryKey: ['games'], queryFn: getGames});
  await queryClient.prefetchQuery({queryKey: ['players'],  queryFn: getPlayers});
  const players = queryClient.getQueryData<Player[]>(['players']) ?? [];
  players.forEach((player) => {
    queryClient.setQueryData(['players', player.id], player);
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Home() {
  const { data: games } = useGames();
  const { data: players } = usePlayers();
  const GameFormDialogRef = useRef<HTMLDialogElement>(null)
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <button className='md:col-start-2 md:col-end-3 btn btn-primary' onClick={() => GameFormDialogRef.current?.showModal()}>New game</button>
        <div className="md:col-span-2">
          <GamesTable games={games ?? []} canDelete />
        </div>
        <div>
          <PlayersTable players={players ?? []} emoji />
        </div>
      </div>
      <dialog ref={GameFormDialogRef} className='modal'>
        <div className="modal-box grid gap-4">
          <h3>Create a new Game</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <GameForm dialogRef={GameFormDialogRef}/>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
