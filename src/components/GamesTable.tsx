import { useMemo } from 'react';
import cn from 'classnames';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { Game } from '../typing';
import { PlayerPreview } from '../components/PlayerPreview';
import { useGameDeletion } from '../react-query/games';
import dynamic from 'next/dynamic';

const DateRenderer = dynamic(() => import('./DateRenderer'), { ssr: false})

type Props = {
  games: Game[];
  canDelete?: boolean;
};

const gameColumnHerlper = createColumnHelper<Game>();

export const GamesTable = ({ games = [], canDelete = false }: Props) => {
  const { mutate: deleteGame, isPending: isDeleting } = useGameDeletion();
  const columns = useMemo(
    () => [
      gameColumnHerlper.accessor('date', {
        header: '',
        cell: ({ getValue}) => <DateRenderer value={getValue()}/>
      }),
      gameColumnHerlper.accessor('winners', {
        header: 'Winners',
        cell: ({ getValue }) => (
          <>
            {getValue().map((playerId) => (
              <span key={playerId} className="block md:inline mx-2 text-xs md:text-sm lg:text-base">
                <PlayerPreview id={playerId} />
              </span>
            ))}
          </>
        )
      }),
      gameColumnHerlper.accessor(({ loosersScore }) => `11 - ${loosersScore}`, {
        header: 'Score',
        cell: ({ getValue }) => <span style={{ whiteSpace: 'nowrap'}}>{getValue()}</span>
      }),
      gameColumnHerlper.accessor('loosers', {
        header: 'Loosers',
        cell: ({ getValue }) => (
          <>
            {getValue().map((playerId) => (
              <span key={playerId} className="block md:inline mx-2 text-xs md:text-sm lg:text-base">
                <PlayerPreview id={playerId} />
              </span>
            ))}
          </>
        )
      }),
      gameColumnHerlper.accessor('delta', {
        header: 'Elo delta'
      }),
      gameColumnHerlper.accessor('id', {
        header: '',
        cell: ({ row, getValue }) => canDelete && row.index === 0 ? (
          <button className={cn('btn btn-square btn-xs', { loading: isDeleting })} disabled={isDeleting} type="button" onClick={() => deleteGame(getValue())}>
            {!isDeleting ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : null}
          </button>
        ) : null,
      })
    ],
    [canDelete, deleteGame, isDeleting],
  );

  const { getHeaderGroups, getRowModel } = useReactTable({
      columns,
      data: games,
      getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full table-compact">
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody >
            {getRowModel().rows.map((row) => (
              <tr key={row.id} className="h-12">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
