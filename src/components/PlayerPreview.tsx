import Gravatar from 'react-gravatar';
import Link from 'next/link';
import { usePlayer } from '../react-query/players';
import { Player } from '../typing';

type Props = {
  id: string;
  player?: Player;
  linkable?: boolean
};

export const PlayerPreview = ({ id, player: initialPlayer, linkable }: Props) => {
  const { data: player } = usePlayer(id, { initialData: initialPlayer, enabled: !!initialPlayer });
  return player ? (
    <div className="inline-flex items-center space-x-3">
      <div className="avatar">
        <div className="w-4 md:w-6 h-4 md:h-6 mask mask-squircle">
          <Gravatar email={player?.email} />
        </div>
      </div>
      <div>
        <div className="font-bold">
          {linkable ? (
            <Link href={`/stats/${id}`}>{player?.username}</Link>
          ) : player?.username}
        </div>
      </div>
    </div>
  ) : null;
};
