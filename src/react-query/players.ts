import { useQuery, UseQueryOptions } from 'react-query';
import { Api } from '../axios';
import { Player } from '../typing';

export const usePlayers = (queryOptions?: UseQueryOptions<Player[]>) => {
  return useQuery(['players'], () => Api.get<Player[]>('/api/players').then((r) => r.data), queryOptions);
};

export const usePlayer = (id: string, queryOptions?: UseQueryOptions<Player>) => {
  return useQuery(['players', id], () => Api.get<Player>(`/api/players/${id}`).then((r) => r.data), queryOptions);
};
