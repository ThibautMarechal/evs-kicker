/* eslint-disable react/jsx-key */
import { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { Player } from '../typing';
import { PlayerPreview } from './PlayerPreview';

type Props = {
  players: Player[];
};

export const PlayersTable = ({ players = [] }: Props) => {
  const columns = useMemo<Column<Player>[]>(
    () => [
      {
        Header: '',
        accessor: 'id',
        Cell: ({ row }) => <PlayerPreview id={row.original.id} player={row.original} />,
      },
      {
        Header: 'Elo',
        accessor: 'elo',
      },
    ],
    [],
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: players ?? [],
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
