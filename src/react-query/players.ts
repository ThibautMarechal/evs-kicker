import { useQueries, useQuery, UseQueryOptions } from 'react-query';
import { Api } from '../axios';
import { Game, Player } from '../typing';

export const usePlayers = (queryOptions?: UseQueryOptions<Player[]>) => {
  return useQuery(['players'], () => Api.get<Player[]>('/api/players').then((r) => r.data), queryOptions);
};

export const usePlayer = (id: string, queryOptions?: UseQueryOptions<Player>) => {
  return useQuery(['players', id], () => Api.get<Player>(`/api/players/${id}`).then((r) => r.data), queryOptions);
};

export const usePlayerGames = (id: string, queryOptions?: UseQueryOptions<Game[]>) => {
  return useQuery(['player', id, 'games'], () => Api.get<Game[]>(`/api/players/${id}/games`).then((r) => r.data), queryOptions);
};

export const usePlayersGames = (ids: string[]) => {
  return useQueries(
    ids.map((id) => ({
      queryKey: ['player', id, 'games'],
      queryFn: () => Api.get<Game[]>(`/api/players/${id}/games`).then((r) => r.data),
    })),
  );
};
