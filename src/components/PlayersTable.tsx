import { useMemo } from 'react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Player } from '../typing';
import { PlayerPreview } from './PlayerPreview';
import { flexRender } from '@tanstack/react-table';

type Props = {
  players: Player[];
};

const playerColumnHerlper = createColumnHelper<Player>();

export const PlayersTable = ({ players = [] }: Props) => {
  const columns = useMemo(
    () => [
      playerColumnHerlper.display({
        id: 'emoji',
        size: 10,
        cell: ({ row }) => row.index === 0 ? '👑' : players.length - 1 === row.index ? '💩' : '',
      }),
      playerColumnHerlper.display({
        id: 'gravatar',
        cell: ({ row }) => <PlayerPreview id={row.original.id} player={row.original} />,
      }),
      playerColumnHerlper.accessor('elo',{
        header: 'Elo',
      }),
      playerColumnHerlper.accessor('numberOfGames',{
        header: 'Games',
      }),
    ],
    [],
  );
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: players ?? [],
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
                  <th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize()}}>
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
