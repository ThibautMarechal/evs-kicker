import { AxiosResponse } from 'axios';
import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { Api } from '../axios';
import { Game, GameIn } from '../typing';

export const useGames = (queryOptions?: UseQueryOptions<Game[]>) => {
  return useQuery({
    queryKey: ['games'],
    queryFn: () => Api.get<Game[]>('/api/games').then((r) => r.data),
    ...queryOptions,
  });
};

export const useGameDeletion = (mutationOptions?: UseMutationOptions<AxiosResponse<void>, unknown, string>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return Api.delete<void>(`/api/games/${id}`);
    },
    mutationKey: ['games'],
    ...mutationOptions,
    onError: (error, variables, context) => {
      console.error('Failed to delete game', error);
      mutationOptions?.onError?.(error, variables, context);
    },
    onSuccess: (response, variables, context) => {
      queryClient.setQueryData(['games'], (games?: Game[]) => games?.filter((g) => g.id !== variables) ?? []);
      mutationOptions?.onSuccess?.(response, variables, context);
    },
    onSettled: (response, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['games']
      });
      queryClient.invalidateQueries({
        queryKey: ['players']
      });
      mutationOptions?.onSettled?.(response, error, variables, context);
    },
    retry: false,
  });
};

export const useGameCreation = (mutationOptions?: UseMutationOptions<AxiosResponse<void>, unknown, GameIn>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ winners, loosers, loosersScore }: GameIn) => {
      return Api.post<void>(`/api/games`, {
        winners,
        loosers,
        loosersScore
      });
    },
    mutationKey: ['games'],
    ...mutationOptions,
    onError: (error, variables, context) => {
      console.error('Failed to create game', error);
      mutationOptions?.onError?.(error, variables, context);
    },
    onSettled: (response, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['games']
      });
      queryClient.invalidateQueries({
        queryKey: ['players']
      });
      mutationOptions?.onSettled?.(response, error, variables, context);
    },
    retry: false,
  });
};
