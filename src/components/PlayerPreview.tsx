import * as React from 'react';
import Gravatar from 'react-gravatar';
import { usePlayer } from '../react-query/players';

type Props = {
  id: string;
};

export const PlayerPreview = ({ id }: Props) => {
  const { data: player } = usePlayer(id);
  return player ? (
    <div className="inline-flex items-center space-x-3">
      <div className="avatar">
        <div className="w-8 h-8 mask mask-squircle">
          <Gravatar email={player?.email} />
        </div>
      </div>
      <div>
        <div className="font-bold">{player?.username}</div>
      </div>
    </div>
  ) : null;
};
