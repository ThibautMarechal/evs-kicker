import { useState } from 'react';
import cn from 'classnames';
import { PlayersTable } from '../components/PlayersTable';
import { usePlayerCreation, usePlayers } from '../react-query/players';
import { QueryClient } from 'react-query';
import { getPlayers } from '../firebase/players';
import { Player } from '../typing';
import { dehydrate } from 'react-query/hydration';

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['players'], getPlayers);
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
  const { data: players } = usePlayers();
  const { mutate: createPlayer, isLoading: isCreating } = usePlayerCreation({
    onSettled: () => {
      setUsername('');
      setEmail('');
    },
  });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <form
        onSubmit={(e) => {
          if (username && email && !isCreating) {
            e.preventDefault();
            createPlayer({ username, email });
          }
        }}
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input type="text" required placeholder="Username" className="input input-bordered" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" required placeholder="Email" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-control mt-4">
          <button disabled={isCreating} className={cn('btn btn-primary', { loading: isCreating })}>
            Add player
          </button>
        </div>
      </form>
      <div className="md:col-span-2">
        <PlayersTable players={players ?? []} />
      </div>
    </div>
  );
}
