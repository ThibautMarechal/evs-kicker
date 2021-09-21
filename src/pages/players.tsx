import { useState } from 'react';
import cn from 'classnames';
import { PlayersTable } from '../components/PlayersTable';
import { usePlayerCreation, usePlayers } from '../react-query/players';

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
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="col-span-2">
        <PlayersTable players={players ?? []} />
      </div>
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
    </div>
  );
}
