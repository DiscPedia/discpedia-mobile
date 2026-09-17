import { useQuery } from '@tanstack/react-query';

import { getNewReleases, getUsedAlbums, type AladinPageParams } from '@/apis/aladin';

export const albumKeys = {
  newReleases: (params: AladinPageParams) => ['aladin', 'new-releases', params] as const,
  usedAlbums: (params: AladinPageParams) => ['aladin', 'used', params] as const,
};

export const useNewReleases = (params: AladinPageParams = {}) =>
  useQuery({
    queryKey: albumKeys.newReleases(params),
    queryFn: () => getNewReleases(params),
  });

export const useUsedAlbums = (params: AladinPageParams = {}) =>
  useQuery({
    queryKey: albumKeys.usedAlbums(params),
    queryFn: () => getUsedAlbums(params),
  });
