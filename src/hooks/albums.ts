import { useQuery } from '@tanstack/react-query';

import { getNewReleases, getUsedAlbums, searchAlbums, type AladinPageParams } from '@/apis/aladin';

export const albumKeys = {
  newReleases: (params: AladinPageParams) => ['aladin', 'new-releases', params] as const,
  usedAlbums: (params: AladinPageParams) => ['aladin', 'used', params] as const,
  search: (keyword: string) => ['aladin', 'search', keyword] as const,
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

/** 검색어가 빈 문자열이면 요청하지 않는다 (웹 SearchPage와 같은 동작). */
export const useSearchAlbums = (keyword: string) =>
  useQuery({
    queryKey: albumKeys.search(keyword),
    queryFn: () => searchAlbums({ q: keyword, limit: 10, offset: 0 }),
    enabled: keyword.length > 0,
    placeholderData: (previous) => previous,
  });
