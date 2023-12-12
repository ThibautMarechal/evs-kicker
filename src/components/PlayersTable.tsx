import { useMemo } from 'react';
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Player } from '../typing';
import { PlayerPreview } from './PlayerPreview';
import { flexRender } from '@tanstack/react-table';

type Props = {
  players: Player[];
  emoji?: boolean
};

function getWinRatio(player: Player){
  if(player.numberOfGames === 0){
    return 0;
  }
  return (player.wins / player.numberOfGames * 100)
}
function getLooseRatio(player: Player){
  if(player.numberOfGames === 0){
    return 0;
  }
  return 100 - getWinRatio(player);
}

const playerColumnHerlper = createColumnHelper<Player>();

export const PlayersTable = ({ players = [], emoji }: Props) => {
  const columns = useMemo(
    () => [
      emoji ?
      playerColumnHerlper.display({
        id: 'emoji',
        size: 10,
        cell: ({ row }) => row.index === 0 ? '🥇': row.index === 1 ? '🥈': row.index === 2 ? '🥉' :players.length - 1 === row.index ? '💩' : '',
      }) : null,
      playerColumnHerlper.display({
        id: 'gravatar',
        cell: ({ row }) => <PlayerPreview id={row.original.id} player={row.original} linkable />,
      }),
      playerColumnHerlper.accessor('elo',{
        header: 'Elo',
      }),
      playerColumnHerlper.display({
        id: 'games',
        header: 'Games',
        cell: ({ row: { original } }) => <span style={{ cursor: 'help' }} title={`Wins    : ${String(original.wins).padStart(3, ' ')} | ${(getWinRatio(original)).toFixed(0)} %\nLooses : ${String(original.looses).padStart(3, ' ')} | ${(getLooseRatio(original)).toFixed(0)} %`}>{original.numberOfGames}</span> 
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
