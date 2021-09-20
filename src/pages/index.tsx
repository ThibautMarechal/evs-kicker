import { GameForm } from '../components/GameForm';
import { GamesTable } from '../components/GamesTable';
import { PlayersTable } from '../components/PlayersTable';
import { useGames } from '../react-query/games';
import { usePlayers } from '../react-query/players';

export default function Home() {
  const { data: games } = useGames();
  const { data: players } = usePlayers();
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <GameForm />
      <div className="col-span-2">
        <GamesTable games={games ?? []} canDelete />
      </div>
      <div>
        <PlayersTable players={players ?? []} />
      </div>
    </div>
  );
}
