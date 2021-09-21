import { AxiosResponse } from 'axios';
import { useMutation, UseMutationOptions, useQueries, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { Api } from '../axios';
import { Game, Player, PlayerIn } from '../typing';

export const usePlayers = (queryOptions?: UseQueryOptions<Player[]>) => {
  return useQuery(['players'], () => Api.get<Player[]>('/api/players').then((r) => r.data), queryOptions);
};

export const usePlayer = (id: string, queryOptions?: UseQueryOptions<Player>) => {
  return useQuery(['players', id], () => Api.get<Player>(`/api/players/${id}`).then((r) => r.data), queryOptions);
};

export const usePlayerGames = (id: string, queryOptions?: UseQueryOptions<Game[]>) => {
  return useQuery(['players', id, 'games'], () => Api.get<Game[]>(`/api/players/${id}/games`).then((r) => r.data), queryOptions);
};

export const usePlayersGames = (ids: string[]) => {
  return useQueries(
    ids.map((id) => ({
      queryKey: ['players', id, 'games'],
      queryFn: () => Api.get<Game[]>(`/api/players/${id}/games`).then((r) => r.data),
    })),
  );
};

export const usePlayerCreation = (mutationOptions?: UseMutationOptions<AxiosResponse<void>, unknown, PlayerIn>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (player: PlayerIn) => Api.post(`/api/players/`, player).then((r) => r.data),
    mutationKey: ['players'],
    ...mutationOptions,
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries('players');
      mutationOptions?.onSettled?.(data, error, variables, context);
    },
  });
};
