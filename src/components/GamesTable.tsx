/* eslint-disable react/jsx-key */
import { useMemo } from 'react';
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
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => Intl.DateTimeFormat([], { dateStyle: 'medium' }).format(new Date(value)),
      },
      {
        Header: 'Winners',
        accessor: 'winners',
        Cell: ({ value }) => (
          <>
            {value.map((playerId) => (
              <span className="mx-2">
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
              <span className="mx-2">
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
            <>
              {isDeleting ? (
                <button disabled className="btn btn-sm btn-square loading" />
              ) : (
                <button className="btn btn-square btn-sm" type="button" onClick={() => deleteGame(gameId)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </>
          ) : null,
        width: 50,
      },
    ],
    [canDelete, deleteGame, isDeleting],
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: games ?? [],
  });
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full table-compact" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
