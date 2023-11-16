import cn from 'classnames';
import { useState } from 'react';
import { useGameCreation } from '../react-query/games';
import { Player } from '../typing';
import PlayerSelect from './PlayerSelect';

export const GameForm = () => {
  const { mutate: createGame, isPending: isCreating } = useGameCreation({
    onSuccess: () => {
      setWinners([]);
      setLoosers([]);
    },
  });
  const [winners, setWinners] = useState<Player[]>([]);
  const [loosers, setLoosers] = useState<Player[]>([]);
  return (
    <>
      <PlayerSelect value={winners} onChange={(v) => setWinners(v as Player[])} filterOption={(p) => !loosers.includes(p)} placeholder="Winners" />
      <PlayerSelect value={loosers} onChange={(v) => setLoosers(v as Player[])} filterOption={(p) => !winners.includes(p)} placeholder="Loosers" />
      <button
        disabled={!winners.length || !loosers.length || isCreating}
        className={cn('btn btn-sm btn-primary h-10', { loading: isCreating })}
        type="button"
        onClick={() => createGame({ winners: winners.map((w) => w.id), loosers: loosers.map((l) => l.id) })}
      >
        New Game
      </button>
    </>
  );
};
