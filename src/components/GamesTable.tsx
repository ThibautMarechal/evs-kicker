/* eslint-disable react/jsx-key */
import { useMemo } from 'react';
import cn from 'classnames';
import { Column, useTable } from 'react-table';
import { Game } from '../typing';
import { PlayerPreview } from '../components/PlayerPreview';
import { useGameDeletion } from '../react-query/games';

type Props = {
  games: Game[];
  canDelete?: boolean;
};

export const GamesTable = ({ games = [], canDelete = false }: Props) => {
  const { mutate: deleteGame, isLoading: isDeleting } = useGameDeletion();
  const columns = useMemo<Column<Game>[]>(
    () => [
      {
        accessor: 'date',
        Cell: ({ value }) => Intl.DateTimeFormat([], { dateStyle: 'medium' }).format(new Date(value)),
      },
      {
        Header: 'Winners',
        accessor: 'winners',
        Cell: ({ value }) => (
          <>
            {value.map((playerId) => (
              <span className="block md:inline mx-2 text-xs md:text-sm lg:text-base">
                <PlayerPreview id={playerId} key={playerId} />
              </span>
            ))}
          </>
        ),
      },
      {
        Header: 'Loosers',
        accessor: 'loosers',
        Cell: ({ value }) => (
          <>
            {value.map((playerId) => (
              <span className="block md:inline mx-2 text-xs md:text-sm lg:text-base">
                <PlayerPreview id={playerId} key={playerId} />
              </span>
            ))}
          </>
        ),
      },
      {
        Header: 'Delta',
        accessor: 'delta',
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value: gameId, row }) =>
          canDelete && row.index === 0 ? (
            <button className={cn('btn btn-square btn-xs', { loading: isDeleting })} disabled={isDeleting} type="button" onClick={() => deleteGame(gameId)}>
              {!isDeleting ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : null}
            </button>
          ) : null,
        width: 50,
      },
    ],
    [canDelete, deleteGame, isDeleting],
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: games?.slice(0, 2) ?? [],
  });
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full table-compact" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <th {...column.getHeaderProps()} className={cn({ 'bg-opacity-0': i === 0 })}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows?.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
