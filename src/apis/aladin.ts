import { call } from './auth/ApiService';
import type { ApiResponse, PageResponse } from './commontype';
import type { MediaType } from './collection/collection';

export type NewRelease = {
  newReleaseId: number;
  aladinItemId: number;
  title: string;
  artistName: string;
  mediaType: MediaType;
  releaseDate: string;
  priceSales: number;
  priceStandard: number;
  coverImageUrl: string;
  productUrl: string;
  categoryName: string;
  publisher: string;
};

export type UsedAlbum = {
  aladinItemId: number;
  title: string;
  artistName: string;
  mediaType: MediaType;
  usedPrice: number;
  originalPrice: number;
  coverImageUrl: string;
  productUrl: string;
  usedType: string;
  categoryName: string;
  publisher: string;
};

export type AlbumUsedInfo = {
  usedPrice: number;
  originalPrice: number;
  usedType: string;
  subInfo?: unknown;
};

export type AlbumReviewSummary = {
  averageRating: number;
  ratingCount: number;
  ratingDistribution: Record<string, number>;
};

export type AlbumDetail = {
  aladinItemId: number;
  title: string;
  artistName: string;
  mediaType: MediaType;
  releaseDate: string;
  coverImageUrl: string;
  productUrl: string;
  publisher: string;
  categoryName: string;
  priceSales: number;
  priceStandard: number;
  description?: string;
  isbn?: string;
  isbn13?: string;
  mallType?: string;
  stockStatus?: string;
  mileage?: number;
  salesPoint?: number;
  adult?: boolean;
  fixedPrice?: boolean;
  customerReviewRank?: number;
  subInfo?: unknown;
  used?: AlbumUsedInfo;
  reviewSummary?: AlbumReviewSummary;
};

export type AlbumSearchItem = {
  aladinItemId: number;
  title: string;
  artistName: string;
  mediaType: MediaType;
  releaseDate: string;
  coverImageUrl: string;
  productUrl: string;
  publisher: string;
  categoryName: string;
  priceSales: number;
  priceStandard: number;
};

export type AlbumSearchResponse = {
  limit: number;
  offset: number;
  total: number;
  items: AlbumSearchItem[];
};

export type AladinGenre =
  | 'INDIE_ROCK'
  | 'K_POP'
  | 'JAZZ'
  | 'CLASSIC'
  | 'POP'
  | 'HIPHOP_RNB'
  | 'ELECTRONIC'
  | 'OST'
  | 'NEW_AGE'
  | 'WORLD'
  | 'ETC';

export type AladinPageParams = {
  page?: number;
  size?: number;
  mediaType?: MediaType;
  genre?: AladinGenre;
};

export type AlbumSearchParams = {
  q: string;
  artist?: string;
  limit?: number;
  offset?: number;
};

const toQueryString = (params: AladinPageParams) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
};

const toSearchQueryString = (params: AlbumSearchParams) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
};

export const getNewReleases = async (
  params: AladinPageParams = {},
): Promise<PageResponse<NewRelease>> => {
  const query = toQueryString(params);
  const res = (await call(`/api/v1/aladin/new-releases${query}`, 'GET')) as ApiResponse<
    PageResponse<NewRelease>
  >;

  return res.data;
};

export const getUsedAlbums = async (
  params: AladinPageParams = {},
): Promise<PageResponse<UsedAlbum>> => {
  const query = toQueryString(params);
  const res = (await call(`/api/v1/aladin/used${query}`, 'GET')) as ApiResponse<
    PageResponse<UsedAlbum>
  >;

  return res.data;
};

export const getAlbumDetail = async (aladinItemId: number): Promise<AlbumDetail> => {
  const res = (await call(`/api/v1/aladin/${aladinItemId}`, 'GET')) as ApiResponse<AlbumDetail>;

  return res.data;
};

export const searchAlbums = async (params: AlbumSearchParams): Promise<AlbumSearchResponse> => {
  const query = toSearchQueryString(params);
  return (await call(`/api/v1/aladin${query}`, 'GET')) as AlbumSearchResponse;
};
