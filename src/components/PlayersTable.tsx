import { useMemo } from 'react';
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Player } from '../typing';
import { PlayerPreview } from './PlayerPreview';
import { flexRender } from '@tanstack/react-table';

type Props = {
  players: Player[];
  emoji?: boolean
};

const playerColumnHerlper = createColumnHelper<Player>();

export const PlayersTable = ({ players = [], emoji }: Props) => {
  const columns = useMemo(
    () => [
      emoji ?
      playerColumnHerlper.display({
        id: 'emoji',
        size: 10,
        cell: ({ row }) => row.index === 0 ? '👑' : players.length - 1 === row.index ? '💩' : '',
      }) : null,
      playerColumnHerlper.display({
        id: 'gravatar',
        cell: ({ row }) => <PlayerPreview id={row.original.id} player={row.original} linkable />,
      }),
      playerColumnHerlper.accessor('elo',{
        header: 'Elo',
      }),
      playerColumnHerlper.accessor('numberOfGames',{
        header: 'Games',
      }),
    ].filter(Boolean) as Array<ColumnDef<Player, any>>,
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
