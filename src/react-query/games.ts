import { useQuery, UseQueryOptions } from 'react-query';
import { Api } from '../axios';
import { Game } from '../typing';

export const useGames = (queryOptions?: UseQueryOptions<Game[]>) => {
  return useQuery(['games'], () => Api.get<Game[]>('/api/games').then((r) => r.data), queryOptions);
};
