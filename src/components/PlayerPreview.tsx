import Gravatar from 'react-gravatar';
import Link from 'next/link';
import { usePlayer } from '../react-query/players';
import { Player } from '../typing';

type Props = {
  id: string;
  player?: Player;
};

export const PlayerPreview = ({ id, player: initialPlayer }: Props) => {
  const { data: player } = usePlayer(id, { initialData: initialPlayer, enabled: !!initialPlayer });
  return player ? (
    <div className="inline-flex items-center space-x-3">
      <div className="avatar">
        <div className="w-8 h-8 mask mask-squircle">
          <Gravatar email={player?.email} />
        </div>
      </div>
      <div>
        <div className="font-bold">
          <Link href={`/stats/${id}`}>{player?.username}</Link>
        </div>
      </div>
    </div>
  ) : null;
};
