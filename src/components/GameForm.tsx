import cn from 'classnames';
import { RefObject, useState } from 'react';
import { useGameCreation } from '../react-query/games';
import { Player } from '../typing';
import PlayerSelect from './PlayerSelect';
import { calculateEloDelta } from '../utils/elo';
import { clamp } from '../utils/math';

export const GameForm = ({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement>}) => {
  const { mutate: createGame, isPending: isCreating } = useGameCreation({
    onSuccess: () => {
      setWinners([]);
      setLoosers([]);
      setLoosersScore('0');
    },
  });
  const [winners, setWinners] = useState<Player[]>([]);
  const [loosers, setLoosers] = useState<Player[]>([]);
  const [loosersScore, setLoosersScore] = useState('0');
  const loosersScoreNumber = Number.isNaN(Number.parseInt(loosersScore)) ? 0 : clamp(0, Number.parseInt(loosersScore), 10);
  const eloDelta = calculateEloDelta(winners.map(w =>w.elo), loosers.map(l => l.elo), loosersScoreNumber);
  const canCreate = winners.length > 0 && loosers.length > 0 && !isCreating
  return (
    <>
      <PlayerSelect value={winners} onChange={(v) => setWinners(v as Player[])} filterOption={(p) => !loosers.includes(p)} placeholder="Winners" maxSelection={2} menuPortalTarget={dialogRef.current} />
      <PlayerSelect value={loosers} onChange={(v) => setLoosers(v as Player[])} filterOption={(p) => !winners.includes(p)} placeholder="Loosers" maxSelection={2} menuPortalTarget={dialogRef.current} sortByEloDescending={false} />
      <input type="number" className='input input-sm input-bordered w-full' defaultValue={11} disabled />
      <input type="number" className='input input-sm input-bordered w-full' min={0} max={10} value={loosersScore} onChange={(e) => setLoosersScore(e.currentTarget.value)}/>
      <button
        disabled={!canCreate}
        className={cn('btn btn-sm btn-primary h-10', { loading: isCreating })}
        type="button"
        onClick={() => createGame({ winners: winners.map((w) => w.id), loosers: loosers.map((l) => l.id), loosersScore: loosersScoreNumber })}
      >
        Create {canCreate ? `(+${eloDelta})` : null}
      </button>
    </>
  );
};
