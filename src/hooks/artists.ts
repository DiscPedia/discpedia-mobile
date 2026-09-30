import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getFavoriteArtists, searchArtists, updateFavoriteArtists } from '@/apis/recommand/artist';

export const artistKeys = {
  search: (keyword: string) => ['artists', 'search', keyword] as const,
  favorites: ['me', 'favorite-artists'] as const,
};

export const useArtists = (keyword: string) =>
  useQuery({
    queryKey: artistKeys.search(keyword),
    queryFn: () => searchArtists({ q: keyword || undefined, size: 100 }),
    placeholderData: (previous) => previous,
  });

export const useFavoriteArtists = () =>
  useQuery({
    queryKey: artistKeys.favorites,
    queryFn: getFavoriteArtists,
  });

export const useUpdateFavoriteArtists = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      artistIds,
      completeOnboarding,
    }: {
      artistIds: number[];
      completeOnboarding?: boolean;
    }) => updateFavoriteArtists(artistIds, { completeOnboarding }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: artistKeys.favorites }),
  });
};
