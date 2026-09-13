import { call } from '../auth/ApiService';
import { unwrapPage, unwrapData } from '../apiResponse';

/** GET /api/v1/artists — ArtistSearchItem */
export type ArtistSearchItem = {
  artistId: number;
  name: string;
  displayName: string;
  initial: string;
  selected: boolean;
};

/** GET /api/v1/me/favorite-artists */
export type FavoriteArtist = {
  artistId: number;
  name: string;
  initial: string;
};

/** PUT /api/v1/me/favorite-artists */
export type UpdateFavoriteArtistsRequest = {
  artistIds: number[];
  completeOnboarding?: boolean;
};

export type UpdateFavoriteArtistsResponse = {
  favoriteArtists: FavoriteArtist[];
  onboardingCompleted: boolean;
};

/** RecommandPage UI용 */
export type Artist = {
  id: number;
  initial: string;
  name: string;
  subName: string;
};

const toArtist = (item: ArtistSearchItem): Artist => ({
  id: item.artistId,
  initial: item.initial,
  name: item.name,
  subName: item.displayName !== item.name ? item.displayName : '',
});

/** 아티스트 목록/검색 */
export const searchArtists = async (params?: {
  q?: string;
  page?: number;
  size?: number;
}): Promise<Artist[]> => {
  const page = params?.page ?? 0;
  const size = params?.size ?? 100;
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const q = params?.q?.trim();
  if (q) query.set('q', q);

  const res = await call(`/api/v1/artists?${query.toString()}`, 'GET');
  const pageData = unwrapPage<ArtistSearchItem>(res);

  return pageData.items.map(toArtist);
};

/** 관심 아티스트 조회 */
export const getFavoriteArtists = async (): Promise<FavoriteArtist[]> => {
  const res = await call('/api/v1/me/favorite-artists', 'GET');
  const data = unwrapData<FavoriteArtist[]>(res);

  return data;
};

/** 관심 아티스트 저장 */
export const updateFavoriteArtists = async (
  artistIds: number[],
  options?: { completeOnboarding?: boolean },
): Promise<UpdateFavoriteArtistsResponse> => {
  const body: UpdateFavoriteArtistsRequest = {
    artistIds,
    completeOnboarding: options?.completeOnboarding,
  };

  const res = await call('/api/v1/me/favorite-artists', 'PUT', body);
  const data = unwrapData<UpdateFavoriteArtistsResponse>(res);

  return data;
};

/** 기존 import 호환용 */
export const getArtists = () => searchArtists();
